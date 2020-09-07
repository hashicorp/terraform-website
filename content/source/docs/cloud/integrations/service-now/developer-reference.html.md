---
layout: "cloud"
page_title: "Developer Reference - ServiceNow Service Catalog Integration -
Terraform Cloud and Terraform Enterprise"
description: |-
  Developer reference for the ServiceNow Service Catalog Integration.
---

# Terraform ServiceNow Service Catalog Integration Developer Reference

The Terraform ServiceNow integration can be customized by ServiceNow developers
using the information found in this document. 

## Terraform Variables and ServiceNow Variable Sets

ServiceNow has the concept of a Variable Set which is a collection of ServiceNow
Variables that can be referenced in a Flow from a Service Catalog item. The
Terraform Integration codebase can create [Terraform Variables and Terraform
Environment Variables](../../workspaces/variables.html) via the API using the
`tf_variable.createVariablesFromSet()` function.

This function looks for variables following these conventions:

ServiceNow Variable Name | Terraform Cloud Variable
--|--
`tf_var_VARIABLE_NAME` | Terraform Variable: `VARIABLE_NAME`
`tf_env_ENV_NAME` | Environment Variable: `ENV_NAME`
`sensitive_tf_var_VARIABLE_NAME` | Sensitive Terraform Variable (Write Only): `VARIABLE_NAME`
`sensitive_tf_env_ENV_NAME` | Sensitive Environment Variable (Write Only): `ENV_NAME`

This function takes the ServiceNow Variable Set and Terraform Cloud workspace
ID. It will loop through the given variable set collection and create any
necessary Terraform variables or environment variables in the workspace.

## Customizing with ServiceNow "Script Includes" Libraries

The Terraform/ServiceNow Integration codebase includes [ServiceNow Script
Includes
Classes](https://docs.servicenow.com/bundle/madrid-application-development/page/script/server-scripting/concept/c_ScriptIncludes.html)
that are used to interface with Terraform Cloud. The codebase also includes
example catalog items and flows that implement the interface to the Terraform
Cloud API.

These classes and examples can be used to help create ServiceNow Catalog Items
customized to your specific ServiceNow instance and requirements.

### Script Include Classes

The ServiceNow Script Include Classes can be found in the ServiceNow Studio >
Server Development > Script Include.

Class Name | Description
--|--
`tf_config` | Helper to pull values from the SN Terraform Configs Table
`tf_http` | ServiceNow HTTP REST Wrapper for requests to Terraform API
`tf_run` | Resources for Terraform Run API Requests
`tf_terraform_record` | Manage ServiceNow Terraform Table Records
`tf_util` | Miscellaneous helper functions
`tf_variable` | Resources for Terraform Variable API Requests
`tf_vcs_record` | Manage ServiceNow Terraform VCS Repositories Table Records
`tf_workspace` | Resources for Terraform Workspace API Requests


### Example Service Catalog Flows and Actions

The ServiceNow Example Flows can be found in the ServiceNow Studio > Flows. By
default, the flows execute upon submitting an order request for the various
catalog items. Admins can modify the flows and Actions to wait on an approval
action, include approval rules, and specify approver groups.

Flow Name | Description
--|--
Create Workspace | Creates a new Terraform Cloud workspace from VCS repository.
Create Workspace with Vars | Creates a new Terraform Cloud workspace from VCS repository and creates any variables provided.
Create Run | Creates/queues a new run on the Terraform Cloud workspace.
Apply Run | Applies a run on the Terraform Cloud workspace.
Provision Resources | Creates a Terraform Cloud workspace (with auto-apply), creates/queues a run, applies the run when ready.
Provision Resources with Vars | Creates a Terraform Cloud workspace (with auto-apply), creates any variables, creates/queues a run, applies the run when ready.
Delete Workspace | Creates a destroy run plan.
Worker Poll Run State | Polls the Terraform Cloud API for the current run state of a workspace.
Worker Poll Apply Run | Polls the Terraform Cloud API and applies any pending Terraform runs.
Worker Poll Destroy Workspace | Queries ServiceNow Terraform Records for resources marked `is_destroyable`, applies the destroy run to destroy resources, and deletes the corresponding Terraform workspace.

## ServiceNow ACLs

Access control lists (ACLs) restrict user access to objects and operations based
on permissions granted. This integration includes the following roles that can
be used to manage various components.

Access Control Roles | Description
:--|--
`x_terraform.config_user` | Can manage the connection from the ServiceNow application to your Terraform Cloud organization.
`x_terraform.terraform_user` | Can manage all of the Terraform resources created in ServiceNow.
`x_terraform.vcs_repositories_user` | Can manage the VCS repositories available for catalog items to be ordered by end-users.

For users who only need to order from the Terraform Catalog, we recommend
creating another role with read-only permissions for
`x_terraform_vcs_repositories` to view the available repositories for ordering
infrastructure. Install the Terraform ServiceNow Service Catalog integration by
following [the installation guide](./index.html).
