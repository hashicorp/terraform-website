---
layout: "extend"
page_title: "Home - Plugin Development: SDKv2"
description: |-
  Learn about a framework you can use to develop Terraform plugins.
---

# Terraform Plugin SDKv2

Terraform Plugin SDKv2 is a precursor to the [Terraform Plugin Framework](/docs/plugin/framework/index.html) for developing Terraform plugins.

~> **Important**: If you maintain a large existing provider, we recommend that you continue using SDKv2 to develop new resources and data sources. [Which SDK Should I Use?](/docs/plugin/which-sdk.html) explains the differences between SDKv2 and the framework.

## Get Started

Try the [Call APIs with Custom Providers](https://learn.hashicorp.com/collections/terraform/providers?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorials on Hashicorp Learn.

## Key Concepts

- [Schemas](/docs/extend/schemas/index.html) define available fields for provider, resource, or provisioner configuration block, and give Terraform metadata about those fields.
- [Resources](/docs/extend/resources/index.html) are an abstraction that allow Terraform to manage infrastructure objects, such as a compute instance, an access policy, or disk. Providers act as a translation layer between Terraform and an API, offering one or more resources for practitioners to define in a configuration.

## Debug and Test

- Learn how to [debug your provider](/docs/extend/debugging.html) using either logging calls or a debugging tool.
- Learn how to [write successful acceptance and unit tests](/docs/extend/testing/index.html) for your provider.

