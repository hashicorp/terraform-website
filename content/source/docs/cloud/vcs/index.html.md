---
layout: "cloud"
page_title: "Connecting VCS Providers - Terraform Cloud"
---

# Connecting VCS Providers to Terraform Cloud

Terraform Cloud is more powerful when you integrate it with your version control system (VCS) provider. Although you can use almost all of Terraform Cloud's features without one, a VCS connection provides major workflow benefits. In particular:

- When workspaces are linked to a VCS repository, Terraform Cloud can [automatically initiate Terraform runs](../run/ui.html) when changes are committed to the specified branch.
- Terraform Cloud makes code review easier by [automatically predicting](../run/ui.html#speculative-plans-on-pull-requests) how pull requests will affect infrastructure.
- Publishing new versions of a [private Terraform module](../registry/publish.html) is as easy as pushing a tag to the module's repository.

We recommend configuring VCS access when first setting up an organization, and you might need to add additional VCS providers later depending on how your organization grows.

## Supported VCS Providers

Terraform Cloud supports the following VCS providers:

- [GitHub](./github.html)
- [GitHub Enterprise](./github-enterprise.html)
- [GitLab.com](./gitlab-com.html)
- [GitLab EE and CE](./gitlab-eece.html)
- [Bitbucket Cloud](./bitbucket-cloud.html)
- [Bitbucket Server](./bitbucket-server.html)
- [Azure DevOps Services](./azure-devops-services.html)

Use the links above to see details on configuring VCS access for each supported provider. If you use another VCS that is not supported, you can build an integration via [the API-driven run workflow](../run/api.html).

## How Terraform Cloud Uses VCS Access

Most workspaces in Terraform Cloud are associated with a VCS repository, which provides Terraform configurations for that workspace. To find out which repos are available, access their contents, and create webhooks, Terraform Cloud needs access to your VCS provider.

Although Terraform Cloud's API lets you create workspaces and push configurations to them without a VCS connection, the primary workflow expects every workspace to be backed by a repository.

To use configurations from VCS, Terraform Cloud needs to do several things:

- Access a list of repositories, to let you search for repos when creating new workspaces.
- Register webhooks with your VCS provider, to get notified of new commits to a chosen branch.
- Download the contents of a repository at a specific commit in order to run Terraform with that code.

### Webhooks

Terraform Cloud uses webhooks to monitor new commits and pull requests.

- When someone adds new commits to a branch, any Terraform Cloud workspaces based on that branch will begin a Terraform run. Usually a user must inspect the plan output and approve an apply, but you can also enable automatic applies on a per-workspace basis. You can prevent automatic runs by locking a workspace.
- When someone submits a pull request/merge request to a branch from another branch in the same repository, Terraform Cloud performs a [speculative plan](../run/index.html#speculative-plans) with the contents of the request and links to the results on the PR's page. This helps you avoid merging PRs that cause plan failures.

### SSH Keys

For most supported VCS providers, Terraform Cloud does not need an SSH key — it can do everything it needs with the provider's API and an OAuth token. The exception is Bitbucket Server, which requires an SSH key for downloading repository contents. The [setup instructions for Bitbucket Server](./bitbucket-server.html) include this step.

For other VCS providers, most organizations will not need to add an SSH private key. However, if the organization repositories include Git submodules that can only be accessed via SSH, an SSH key can be added along with the OAuth credentials.

If submodules will be cloned via SSH from a private VCS instance, SSH must be running on the standard port 22 on the VCS server.

To add an SSH key to a VCS connection, finish configuring OAuth in the organization settings, and then use the "add a private SSH key" link on the VCS Provider settings page to add a private key that has access to the submodule repositories. When setting up a workspace, if submodules are required, select "Include submodules on clone". More at [Workspace settings](../workspaces/settings.html).

### Multiple VCS Connections

If your infrastructure code is spread across multiple VCS providers, you can configure multiple VCS connections. You can choose which VCS connection to use whenever you create a new workspace.

## Configuring VCS Access

Terraform Cloud uses the OAuth protocol to authenticate with VCS providers.

~> **Important:** Even if you've used OAuth before, read the instructions carefully. Since Terraform Cloud's security model treats each _organization_ as a separate OAuth application, we authenticate with OAuth's developer workflow, which is more complex than the standard user workflow.

The exact steps to authenticate are different for each VCS provider, but they follow this general order:

On your VCS | On Terraform Cloud
--|--
Register your Terraform Cloud organization as a new app. Get ID and key. | &nbsp;
&nbsp; | Tell Terraform Cloud how to reach VCS, and provide ID and key. Get callback URL.
Provide callback URL. | &nbsp;
&nbsp; | Request VCS access.
Approve access request. | &nbsp;

For complete details, click the link for your VCS provider:

- [GitHub](./github.html)
- [GitHub Enterprise](./github-enterprise.html)
- [GitLab.com](./gitlab-com.html)
- [GitLab EE and CE](./gitlab-eece.html)
- [Bitbucket Cloud](./bitbucket-cloud.html)
- [Bitbucket Server](./bitbucket-server.html)
- [Azure DevOps Services](./azure-devops-services.html)

-> **Note:** Alternately, you can skip the OAuth configuration process and authenticate with a personal access token. This requires using Terraform Cloud's API. For details, see [the OAuth Clients API page](../api/oauth-clients.html).
