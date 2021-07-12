---
layout: "extend"
page_title: "Building Terraform Providers - Acceptance Testing"
sidebar_current: "docs-extend-testing-acceptance"
description: |-
  Building Terraform Providers is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Acceptance Tests

In order to deliver on our promise to be safe and predictable, we need to be
able to easily and routinely verify that Terraform Plugins produce the expected
outcome. The most common usage of an acceptance test is in Terraform Providers,
where each Resource is tested with configuration files and the resulting
infrastructure is verified. Terraform includes a framework for constructing
acceptance tests that imitate the execution of one or more steps of applying one
or more configuration files, allowing multiple scenarios to be tested.


~> **Note**: Apart from the _Testing in v1.x of the SDK_ section below, information in this page covers version 2.x of the Plugin SDK. While the public API is largely unchanged between versions, the internal architecture and implementation of the testing framework is very different.


Terraform acceptance tests use real Terraform configurations to exercise the
code in real plan, apply, refresh, and destroy life cycles. When run from the
root of a Terraform Provider codebase, Terraform’s testing framework compiles
the current provider in-memory and executes the provided configuration in
developer defined steps, creating infrastructure along the way. At the
conclusion of all the steps, Terraform automatically destroys the
infrastructure. It’s important to note that during development, it’s possible
for Terraform to leave orphaned or “dangling” resources behind, depending on the
correctness of the code in development. The testing framework provides means to
validate all resources are destroyed, alerting developers if any fail to
destroy. It is the developer's responsibility to clean up any dangling resources
left over from testing and development. 

~> **Acceptance tests require `terraform` version 0.12.26 or above.**

## How Acceptance Tests Work

Provider acceptance tests run real Terraform commands using a Terraform CLI binary, approximating as closely as possible the experience of using the provider under test with Terraform in production. We refer to this functionality as the "binary test driver".

Terraform Core and Terraform Plugins act as gRPC client and server, implemented using HashiCorp's [go-plugin](https://github.com/hashicorp/go-plugin) system (see the [RPC Plugin Model](https://github.com/hashicorp/terraform/tree/master/docs/plugin-protocol) section of the Terraform Core documentation).  When `go test` is run, the SDK's acceptance test framework starts a plugin server in the same process as the Go test framework. This plugin server runs for the duration of the test case, and each Terraform command (`terraform plan`, `terraform apply`, etc) creates a client that reattaches to this server.

Real-world Terraform usage requires a config file and Terraform working directory on the local filesystem. The helper library `github.com/hashicorp/terraform-plugin-test` is used to manage temporary directories and files during test runs. This library is not intended for use directly by provider developers.

While the test framework provides a reasonable simulation of real-world usage, there are some differences, the major one being in the lifecycle of the plugin gRPC server. During normal Terraform operation, the plugin server starts and stops once per graph walk, of which there may be several during one Terraform command. The acceptance test framework, however, maintains one plugin gRPC server for the duration of each test case. In theory, it is possible for providers to carry internal state between operations during tests - but providers would have to go out of their way (and the SDK's public API) to do this.

## Testing in v1.x of the SDK

From version 1.0.0 to 1.6.0 of the SDK, the only acceptance test driver available is the legacy test driver, which embeds part of the Terraform Core codebase inside the SDK. This duplicated code cannot be said to represent the production behaviour of any given version of Terraform.

In version 1.7.0 of the SDK, an initial version of the binary test driver described above was added to the SDK. The internal architecture of this test driver differs from that in v2.x, but it provides similar functionality, running real Terraform CLI commands during acceptance tests. From version 1.7.0 onwards until the legacy test driver is removed in v2.0.0, provider developers can choose to use the legacy test driver or the binary test driver.

In order to use the binary test driver in v1.7.0+, you should add code similar to the following to `provider_test.go`:

```go
func TestMain(m *testing.M) {
  acctest.UseBinaryDriver("provider_name", Provider)
  resource.TestMain(m)
}
```

For more details, please see the package documentation for the `github.com/hashicorp/terraform-plugin-sdk/acctest` package.


## Test files

Terraform follows many of the Go programming language conventions with regards
to testing, with both acceptance tests and unit tests being placed in a file
that matches the file under test, with an added `_test.go` suffix. Here’s an
example file structure:

```
terraform-plugin-example/
├── provider.go
├── provider_test.go
├── example/
│   ├── resource_example_compute.go
│   ├── resource_example_compute_test.go
```

To create an acceptance test in the example `resource_example_compute_test.go`
file, the function name must begin with `TestAccXxx`, and have the following
signature:

    func TestAccXxx(*testing.T)

## Running Acceptance Tests

A `terraform` binary of version 0.12.26 or above must be available on the local system for the acceptance test driver to run, either on the system `$PATH` or supplied via the `TF_ACC_TERRAFORM_PATH` environment variable described below. If you are running acceptance tests in a CI environment, we recommend that you download and install Terraform with a prior build step. 

Terraform requires an environment variable `TF_ACC` be set in order to run
acceptance tests. This is by design, and intended to prevent developers from
incurring unintended charges when running tests. The easiest way to run
acceptance tests is to use the built in `make` step `testacc`, which explicitly
sets the `TF_ACC=true` value for you. Example:

    $ make testacc 

**It’s important to reiterate that acceptance tests create actual cloud resources**,
possibly incurring expenses which are the responsibility of the user running
the tests. Creating real infrastructure in
tests verifies the described behavior of Terraform Plugins in real world use
cases against the actual APIs, and verifies both local state and remote values
match. Acceptance tests require a network connection and often require
credentials to access an account for the given API.

~> Note: When developing or testing Terraform plugins, we highly recommend
running acceptance tests with an account dedicated to testing. This ensures no
infrastructure is created or destroyed in error during development or validation
of any Provider Resources in any environment that cannot be completely and
safely destroyed.

## Environment Variables

A number of environment variables are available to control aspects of acceptance test execution.

 - `TF_ACC_TERRAFORM_PATH`: Used to specify the path to a Terraform binary on the local filesystem to be used during testing.
 - `TF_ACC_LOG_PATH`: Used to specify a path for Terraform logs during testing.
 - `TF_ACC_TEMP_DIR`: Used to specify a temporary directory used by the test driver. If this is not set, the default system temporary directory (as identified by `os.TempDir()`) will be used.
 - `TF_ACC_PROVIDER_NAMESPACE`: Used to control the namespace of the provider under test; only needed if config specifies a namespace for provider source.
 - `TF_ACC_PROVIDER_HOST`: Used to control the host of the provider under test; only needed if config specifies a host for provider source.
 - `TF_ACC_STATE_LINEAGE`: Set to "1" to enable state lineage debug logs, which are normally suppressed during acceptance testing.
 
## Troubleshooting
 
This section lists common errors encountered during testing.

### Unrecognized remote plugin message

```
terraform failed: exit status 1
        
        stderr:
        
        Error: Failed to instantiate provider "random" to obtain schema: Unrecognized remote plugin message: --- FAIL: TestAccResourceID (4.28s)
        
        This usually means that the plugin is either invalid or simply
        needs to be recompiled to support the latest protocol.
```

This error indicates that the provider server could not connect to Terraform Core. Verify that the output of `terraform version` is v0.12.26 or above.


## Next Steps

Terraform relies heavily on acceptance tests to ensure we keep our promise of
helping users safely and predictably create, change, and improve
infrastructure. In our next section we detail how to create “Test Cases”,
individual acceptance tests using Terraform’s testing framework, in order to
build and verify real infrastructure. [Proceed to Test
Cases](/docs/extend/testing/acceptance-tests/testcase.html)

