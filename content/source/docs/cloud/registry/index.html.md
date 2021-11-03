---
layout: "cloud"
page_title: "Private Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Use the Terraform Cloud private registry to share Terraform providers and modules across your organization.
---

# Private Registry

> **Hands-on:** Try the [Add Public Modules to your Private Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry-add?in=terraform/modules) tutorial and [Share Modules in the Private Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry?in=terraform/modules) tutorials on HashiCorp Learn.

Terraform Cloud's private registry works similarly to the [public Terraform Registry](/docs/registry/index.html) and helps you share [Terraform providers](/docs/language/providers/index.html) and [Terraform modules](/docs/language/modules/index.html) across your organization. It includes support for versioning, a searchable and filterable list of available providers and modules, and a [configuration designer](/docs/cloud/registry/design.html) to help you build new workspaces faster.

You can add public providers and both public and private modules to the registry:

- [Public modules and providers](/docs/cloud/registry/add.html) are automatically synchronized from the Terraform Registry where they are hosted. Public modules are not supported in Terraform Enterprise.
- [Private modules](/docs/cloud/registry/publish.html) are hosted on the registry and are only available to members of that organization. In Terraform Enterprise, they are also available to other organizations that are configured to [share modules](/docs/enterprise/admin/module-sharing.html) with that organization.

You can use [Sentinel Policies](/docs/cloud/sentinel/index.html) to enforce rules about how members of your organization can use modules. For example, you can mandate that all non-root modules in Terraform configurations must be private or public modules from your own private registry. You can even require that all of those modules use recent versions with a policy like [this example on GitHub](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/http-examples/use-recent-versions-from-pmr.sentinel).
