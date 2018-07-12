---
layout: "enterprise2"
page_title: "UI/VCS-driven Runs - Runs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-run-ui"
---

# The UI- and VCS-driven Run Workflow

Terraform Enterprise (TFE) has three workflows for managing Terraform runs.

- The UI/VCS-driven run workflow described below, which is TFE's primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The [CLI-driven run workflow](./cli.html), which is the API-driven workflow with a user-friendly command line tool.

## Summary

In the UI and VCS workflow, every workspace is associated with a specific branch of a VCS repo of Terraform configurations. TFE registers webhooks with your VCS provider when you create a workspace, then automatically queues a Terraform run whenever new commits are merged to that branch of workspace's linked repository.

By default, TFE also performs a plan-only run when a pull request is opened against that branch from another branch in the linked repository. As described at [VCS Connection webhooks](../vcs/index.html#webhooks), plan-only runs can't be applied, although their details can be viewed in TFE via a link in the VCS status check.

The Terraform code for a run always comes from version control, and is always associated with a specific commit.

## Starting Runs

Most of the time, you start a run automatically by committing changes to version control through a merge or direct commit to the target branch. A plan-only run starts when a pull request is opened from another branch in the workspace's linked VCS repository to the target branch. If a PR is opened requesting a merge of changes from a different repository (for example, a fork of the primary repository) no run will be initiated, since TFE is not configured to monitor the contents of any other repository.

When you initially set up the workspace and add variables, or if the code in version control hasn't changed but you've modified some variables in TFE, you can manually queue a plan from the UI. Each workspace has a "Queue Plan" button, and the form for editing variables also includes a "Save & Plan" button.

Manually queueing a plan requires write or admin access.

If the workspace has a plan that is still in the [plan stage](./states.html#2-the-plan-stage) when a new plan is queued, you can either wait for it to complete, or visit the "Current Run" page and click "Run this plan now". Be aware that this will terminate the current plan and unlock the workspace, which can lead to anomalies in behavior, but can be useful if the plans are long-running and the current plan is known not to have all the desired changes.

## Confirming or Discarding Plans

By default, run plans require confirmation before TFE will apply them. Users with write access on a workspace can navigate to a run that has finished planning and click the "Confirm & Apply" or "Discard Plan" button to finish or cancel a run. If necessary, use the "View Plan" button for more details about what the run will change.

![confirm button](./images/runs-confirm.png)

Users can also leave comments if there's something unusual involved in a run.

Note that once the plan stage is completed, until you apply or discard a plan, TFE can't start another run in that workspace.

### Auto apply

If you would rather automatically apply plans that don't have errors, you can enable auto apply on the workspace's settings tab.
