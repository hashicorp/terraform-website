---
layout: enterprise2
page_title: "Migrating Multiple Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-migrating-workspaces"
---

[cli-workspaces]: /docs/state/workspaces.html
[user-token]: ../users-teams-organizations/users.html#api-tokens
[backend]: /docs/backends/index.html


# Migrating State from Multiple Terraform Workspaces

Terraform can manage multiple groups of infrastructure in one working directory by [switching workspaces][cli-workspaces].

These workspaces, managed with the `terraform workspace` command, aren't the same thing as TFE's workspaces. TFE workspaces act more like completely separate working directories; CLI workspaces are just alternate state files.

If you use multiple workspaces, you'll need to migrate each one to a separate TFE workspace.

Migrating multiple workspaces is similar to [migrating a single workspace](./index.html), but it requires some extra steps.

## Step 1: Gather Credentials, Data, and Code

Make sure you have all of the following:

- The location of the VCS repository for the Terraform configuration in question.
- A local working copy of the Terraform configuration in question.
- The existing state data. The location of the state depends on which [backend][] you've been using:
    - If you were using the `local` backend, your state is files on disk. You need the original working directory where you've been running Terraform, or a copy of the `terraform.tfstate` and `terraform.tfstate.d` files to copy into a fresh working directory.
    - For remote backends, you need the path to the particular storage being used (usually already included in the configuration) and access credentials (which you usually must set as an environment variable).
- A TFE user account which is a member of your organization's owners team, so you can create workspaces.
- A [user API token][user-token] for your TFE user account. (Organization and team tokens will not work; the token must be associated with an individual user.)

    In your shell, set an `ATLAS_TOKEN` environment variable with your API token as the value.

    ``` bash
    export ATLAS_TOKEN=<USER TOKEN>
    ```

## Step 2: Create New TFE Workspaces

For each workspace you're migrating, create a new workspace in your TFE organization to take over management of the infrastructure. Set the VCS repository and any necessary variable values appropriately. You can set team access permissions now or later, whichever is more convenient.

**Do not perform any runs in these workspaces yet,** and consider locking them to be sure. If an apply happens prematurely, you'll need to destroy the workspace and start the process over.

## Step 3: Stop Terraform Runs

However you currently run Terraform to manage this infrastructure, stop. Let any current runs finish, then make sure there won't be more.

This might involve locking or deleting CI jobs, restricting access to the state backend, or just communicating very clearly with your colleagues.

## Step 4: Prepare Your Terraform Working Directory

In your shell, go to the directory with the Terraform configuration you're migrating.

- If you've already been doing Terraform runs in this directory, you should be ready to go.
- If you had to retrieve state files from elsewhere, copy them into the root of the working directory and run `terraform init`.
- If you use a remote backend and had to check out a fresh working directory from version control, run `terraform init`.

## Step 5: Migrate to the `local` Backend, if Necessary

If you use a remote backend that supports multiple workspaces, migrate to the local backend now. You need copies of each state file on disk, and this is the easiest way to get them.

To migrate to `local`, delete the `terraform { backend {...` configuration block and run `terraform init`. Confirm that you want to copy existing state to the new `local` backend, even if there's already data in it. (Any existing local data is probably out of date.)

## Step 6: Back Up Your State Files

Copy the following files to outside your working directory:

- `terraform.tfstate`
- `terraform.tfstate.d` (directory)

It's easy to delete data when switching backends and workspaces, and the local copy of the `default` workspace's state is usually deleted during the next steps. Save copies now in case you need to start over.

## Step 7: Switch to the `default` Workspace

If you're not currently on the `default` workspace, run `terraform workspace select default` to activate it.

## Step 8: Set the Backend Configuration for the Default Workspace

Add a `terraform { backend ...` block to the configuration. Specify the TFE workspace that corresponds to the `default` workspace.

``` hcl
terraform {
  backend "atlas" {
    name = "<TFE ORG>/<WORKSPACE NAME>"
    address = "https://<TFE HOSTNAME>"
  }
}
```

- Use the `atlas` backend. (This is TFE's backend; the Atlas name is used here for historical reasons.)
- In the `name` attribute, specify the name of your TFE organization and the target workspace, separated by a slash. (For example, `example_corp/database-prod`.)
- The `address` attribute is only necessary with private TFE instances. You can omit it if you're using the SaaS version of TFE.

~> **Note:** The `atlas` backend block is temporary; it isn't needed once TFE takes over Terraform runs. It's easiest to put the backend block in a separate `backend.tf` file which isn't checked into version control.

## Step 9: Migrate `default` by Running `terraform init`

Run `terraform init` to migrate the default workspace.

Terraform will ask two questions:

- **"Do you want to copy only your current workspace?"** Answer "yes."

    Terraform init can only handle the default workspace, so you'll use a different command for the others.
- **"Do you want to copy existing state to the new backend?"** Answer "yes."

The `default` workspace is now migrated.

You can test the migration by unlocking the corresponding TFE workspace and queueing a plan; if the plan results in no changes or very small changes, the migration probably worked correctly.

## Step 10: Edit the Backend to Change Workspaces

Edit your backend configuration, and change the `name` to the next TFE workspace you want to migrate. For example, if the next local workspace is `dev1`, its new name in TFE might be something like `example_corp/database-dev1`.

At this point, it's a good idea to use a checklist of workspaces to keep track of your progress.

## Step 11: Run `terraform init` and Answer "No"

Run `terraform init`.

When asked if you want to migrate state, **answer "no."**

```
Do you want to copy existing state to the new backend?
  Pre-existing state was found while migrating the previous "atlas" backend to the
  newly configured "atlas" backend. No existing state was found in the newly
  configured "atlas" backend. Do you want to copy this state to the new "atlas"
  backend? Enter "yes" to copy and "no" to start with an empty state.
```

If you answer yes, Terraform will copy the state from the last workspace you migrated, which is not what you want.

## Step 12: Run `terraform state push <FILE>`

Locate the state file for the workspace you want to migrate. Its local path should be something like `./terraform.tfstate.d/<WORKSPACE NAME>/terraform.tfstate`.

Run `terraform state push ./terraform.tfstate.d/<WORKSPACE NAME>/terraform.tfstate`.

The workspace is now migrated. You can check the migration by unlocking the TFE workspace and queuing a plan.

## Step 13: Repeat Steps 10-12 as Needed

Repeat the last three steps for each remaining workspace, until every workspace is migrated.

## Step 14: Enable Runs in the New Workspaces

After checking the results of the migrations, unlock each new workspace to allow TFE to take over management of this infrastructure.

