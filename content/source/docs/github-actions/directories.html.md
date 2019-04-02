---
layout: "github-actions"
page_title: "Directories - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-directories"
---

# Directories

Currently, each Terraform GitHub Action only supports running in a single directory.
The directory is set by the `TF_ACTION_WORKING_DIR` environment variable.

If you need to run the Terraform Actions in multiple directories, you have to create separate workflows for each directory.
For example, here is a set of workflows for running in two directories, `dir1` and `dir2`:

```hcl
workflow "terraform-dir1" {
  resolves = "terraform-plan-dir1"
  on       = "pull_request"
}

action "filter-to-pr-open-synced" {
  uses = "actions/bin/filter@master"
  args = "action 'opened|synchronize'"
}

action "terraform-fmt-dir1" {
  uses    = "hashicorp/terraform-github-actions/fmt@<latest tag>"
  needs   = "filter-to-pr-open-synced"
  secrets = ["GITHUB_TOKEN"]

  env = {
    TF_ACTION_WORKING_DIR = "dir1"
  }
}

action "terraform-init-dir1" {
  uses    = "hashicorp/terraform-github-actions/init@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
  needs   = "terraform-fmt-dir1"

  env = {
    TF_ACTION_WORKING_DIR = "dir1"
  }
}

action "terraform-validate-dir1" {
  uses    = "hashicorp/terraform-github-actions/validate@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
  needs   = "terraform-init-dir1"

  env = {
    TF_ACTION_WORKING_DIR = "dir1"
  }
}

action "terraform-plan-dir1" {
  uses    = "hashicorp/terraform-github-actions/plan@<latest tag>"
  needs   = "terraform-validate-dir1"
  secrets = ["GITHUB_TOKEN"]

  env = {
    TF_ACTION_WORKING_DIR = "dir1"
  }
}

workflow "terraform-dir2" {
  resolves = "terraform-plan-dir2"
  on       = "pull_request"
}

action "terraform-fmt-dir2" {
  uses    = "hashicorp/terraform-github-actions/fmt@<latest tag>"
  needs   = "filter-to-pr-open-synced"
  secrets = ["GITHUB_TOKEN"]

  env = {
    TF_ACTION_WORKING_DIR = "dir2"
  }
}

action "terraform-init-dir2" {
  uses    = "hashicorp/terraform-github-actions/init@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
  needs   = "terraform-fmt-dir2"

  env = {
    TF_ACTION_WORKING_DIR = "dir2"
  }
}

action "terraform-validate-dir2" {
  uses    = "hashicorp/terraform-github-actions/validate@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
  needs   = "terraform-init-dir2"

  env = {
    TF_ACTION_WORKING_DIR = "dir2"
  }
}

action "terraform-plan-dir2" {
  uses    = "hashicorp/terraform-github-actions/plan@<latest tag>"
  needs   = "terraform-validate-dir2"
  secrets = ["GITHUB_TOKEN"]

  env = {
    TF_ACTION_WORKING_DIR = "dir2"
  }
}
```
