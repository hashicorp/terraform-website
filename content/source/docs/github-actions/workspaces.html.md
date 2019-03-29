---
layout: "github-actions"
page_title: "Workspaces - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-workspaces"
---

# Workspaces

Currently, the [Terraform Plan Action](./actions/plan.html) only supports running in a single
[Terraform workspace](/docs/state/workspaces.html). The
workspace is defined by the `TF_ACTION_WORKSPACE` environment variable.

If you need to run the Terraform Actions in multiple workspaces, you have to create separate workflows for each workspace.
For example, here is a set of workflows for running in two workspaces, `workspace1` and `workspace2`:

```hcl
workflow "terraform-workspace1" {
  resolves = "terraform-plan-workspace1"
  on       = "pull_request"
}

workflow "terraform-workspace2" {
  resolves = "terraform-plan-workspace2"
  on       = "pull_request"
}

action "filter-to-pr-open-synced" {
  uses = "actions/bin/filter@master"
  args = "action 'opened|synchronize'"
}

action "terraform-fmt" {
  uses    = "hashicorp/terraform-github-actions/fmt@<latest tag>"
  needs   = "filter-to-pr-open-synced"
  secrets = ["GITHUB_TOKEN"]
}

action "terraform-init" {
  uses    = "hashicorp/terraform-github-actions/init@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
  needs   = "terraform-fmt"
}

action "terraform-validate" {
  uses    = "hashicorp/terraform-github-actions/validate@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
  needs   = "terraform-init"
}

action "terraform-plan-workspace1" {
  uses    = "hashicorp/terraform-github-actions/plan@<latest tag>"
  needs   = "terraform-validate"
  secrets = ["GITHUB_TOKEN"]

  env = {
    TF_ACTION_WORKSPACE = "workspace1"
  }
}

action "terraform-plan-workspace2" {
  uses    = "hashicorp/terraform-github-actions/plan@<latest tag>"
  needs   = "terraform-validate"
  secrets = ["GITHUB_TOKEN"]

  env = {
    TF_ACTION_WORKSPACE = "workspace2"
  }
}
```
