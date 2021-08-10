---
layout: "cloud"
page_title: "Viewing and Managing Runs - Runs - Terraform Cloud and Terraform Enterprise"
---

# Viewing and Managing Runs

Each workspace in Terraform Cloud includes a list of its current, pending, and historical runs. You can view information about these runs in the UI, and sometimes interact with them.

Additionally, you can lock workspaces to temporarily prevent new runs.

-> **API:** See the [Runs API](../api/run.html) and [lock a Workspace endpoint](../api/workspaces.html#lock-a-workspace).

## Navigating Runs

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
- How the run was initiated, when, and which user initiated it (if applicable).
- A timeline of events related to the run.
- The output from both the `terraform plan` and `terraform apply` commands, if applicable. You can hide or reveal these as needed; they default to visible if the command is currently running, and hidden if the command has finished.

## Interacting with Runs

In workspaces where you have permission to apply runs, run pages include controls for interacting with the run at the bottom of the page. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html)) Depending on the state of the run, the following buttons might be available:

Button              | Available when:
--------------------|----------------
Add Comment         | Always.
Confirm & Apply     | A plan needs confirmation.
Override & Continue | A soft-mandatory policy failed. Requires permission to manage policy overrides for the organization. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))
Discard Run         | A plan needs confirmation or a soft-mandatory policy failed.
Cancel Run          | A plan or apply is currently running.
Force Cancel Run    | A plan or apply was canceled, but something went wrong and Terraform Cloud couldn't end the run gracefully. Requires admin access to the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

If a plan needs confirmation (with [manual apply](../workspaces/settings.html#auto-apply-and-manual-apply) enabled) or a soft-mandatory policy failed, the run will remain paused until a user with appropriate permissions uses these buttons to continue or discard the run. For more details, see [Run States and Stages](./states.html).

### Canceling Runs

If a run is currently planning or applying, users with permission to apply runs for the workspace can cancel the run before it finishes, using the "Cancel Run" button on the run's page. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Canceling a run is roughly equivalent to hitting ctrl+c during a Terraform plan or apply on the CLI. The running Terraform process is sent an INT signal, which instructs Terraform to end its work and wrap up in the safest way possible. (This gives Terraform a chance to update state for any resources that have already been changed, among other things.)

In rare cases, a cancelled run can fail to end gracefully, and will continue to lock the workspace without accomplishing anything useful. These stuck runs can be **force-canceled,** which immediately terminates the running Terraform process and unlocks the workspace.

Since force-canceling can have dangerous side-effects (including loss of state and orphaned resources), it requires admin access to the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html)) Additionally, the "Force Cancel Run" button only appears after the normal cancel button has been used and a cool-off period has elapsed, to ensure Terraform Cloud has a chance to terminate the run safely.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Locking Workspaces (Preventing Runs)

If you need to temporarily stop runs from being queued, you can lock the workspace.

A lock prevents Terraform Cloud from performing any plans or applies in the workspace. This includes automatic runs due to new commits in the VCS repository, manual runs queued via the UI, runs started on the command line with `terraform plan` and `terraform apply`, and runs created with the API. New runs remain in the "Pending" state until the workspace is unlocked.

The current lock status is shown in the workspace header, near the "Actions" menu.

You can find the lock button in the "Actions" menu in a workspace's header, or in [the workspace settings page](../workspaces/settings.html). Locking a workspace requires permission to lock and unlock the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

