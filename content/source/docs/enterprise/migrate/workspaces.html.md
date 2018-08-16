---
layout: enterprise2
page_title: "Migrating Multiple Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-migrating-workspaces"
---

[cli-workspaces]: /docs/state/workspaces.html
[user-token]: ../users-teams-organizations/users.html#api-tokens
[backend]: /docs/backends/index.html
[remote-backend]: /docs/backends/types/remote.html

# Migrating State from Multiple Terraform Workspaces

Terraform can manage multiple groups of infrastructure in one working directory by [switching workspaces][cli-workspaces].

These workspaces, managed with the `terraform workspace` command, aren't the same thing as TFE's workspaces. TFE workspaces act more like completely separate working directories; CLI workspaces are just alternate state files.

If you use multiple workspaces, you'll need to migrate each one to a separate TFE workspace.

Migrating multiple workspaces is similar to [migrating a single workspace](./index.html), but it requires a different attribute in the `terraform { backend ...` block.

## Step 1: Gather Credentials, Data, and Code

Make sure you have all of the following:

- The location of the VCS repository for the Terraform configuration in question.
- A local working copy of the Terraform configuration in question.
- The existing state data. The location of the state depends on which [backend][] you've been using:
    - If you were using the `local` backend, your state is files on disk. You need the original working directory where you've been running Terraform, or a copy of the `terraform.tfstate` and `terraform.tfstate.d` files to copy into a fresh working directory.
    - For remote backends, you need the path to the particular storage being used (usually already included in the configuration) and access credentials (which you usually must set as an environment variable).
- A TFE user account which is a member of your organization's owners team, so you can create workspaces.
- A [user API token][user-token] for your TFE user account. (Organization and team tokens will not work; the token must be associated with an individual user.)

    In your shell, set a `TFE_TOKEN` environment variable with your API token as the value.

    ``` bash
    export TFE_TOKEN=<USER TOKEN>
    ```

## Step 2: Stop Terraform Runs

However you currently run Terraform to manage this infrastructure, stop. Let any current runs finish, then make sure there won't be more.

This might involve locking or deleting CI jobs, restricting access to the state backend, or just communicating very clearly with your colleagues.

## Step 3: Prepare Your Terraform Working Directory

In your shell, go to the directory with the Terraform configuration you're migrating.

- If you've already been doing Terraform runs in this directory, you should be ready to go.
- If you had to retrieve state files from elsewhere, copy them into the root of the working directory and run `terraform init`.
- If you use a remote backend and had to check out a fresh working directory from version control, run `terraform init`.

## Step 4: Edit the Backend Configuration

If the Terraform configuration has an existing backend block, delete it now.

Add a `terraform { backend ...` block to the configuration.

``` hcl
terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "my-org"

    workspaces {
      prefix = "my-app-"
    }
  }
}
```

- Use the `remote` backend.
- In the `organization` attribute, specify the name of your TFE organization.
- The `hostname` attribute is only necessary with private TFE instances. You can omit it if you're using the SaaS version of TFE.
- In the `prefix` attribute in the `workspaces` block, specify a prefix to use when naming newly created TFE workspaces. Terraform will concatenate the prefix with the name of your local workspaces. See [the remote backend documentation][remote-backend] for details.

## Step 5: Run `terraform init` and Answer "Yes"

Run `terraform init`.

The init command will offer to migrate the previous states to a new TFE workspaces. The prompt usually looks like this:

```
Do you want to migrate all workspaces to "remote"?
  Both the existing "local" backend and the newly configured "remote" backend support
  workspaces. When migrating between backends, Terraform will copy all
  workspaces (with the same names). THIS WILL OVERWRITE any conflicting
  states in the destination.

  Terraform initialization doesn't currently migrate only select workspaces.
  If you want to migrate a select number of workspaces, you must manually
  pull and push those states.

  If you answer "yes", Terraform will migrate all states. If you answer
  "no", Terraform will abort.
```

Answer "yes," and Terraform will migrate your state.

## Step 6: Configure the TFE Workspaces

Make any settings changes necessary for your new workspaces.

- Set the VCS repository
- Set variable values appropriately
- Set team access permissions

## Step 7: Queue Runs in the New Workspaces

In TFE, queue a plan in the new workspaces. Examine the results.

If all went well, the plan should result in no changes or very small changes. TFE can now take over all Terraform runs for this infrastructure.

## Troubleshooting

- If the plan would create an entirely new set of infrastructure resources, you probably have the wrong state file.

    In the case of a wrong state file, you can recover by fixing your local working directory and trying again. You'll need to re-set to the local backend, run `terraform init`, replace the state file with the correct one, change back to the `atlas` backend, run `terraform init` again, and confirm that you want to replace the remote state with the current local state.
- If the plan recognizes the existing resources but would make unexpected changes, check whether the designated VCS branch for the workspace is the same branch you've been running Terraform on, and update it, if it is not. You can also check whether variables in the TFE workspace have the correct values.
- If you try to migrate state into a workspace which already exists in TFE and already has state, Terraform will indicate that you can overwrite your existing state in TFE. However, this will not work and result in a state mismatched lineage conflict.
