---
layout: "enterprise2"
page_title: "Configuring VCS - Getting Started - Terraform Enterprise"
sidebar_current: "docs-enterprise2-started-vcs"
---

# Configuring Version Control Access

**Prerequisites:** At this point, you should have [gotten access to Terraform Enterprise](./access.html), and created an organization if necessary.

Before you can use TFE, it needs access to the version control system (VCS) you use for Terraform code.

## About VCS Access

Most workspaces in TFE are associated with a VCS repository, which provides Terraform configurations for that workspace. To find out which repos are available, access their contents, and create webhooks, TFE needs access to your VCS service.

Although TFE's API lets you create workspaces and push configurations to them without a VCS connection, the primary workflow expects every workspace to be backed by a repository. If you plan to use TFE's GUI to create workspaces, you must configure VCS access first.

## Configuring VCS Access

In general, you enable VCS access by creating a new application configuration on your VCS service, telling TFE how to reach your VCS, exchanging some secret information between them, and requesting access.

Each supported VCS service has slightly different instructions for this. Open the [VCS Integrations page](../vcs/index.html) in a new tab, select your VCS, and follow the instructions to connect it. When you've finished, continue to the next page in this guide.

## Next Steps

After you've configured VCS access, you can [start creating workspaces](./workspaces.html).
