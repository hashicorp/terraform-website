---
layout: enterprise2
page_title: "Connecting VCS Services - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-vcs"
---

# Connecting VCS Services to Terraform Enterprise

TFE's core features require access to your version control system (VCS) service. You'll need to configure VCS access when first setting up a TFE organization, and you might need to add additional VCS services later depending on how your organization grows.

## How TFE Uses VCS Access

TFE relies on VCS to get Terraform configurations. Every workspace is associated with a VCS repository, which provides Terraform code for that workspace.

To use your code, TFE needs to do several things:

- Access a list of repositories, to let you search for repos when creating new workspaces.
- Register webhooks with your VCS service, to get notified of new commits to a chosen branch.
- Download the contents of a repository at a specific commit in order to run Terraform with that code.

For most of our supported VCS services, TFE can do all of that with the service's HTTPS API and an OAuth token. However, some VCS services also require an SSH key for downloading repository contents. For details, see the page about your specific VCS service. (Links are below.)

## Configuring VCS Access

TFE uses the OAuth protocol to authenticate with VCS services.

~> **Important:** Even if you've used OAuth before, read the instructions carefully. Since TFE's security model treats each _organization_ as a separate OAuth application, we authenticate with OAuth's developer workflow, which is more complex than the standard user workflow.

The exact steps to authenticate are different for each VCS service, but they follow this general order:

On your VCS | On TFE
--|--
Register your TFE organization as a new app. Get ID and key. | &nbsp;
&nbsp; | Tell TFE how to reach VCS, and provide ID and key. Get callback URL.
Provide callback URL. | &nbsp;
&nbsp; | Request VCS access.
Approve access request. | &nbsp;

For complete details, click the link for your VCS service below.

### Supported VCS Services

TFE supports the following VCS services:

- [GitHub](./github.html)
- [GitHub Enterprise](./github-enterprise.html)
- GitLab
- Bitbucket Cloud
- Bitbucket Server

Currently, TFE cannot use other VCS services (including generic Git servers).

