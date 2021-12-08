---
layout: "extend"
page_title: "Plugin Development - Framework: Acceptance Tests"
description: |-
  How to write acceptance tests for providers built on the framework. Acceptance tests imitate applying configuration files.
---

# Acceptance Tests

The framework for Terraform provider development currently relies on the
[acceptance test framework](/docs/extend/testing/acceptance-tests/index.html)
shipped with SDKv2. You will write and run tests with the same steps, and they
are otherwise indistinguishable from testing against SDKv2.  The major
difference is in how the provider is specified in [the `TestCase`
struct](/docs/extend/testing/acceptance-tests/testcase.html).

## Specify Providers

In SDKv2, providers were specified by using the [`Providers` property of the
`resource.TestCase`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/resource#TestCase.Providers) to supply a map of
[`schema.Provider`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema/#Provider)s.

For the framework, the same pattern applies, but instead use the
[`ProtoV6ProviderFactories` property of
`resource.TestCase`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/resource#TestCase.ProtoV6ProviderFactories)
to supply a map of functions that return a
[`tfprotov6.ProviderServer`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tfprotov6/#ProviderServer).
To get a `tfprotov6.ProviderServer` from a
[`tfsdk.Provider`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Provider),
you need to use the
[`tfsdk.NewProtocol6Server`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#NewProtocol6Server)
helper. For example:

```go
resource.Test(t, resource.TestCase{
	PreCheck: func() { testAccPreCheck(t) },
	ProtoV6ProviderFactories: map[string]func() (tfprotov6.ProviderServer, error) {
		"example_provider": func() (tfprotov6.ProviderServer, error) {
			// newProvider is your function that returns a
			// tfsdk.Provider implementation
			return tfsdk.NewProtocol6Server(newProvider()), nil
		},
	},
	CheckDestroy: testAccCheckExampleResourceDestroy,
	Steps: []resource.TestStep{
		{
			Config: testAccExampleResource,
			Check: testAccCheckExampleResourceExists,
		},
	},
})
```

See the [`TestCase`
documentation](/docs/extend/testing/acceptance-tests/testcase.html) for more
information on using `resource.TestCase`.

-> **Note:** We anticipate releasing an improved testing experience for the
framework in the near future.
