---
layout: "github-actions"
page_title: "Configuration - Terraform GitHub Actions"
---

# Configuration

Terraform GitHub Actions allow you to execute Terraform commands within GitHub Actions.

The output of the actions can be viewed from the Actions tab in the main repository view. If the actions are executed on a pull request event, a comment may be posted on the pull request.

Terraform GitHub Actions are actually a single GitHub Action that executes different Terraform subcommands depending on what the GitHub Actions workflow YAML file contains.

## Success Criteria

An exit code of `0` is considered a succesful execution.

## Usage

The usage documented here applies to all subcommands. See the links below for documentation specific to each subcommand.

* [fmt](./fmt.html)
* [init](./init.html)
* [validate](./validate.html)
* [plan](./plan.html)
* [apply](./apply.html)

The most common workflow is to run `terraform fmt`, `terraform init`, `terraform validate`, and `terraform plan` on all of the `*.tf` files in the root of the repository when a pull request is updated. A comment will be posted to the pull request depending on the output of the Terraform subcommand being executed. This workflow can be configured by adding the following content to the GitHub Actions workflow YAML file.

```yaml
name: 'Terraform GitHub Actions'
on:
  - pull_request
jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout'
        uses: actions/checkout@master
      - name: 'Terraform Format'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'fmt'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: 'Terraform Init'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'init'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: 'Terraform Validate'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'validate'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: 'Terraform Plan'
        id: 'terraform_plan'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'plan'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

Inputs configure Terraform GitHub Actions to perform different actions. Input values can be specified using the `with` attribute.

* `tf_actions_version` - (Required) The Terraform version to install and execute.
* `tf_actions_subcommand` - (Required) The Terraform subcommand to execute. Valid values are `fmt`, `init`, `validate`, `plan`, and `apply`.
* `tf_actions_working_dir` - (Optional) The working directory to change into before executing Terraform subcommands. Defaults to `.` which means use the root of the GitHub repository.
* `tf_actions_comment` - (Optional) Whether or not to comment on GitHub pull requests. Defaults to `true`.

## Outputs

Outputs are used to pass information to subsequent GitHub Actions steps. This allows a subsequent step within a job to perform different actions based on the output of previous steps.

To use a step's outputs, you must first specify an `id` attribute for that step. Subsequent steps can then reference its outputs as `{{ steps.<STEP ID>.outputs.<OUTPUT NAME> }}`. (For example, `{{ steps.terraform_plan.outputs.tf_actions_plan_has_changes }}`.) For more details, see the [GitHub Actions documentation for contexts and expressions](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/contexts-and-expression-syntax-for-github-actions#steps-context).

* `tf_actions_plan_has_changes` - Whether or not the Terraform plan contained changes. Only valid for `plan` and `apply` steps.

## Secrets

Secrets allow the GitHub Actions workflow YAML to reference encrypted values that are stored outside the YAML. GitHub Actions provides some secrets by default, but arbitrary secrets can also be configured. To configure secrets for a GitHub repository, navigate to Settings > Secrets within a repository. For more information regarding creating and using secrets, refer to the [GitHub Actions documentation](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets).

Terraform GitHub Actions expect the following secret values to be provided as environment variables using the `env` attribute.

* `GITHUB_TOKEN` - The GitHub API token used to post comments to pull requests. Not required if the `tf_actions_comment` input is set to `false`.

Other secrets may be needed to authenticate with Terraform backends and providers.

!> **Warning:** These secrets could be exposed if the action is executed on a malicious Terraform file. To avoid this, we recommend not using Terraform GitHub Actions on repositories where untrusted users can submit pull requests.

## Environment Variables

Environment variables are exported in the environment where the Terraform GitHub Actions are executed. This allows a user to modify the behavior of certain GitHub Actions.

The usual [Terraform environment variables](https://www.terraform.io/docs/commands/environment-variables.html) are supported. Here are a few of the more commonly used environment variables.

* [`TF_LOG`](https://www.terraform.io/docs/commands/environment-variables.html#tf_log)
* [`TF_VAR_name`](https://www.terraform.io/docs/commands/environment-variables.html#tf_var_name)
* [`TF_CLI_ARGS`](https://www.terraform.io/docs/commands/environment-variables.html#tf_cli_args-and-tf_cli_args_name)
* [`TF_CLI_ARGS_name`](https://www.terraform.io/docs/commands/environment-variables.html#tf_cli_args-and-tf_cli_args_name)
* `TF_WORKSPACE`

Other environment variables may be configured to pass data into Terraform backends and providers. If the data is sensitive, consider referencing [secrets](#secrets) instead of directly including the values.
