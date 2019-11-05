---
layout: "github-actions"
page_title: "Plan - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-configuration-plan"
---

# Terraform Plan Subcommand

Executes `terraform plan` to determine what changes Terraform will make to the resources it manages. If the plan fails, a comment will be posted on the pull request showing the output of `terraform plan`. If the plan succeeds and has changes, a comment will be posted on the pull request showing the output of `terraform plan`.

## Success Criteria

This succeeds if `terraform plan` exits with an exit code of `0` or `2`.

## Usage

To execute the `plan` subcommand, add the following to your GitHub Actions workflow YAML file.

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
      - name: 'Terraform Plan'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'plan'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
