---
layout: enterprise2
page_title: "Connecting VCS Providers - Terraform Enterprise"
sidebar_current: "docs-enterprise2-vcs"
---

# Connecting VCS Providers to Terraform Enterprise

TFE's core features require access to your version control system (VCS) provider. You'll need to configure VCS access when first setting up a TFE organization, and you might need to add additional VCS providers later depending on how your organization grows.

## How TFE Uses VCS Access

Most workspaces in TFE are associated with a VCS repository, which provides Terraform configurations for that workspace. To find out which repos are available, access their contents, and create webhooks, TFE needs access to your VCS provider.

Although TFE's API lets you create workspaces and push configurations to them without a VCS connection, the primary workflow expects every workspace to be backed by a repository. If you plan to use TFE's GUI to create workspaces, you must configure VCS access first.

To use configurations from VCS, TFE needs to do several things:

- Access a list of repositories, to let you search for repos when creating new workspaces.
- Register webhooks with your VCS provider, to get notified of new commits to a chosen branch.
- Download the contents of a repository at a specific commit in order to run Terraform with that code.

~> **Important:** Repo connections are only configured when creating or initially configuring new workspaces; the repo for a workspace can't be updated.

### Webhooks

TFE uses webhooks to monitor new commits and pull requests.

- When someone adds new commits to a branch, any workspaces based on that branch will begin a Terraform run. Usually a user must inspect the plan output and approve an apply, but you can also enable automatic applies on a per-workspace basis. You can also prevent automatic runs by locking a workspace.
- When someone submits a pull request/merge request to a branch, TFE does a Terraform plan with the contents of the request and records the results on the PR's page. This helps you avoid merging PRs that cause plan failures.

    Pull request plans don't appear in a workspace's run list, and can't be applied. They're intended only as a check for merge safety.

### SSH Keys

For most supported VCS providers, TFE does not need an SSH key — it can do everything it needs with the provider's API and an OAuth token. The exception is Bitbucket Server, which requires an SSH key for downloading repository contents. The [setup instructions for Bitbucket Server](./bitbucket-server.html) include this step.

For other VCS providers, most organizations will not need to add an SSH private key. However, if the organization repositories include Git submodules that can only be accessed via SSH, an SSH key can be added along with the OAuth credentials.

To add an SSH key to a VCS connection, finish configuring OAuth in the organization settings, and then use the "add a private SSH key" link on the OAuth Configuration page to add a private key that has access to the submodule repositories. When setting up a workspace, if submodules are required, select "Include submodules on clone". More at [Workspace settings](../workspaces/settings.html).

### Multiple VCS Connections

If your infrastructure code is spread across multiple VCS providers, you can configure multiple VCS connections. TFE will ask which VCS connection to use whenever you create a new workspace.

## Configuring VCS Access

TFE uses the OAuth protocol to authenticate with VCS providers.

~> **Important:** Even if you've used OAuth before, read the instructions carefully. Since TFE's security model treats each _organization_ as a separate OAuth application, we authenticate with OAuth's developer workflow, which is more complex than the standard user workflow.

The exact steps to authenticate are different for each VCS provider, but they follow this general order:

On your VCS | On TFE
--|--
Register your TFE organization as a new app. Get ID and key. | &nbsp;
&nbsp; | Tell TFE how to reach VCS, and provide ID and key. Get callback URL.
Provide callback URL. | &nbsp;
&nbsp; | Request VCS access.
Approve access request. | &nbsp;

For complete details, click the link for your VCS provider below.

### Specific Instructions for Supported VCS Providers

To configure VCS access, select your VCS provider from the list below:

- [GitHub](./github.html)
- [GitHub Enterprise](./github-enterprise.html)
- [GitLab.com](./gitlab-com.html)
- [GitLab EE and CE](./gitlab-eece.html)
- [Bitbucket Cloud](./bitbucket-cloud.html)
- [Bitbucket Server](./bitbucket-server.html)

Currently, TFE cannot use other VCS providers (including generic Git servers).

