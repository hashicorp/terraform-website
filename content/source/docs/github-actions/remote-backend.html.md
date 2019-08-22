---
layout: "github-actions"
page_title: "Terraform Cloud Remote Backend - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-remote-backend"
---

# Terraform Cloud Remote Backend

Terraform GitHub Actions supports Terraform Cloud's [remote backend](/docs/backends/types/remote.html).

To enable:

1. Create a new secret `TF_ACTION_TFE_TOKEN` set to a Terraform Cloud
 [user API token](/docs/cloud/users-teams-organizations/users.html#api-tokens).
1. Add the secret to the `terraform-init` and `terraform-plan` actions.
1. If you're using Terraform Enterprise, set the `TF_ACTION_TFE_HOSTNAME`
   environment variable to your Terraform Enterprise instance's hostname.

Example:

```hcl
workflow "Terraform Cloud" {
  resolves = "terraform-plan"
  on = "pull_request"
}

action "filter-to-pr-open-synced" {
  uses = "actions/bin/filter@master"
  args = "action 'opened|synchronize'"
}

action "terraform-fmt" {
  uses = "hashicorp/terraform-github-actions/fmt@<latest tag>"
  needs = "filter-to-pr-open-synced"
  secrets = ["GITHUB_TOKEN"]
}

action "terraform-init" {
  uses = "hashicorp/terraform-github-actions/init@<latest tag>"
  needs = "terraform-fmt"
  secrets = ["GITHUB_TOKEN", "TF_ACTION_TFE_TOKEN"]
  env = {
    TF_ACTION_TFE_HOSTNAME = "app.terraform.io"
  }
}

action "terraform-validate" {
  uses = "hashicorp/terraform-github-actions/validate@<latest tag>"
  needs = "terraform-init"
  secrets = ["GITHUB_TOKEN"]
}

action "terraform-plan" {
  uses = "hashicorp/terraform-github-actions/plan@<latest tag>"
  needs = "terraform-validate"
  secrets = ["GITHUB_TOKEN", "TF_ACTION_TFE_TOKEN"]
  env = {
    TF_ACTION_TFE_HOSTNAME = "app.terraform.io"
  }
}
```
