---
layout: "github-actions"
page_title: "Running Apply - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-running-apply"
---

# Running Apply

If you wish, you can configure `terraform apply` to be run. We support two methods:

1. A `pull_request` merged event
1. A `push` event (to a specific branch, ex. `master`)

Each method has pros/cons.

!> **⚠️ Warning ⚠️**
  Regardless of which method you choose, there is a **danger
  of race conditions**.

## Race Conditions
GitHub Actions does not guarantee the order in which each
action runs. If two pull request are merged at the same time, or two commits
are pushed to `master` at the same time, they may run out of order. **This could
result in an old version of your code being applied.**

Because of this danger, **we recommend running `apply` via other automation
methods** rather than via GitHub Actions.

We still offer an `apply` action because many users asked for it and if your
repo is only used by a few people then you can exercise caution.

## `pull_request` Merged Event
If using the merged event, the output of `apply` will be commented back
on the pull request that was merged.

One thing to be aware of, is that the code that will be applied is the branch
from the pull request, not what your repo looks like *after* the code is merged.
If your branch is behind `master`, then you may be applying changes that delete
what's already been applied from `master`. You will always see this in your plan
output, but just be aware.

If you don't want this behavior, use the push event method.

### Workflow
In addition to your `plan` workflow, you must add an additional `Apply` workflow:

```hcl
workflow "Apply" {
  resolves = "terraform-apply"
  # Here you can see we're reacting to the pull_request event.
  on = "pull_request"
}

# Filter to pull request merged events.
action "merged-prs-filter" {
  uses = "actions/bin/filter@master"
  args = "merged true"
}

# Additionally, filter to pull requests merged to master.
action "base-branch-filter" {
  uses = "hashicorp/terraform-github-actions/base-branch-filter@v<latest version>"
  # If you want to run apply when merging into other branches,
  # set this regex.
  args = "^master$"
  needs = "merged-prs-filter"
}

# init must be run before apply.
action "terraform-init-apply" {
  uses = "hashicorp/terraform-github-actions/init@v<latest version>"
  needs = "base-branch-filter"
  secrets = ["GITHUB_TOKEN"]
  env = {
    TF_ACTION_WORKING_DIR = "."
  }
}

# Finally, run apply.
action "terraform-apply" {
  needs = "terraform-init-apply"
  uses = "hashicorp/terraform-github-actions/apply@v<latest version>"
  secrets = ["GITHUB_TOKEN"]
  env = {
    TF_ACTION_WORKING_DIR = "."
    TF_ACTION_WORKSPACE = "default"
  }
}

```

**Note**: be sure to replace `@v<latest version>` with the latest tag.

With this workflow in place, when pull requests are merged, `terraform apply`
will be run.

## Push Event
If using the `push` event, `apply` will be run after a branch is pushed to,
ex. `master`.

The apply output won't be commented on a pull request, but you can see the output
by clicking on the **Actions** tab from the repo's home view.

```hcl
workflow "Apply" {
  resolves = "terraform-apply"
  # Here you can see we're reacting to the push event.
  on = "push"
}

# Filter to pushes to a specific branch. In this case, master.
action "master-branch-filter" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# init must be run before apply.
action "terraform-init-apply" {
  uses = "hashicorp/terraform-github-actions/init@v<latest version>"
  needs = "master-branch-filter"
  secrets = ["GITHUB_TOKEN"]
  env = {
    TF_ACTION_WORKING_DIR = "."
  }
}

# Finally, run apply.
action "terraform-apply" {
  needs = "terraform-init-apply"
  uses = "hashicorp/terraform-github-actions/apply@v<latest version>"
  secrets = ["GITHUB_TOKEN"]
  env = {
    TF_ACTION_WORKING_DIR = "."
    TF_ACTION_WORKSPACE = "default"
  }
}

```
**Note**: be sure to replace `@v<latest version>` with the latest tag.

With this workflow in place, when pull requests are merged into your branch, or
 the branch is pushed to directly, `terraform apply` will be run.
 
 You can view the output from this workflow in the **Actions** tab from the
 repo's home view.
