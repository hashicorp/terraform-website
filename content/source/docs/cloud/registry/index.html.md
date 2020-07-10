---
layout: "cloud"
page_title: "Private Module Registry - Terraform Cloud and Terraform Enterprise"
---

# Private Module Registry

> For a hands-on tutorial, try the [Share Modules in the Private Module Registry](https://learn.hashicorp.com/terraform/modules/private-modules?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) guide on HashiCorp Learn.

Terraform Cloud's private module registry helps you share [Terraform modules](/docs/modules/index.html) across your organization. It includes support for module versioning, a searchable and filterable list of available modules, and a configuration designer to help you build new workspaces faster.

By design, the private module registry works much like the [public Terraform Registry](/docs/registry/index.html). If you're already used the public registry, Terraform Cloud's registry will feel familiar.

-> **Note:** Currently, the private module registry works with all supported VCS providers; however, the private module registry does not support [GitLab subgroups](https://about.gitlab.com/features/subgroups/).

