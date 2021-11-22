---
layout: "extend"
page_title: "Plugin Development - Framework: Validation"
description: |-
  How to validate configuration values using the provider development framework.
---

# Validation

Practitioners implementing Terraform configurations desire feedback surrounding the syntax, types, and acceptable values. This feedback, typically referred to as validation, is preferably given as early as possible before a configuration is applied. Terraform supports validation for values in provider, resource, and data source configurations. The framework supports returning [diagnostics](./diagnostics.html) feedback on all of these, offering the ability to specify validations on an attribute, provider-defined type, and the entire provider, resource, or data source schema.

~> **NOTE:** When implementing validation logic, configuration values may be [unknown](./types.html#unknown) based on the source of the value. Implementations must account for this case, typically by returning early without returning new diagnostics.

## Syntax and Basic Schema Validation

The [Terraform configuration language](https://www.terraform.io/docs/language/) is declarative and an implementation of [HashiCorp Configuration Language](https://github.com/hashicorp/hcl) (HCL). The Terraform CLI is responsible for reading and parsing configurations for validity, based on Terraform's concepts such as `resource` blocks and associated syntax. Basic validation of value type and behavior information, for example returning an error when a string value is given where a list value is expected or returning an error when a required attribute is missing from a configuration, is automatically handled by the Terraform CLI based on the provider, resource, or data source schema.

Any further validation provided by the framework occurs after these checks.

## Attribute Validation

It is common for provider implementations to introduce validation on attributes using the generic framework-defined types such as [`types.String`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/types#String). The [`tfsdk.Attribute` type `Validators` field](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Attribute.Validators) can be supplied with a list of validations and diagnostics will be returned from all validators. For example:

```go
// Typically within the tfsdk.Schema returned by GetSchema() for a provider,
// resource, or data source.
tfsdk.Attribute{
    // ... other Attribute configuration ...

    Validators: []AttributeValidators{
        // These are example validators
        stringLengthBetween(10, 256),
        stringRegularExpression(regexp.MustCompile(`^[a-z0-9]+$`)),
    },
}
```

All validators will always be run, regardless of whether previous validators returned an error or not.

-> The framework will implement or reference common use case attribute validations, such as string length, in the future.

### Creating Attribute Validators

To create an attribute validator, the [`tfsdk.AttributeValidator` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#AttributeValidator) must be satisfied. For example:

```go
type stringLengthBetweenValidator struct {
    Max int
    Min int
}

// Description returns a plain text description of the validator's behavior, suitable for a practitioner to understand its impact.
func (v stringLengthBetweenValidator) Description(ctx context.Context) string {
    return fmt.Sprintf("string length must be between %d and %d", v.Min, v.Max)
}

// MarkdownDescription returns a markdown formatted description of the validator's behavior, suitable for a practitioner to understand its impact.
func (v stringLengthBetweenValidator) MarkdownDescription(ctx context.Context) string {
    return fmt.Sprintf("string length must be between `%d` and `%d`", v.Min, v.Max)
}

// Validate runs the main validation logic of the validator, reading configuration data out of `req` and updating `resp` with diagnostics.
func (v stringLengthBetweenValidator) Validate(ctx context.Context, req tfsdk.ValidateAttributeRequest, resp *tfsdk.ValidateAttributeResponse) {
    // types.String must be the attr.Value produced by the attr.Type in the schema for this attribute
    // for generic validators, use
    // https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ConvertValue
    // to convert into a known type.
    var str types.String
    diags := tfsdk.ValueAs(ctx, req.AttributeConfig, &str)
    resp.Diagnostics.Append(diags...)
    if diags.HasError() {
        return
    }

    if str.Unknown || str.Null {
        return
    }

    strLen := len(str)

    if strLen < v.Min || strLen > v.Max {
        response.Diagnostics.AddAttributeError(
            request.AttributePath,
            "Invalid String Length",
            fmt.Sprintf("%s, got: %d", v.Description(ctx), strLen),
        )

        return
    }
}
```

Optionally and depending on the complexity, it may be desirable to also create a helper function to instantiate the validator. For example:

```go
func stringLengthBetween(minLength int, maxLength int) stringLengthBetweenValidator {
    return stringLengthBetweenValidator{
        Max: maxLength,
        Min: minLength,
    }
}
```

## Type Validation

Providers that contain common attribute values with consistent validation rules may wish to create a custom type to simplify schemas. When validation is implemented on a type, it is not necessary to declare the same validation on the attribute, although additional validations can be supplied in that manner. For example:

```go
// Typically within the tfsdk.Schema returned by GetSchema() for a provider,
// resource, or data source.
tfsdk.Attribute{
    // ... other Attribute configuration ...

    // This is an example type which implements its own validation
    Type: computeInstanceIdentifierType,

    // This is optional, example validation that is checked in addition
    // to any validation performed by the type
    Validators: []AttributeValidators{
        stringLengthBetween(10, 256),
    },
}
```

### Defining Type Validation

To support validation within a type, the [`attr.TypeWithValidate` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/attr#TypeWithValidate) must be satisfied. For example:

```go
// Other methods to implement the attr.Type interface are omitted for brevity
type computeInstanceIdentifierType struct {}

func (t computeInstanceIdentifierType) Validate(ctx context.Context, tfValue tftypes.Value, path *tftypes.AttributePath) diag.Diagnostics {
    var diags diag.Diagnostics

    if !tfValue.Type().Equal(tftypes.String) {
        diags.AddAttributeError(
            path,
            "Compute Instance Type Validation Error",
            fmt.Sprintf("Expected String value, received %T with value: %v", in, in),
        )
        return diags
    }

    if !tfValue.IsKnown() || tfValue.IsNull() {
        return diags
    }

    var value string
    err := tfValue.As(&value)

    if err != nil {
        diags.AddAttributeError(
            path,
            "Compute Instance Type Validation Error",
            fmt.Sprintf("Cannot convert value to string: %s", err),
        )
        return diags
    }

    if !strings.HasPrefix(value, "instance-") {
        diags.AddAttributeError(
            path,
            "Compute Instance Type Validation Error",
            fmt.Sprintf("Missing `instance-` prefix, got: %s", value),
        )
        return diags
    }
}
```

## Schema Validation

Provider, resource, and data source schemas also support validation across all attributes. This is helpful when checking values in multiple attributes, such as only accepting certain values in one attribute when another is a specific value.

### Creating Provider Schema Validation

There are two possible interface implementations that can be used for provider validation. Either or both can be implemented. This validation is performed in addition to any attribute and type validation within the provider schema.

The [`tfsdk.ProviderWithConfigValidators` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ProviderWithConfigValidators) follows a similar pattern to attribute validation and allows for a more declarative approach, which is helpful for consistent validators across multiple providers. Each of the validators must satify the [`tfsdk.ProviderConfigValidator` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ProviderConfigValidator). For example:

```go
// Other methods to implement the tfsdk.Provider interface are omitted for brevity
type exampleProvider struct {}

func (p exampleProvider) ConfigValidators(ctx context.Context) []tfsdk.ProviderConfigValidator {
    return []tfsdk.ProviderConfigValidator{
        /* ... */
    }
}
```

The [`tfsdk.ProviderWithValidateConfig` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ProviderWithValidateConfig) is more imperative in design and simplifies one-off functionality that typically applies to a single provider. For example:

```go
// Other methods to implement the tfsdk.Provider interface are omitted for brevity
type exampleProvider struct {}

func (p exampleProvider) ValidateConfig(ctx context.Context, req ValidateProviderConfigRequest, resp *ValidateProviderConfigResponse) {
    // Retrieve values via req.Config.Get() or req.Config.GetAttribute(),
    // then return any warnings or errors via resp.Diagnostics.
}
```

### Creating Resource Schema Validation

There are two possible interface implementations that can be used for resource validation. Either or both can be implemented. This validation is performed in addition to any attribute and type validation within the resource schema.

The [`tfsdk.ResourceWithConfigValidators` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ResourceWithConfigValidators) follows a similar pattern to attribute validation and allows for a more declarative approach, which is helpful for consistent validators across multiple resources. Each of the validators must satify the [`tfsdk.ResourceConfigValidator` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ResourceConfigValidator). For example:

```go
// Other methods to implement the tfsdk.Resource interface are omitted for brevity
type exampleResource struct {}

func (r exampleResource) ConfigValidators(ctx context.Context) []tfsdk.ResourceConfigValidator {
    return []tfsdk.ResourceConfigValidator{
        /* ... */
    }
}
```

The [`tfsdk.ResourceWithValidateConfig` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ResourceWithValidateConfig) is more imperative in design and simplifies one-off functionality that typically applies to a single resource. For example:

```go
// Other methods to implement the tfsdk.Resource interface are omitted for brevity
type exampleResource struct {}

func (r exampleResource) ValidateConfig(ctx context.Context, req ValidateResourceConfigRequest, resp *ValidateResourceConfigResponse) {
    // Retrieve values via req.Config.Get() or req.Config.GetAttribute(),
    // then return any warnings or errors via resp.Diagnostics.
}
```

### Creating Data Source Schema Validation

There are two possible interface implementations that can be used for data source validation. Either or both can be implemented. This validation is performed in addition to any attribute and type validation within the data source schema.

The [`tfsdk.DataSourceWithConfigValidators` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DataSourceWithConfigValidators) follows a similar pattern to attribute validation and allows for a more declarative approach, which is helpful for consistent validators across multiple data sources. Each of the validators must satify the [`tfsdk.DataSourceConfigValidator` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DataSourceConfigValidator). For example:

```go
// Other methods to implement the tfsdk.DataSource interface are omitted for brevity
type exampleDataSource struct {}

func (d exampleDataSource) ConfigValidators(ctx context.Context) []tfsdk.DataSourceConfigValidator {
    return []tfsdk.DataSourceConfigValidator{
        /* ... */
    }
}
```

The [`tfsdk.DataSourceWithValidateConfig` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DataSourceWithValidateConfig) is more imperative in design and simplifies one-off functionality that typically applies to a single data source. For example:

```go
// Other methods to implement the tfsdk.DataSource interface are omitted for brevity
type exampleDataSource struct {}

func (d exampleDataSource) ValidateConfig(ctx context.Context, req ValidateDataSourceConfigRequest, resp *ValidateDataSourceConfigResponse) {
    // Retrieve values via req.Config.Get() or req.Config.GetAttribute(),
    // then return any warnings or errors via resp.Diagnostics.
}
```
