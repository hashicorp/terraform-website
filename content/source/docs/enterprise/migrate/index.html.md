---
layout: enterprise2
page_title: "Migrating from Terraform Open Source - Terraform Enterprise"
sidebar_current: "docs-enterprise2-migrating"
---

[state]: /docs/state/index.html
[backend]: /docs/backends/index.html
[cli-workspaces]: /docs/state/workspaces.html
[user-token]: ../users-teams-organizations/users.html#api-tokens
[remote-backend]: /docs/backends/types/remote.html
[cli-credentials]: /docs/commands/cli-config.html#credentials

# Migrating State from Terraform Open Source

If you already use Terraform to manage infrastructure, you're probably managing some infrastructure that you want to transfer to Terraform Enterprise (TFE). By migrating your Terraform [state][] to TFE, you can hand off infrastructure without de-provisioning anything.

~> **Important:** These instructions are for migrating state in a basic working directory that only uses the `default` workspace. If you use multiple [workspaces][cli-workspaces] in one working directory, the instructions are different; see [Migrating State from Multiple Terraform Workspaces](./workspaces.html) instead.

## Step 1: Ensure Terraform ≥ 0.11.8 is Installed

To follow these instructions, you need Terraform 0.11.8 or later on the workstation where you are performing the migration. The remote backend this process relies on is not present in older versions.

## Step 2: Gather Credentials, Data, and Code

Make sure you have all of the following:

- The location of the VCS repository for the Terraform configuration in question.
- A local working copy of the Terraform configuration in question.
- The existing state data. The location of the state depends on which [backend][] you've been using:
    - If you were using the default `local` backend, your state is a file on disk. You need the original working directory where you've been running Terraform, or a copy of the `terraform.tfstate` file to copy into a fresh working directory.
    - For remote backends, you need the path to the particular storage being used (usually already included in the configuration) and access credentials (which you usually must set as an environment variable).
- A TFE user account which is a member of your organization's owners team, so you can create workspaces.
- A [user API token][user-token] for your TFE user account configured using your [CLI configuration file][cli-credentials]. (Organization and team tokens will not work; the token must be associated with an individual user.)

## Step 3: Stop Terraform Runs

However you currently run Terraform to manage this infrastructure, stop. Let any current runs finish, then make sure there won't be more.

This might involve locking or deleting CI jobs, restricting access to the state backend, or just communicating very clearly with your colleagues.

## Step 4: Prepare Your Terraform Working Directory

In your shell, go to the directory with the Terraform configuration you're migrating.

- If you've already been doing Terraform runs in this directory, you should be ready to go.
- If you had to retrieve a `terraform.tfstate` file from elsewhere, copy it into the root of the working directory and run `terraform init`.
- If you use a remote backend and had to check out a fresh working directory from version control, run `terraform init`.

## Step 5: Edit the Backend Configuration

If the Terraform configuration has an existing backend block, delete it now.

Add a `terraform { backend ...` block to the configuration.

``` hcl
terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "my-org"

    workspaces {
      name = "my-workspace"
    }
  }
}
```

- Use the `remote` backend.
- In the `organization` attribute, specify the name of your TFE organization.
- The `hostname` attribute is only necessary with private TFE instances. You can omit it if you're using the SaaS version of TFE.
- In the `name` attribute in the `workspaces` block, specify the name of a new workspace to create with your state. You should ensure that a workspace with this name does not already exist in your organization. See [the remote backend documentation][remote-backend] for details.

## Step 6: Run `terraform init` and Answer "Yes"

Run `terraform init`.

The init command will offer to migrate the previous state to a new TFE workspace. The prompt usually looks like this:

```
Do you want to copy existing state to the new backend?
  Pre-existing state was found while migrating the previous "local" backend to the
  newly configured "remote" backend. No existing state was found in the newly
  configured "remote" backend. Do you want to copy this state to the new "remote"
  backend? Enter "yes" to copy and "no" to start with an empty state.
```

Answer "yes," and Terraform will migrate your state.

## Step 7: Configure the TFE Workspace

Make any settings changes necessary for your new workspace.

- [Set the VCS repository](../workspaces/settings.html#vcs-connection-and-repository)
- [Set variable values appropriately](../workspaces/variables.html)
- [Set team access permissions](../workspaces/access.html)

## Step 8: Queue a Run in the New Workspace

In TFE, queue a plan in the new workspace. Examine the results.

If all went well, the plan should result in no changes or very small changes. TFE can now take over all Terraform runs for this infrastructure.

## Troubleshooting

- If the plan would create an entirely new set of infrastructure resources, you probably have the wrong state file.

    In the case of a wrong state file, you can recover by fixing your local working directory and trying again. You'll need to re-set to the local backend, run `terraform init`, replace the state file with the correct one, change back to the `atlas` backend, run `terraform init` again, and confirm that you want to replace the remote state with the current local state.
- If the plan recognizes the existing resources but would make unexpected changes, check whether the designated VCS branch for the workspace is the same branch you've been running Terraform on, and update it, if it is not. You can also check whether variables in the TFE workspace have the correct values.
- If you try to migrate state into a workspace which already exists in TFE and already has state, Terraform will indicate that you can overwrite your existing state in TFE. However, this will not work and result in a state mismatched lineage conflict.
