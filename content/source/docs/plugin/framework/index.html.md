---
layout: "extend"
page_title: "Home - Plugin Development: Framework"
description: |-
  An overview of terraform-plugin-framework, a next-generation SDK for
  Terraform plugin development.
---

# Terraform Plugin Framework

The plugin framework is a new way to develop Terraform plugins, providing improvements and new features from [Teraform Plugin SDKv2](/docs/extend/sdkv2-intro.html).

~> **Important**: HashiCorp is currently developing providers against the framework, but it is still early in its development cycle. Its interfaces are subject to change and it may not yet support all of your desired features. It can also only build providers that require **Terraform v1.0.3 or later**.
[Which SDK Should I Use?](/docs/plugin/which-sdk.html) can help you decide whether the framework is right for your provider.



## Get Started

Try the [Implement Create and Read with the Terraform Plugin Framework](https://learn.hashicorp.com/tutorials/terraform/plugin-framework-create?in=terraform/providers) tutorial on HashiCorp Learn.


## Key Concepts
- [Providers](/docs/plugin/framework/providers.html) are Terraform plugins that supply resources and data sources for practitioners to use. They are implemented as binaries that the Terraform CLI downloads, starts, and stops.
- [Schemas](/docs/plugin/framework/schemas.html) define available fields for provider, resource, or provisioner configuration block, and give Terraform metadata about those fields.
- [Resources](/docs/plugin/framework/resources.html) are an abstraction that allow Terraform to manage infrastructure objects, such as a compute instance, an access policy, or disk. Providers act as a translation layer between Terraform and an API, offering one or more resources for practitioners to define in a configuration.
- [Data Sources](/docs/plugin/framework/data-sources.html) are an abstraction that allow Terraform to reference external data. Providers have data sources that tell Terraform how to request external data and how to convert the response into a format that practitioners can interpolate.

## Test and Publish

- Learn to write [acceptance tests](/docs/plugin/framework/acctests.html) for your provider.
- Learn to [publish your provider](/docs/plugin/framework/publishing.html) to the Terraform Registry.
