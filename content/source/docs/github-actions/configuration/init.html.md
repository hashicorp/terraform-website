---
layout: "github-actions"
page_title: "Init - Terraform GitHub Actions"
---

# Terraform Init Subcommand

Executes `terraform init` to initialize a Terraform working directory and to confirmed that any backends, modules, and providers are configured correctly. If the initialization fails, a comment will be posted on the pull request showing the output of `terraform init`.

## Success Criteria

This succeeds if `terraform init` exits with an exit code of `0`.

## Usage

To execute the `init` subcommand, add the following to your GitHub Actions workflow YAML file.

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
```
