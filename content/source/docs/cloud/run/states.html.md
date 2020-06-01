---
layout: "cloud"
page_title: "Run States and Stages - Runs - Terraform Cloud"
---

# Run States and Stages


Each run passes through several stages of action (pending, plan, cost estimation, policy check, apply, and completion), and Terraform Cloud shows the progress through those stages as run states.

In the list of workspaces on Terraform Cloud's main page, each workspace shows the state of the run it's currently processing. (Or, if no run is in progress, the state of the most recent completed run.)

## 1. The Pending Stage

_States in this stage:_

- **Pending:** Terraform Cloud hasn't started action on a run yet. Terraform Cloud processes each workspace's runs in the order they were queued, and a run remains pending until every run before it has completed.

_Leaving this stage:_

- Proceeds automatically to the plan stage (**Planning** state) when it becomes the first run in the queue.
- Can skip to completion (**Discarded** state) if a user discards it before it starts.

## 2. The Plan Stage

_States in this stage:_

- **Planning:** Terraform Cloud is currently running `terraform plan`.
- **Needs Confirmation:** `terraform plan` has finished. Runs sometimes pause in this state, depending on the workspace and organization settings.

_Leaving this stage:_

- If the `terraform plan` command failed, the run skips to completion (**Plan Errored** state).
- If a user canceled the plan by pressing the "Cancel Run" button, the run skips to completion (**Canceled** state).
- If the plan succeeded and doesn't require any changes (since it already matches the current infrastructure state), the run skips to completion (**No Changes** state).
- If the plan succeeded and requires changes:
    - If cost estimation is enabled, the run proceeds automatically to the cost estimation stage.
    - If cost estimation is disabled and [Sentinel policies][] are enabled, the run proceeds automatically to the policy check stage.
    - If there are no Sentinel policies and the plan can be auto-applied, the run proceeds automatically to the apply stage. (Plans can be auto-applied if the auto-apply setting is enabled on the workspace and the plan was queued by a new VCS commit or by a user with write permissions.)
    - If there are no Sentinel policies and the plan can't be auto-applied, the run pauses in the **Needs Confirmation** state until a user with write access to the workspace takes action. The run proceeds to the apply stage if they approve the apply, or skips to completion (**Discarded** state) if they reject the apply.

## 3. The Cost Estimation Stage

This stage only occurs if cost estimation is enabled. After a successful `terraform plan`, Terraform Cloud uses plan data to estimate costs for each resource found in the plan.

_States in this stage:_

- **Cost Estimating:** Terraform Cloud is currently estimating the resources in the plan.
- **Cost Estimated:** The cost estimate completed.

_Leaving this stage:_

- If cost estimation succeeded or errors, the run moves to the next stage.
- If there are no policy checks or applies, the run skips to completion (**Planned (Finished)** state).

## 4. The Policy Check Stage

This stage only occurs if [Sentinel policies][] are enabled. After a successful `terraform plan`, Terraform Cloud checks whether the plan obeys policy to determine whether it can be applied.

[Sentinel policies]: ../sentinel/index.html

_States in this stage:_

- **Policy Check:** Terraform Cloud is currently checking the plan against the organization's policies.
- **Policy Override:** The policy check finished, but a soft-mandatory policy failed, so an apply cannot proceed without approval from a member of the owners team. The run pauses in this state.
- **Policy Checked:** The policy check succeeded, and Sentinel will allow an apply to proceed. The run sometimes pauses in this state, depending on workspace settings.

_Leaving this stage:_

- If any hard-mandatory policies failed, the run skips to completion (**Plan Errored** state).
- If any soft-mandatory policies failed, the run pauses in the **Policy Override** state.
    - If a member of the owners team overrides the failed policy, the run proceeds to the **Policy Checked** state.
    - If an owner or a user with write access discards the run, the run skips to completion (**Discarded** state).
- If the run reaches the **Policy Checked** state (no mandatory policies failed, or soft-mandatory policies were overridden):
    - If the plan can be auto-applied, the run proceeds automatically to the apply stage. (Plans can be auto-applied if the auto-apply setting is enabled on the workspace and the plan was queued by a new VCS commit or by a user with write permissions.)
    - If the plan can't be auto-applied, the run pauses in the **Policy Checked** state until a user with write access takes action. The run proceeds to the apply stage if they approve the apply, or skips to completion (**Discarded** state) if they reject the apply.


## 5. The Apply Stage

_States in this stage:_

- **Applying:** Terraform Cloud is currently running `terraform apply`.

_Leaving this stage:_

After applying, the run proceeds automatically to completion.

- If the apply succeeded, the run ends in the **Applied** state.
- If the apply failed, the run ends in the **Apply Errored** state.
- If a user canceled the apply by pressing the "Cancel Run" button, the run ends in the **Canceled** state.

## 6. Completion

A run is considered completed if it finishes applying, if any part of the run fails, if there's nothing to do, or if a user chooses not to continue. Once a run is completed, the next run in the queue can enter the plan stage.

_States in this stage:_

- **Applied:** The run was successfully applyed.
- **No Changes:** `terraform plan`'s output already matches the current infrastructure state, so `terraform apply` doesn't need to do anything.
- **Apply Errored:** The `terraform apply` command failed, possibly due to a missing or misconfigured provider or an illegal operation on a provider.
- **Plan Errored:** The `terraform plan` command failed (usually requiring fixes to variables or code), or a hard-mandatory Sentinel policy failed. The run cannot be applied.
- **Discarded:** A user chose not to continue this run.
- **Canceled:** A user interrupted the `terraform plan` or `terraform apply` command with the "Cancel Run" button.
