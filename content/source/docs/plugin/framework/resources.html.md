---
layout: "extend"
page_title: "Plugin Development - Framework: Resources"
description: |-
  How to build resources in the next-generation provider development framework.
---

# Resources

Terraform uses resources as an abstraction over some piece of an API that the
practitioner wants Terraform to manage: an individual compute instance, disk,
access policy, or other API building block. Terraform is given ownership over
these when the practitioner defines them in their configuration, and that
configuration is understood to be the source of truth for the entire resource.
Deviation from it is understood to be unintentional and to be corrected.

Terraform's understanding of resources is limited, however. It assumes every
resource operates as a pure key/value store, with values getting returned
exactly as they were written, only one API call needed to update or return the
state of a resource, and every resource being able to be created, read,
updated, and deleted. This view of APIs is limited, and most APIs have at least
one resource that doesn't conform to it. That's why providers exist: to help
translate the API's reality to meet Terraform's expectations. The job of a
provider is, first and foremost, to be a translation layer.

The next-generation plugin development framework breaks this task into two
pieces: describing the archetype of a resource, and taking actions on a
specific instance of the resource.

## ResourceType

The [`tfsdk.ResourceType`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ResourceType)
allows provider developers to describe the archetype of a resource. It is where
functionality related to the type of the resource, not a specific instance of
it, will be found. Provider developers should implement it for every type of
resource they want to support: compute instances, disks, access policies, etc.

The `GetSchema` method's job is to return a
[schema](/docs/plugin/framework/schemas.html) describing the shape of the
resource. This schema will define what fields are available in the resource's
configuration and state.

The `NewResource` method's job is to return a new instance of the resource the
resource type is describing. This doesn't need to create the instance on the
API; it just needs to instantiate a new [`tfsdk.Resource`
implementation](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Resource)
that expects to operate on data with the structure defined in `GetSchema`. The
`NewResource` method is passed a [`tfsdk.Provider`
implementation](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Provider).
This is the [provider type](/docs/plugin/framework/providers.html) after its
`Configure` method was called. The `NewResource` method can type-assert on this
and inject it into the `Resource`, allowing the `Resource` to have
strongly-typed access to the configured API client or other provider
configuration data.

```go
type computeInstanceResourceType struct{}

func (c computeInstanceResourceType) GetSchema(_ context.Context) (schema.Schema, []*tfprotov6.Diagnostic) {
	return schema.Schema{
		Attributes: map[string]tfsdk.Attribute{
			"name": {
				Type: types.StringType,
				Required: true,
			},
		},
	}, nil
}

func (c computeInstanceResourceType) NewResource(_ context.Context, p tfsdk.Provider) (tfsdk.Resource, []*tfprotov6.Diagnostic) {
	return computeInstanceResource{
		client: p.(*provider).client,
	}, nil
}
```

## Resource

Where resource types are scoped to all instances of the resource in the config,
state, plan, and API, resources are scoped to a single instance of the resource
type. Their job is, given a single resource's config, state, and plan values,
to modify that specific resource in the API and in the state. This is achieved
through their `Create`, `Read`, `Update`, and `Delete` methods.

### Create

The resource's job in the `Create` method is to make the necessary API calls to
create the resource, and then to persist that resource's data into the
Terraform state.

This is usually accomplished by [reading the plan
data](/docs/plugin/framework/accessing-values.html) from the
[`tfsdk.CreateResourceRequest`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#CreateResourceRequest),
using the configured API client injected into the resource by the resource
type's `NewResource` method, and [writing to the
state](/docs/plugin/framework/writing-state.html).

It is very important that every known value in the plan ends up in state as a
byte-for-byte match, or Terraform will throw errors. The plan is the provider's
contract with Terraform: the provider can only change values that are
[unknown](/docs/plugin/framework/types.html#unknown) in the plan. It's also
very important that every unknown value in the plan gets a known, concrete
value when it's set in the state; the state can never hold any unknown values.

### Read

The resource's job in the `Read` method is to update Terraform's state to
reflect the latest state of the resource in the API. There is no plan or config
to work with in `Read`. Resources should [retrieve the data they
need](/docs/plugin/framework/accessing-values.html) from the current state
included in the
[`tfsdk.ReadResourceRequest`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ReadResourceRequest).
They can then use the configured API client injected into the resource by the
resource type's `NewResource` method, and [write the results to the
state](/docs/plugin/framework/writing-state.html).

Because `Read` is just updating Terraform's understanding of the API's current
state, there is no plan to follow, and so the provider can set any value they
like in state. However, providers should be mindful whether the values they're
setting in state represent "drift" or are semantically equivalent with values
currently in state. "Drift" is what we call it when the API's state have
deviated from the source of truth defined in the configuration file; this is
usually (but not always) the result of someone or something other than
Terraform modifying a resource Terraform "owns". When this happens, the value
should always be updated in state to reflect the drifted value.

But some values are semantically the same even if they are not a byte-for-byte
match. JSON strings that change the order of keys or change the
semantically-insignificant whitespace, for example, may not represent drift but
are just different representations of the same value. When this happens, the
_existing_ value should always be maintained in state; it should not be
replaced with the new representation the API is returning.

### Update

The resource's job in the `Update` method is to make the necessary API calls to
modify the existing resource to match the configuration, and then to persist
that resource's data into the Terraform state.

This is usually accomplished by [reading the plan
data](/docs/plugin/framework/accessing-values.html) from the
[`tfsdk.UpdateResourceRequest`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#UpdateResourceRequest),
using the configured API client injected into the resource by the resource
type's `NewResource` method, and [writing to the
state](/docs/plugin/framework/writing-state.html).

It is very important that every known value in the plan ends up in state as a
byte-for-byte match, or Terraform will throw errors. The plan is the provider's
contract with Terraform: the provider can only change values that are
[unknown](/docs/plugin/framework/types.html#unknown) in the plan. It's also
very important that every unknown value in the plan gets a known, concrete
value when it's set in the state; the state can never hold any unknown values.

### Delete

The resource's job in the `Delete` method is to make the necessary API calls to
destroy a resource, and then to remove that resource from the Terraform state.

This is usually accomplished by [reading the prior state
data](/docs/plugin/framework/accessing-values.html) from the
[`tfsdk.DeleteResourceRequest`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DeleteResourceRequest),
using the configured API client injected into the resource by the resource
type's `NewResource` method, and calling the [`State.RemoveResource`
method](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#State.RemoveResource)
on the state in the
[`tfsdk.DeleteResourceResponse`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DeleteResourceResponse).

## Adding to the Provider

When a resource is ready to be used, it needs to be advertised from the
provider before it's available to practitioners. To do this, add it to the
`GetResources` method on the [provider](/docs/plugin/framework/providers.html).
The key must be the name of the resource, including the provider prefix, and
the value must be an instance of the resource type.

```go
func (p *provider) GetResources(_ context.Context) (map[string]tfsdk.ResourceType, []*tfprotov6.Diagnostic) {
	return map[string]tfsdk.ResourceType{
		"example_compute_instance": computeInstanceResourceType{},
	}, nil
}
```
