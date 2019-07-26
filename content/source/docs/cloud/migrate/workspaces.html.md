---
layout: enterprise2
page_title: "Migrating Multiple Workspaces - Terraform Enterprise"
---

[cli-workspaces]: /docs/state/workspaces.html
[user-token]: ../users-teams-organizations/users.html#api-tokens
[backend]: /docs/backends/index.html
[remote-backend]: /docs/backends/types/remote.html
[cli-credentials]: /docs/commands/cli-config.html#credentials

# Migrating State from Multiple Terraform Workspaces

Terraform can manage multiple groups of infrastructure in one working directory by [switching workspaces][cli-workspaces].

These workspaces, managed with the `terraform workspace` command, aren't the same thing as Terraform Enterprise (TFE)'s workspaces. TFE workspaces act more like completely separate working directories; CLI workspaces are just alternate state files.

If you use multiple workspaces, you'll need to migrate each one to a separate TFE workspace.

Migrating multiple workspaces is similar to [migrating a single workspace](./index.html), but it requires a slightly different backend configuration.

-> **API:** See the [State Versions API](../api/state-versions.html). Be sure to stop Terraform runs before migrating state to TFE, and only import state into TFE workspaces that have never performed a run.

## Step 1: Ensure Terraform ≥ 0.11.13 is Installed

To follow these instructions, you need Terraform 0.11.13 or later on the workstation where you are performing the migration. In older versions, [the `remote` backend][remote-backend] is either absent or only partially supported.

## Step 2: Gather Credentials, Data, and Code

Make sure you have all of the following:

- The location of the VCS repository for the Terraform configuration in question.
- A local working copy of the Terraform configuration in question.
- The existing state data. The location of the state depends on which [backend][] you've been using:
    - If you were using the `local` backend, your state is files on disk. You need the original working directory where you've been running Terraform, or a copy of the `terraform.tfstate` and `terraform.tfstate.d` files to copy into a fresh working directory.
    - For remote backends, you need the path to the particular storage being used (usually already included in the configuration) and access credentials (which you usually must set as an environment variable).
- A TFE user account.

    This account must be a member of your organization's [owners team][], so you can create workspaces.
- A [user API token][user-token] for your TFE user account.
- A [CLI configuration file][cli-credentials], with your user API token configured in a `credentials` block.

## Step 3: Stop Terraform Runs

However you currently run Terraform to manage this infrastructure, stop. Let any current runs finish, then make sure there won't be more.

This might involve locking or deleting CI jobs, restricting access to the state backend, or just communicating very clearly with your colleagues.

## Step 4: Prepare Your Terraform Working Directory

In your shell, go to the directory with the Terraform configuration you're migrating.

- If you've already been doing Terraform runs in this directory, you should be ready to go.
- If you had to retrieve state files from elsewhere, copy them into the root of the working directory and run `terraform init`.
- If you use a remote backend and had to check out a fresh working directory from version control, run `terraform init`.

## Step 5: Edit the Backend Configuration

If the Terraform configuration has an existing [backend configuration block][backend-config], delete it now.

Add a new backend block to the configuration:

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
- In the `prefix` attribute in the `workspaces` block, specify a prefix to use when naming newly created TFE workspaces. You'll use short workspace names on the CLI, and long workspace names with the prefix added in TFE's UI and API. See [the remote backend documentation][remote-backend] for details.

## Step 6: Run `terraform init` to Migrate the Workspaces

Run `terraform init`.

The init command will offer to migrate each previous state to a new TFE workspace. The prompt usually looks like this:

```
Initializing the backend...
Do you want to migrate all workspaces to "remote"?
  Both the existing "local" backend and the newly configured "remote" backend
  support workspaces. When migrating between backends, Terraform will copy
  all workspaces (with the same names). THIS WILL OVERWRITE any conflicting
  states in the destination.

  Terraform initialization doesn't currently migrate only select workspaces.
  If you want to migrate a select number of workspaces, you must manually
  pull and push those states.

  If you answer "yes", Terraform will migrate all states. If you answer
  "no", Terraform will abort.

  Enter a value:
```

Answer "yes".

Some backends, including the default `local` backend, allow a special `default` workspace that doesn't have a specific name. If you previously used a combination of named workspaces and the special `default` workspace, the prompt will next ask you to choose a new name for the `default` workspace, since TFE doesn't support unnamed workspaces:

```
The "remote" backend configuration only allows named workspaces!
  Please provide a new workspace name (e.g. dev, test) that will be used
  to migrate the existing default workspace.

  Enter a value:
```

After both questions are answered, Terraform will migrate your state.

## Step 7: Configure the TFE Workspaces


In Terraform Enterprise's UI, make any settings changes necessary for your new workspaces.

- [Set the VCS repository](../workspaces/settings.html#vcs-connection-and-repository). This is optional, but enables automatic Terraform runs on code changes and automatic plans on pull requests. For more information, see [The UI- and VCS-driven Run Workflow](../run/ui.html).
- [Set values for variables](../workspaces/variables.html).
- [Set team access permissions](../workspaces/access.html).

## Step 8: Queue Runs in the New Workspaces

For each migrated workspace, either run `terraform plan` on the CLI or navigate to the workspace in TFE's UI and [queue a plan](../run/ui.html#starting-runs). Examine the results.

If all went well, each plan should result in no changes or very small changes. TFE can now take over all Terraform runs for this infrastructure.

## Troubleshooting

- If the plan would create an entirely new set of infrastructure resources, you probably have the wrong state file.

    In the case of a wrong state file, you can recover by fixing your local working directory and trying again. You'll need to re-set to the local backend, run `terraform init`, replace the state file with the correct one, change back to the `atlas` backend, run `terraform init` again, and confirm that you want to replace the remote state with the current local state.
- If the plan recognizes the existing resources but would make unexpected changes, check whether the designated VCS branch for the workspace is the same branch you've been running Terraform on, and update it, if it is not. You can also check whether variables in the TFE workspace have the correct values.
