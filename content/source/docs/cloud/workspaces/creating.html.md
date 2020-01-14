---
layout: "cloud"
page_title: "Creating Workspaces - Workspaces - Terraform Cloud"
---

# Creating Workspaces

-> **API:** See the [Create a Workspace endpoint](../api/workspaces.html#create-a-workspace) (`POST /organizations/:organization/workspaces`). <br/>
**Terraform:** See the `tfe` provider's [`tfe_workspace` resource](/docs/providers/tfe/r/workspace.html).

Workspaces organize infrastructure into meaningful groups. Create new workspaces whenever you need to manage a new collection of infrastructure resources.

Each new workspace needs a unique name, and needs to know where its Terraform configuration will come from. Most commonly, the configuration comes from a connected version control repository. If you choose not to connect a repository, you'll need to upload configuration versions for the workspace using Terraform CLI or the API.

For more information about how configuration versions and connected repositories work, see [Terraform Configurations in Terraform Cloud Workspaces](./configurations.html).

## Required Permissions

New workspaces can be created by:

- [The owners team](../users-teams-organizations/teams.html#the-owners-team).
- Teams with the [manage workspaces](../users-teams-organizations/permissions.html#manage-workspaces) permission.

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

    -> **Note:** If you haven't added a VCS provider for your organization yet, choosing one here will prompt you to configure it. See [Connecting VCS Providers](../vcs/index.html) for more information. Only organization owners can configure VCS providers.

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

When you create a new workspace, a few things happen:

- Terraform Cloud doesn't immediately queue a plan for the workspace. Instead, it presents a dialog with shortcut links to either queue a plan or edit variables.

    If you don't need to edit variables, confirm that the workspace is ready to run by manually queuing a plan.

- If you connected a VCS repository to the workspace, Terraform Cloud automatically registers a webhook with your VCS provider. The next time new commits appear in the selected branch of that repo or a PR is opened to that branch, Terraform Cloud will automatically queue a Terraform plan for the workspace. For more information, see [VCS Connections: Webhooks](../vcs/index.html#webhooks).

A workspace with no runs will not accept new runs via VCS webhook; at least one run must be manually queued to confirm that the workspace is ready for further runs.

Most of the time, you'll want to do one or more of the following after creating a workspace:

- [Edit variables](./variables.html)
- [Edit additional workspace settings](./settings.html)
- [Work with runs](../run/index.html)
