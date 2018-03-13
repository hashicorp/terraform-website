---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-schemas-types"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---
# Schema Types
Almost every Terraform Plugin offers user configurable parameters, examples such
as a Provisioner `secret_key`, a Provider’s `region`, or a Resources `name`.
Each parameter is  defined in the items schema, which is a map of string names
to schema structs. 

In the below example implementation of a Resource you see parameters `uuid` and
`name` defined: 

```go
func resourceExampleResource() *schema.Resource {
	return &schema.Resource{
    // ... ///
		Schema: map[string]*schema.Schema{
			"uuid": {
				Type:     schema.TypeString,
				Computed: true,
			},

			"name": {
				Type:          schema.TypeString,
				Required:      true,
				ForceNew:      true,
				ValidateFunc:  validatName,
			},
   // ... ///
		},
	}
}
```

This type not only determines what data is expected and valid in configuring,
but also what type of data is returned when used in
[interpolation](/docs/configuration/interpolation.html).

See below for information on the possible types for schema parameters, and the
Go language data structures that represent them.

## Primitive Types

Primitive types are simple, singular values such as integers and booleans.

**TypeBool**  
Data structure: [bool](https://golang.org/pkg/builtin/#bool), ex: `true` or `false`

Schema example:

```go
"enabled": {
  Type:     schema.TypeBool,
},
```

Configuration example:

```hcl
resource "example_volume" "ex" {
  encrypted = true
}
```

**TypeInt**  
Data structure: [int](https://golang.org/pkg/builtin/#int), ex: `-9`, `0`, `1`, `2`, `9`

```
"cores": {
  Type:     schema.TypeInt,
},
```

Configuration example:

```
resource "example_compute_instance" "ex" {
  cores = 16
}
```

**TypeFloat**  
Data structure: [float64](https://golang.org/pkg/builtin/#float64), ex: `1.0`, `7.19009`

```
"price": {
Type:     schema.TypeFloat,
},
```

Configuration example:

```
resource "example_spot_request" "ex" {
  price = 0.37
}
```
TypeString
Data structure: string

Text values, double quoted

```
"name": {
Type:     schema.TypeString,
},
```

Configuration example:

```
resource "example_spot_request" "ex" {
  description = "Managed by Terraform"
}
```

Aggregate Types
Aggregate types form more complicated data types by combining primitive types. Aggregate types may define the types of data they contain by using the `Elem` property. The default data type is a string. See below for examples

TypeList 
Data type: `[]interface{}`

Used to represent an **ordered** collection of items. An example of ordered items would be network routing rules, where rules are examined in the order they are given until a match is found. 

```
"termination_policies": {
Type:     schema.TypeList,
Elem: &schema.Schema{
  Type: schema.TypeString,
},
},
```

Configuration example:

```
resource "example_compute_instance" "ex" {
  termination_policies = ["OldestInstance","ClosestToNextInstanceHour"]
}
```
TypeMap - 
Data type: `map[string]interface{}`

A key based map (also known as a dictionary) with string keys and unspecified `interface` values. 
TypeSet
Data type: `*schema.Set`

------
Notes:

Landing page for documenting Terraform Schemas Types

TypeBool - bool
TypeInt - int
TypeFloat - float64
TypeString - string
TypeList - []interface{}
TypeMap - map[string]interface{}
TypeSet - *schema.Set


. For information on the properties (such as  `Required` and `ValidateFunc`), see [Schema Properties]("/docs/extend/schemas/schema-properties.html").
-----

