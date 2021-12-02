---
layout: "cloud"
page_title: "CLI-driven Runs - Runs - Terraform Cloud and Terraform Enterprise"
description: |-
  Trigger runs from your terminal using the Terraform CLI. Learn the required configuration for remote CLI runs.
---

[sentinel]: ../sentinel/index.html
[private]: ../registry/index.html
[cloud]: /docs/cli/configuring-terraform-cloud/initialization.html
[speculative plan]: ./index.html#speculative-plans
[tfe-provider]: https://registry.terraform.io/providers/hashicorp/tfe/latest/docs

# The CLI-driven Run Workflow

> **Hands-on:** Try the [Authenticate the CLI with Terraform Cloud](https://learn.hashicorp.com/tutorials/terraform/cloud-login?in=terraform/0-13&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

Terraform Cloud has three workflows for managing Terraform runs.

- The [UI/VCS-driven run workflow](./ui.html), which is the primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The CLI-driven run workflow described below, which uses Terraform's standard CLI tools to execute runs in Terraform Cloud.

## Summary

The [CLI integration][cloud] brings Terraform Cloud's collaboration features into the familiar Terraform CLI workflow. It offers the best of both worlds to developers who are already comfortable with using Terraform, and it can work with existing CI/CD pipelines.

You can start runs with the standard `terraform plan` and `terraform apply` commands and then watch the progress of the run from your terminal. These runs execute remotely in Terraform Cloud; they use variables from the appropriate workspace, enforce any applicable [Sentinel policies][sentinel], and can access Terraform Cloud's [private registry][private] and remote state inputs.

Terraform Cloud offers two kinds of CLI-driven runs, to support different stages of your workflow:

- `terraform plan` starts a [speculative plan][] in a Terraform Cloud workspace, using configuration files from a local directory. You can quickly check the results of edits (including compliance with Sentinel policies) without needing to copy sensitive variables to your local machine.

  Speculative plans work with all workspaces, and can co-exist with the [VCS-driven workflow](./ui.html).

- `terraform apply` starts a normal plan and apply in a Terraform Cloud workspace, using configuration files from a local directory.

  Remote `terraform apply` is for workspaces without a linked VCS repository. It replaces the VCS-driven workflow with a more traditional CLI workflow.

To supplement these remote operations, you can also use the optional [Terraform Enterprise Provider][tfe-provider], which interacts with the resources supported by Terraform Cloud. It can be useful for editing variables and workspace settings through the Terraform CLI.

~> **Note:** The [Structured Run Output](../workspaces/settings.html#user-interface) user interface will not apply to runs executed using the CLI-driven workflow, regardless of the setting in the Terraform Cloud workspace.

## Configuration

To enable the CLI-driven workflow, you must:

1. Add the `cloud` block to your Terraform configuration. For example:

    ```
    terraform {
      cloud {
        organization = "my-org"
        workspaces {
          tags = ["networking"]
        }
      }
    }
    ```

1. Run `terraform init`.

Refer to [Using Terraform Cloud](cloud) for more details about how to initialize and configure the integration.

~> **Note**: The `cloud` block is available in Terraform v1.1 and later and Terraform Enterprise v202201 and later. Previous versions can use the [`remote` backend](/docs/language/settings/backends/remote.html) to configure the CLI workflow and migrate state.

### Implicit Workspace Creation

If you configure the `cloud` block to use a workspace that doesn't yet exist in your organization, Terraform Cloud will create a new workspace with that name when you run `terraform init`. The output of `terraform init` will inform you when this happens.

Automatically created workspaces might not be immediately ready to use, so use Terraform Cloud's UI to check a workspace's settings and data before performing any runs. In particular, note that:

- No Terraform variables or environment variables are created by default, unless your organization has configured one or more [global variable sets](/docs/cloud/workspaces/variables.html#scope). Terraform Cloud will use `*.auto.tfvars` files if they are present, but you will usually still need to set some workspace-specific variables.
- The execution mode defaults to "Remote," so that runs occur within Terraform Cloud's infrastructure instead of on your workstation.
- New workspaces are not automatically connected to a VCS repository and do not have a working directory specified.
- A new workspace's Terraform version defaults to the most recent release of Terraform at the time the workspace was created.

## Variables in CLI-Driven Runs

Remote runs in Terraform Cloud use:

- Run-Specific variables set via the command line or in your local environment. Terraform only uses the environment variables from your shell environment that are prefixed with `TF_VAR`.
- Workspace-Specific Terraform and environment variables set in the workspace.
- Variable sets applied to the workspace.
- Terraform variables from any `*.auto.tfvars` files included in the configuration.

Refer to [Variables](/docs/cloud/workspaces/variables.html) for more details about variable types, variable scopes, variable precedence, and how to set run-specific variables through the command line.

## Remote Working Directories

If you manage your Terraform configurations in self-contained repositories, the remote working directory always has the same content as the local working directory.

If you use a combined repository and [specify a working directory on workspaces](../workspaces/settings.html#terraform-working-directory), you can run Terraform from either the real working directory or from the root of the combined configuration directory. In both cases, Terraform will upload the entire combined configuration directory.

## Excluding Files from Upload

-> **Version note:** `.terraformignore` support was added in Terraform 0.12.11.

CLI-driven runs upload an archive of your configuration directory
to Terraform Cloud. If the directory contains files you want to exclude from upload,
you can do so by defining a [`.terraformignore` file in your configuration directory](/docs/cli/using-terraform-cloud/initialization.html).

## Remote Speculative Plans

You can run speculative plans in any workspace where you have permission to queue plans. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

To run a [speculative plan][] on your configuration, use the `terraform plan` command. The plan will run in Terraform Cloud, and the logs will stream back to the command line along with a URL to view the plan in the Terraform Cloud UI.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Speculative plans use the configuration code from the local working directory, but will use variable values from the specified workspace.


## Remote Applies

You can trigger remote applies in any workspaces where you have permission to apply runs. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

When you are ready to apply configuration changes, use the `terraform apply` command. The apply will start in Terraform Cloud, and the command line will prompt you for approval before applying the changes.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Remote applies use the configuration code from the local working directory, but use the variable values from the specified workspace.

~> **Important:** You cannot run remote applies in workspaces that are linked to a VCS repository, since the repository serves as the workspace’s source of truth. To apply changes in a VCS-linked workspace, merge your changes to the designated branch.


## Sentinel Policies

If the specified workspace uses Sentinel policies, those policies will run against all speculative plans and remote applies in that workspace. Policy output is shown in the terminal.

Failed policies can pause or prevent an apply, depending on the enforcement level:

- Hard mandatory checks cannot be overridden and they prevent `terraform apply` from applying changes.
- Soft mandatory checks can be overridden by users with permission to [manage policy overrides](/docs/cloud/users-teams-organizations/permissions.html#manage-policy-overrides). If your account can override a failed check, Terraform will prompt you to type "override" to confirm. (Note that typing "yes" will not work.) If you override the check, you will be prompted to apply the run (unless auto-apply is enabled).

[permissions-citation]: #intentionally-unused---keep-for-maintainers

```
$ terraform apply

[...]

Plan: 1 to add, 0 to change, 1 to destroy.

------------------------------------------------------------------------

Organization policy check:

Sentinel Result: false

Sentinel evaluated to false because one or more Sentinel policies evaluated
to false. This false was not due to an undefined value or runtime error.

1 policies evaluated.
## Policy 1: my-policy.sentinel (soft-mandatory)

Result: false

FALSE - my-policy.sentinel:1:1 - Rule "main"

Do you want to override the soft failed policy check?
  Only 'override' will be accepted to override.

  Enter a value: override
```

## Options for Plans and Applies

[Run Modes and Options](/docs/cloud/run/modes-and-options.html) contains more details about the various options available for plans and applies when you use the CLI-driven workflow.
