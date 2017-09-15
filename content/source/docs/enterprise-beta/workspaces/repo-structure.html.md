---
layout: "enterprise2"
page_title: "Naming - Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces-repo-structure"
---

# Repo Structure

Terraform Enterprise integrates with version control repositories to ingress
configurations and trigger Terraform runs. Structuring the repo properly is
important because it determines which files Terraform has access to when
Terraform is executed within Terraform Enterprise.


## Structuring Repos for Multiple Environments
There are two ways to structure the Terraform code in your repository to manage
multiple environments (dev, stage, prod). 

Depending on your organization's use of version control, one method for
multi-environment management may be better than the other.

### Branches
For organizations comfortable with long-running branches, it is recommended to
create a branch for each environment. For example, the Terraform code would live
in a repo called `terraform-networking`, and that repo would have two long-running
branches — `prod` and `stage`. Using the branch strategy reduces the number of files
needed in the repo. For example in the below repo structure example, there
is one `main.tf` configuration and one `variables.tf` file. When the repo is
connected to a workspace in TFE, different variables can be set for each
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

In Terraform Enterprise each workspace is configured to listen to the specific
branch for changes using the [VCS branch setting](/docs/enterprise-beta/workspaces/settings.html#vcs-branch).
`Networking-prod` will be configured to listen to the `prod`
branch and `networking-stage` to `stage.` To promote a change to stage, just open
a PR against that branch. To promote to prod, open a PR for stage against prod.
The potential downside of this approach is that the branches get out of sync, so
it is very important to enforce consistent branch merges for promoting changes.

### Directories
For organizations that prefer to have short-lived branches that are
frequently merged into the master branch, it is recommended to create a separate
directory for each environment. This is also good for organizations that
have significant differences between environments. In the below repo structure example,
there is a separate `main.tf` configuration and `variables.tf` file for the prod
and stage environments. These environments can still reference the same modules
like compute and networking.

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

In this example each Workspace in Terraform Enterprise is configured with a
different [Terraform Working Directory](/docs/enterprise-beta/workspaces/settings.html#terraform-working-directory),
which tells Terraform Enterprise which directory to execute Terraform within.
The `networking-prod` workspace is configured with the `prod` Working Directory
and the `networking-stage` workspace is configured with the `stage` Working
Directory.
