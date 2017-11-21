---
layout: enterprise2
page_title: "Upgrading - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-upgrading"
---

# Upgrading

This guide will show how to upgrade legacy **Environments** to the new **Workspaces** in Terraform Enterprise (TFE).

## 1. Create a new organization

Legacy organizations are not compatible with the new organizations, so [create an organization](../getting-started/access.html#creating-an-organization) and [configure Version Control Access](../vcs/index.html). The organization name must be globally unique, so the new organization name must be different than the legacy organization name.

## 2. Create new workspaces

The legacy environments are not compatible with new workspaces, as such, [create a new workspace](../getting-started/workspaces.html#creating-a-workspace) for each legacy environment. The workspace names are unique to the organization, so the same names can be used for workspaces as were used for legacy environments.


-> **Note**: If the organization has more workspaces than can easily be created using the UI, use the [workspace create API](../api/workspaces.html) to automate this process.

## 3. Migrate state
When Terraform Enterprise performs a run (plan & apply) it updates the configuration to use the remote backend associated with that workspace. The state must be migrated from the legacy environment to the new workspace for the workspace to use the state.

### 3.a. Authenticate the CLI

From **User Settings** > **Tokens** obtain the API key and set the environment variable `ATLAS_TOKEN`.

```bash
export ATLAS_TOKEN=<YOUR_API_TOKEN>
```

### 3.b. Configure the backend for the legacy environment

In most cases the backend will already be configured to use the legacy environment. If a remote backend is not already configured with the TFE legacy environment, add the `backend` configuration block. If the CLI commands `push`, `plan`, `apply` or the `state` subcommand were ever used, this block is already configured as it is required for those operations.


```terraform
terraform {
  backend "atlas" {
    name = "<LEGACY_ORG>/<SOURCE_ENVIRONMENT>"
  }
}
```

Reinitialize terraform with the new configuration.

```bash
terraform init
```

### 3.c. Reconfigure the backend for the new workspace

Update the `name` field of the `backend` block to the reference the new workspace.

```terraform
terraform {
  backend "atlas" {
    name = "<NEW_ORG>/<DESTINATION_WORKSPACE>"
  }
}
```

### 3.d. Automatic state migration
Terraform automatically migrates state from the legacy environment to the new workspace when the [backend is reconfigured](../../backends/config.html#changing-configuration). Run the `init` command, and it will ask to migrate the state. Answer `yes`.

```bash
terraform init
```

## 4. Disable VCS integration in legacy

Before committing and pushing the changes to VCS, the legacy environment webhook must be disabled to prevent the configuration from running in both the legacy environment and the new workspace.

Go to the Environment settings page and go to “Integrations”. In the “Version Control Integration” section click “Unlink”.

This will prevent the Environment from performing a run.

## 5. Commit backend configuration changes and verify

Commit and push the changes to VCS. The following changes should occur.

- The legacy environment will **not** trigger a new run because it was disabled in the previous step.
- The new workspace will trigger a new run (plan & apply).
- The plan logs should show **no changes**.

These changes verify the workspace was migrated successfully.

## 6. Delete legacy environment

Once the new workspace configuration is verified it is safe to delete the legacy environment.
