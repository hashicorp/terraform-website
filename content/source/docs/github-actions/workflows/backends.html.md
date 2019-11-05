---
layout: "github-actions"
page_title: "Backends - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-workflows-backends"
---

# Terraform Backends

Terraform GitHub Actions supports initializing a `backend` block using the `TF_CLI_ARGS_init` environment variable.

The example below shows how to pass the `token` and `organization` arguments to the `remote` backend block.

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
          TF_CLI_ARGS_init: '-backend-config="token=CHANGE_ME" -backend-config="organization=CHANGE_ME"'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For sensitive values, consider using secrets instead.

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
          TF_CLI_ARGS_init: '-backend-config="token=${{ secrets.TOKEN }}" -backend-config="organization=CHANGE_ME"'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
