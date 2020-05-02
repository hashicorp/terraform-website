---
layout: "github-actions"
page_title: "hashicorp/setup-terraform"
---

# hashicorp/setup-terraform

The `hashicorp/setup-terraform` action is a JavaScript action that sets up Terraform CLI in your GitHub Actions workflow by:

* Downloading a specific version of Terraform CLI and adding it to the `PATH`.
* Configuring the [Terraform CLI configuration file](/docs/commands/cli-config.html) with a Terraform Cloud/Enterprise hostname and API token.
* Optionally installing a wrapper script to wrap subsequent calls of the `terraform` binary and expose its STDOUT, STDERR, and exit code as outputs named `stdout`, `stderr`, and `exitcode` respectively.

The source code and reference documentation for the `hashicorp/setup-terraform` action can be found [here](https://github.com/hashicorp/setup-terraform).

Let's see how to use this action in a workflow!

## Pre-Requisites

This workflow assumes you already have a Terraform Cloud account that is a member of a Terraform Cloud organization. If you need to create a Terraform Cloud account, please [sign up here](https://app.terraform.io/signup/account).

Additionally, this workflow requires a Terraform Cloud user API token. If you do not have a Terraform Cloud user API token, please [generate one](/docs/cloud/users-teams-organizations/api-tokens.html#user-api-tokens) as it will be needed later.

In order to use GitHub Actions, you'll need access to a GitHub repository where you can store both your Terraform configuration files and your GitHub Actions workflow files. Please create and clone a GitHub repository if you don't already have one to use.

It may also be beneficial to review the [GitHub Actions documentation](https://help.github.com/en/actions) to familiarize yourself with its concepts and syntax.

## Creating a GitHub Actions Workflow

A common GitHub Actions workflow for the `hashicorp/setup-terraform` action is to execute Terraform within a Terraform Cloud workspace. Let's create a workflow file to do just that.

Create a file named `.github/workflows/terraform.yml` in your GitHub reposistory with the following content.

```yaml
name: 'Terraform'

on:
  push:
    branches:
    - master
  pull_request:

jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v1
      with:
        cli_config_credentials_token: ${{ secrets.TF_API_TOKEN }}

    - name: Terraform Init
      run: terraform init

    - name: Terraform Format
      run: terraform fmt -check

    - name: Terraform Plan
      run: terraform plan

    - name: Terraform Apply
      if: github.ref == 'refs/heads/master' && github.event_name == 'push'
      run: terraform apply -auto-approve
```

Let's explain what this workflow does.

On a GitHub `pull_request` event, this workflow will checkout your GitHub repository, download Terraform CLI, configure the Terraform CLI configuration file with a Terraform Cloud user API token, and execute `terraform init`, `terraform fmt -check` and `terraform plan`.

On a GitHub `push` event to the `master` branch, in addition to all of the step mentioned above, this workflow will execute `terraform apply -auto-approve`.

Go ahead and commit and push this workflow file to your remote GitHub repository. It won't do anything meaningful yet, but we'll soon use it to execute Terraform.

You might notice that in this workflow we've defined a [GitHub Actions secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-) named `TF_API_TOKEN` but we haven't yet created that secret or given it a value. Let's do that now.

## Configuring GitHub Actions Secrets

Navigate to your GitHub repository's **Settings** tab and then click on the **Secrets** section. Create a new secret named `TF_API_TOKEN` whose value will be the Terraform Cloud user API token generated earlier. This will enable GitHub Actions to pass your Terraform Cloud user API token into your workflow anywhere it sees the syntax `${{ secrets.TF_API_TOKEN }}`.

![GitHub Actions Secrets](/docs/github-actions/images/setup-terraform/secrets.png)

## Adding Terraform Configuration

Now that we have the GitHub Actions workflow configured we'll need a Terraform configuration to execute. Create a new branch on your GitHub repository. On this new branch, create a file named `main.tf` with the following content. Be sure to replace `ORGANIZATION` with your Terraform Cloud organization name.

```
terraform {
 backend "remote" {
   organization = "ORGANIZATION"

   workspaces {
     name = "terraform-github-actions"
   }
 }
}

resource "null_resource" "terraform-github-actions" {
 triggers = {
   value = "This resource was created using GitHub Actions!"
 }
}
```

This Terraform configuration uses the `remote` backend to communicate with Terraform Cloud. The `remote` backend configuration instructs Terraform to use the Terraform Cloud workspace named `terraform-github-actions` within the specified Terraform Cloud organzation. The Terraform Cloud workspace will be created if it does not already exist. Authentication for the `remote` backend will be configured in the Terraform CLI configuration file that our GitHub Actions workflow will create for us. This Terraform configuration also instructs Terraform to create a `null_resource` resource.

## Executing the Workflow

The GitHub Actions workflow will execute slightly different steps depending on whether the GitHub event is a pull request or a push to the `master` branch.

### Pull Request Events

Go ahead and commit and push your `main.tf` file to your GitHub branch and open a pull request. Since this is a `pull_request` event, GitHub Actions will see your workflow file named `.github/workflows/terraform.yml` and execute the workflow defined within. In a few moments, your pull request should show a check being executed.

![GitHub Actions Pull Request Checks](/docs/github-actions/images/setup-terraform/pull-request-checks.png)

Click on the "Details" link to see the output of your GitHub Actions workflow. Notice that the "Terraform Apply" step was not executed since this is a `pull_request` event, not a `push` event to `master`.

![GitHub Actions Pull Request Event Workflow Output](/docs/github-actions/images/setup-terraform/pull-request-output.png)

### Push Events

Go ahead and merge your pull request. Afterwards click on the **Actions** tab within your GitHub repository and you'll see another GitHub Actions workflow has been executed, this time for a `push` event to the `master` branch. Click on the workflow to see the output of your GitHub Actions workflow. Notice that in addition to all of the other steps, the "Terraform Apply" step was also executed this time since this is a `push` event to `master`.

![GitHub Actions Push Event Workflow Output](/docs/github-actions/images/setup-terraform/push-output.png)
