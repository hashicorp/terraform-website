---
layout: "cloud"
page_title: "Run Tasks - Workspaces - Terraform Cloud and Terraform Enterprise"
---

# Run Tasks

-> **Note:** As of September 2021, Run Tasks are available only as a beta feature, and not all customers will see this functionality in their Terraform Cloud organization.

> **Hands-on:** Try the [Cost Estimation with Infracost and Run Tasks](https://learn.hashicorp.com/tutorials/terraform/INSERTURLHERELOLOLOL) tutorial on HashiCorp Learn.

Run Tasks allow Terraform Cloud to execute tasks in external systems at specific points in the Terraform Cloud run lifecycle. The beta release of this feature allows users to add and execute these tasks during the new pre-apply stage which exists in between the plan and apply stages. Tasks are executed by sending an API payload to the external system. This payload contains a collection of run-related information and a callback URL which the external system can use to send updates back to Terraform Cloud.

The external system can then use this run information and respond back to Terraform Cloud with a passed or failed status. Terraform Cloud uses this status response to determine if a run should proceed, based on the task's enforcement settings within a workspace.

-> **API:** See the [Run Tasks APIs](../api/run-tasks.html).

## Configuring a Run Task

-> **Note:** You must be an organization administrator to create a new task event hook. You must be at least a workspace owner in order to connect a task event hook to a given workspace.

To get started with run tasks, first navigate to the desired workspace, then select "Tasks" from the "Settings" menu:

![Screenshot: a workspace's settings drop-down menu](./images/run-tasks-workspace-settings.png)

Here you can either create a new event hook or select an existing one that isn't yet connected to the workspace. Click "Create a new event hook"

This will bring you to the "Task event hooks" page within your organization's settings. Click "Create hook"

![Screenshot: an organization's blank task event hooks state](./images/run-tasks-blank-event-hooks.png)

Here you are prompted for three pieces of information about the event hook to be configured:
- Name **(required)** - a friendly name for the event hook. This will be displayed in workspace configuration pages, and can contain alphanumeric characters, dashes, and underscores
- Hook endpoint URL **(required)** - the URL where your external service is listening for a [run tasks payload](../api/run-tasks.html).
- HMAC key (optional) - a key which can be used by your remote endpoint to verify that requests are originating from Terraform Cloud

Once you have entered the necessary information, click "Create event hook"

![Screenshot: an organization's populated task event hooks state](./images/run-tasks-event-hooks-populated.png)

You can now see the list of configured event hooks. Return to your desired workspace by clicking on "Workspaces" in the top nav bar, then selecting your workspace from the grid. Return to the "Tasks" item in the "Settings" menu. You can now see any event hooks you created in the prior step. In this example, two are available, one which will `always-pass`, and one which will `always fail`. Click the "+" sign next to the task(s) you wish to add to this workspace.

![Screenshot: a workspace's populated tasks configuration page](./images/run-tasks-workspace-tasks-populated.png)

Here you can decide the enforcement level for the task. 
- **Advisory** tasks can not block a run from completing. If the task fails, a warning will be displayed on the run but it will proceed
- **Mandatory** tasks can block a run from completing. If the task fails (including a timeout or unexpected remote error condition), a warning will be displayed on the run and the run will transition to an Errored state.

Choose an enforcement level and click "Create"

![Screenshot: enforcement configuration for a specific task within a workspace](./images/run-tasks-add-to-workspace.png)

Once you have added all of the task hooks desired for a workspace, you can configure or remove them from this view. Your run tasks are now configured.

![Screenshot: final configuration of tasks within a workspace](./images/run-tasks-final-workspace-configuration.png)


## Understanding Run Tasks Within a Run

In a workspace with run tasks configured, there will be a new run stage called [Pre-Apply](../run/states.html) visible. This stage is where your run tasks will execute during a run, after the plan stage (and, cost estimation and policy check stage if configured).

The Pre-Apply stage will always end with the most restrictive status of the tasks configured to run. For example, if a mandatory task fails and an advisory task succeeds, the stage will fail and the run will error. If an advisory task fails but a mandatory task succeeds, the stage will succeed and the run will proceed to the apply stage.

Regardless of the exit status of a task, the status and any related message will be displayed in the UI.

Here is an example of a run that failed due to a mandatory task.

![Screenshot: a run with failed tasks](./images/run-tasks-run-failed.png)

And here is an example of a run that succeeded.

![Screenshot: a run with failed tasks](./images/run-tasks-run-success.png)

## Deleting a Task Event Hook

Note that a task event hook cannot be deleted if it is still attached to any workspaces. A warning will be displayed in the UI if you attempt this, with a list of any workspaces that are consuming the event hook. Remove the task from the impacted workspaces before proceeding with the deletion.

![Screenshot: a warning when attempting to delete an in-use event hook](./images/run-tasks-delete-hook-warning.png)
