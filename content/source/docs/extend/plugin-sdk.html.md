---
layout: "extend"
page_title: "Terraform Plugin SDK"
sidebar_current: "docs-extend-0.12-compatibility"
description: |-
  Official standalone SDK for Terraform plugin development
---

As of September 2019, Terraform provider developers importing the Go module `github.com/hashicorp/terraform`, known as Terraform Core, should switch to `github.com/hashicorp/terraform-plugin-sdk`, the Terraform Plugin SDK, instead. 

# Why a separate module?

While the `helper/*` and other packages in Terraform Core has served us well, in order for provider development to evolve, the SDK needed to break out into its own repository. Terraform Core's versioning has been oriented towards practitioners. With the "unofficial" SDK existing in the core repository, the SDK becomes tied to Core releases and cannot follow semantic versioning. The new standalone SDK [github.com/hashicorp/terraform-plugin-sdk](https://github.com/hashicorp/terraform-plugin-sdk) follows sematic versioning starting with v1.0.0.

We will use the term "legacy Terraform plugin SDK" when referring to the version of Terraform Core imported and used by providers.

# What do providers need to do?

The first release of the standalone plugin SDK aims to keep nearly 100% backwards compatibility, aside from a handful of APIs, so only the imports within your provider need to be replaced. 

The migration process can be automated with the [migrator tool](https://github.com/hashicorp/tf-sdk-migrator). This tool will check eligibility of a provider codebase, ensuring the use of Go modules and that the provider is upgrading from at least v0.12.7 of `github.com/hashicorp/terraform`. It will also identify if the handful of removed APIs are being used.

You can also migrate your provider manually by replacing references to `github.com/hashicorp/terraform` with `github.com/hashicorp/terraform-plugin-sdk`. We recommend using the official migrator tool as it has a number of checks that will make this process safer. Please also read the [deprecation notices](#deprecations) below.

# How do I migrate my provider to the standalone SDK?

## Step 0: Install the migrator tool 

```
$ go install github.com/hashicorp/tf-sdk-migrator
```

The migrator binary is now available at `$GOBIN/tf-sdk-migrator`. Examples below assume you have added `$GOBIN` to your `PATH`.

## Step 1: Check eligibility for migration

```
$ cd /provider/source/directory/
$ tf-sdk-migrator check
```

If this command succeeds, proceed to Step 2.

Otherwise, the tool will output the steps you need to take to ensure the provider can be migrated. Please see https://github.com/hashicorp/tf-sdk-migrator#check-eligibility-for-migration-tf-sdk-migrator-check for more information about the eligibility checks, and see the [Deprecations section](#deprecations) below for what to do if you are using deprecated packages or identifiers.

Projects that are on an old version of the legacy Terraform plugin SDK, particularly < v0.12, should first [upgrade to v0.12](/docs/extend/terraform-0.12-compatibility.html).

## Step 2: Migrate

```
$ tf-sdk-migrator migrate
```
The `migrate` subcommand runs the `check` subcommand, and migration will not proceed if the eligibility check fails.

If migration succeeds, you will see something like the following:

```
$ tf-sdk-migrator migrate
Checking Go runtime version ...
Go version 1.12.9: OK.
Checking whether provider uses Go modules...
Go modules in use: OK.
Checking version of github.com/hashicorp/terraform SDK used in provider...
SDK version 0.12.7: OK.
Checking whether provider uses deprecated SDK packages or identifiers...
No imports of deprecated SDK packages or identifiers: OK.

All constraints satisfied. Provider can be migrated to the new SDK.

Rewriting provider go.mod file...
Rewriting SDK package imports...
Success! Provider is migrated to github.com/hashicorp/terraform-plugin-sdk v1.0.0.
```

Remember to vendor the dependencies if the project still uses vendoring.

```
$ go mod vendor
```

Congratulations! Your Terraform provider is migrated to the standalone SDK. You can now run your tests and commit the changed files.

# What if my provider is not eligible for migration?

Version 1.0.0 of the standalone plugin SDK is intended to differ as little as possible from the legacy plugin SDK. However, we have had to deprecate some packages and identifiers.

## Deprecations
The following packages, functions, and identifiers have been deprecated as of v0.12.7 of the legacy SDK in Core, and have removed altogether in the standalone SDK.

* `config.NewRawConfig()/terraform.NewResourceConfig()` were sometimes used in tandem for testing provider block configuration. The config package has been removed entirely from the SDK as well as `terraform.NewResourceConfig`, you should now use `terraform.NewResourceConfigRaw()`. See [example](https://github.com/terraform-providers/terraform-provider-consul/pull/149/files)

* Passing along a user agent header to backend APIs has been done a few ways. The new standalone SDK tries to standardize the creation of a user agent header, as well as provide an accurate version of Terraform calling the provider.
  - `terraform.VersionString()` has been removed, it provided the version of terraform the dependency, which was not accurate. The version of terraform can now be accessed at runtime in a provider's `ConfigureFunc`. See [example](https://github.com/terraform-providers/terraform-provider-kubernetes/pull/620/files)
  - `httpclient.UserAgentString()/terraform.UserAgentString()` have been removed. Please use [`httpclient.TerraformUserAgent()`](https://github.com/hashicorp/terraform-plugin-sdk/blob/e664f5b78081fde148c4ea55a0e068dc62fb2274/httpclient/useragent.go#L14) instead.
  - `httpclient.New()` has been removed. Please use `github.com/hashicorp/go-cleanhttp.DefaultPooledClient()` directly with a custom transport. This is how [`httpclient.New()`](https://github.com/hashicorp/terraform/blob/39f61a07955b57c0a4afeb183259ca1697677148/httpclient/client.go#L12) was implement in Core. 