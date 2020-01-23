---
layout: "cloud"
page_title: "Settings - Workspaces - Terraform Cloud"
---

# Workspace Settings

Terraform Cloud workspaces can be reconfigured after creation.

Workspace settings are separated into several pages, which are listed in the drop-down "Settings" menu in each workspace's header. The following groups of settings are available:

- "General", for basic configuration.
- "Locking", for temporarily preventing new plans and applies.
- "Notifications", for configuring run notifications.
- "SSH Key", for configurations that use Git-based module sources.
- "Team Access," for managing workspace permissions.
- "Version Control", for managing the workspace's VCS integration.
- "Destruction and Deletion", for removing a workspace and the infrastructure it manages.

Changing settings requires [admin privileges](../users-teams-organizations/permissions.html) on the affected workspace.

![Screenshot: a workspace page's "Settings" menu](./images/settings-tabs.png)

-> **API:** See the [Update a Workspace endpoint](../api/workspaces.html#update-a-workspace) (`PATCH /organizations/:organization_name/workspaces/:name`).

## General

The "General Settings" page configures a workspace's name, plus some details about how Terraform runs behave.

After changing any of these settings, you must click the "Save settings" button at the bottom of the page.

### ID

Every workspace has a unique ID that cannot be changed. Workspace IDs are sometimes necessary when working with [Terraform Cloud's API](../api/index.html).

Click the icon beside the ID to copy it to the clipboard.

### Name

The display name of the workspace.

~> **Important:** Since some API calls refer to a workspace by its name, changing the name can sometimes break existing integrations.

### Execution Mode

[remote backend]: /docs/backends/types/remote.html

Whether to use Terraform Cloud as the Terraform execution platform for this workspace.

The default value is "Remote", which instructs Terraform Cloud to perform Terraform runs on its own disposable virtual machines. This provides a consistent and reliable run environment, and enables advanced features like Sentinel policy enforcement, cost estimation, notifications, version control integration, and more.

To disable remote execution for a workspace, change its execution mode to "Local". The workspace will store state, which Terraform can access using the [remote backend][].

### Auto Apply and Manual Apply

Whether or not Terraform Cloud should automatically apply a successful Terraform plan. If you choose manual apply, an operator must confirm a successful plan and choose to apply it.

Auto-apply has a few exceptions:

- [Destroy plans](#destruction-and-deletion) must always be manually applied.
- Plans queued by users with [plan permissions](../users-teams-organizations/permissions.html#plan) must be approved by a user with write or admin permissions.

### Terraform Version

The Terraform version to use for all operations in the workspace. The default value is whichever release was current when the workspace was created.

You can choose "latest" to automatically update a workspace to new versions, or you can choose a specific version.

-> **API:** You can specify a Terraform version when [creating a workspace](../api/workspaces.html#create-a-workspace) via the API.

### Terraform Working Directory

The directory where Terraform will execute, specified as a relative path from the root of the configuration directory. Defaults to the root of the configuration directory.

Terraform Cloud will change to this directory before starting a Terraform run, and will report an error if the directory does not exist.

Setting a working directory creates a default filter for automatic run triggering, and  sometimes causes CLI-driven runs to upload additional configuration content.

#### Default Run Trigger Filtering

In VCS-backed workspaces that specify a working directory, Terraform Cloud assumes that only changes within that working directory should trigger a run. You can override this behavior with the [Automatic Run Triggering](./vcs.html#automatic-run-triggering) settings.

#### Parent Directory Uploads

If a working directory is configured, Terraform Cloud always expects the complete shared configuration directory to be available, since the configuration might use local modules from outside its working directory.

In [runs triggered by VCS commits](../run/ui.html), this is automatic. In [CLI-driven runs](../run/cli.html), Terraform's CLI sometimes uploads additional content:

- When the local working directory _does not match_ the name of the configured working directory, Terraform assumes it is the root of the configuration directory, and uploads only the local working directory.
- When the local working directory _matches_ the name of the configured working directory, Terraform uploads one or more parents of the local working directory, according to the depth of the configured working directory. (For example, a working directory of `production` is only one level deep, so Terraform would upload the immediate parent directory. `consul/production` is two levels deep, so Terraform would upload the parent and grandparent directories.)

If you use the working directory setting, always run Terraform from a complete copy of the configuration directory. Moving one subdirectory to a new location can result in unexpected content uploads.

## Locking

~> **Important:** Unlike other settings, locks can also be managed by users with write privileges.

If you need to prevent Terraform runs for any reason, you can lock a workspace. This prevents users with write access from manually queueing runs, prevents automatic runs due to changes to the backing VCS repo, and prevents the creation of runs via the API. To enable runs again, a user must unlock the workspace.

Locking a workspace also restricts state uploads. In order to upload state, the workspace must be locked by the user who is uploading state.

~> **Important:** [The `atlas` backend][atlas-backend] ignores this restriction, and allows users with write access to modify state when the workspace is locked. To prevent confusion and accidents, avoid using the `atlas` backend in normal workflows and use the `remote` backend instead; see [Terraform Cloud's CLI-driven workflow](../run/cli.html) for details.

[atlas-backend]: /docs/backends/types/terraform-enterprise.html

Users with write access can lock and unlock a workspace, but can't unlock a workspace which was locked by another user. Users with admin privileges can force unlock a workspace even if another user has locked it.

Locks are managed with a single "Lock/Unlock/Force unlock `<WORKSPACE NAME>`" button. Terraform Cloud asks for confirmation when unlocking.

## Notifications

The "Notifications" page allows Terraform Cloud to send webhooks to external services whenever specific run events occur in a workspace.

See [Run Notifications](./notifications.html) for detailed information about configuring notifications.

## SSH Key

If a workspace's configuration uses [Git-based module sources](/docs/modules/sources.html) to reference Terraform modules in private Git repositories, Terraform needs an SSH key to clone those repositories. The "SSH Key" page lets you choose which key it should use.

See [Using SSH Keys for Cloning Modules](./ssh-keys.html) for detailed information about this page.

## Team Access

The "Team Access" page configures which teams can perform which actions on a workspace.

See [Managing Access to Workspaces](./access.html) for detailed information.

## Version Control

The "Version Control" page configures an optional VCS repository that contains the workspace's Terraform configuration. Version control integration is only relevant for workspaces with [remote execution](#execution-mode) enabled.

See [VCS Connections](./vcs.html) for detailed information about this page.

## Destruction and Deletion

This page includes two buttons:

- "Queue destroy Plan"
- "Delete from Terraform Cloud"

In almost all cases, you should perform both actions in that order when destroying a workspace.

Queueing a destroy plan destroys the infrastructure managed by a workspace. If you don't do this, the infrastructure resources will continue to exist but will become unmanaged; you'll need to go into your infrastructure providers to delete the resources manually.

Before queueing a destroy plan, you must go to the workspace's [variables page](./variables.html) and set an environment variable with a name of `CONFIRM_DESTROY` and a value of `1`.
