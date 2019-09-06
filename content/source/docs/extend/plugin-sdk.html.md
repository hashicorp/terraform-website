---
layout: "extend"
page_title: "Standalone Plugin SDK"
sidebar_current: "docs-extend-0.12-compatibility"
description: |-
  Provider development now has an official standalone SDK
---

# Switching to the standalone SDK

While the `helper` package has served us well, in order for provider development to evolve the SDK needed to break out into its own repository. Terraform the CLI's versioning has been oriented towards practitioners. With the "unofficial" SDK existing in the core repository, the SDK becomes tied to core releases and cannot follow semantic versioning. Going forward the SDK will be hosted on its own, and developers will import [github.com/hashicorp/terraform-plugin-sdk](https://github.com/hashicorp/terraform-plugin-sdk), following sematic versioning starting with v1.0.0.

The first release of this SDK aims to keep nearly 100% backwards compatibility, aside from a handful of APIs, so only the imports within your provider need to be replaced. The migration process can be automated with the [migrator tool](https://github.com/hashicorp/tf-sdk-migrator). This tool will check eligibility of a provider codebase, ensuring the use of go modules and that the provider is upgrading from the latest `github.com/hashicorp/terraform` release. It will also identify if the handful of removed APIs are being used.


```
❯ tf-sdk-migrator check
Checking Go runtime version ...
Go version 1.12.9: OK.
Checking whether provider uses Go modules...
Go modules in use: OK.
Checking version of github.com/hashicorp/terraform SDK used in provider...
SDK version 0.12.7: OK.
Checking whether provider uses deprecated SDK packages or identifiers...
Deprecated SDK packages in use: [github.com/hashicorp/terraform/flatmap]
Deprecated SDK identifiers in use: ...

Some constraints not satisfied. Please resolve these before migrating to the new SDK. 
```

Projects that have not switched to go modules or are on an old version of the SDK, particularly < v0.12 should first [upgrade to v0.12](/docs/extend/terraform-0.12-compatibility.html). If there are no problems detected the migrator can update your `go.mod` with the new import path and rewrite imports throughout the codebase.

```
❯ tf-sdk-migrator migrate --sdk-version v1.0.0
Checking Go runtime version ...
Go version 1.12.9: OK.
Checking whether provider uses Go modules...
Go modules in use: OK.
Checking version of github.com/hashicorp/terraform SDK used in provider...
SDK version 0.12.6: OK.
Checking whether provider uses deprecated SDK packages or identifiers...
No imports of deprecated SDK packages or identifiers: OK.

All constraints satisfied. Provider can be migrated to the new SDK.

Rewriting provider go.mod file...
Rewriting SDK package imports...
Success! Provider is migrated to github.com/hashicorp/terraform-plugin-sdk v1.0.0.
```

Remember to vendor the dependencies if the project still uses vendoring.

```
❯ go mod vendor
```