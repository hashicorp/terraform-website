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

## Primative Behaviors 

#### Optional
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    

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

#### Required
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    

**Restrictions:**

- Cannot be used if `Optional` is `true`
- Cannot be used if `Computed` is `true`
- Must be set if `Optional` is omitted **and** element is not `Computed`

Indicates that this element must be provided in the configuration. Omiting this
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

#### Default
**Data structure:**
[interface](https://golang.org/doc/effective_go.html#interfaces)    
**Value:**
any value of an elements `Type` for primitive types, or the type defined by
`Elem` for complex types.     
**Restrictions:**

- Cannot be used if `Required` is `true`
- Cannot be used with `DefaultFunc`

If `Default` is specified, that value that is used when this item is not set in the configuration. 

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

#### Computed
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    

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

#### ForceNew
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    

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
## Lexical Scoping

