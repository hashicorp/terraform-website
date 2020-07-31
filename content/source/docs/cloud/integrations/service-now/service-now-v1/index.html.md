---
layout: "cloud"
page_title: "Setup Instructions - ServiceNow Service Catalog Integration - Terraform Cloud and Terraform Enterprise"
description: |-
  ServiceNow integration to enable your users to order Terraform-built infrastructure from ServiceNow
---

# Terraform ServiceNow Service Catalog Integration Setup Instructions

-> **[DEPRECATED] Integration version:** v1.1.0 (Find the latest version [here](../index.html))

!> **Note:** The ServiceNow Catalog integration is designed for use by Terraform Enterprise customers. We do not currently recommend using it with the SaaS version of Terraform Cloud.

The Terraform ServiceNow Service Catalog integration enables your end-users to provision self-serve infrastructure via ServiceNow. By connecting ServiceNow with Terraform Enterprise, this integration lets ServiceNow users create workspaces and perform Terraform runs, using prepared Terraform configurations hosted in VCS repositories.

Integrating ServiceNow with Terraform Enterprise involves several configuration steps. You will perform some of these steps in ServiceNow, and some of them in Terraform Enterprise.

| ServiceNow | Terraform Enterprise |
--|--
| | Prepare an organization for use with the ServiceNow Catalog. |
| | Create a team that can manage workspaces in that organization. |
| | Create a team API token so the integration can use that team's permissions. |
| | Retrieve the unique ID that Terraform Enterprise uses to identify your VCS provider. |
| Import the integration from source control. | |
| Connect the integration with Terraform Enterprise, using the team API token you prepared. | |
| Add the Terraform Service Catalog to enable it for your users. | |
| Add VCS repositories with Terraform configurations as catalog items. | |

Once these steps are completed, self-serve infrastructure will be available through the ServiceNow Catalog. Terraform Enterprise will provision and manage any requested infrastructure.

## Prerequisites

To start using Terraform with ServiceNow Catalog Integration, you must already have:

- An account on a [Terraform Enterprise](https://www.hashicorp.com/products/terraform/) instance.
- A ServiceNow instance or developer instance. You can request a ServiceNow developer instance at [developer.servicenow.com](https://developer.servicenow.com/).
- A [supported version control system](../../../vcs/index.html#supported-vcs-providers) (VCS) with read access to repositories with Terraform configuration.
- A private Git repository to host the ServiceNow integration.

It does not require additional ServiceNow modules and has been tested on the following ServiceNow server versions:

- Madrid
- London

## Obtaining the ServiceNow Integration

Before beginning setup, you must obtain a copy of the Terraform ServiceNow Catalog integration software. Contact your HashiCorp sales representative to get access to the software.

Once you have obtained the files from your sales representative, check them into a private Git repository before beginning these setup instructions.

## Terraform Enterprise Setup

Before installing the ServiceNow integration, you need to perform some setup and gather some information in Terraform Enterprise.

1. [Create an organization](../../../users-teams-organizations/organizations.html) (or choose an existing organization) where ServiceNow will create new workspaces.
1. [Create a team](../../../users-teams-organizations/teams.html) for that organization called "ServiceNow", and ensure that it has the organization-level ["Manage Workspaces" permission](../../../users-teams-organizations/permissions.html#manage-workspaces). You do not need to add any users to this team.
1. On the "ServiceNow" team's settings page, generate a [team API token](../../../users-teams-organizations/api-tokens.html#team-api-tokens). **Save this API token for later.**
1. If you haven't yet done so, [connect a VCS provider](/docs/cloud/vcs/index.html) for this Terraform organization.
1. On the organization's VCS provider settings page, find the "OAuth Token ID" for your VCS provider. This is an opaque ID that Terraform Enterprise uses to identify this VCS provider. **Save the OAuth Token ID for later.**

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Installing the ServiceNow Integration

### ServiceNow Server Studio

Import the integration using the [ServiceNow Studio](https://docs.servicenow.com/bundle/madrid-application-development/page/build/applications/concept/c_ServiceNowStudio.html).

1. Launch the ServiceNow Studio by typing "studio" in the search on the left-hand side.
1. Click "Import from Source Control."
    - If this is not your first time opening the Studio, you can also access this from File > Import from Source Control.
1. Fill in the information required to import the integration:
    - URL: `https://github.com/<YOUR_ORG>/terraform-servicenow-integration`
    - Username: `<your VCS username>`
    - Password: `<a VCS Personal Access Token or your password>`
1. Select the Terraform application.
    - Application > Terraform
1. You can now close the ServiceNow Studio or continue customizing the application.

#### Enable Polling Workers (Recommended)

The integration includes 2 ServiceNow Workflow Schedules to poll the Terraform Enterprise API using ServiceNow Outbound HTTP REST requests. By default, all workflow schedules are set to On-Demand. These can be customized inside the ServiceNow Server Studio:

1. Select the Worker Poll Run State (Workflow > Workflow Schedule).
1. Change the value for the Run field from "On-Demand" to "Periodically".
1. Set Repeat Intervals to 1-5 minutes.
1. Click "Update".

##### Worker Poll Apply Run

This worker approves runs for any workspaces that have finished a Terraform plan and are ready to apply their changes. It also adds a comment on the request item for those workspaces notifying that a run has been triggered.

##### Worker Poll Run State

The worker synchronizes ServiceNow with the current run state of Terraform workspaces by polling the Terraform Enterprise API. On state changes, the worker adds a comment to the ServiceNow request item with the updated run state and other metadata.

![screenshot: ServiceNow integration comments](./images/service-now-comments.png)

## Connecting to Terraform Enterprise

-> **Roles Required:** `admin` or `x_terraform.config_user`

1. Exit Service Now Studio and return to the ServiceNow Service Management Screen.
1. Using the left-hand navigation, open the configuration table for the integration to manage the Terraform Enterprise connection.
    - Terraform > Configs
1. Click on "New" to create a new Terraform Enterprise connection:
    - Set API Team Token to the Terraform Enterprise [Team Token](../../../users-teams-organizations/api-tokens.html#team-api-tokens) you created earlier.
    - Set Hostname to the hostname of your Terraform Enterprise instance. (If you're using the SaaS version of Terraform Cloud, this is app.terraform.io.)
    - Set Org Name to the name of the Terraform Enterprise organization you wish to use for new workspaces created by ServiceNow.

## Adding the Terraform Service Catalog

1. In ServiceNow, open the Service Catalog > Catalogs view by searching for "catalogs" in the left-hand navigation.
1. Click the plus sign in the top right.
1. Select Terraform and choose a place to add it.

At this point, your users can request Terraform infrastructure via ServiceNow, but there are not yet any infrastructure items available to request.

## Configuring VCS Repositories

-> **Roles Required:** `admin` or `x_terraform.vcs_repositories_user`

To make infrastructure available to your users, you must add one or more workspace templates to the Terraform service catalog. A workspace template is a VCS repository that contains a Terraform configuration; any repository that could be connected to a manually-created Terraform Enterprise workspace can also be used as a workspace template in the ServiceNow integration.

1. In ServiceNow, open the Terraform > VCS Repositories table by searching for "terraform" in the left-hand navigation.
1. Click "New" to add a VCS repository for fulfillment through the Terraform Service Catalog.
    - Name: The name for this workspace template that you want users to see.
    - OAuth Token ID: The OAuth Token ID that you copied from your Terraform Enterprise organization's VCS providers settings. This ID specifies which VCS provider hosts the desired repository.
    - Identifier: The VCS repository that contains the Terraform configuration for this workspace template. Repository identifiers are determined by your VCS provider; they typically use a format like `<ORGANIZATION>/<REPO NAME>` or `<PROJECT KEY>/<REPO NAME>`. Azure DevOps repositories use the format `<ORGANIZATION>/<PROJECT>/_git/<REPO NAME>`.
    - The remaining fields are optional.

-> **Note:** Currently, the integration defaults to creating workspaces with [auto-apply](../../../workspaces/settings.html#auto-apply-and-manual-apply) enabled. Since VCS-backed workspaces [start Terraform runs when changes are merged](../../../run/ui.html), changes to a workspace template repository may cause new runs in any Terraform workspaces created from it.

## Terraform Variables and ServiceNow Variable Sets

ServiceNow has the concept of a Variable Set which is a collection of ServiceNow Variables that can be referenced in a workflow from a Service Catalog item. The Terraform Integration codebase can create [Terraform Variables and Terraform Environment Variables](../../../workspaces/variables.html) via the API using the `tf_variable.createVariablesFromSet()` function.

This function looks for variables following these conventions:

ServiceNow Variable Name | Terraform Enterprise Variable
--|--
`tf_var_VARIABLE_NAME` | Terraform Variable: `VARIABLE_NAME`
`tf_env_ENV_NAME` | Environment Variable: `ENV_NAME`
`sensitive_tf_var_VARIABLE_NAME` | Sensitive Terraform Variable (Write Only): `VARIABLE_NAME`
`sensitive_tf_env_ENV_NAME` | Sensitive Terraform Environment Variable (Write Only): `ENV_NAME`

This function takes the ServiceNow Variable Set and Terraform Workspace ID. It will loop through the given variable set collection and create any Terraform variables or Terraform environment variables.

## Customizing with ServiceNow "Script Includes" Libraries

The Terraform/ServiceNow Integration codebase includes [ServiceNow Script Includes Classes](https://docs.servicenow.com/bundle/madrid-application-development/page/script/server-scripting/concept/c_ScriptIncludes.html) that are used to interface with Terraform Enterprise. The codebase also includes example catalog items and workflows that implement the interface to Terraform API.

These classes and examples can be used to help create ServiceNow Catalog Items customized to your specific ServiceNow instance and requirements.

### Script Include Classes

The ServiceNow Script Include Classes can be found in the ServiceNow Studio > Server Development > Script Include.

Class Name | Description
--|--
`tf_config` | Helper to pull values from the SN Terraform Configs Table
`tf_http` | SN HTTP REST Wrapper for requests to Terraform API
`tf_run` | Resources for Terraform Run API Requests
`tf_terraform_record` | Manage ServiceNow Terraform Table Records
`tf_util` | Miscellaneous helper functions
`tf_variable` | Resources for Terraform Variable API Requests
`tf_vcs_record` | Manage ServiceNow Terraform VCS Repositories Table Records
`tf_workspace` | Resources for Terraform Workspace API Requests

### Example Service Catalog Workflows

The ServiceNow Example Workflows can be found in the ServiceNow Studio > Workflow > Workflow. By default, the workflows execute upon submitting an order request for the various catalog items. Admins can modify the workflows to wait on an approval action, include approval rules, and specify approver groups.

Workflow Name | Description
--|--
Create Workspace | Creates a new Terraform Enterprise workspace from VCS repository.
Create Workspace with Variables | Creates a new Terraform Enterprise workspace from VCS repository and creates any variables provided.
Create Run | Creates/Queues a new run on the Terraform Enterprise workspace.
Apply Run | Applies a run on the Terraform Enterprise workspace.
Provision Resources | Creates a Terraform Enterprise workspace (with auto-apply), creates/queues a run, applies the run when ready.
Provision Resources with Variables | Creates a Terraform Enterprise workspace (with auto-apply), creates any variables, creates/queues a run, applies the run when ready.
Example Pinned Variables | Creates a Terraform Enterprise workspace (with auto-apply), creates any variables, creates/queues a run, applies the run when ready using a pinned VCS repository and variables.
Delete Workspace | Adds a `CONFIRM_DESTROY=1` to the Terraform workspace and creates a destroy run plan.
Poll Run State | Polls the Terraform Enterprise API for the current run state of a workspace.
Poll Apply Run | Polls the Terraform Enterprise API and applies any pending Terraform runs.
Poll Destroy Workspace | Queries ServiceNow Terraform Records for resources marked `is_destroyable`, applies the destroy run to destroy resources, and deletes the corresponding Terraform workspace.

## ServiceNow ACLs

Access control lists (ACLs) restrict user access to objects and operations based on permissions granted. This integration includes the following roles that can be used to manage various components.

Access Control Roles | Description
:--|--
`x_terraform.config_user` | Can manage the connection from the ServiceNow application to your Terraform Enterprise organization.
`x_terraform.terraform_user` | Can manage all of the Terraform resources created in ServiceNow.
`x_terraform.vcs_repositories_user` | Can manage the VCS repositories available for catalog items to be ordered by end-users.

For users who only need to order from the Terraform Catalog, we recommend creating another role with read-only permissions for `x_terraform_vcs_repositories` to view the available repositories for ordering infrastructure.

# Example Customizations

## Creating a Catalog Item with Pinned Variables

This example use case creates a Terraform catalog item for resources that limits user input to certain variables.

### Create Service Catalog Item

1. Enter the ServiceNow Studio.
1. Click "Create Application File" to raise a dialog box of options.
1. In the dialog, navigate to the "Service Catalog" section, select "Catalog Item", and click the "Create" button.
1. Name the new catalog item. (The rest of this example assumes an item named `Example With Pinned Variables`.)
1. Select Catalogs: "Terraform Catalog" > Select Categories: "Terraform Resources".
1. Add any other descriptions you may want.
1. Click "Submit".

![screenshot: ServiceNow integration create catalog item](./images/service-now-create-catalog-item.png)

### Create Variable Set

1. Click "Create Application File" to raise a dialog box of options.
1. In the dialog, navigate to the "Service Catalog" section, select "Variable Set", and click the "Create" button.
1. Name your variable set. (The rest of this example assumes a set named `Example Pinned Variables`, with a default "Internal Name" of `example_pinned_variables`.)
1. Click "Submit".
1. Under the "Variables" tab click "New".
    1. Create your variable:
    1. In this example we will create a field called `tf_var_pet_name_length` that will be for a Terraform variable that determines the number of words to use for the pet server name.
        - Question: `Pet Name Length`
        - Name: `tf_var_pet_name_length`
        - `tf_var_` tells the Terraform ServiceNow SDK that this is a Terraform variable.
    1. Repeat variable creation as necessary for your use case.
    1. Click "Submit".

![screenshot: ServiceNow integration create catalog item](./images/service-now-create-var-set.png)

### Add Variable Set to Catalog Item

1. Go back to your Catalog Item.
1. Under the "Variable Sets" tab, click "New".
1. Search for and select the variable set you created (`Example Pinned Variables`).
1. Click "Submit".

### Create Custom Workflow

This example uses the "Example With Pinned Variables" workflow, which is one of the example workflows included with the integration.

In the ServiceNow Studio:

1. Navigate to "Workflow" > "Workflow" > "Example With Pinned Variables".
1. Double click on the "Run Script" item.
1. Copy the script code from the editor.
1. Close the "Run Script" and "Workflow" windows.
1. Create a new custom workflow, by clicking "Create Application File" and choosing "Workflow".
    - Name: `Example Pinned Variables` (replace with your custom workflow name)
    - Table: `Requested Item [sc_req_item]` and Click "Submit"
1. Add a "Run Script" item to the workflow, by navigating to the "Core" tab and selecting "Utilities" > "Run Script".
    - Name: `Example Workflow Pinned Variables`
    - Script:
        - Paste in the code copied from the "Provision Resources with Variables" workflow, and change the following lines:

            ```javascript
              // ** Custom Variables **
              var VAR_SET_NAME = "example_pinned_variables";
              var VCS_REPO     = "ORG_NAME/REPO_NAME";
            ```

1. Click "Submit"
1. Ensure that the ServiceNow Run Script is part of the workflow. (The summary of the workflow should look like "Begin" > "Run Script" > "End".)
1. Click the menu at the top left and select "Publish"

### Set The Workflow for Catalog Item

In the ServiceNow Studio:

1. Select the "Example with Pinned Variables" catalog item. ("Service Catalog" > "Catalog Item" > "Example With Pinned Variables")
2. Select the "Process Engine" tab.
3. Set the workflow field by searching for the "Example Pinned Variables" workflow and clicking "Update".

### Test the Catalog Item

The new item should be available in the Terraform Service Catalog. Once the new catalog item is confirmed to work, you can customize as needed.
