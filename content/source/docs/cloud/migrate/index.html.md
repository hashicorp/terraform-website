---
layout: "cloud"
page_title: "Migrating State from Local Terraform - Terraform Cloud and Terraform Enterprise"
---

[state]: /docs/state/index.html
[backend]: /docs/backends/index.html
[backend-config]: /docs/backends/config.html
[cli-workspaces]: /docs/state/workspaces.html
[user-token]: ../users-teams-organizations/users.html#api-tokens
[remote-backend]: /docs/backends/types/remote.html
[cli-credentials]: /docs/commands/cli-config.html#credentials
[owners team]: ../users-teams-organizations/teams.html#the-owners-team
[workspaces]: ../workspaces/index.html

# Migrating State from Local Terraform

> For a hands-on tutorial, try the [Migrate State to Terraform Cloud](https://learn.hashicorp.com/terraform/state/tfc_migration?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) guide on HashiCorp Learn.

If you already use Terraform to manage infrastructure, you're probably managing some resources that you want to transfer to Terraform Cloud. By migrating your Terraform [state][] to Terraform Cloud, you can continue managing that infrastructure without de-provisioning anything.

These reference docs describe the process for migrating state. To practice using a hands-on, step-by-step example follow the [HashiCorp Learn guide](https://learn.hashicorp.com/terraform/tfc/tfc_migration?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS).

~> **Important:** These instructions are for migrating state in a basic working directory that only uses the `default` workspace. If you use multiple [workspaces][cli-workspaces] in one working directory, the instructions are different; see [Migrating State from Multiple Terraform Workspaces](./workspaces.html) instead.

-> **API:** See the [State Versions API](../api/state-versions.html). Be sure to stop Terraform runs before migrating state to Terraform Cloud, and only import state into Terraform Cloud workspaces that have never performed a run.

## Step 1: Ensure Terraform ≥ 0.11.13 is Installed

To follow these instructions, you need Terraform 0.11.13 or later on the workstation where you are performing the migration. In older versions, [the `remote` backend][remote-backend] is either absent or only partially supported.

## Step 2: Gather Credentials, Data, and Code

Make sure you have all of the following:

- The location of the VCS repository for the Terraform configuration in question.
- A local working copy of the Terraform configuration in question.
- The existing state data. The location of the state depends on which [backend][] you've been using:
    - If you were using the default `local` backend, your state is a file on disk. You need the original working directory where you've been running Terraform, or a copy of the `terraform.tfstate` file to copy into a fresh working directory.
    - For other backends, you need the path to the particular storage being used (usually already included in the configuration) and access credentials (which you usually must set as an environment variable).
- A Terraform Cloud user account.

    This account must have permission to manage workspaces for the organization. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

You also need to authenticate Terraform with Terraform Cloud.  If you're using Terraform 0.12.21 or later, you can use the `terraform login` command. Alternatively, you can create a [user API token][user-token] and [manually configure credentials in the CLI config file][cli-credentials].

## Step 3: Stop Terraform Runs

However you currently run Terraform to manage this infrastructure, stop. Let any current runs finish, then make sure there won't be more.

This might involve locking or deleting CI jobs, restricting access to the state backend, or just communicating very clearly with your colleagues.

## Step 4: Prepare Your Terraform Working Directory

In your shell, go to the directory with the Terraform configuration you're migrating.

- If you've already been doing Terraform runs in this directory, you should be ready to go.
- If you had to retrieve a `terraform.tfstate` file from elsewhere, copy it into the root of the working directory and run `terraform init`.
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
      name = "my-workspace"
    }
  }
}
```

- Use the `remote` backend.
- In the `organization` attribute, specify the name of your Terraform Cloud organization.
- The `hostname` attribute is only necessary with Terraform Enterprise instances. You can omit it if you're using the SaaS version of Terraform Cloud.
- In the `name` attribute in the `workspaces` block, specify the name of a new [Terraform Cloud workspace][workspaces] to create with your state. Make sure your organization doesn't already have a workspace with this name.

For more details about this configuration block, see [the remote backend documentation][remote-backend].

## Step 6: Run `terraform init` to Migrate the Workspace

Run `terraform init`.

The init command will offer to migrate the previous state to a new Terraform Cloud workspace. The prompt usually looks like this:

```
Do you want to copy existing state to the new backend?
  Pre-existing state was found while migrating the previous "local" backend to the
  newly configured "remote" backend. No existing state was found in the newly
  configured "remote" backend. Do you want to copy this state to the new "remote"
  backend? Enter "yes" to copy and "no" to start with an empty state.
```

Answer "yes," and Terraform will migrate your state.

## Step 7: Configure the Terraform Cloud Workspace

In Terraform Cloud's UI, make any settings changes necessary for your new workspace.

- [Set the VCS repository](../workspaces/vcs.html#vcs-connection-and-repository). This is optional, but enables automatic Terraform runs on code changes and automatic plans on pull requests. For more information, see [The UI- and VCS-driven Run Workflow](../run/ui.html).
- [Set values for variables](../workspaces/variables.html).
- [Set team access permissions](../workspaces/access.html).

## Step 8: Queue a Run in the New Workspace

Either run `terraform plan` on the CLI or navigate to the workspace in Terraform Cloud's UI and [queue a plan](../run/ui.html#starting-runs). Examine the results.

If all went well, the plan should result in no changes or very small changes. Terraform Cloud can now take over all Terraform runs for this infrastructure.

## Troubleshooting

- If the plan would create an entirely new set of infrastructure resources, you probably have the wrong state file.

    In the case of a wrong state file, you can recover by fixing your local working directory and trying again. You'll need to re-set to the local backend, run `terraform init`, replace the state file with the correct one, change back to the `remote` backend, run `terraform init` again, and confirm that you want to replace the remote state with the current local state.
- If the plan recognizes the existing resources but would make unexpected changes, check whether the designated VCS branch for the workspace is the same branch you've been running Terraform on; if not, update it. You can also check whether variables in the Terraform Cloud workspace have the correct values.
