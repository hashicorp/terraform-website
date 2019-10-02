---
layout: "github-actions"
page_title: "Apply - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-actions-apply"
---

# Terraform Apply Action

Runs `terraform apply`.

If run via the `pull_request` event, will comment back on the pull request with the output.

If run via the `push` event, this action won't comment back on the pull request
but its output can be viewed from the **Actions** tab in the main repo view.

See [Running Apply](../running-apply.html) for more details.

## Success Criteria

This action succeeds if `terraform apply` runs without error.

## Usage

To use the `apply` action, add it to your workflow file.

**NOTE**: See [Running Apply](../running-apply.html) for a full example
of how to use the `apply` action properly.

```hcl
action "terraform apply" {
  # Replace <latest tag> with the latest tag from
  # https://github.com/hashicorp/terraform-github-actions/releases.
  uses = "hashicorp/terraform-github-actions/apply@<latest tag>"

  # `terraform apply` will always fail unless `terraform init` is run first.
  needs = "terraform init"

  # See Environment Variables below for details.
  env = {
    TF_ACTION_WORKING_DIR = "."
    TF_ACTION_WORKSPACE   = "default"
  }

  # If you need to specify additional arguments to terraform apply, add them here.
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

  !> **⚠️ WARNING ⚠️** These secrets could be exposed if the `apply` action is run on a malicious Terraform file.
  To avoid this, we recommend you do not use this action on public repos or repos where untrusted users can submit pull requests.

## Arguments

Arguments to `apply` will be appended to the `terraform apply`
command:

```hcl
action "terraform apply" {
  ...
  args = ["-var", "foo=bar", "-var-file=foo"]
}
```

