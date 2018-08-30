---
layout: "extend"
page_title: "Extending Terraform - Schema Behaviors"
sidebar_current: "docs-extend-schemas-behaviors"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Schema Behaviors

Schema fields that can have an effect at plan or apply time are collectively
referred to as "Behavioral fields", or an elements _behaviors_. These fields are
often combined in several ways to create different behaviors, depending on the
need of the element in question, typically customized to match the behavior of a
cloud service API. For example, at time of writing AWS Launch Configurations
cannot be updated through the AWS API. As a result all of the schema elements in
the corresponding Terraform Provider resource `aws_launch_configuration` are
marked as `ForceNew: true`. This behavior instructs Terraform to first destroy
and then recreate the resource if any of the attributes change in the
configuration, as opposed to trying to update the existing resource.

## Primitive Behaviors 
### Optional
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    
**Values:** `true` or `false`  
**Restrictions:**

- Cannot be used if `Required` is `true`
- Must be set if `Required` is omitted **and** element is not `Computed`

Indicates that this element is optional to include in the configuration. Note
that `Optional` does not itself establish a default value. See [Default]()
below.

**Schema example:**

```go
"encrypted": {
  Type:     schema.TypeBool,
  Optional: true,
},
```

**Configuration example:**

```hcl
resource "example_volume" "ex" {
  encrypted = true
}
```

### Required
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    
**Values:** `true` or `false`  
**Restrictions:**  

- Cannot be used if `Optional` is `true`
- Cannot be used if `Computed` is `true`
- Must be set if `Optional` is omitted **and** element is not `Computed`

Indicates that this element must be provided in the configuration. Omitting this
attribute from configuration, or later removing it, will result in a
[plan-time]() error.

**Schema example:**

```go
"name": {
  Type:     schema.TypeString,
  Required: true,
},
```

**Configuration example:**

```hcl
resource "example_volume" "ex" {
  name = "swap volume"
}
```

### Default
**Data structure:** [interface](https://golang.org/doc/effective_go.html#interfaces)    
**Value:** any value of an elements `Type` for primitive types, or the type
defined by `Elem` for complex types.  
**Restrictions:**  

- Cannot be used if `Required` is `true`
- Cannot be used with `DefaultFunc`

If `Default` is specified, that value that is used when this item is not set in
the configuration. 

**Schema example:**

```go
"encrypted": {
  Type:     schema.TypeBool,
  Optional: true,
  Default: false,
},
```

**Configuration example (specified):**

```hcl
resource "example_volume" "ex" {
  name = "swap volume"
  encrypted = true
}
```

**Configuration example (omitted):**

```hcl
resource "example_volume" "ex" {
  name = "swap volume"
  # encrypted receives its default value, false
}
```

### Computed
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    
**Value:** `true` or `false`    
**Restrictions:**  

- Cannot be used when `Required` is `true`
- Cannot be used when `Default` is `specified`
- Cannot be used with `DefaultFunc`

`Computed` is often used to represent values that are not user configurable or
can not be known at time of `terraform plan` or `apply`, such as date of
creation or a service specific UUID. `Computed` can be combined with other
attributes to achieve specific behaviors, and can be used as output for
interpolation into other resources

**Schema example:**

```go
"uuid": {
  Type:     schema.TypeString,
  Computed: true,
},
```

**Configuration example:**

```hcl
resource "example_volume" "ex" {
  name = "swap volume"
  encrypted = true
}

output "volume_uuid" {
  value = "${example_volume.ex.uuid}"
}
```

### ForceNew
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    
**Value:** `true` or `false`  

`ForceNew` indicates that any change in this field requires the resource to be
destroyed and recreated. 

**Schema example:**

```go
"base_image": {
  Type:     schema.TypeString,
  Required: true,
  ForceNew: true,
},
```

**Configuration example:**

```hcl
resource "example_instance" "ex" {
  name = "bastion host"
  base_image = "ubuntu_17.10" 
}
```


## Function Behaviors
### DiffSuppressFunc
**Data structure:**
[SchemaDiffSuppressFunc](https://github.com/hashicorp/terraform/blob/ead558261d5e322f1f1e90c8e74834ba9215f24e/helper/schema/schema.go#L202)    

When provided `DiffSuppressFunc` will be used by Terraform to calculate the diff
of this field. Common use cases are capitalization differences in string names,
or logical equivalences in JSON values. 

**Schema example:**

```go
"base_image": {
  Type:     schema.TypeString,
  Required: true,
  ForceNew: true,
  // Suppress the diff shown if the base_image name are equal when both compared in lower case.
  DiffSuppressFunc: func(k, old, new string, d *schema.ResourceData) bool {
    if strings.ToLower(old) == strings.ToLower(new) {
      return true 
    }
    return false
  },
},
```

**Configuration example:**

Here we assume the service API accepts capitalizations of the `base_image` name
and converts it to a lowercase string. The API then returns the lower case value
in it’s responses. 

```hcl
resource "example_instance" "ex" {
  name = "bastion host"
  base_image = "UBunTu_17.10" 
}
```

### DefaultFunc
**Data structure:**
[SchemaDefaultFunc](https://github.com/hashicorp/terraform/blob/ead558261d5e322f1f1e90c8e74834ba9215f24e/helper/schema/schema.go#L209)  
**Restrictions:**  

- Cannot be used if `Default` is specified

When `DefaultFunc` will be used to compute a dynamic default for this element.
The return value of this function should be "stable", such that it is uncommon
to return different values in subsequent plans without any other changes being
made, to avoid unnecessary diffs in `terraform plan`. 

`DefaultFunc` is most commonly used in Provider schemas, allows elements to have
a default read from the environment. 

**Schema example:**

In this example, Terraform will attempt to read `region` from the environment if
it is omitted from configuration. If it’s not found in the environment, a
default value of `us-west` is given.

```go
"region": {
  Type:     schema.TypeString,
  Required: true,
  DefaultFunc: func() (interface{}, error) {
    if v := os.Getenv("PROVIDER_REGION"); v != "" {
      return v, nil
    }

    return "us-west", nil
  },
},
```

**Configuration example (provided):**

```hcl
provider "example" {
  api_key = "somesecretkey"
  region = "us-east"
}
```


**Configuration example (default func with `PROVIDER_REGION` set to `us-west` in
the environment):**

```hcl
provider "example" {
  api_key = "somesecretkey"
  # region is "us-west"
}
```

**Configuration example (default func with `PROVIDER_REGION` unset in the
environment):**

```hcl
provider "example" {
  api_key = "somesecretkey"
  # region is "us-east" 
}
```

### StateFunc
**Data structure:** [SchemaStateFunc](https://github.com/hashicorp/terraform/blob/a20dbb43782ade816baaeffa8033da0027ee6b26/helper/schema/schema.go#L245)    

`SchemaStateFunc` is a function used to convert the value of this element to a string to be stored in the state. 


**Schema example:**

In this example, the `StateFunc` converts a string value to all lower case. 

```go
"name": &schema.Schema{
  Type:     schema.TypeString,
  ForceNew: true,
  Required: true,
  StateFunc: func(val interface{}) string {
    return strings.ToLower(val.(string))
  },
},
```

**Configuration example (provided):**

```hcl
resource "example" "ex_instance" {
  name = "SomeValueCASEinsensitive"
}
```

Value in statefile: 

```json
"name": "somevaluecaseinsensitive"
```

### ValidateFunc
**Data structure:** [SchemaValidateFunc](https://github.com/hashicorp/terraform/blob/a20dbb43782ade816baaeffa8033da0027ee6b26/helper/schema/schema.go#L249)   
**Restrictions:** 

- Only works with primitive types  

`SchemaValidateFunc` is a function used to validate the value of a primitive type. Common use cases include ensuring an integer falls within a range or a string value is present in a list of valid options. The function returns two slices, the first for warnings, the second is errors which can be used to catch multiple invalid cases. Terraform will only halt execution if an error is returned. Returning warnings will warn the user but the data provided is considered valid.

Terraform includes a number of validators for use in plugins in the validation package. A full list can be found here: https://godoc.org/github.com/hashicorp/terraform/helper/validation 

**Schema example:**

In this example, the `ValidateFunc` ensures the integer provider is a value between 0 and 10.

```go
"amount": &schema.Schema{
 Type:     schema.TypeInt,
 Required: true,
 ValidateFunc: func(val interface{}, key string) (warns []string, errs []error) {
   v := val.(int)
   if v < 0 || v > 10 {
     errs = append(errs, fmt.Errorf("%q must be between 0 and 10 inclusive, got: %d", key, v))
   }
   return
 },
},
```

**Configuration example:**

```hcl
resource "example" "ex_instance" {
 amount = "-1"
}
```
