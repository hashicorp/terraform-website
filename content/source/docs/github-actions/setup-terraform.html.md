---
layout: "github-actions"
page_title: "hashicorp/setup-terraform"
---

# hashicorp/setup-terraform

The `hashicorp/setup-terraform` action is a JavaScript action that sets up Terraform CLI in your GitHub Actions workflow by:

- Downloading a specific version of Terraform CLI and adding it to the `PATH`.
- Configuring the [Terraform CLI configuration file](/docs/commands/cli-config.html) with a Terraform Cloud/Enterprise hostname and API token.
- Installing a wrapper script to wrap subsequent calls of the `terraform` binary and expose its STDOUT, STDERR, and exit code as outputs named `stdout`, `stderr`, and `exitcode` respectively. (This can be optionally skipped if subsequent steps in the same job do not need to access the results of Terraform commands.)

After you've used the action, subsequent steps in the same job can run arbitrary Terraform commands using [the GitHub Actions `run` syntax](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun). This allows most Terraform commands to work exactly like they do on your local command line. For example, to switch workspaces, add a step that runs `terraform workspace select`.

The source code and reference documentation for the `hashicorp/setup-terraform` action can be found [here](https://github.com/hashicorp/setup-terraform).

What follows is an end-to-end example workflow, using GitHub Actions to run Terraform within a Terraform Cloud workspace. Terraform Cloud's built-in support for GitHub webhooks can already accomplish this, but performing the run from an Actions workflow makes it possible to add other steps before or after your Terraform commands are executed.

## Example GitHub Actions Workflow

This example workflow uses the following elements:

- A GitHub Actions secret containing a Terraform Cloud user API token.
- A GitHub Actions workflow YAML file.
- A Terraform configuration, which includes a `remote` backend configuration for Terraform Cloud.

### Terraform Configuration

Assume a GitHub repository containing the following Terraform configuration in a `main.tf` file. Note that this uses a Terraform Cloud organization named `example-organization` and a workspace named `example-workspace`.

```hcl
terraform {
 backend "remote" {
   organization = "example-organization"

   workspaces {
     name = "example-workspace"
   }
 }
}

resource "null_resource" "terraform-github-actions" {
 triggers = {
   value = "This resource was created using GitHub Actions!"
 }
}
```

### GitHub Actions Secrets

The workflow file below expects a secret named `TF_API_TOKEN`, whose value is a Terraform Cloud user API token. The value for this secret can be configured in the "Secrets" section of your GitHub repository's "Settings" tab.

![GitHub Actions Secrets](/docs/github-actions/images/setup-terraform/secrets.png)

See also:

- [Configuring GitHub Actions secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)

### GitHub Actions Workflow YAML

The following workflow will take effect when added to the `.github/workflows` directory in a GitHub repository, usually named something like `.github/workflows/terraform.yml`. Note that:

- The workflow uses the expression `${{ secrets.TF_API_TOKEN }}` to refer to the GitHub Actions secret containing your Terraform Cloud user API token.
- On a GitHub `pull_request` event, the workflow will checkout the GitHub repository, download Terraform CLI, configure the Terraform CLI configuration file with a Terraform Cloud user API token, and execute `terraform init`, `terraform fmt -check` and `terraform plan`.
- On a GitHub `push` event to the `master` branch, the workflow will perform the same actions as on a `pull_request` and will additionally execute `terraform apply -auto-approve`.

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

See also:

- The [GitHub Actions documentation](https://help.github.com/en/actions).

On a pull request, the output of the action will appear in the checks section the GitHub pull request interface; on a push, the output will appear in the repository's "Actions" tab.

![GitHub Actions Pull Request Checks](/docs/github-actions/images/setup-terraform/pull-request-checks.png)

In either case, the output is displayed in an abbreviated form but can be expanded to view the full command output.

![GitHub Actions Pull Request Event Workflow Output](/docs/github-actions/images/setup-terraform/pull-request-output.png)

![GitHub Actions Push Event Workflow Output](/docs/github-actions/images/setup-terraform/push-output.png)
