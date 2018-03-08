---
layout: enterprise2
page_title: "Upgrading - Terraform Enterprise"
sidebar_current: "docs-enterprise2-upgrading"
---

# Upgrading From Terraform Enterprise (Legacy)

If you used the legacy version of Terraform Enterprise (TFE), you probably have some older environments that aren't available in the new version. You can transfer control of that infrastructure to the new Terraform Enterprise without having to re-provision anything.

Follow these steps to migrate your old TFE environments to new TFE workspaces.

## 1. Create a New Organization

You can't use the new TFE with a legacy organization because the internals are too different. If you don't already have an organization in the new TFE, [create an organization](../getting-started/access.html#creating-an-organization) and [configure version control access](../vcs/index.html) now. Organization names must be globally unique, so you must choose a new organization name.

## 2. Create New Workspaces

TFE can't automatically import legacy environments, so start by [creating a new workspace](../getting-started/workspaces.html#creating-a-workspace) for each legacy environment. Workspace names are unique to the organization, so you can re-use the same names for the new workspaces.

When you create these workspaces: _do_ link them to the same VCS repo as the corresponding environment, but _don't_ allow any applies to occur yet. If other people are likely to commit to the repo before you've finished, you might want to lock the workspace so it doesn't create a bunch of inaccurate plans.

-> **Note**: If the organization has more workspaces than you can easily create with the UI, use the [workspace create API](../api/workspaces.html) to automate this process.

## 3. Migrate State

Each TFE workspace has its own remote backend, and TFE overrides the configuration to use that backend whenever it does a run. To transfer control of your infrastructure, you must migrate state from the legacy environment to the new workspace.

### 3.a. Authenticate the CLI

From **User Settings** > **Tokens** obtain the API key and set the environment variable `ATLAS_TOKEN`.

```bash
export ATLAS_TOKEN=<YOUR_API_TOKEN>
```

### 3.b. Configure the Backend for the Legacy Environment

In most cases the backend is already configured to use the legacy environment. If the CLI commands `push`, `plan`, `apply`, or `state` were ever used, this block is already configured as needed.

If a remote backend is not already configured with the TFE legacy environment, add the `backend` configuration block.

```terraform
terraform {
  backend "atlas" {
    name = "<LEGACY_ORG>/<SOURCE_ENVIRONMENT>"
  }
}
```

### 3.c. Reinitialize Terraform

Reinitialize Terraform to ensure your working directory is up to date, especially if you just added backend configuration.

```bash
terraform init
```

### 3.d. Reconfigure the Backend for the New Workspace

Update the `name` field of the `backend` block to reference the new workspace.

```terraform
terraform {
  backend "atlas" {
    name = "<NEW_ORG>/<DESTINATION_WORKSPACE>"
  }
}
```

### 3.e. Reinitialize Terraform Again

Terraform's `init` command automatically migrates state from the legacy environment to the new workspace when the [backend is reconfigured](../../backends/config.html#changing-configuration). Run the `init` command, and it will ask to migrate the state. Answer `yes`.

```bash
terraform init
```

## 4. Set Variables in the New Workspace

Open two side-by-side browser windows. In one of them, navigate to the new workspace you created and click on the "Variables" tab. In the other, navigate to the legacy environment you're migrating and view its variables.

Copy the old environment's variables and values to the new workspace, ensuring that all of the values are identical.

### 4.a. Set `ATLAS_TOKEN` (Optional)

~> **Important:** This step is **only** for configurations that access state from a legacy TFE environment using a `terraform_remote_state` data source. If this environment doesn't do that, skip to the next step.

TFE usually makes it easy to share state data between workspaces by automatically handling authentication. However, this only works _within_ a single organization, and your legacy environments are in a separate organization from your new workspaces. If your Terraform configuration accesses remote state from a legacy TFE environment, you must manually provide credentials until all of the relevant environments have been migrated to the new TFE.

To do this, create a new environment variable in the new workspace called `ATLAS_TOKEN` and enter a valid TFE user token that can access the environment in question. (Make sure you check the "Sensitive" checkbox to protect the token.)

If you're using this workaround during your migration process, you must do two additional steps later:

1. After migrating the environment whose state data this workspace uses, edit the configuration to reference its new workspace in your new TFE organization.
2. At the same time, edit this workspace's variables to delete the `ATLAS_TOKEN` environment variable.

Make a note of the affected workspaces as you migrate them, and update them as soon as you can after you finish migrating. If you leave an overridden value for `ATLAS_TOKEN` in place after your migration project has ended, it can interfere with other TFE features like the private module registry.

## 5. Disable VCS Integration in the Legacy Environment

Before committing and pushing the backend change to VCS, the legacy environment webhook must be disabled to prevent the configuration from running in both the legacy environment and the new workspace.

In legacy TFE, go to the Environment settings page and go to “Integrations”. In the “Version Control Integration” section click “Unlink”.

This will prevent the environment from performing a run on future commits.

## 6. Commit Backend Configuration Changes and Verify

Commit and push the changes to VCS. The following changes should occur.

- The legacy environment will **not** trigger a new run because it was disabled in the previous step.
- The new workspace will trigger a new run (plan & apply).

    ~> **Note:** If you locked the workspace while performing the migration, unlock it to enable runs.
- The plan logs should show **no changes**.

These changes verify the workspace was migrated successfully.

## 7. Delete Legacy Environment

Once the new workspace configuration is verified, you can delete the legacy environment.

The only exception is if other configurations use remote state data from the legacy environment with a `terraform_remote_state` data source. In that case, leave the legacy environment locked to prevent runs, then delete it after updating the affected configurations to use the new workspace's state data.
