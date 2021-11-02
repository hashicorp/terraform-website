---
layout: "cloud"
page_title: "Private Module Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Use the Terraform Cloud private module registry to share Terraform modules across your organization.
---

# Private Module Registry

> **Hands-on:** Try the [Add Public Modules to your Private Module Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry-add?in=terraform/modules) tutorial and [Share Modules in the Private Module Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry?in=terraform/modules) tutorials on HashiCorp Learn.

Terraform Cloud's private module registry works similarly to the [public Terraform Registry](/docs/registry/index.html) and helps you share [Terraform modules](/docs/language/modules/index.html) across your organization. It includes support for module versioning, a searchable and filterable list of available modules, and a [configuration designer](/docs/cloud/registry/design.html) to help you build new workspaces faster.  

You can add both private and public modules to the registry:

- [Private modules](/docs/cloud/registry/publish.html) are hosted on the registry and are only available to members of that organization. In Terraform Enterprise, they are also available to other organizations that are configured to [share modules](/docs/enterprise/admin/module-sharing.html) with that organization.
- [Public modules](/docs/cloud/registry/add.html) are automatically synchronized from the Terraform Registry where they are hosted. Public modules are not supported in Terraform Enterprise.

You can use [Sentinel Policies](/docs/cloud/sentinel/index.html) to enforce rules about how members of your organization can use these modules. For example, you can mandate that all non-root modules in Terraform configurations must be private or public modules from your own private module registry. You can even require that all of those modules use recent versions with a policy like [use-recent-versions-from-pmr.sentinel](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/http-examples/use-recent-versions-from-pmr.sentinel).
