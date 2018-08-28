---
layout: "enterprise2"
page_title: "Runs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-run"
---

# About Terraform Runs in Terraform Enterprise

Terraform Enterprise (TFE) provides a central interface for running Terraform within a large collaborative organization. If you're accustomed to running Terraform from your workstation, the way TFE manages runs can be unfamiliar.

This page describes the basics of what a run is in TFE. Once you understand the basics, you can read about:

- The [UI/VCS-driven run workflow](./ui.html), which is TFE's primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The [CLI-driven run workflow](./cli.html), which is the API-driven workflow with a user-friendly command line tool.

## Plans and Applies

TFE enforces Terraform's division between _plan_ and _apply_ operations. It always plans first, saves the plan's output, and uses that output for the apply. In the default configuration, it waits for user approval before running an apply, but you can configure workspaces to automatically apply successful plans.

## Network Access to VCS and Infrastructure Providers

In order to perform Terraform runs, TFE needs network access to all of the resources being managed by Terraform.

If you are using the SaaS version of TFE, this means your VCS provider and any private infrastructure providers you manage with Terraform (including VMware vSphere, OpenStack, other private clouds, and more) _must be internet accessible._

Private installs of TFE must have network connectivity to any connected VCS providers or managed infrastructure providers.

## Runs and Workspaces

TFE always performs Terraform runs in the context of a [workspace](./index.html). The workspace provides the state and variables for the run, and usually specifies where the configuration should come from.

Each workspace in TFE maintains its own queue of runs, and processes those runs in order.

Whenever a new run is initiated, it's added to the end of the queue. If there's already a run in progress, the new run won't start until the current one has completely finished — TFE won't even plan the run yet, because the current run might change what a future run would do. Runs that are waiting for other runs to finish are in a _pending_ state, and a workspace might have any number of pending runs.

When you initiate a run, TFE locks the run to the current Terraform code (usually associated with a specific VCS commit) and variable values. If you change variables or commit new code before the run finishes, it will only affect future runs, not ones that are already pending, planning, or awaiting apply.

## Workers and Run Queuing

TFE performs Terraform runs in disposable Linux environments, using multiple concurrent worker processes. These workers take jobs from a global queue of runs that are ready for processing; this includes confirmed applies, and plans that have just become the current run on their workspace.

If the global queue has more runs than the workers can handle at once, some of them must wait until a worker becomes available. When the queue is backed up, TFE gives different priorities to different kinds of runs:

- Applies that will make changes to infrastructure have the highest priority.
- Normal plans have the next highest priority.
- Plan-only runs (used in pull request checks) have the lowest priority.

TFE can also delay some runs in order to make performance more consistent across organizations. If an organization requests a large number of runs at once, TFE queues some of them immediately, and delays the rest until some of the initial batch have finished; this allows every organization to continue performing runs even during periods of especially heavy load.

## Run States

Each run passes through several stages of action (pending, plan, policy check, apply, and completion), and TFE shows the progress through those stages as run states.

In the list of workspaces on TFE's main page, each workspace shows the state of the run it's currently processing. (Or, if no run is in progress, the state of the most recent completed run.)

For full details about the stages of a run under TFE, see [Run States and Stages](./states.html).

## Interacting with Runs

Each workspace has three always-visible tools for working with runs:

- A "Queue Plan" button, in the upper right.
- A "Runs" link, which goes to the full list of runs.
- A "Current Run" link, which goes to the most recent active run. (This might not be the most recently initiated run, since runs in the "pending" state remain inactive until the current run is completed.)

![runs list](./images/runs-list.png)

From the list of runs, you can click to view or interact with an individual run.

### The Run Page

An individual run page shows the progress and outcomes of each stage of the run.

![a run page](./images/runs-run-page.png)

Most importantly, it shows:

- The current status of the run.
- The code commit associated with the run.
- How the run was initiated, when, and which user initated it (if applicable).
- A timeline of events related to the run.
- The output from both the `terraform plan` and `terraform apply` commands, if applicable. You can hide or reveal these as needed; they default to visible if the command is currently running, and hidden if the command has finished.

If the run is still in progress and you have write access to the workspace, there are controls for interacting with the run at the bottom of the page. Depending on the state of the run, the following buttons might be available:

- A "Cancel Run" button, if a plan or apply is currently running.
- "Confirm & Apply" and "Discard Plan" buttons, if a plan needs confirmation.
- An "Override Policy" button, if a soft-mandatory policy failed (only available for owners team).

## Locking Workspaces (Preventing Runs)

If you need to temporarily stop runs from being queued, you can lock the workspace.

A lock prevents TFE from performing any plans or applies in the workspace. This includes automatic runs due to new commits in the VCS repository, manual runs queued via the UI, and runs created with the API or the TFE CLI tool. New runs remain in the "Pending" state until the workspace is unlocked.

You can find the lock button in [the workspace settings page](../workspaces/settings.html). Locking a workspace requires write or admin access.

~> **Important:** Locking a workspace prevents runs within TFE, but it **does not** prevent state from being updated. This means a user with write access can still modify the workspace's resources by running Terraform outside TFE with [the `atlas` remote backend](/docs/backends/types/terraform-enterprise.html). To prevent confusion and accidents, avoid using the `atlas` backend in normal workflows; to perform runs from the command line, see [TFE's CLI-driven workflow](./cli.html).


## Installing Terraform Providers

### Providers Distributed by HashiCorp

TFE runs `terraform init` before every plan or apply, which automatically downloads any [providers](/docs/configuration/providers.html) Terraform needs.

Private installs of TFE can automatically install providers as long as they can access registry.terraform.io. If that isn't feasible due to security requirements, you can manually install providers. Use [the `terraform-bundle` tool][bundle] to build a custom version of Terraform that includes the necessary providers, and configure your workspaces to use that bundled version.

[bundle]: https://github.com/hashicorp/terraform/tree/master/tools/terraform-bundle#installing-a-bundle-in-on-premises-terraform-enterprise

### Custom and Community Providers

-> **Note:** We are investigating how to improve custom provider installation, so this information might change in the near future.

Terraform only automatically installs plugins from [the main list of providers](/docs/providers/index.html); to use community providers or your own custom providers, you must install them yourself.

Currently, there are two ways to use custom provider plugins with TFE.

- Add the provider binary to the VCS repo (or manually-uploaded configuration version) for any workspace that uses it. Place the compiled `linux_amd64` version of the plugin at `terraform.d/plugins/linux_amd64/<PLUGIN NAME>` (as a relative path from the root of the working directory).

    You can add plugins directly to a configuration repo, or you can add them as Git submodules and symlink the files into `terraform.d/plugins/linux_amd64/`. Submodules are a good choice when many workspaces use the same custom provider, since they keep your repos smaller. If using submodules, enable the ["Include submodules on clone" setting](../workspaces/settings.html#include-submodules-on-clone) on any affected workspace.

- **Private TFE only:** Use [the `terraform-bundle` tool][bundle] to add custom providers to a custom Terraform version. This keeps custom providers out of your configuration repos entirely, and is easier to update when many workspaces use the same provider.

## Terraform State in TFE

Each TFE workspace has its own separate state data. In order to read and write state for the correct workspace, TFE overrides any configured [backend](/docs/backends/index.html) when running Terraform.

You can view current and historical state data for a workspace from its "States" tab. Each state in the list indicates which run and which VCS commit (if applicable) it was associated with. You can click a state in the list for more details, including a diff against the previous state and a link to the raw state file.

### Cross-Workspace State Access

In your Terraform configurations, you can use a [`terraform_remote_state` data source](/docs/providers/terraform/d/remote_state.html) to access [outputs](/docs/configuration/outputs.html) from your other workspaces.

~> **Important:** A given workspace can only access state data from within the same organization. If you plan to use multiple TFE organizations, make sure to keep groups of workspaces that use each other's data together in the same organization.

To configure a data source for a TFE workspace, set `backend` to `atlas` and `config.name` to `<ORGANIZATION>/<WORKSPACE>`.

``` hcl
data "terraform_remote_state" "vpc" {
  backend = "atlas"
  config {
    name = "example_corp/vpc-prod"
  }
}

resource "aws_instance" "redis_server" {
  # ...
  subnet_id = "${data.terraform_remote_state.vpc.subnet_id}"
}
```

### Backend Details

TFE uses [the `atlas` backend](/docs/backends/types/terraform-enterprise.html) to exchange state data with the Terraform process during runs. The `atlas` backend requires an access token, provided via the `$ATLAS_TOKEN` environment variable. When you run Terraform from the command line, you can use a [user API token](../users-teams-organizations/users.html#api-tokens) with write permissions on the desired workspace.

When TFE performs a run, it doesn't use existing user credentials; instead it generates a unique per-run API token, and exports it to the Terraform worker's shell environment as `$ATLAS_TOKEN`. This per-run token can read and write state data for the workspace associated with the run, and can read state data from any other workspace in the same organization. It cannot make any other calls to the TFE API. Per-run tokens are not considered to be user, team, or organization tokens, and become invalid after the run is completed.

