---
layout: "github-actions"
page_title: "Getting Started - Terraform GitHub Actions"
---

# Getting Started

Terraform GitHub Actions allow you to execute Terraform commands in response to a GitHub event such as updating a pull request or pushing a new commit on a specific branch. Technically speaking, the Terraform GitHub Actions repository contains a single GitHub Action that can be configured to execute different Terraform subcommands. See the [Configuration](./configuration/index.html) section for more details regarding the Terraform subcommands that are supported.

The most straightforward way to get started with Terraform GitHub Actions is to follow the recommended workflow below.

## Recommended Workflow

This workflow will run `terraform fmt`, `terraform init`, `terraform validate`, and `terraform plan` on all `*.tf` files in the root of the GitHub repository where the actions are configured.

1. Create a new branch on your GitHub repository.

1. On this new branch, commit and push a file named `.github/workflows/terraform.yml` with the following contents.

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
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          - name: 'Terraform Init'
            uses: hashicorp/terraform-github-actions@master
            with:
              tf_actions_version: 0.12.13
              tf_actions_subcommand: 'init'
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          - name: 'Terraform Validate'
            uses: hashicorp/terraform-github-actions@master
            with:
              tf_actions_version: 0.12.13
              tf_actions_subcommand: 'validate'
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          - name: 'Terraform Plan'
            uses: hashicorp/terraform-github-actions@master
            with:
              tf_actions_version: 0.12.13
              tf_actions_subcommand: 'plan'
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```

    ~> **Note:** If your Terraform files require provider credentials for commands such as `terraform init`, then you will need to add those credentials as variables within your GitHub Actions workflow YAML file. See [Variables](./common-tasks/variables.html) for details.

1. Create a new pull request for your new branch.

1. Open up the pull request in the GitHub web interface. Within the Actions tab you should see the Terraform GitHub Actions running.
