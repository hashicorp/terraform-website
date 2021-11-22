---
layout: "extend"
page_title: "Plugin Development - Framework: Plan Modification"
description: |-
  How to modify plan values and behaviors using the provider development framework.
---

# Plan Modification

After [validation](./validation.html), but prior to applying configuration changes, Terraform generates a plan which describes the expected values and behaviors of those changes. An accurate plan helps practitioners decide on whether the configuration changes match against intended expectations. Providers are given an opportunity to tailor the plan to match the expected end state of applying the changes, such as filling in unknown values with expected known values or marking that a resource must be replaced to perform the changes. The framework refers to this support as plan modification, which can be performed against an attribute or for an entire resource.

## Concepts and Implicit Behaviors

Terraform and the framework support two types of plan modification on resources:

- Adjusting attribute values, such as filling in a known remote default value when a configuration is not present.
- Marking a resource as needing replacement, such as when an in-place update is not supported for a change.

When the provider receives a request to generate the plan for a resource change via the framework, the following occurs:

1. If the plan differs from the current resource state, any computed attributes that are null in the configuration are marked as unknown in the plan. This is intended to prevent unexpected Terraform errors, however as an enhancement providers can later fill in any values that may be known.
2. Attribute plan modifiers are executed.
3. Resource plan modifiers are executed.

More information about the underlying concepts and process that Terraform performs during plan and apply workflows can be found in the [Resource Instance Change Lifecycle document](https://github.com/hashicorp/terraform/blob/main/docs/resource-instance-change-lifecycle.md).

~> **NOTE:** Providers and data sources do not use the same planning mechanism as resources within Terraform. Neither support the concept of plan modification. Data sources should set any planned values in the `Read` method.

~> **NOTE:** When a change is applied (e.g. the `Resource` interface `Update` method is executed), all attribute state values must match their associated planned values or Terraform will generate a `Provider produced inconsistent result` error. Values can be marked as [unknown](./types.html#unknown) in the plan if the full expected value is not known upfront.

## Attribute Plan Modification

The [`tfsdk.Attribute` type `PlanModifiers` field](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Attribute.PlanModifiers) can be supplied with a list of plan modifiers for that particular attribute. For example:

```go
// Typically within the tfsdk.Schema returned by GetSchema() for a resource.
tfsdk.Attribute{
    // ... other Attribute configuration ...

    PlanModifiers: []AttributePlanModifiers{
        tfsdk.RequiresReplace(),
    },
}
```

If defined, plan modifiers are executed against the current attribute. If any nested attributes define plan modifiers, then those are executed afterwards. Any plan modifiers that return an error will prevent further modifiers of that attribute from executing, along with preventing the execution of any nested attribute plan modifiers.

### Common Use Case Attribute Plan Modifiers

The framework implements some common use case modifiers:

- [`tfsdk.RequiresReplace()`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#RequiresReplace): If the value of the attribute changes, in-place update is not possible and instead the resource should be replaced for the change to occur. See the Go documentation for full details on its behavior.
- [`tfsdk.RequiresReplaceIf()`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#RequiresReplaceIf): Similar to `tfsdk.RequiresReplace()`, however it also accepts provider-defined conditional logic. See the Go documentation for full details on its behavior.
- [`tfsdk.UseStateForUnknown()`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#UseStateForUnknown): Copies the prior state value, if not null. This is useful for reducing `(known after apply)` plan outputs for computed attributes which are known to not change over time.

### Creating Attribute Plan Modifiers

To create an attribute plan modifier, the [`tfsdk.AttributePlanModifier` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#AttributePlanModifier) must be satisfied. For example:

```go
// stringDefaultModifier is a plan modifier that sets a default value for a
// types.StringType attribute when it is not configured. The attribute must be
// marked as Optional and Computed. When setting the state during the resource
// Create, Read, or Update methods, this default value must also be included or
// the Terraform CLI will generate an error.
type stringDefaultModifier struct {
    Default string
}

// Description returns a plain text description of the validator's behavior, suitable for a practitioner to understand its impact.
func (m stringDefaultModifier) Description(ctx context.Context) string {
    return fmt.Sprintf("If value is not configured, defaults to %s", v.Default)
}

// MarkdownDescription returns a markdown formatted description of the validator's behavior, suitable for a practitioner to understand its impact.
func (m stringDefaultModifier) MarkdownDescription(ctx context.Context) string {
    return fmt.Sprintf("If value is not configured, defaults to `%s`", v.Default)
}

// Modify runs the logic of the plan modifier.
// Access to the configuration, plan, and state is available in `req`, while
// `resp` contains fields for updating the planned value, triggering resource
// replacement, and returning diagnostics.
func (m stringDefaultModifier) Modify(ctx context.Context, req tfsdk.ModifyAttributePlanRequest, resp *tfsdk.ModifyAttributePlanResponse) {
    // types.String must be the attr.Value produced by the attr.Type in the schema for this attribute
    // for generic plan modifiers, use
    // https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ConvertValue
    // to convert into a known type.
    var str types.String
    diags := tfsdk.ValueAs(ctx, req.AttributePlan, &str)
    resp.Diagnostics.Append(diags...)
    if diags.HasError() {
        return
    }

    if !str.Null {
        return
    }

    resp.AttributePlan = types.String{Value: m.Default}
}
```

Optionally and depending on the complexity, it may be desirable to also create a helper function to instantiate the plan modifier. For example:

```go
func stringDefault(defaultValue string) stringDefaultModifier {
    return stringDefaultModifier{
        Default: defaultValue,
    }
}
```

## Resource Plan Modification

Resource schemas also support plan modification across all attributes. This is helpful when working with logic that applies to the resource as a whole. The [`tfsdk.ResourceWithModifyPlan` interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ResourceWithModifyPlan) must be satisfied. For example:

```go
// Other methods to implement the tfsdk.Resource interface are omitted for brevity
type exampleResource struct {}

func (r exampleResource) ModifyPlan(ctx context.Context, req ModifyResourcePlanRequest, resp *ModifyResourcePlanResponse) {
    // Fill in logic.
}
```
