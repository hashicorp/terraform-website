---
layout: "cloud"
page_title: "UI/VCS-driven Runs - Runs - Terraform Cloud and Terraform Enterprise"
---

# The UI- and VCS-driven Run Workflow

Terraform Cloud has three workflows for managing Terraform runs.

- The UI/VCS-driven run workflow described below, which is the primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The [CLI-driven run workflow](./cli.html), which uses Terraform's standard CLI tools to execute runs in Terraform Cloud.

## Summary

In the UI and VCS workflow, every workspace is associated with a specific branch of a VCS repo of Terraform configurations. Terraform Cloud registers webhooks with your VCS provider when you create a workspace, then automatically queues a Terraform run whenever new commits are merged to that branch of workspace's linked repository.

Terraform Cloud also performs a [speculative plan][] when a pull request is opened against that branch. Terraform Cloud posts a link to the plan in the pull request, and re-runs the plan if the pull request is updated.

[speculative plan]: ./index.html#speculative-plans

The Terraform code for a normal run always comes from version control, and is always associated with a specific commit.

## Automatically Starting Runs

In a workspace linked to a VCS repo, runs start automatically when you merge or commit changes to version control.

A workspace is linked to one branch of its repository, and ignores changes to other branches. Workspaces can also ignore some changes within their branch: if a Terraform working directory is configured, Terraform Cloud assumes that only some of the content in the repository is relevant to Terraform, and ignores changes outside of that content. (This behavior can be configured; for details, see [Settings: Automatic Run Triggering](../workspaces/vcs.html#automatic-run-triggering).)

## Manually Starting Runs

When you initially set up the workspace and add variables, or when the code in version control hasn't changed but you've modified some variables, you can manually queue a plan from the UI. Each workspace has a "Queue Plan" button for this purpose. Manually queueing a plan requires permission to queue plans for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

If the workspace has a plan that is still in the [plan stage](./states.html#2-the-plan-stage) when a new plan is queued, you can either wait for it to complete, or visit the "Current Run" page and click "Run this plan now". Be aware that this will terminate the current plan and unlock the workspace, which can lead to anomalies in behavior, but can be useful if the plans are long-running and the current plan is known not to have all the desired changes.

## Confirming or Discarding Plans

By default, run plans require confirmation before Terraform Cloud will apply them. Users with permission to apply runs for the workspace can navigate to a run that has finished planning and click the "Confirm & Apply" or "Discard Plan" button to finish or cancel a run. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html)) If necessary, use the "View Plan" button for more details about what the run will change.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

![confirm button](./images/runs-confirm.png)

Users can also leave comments if there's something unusual involved in a run.

Note that once the plan stage is completed, until you apply or discard a plan, Terraform Cloud can't start another run in that workspace.

### Auto apply

If you would rather automatically apply plans that don't have errors, you can [enable auto apply](../workspaces/settings.html#auto-apply-and-manual-apply) on the workspace's "General Settings" page. Some plans can't be auto-applied, like plans queued by [run triggers](../workspaces/run-triggers.html) or by users without permission to apply runs. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Speculative Plans on Pull Requests

To help you review proposed changes, Terraform Cloud can automatically run [speculative plans][speculative plan] for pull requests or merge requests.

### Viewing Pull Request Plans

Speculative plans don't appear in a workspace's list of normal runs. Instead, Terraform Cloud adds a link to the run in the pull request itself, along with an indicator of the run's status.

A single pull request can include links to multiple plans, depending on how many workspaces are connected to the destination branch. If a pull request is updated, Terraform Cloud will perform new speculative plans and update the links.

Although any contributor to the repository can see the status indicators for pull request plans, only members of your Terraform Cloud organization with permission to read runs for the affected workspaces can click through and view the complete plan output. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Rules for Triggering Pull Request Plans

Whenever a pull request is _created or updated,_ Terraform Cloud checks whether it should run speculative plans in workspaces connected to that repository, based on the following rules:

- Only pull requests that originate from within the same repository can trigger speculative plans.

    To avoid executing malicious code or exposing sensitive information, Terraform Cloud doesn't run speculative plans for pull requests that originate from other forks of a repository.

    -> **Note:** On Terraform Enterprise versions v202005-1 or later, administrators can choose allow speculative plans on pull requests that originate from forks. To learn more about this setting, refer to the [general settings documentation](/docs/enterprise/admin/general.html#allow-speculative-plans-on-pull-requests-from-forks)
- Pull requests can only trigger runs in workspaces where automatic speculative plans are allowed. You can [disable automatic speculative plans](/docs/cloud/workspaces/vcs.html#automatic-speculative-plans) in a workspace's VCS settings.
- A pull request will only trigger speculative plans in workspaces that are connected to that pull request's destination branch.

    The destination branch is the branch that a pull request proposes to make changes to; this is often the repository's main branch, but not always.
- If a workspace is configured to only treat certain directories in a repository as relevant, pull requests that don't touch those directories won't trigger speculative plans in that workspace. For more information, see [VCS settings: automatic run triggering](/docs/cloud/workspaces/vcs.html#automatic-run-triggering).

### Contents of Pull Request Plans

Speculative plans for pull requests use the contents of the head branch (the branch that the PR proposes to merge into the destination branch), and they compare against the workspace's current state at the time of the plan. This means that if the destination branch changes significantly after the head branch is created, the speculative plan might not accurately show the results of accepting the PR. To get a more accurate view, you can rebase the head branch onto a more recent commit, or merge the destination branch into the head branch.

## Speculative Plans During Development

You can also run speculative plans on demand before making a pull request, using the remote backend and the `terraform plan` command. For more information, see [the CLI-driven run workflow](./cli.html).
