---
layout: "github-actions"
page_title: "Terraform Variables - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-workflows-variables"
---

# Terraform Variables

Variables can be configured directly in the GitHub Actions workflow YAML a few ways.

## Using an Environment Variable

The `TF_VAR_name` environment variable can be used to define a value for a variable. When using `TF_VAR_name`,`name` is the name of the Terraform variable as declared in the Terraform files.

Here, the Terraform variable `environment` is set to the value `development`.

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
      - name: 'Terraform Init'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'init'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          TF_VAR_environment: 'development'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Using a Variable File

Terraform can be configured to use a variable file.

Here, Terraform is configured to use the variable file `development.tfvars`.

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
      - name: 'Terraform Init'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'init'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          TF_CLI_ARGS_init: '-var-file="development.tfvars"'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
