---
layout: "extend"
page_title: "Plugin Development - Framework: Acceptance Tests"
description: |-
  How to write acceptance tests for providers built on the framework.
---

# Acceptance Tests

The framework for Terraform provider development currently relies on the
[acceptance test framework](/docs/extend/testing/acceptance-tests/index.html)
shipped with version 2 of the SDK. Tests are written and run with the same
steps, and are otherwise indistinguishable from testing against version 2 of
the SDK. The major difference is in how the provider is specified in [the
`TestCase` struct](/docs/extend/testing/acceptance-tests/testcase.html).

In version 2 of the SDK, providers were specified by using the [`Providers`
property of the
`resource.TestCase`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/resource#TestCase.Providers)
to supply a map of
[`schema.Provider`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema/#Provider)s.

For the framework, the same pattern applies, but instead the
[`ProtoV6ProviderFactories` property of
`resource.TestCase`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/resource#TestCase.ProtoV6ProviderFactories)
to supply a map of functions that return a
[`tfprotov6.ProviderServer`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tfprotov6/#ProviderServer).
To get a `tfprotov6.ProviderServer` from a
[`tfsdk.Provider`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#Provider),
you'll need to use the
[`tfsdk.NewProtocol6Server`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/tfsdk#NewProtocol6Server)
helper. For example:

```go
resource.Test(t, resource.TestCase{
	PreCheck: func() { testAccPreCheck(t) },
	ProtoV6ProviderFactories: map[string]func() tfprotov6.ProviderServer{
		"example_provider": func() tfprotov6.ProviderServer{
			// newProvider is your function that returns a
			// tfsdk.Provider implementation
			return tfsdk.NewProtocol6Server(newProvider())
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

We anticipate releasing an improved testing experience for the framework in the
near future.
