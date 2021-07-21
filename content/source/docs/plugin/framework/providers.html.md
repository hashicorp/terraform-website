---
layout: "extend"
page_title: "Plugin Development - Framework: Providers"
description: |-
  How to implement a provider in the next-generation framework.
---

# Providers

Providers are Terraform plugins that supply resources and data sources for
practitioners to use. They are implemented as binaries that the Terraform CLI
downloads, starts, and stops.
The provider is responsible for:
- providing a [gRPC](https://grpc.io) server that can correctly handle Terraform's handshake.
- providing Terraform with information about how to connect to the server.
responsibility is to provide a [gRPC](https://grpc.io) server that Terraform
can interact with and correctly handle Terraform's handshake, supplying the
information on how to connect to the server to Terraform.

## Implement Provider Interface
The next-generation framework allows any type that
fills an
[interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Provider)
to be a provider. We recommend that you define a `struct`
type to fill this interface.

The provider has four methods it needs to handle: `GetSchema`, `Configure`,
`GetResources`, and `GetDataSources`.

### GetSchema

The provider's job in the `GetSchema` method is to return a
[schema](/docs/plugin/framework/schemas.html) that describes the provider's
configuration block. This configuration block is used to offer practitioners
the opportunity to supply values to the provider and configure its behavior,
rather than needing to include those values in every resource and data source.
It is usually used to gather credentials, endpoints, and the other data used to
authenticate with the API, but it is not limited to those uses.

```tf
provider "example" {
  endpoint = "https://example.test/"
  api_token = "v3rYs3cr3tt0k3n"
}
```

Even if the provider does not want to accept user configuration, it must return
an empty schema.

The schema is meant to be immutable. It should not change at runtime, and
should consistently return the same value.

### Configure

The provider's job in the `Configure` method is to handle and store the values
the user entered in the provider's configuration block. This can mean creating
the API client, storing the data on the type that implements the provider
interface, or otherwise handling the values. This is the only time those values
will be made available to the provider, and so if the provider will want to
reference them from within a resource or data source, they need to be
persisted. This is why the recommendation is to use a struct to represent the
provider, as it can hold multiple values in a strongly-typed way.

#### Unknown Values

Not all values are guaranteed to be
[known](/docs/plugin/framework/types.html#unknown) when `Configure` is called.
For example, if a user interpolates a resource's unknown value into the block,
that value may show up as unknown depending on how the graph executes:

```tf
resource "example_foo" "bar" {
  id = 123
}

provider "example" {
  endpoint = "https://example.test/"
  api_token = example_foo.bar.name
}
```

In the example above, `example_foo.bar.name` is a read-only field on
`example_foo.bar` that won't be set until after `example_foo.bar` has been
applied. So the `Configure` method for the provider may report that the value
is unknown. It is up to the provider developer how this should be handled. If
some resources or data sources can be used without knowing that value, it may
be worthwhile to [emit a warning](/docs/plugin/framework/diagnostics.html) and
check whether the value is set in resources and data sources before attempting
to use it. If resources and data sources can't provide any functionality
without knowing that value, it's often better to [return an
error](/docs/plugin/framework/diagnostics.html), which will halt the apply.

## GetResources

The provider's job in the `GetResources` method is to return a map of [resource
types](/docs/plugin/framework/resources.html#resourcetype). The keys of the
map entries must be the name of the resource as it would appear in the
configuration, including the provider prefix.

The list of resources is meant to be immutable. It should not change at
runtime, and should consistently return the same values.

## GetDataSources

The provider's job in the `GetDataSources` method is to return a map of [data
source types](/docs/plugin/framework/data-sources.html#datasourcetype). The
keys of the map entries must be the name of the data source as it would appear
in the configuration, including the provider prefix.

The list of data sources is meant to be immutable. It should not change at
runtime, and should consistently return the same values.
