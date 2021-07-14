---
layout: "extend"
page_title: "Building Terraform Providers - Schemas"
sidebar_current: "docs-extend-schemas"
description: |-
  Building Terraform Providers is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Terraform Schemas

Terraform Plugins are expressed using schemas to define attributes and their
behaviors, using a high level package exposed by Terraform Core named
[`schema`](https://github.com/hashicorp/terraform-plugin-sdk/tree/master/helper/schema).
Providers, Resources, and Provisioners all contains schemas, and Terraform Core
uses them to produce plan and apply executions based on the behaviors described. 

Below is an example `provider.go` file, detailing a hypothetical `ExampleProvider` implementation:

```go
package exampleprovider

import (
	"github.com/hashicorp/terraform-plugin-sdk/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/terraform"
)

// Provider returns a terraform.ResourceProvider.
func Provider() terraform.ResourceProvider {
	// Example Provider requires an API Token.
	// The Email is optional
	return &schema.Provider{
		Schema: map[string]*schema.Schema{
			"api_token": {
				Type:        schema.TypeString,
				Required:    true,
			},
			"email": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "",
			},
		},
	}
}
```

In this example we’re creating a `Provider` and setting it’s `schema`. This
schema is a collection of key value pairs of schema elements the attributes a
user can specify in their configuration. The keys are strings, and the values
are
[`schema.Schema`](https://github.com/hashicorp/terraform-plugin-sdk/blob/9f0df37a8fdb2627ae32db6ceaf7f036d89b6768/helper/schema/schema.go#L61)
structs that define the behavior. 

Schemas can be thought of as a type paired one or more properties that describe
it’s behavior. 

## Schema Types

Schema items must be defined using one of the builtin types, such as
`TypeString`, `TypeBool`, `TypeInt`, et. al. The type defines what is considered
valid input for a given schema item in a users configuration. 

See [Schema Types](/docs/extend/schemas/schema-types.html) for more
information on the types available to schemas.

## Schema Behaviors

Schema items can have various properties that can be combined to match their
behaviors represented by their API. Some items are **Required**, others
**Optional**, while others may be **Computed** such that they are useful to be
tracked in state, but cannot be configured by users.

See [Schema Behaviors](/docs/extend/schemas/schema-behaviors.html) for more
information on the properties a schema can have.
