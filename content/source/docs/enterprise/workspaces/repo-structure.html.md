---
layout: "enterprise2"
page_title: "Naming - Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces-repo-structure"
---

# Repo Structure

Terraform Enterprise integrates with version control repositories to obtain
configurations and trigger Terraform runs. Structuring the repo properly is
important because it determines which files Terraform has access to when
Terraform is executed within Terraform Enterprise.


## Structuring Repos for Multiple Environments

There are two ways to structure the Terraform code in your repository to manage
multiple environments (dev, stage, prod).

Depending on your organization's use of version control, one method for
multi-environment management may be better than the other.

### Branches

For organizations comfortable with long-running branches, we recommend
creating a branch for each environment. For example, Terraform code would live
in a repo called `terraform-networking`, which would have two long-running
branches — `prod` and `stage`.

Using the branch strategy reduces the number of files
needed in the repo. In the example repo structure below, there
is only one `main.tf` configuration and one `variables.tf` file. When you connect the repo to a workspace in TFE, you can set different variables for each
workspace — one set of variables for `prod` and one set for `stage`.

```
├── README.md
├── variables.tf
├── main.tf
├── outputs.tf
├── modules
│   ├── compute
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   ├── networking
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
```

Each workspace listens to a specific
branch for changes, as configured by the [VCS branch setting](/docs/enterprise-beta/workspaces/settings.html#vcs-branch).
The `networking-prod` workspace should be configured to listen to the `prod`
branch and `networking-stage` to `stage.` To promote a change to stage, just open
a PR against that branch. To promote to prod, open a PR for stage against prod.

The potential downside of this approach is that the branches can drift out of sync, so
it is very important to enforce consistent branch merges for promoting changes.

### Directories

For organizations that prefer short-lived branches that are
frequently merged into the master branch, we recommend creating a separate
directory for each environment. This is also good for organizations that
have significant differences between environments.

In the example repo structure below,
the prod and stage environments have separate `main.tf` configurations and `variables.tf` files. These environments can still reference the same modules
(like `compute` and `networking`).

```
├── environments
│   ├── prod
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   ├── stage
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
├── modules
│   ├── compute
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   ├── networking
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
```

In this example, each workspace is configured with a
different [Terraform Working Directory](/docs/enterprise-beta/workspaces/settings.html#terraform-working-directory). This setting
tells TFE which directory to execute Terraform in.
The `networking-prod` workspace is configured with `prod` as its working directory
and the `networking-stage` workspace is configured with `stage` as its working
directory. Unlike in the previous example, every workspace listens for changes to the master branch.

The potential downside to this approach is that changes have to be manually promoted between stages, and the directory contents can drift out of sync.
