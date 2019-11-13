---
layout: "github-actions"
page_title: "Apply - Terraform GitHub Actions"
---

# Terraform Apply Subcommand

Executes `terraform apply` to have Terraform apply changes to the resources it manages. If the apply fails, a comment will be posted on the pull request showing the output of `terraform plan`.

## Success Criteria

This succeeds if `terraform apply` exits with an exit code of `0`.

## Usage

To execute the `apply` subcommand, add the following to your GitHub Actions workflow YAML file.

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
      - name: 'Terraform Apply'
        uses: hashicorp/terraform-github-actions@master
        with:
          tf_actions_version: 0.12.13
          tf_actions_subcommand: 'apply'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
