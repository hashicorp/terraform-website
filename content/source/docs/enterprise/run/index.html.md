---
layout: "enterprise2"
page_title: "Runs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-run"
---

# About Terraform Runs in Terraform Enterprise

Terraform Enterprise (TFE) provides a central interface for running Terraform within a large collaborative organization. If you're accustomed to running Terraform from your workstation, the way TFE manages runs can be unfamiliar.

This page describes the basics of what a run is in TFE. Once you understand the basics, you can read about:

- The [UI/VCS-driven run workflow](./run-ui.html), which is TFE's primary mode of operation.
- The [API-driven run workflow](./run-api.html), which is more flexible but requires you to create some tooling.
- The [CLI-driven run workflow](./run-cli.html), which is the API-driven workflow with a user-friendly command line tool.

## Plans and Applies

TFE enforces Terraform's division between _plan_ and _apply_ operations. It always plans first, saves the plan's output, and uses that output for the apply. In the default configuration, it waits for user approval before running an apply, but you can configure workspaces to automatically apply successful plans.

## Network Access to VCS and Infrastructure Providers

In order to perform Terraform runs, TFE needs network access to all of the resources being managed by Terraform.

If you are using the SaaS version of TFE, this means your VCS provider and any private infrastructure providers you manage with Terraform (including VMware vSphere, OpenStack, other private clouds, and more) _must be internet accessible._

Private installs of TFE must have network connectivity to any connected VCS providers or managed infrastructure providers.

## Runs and Workspaces

TFE always performs Terraform runs in the context of a [workspace](./index.html). The workspace provides the state and variables for the run, and usually specifies where the configuration should come from.

Each workspace in TFE maintains its own queue of runs, and processes those runs in order.

Whenever a new run is requested, it's added to the end of the queue. If there's already a run in progress, the new run won't start until the current one has completely finished — TFE won't even plan the run yet, because the current run might change what a future run would do. Runs that are waiting for other runs to finish are in a _pending_ state, and a workspace might have any number of pending runs.

When you request a run, TFE locks the run to the current Terraform code (usually associated with a specific VCS commit) and variable values. If you change variables or commit new code before the run finishes, it will only affect future runs, not ones that are already pending, planning, or awaiting apply.

## Run States

Each run passes through several stages of action (pending, plan, policy check, apply, and completion), and TFE shows the progress through those stages as run states.

In the list of workspaces on TFE's main page, each workspace shows the state of the run it's currently processing. (Or, if no run is in progress, the state of the most recent completed run.)

### 1. The Pending Stage

_States in this stage:_

- **Pending:** TFE hasn't started action on a run yet. TFE processes each workspace's runs in the order they were queued, and a run remains pending until every run before it has completed.

_Leaving this stage:_

- Proceeds automatically to the plan stage (**Planning** state) when it becomes the first run in the queue.
- Can skip to completion (**Discarded** state) if a user discards it before it starts.

### 2. The Plan Stage

_States in this stage:_

- **Planning:** TFE is currently running `terraform plan`.
- **Needs Confirmation:** `terraform plan` has finished. TFE sometimes pauses in this state, depending on the workspace and organization settings.

_Leaving this stage:_

- If the `terraform plan` command failed, TFE skips to completion (**Plan Errored** state).
- If a user canceled the plan by pressing the "Cancel Run" button, TFE skips to completion (**Canceled** state).
- If the plan succeeded and doesn't require any changes (since it already matches the current infrastructure state), TFE skips to completion (**No Changes** state).
- If the plan succeeded and requires changes:
    - If [Sentinel policies][] are enabled, TFE proceeds automatically to the policy check stage.
    - If there are no Sentinel policies and auto-apply is enabled on the workspace, TFE proceeds automatically to the apply stage.
    - If there are no Sentinel policies and auto-apply is disabled, TFE pauses in the **Needs Confirmation** state until a user with write access to the workspace takes action. The run proceeds to the apply stage if they approve the apply, or skips to completion (**Discarded** state) if they reject the apply.

### 3. The Policy Check Stage

This stage only occurs if [Sentinel policies][] are enabled. After a successful `terraform plan`, TFE checks whether the plan obeys policy to determine whether it can be applied.

[Sentinel policies]: ../sentinel/index.html

_States in this stage:_

- **Policy Check:** TFE is currently checking the plan against the organization's policies.
- **Policy Override:** The policy check finished, but a soft-mandatory policy failed, so an apply cannot proceed without approval from a member of the owners team. TFE pauses in this state.
- **Policy Checked:** The policy check succeeded, and Sentinel will allow an apply to proceed. TFE sometimes pauses in this state, depending on workspace settings.

_Leaving this stage:_

- If any hard-mandatory policies failed, TFE skips to completion (**Plan Errored** state).
- If any soft-mandatory policies failed, TFE pauses in the **Policy Override** state.
    - If a member of the owners team overrides the failed policy, the run proceeds to the **Policy Checked** state.
    - If an owner or a user with write access discards the run, TFE skips to completion (**Discarded** state).
- If the run reaches the **Policy Checked** state (no mandatory policies failed, or soft-mandatory policies were overridden):
    - If auto-apply is enabled on the workspace, TFE proceeds automatically to the apply stage.
    - If auto-apply is disabled, TFE pauses in the **Policy Checked** state until a user with write access takes action. The run proceeds to the apply stage if they approve the apply, or skips to completion (**Discarded** state) if they reject the apply.


### 4. The Apply Stage

_States in this stage:_

- **Applying:** TFE is currently running `terraform apply`.

_Leaving this stage:_

After applying, TFE proceeds automatically to completion.

- If the apply succeeded, the run ends in the **Applied** state.
- If the apply failed, the run ends in the **Apply Errored** state.
- If a user canceled the apply by pressing the "Cancel Run" button, the run ends in the **Canceled** state.

### 5. Completion

A run is considered completed if it finishes applying, if any part of the run fails, if there's nothing to do, or if a user chooses not to continue. Once a run is completed, the next run in the queue can enter the plan stage.

_States in this stage:_

- **Applied:** TFE has successfully finished applying.
- **No Changes:** `terraform plan`'s output already matches the current infrastructure state, so `terraform apply` doesn't need to do anything.
- **Apply Errored:** The `terraform apply` command failed, possibly due to a missing or misconfigured provider or an illegal operation on a provider.
- **Plan Errored:** The `terraform plan` command failed (usually requiring fixes to variables or code), or a hard-mandatory Sentinel policy failed. The run cannot be applied.
- **Discarded:** A user chose not to continue this run.
- **Canceled:** A user interrupted the `terraform plan` or `terraform apply` command with the "Cancel Run" button.

## Interacting with Runs

Each workspace has three always-visible tools for working with runs:

- A "Queue Plan" button, in the upper right.
- A "Runs" link, which goes to the full list of runs.
- A "Latest Run" link, which goes to the most recent _completed_ run. (Completed runs are in an "applied," "discarded," or "plan errored" state.)

![runs list](./images/runs-list.png)

From the list of runs, you can click to view or interact with an individual run.

### The Run Page

An individual run page shows the progress and outcomes of each stage of the run.

![a run page](./images/runs-run-page.png)

Most importantly, it shows:

- The current status of the run.
- The code commit associated with the run.
- How the run was triggered, when, and which user requested it (if applicable).
- A timeline of events related to the run.
- The output from both the `terraform plan` and `terraform apply` commands, if applicable. You can hide or reveal these as needed; they default to visible if the command is currently running, and hidden if the command has finished.

If the run is still in progress and you have write access to the workspace, there are controls for interacting with the run at the bottom of the page. Depending on the state of the run, the following buttons might be available:

- A "Cancel Run" button, if a plan or apply is currently running.
- "Confirm & Apply" and "Discard Plan" buttons, if a plan needs confirmation.
- An "Override Policy" button, if a soft-mandatory policy failed (only available for owners team).

## Locking Workspaces (Preventing Runs)

If you need to temporarily stop runs from being queued, you can lock the workspace.

You can find the lock button in the workspace settings page. Locking a workspace requires write or admin access.

