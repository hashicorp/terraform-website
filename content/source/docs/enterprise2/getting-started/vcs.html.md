---
layout: "enterprise2"
page_title: "Configuring VCS - Getting Started - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-started-vcs"
---

# Configuring Version Control Access

**Prerequisites:** At this point, you should [have access to Terraform Enterprise beta](./get-started-access.html).

Before you can use TFE for real work, it must be able to access the version control system (VCS) you use for Terraform code.

## About VCS Access

Currently, TFE always gets Terraform configurations from version control. Every workspace needs to be associated with a VCS repo, and alternate methods for bringing Terraform code into a workspace (like `terraform push`) are not supported.

A TFE workspace can use a webhook to do Terraform runs in response to new commits, or it can wait for a user to manually trigger a run.

(TODO: confirm all that, and explain plans for GA or late beta if possible.)

### Supported VCS Services

TFE supports the following VCS services:

- GitHub
- GitHub Enterprise
- GitLab
- Bitbucket Cloud
- Bitbucket Server

Currently, TFE cannot use other VCS services (including generic Git servers).

## Configuring VCS Access

TFE uses OAuth to securely access your Terraform code and other VCS data.

For security reasons, TFE treats each _organization_ as a separate OAuth application. This means you will authenticate with OAuth's developer workflow, which has more steps than OAuth's user workflow.


