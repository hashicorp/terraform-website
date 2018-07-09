---
layout: "enterprise2"
page_title: "Settings - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-settings"
---

# Workspace Settings

-> **API:** See the [Update a Workspace endpoint](../api/workspaces.html#update-a-workspace) (`PATCH /organizations/:organization_name/workspaces/:name`).

Terraform Enterprise (TFE) workspaces can be reconfigured after creation.

Each workspace's page has two tabs of settings:

- "Settings," for general configuration.
- "Version Control," for managing the workspace's VCS integration.

Changing settings requires [admin privileges](../users-teams-organizations/permissions.html) on the affected workspace.

![Screenshot: a workspace page's tabs](./images/settings-tabs.png)

## General Settings

The following settings are available in the "Settings" tab.

### Auto Apply vs. Manual Apply

Whether or not TFE should automatically apply a successful Terraform plan. If you choose manual apply, an operator must confirm a successful plan and choose to apply it.

After changing this setting you must click the "Save settings" button below the "Terraform Version" menu.

### Terraform Version

Which version of Terraform to use for all operations in the workspace. You can choose "latest" to automatically update to new versions, or you can lock a workspace to any specific version.

By default, new workspaces are locked to the current version of Terraform at the time of their creation. (You can specify a Terraform version when creating a workspace via the API.)

After changing this setting you must click the "Save settings" button below it.

### SSH Key

If a workspace's configuration uses [Git-based module sources](/docs/modules/sources.html) to reference Terraform modules in private Git repositories, Terraform needs an SSH key to clone those repositories.

This feature is documented in more detail in [Using SSH Keys for Cloning Modules](./ssh-keys.html).

After changing this setting, you must click the "Update SSH key" button below it.

### Workspace Lock

~> **Important:** Unlike the rest of the settings on this page, locks can be managed with either write or admin privileges.

If you need to prevent Terraform runs for any reason, you can lock a workspace. This prevents users with write access from manually queueing runs, prevents automatic runs due to changes to the backing VCS repo, and prevents the creation of runs via the API. To enable runs again, a user must unlock the workspace.

Locks are managed with a single "Lock/Unlock `<WORKSPACE NAME>`" button. TFE asks for confirmation when unlocking.

~> **Important:** Locking a workspace prevents runs within TFE, but it **does not** prevent state from being updated. This means a user with write access can still modify the workspace's resources by running Terraform outside TFE with [the `atlas` remote backend](/docs/backends/types/terraform-enterprise.html). To prevent confusion and accidents, avoid using the `atlas` backend in normal workflows; to perform runs from the command line, see [TFE's CLI-driven workflow](../run/cli.html).

### Workspace Delete

This section includes two buttons:

- "Queue destroy Plan"
- "Delete from Terraform Enterprise"

In almost all cases, you should perform both actions in that order when destroying a workspace.

Queueing a destroy plan destroys the infrastructure managed by a workspace. If you don't do this, the infrastructure resources will continue to exist but will become unmanaged; you'll need to go into your infrastructure providers to delete the resources manually.

Before queueing a destroy plan, you must set a `CONFIRM_DESTROY` environment variable in the workspace with a value of `1`.


## Version Control Settings

The following settings are available in the "Version Control" tab.

~> **Important:** After changing any of these settings you must click the "Update VCS settings" button at the  bottom of the page.

### VCS Connection and Repository

You can use the "Select a VCS connection" buttons and "Repository" field to change which VCS repository the workspace gets configurations from. See [Creating Workspaces](./creating.html) for more details about selecting a VCS repository, and see [Connecting VCS Providers to Terraform Enterprise](../vcs/index.html) for more details about configuring VCS integrations.

### Terraform Working Directory

The directory where Terraform will execute, specified as a relative path from the root of the repo. This is useful when working with VCS repos that contain multiple Terraform configurations. Defaults to the root of the repo.

-> **Note:** If you specify a working directory, TFE will still queue a plan for changes to the repository outside that working directory. This is because local modules are often outside the working directory, and changes to those modules should result in a new run. If you have a repo that manages multiple infrastructure components with different lifecycles and are experiencing too many runs, we recommend splitting the components out into independent repos. See [Repository Structure](./repo-structure.html) for more detailed explanations.

### VCS Branch

Which branch of the repository to use. If left blank, TFE will use the repository's default branch.

### Include submodules on clone

Whether to recursively clone all of the repository's Git submodules when fetching a configuration.

-> **Note:** The [SSH key for cloning Git submodules](../vcs/index.html#ssh-keys) is set in the VCS provider settings for the organization, and is not necessarily related to the SSH key set in the workspace's settings.
