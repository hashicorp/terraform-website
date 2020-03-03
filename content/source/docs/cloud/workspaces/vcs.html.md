---
layout: "cloud"
page_title: "VCS Connections - Workspaces - Terraform Cloud"
---

# Configuring Workspace VCS Connections

Any Terraform Cloud workspace can be connected to a version control system (VCS) repository that contains its Terraform configuration. You can assign a connection [when creating a workspace](./creating.html), and can modify that connection in the "Version Control" page of the workspace's settings.

For more information about how configuration versions and connected repositories work, see [Terraform Configurations in Terraform Cloud Workspaces](./configurations.html).

To change the VCS settings for an existing workspace, choose "Version Control" from the workspace's "Settings" menu. The version control page includes the following settings:

- Which VCS repository to use.
- Which directories in the repository should trigger Terraform runs when they change.
- Which branch of the repository to use.
- Whether to download the repository's submodules.

For most of the settings on this page, you must save any changes with the "Update VCS settings" button at the bottom of the page.

-> **API:** See the [Update a Workspace endpoint](../api/workspaces.html#update-a-workspace) (`PATCH /organizations/:organization_name/workspaces/:name`).

## VCS Connection and Repository

The first item in the version control settings lets you select a new VCS repository or disconnect from the current repository. Depending on the current status, this control can appear as a "Connect to version control" button or a "Change VCS connection" link.

Clicking this control will navigate to a separate page, which will walk you through the process of connecting or disconnecting a repository. This page is split into three screens.

1. On the first screen, choose your VCS provider (or choose "No VCS connection" to disconnect the workspace from version control).

    If you haven't added a VCS provider for your organization yet, choosing one here will prompt you to configure it. See [Connecting VCS Providers](../vcs/index.html) for more information. Only organization owners can configure VCS providers.

1. On the second screen, choose a repository from the filterable list. This screen is skipped if you chose "No VCS connection".

    Some VCS providers limit the list's size. If a repository isn't listed, you can still choose it by name; scroll to the bottom of the list and enter its ID in the text field.

    For some VCS providers, this list includes a drop-down menu for changing which account's repositories are shown. Other providers combine all available accounts into a single list.

1. On the third screen, confirm or cancel your choice. Confirmed changes will be saved immediately, and you will be returned to the "Version Control" settings page.

See also:

- [Creating Workspaces](./creating.html)
- [Connecting VCS Providers to Terraform Cloud](../vcs/index.html)

-> **API:** If you need to change VCS connections for many workspaces at once, consider automating the changes with the [Update a Workspace endpoint](../api/workspaces.html#update-a-workspace). This is most common when moving a VCS server, or when a vendor deprecates an older API version.

## Automatic Run Triggering

-> **Note:** This setting only affects workspaces that specify a Terraform working directory. Without a working directory, the entire repository is considered relevant and any change will trigger a run. [The working directory setting](./settings.html#terraform-working-directory) can be found on the "General" settings page.

For workspaces that specify a Terraform working directory, Terraform Cloud assumes that only some content in the repository is relevant to the workspace. Only changes that affect the relevant content will trigger a run. This behavior also applies to [speculative plans](./index.html#speculative-plans) on pull requests — Terraform Cloud won't queue plans for changes that aren't considered relevant.

By default, only the designated working directory is considered relevant.

You can adjust this behavior in two ways:

- **Add more trigger directories.** Terraform Cloud will queue runs for changes in any of the specified trigger directories (including the working directory).

    For example, if you use a top-level `modules` directory to share Terraform code across multiple configurations, changes to the shared modules are relevant to every workspace that uses that repo. You can add `modules` as a trigger directory for each workspace to make sure they notice any changes to shared code.
- **Mark the entire repository as relevant.** If you set the "Automatic Run Triggering" setting to "Always Trigger Runs," Terraform Cloud will assume that anything in the repository might affect the workspace's configuration, and will queue runs for any change.

    This can be useful for repos that don't have multiple configurations but require a working directory for some other reason. It's usually not what you want for true monorepos, since it queues unnecessary runs and slows down your ability to provision infrastructure.

### Error Handling for Run Triggers

Terraform Cloud retrieves the changed files for each push or pull request using your VCS provider's API. If for some reason the list of changed files cannot be retrieved, or if it is too large to process, the default behaviour is to trigger runs on all attached workspaces. Should this happen, you may see several runs with state "Planned", due to the push resulting in no changes to infrastructure.

## VCS Branch

Which branch of the repository to use. If left blank, Terraform Cloud will use the repository's default branch.

## Include submodules on clone

Whether to recursively clone all of the repository's Git submodules when fetching a configuration.

-> **Note:** The [SSH key for cloning Git submodules](../vcs/index.html#ssh-keys) is set in the VCS provider settings for the organization, and is not related to the workspace's SSH key for Terraform modules.
