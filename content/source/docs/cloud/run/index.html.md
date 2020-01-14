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

Terraform Cloud shows the progress of each run as it passes through each run state (pending, plan, policy check, apply, and completion). In some states, the run might require confirmation before continuing or ending; see [Managing Runs: Interacting with Runs](./manage.html#interacting-with-runs) for more information.

In the list of workspaces on Terraform Cloud's main page, each workspace shows the state of the run it's currently processing. (Or, if no run is in progress, the state of the most recent completed run.)

For full details about the stages of a run, see [Run States and Stages][].

[Run States and Stages]: ./states.html
