---
layout: "cloud"
page_title: "Service Catalog - ServiceNow Service Catalog Integration - Terraform Cloud and Terraform Enterprise"
description: |-
  Configure Service Catalogs and VCS repositories to allow end users to
  provision infrastructure using ServiceNow and Terraform Cloud.
---

# Service Catalog Configuration

When using ServiceNow with the Terraform Cloud integration, you will configure
at least one service catalog. You will also configure one or more version
control system (VCS) repositories containing the Terraform configurations which
will be used to provision that infrastructure. End users will request
infrastructure from the service catalog, and Terraform Cloud will fulfill the
request by creating a new workspace, applying the configuration, and then
reporting the results back to ServiceNow.

## Prerequisites

Before configuring a service catalog, you must install and configured the
Terraform Cloud integration software on your ServiceNow instance. These steps
are covered in the [installation documentation](./index.html).

Additionally, you must have have the following information: 

1. The OAuth token ID and repository identifier for each VCS repository that
   Terraform Cloud will use to provision infrastructure. Your Terraform Admin
   will provide these to you.
1. Any Terraform or environment variables required by the configurations in the
   given VCS repositories.

Once these steps are complete, in order for end users to provision
infrastructure with ServiceNow and Terraform Cloud, the ServiceNow Admin will
perform the following steps to make Service Items available to your end users.

1. Add at least one service catalog for use with Terraform.
1. Configure at least one one VCS repository in ServiceNow.
1. Create variable sets to define Terraform and environment variables to be used
   by Terraform Cloud to provision infrastructure.

## Add the Terraform Service Catalog

-> **ServiceNow Role:** `admin`

First, add a Service Catalog for use with the Terraform integration. Depending
on your organization's needs, you might use a single service catalog, or
several. If you already have a Service Catalog to use with Terraform, skip to
the next step.

1. In ServiceNow, open the Service Catalog > Catalogs view by searching for
   "Service Catalog" in the left-hand navigation.
   1. Click the plus sign in the top right.
   1. Select "Catalogs > Terraform Catalog > Title and Image" and choose a
      location to add the Service Catalog.
   1. Close the "Sections" dialog box by clicking the "x" in the upper right-hand
      corner.

-> **Note:** In step 1, be sure to choose "Catalogs", not "Catalog" from the
left-hand navigation.

## Configure VCS Repositories

-> **ServiceNow Roles:** `admin` or `x_terraform.vcs_repositories_user`

To make infrastructure available to your users, you must add one or more VCS
repositories containing Terraform configurations to the Terraform service
catalog.

1. In ServiceNow, open the "Terraform > VCS Repositories" table by searching for
   "terraform" in the left-hand navigation.
1. Click "New" to add a VCS repository, and fill in the following fields:
    - Name: The name for this repository. This name will be visible to end
      users, and does not have to be the same as the repository name as defined
      by your VCS provider. Ideally it will succinctly describe the
      infrastructure that will be provisioned by Terraform from the repository.
    - OAuth Token ID: The OAuth token ID that from your Terraform Cloud
      organization's VCS providers settings. This ID specifies which VCS
      provider configured in Terraform Cloud hosts the desired repository.
    - Identifier: The VCS repository that contains the Terraform configuration
      for this workspace template. Repository identifiers are determined by your
      VCS provider; they typically use a format like
      `<ORGANIZATION>/<REPO_NAME>` or `<PROJECT KEY>/<REPO_NAME>`. Azure DevOps
      repositories use the format `<ORGANIZATION>/<PROJECT>/_git/<REPO_NAME>`.
    - The remaining fields are optional.
      - Branch: The branch within the repository, if different from the default
        branch.
      - Working Directory: The directory within the repository containing
        Terraform configuration.
      - Terraform Version: The version of Terraform to use. This will default to
        the latest version of Terraform supported by your Terraform Cloud
        instance.
1. Click "Submit".

![Screenshot: ServiceNow New VCS Repository](./images/service-now-vcs-repository.png "Screenshot of the ServiceNow Terraform New VCS Repository page")

## Configure a Variable Set

Most Terraform configurations can be customized with Terraform variables or
environment variables. You can create a Variable Set within ServiceNow to
contain the variables needed for a given configuration. Your Terraform Admin
should provide these to you.

1. In ServiceNow, open the "Service Catalog > Variable Sets" table by searching for
   "variable sets" in the left-hand navigation.
1. Click "New" to add a Variable Set.
1. Select "Single-Row Variable Set".
    - Title: User-visible title for the variable set.
    - Internal name: The internal name for the variable set.
    - Order: The order in which the variable set will be displayed.
    - Type: Should be set to "Single Row"
    - Application: Should be set to "Terraform"
    - Display title: Whether the title is displayed to the end user.
    - Layout: How the variables in the set will be displayed on the screen.
    - Description: A long description of the variable set.
1. Click "Submit" to create the variable set.
1. Find and click on the title of the new variable set in the Variable Sets
   table.
1. At the bottom of the variable set details page, click "New" to add a new
   variable.
  - Type: Should be "Single Line Text" for most variables, or "Masked" for
    variables containing sensitive values.
  - Question: The user-visible question or label for the variable.
  - Name: The internal name of the variable. This must be derived from the name of the
      Terraform or environment variable. Consult the table below to determine the
      proper prefix for each variable name.
  - Tooltip: A tooltip to display for the variable.
  - Example Text: Example text to show in the variable's input box.
1. Under the "Default Value" tab, you can set a default value for the variable.
1. Continue to add new variables corresponding to the Terraform and environment
   variables the configuration requires.

When the Terraform integration applies configuration, it will map ServiceNow
variables to Terraform and environment variables using the following convention.
ServiceNow variables that begin with "sensitive_" will be saved as sensitive
variables within Terraform Cloud.

ServiceNow Variable Name | Terraform Cloud Variable
--|--
`tf_var_VARIABLE_NAME` | Terraform Variable: `VARIABLE_NAME`
`tf_env_ENV_NAME` | Environment Variable: `ENV_NAME`
`sensitive_tf_var_VARIABLE_NAME` | Sensitive Terraform Variable (Write Only): `VARIABLE_NAME`
`sensitive_tf_env_ENV_NAME` | Sensitive Environment Variable (Write Only): `ENV_NAME`

## Provision Infrastructure

Once a Service Catalog and VCS repositories have been configured, ServiceNow
users will be able to request infrastructure to be provisioned by Terraform
Cloud.

These requests will be fulfilled by Terraform Cloud, which will:

1. Create a new workspace using the VCS repository provided by ServiceNow.
1. Configure variables for that workspace, also provided by ServiceNow.
1. Plan and apply the change.
1. Report the results, including any outputs from Terraform, to ServiceNow.

Once this is complete, ServiceNow will reflect that the Request Item has been
provisioned.

-> **Note:** The integration creates workspaces with
[auto-apply](../../workspaces/settings.html#auto-apply-and-manual-apply)
enabled. Terraform Cloud will queue an apply for these workspaces whenever
changes are merged to the associated VCS repositories. This is known as the
[VCS-driven run workflow](../../run/ui.html). It is important to keep in mind
that all of the ServiceNow workspaces connected to a given repository will be
updated whenever changes are merged to the associated branch in that repository.
