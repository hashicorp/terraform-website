---
layout: "github-actions"
page_title: "Init - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-actions-init"
---

# Terraform Init Action

Runs `terraform init` to initialize a Terraform working directory and to confirm
that any backends, modules, and providers are configured correctly. This action
will comment back on the pull request on failure.

## Success Criteria

This action succeeds if `terraform init` runs without error.

## Usage

To use the `init` action, add it to your workflow file.

```hcl
action "terraform init" {
  # Replace <latest tag> with the latest tag from
  # https://github.com/hashicorp/terraform-github-actions/releases.
  uses = "hashicorp/terraform-github-actions/init@<latest tag>"

  # See Environment Variables below for details.
  env = {
    TF_ACTION_WORKING_DIR = "."
  }

  # We need the GitHub token to be able to comment back on the pull request.
  secrets = ["GITHUB_TOKEN"]
}
```

## Environment Variables

| Name                     | Default              | Description                                                       |
|--------------------------|----------------------|-------------------------------------------------------------------|
| `TF_ACTION_WORKING_DIR`  | `"."`                | Which directory `init` runs in. Relative to the root of the repo. |
| `TF_ACTION_COMMENT`      | `"true"`             | Set to `"false"` to disable commenting back on pull on error.     |
| `TF_ACTION_TFE_HOSTNAME` | `"app.terraform.io"` | If using Terraform Enterprise, set this to its hostname.          |


## Secrets
| Name                  | Description                                                                                                                                                                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GITHUB_TOKEN`        | Required for posting comments to the pull request unless `TF_ACTION_COMMENT = "false"`.                                                                                                                                                       |
| `TF_ACTION_TFE_TOKEN` | If using the Terraform Cloud [remote backend](/docs/backends/types/remote.html) set this secret to a [user API token](/docs/cloud/users-teams-organizations/users.html#api-tokens). |

**NOTE:** You may also need to add secrets for your providers, like `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` or `GOOGLE_CREDENTIALS`,
if you're using a Terraform feature that uses them during `init` (such as Remote State).

  !> **⚠️ WARNING ⚠️** These secrets could be exposed if the `plan` action is run on a malicious Terraform file.
  To avoid this, we recommend you do not use this action on public repos or repos where untrusted users can submit pull requests.

## Arguments

Arguments to `init` will be appended to the `terraform init` command:

```hcl
action "terraform init" {
  ...
  args = ["-lock=false"]
}
```
