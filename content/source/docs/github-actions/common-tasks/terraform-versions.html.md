---
layout: "github-actions"
page_title: "Terraform Versions - Terraform GitHub Actions"
---

# Terraform Versions

Specify the version of Terraform to be executed using the `tf_actions_version` input.  
If set to `latest`, the latest stable version will be used. Below, Terraform 0.12.13 is being used.

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
          tf_actions_version: 0.12.13 # or 'latest'
          tf_actions_subcommand: 'init'
          tf_actions_working_dir: '.'
          tf_actions_comment: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
