---
layout: "cloud"
page_title: "Workspace Variables - Terraform Cloud and Terraform Enterprise"
description: "Terraform Cloud workspace variables let you customize configurations, modify Terraform's behavior, and store information like provider credentials."

---

# Variables

Terraform Cloud workspace variables let you customize configurations, modify Terraform's behavior, and store information like provider credentials. You can set variables specifically for each workspace or you can create variable sets to reuse the same variables across multiple workspaces. For example, you could define a variable set of provider credentials and automatically apply it to all of the workspaces using that provider. Terraform Cloud applies workspace variables to all runs within that workspace.

~> **Note:** Variable sets are in beta.

You must have [`read variables` permission](/docs/cloud/users-teams-organizations/permissions.html#general-workspace-permissions) to view the variables for a particular workspace and to view the variable sets in your organization. Once you have the proper [read and write variables permissions](/docs/cloud/users-teams-organizations/permissions.html#general-workspace-permissions), you can create and edit both workspace-specific variables and variable sets through:

- The [Terraform Cloud UI](/docs/cloud/workspaces/managing-variables.html).
- The Variables API for [workspace-specific variables](/docs/cloud/api/workspace-variables.html) and [variable sets](/docs/cloud/api/variable-sets.html).
- The `tfe` provider [`tfe_variable`](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs/resources/variable) resource, which can be more convenient for large numbers of complex variables.

[permissions-citation]: #intentionally-unused---keep-for-maintainers



## Types

You can create both  environment variables and Terraform variables in Terraform Cloud.

> **Hands-on:** Try the [Create and Use a Variable Sets](https://learn.hashicorp.com/tutorials/terraform/cloud-create-variable-set?in=terraform/cloud-get-started) and [Create Infrastructure] (https://learn.hashicorp.com/tutorials/terraform/cloud-workspace-configure?in=terraform/cloud-get-started) tutorials on HashiCorp Learn to set environment and Terraform variables in Terraform Cloud.

### Environment Variables

Terraform Cloud performs Terraform runs on disposable Linux worker VMs using a POSIX-compatible shell. Before running Terraform operations, Terraform Cloud uses the `export` command to populate the shell with environment variables.

Environment variables can store provider credentials and other data. Refer to your provider's Terraform Registry documentation for a full list of supported shell environment variables (e.g., authentication variables for [AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#environment-variables), [Google Cloud Platform](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/getting_started#adding-credentials), and [Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#argument-reference)). Environment variables can also [modify Terraform's behavior](/docs/cli/config/environment-variables.html). For example, `TF_LOG` enables detailed logs for debugging.

#### Parallelism

You can use the `TFE_PARALLELISM` environment variable when your infrastructure providers produce errors on concurrent operations or use non-standard rate limiting. The `TFE_PARALLELISM` variable sets the  `-parallelism=<N>` flag for  `terraform plan` and `terraform apply`  ([more about `parallelism`](/docs/internals/graph.html#walking-the-graph)). Valid values are between 1 and 256, inclusive, and the default is `10`. Terraform Cloud Agents do not support `TFE_PARALLELISM`, but you can specify flags as environment variables directly via [`TF_CLI_ARGS`](/docs/cli/config/environment-variables.html#tf-cli-args). In these cases, use `TF_CLI_ARGS="parallelism=<N>"` instead.

!> **Warning:** We recommend talking to HashiCorp support before setting `TFE_PARALLELISM`.

### Terraform Variables

Terraform variables refer to [input variables](/docs/language/values/variables.html) that define parameters without hardcoding them into the configuration. For example, you could create variables that let users specify the number and type of Amazon Web Services EC2 instances they want to provision with a Terraform module.

``` hcl
variable "instance_count" {
  description = "Number of instances to provision."
  type        = number
  default     = 2
}
```

You can then reference this variable in your configuration.

``` hcl
module "ec2_instances" {
  source = "./modules/aws-instance"

 instance_count = var.instance_count
 ## ...
}
```

If a required input variable is missing, Terraform plans in the workspace will fail and print an explanation in the log.

#### Loading Variables from Files

You can set variable values by providing any number of [files ending in `.auto.tfvars`](/docs/language/values/variables.html#variable-files) to workspaces that use Terraform 0.10.0 or later. When you trigger a run, Terraform automatically loads and uses the variables defined in these files. You can only do this with files ending in `auto.tfvars`; Terraform Cloud does not recognize other types of `.tfvars` files. If any variable from the workspace has the same key as a variable in the file, the workspace variable overwrites variable from the file.

~> **Note:** Terraform Cloud loads variables from files for each Terraform run, but does not automatically persist those variables to the Terraform Cloud workspace or display them in the **Variables** section of the workspace UI.

## Scope

Each environment and Terraform variable can have one of the following scopes:

| Scope | Description| Resources |
|-------|------------|-----------|
|Workspace-Specific | Apply to a single workspace | [Create Workspace-Specific Variables](/docs/cloud/workspaces/managing-variables.html#workspace-specific-variables), [Loading Variables from Files](#loading-variables-from-files), [Workspace-Specific Variables API](/docs/cloud/api/workspace-variables.html).|
|Variable Set | Apply to multiple workspaces within the same organization. | [Create Variable Sets](/docs/cloud/workspaces/managing-variables.html#variable-sets) and [Variable Sets API](/docs/cloud/api/variable-sets.html)|
|Global Variable Set | Automatically applied to all current and future workspaces within an organization. | [Create Variable Sets](/docs/cloud/workspaces/managing-variables.html#variable-sets) and [Variable Sets API](/docs/cloud/api/variable-sets.html)|



## Precedence

> **Hands On:** The [Manage Multiple Variable Sets in Terraform Cloud](https://learn.hashicorp.com/tutorials/terraform/cloud-multiple-variable-sets) tutorial on HashiCorp Learn shows how to manage multiple variable sets and demonstrates variable precedence.


There may be cases when a workspace contains conflicting variables of the same type with the same key. Terraform Cloud marks overwritten variables in the UI.

![The Terraform Cloud UI indicates which variables are overwritten](/docs/cloud/workspaces/images/ui-overwritten-variables.png)

Terraform Cloud prioritizes and overwrites conflicting variables according to the following precedence:

### 1. Workspace-Specific Variables

Workspace-specific variables always overwrite variables from variable sets that have the same key. Refer to [overwrite variables from variable sets](/docs/cloud/workspaces/managing-variables.html#overwrite-variable-sets) for details.

### 2. Non-Global Variable Sets

Non-global variables are only applied to a subset of workspaces in an organization.

When non-global variable sets have conflicting variables, Terraform Cloud uses values from the variable set that was applied most recently. For example, if you apply Variable Set A and then apply Variable Set B to the same workspace a week later, Terraform Cloud will use any conflicting variables from Variable Set B. This will be the case regardless of which variable set has been edited most recently; Terraform Cloud only considers the date that each variable set is applied to the workspace when determining precedence.

### 3. Global Variable Sets

Non-global variable sets always take precedence over global variable sets that are applied to all workspaces within an organization. This is true regardless of when the global variable set was applied.

### 4. Variable Files

When variables from [committed `.auto.tfvars` files](#loading-variables-from-files) have the same key as existing variables in the Terraform Cloud workspace, the variables applied to the workspace overwrite variables from the files.



### Precedence Example

Consider an example workspace that has the following variables applied:

| Name | Scope | Date Applied | ACCESS_KEY | ACCESS_ID | VAR1 | KEY1 | VAR2|
|-----|-------|-------|-----|-------|-------|--------|--------|------|
| Variables | Workspace-Specific | 10/1 | `g47fh474` | `874hf7u4` | `h` |     |     |
| Variable Set A | Non-Global | 10/4 |   |   | `y` | `x` |   |   |
| Variable Set B | Global | 10/20 |   |     |   |  `z` | `a` |

When you trigger a run, Terraform Cloud applies the following variables:

- **Workspace-Specific:** `ACCESS_KEY`, `ACCESS_ID`, and `VAR1`. That means `VAR1` equals `h` for this run, overwriting the value in Variable Set A.

- **Variable Set A:** `KEY1`. That means `KEY1` equals `x` for this run, overwriting the value in Variable Set B.

- **Variable Set B:** `VAR2`. This is a global variable set, so Variable Set A takes precedence regardless of when it was applied.

![An example scenario demonstrating variable precedence in Terraform Cloud](/docs/cloud/workspaces/images/variable-precedence-example.png)