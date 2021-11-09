---
layout: "cloud"
page_title: "Workspace Variables - Terraform Cloud and Terraform Enterprise"
description: "Terraform Cloud workspace variables let you customize configurations, modify Terraform's behavior, and store information like provider credentials."

---

# Variables

Terraform Cloud workspace variables let you customize configurations, modify Terraform's behavior, and store information like provider credentials. Terraform Cloud applies workspace variables to all runs within that workspace.

You must have [`read variables` permission](/docs/cloud/users-teams-organizations/permissions.html#general-workspace-permissions) to view the variables for a particular workspace and to view the variable sets in your organization. Once you have the proper [read and write variables permissions](/docs/cloud/users-teams-organizations/permissions.html#general-workspace-permissions), you can create and edit both workspace-specific variables and variable sets through:

- The [Terraform Cloud UI](/docs/cloud/workspaces/managing-variables.html#managing-variables-in-the-ui).
- The Variables API for [workspace-specific variables](/docs/cloud/api/workspace-variables.html) and [variable sets](/docs/cloud/api/variable-sets.html).
- The `tfe` provider [`tfe_variable`](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs/resources/variable) resource. This can be more convenient for large numbers of complex variables.

[permissions-citation]: #intentionally-unused---keep-for-maintainers



## Variable Types

You can create both Terraform variables and environment variables in Terraform Cloud.

> **Hands-on:** The [Create Infrastructure tutorial](https://learn.hashicorp.com/tutorials/terraform/cloud-workspace-configure?in=terraform/cloud-get-started) on HashiCorp Learn shows how to set both Terraform variables and provider credential environment variables.

### Terraform Variables

Terraform variables refer to [input variables](/docs/language/values/variables.html) that define parameters without hardcoding them into the configuration. For example, you could create variables that let users specify the number and type of Amazon Web Services EC2 instances they want to provision with a Terraform module. If a required input variable is missing, Terraform plans in the workspace will fail and print an explanation in the log.

Terraform Cloud passes input variables to Terraform by writing a `terraform.tfvars` file, meaning that Terraform Cloud overwrites any `terraform.tfvars` file you check into version control. You should not check in `terraform.tfvars` files even when running Terraform solely on the command line.

You must define input variables manually; Terraform Cloud does not automatically discover variable names from Terraform code. Workspaces that use Terraform 0.10.0 or later allow you to commit any number of [`*.auto.tfvars` files](/docs/language/values/variables.html#variable-files) to provide default Terraform input variables. If any variables from these files have the same key as existing variables in the Terraform Cloud workspace, the variables applied to the workspace overwrite variables from the files.

### Environment Variables

Terraform Cloud performs Terraform runs on disposable Linux worker VMs using a POSIX-compatible shell. Before running Terraform operations, Terraform Cloud uses the `export` command to populate the shell with environment variables.

Environment variables can store provider credentials and other data. Refer to your provider's Terraform Registry documentation for a full list of supported shell environment variables (e.g., authentication variables for [AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#environment-variables), [Google Cloud Platform](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/getting_started#adding-credentials), and [Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#argument-reference)). Environment variables can also [modify Terraform's behavior](/docs/cli/config/environment-variables.html). For example, `TF_LOG` enables detailed logs for debugging.

#### Parallelism

You can use the `TFE_PARALLELISM` environment variable when your infrastructure providers produce errors on concurrent operations or use non-standard rate limiting. The `TFE_PARALLELISM` variable sets the  `-parallelism=<N>` flag for  `terraform plan` and `terraform apply`  ([more info](/docs/internals/graph.html#walking-the-graph)). Valid values are between 1 and 256, inclusive, and the default is `10`. Terraform Cloud Agents do not support `TFE_PARALLELISM`, but you can specify flags as environment variables directly via [TF_CLI_ARGS](/docs/cli/config/environment-variables.html#tf-cli-args). In these cases, use `TF_CLI_ARGS="parallelism=<N>"` instead.

~> **Warning:** We recommend talking to HashiCorp support before setting `TFE_PARALLELISM`.

## Variable Sets

-> **Note:** Variable sets are in beta.

You can [set workspace-specific variables](/docs/cloud/workspaces/managing-variables.html#workspace-specific-variables) for each workspace or you can [create variable sets](/docs/cloud/workspaces/managing-variables.html#variable-sets) to reuse the same variables across multiple workspaces. For example, you could define a variable set of provider credentials and automatically apply it to one or all workspaces, rather than manually defining credential variables in each. Changes to variable sets instantly apply to all appropriate workspaces, saving time and reducing errors from manual updates.


## Variable Precedence

> **Hands On:** The [Manage Multiple Variable Sets in Terraform Cloud](link) tutorial on HashiCorp Learn shows how to manage multiple variable sets and demonstrates variable precedence.

There are two cases when a workspace may have conflicting variables with the same key. You may [overwrite variables from variable sets](/docs/cloud/workspaces/managing-variables.html#overwrite-variable-sets) or there may be two variables from different variable sets with the same key.
Workspace-specific variables always overwrite variables from variable sets that have the same key.

If different variable sets contain variables of the same type with the same key, Terraform Cloud prioritizes them first based on the variable set scope and then by the date that each variable set was applied to the workspace.

- **Scope:** Variable sets that apply to only a subset of workspaces take precedence over global variable sets that are applied to all workspaces within an organization.

- **Date Applied:** If non-global variable sets have conflicting variables, Terraform cloud prioritizes the variable set that was applied most recently. For example, if you apply Variable Set A and then apply Variable Set B to the same workspace a week later, Terraform Cloud will use any conflicting variables from Variable Set B. This will be the case regardless of which variable set has been edited most recently; Terraform Cloud only considers the date that each variable set is applied to the workspace when determining precedence.

Terraform Cloud displays a message in the UI when it overwrites variables.

![A Terraform Cloud UI message explaining which variables are overwritten](link)

### Precedence Example

Consider an example workspace that has:

**Workspace-specific variables**

- ACCESS_KEY = g
- ACCESS_ID = q
- VAR1 = h

**Variable Set A (applied 10/4)**
- KEY1 = x
- VAR1 = y

**Global Variable Set B (Applied 10/20)**
- KEY1 = z
- VAR2 = a


When you trigger a run, Terraform Cloud applies the following variables:

- **Workspace-Specific:** ACCESS_KEY, ACCESS_ID, and VAR1. That means VAR1 equals h for this run, overwriting the value in Variable Set A.

- **Variable Set A:** KEY1. That means KEY1 equals x for this run, overwriting the value in Variable Set B.

- **Variable Set B:** VAR2. This is a global variable set, so Variable Set A takes precedence regardless of when it was applied.

![An example scenario demonstrating variable precedence in Terraform Cloud](image)