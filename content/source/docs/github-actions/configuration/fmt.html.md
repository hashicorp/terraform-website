---
layout: "github-actions"
page_title: "Format - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-configuration-fmt"
---

# Terraform Format Subcommand

Executes `terraform fmt` to validate all Terraform files in a directory are in the canonical format. If any files are not formatted correctly, a comment will be posted on the pull request showing each incorrectly formatted file.

## Success Criteria

This succeeds if `terraform fmt` exits with an exit code of `0`.

## Usage

To execute the `fmt` subcommand, add the following to your GitHub Actions workflow YAML file.

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
```
