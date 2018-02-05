---
layout: enterprise2
page_title: "Migrating from Terraform Open Source - Terraform Enterprise"
sidebar_current: "docs-enterprise2-migrating"
---

[state]: /docs/state/index.html
[backend]: /docs/backends/index.html
[cli-workspaces]: /docs/state/workspaces.html
[user-token]: ../users-teams-organizations/users.html#api-tokens

# Migrating State from Terraform Open Source

If you already use Terraform to manage infrastructure, you're probably managing some infrastructure that you want to transfer to Terraform Enterprise (TFE). By migrating your Terraform [state][] to TFE, you can hand off infrastructure without de-provisioning anything.

This page gives some brief background on managing state, and provides instructions for migrating.

## Background

### What State Does

A Terraform configuration describes a desired set of infrastructure resources, and Terraform uses [state data][state] to track which real-world resources they correspond to. When the configuration changes, Terraform checks the state to decide which real resources to modify (or destroy, or re-create if they were destroyed out-of-band).

Terraform usually handles state transparently, but whenever you _transfer control_ of some existing infrastructure (whether to someone else's laptop, or into a shared run environment like TFE) you must handle state explicitly. So if you're moving your Terraform runs from the CLI (or a CI system) into TFE, you probably have to migrate your state.

### Where State is Stored

Terraform always uses a [backend][], which determines where state gets stored.

By default, Terraform uses the `local` backend, which stores state in the configuration's working directory as a `terraform.tfstate` file. Backends other than `local` are collectively called "remote backends," and they include `atlas` (the Terraform Enterprise backend), `s3`, `consul`, and more.

If you're using a remote backend, your configuration includes a block that looks like this:

``` hcl
terraform {
  backend "<NAME>" {
    # ...attributes...
  }
}
```

### Multiple Workspaces

Terraform can manage multiple groups of infrastructure in one working directory by [switching workspaces][cli-workspaces].

These workspaces, managed with the `terraform workspace` command, aren't the same thing as TFE's workspaces. TFE workspaces act more like completely separate working directories; CLI workspaces are just alternate state files.

If you use multiple workspaces, you'll need to migrate each one to a separate TFE workspace. This involves extra steps; see below.


## Migrating State

These instructions are for migrating state in a basic working directory that only uses the default workspace.

Some steps must be performed on the command line.

The short instructions for migrating are to change your configuration's `backend` block to use TFE's `atlas` backend, then run `terraform init`. In the longer instructions, we attempt to cover most of the edge cases and easy-to-forget requirements.

### Step 1: Gather Credentials, Data, and Code

Make sure you have all of the following:

- The location of the VCS repository for the Terraform configuration in question.
- A local working copy of the Terraform configuration in question.
- The existing state data.
    - If you were using the `local` backend, you need the original working directory where you've been running Terraform, or a copy of the `terraform.tfstate` file to copy into a fresh working directory.
    - For remote backends, you need the path to the particular storage being used (usually already included in the configuration) and access credentials (which you usually must set as an environment variable).
- A TFE user account which is a member of your organization's owners team, so you can create workspaces.
- A [user API token][user-token] for your TFE user account. (Organization and team tokens will not work; the token must be associated with an individual user.)

    In your shell, set an `ATLAS_TOKEN` environment variable with your API token as the value.

    ``` bash
    export ATLAS_TOKEN=<USER TOKEN>
    ```

### Step 2: Create a New TFE Workspace

Create a new workspace in your TFE organization to take over management of this infrastructure. Set the VCS repository and any necessary variable values appropriately. You can set team access permissions now or later, whichever is more convenient.

**Do not perform any runs in this workspace yet,** and consider locking the workspace to be sure. If an apply happens prematurely, you'll need to destroy the workspace and start the process over.

### Step 3: Stop Terraform Runs

However you currently run Terraform to manage this infrastructure, stop. Let any current runs finish, then make sure there won't be more.

This might involve locking or deleting CI jobs, restricting access to the state backend, or just communicating very clearly with your colleagues.

### Step 4: Navigate to Your Terraform Working Directory

In your shell, go to the directory with the Terraform configuration you're migrating.

- If you've already been doing Terraform runs in this directory, you should be ready to go.
- If you had to retrieve a `terraform.tfstate` file from elsewhere, copy it into the root of the working directory and run `terraform init`.
- If you had to check out a fresh working directory from version control, run `terraform init`.

### Step 5: Edit the Backend Configuration

If the Terraform configuration has an existing backend block, delete it now.

Add a `terraform { backend ...` block to the configuration.

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

~> **Note:** The `atlas` backend block is temporary; it isn't needed once TFE takes over Terraform runs. The easiest way to handle this is to put the backend config in a separate `backend.tf` file and not check that file into version control.

### Step 6: Run `terraform init` and Answer "Yes"

Run `terraform init`.

The init command will notice that your new TFE workspace doesn't have any state, and will offer to migrate the previous state to it. The prompt usually looks like this:

```
Do you want to copy existing state to the new backend?
  Pre-existing state was found while migrating the previous "atlas" backend to the
  newly configured "atlas" backend. No existing state was found in the newly
  configured "atlas" backend. Do you want to copy this state to the new "atlas"
  backend? Enter "yes" to copy and "no" to start with an empty state.
```

Answer "yes," and Terraform will migrate your state.

After the init has finished, you can delete the temporary `atlas` backend block.

### Step 7: Enable Runs in the New Workspace

In TFE, unlock the new workspace and queue a plan. Examine the results.

If all went well, the plan should result in no changes or very small changes. TFE can now take over all Terraform runs for this infrastructure.

### Troubleshooting

- If the plan would create an entirely new set of infrastructure resources, you probably have the wrong state file. Start by investigating with whoever's been running Terraform most consistently for this infrastructure.

    In the case of a wrong state file, you can recover by fixing your local working directory and trying again. You'll need to re-set to the local backend, run `terraform init`, replace the state file with the correct one, change back to the `atlas` backend, run `terraform init` again, and confirm that you want to replace the remote state with the current local state.
- If the plan recognizes the existing resources but would make unexpected changes, check whether the designated VCS branch for the workspace is the same branch you've been running Terraform on. You can also check whether variables in the TFE workspace have the correct values.

    In the case of a wrong VCS branch, you'll need to delete and re-create the workspace, since a workspace's branch can't be changed.


