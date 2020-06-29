---
layout: "cloud"
page_title: "Service Catalog - ServiceNow Service Catalog Integration - Terraform Cloud"
description: |-
  ServiceNow integration to enable your users to order Terraform-built infrastructure from ServiceNow
---

# Configure a ServiceNow Service Catalog

Once the Terraform ServiceNow integration has been installed, you can configure
the Service Catalog to use Terraform to provision infrastructure.

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
    - Identifier: The VCS repository that contains the Terraform configuration for this workspace template. Repository identifiers are determined by your VCS provider; they typically use a format like `<ORGANIZATION>/<REPO NAME>` or `<PROJECT KEY>/<REPO NAME>`.
    - The remaining fields are optional.

-> **Note:** Currently, the integration defaults to creating workspaces with [auto-apply](../../workspaces/settings.html#auto-apply-and-manual-apply) enabled. Since VCS-backed workspaces [start Terraform runs when changes are merged](../../run/ui.html), changes to a workspace template repository may cause new runs in any Terraform workspaces created from it.


## Terraform Variables and ServiceNow Variable Sets

ServiceNow has the concept of a Variable Set which is a collection of ServiceNow Variables that can be referenced in a workflow from a Service Catalog item. The Terraform Integration codebase can create [Terraform Variables and Terraform Environment Variables](../../workspaces/variables.html) via the API using the `tf_variable.createVariablesFromSet()` function.

This function looks for variables following these conventions:

ServiceNow Variable Name | Terraform Enterprise Variable
--|--
`tf_var_VARIABLE_NAME` | Terraform Variable: `VARIABLE_NAME`
`tf_env_ENV_NAME` | Environment Variable: `ENV_NAME`
`sensitive_tf_var_VARIABLE_NAME` | Sensitive Terraform Variable (Write Only): `VARIABLE_NAME`
`sensitive_tf_env_ENV_NAME` | Sensitive Terraform Environment Variable (Write Only): `ENV_NAME`

This function takes the ServiceNow Variable Set and Terraform Workspace ID. It will loop through the given variable set collection and create any Terraform variables or Terraform environment variables.

