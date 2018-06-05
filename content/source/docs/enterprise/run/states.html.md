---
layout: "enterprise2"
page_title: "Run States and Stages - Runs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-run-states"
---

# Run States and Stages


Each run passes through several stages of action (pending, plan, policy check, apply, and completion), and TFE shows the progress through those stages as run states.

In the list of workspaces on TFE's main page, each workspace shows the state of the run it's currently processing. (Or, if no run is in progress, the state of the most recent completed run.)

## 1. The Pending Stage

_States in this stage:_

- **Pending:** TFE hasn't started action on a run yet. TFE processes each workspace's runs in the order they were queued, and a run remains pending until every run before it has completed.

_Leaving this stage:_

- Proceeds automatically to the plan stage (**Planning** state) when it becomes the first run in the queue.
- Can skip to completion (**Discarded** state) if a user discards it before it starts.

## 2. The Plan Stage

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

## 3. The Policy Check Stage

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


## 4. The Apply Stage

_States in this stage:_

- **Applying:** TFE is currently running `terraform apply`.

_Leaving this stage:_

After applying, TFE proceeds automatically to completion.

- If the apply succeeded, the run ends in the **Applied** state.
- If the apply failed, the run ends in the **Apply Errored** state.
- If a user canceled the apply by pressing the "Cancel Run" button, the run ends in the **Canceled** state.

## 5. Completion

A run is considered completed if it finishes applying, if any part of the run fails, if there's nothing to do, or if a user chooses not to continue. Once a run is completed, the next run in the queue can enter the plan stage.

_States in this stage:_

- **Applied:** TFE has successfully finished applying.
- **No Changes:** `terraform plan`'s output already matches the current infrastructure state, so `terraform apply` doesn't need to do anything.
- **Apply Errored:** The `terraform apply` command failed, possibly due to a missing or misconfigured provider or an illegal operation on a provider.
- **Plan Errored:** The `terraform plan` command failed (usually requiring fixes to variables or code), or a hard-mandatory Sentinel policy failed. The run cannot be applied.
- **Discarded:** A user chose not to continue this run.
- **Canceled:** A user interrupted the `terraform plan` or `terraform apply` command with the "Cancel Run" button.

