---
layout: "cloud"
page_title: "Terraform Runs and Remote Operations - Terraform Cloud"
---

# Terraform Runs and Remote Operations

Terraform Cloud provides a central interface for running Terraform within a large collaborative organization. If you're accustomed to running Terraform from your workstation, the way Terraform Cloud manages runs can be unfamiliar.

This page describes the basics of how runs work in Terraform Cloud.

## Remote Operations

Terraform Cloud is designed as an execution platform for Terraform, and can perform Terraform runs on its own disposable virtual machines. This provides a consistent and reliable run environment, and enables advanced features like Sentinel policy enforcement, cost estimation, notifications, version control integration, and more.

Terraform runs managed by Terraform Cloud are called _remote operations._ Remote runs can be initiated by webhooks from your VCS provider, by UI controls within Terraform Cloud, by API calls, or by Terraform CLI. When using Terraform CLI to perform remote operations, the progress of the run is streamed to the user's terminal, to provide an experience equivalent to local operations.

### Disabling Remote Operations

[execution_mode]: ../workspaces/settings.html#execution-mode

Remote operations can be disabled for any workspace by changing its ["Execution Mode" setting][execution_mode] to "Local". This causes the workspace to act only as a remote backend for Terraform state, with all execution occurring on your own workstations or continuous integration workers.

Many of Terraform Cloud's features rely on remote execution, and are not available when using local operations. This includes features like Sentinel policy enforcement, cost estimation, and notifications.

## Runs and Workspaces

Terraform Cloud always performs Terraform runs in the context of a [workspace](./index.html). The workspace serves the same role that a persistent working directory serves when running Terraform locally: it provides the configuration, state, and variables for the run.

### Configuration Versions

Each workspace is associated with a particular Terraform configuration, but that configuration is expected to change over time. Thus, Terraform Cloud manages configurations as a series of _configuration versions._

Most commonly, a workspace is linked to a VCS repository, and its configuration versions are tied to revisions in the specified VCS branch. In workspaces that aren't linked to a repository, new configuration versions can be uploaded via Terraform CLI or via the API.

### Ordering and Timing

Each workspace in Terraform Cloud maintains its own queue of runs, and processes those runs in order.

Whenever a new run is initiated, it's added to the end of the queue. If there's already a run in progress, the new run won't start until the current one has completely finished — Terraform Cloud won't even plan the run yet, because the current run might change what a future run would do. Runs that are waiting for other runs to finish are in a _pending_ state, and a workspace might have any number of pending runs.

When you initiate a run, Terraform Cloud locks the run to a particular configuration version and set of variable values. If you change variables or commit new code before the run finishes, it will only affect future runs, not runs that are already pending, planning, or awaiting apply.

## Starting Runs

Terraform Cloud has three main workflows for managing runs, and your chosen workflow determines when and how Terraform runs occur. For detailed information, see:

- The [UI/VCS-driven run workflow](./ui.html), which is the primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The [CLI-driven run workflow](./cli.html), which uses Terraform's standard CLI tools to execute runs in Terraform Cloud.

In more abstract terms, runs can be initiated by VCS webhooks, the manual "Queue Plan" button on a workspace, the standard `terraform apply` command (with the remote backend configured), and [the Runs API](../api/run.html) (or any tool that uses that API).

## Plans and Applies

Terraform Cloud enforces Terraform's division between _plan_ and _apply_ operations. It always plans first, saves the plan's output, and uses that output for the apply. In the default configuration, it waits for user approval before running an apply, but you can configure workspaces to [automatically apply](../workspaces/settings.html#auto-apply-and-manual-apply) successful plans. (Some plans can't be auto-applied, like destroy plans or plans queued by users without write permissions.)

### Speculative Plans

In addition to normal runs, Terraform Cloud can also run _speculative plans,_ to test changes to a configuration during editing and code review.

Speculative plans are plan-only runs: they show a set of possible changes (and check them against Sentinel policies), but cannot apply those changes. They can begin at any time without waiting for other runs, since they don't affect real infrastructure. Speculative plans do not appear in a workspace's list of runs; viewing them requires a direct link, which is provided when the plan is initiated.

There are three ways to run speculative plans:

- In VCS-backed workspaces, pull requests start speculative plans, and the VCS provider's pull request interface includes a link to the plan. See [UI/VCS Runs: Speculative Plans on Pull Requests](./ui.html#speculative-plans-on-pull-requests) for more details.
- With the [remote backend](/docs/backends/types/remote.html) configured, running `terraform plan` on the command line starts a speculative plan. The plan output streams to the terminal, and a link to the plan is also included.
- The runs API creates speculative plans whenever the specified configuration version is marked as speculative. See [the `configuration-versions` API](../api/configuration-versions.html#create-a-configuration-version) for more information.

## Run States

Each run passes through several stages of action (pending, plan, policy check, apply, and completion), and Terraform Cloud shows the progress through those stages as run states. In some states, the run might require confirmation before continuing or ending; see [Interacting with Runs](#interacting-with-runs) below.

In the list of workspaces on Terraform Cloud's main page, each workspace shows the state of the run it's currently processing. (Or, if no run is in progress, the state of the most recent completed run.)

For full details about the stages of a run, see [Run States and Stages][].

[Run States and Stages]: ./states.html

## Network Access to VCS and Infrastructure Providers

In order to perform Terraform runs, Terraform Cloud needs network access to all of the resources being managed by Terraform.

If you are using the SaaS version of Terraform Cloud, this means your VCS provider and any private infrastructure providers you manage with Terraform (including VMware vSphere, OpenStack, other private clouds, and more) _must be internet accessible._

Terraform Enterprise instances must have network connectivity to any connected VCS providers or managed infrastructure providers.

## Navigating Runs

-> **API:** See [the Runs API](../api/run.html).

Each workspace has two ways to view and navigate runs:

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

## Interacting with Runs

-> **API:** See [the Runs API](../api/run.html).

In workspaces where you have write permissions, run pages include controls for interacting with the run at the bottom of the page. Depending on the state of the run, the following buttons might be available:

Button              | Available when:
--------------------|----------------
Add Comment         | Always.
Confirm & Apply     | A plan needs confirmation.
Override & Continue | A soft-mandatory policy failed (only available for owners team).
Discard Run         | A plan needs confirmation or a soft-mandatory policy failed.
Cancel Run          | A plan or apply is currently running.
Force Cancel Run    | A plan or apply was canceled, but something went wrong and Terraform Cloud couldn't end the run gracefully (only available with workspace admin permissions).

If a plan needs confirmation (with [manual apply](../workspaces/settings.html#auto-apply-and-manual-apply) enabled) or a soft-mandatory policy failed, the run will remain paused until a user with appropriate permissions uses these buttons to continue or discard the run. For more details, see [Run States and Stages][].

### Canceling Runs

If a run is currently planning or applying (and you have write permissions to the workspace), you can cancel the run before it finishes, using the "Cancel Run" button on the run's page.

Canceling a run is roughly equivalent to hitting ctrl+c during a Terraform plan or apply on the CLI. The running Terraform process is sent an INT signal, which instructs Terraform to end its work and wrap up in the safest way possible. (This gives Terraform a chance to update state for any resources that have already been changed, among other things.)

In rare cases, a cancelled run can fail to end gracefully, and will continue to lock the workspace without accomplishing anything useful. These stuck runs can be **force-canceled,** which immediately terminates the running Terraform process and unlocks the workspace.

Since force-canceling can have dangerous side-effects (including loss of state and orphaned resources), it requires admin permissions on the workspace. Additionally, the "Force Cancel Run" button only appears after the normal cancel button has been used and a cool-off period has elapsed, to ensure Terraform Cloud has a chance to terminate the run safely.

## Locking Workspaces (Preventing Runs)

-> **API:** See the [Lock a Workspace endpoint](../api/workspaces.html#lock-a-workspace).

If you need to temporarily stop runs from being queued, you can lock the workspace.

A lock prevents Terraform Cloud from performing any plans or applies in the workspace. This includes automatic runs due to new commits in the VCS repository, manual runs queued via the UI, runs started on the command line with `terraform plan` and `terraform apply`, and runs created with the API. New runs remain in the "Pending" state until the workspace is unlocked.

You can find the lock button in [the workspace settings page](../workspaces/settings.html). Locking a workspace requires write or admin permissions.

## Workers and Run Queuing

Terraform Cloud performs Terraform runs in disposable Linux environments, using multiple concurrent worker processes. These workers take jobs from a global queue of runs that are ready for processing; this includes confirmed applies, and plans that have just become the current run on their workspace.

If the global queue has more runs than the workers can handle at once, some of them must wait until a worker becomes available. When the queue is backed up, Terraform Cloud gives different priorities to different kinds of runs:

- Applies that will make changes to infrastructure have the highest priority.
- Normal plans have the next highest priority.
- Speculative plans have the lowest priority.

Terraform Cloud can also delay some runs in order to make performance more consistent across organizations. If an organization requests a large number of runs at once, Terraform Cloud queues some of them immediately, and delays the rest until some of the initial batch have finished; this allows every organization to continue performing runs even during periods of especially heavy load.

## Installing Terraform Providers

### Providers Distributed by HashiCorp

Terraform Cloud runs `terraform init` before every plan or apply, which automatically downloads any [providers](/docs/configuration/providers.html) Terraform needs.

Terraform Enterprise instances can automatically install providers as long as they can access releases.hashicorp.com. If that isn't feasible due to security requirements, you can manually install providers. Use [the `terraform-bundle` tool][bundle] to build a custom version of Terraform that includes the necessary providers, and configure your workspaces to use that bundled version.

[bundle]: https://github.com/hashicorp/terraform/tree/master/tools/terraform-bundle#installing-a-bundle-in-on-premises-terraform-enterprise

### Custom and Community Providers

-> **Note:** We are investigating how to improve custom provider installation, so this information might change in the near future.

Terraform only automatically installs plugins from [the main list of providers](/docs/providers/index.html); to use community providers or your own custom providers, you must install them yourself.

Currently, there are two ways to use custom provider plugins with Terraform Cloud.

- Add the provider binary to the VCS repo (or manually-uploaded configuration version) for any workspace that uses it. Place the compiled `linux_amd64` version of the plugin at `terraform.d/plugins/linux_amd64/<PLUGIN NAME>` (as a relative path from the root of the working directory). The plugin name should follow the [naming scheme](/docs/configuration/providers.html#plugin-names-and-versions) and the plugin file must have read and execute permissions. (Third-party plugins are often distributed with an appropriate filename already set in the distribution archive.)

    You can add plugins directly to a configuration repo, or you can add them as Git submodules and symlink the files into `terraform.d/plugins/linux_amd64/`. Submodules are a good choice when many workspaces use the same custom provider, since they keep your repos smaller. If using submodules, enable the ["Include submodules on clone" setting](../workspaces/settings.html#include-submodules-on-clone) on any affected workspace.

- **Terraform Enterprise only:** Use [the `terraform-bundle` tool][bundle] to add custom providers to a custom Terraform version. This keeps custom providers out of your configuration repos entirely, and is easier to update when many workspaces use the same provider.

## Terraform State in Terraform Cloud

-> **API:** See the [State Versions API](../api/state-versions.html).

Each workspace has its own separate state data. In order to read and write state for the correct workspace, Terraform Cloud overrides any configured [backend](/docs/backends/index.html) when running Terraform.

You can view current and historical state data for a workspace from its "States" tab. Each state in the list indicates which run and which VCS commit (if applicable) it was associated with. You can click a state in the list for more details, including a diff against the previous state and a link to the raw state file.

### Cross-Workspace State Access

In your Terraform configurations, you can use a [`terraform_remote_state` data source](/docs/providers/terraform/d/remote_state.html) to access [outputs](/docs/configuration/outputs.html) from your other workspaces.

~> **Important:** A given workspace can only access state data from within the same organization. If you plan to use multiple Terraform Cloud organizations, make sure to keep related groups of workspaces together in the same organization.

To configure a data source for a Terraform Cloud workspace, set the `backend` argument to `remote` and specify the organization and workspace in the `config` argument.

``` hcl
data "terraform_remote_state" "vpc" {
  backend = "remote"
  config = {
    organization = "example_corp"
    workspaces = {
      name = "vpc-prod"
    }
  }
}

resource "aws_instance" "redis_server" {
  # Terraform 0.12 syntax: use the "outputs.<OUTPUT NAME>" attribute
  subnet_id = data.terraform_remote_state.vpc.outputs.subnet_id

  # Terraform 0.11 syntax: use the "<OUTPUT NAME>" attribute
  subnet_id = "${data.terraform_remote_state.vpc.subnet_id}"
}
```

### Backend Details

[CLI config file]: /docs/commands/cli-config.html
[remote]: /docs/backends/types/remote.html

Terraform Cloud stores state for its workspaces. During a run, Terraform CLI uses a [backend](/docs/backends/index.html) to read from and write to Terraform Cloud's stored state.

When Terraform Cloud performs a Terraform run, it uses [the `remote` backend][remote], overriding any existing backend in the configuration.

Instead of using existing user credentials, Terraform Cloud generates a unique per-run API token and provides it to the Terraform worker in the [CLI config file][]. This per-run token can read and write state data for the workspace associated with the run, can read state data from any other workspace in the same organization, and can download modules from the [private module registry](../registry/index.html). It cannot make any other calls to the Terraform Cloud API. Per-run tokens are not considered to be user, team, or organization tokens, and become invalid after the run is completed.

-> **Note:** When performing a run with Terraform 0.11.12 or earlier, Terraform Cloud instead uses [the `atlas` backend](/docs/backends/types/terraform-enterprise.html) and provides the per-run token in the `$ATLAS_TOKEN` environment variable.

When running Terraform on the commmand line against a workspace configured for remote operations, the CLI user must have [the `remote` backend][remote] configured in the Terraform configuration, and must have a user or team API token with the appropriate permissions specified in their [CLI config file][]. However, the run itself still occurs within one of Terraform Cloud's worker VMs, and still uses the per-run token for state access.

When running Terraform on the command line against a workspace that is _not_ configured for remote operations, the CLI user's token is used for state access.
