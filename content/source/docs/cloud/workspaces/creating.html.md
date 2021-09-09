---
layout: "cloud"
page_title: "Creating Workspaces - Workspaces - Terraform Cloud and Terraform Enterprise"
description: |-
  Workspaces organize infrastructure into meaningful groups. Learn how to create and configure workspaces through the UI. 
---

# Creating Workspaces

> **Hands-on:** Try the [Get Started - Terraform Cloud](https://learn.hashicorp.com/collections/terraform/cloud-get-started?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) collection on HashiCorp Learn.

Workspaces organize infrastructure into meaningful groups. Create new workspaces whenever you need to manage a new collection of infrastructure resources.

Each new workspace needs a unique name, and needs to know where its Terraform configuration will come from. Most commonly, the configuration comes from a connected version control repository. If you choose not to connect a repository, you'll need to upload configuration versions for the workspace using Terraform CLI or the API.

For more information about how configuration versions and connected repositories work, see [Terraform Configurations in Terraform Cloud Workspaces](./configurations.html).

-> **API:** See the [Create a Workspace endpoint](../api/workspaces.html#create-a-workspace) (`POST /organizations/:organization/workspaces`). <br/>
**Terraform:** See the `tfe` provider's [`tfe_workspace`](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs/resources/workspace) resource.

## Required Permissions

New workspaces can be created by teams with permission to manage workspaces. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Configuring a New Workspace

[workdir]: ./settings.html#terraform-working-directory
[trigger]: ./vcs.html#automatic-run-triggering
[branch]: ./vcs.html#vcs-branch
[submodules]: ./vcs.html#include-submodules-on-clone

-> **Note:** The "Create a New Workspace" page is split into multiple screens. The controls on these screens can vary based on your choices and your organization's settings.

<video muted="muted" autoplay loop playsinline>
    <source src="./images/creating.mp4" type="video/mp4">
</video>

To create a new workspace:

1. [Navigate to the workspace list](./index.html#listing-and-filtering-workspaces) and click the "+ New Workspace" button (near the top of the page).

1. On the first screen, choose your VCS provider (or choose "No VCS connection").

    -> **Note:** If you haven't added a VCS provider for your organization yet, choosing one here will prompt you to configure it. See [Connecting VCS Providers](../vcs/index.html) for more information.

1. On the second screen, choose a repository from the filterable list. This screen is skipped if you chose "No VCS connection".

    Some VCS providers limit the list's size. If a repository isn't listed, you can still choose it by name; scroll to the bottom of the list and enter its ID in the text field.

    -> **Note:** For some VCS providers, this list includes a drop-down menu for changing which account's repositories are shown. Other providers combine all available accounts into a single list.

1. On the third screen, enter a name for the workspace. This defaults to the repository name, if applicable. The name must be unique within the organization, and can include letters, numbers, dashes (`-`), and underscores (`_`). See also our [advice for useful workspace names](./naming.html).

1. Optionally, click the "Advanced options" link on the third screen to configure some additional version control settings. (These settings not shown if you chose "No VCS connection".) For information about these settings, see:
    - [Terraform Working Directory][workdir]
    - [Automatic Run Triggering][trigger]
    - [VCS branch][branch]
    - [Include submodules on clone][submodules]

1. Confirm creation with the "Create workspace" button.


## After Creating a Workspace

Terraform Cloud presents a dialog with shortcut links to either queue a plan or edit variables. If you don't need to edit variables, [manually queue a run](/docs/cloud/run/ui.html#manually-starting-runs) to prepare your workspace.

You may also want to:

- [Edit input or environment variables](./variables.html): Input variables define the parameters of a Terraform configuration, and shell environment variables store credentials and customize Terraform's behavior.
- [Edit additional workspace settings](./settings.html): This includes notifications, permissions, and "Run Triggers" to queue runs automatically.
- [Learn more about running Terraform in your workspace](../run/index.html): You can use the UI, API, or CLI to manage infrastructure.

### VCS Connection
If you connected a VCS repository to the workspace, Terraform Cloud automatically registers a webhook with your VCS provider. A workspace with no runs will not accept new runs from a VCS webhook, so you must [manually queue at least one run](/docs/cloud/run/ui.html#manually-starting-runs).

After you have manually queued a run, Terraform Cloud will automatically queue a plan for the workspace when new commits appear in the selected branch of the linked repository or someone opens a pull request on that branch. [Learn more about VCS webhooks](../vcs/index.html#webhooks).




