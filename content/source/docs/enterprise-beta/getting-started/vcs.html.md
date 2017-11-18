---
layout: "enterprise2"
page_title: "Configuring VCS - Getting Started - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-started-vcs"
---

# Configuring Version Control Access

**Prerequisites:** At this point, you should have [gotten access to Terraform Enterprise beta](./access.html), and created an organization if necessary.

Before you can use TFE, it needs access to the version control system (VCS) you use for Terraform code.

## About VCS Access

Every workspace in TFE is associated with a VCS repository, which provides the Terraform code for that workspace. To find out which repos are available, access their contents, and create webhooks, TFE needs access to your VCS service.

## Configuring VCS Access

Before you can create workspaces based on your repositories, you must authorize TFE to access your VCS service.

The exact instructions are different for each supported VCS service. Open the [VCS Integrations page](../vcs/index.html) in a new tab, select your VCS, and follow the instructions to connect it. When you've finished, continue to the next page in this guide.

## Next Steps

After you've configured VCS access, you can [start creating workspaces](./workspaces.html).
