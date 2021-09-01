---
layout: "extend"
page_title: "Home - Plugin Development: SDKv2"
description: |-
  Learn about version 2 of the Terraform Plugin SDK.
---

# Terraform Plugin SDKv2

Terraform Plugin SDKv2 is an established way to develop Terraform Plugins. It is the precursor to the [Terraform Plugin Framework](/docs/plugin/framework/index.html), which is still in early development.

~> **Important**: [Which SDK Should I Use?](/docs/plugin/which-sdk.html) explains the differences between the framework and SDKv2 to help you decide which option is right for your provider.

## Get Started

Try the [Call APIs with Custom Providers](https://learn.hashicorp.com/collections/terraform/providers?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorials on HashiCorp Learn.

## Key Concepts

- [Schemas](/docs/extend/schemas/index.html) define available fields for provider, resource, or provisioner configuration block, and give Terraform metadata about those fields.
- [Resources](/docs/extend/resources/index.html) are an abstraction that allow Terraform to manage infrastructure objects, such as a compute instance, an access policy, or disk. Providers act as a translation layer between Terraform and an API, offering one or more resources for practitioners to define in a configuration.

## Debug and Test

- Learn how to [debug your provider](/docs/extend/debugging.html) using either logging calls or a debugging tool.
- Learn how to [write successful acceptance and unit tests](/docs/extend/testing/index.html) for your provider.
