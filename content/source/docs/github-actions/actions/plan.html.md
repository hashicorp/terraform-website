---
layout: "github-actions"
page_title: "Plan - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-actions-plan"
---

# Terraform Plan Action

Runs `terraform plan` and comments back on the pull request with the plan output.

## Success Criteria

This action succeeds if `terraform plan` runs without error.

## Usage

To use the `plan` action, add it to your workflow file.

```hcl
action "terraform plan" {
  # Replace <latest tag> with the latest tag from
  # https://github.com/hashicorp/terraform-github-actions/releases.
  uses = "hashicorp/terraform-github-actions/plan@<latest tag>"

  # `terraform plan` will always fail unless `terraform init` is run first.
  needs = "terraform init"

  # See Environment Variables below for details.
  env = {
    TF_ACTION_WORKING_DIR = "."
    TF_ACTION_WORKSPACE   = "default"
  }

  # If you need to specify additional arguments to terraform plan, add them here.
  # Otherwise, delete this line or leave the array empty.
  args = ["-var", "foo=bar"]

  # We need the GitHub token to be able to comment back on the pull request.
  secrets = ["GITHUB_TOKEN"]
}

action "terraform init" {
  uses = "hashicorp/terraform-github-actions/init@<latest tag>"
  secrets = ["GITHUB_TOKEN"]
}
```

## Environment Variables
| Name                     | Default              | Description                                                         |
|--------------------------|----------------------|---------------------------------------------------------------------|
| `TF_ACTION_WORKING_DIR`  | `"."`                | Which directory `plan` runs in. Relative to the root of the repo.   |
| `TF_ACTION_COMMENT`      | `"true"`             | Set to `"false"` to disable commenting back on pull request.        |
| `TF_ACTION_WORKSPACE`    | `"default"`          | Which [Terraform workspace](/docs/state/workspaces.html) to run in. |
| `TF_ACTION_TFE_HOSTNAME` | `"app.terraform.io"` | If using Terraform Enterprise, set this to its hostname.            |

## Workspaces

The `plan` action only supports running in a single [Terraform workspace](/docs/state/workspaces.html)
defined by the `TF_ACTION_WORKSPACE` environment variable.

If you need to run `plan` in multiple workspaces, see [Workspaces](../workspaces.html).

## Secrets
| Name                  | Description                                                                                                                                                                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GITHUB_TOKEN`        | Required for posting comments to the pull request unless `TF_ACTION_COMMENT = "false"`.                                                                                                                                                       |
| `TF_ACTION_TFE_TOKEN` | If using the Terraform Cloud [remote backend](/docs/backends/types/remote.html) set this secret to a [user API token](/docs/cloud/users-teams-organizations/users.html#api-tokens). |

You'll also likely need to add secrets for your providers, like `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` or `GOOGLE_CREDENTIALS`.

  !> **⚠️ WARNING ⚠️** These secrets could be exposed if the `plan` action is run on a malicious Terraform file.
  To avoid this, we recommend you do not use this action on public repos or repos where untrusted users can submit pull requests.

## Arguments

Arguments to `plan` will be appended to the `terraform plan`
command:

```hcl
action "terraform plan" {
  ...
  args = ["-var", "foo=bar", "-var-file=foo"]
}
```

