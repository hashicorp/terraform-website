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
		// ... //
		Schema: map[string]*schema.Schema{
			"uuid": {
				Type:     schema.TypeString,
				Computed: true,
			},

			"name": {
				Type:         schema.TypeString,
				Required:     true,
				ForceNew:     true,
				ValidateFunc: validatName,
			},
			// ... //
		},
	}
}
```

This type determines what data is expected and valid in configuring,
as well as the type of data returned when used in
[interpolation](/docs/configuration/interpolation.html).

See below for information on the possible types for schema parameters, and the
Go language data structures that represent them.

## Primitive Types

Primitive types are simple, singular values such as integers and booleans. 

#### TypeBool
**Data structure:** [bool](https://golang.org/pkg/builtin/#bool)    
**Example:** `true` or `false`

**Schema example:**

```go
"encrypted": {
  Type:     schema.TypeBool,
},
```

**Configuration example:**

```hcl
resource "example_volume" "ex" {
  encrypted = true
}
```

#### TypeInt
**Data structure:** [int](https://golang.org/pkg/builtin/#int)  
**Example:** `-9`, `0`, `1`, `2`, `9`

**Schema example:**

```go
"cores": {
  Type:     schema.TypeInt,
},
```

**Configuration example:**

```hcl
resource "example_compute_instance" "ex" {
  cores = 16
}
```

#### TypeFloat 
**Data structure:** [float64](https://golang.org/pkg/builtin/#float64)  
**Example:** `1.0`, `7.19009`

**Schema example:**

```go
"price": {
  Type:     schema.TypeFloat,
},
```

**Configuration example:**

```hcl
resource "example_spot_request" "ex" {
  price = 0.37
}
```

#### TypeString
**Data structure:** [string](https://golang.org/pkg/builtin/#string)  
**Example:** `"Hello, world!"`

**Schema example:**

```go
"name": {
  Type:     schema.TypeString,
},
```

**Configuration example:**

```hcl
resource "example_spot_request" "ex" {
  description = "Managed by Terraform"
}
```

#### Primitive state representations:

Primitives are stored in the [statefile](https://www.terraform.io/docs/state/index.html) as `"key": "value"` string pairs:

```json
"encrypted": "Managed by Terraform",
"cores": "false",
"price": "Z1UUXI7TYWEYXA",
"name": "tftesting.com",
```

## Aggregate Types

Aggregate types form more complicated data types by combining primitive types.
Aggregate types may define the types of elements they contain by using the
`Elem` property. If the `Elem` property is omitted, the default element data
type is a `string`. 

Aggregate types are stored in state as a `key.index` and `value` pair for each
element of the property, with a unique `index` appended to the `key` based on
the type. There is an additional `key.index` item included in the state that
tracks the number of items the property contains. Examples are provided with
each type below.

#### TypeMap
**Data structure:** [map](https://golang.org/doc/effective_go.html#maps): `map[string]interface{}`    
**Example:** `key = value`

A key based map (also known as a dictionary) with string keys and values defined
by the `Elem` property. 

**Schema example:**

```go
"tags": {
  Type:     schema.TypeMap,
},
```

**Configuration example:** 

```hcl
resource "example_compute_instance" "ex" {
  tags {
    env = "development"
    name = "example tag"
  }
}
```

**State representation:**  

`TypeMap` items are stored in state with the key as the index. The count of
items in a map is denoted by the `%` index:

```json
"tags.%": "2",
"tags.env": "development",
"tags.name": "example tag",
```

#### TypeList
**Data structure:** [Slice](https://golang.org/doc/effective_go.html#slices): `[]interface{}`  
**Example:** `[]interface{"2", "3", "4"}`

Used to represent an **ordered** collection of items, where the order the items
are presented can impact the behavior of the resource being modeled. An example
of ordered items would be network routing rules, where rules are examined in the
order they are given until a match is found. The items are all of the same type
defined by the `Elem` property. 

**Schema example:** 

```go
"termination_policies": {
  Type:     schema.TypeList,
  Elem: &schema.Schema{
    Type: schema.TypeString,
  },
},
```

**Configuration example:**

```hcl
resource "example_compute_instance" "ex" {
  termination_policies = ["OldestInstance","ClosestToNextInstanceHour"]
}
```

**State representation:**  

`TypeList` items are stored in state in a zero based index data structure. 

```json
"name_servers.#": "4",
"name_servers.0": "ns-1508.awsdns-60.org",
"name_servers.1": "ns-1956.awsdns-52.co.uk",
"name_servers.2": "ns-469.awsdns-58.com",
"name_servers.3": "ns-564.awsdns-06.net",
```

#### TypeSet
**Data structure:** [`*schema.Set`](https://github.com/hashicorp/terraform/blob/504d5ef233230984ccd378a6847fa8b9e32f6bee/helper/schema/set.go#L44)  
**Example:** `[]string{"one", "two", "three"}`

`TypeSet` implements set behavior and is used to represent an **unordered**
collection of items, meaning that their ordering specified does not need to be
consistent, and the ordering itself has no impact on the behavior of the
resource. 

The elements of a set can be any of the other types allowed by Terraform,
including another `schema`. Set items cannot be repeated. 

**Schema example:** 

```go
"ingress_rule": {
  Type:     schema.TypeSet,
  Elem: &schema.Resource{
    Schema: map[string]*schema.Schema{
      "from_port": {
        Type:     schema.TypeInt,
        Required: true,
      },
  
      "to_port": {
        Type:     schema.TypeInt,
        Required: true,
      },
  
      "protocol": {
        Type:      schema.TypeString,
        Required:  true,
        StateFunc: protocolStateFunc,
      },
  
      "cidr_blocks": {
        Type:     schema.TypeList,
        Optional: true,
        Elem: &schema.Schema{
          Type:         schema.TypeString,
        },
      },
    },
  },
}
```

**Configuration example:**

```hcl
resource "example_security_group" "ex" {
  name        = "sg_test"              
  description = "managed by Terraform" 
                                       
  ingress {                            
    protocol    = "tcp"                
    from_port   = 80                   
    to_port     = 9000                 
    cidr_blocks = ["10.0.0.0/8"]       
  }                                    
                                       
  ingress {                            
    protocol    = "tcp"                
    from_port   = 80                   
    to_port     = 8000                 
    cidr_blocks = ["0.0.0.0/0", "10.0.0
  }                                    
}                                      
```

**State representation:**  

`TypeSet` items are stored in state with an index value calculated by the hash
of the attributes of the set.

```json
"ingress.#": "2",
"ingress.1061987227.cidr_blocks.#": "1",
"ingress.1061987227.cidr_blocks.0": "10.0.0.0/8",
"ingress.1061987227.description": "",
"ingress.1061987227.from_port": "80",
"ingress.1061987227.ipv6_cidr_blocks.#": "0",
"ingress.1061987227.protocol": "tcp",
"ingress.1061987227.security_groups.#": "0",
"ingress.1061987227.self": "false",
"ingress.1061987227.to_port": "9000",
"ingress.493694946.cidr_blocks.#": "2",
"ingress.493694946.cidr_blocks.0": "0.0.0.0/0",
"ingress.493694946.cidr_blocks.1": "10.0.0.0/8",
"ingress.493694946.description": "",
"ingress.493694946.from_port": "80",
"ingress.493694946.ipv6_cidr_blocks.#": "0",
"ingress.493694946.protocol": "tcp",
"ingress.493694946.security_groups.#": "0",
"ingress.493694946.self": "false",
"ingress.493694946.to_port": "8000",
```

------

## Next Steps 

Checkout [Schema Behaviors](/docs/extend/schemas/schema-behaviors.html) to learn
Checkout [Schema Behaviors](/docs/extend/schemas/schema-behaviors.html) to learn
how to customize each schema elements behavior.
