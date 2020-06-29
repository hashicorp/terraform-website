---
layout: "cloud"
page_title: "Setup Instructions - ServiceNow Service Catalog Integration - Terraform Cloud"
description: |-
  ServiceNow integration to enable your users to order Terraform-built infrastructure from ServiceNow
---

# ServiceNow Developer Reference

ServiceNow Developers can customize the Terraform/ServiceNow Integration using this reference for important values and interfaces.

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
