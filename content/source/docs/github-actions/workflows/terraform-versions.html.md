---
layout: "github-actions"
page_title: "Terraform Versions - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-workflows-tf-versions"
---

# Terraform Versions

Specify the version of Terraform to be executed using the `tf_actions_version` input.

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
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
