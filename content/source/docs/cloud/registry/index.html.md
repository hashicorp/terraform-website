---
layout: "cloud"
page_title: "Private Module Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Use the Terraform Cloud private module registry to share Terraform modules across your organization.
---

# Private Module Registry

> **Hands-on:** Try the [Add Public Modules to your Private Module Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry-add?in=terraform/modules&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

> **Hands-on:** Try the [Share Modules in the Private Module Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry?in=terraform/modules&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

Terraform Cloud's private module registry helps you share [Terraform modules](/docs/language/modules/index.html) across your organization. It includes support for module versioning, a searchable and filterable list of available modules, and a configuration designer to help you build new workspaces faster.

By design, the private module registry works much like the [public Terraform Registry](/docs/registry/index.html). If you're already used the public registry, Terraform Cloud's registry will feel familiar.

The private module registry lets you add both private and public modules to the registry, so that you can more easily find all your modules in one place. Private modules are modules that you publish directly to the registry. Public modules, also referred to as "publicly curated modules", live in the public Terraform Registry and are synchronized from it. By adding some of the many public Terraform Registry modules to your private module registry, you can maintain a curated list of approved modules for your organization.

-> **Note:** Publicly curated modules are not supported in Terraform Enterprise.

You can even use a [Sentinel Policy](/docs/cloud/sentinel/index.html) to mandate that all non-root modules used in Terraform configurations be private or publicly curated modules from your own private module registry. You can even require that all those modules use recent versions with a policy like [use-recent-versions-from-pmr.sentinel](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/http-examples/use-recent-versions-from-pmr.sentinel).
