---
layout: "github-actions"
page_title: "Validate - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-configuration-validate"
---

# Terraform Validate Subcommand

Executes `terraform validate` to validate the Terraform files in a working directory. Validate runs checks that verify whether a configuration is syntactically valid and internally consistent, regardless of any provided variables or existing state. If the validation fails, a comment will be posted on the pull request showing the output of `terraform validate`.

## Success Criteria

This succeeds if `terraform validate` exits with an exit code of `0`.

## Usage

To execute the `validate` subcommand, add the following to your GitHub Actions workflow YAML file.

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
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: 'Terraform Validate'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'validate'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
