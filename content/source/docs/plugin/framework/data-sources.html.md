---
layout: "extend"
page_title: "Plugin Development - Framework: Data Sources"
description: |-
  How to build data sources in the next-generation provider development
  framework.
---

# Data Sources

Terraform uses data sources as an abstraction over some external data that
practitioners can use in interpolation. Data sources, unlike resources, are not
considered managed or "owned" by Terraform&mdash;the configuration is not the
source of truth, there's no plan, and Terraform makes no attempt to modify the
API. The data source is just state that Terraform is tracking to reference, not
to manage.

The provider's job with data sources is to tell Terraform how to request that
data, and to convert the response into a format that practitioners can
interpolate.

The next-generation plugin development framework breaks this task into two
pieces: describing the archetype of a data source, and taking actions on a
specific instance of the data source.

## DataSourceType

The [`tfsdk.DataSourceType`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DataSourceType)
allows provider developers to describe the archetype of a data source. It is
where functionality related to the type of the data source, not a specific
instance of it, will be found. Provider developers should implement it for
every type of data source they want to support: disk images, compute instance
groups, access policies, etc.

The `GetSchema` method's job is to return a
[schema](/docs/plugin/framework/schemas.html) describing the shape of the data
source. This schema will define what fields are available in the data source's
configuration and state.

The `NewDataSource` method's job is to return a new instance of the data source
the data source type is describing. It needs to instantiate a new
[`tfsdk.DataSource`
implementation](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#DataSource)
that expects to operate on data with the structure defined in `GetSchema`. The
`NewDataSource` method is passed a [`tfsdk.Provider`
implementation](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Provider).
This is the [provider type](/docs/plugin/framework/providers.html) after its
`Configure` method was called. The `NewDataSource` method can type-assert on
this and inject it into the `DataSource`, allowing the `DataSource` to have
strongly-typed access to the configured API client or other provider
configuration data.

```go
type computeImageDataSourceType struct{}

func (c computeImageDataSourceType) GetSchema(_ context.Context) (schema.Schema, []*tfprotov6.Diagnostic) {
	return schema.Schema{
		Attributes: map[string]tfsdk.Attribute{
			"name": {
				Type: types.StringType,
				Required: true,
			},
		},
	}, nil
}

func (c computeImageDataSourceType) NewDataSource(_ context.Context, p tfsdk.Provider) (tfsdk.DataSource, []*tfprotov6.Diagnostic) {
	return computeImageDataSource{
		client: p.(*provider).client,
	}, nil
}
```

## Data Source

Where data source types are scoped to all instances of the data source in the
config and API, data sources are scoped to a single instance of the data source
type. Their job is, given a single data source's config values, to modify that
specific data source in the state. This is achieved through their `Read`
method.

### Read

The data source's job in the `Read` method is to update Terraform's state to
reflect the API data being described by the configuration. There is no plan or state
to work with in `Read`. Data sources should [retrieve the data they
need](/docs/plugin/framework/accessing-values.html) from the configuration
included in the
[`tfsdk.ReadDataSourceRequest`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#ReadDataSourceRequest).
They can then use the configured API client injected into the data source by the
data source type's `NewDataSource` method, and [write the results to the
state](/docs/plugin/framework/writing-state.html).

Because data sources aren't "owned" by Terraform, there is no plan to follow,
and so the provider can set any value they like in state. Terraform isn't the
source of truth for these values, so the concept of drift doesn't apply to data
sources.

## Adding to the Provider

When a data source is ready to be used, it needs to be advertised from the
provider before it's available to practitioners. To do this, add it to the
`GetDataSources` method on the
[provider](/docs/plugin/framework/providers.html).  The key must be the name of
the data source, including the provider prefix, and the value must be an
instance of the data source type.

```go
func (p *provider) GetDataSources(_ context.Context) (map[string]tfsdk.DataSourceType, []*tfprotov6.Diagnostic) {
	return map[string]tfsdk.DataSourceType{
		"example_compute_image": computeImageDataSourceType{},
	}, nil
}
```
