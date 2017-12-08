---
layout: "enterprise2"
page_title: "Runs - Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces-run-basics"
---

# About Terraform Runs in Terraform Enterprise

Terraform Enterprise (TFE) provides a central interface for running Terraform within a large collaborative organization. If you're accustomed to running Terraform from your workstation, the way TFE manages runs can be unfamiliar.

This page describes the basics of what a run is in TFE. Once you understand the basics, you can read about the primary [UI/VCS-driven run workflow](./run-ui.html) and the more flexible [API-driven run workflow](./run-api.html).

## Plans and Applies

TFE enforces Terraform's division between _plan_ and _apply_ operations. It always plans first, saves the plan's output, and uses that output for the apply. In the default configuration, it waits for user approval before running an apply, but you can configure workspaces to automatically apply successful plans.

## Runs and Workspaces

TFE always performs Terraform runs in the context of a [workspace](./index.html). The workspace provides the state and variables for the run, and usually specifies where the configuration should come from.

Each workspace in TFE maintains its own queue of runs, and processes those runs in order.

Whenever a new run is requested, it's added to the end of the queue. If there's already a run in progress, the new run won't start until the current one has completely finished — TFE won't even plan the run yet, because the current run might change what a future run would do. Runs that are waiting for other runs to finish are in a _pending_ state, and a workspace might have any number of pending runs.

When you request a run, TFE locks the run to the current Terraform code (usually associated with a specific VCS commit) and variable values. If you change variables or commit new code before the run finishes, it will only affect future runs, not ones that are already pending, planning, or awaiting apply.

## Run States

A given Terraform run can be in the following states:

- **Pending:** A pending run hasn't been planned or applied. It's waiting for other runs to finish.
- **Planning:** TFE is currently running `terraform plan`.
- **Planned:** TFE has run `terraform plan`, and is waiting for a user to approve a `terraform apply`.
- **Applying:** TFE is currently running `terraform apply`.
- **Applied:** TFE has finished applying. The next run can now proceed.
- **Plan Errored:** The `terraform plan` command failed, and you won't be able to apply this run. This usually means you need to fix variables or code. The next run can now proceed.
- **Discarded:** The `terraform plan` command succeeded, but a user chose not to apply it. The next run can now proceed.

In the list of workspaces on TFE's main page, each workspace shows the state of its most recently queued run. So if any runs are pending, the workspace is in "pending," regardless of what it's currently running or waiting for.

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

## Preventing Runs

If you need to temporarily stop runs from being queued, you can lock the workspace.

You can find the lock button in the workspace settings page. Locking a workspace requires write or admin access.

