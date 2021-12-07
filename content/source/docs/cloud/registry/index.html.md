---
layout: "cloud"
page_title: "Private Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Use the Terraform Cloud private registry to share Terraform providers and modules across your organization.
---

# Private Registry


Terraform Cloud's private registry works similarly to the [public Terraform Registry](/docs/registry/index.html) and helps you share [Terraform providers](/docs/language/providers/index.html) and [Terraform modules](/docs/language/modules/index.html) across your organization. It includes support for versioning, a searchable list of available providers and modules, and a [configuration designer](/docs/cloud/registry/design.html) to help you build new workspaces faster.

> **Hands-on:** Try the [Add Public Providers and Modules to your Private Registry](https://learn.hashicorp.com/tutorials/terraform/private-registry-add) tutorial and [Share Modules in the Private Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry?in=terraform/modules) tutorials on HashiCorp Learn.

## Public Providers and Modules

[Public modules and providers](/docs/cloud/registry/add.html) are hosted on the public Terraform Registry and Terraform Cloud can automatically synchronize them to an organization's private registry. This lets you clearly designate which public providers and modules are recommended for the organization and makes their supporting documentation and examples centrally accessible.

-> **Note:** Public modules are not supported in Terraform Enterprise.

## Private Modules

[Private modules](/docs/cloud/registry/publish.html) are hosted on an organization's private registry and are only available to members of that organization. In Terraform Enterprise, they are also available to other organizations that are configured to [share modules](/docs/enterprise/admin/module-sharing.html) with that organization.

## Managing Usage

You can create [Sentinel policies](/docs/cloud/sentinel/index.html) to manage how members of your organization can use modules from the private registry. For example, you can mandate that all non-root modules in Terraform configurations must be private or public modules from your own private registry. You can even require that all of those modules use recent versions with a policy like [this example on GitHub](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/http-examples/use-recent-versions-from-pmr.sentinel).
