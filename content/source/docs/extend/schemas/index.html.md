---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-schemas"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Terraform Schemas

Introduce schemas as the high-level interface for writing resource providers
for Terraform. Document
[`terraform.ResourceProvider`](https://github.com/hashicorp/terraform/blob/b2dae9b06ce9565eb9d020a510d7134e53afd050/terraform/resource_provider.go#L19)
interface and
[`schema.Resource`](https://github.com/hashicorp/terraform/blob/b2dae9b06ce9565eb9d020a510d7134e53afd050/helper/schema/resource.go#L23)
interface, in terms of implementing them for a new Provider and Resource,
respectively.
