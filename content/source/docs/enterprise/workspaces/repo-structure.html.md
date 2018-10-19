---
layout: "enterprise2"
page_title: "VCS Repository Structure - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-repo-structure"
---

# Repository Structure

Terraform Enterprise integrates with version control repositories to obtain
configurations and trigger Terraform runs. Structuring the repo properly is
important because it determines which files Terraform has access to when
Terraform is executed within Terraform Enterprise, and when Terraform plans will run.

## Structuring Repos for Multiple Environments

There are three ways to structure the Terraform code in your repository to manage multiple environments (such as dev, stage, prod).

Depending on your organization's use of version control, one method for multi-environment management may be better than another.

### Multiple Workspaces per Repo (Recommended)

Using a single repo attached to multiple workspaces is the simplest best-practice approach, as it enables the creation of a pipeline to promote changes through environments, without additional overhead in version control. When using this model, one repo, such as `terraform-networking`, is connected to multiple workspaces — `networking-prod`, `networking-stage`, `networking-dev`. While the repo connection is the same in each case, each workspace can have a unique set of variables to configure the differences per environment.

To make an infrastructure change, a user opens a pull request on the `terraform-networking` repo, which will trigger a [speculative plan](../run/index.html#speculative-plans) in all three connected workspaces. The user can then merge the PR and apply it in one workspace at a time, first with `networking-dev`, then `networking-stage`, and finally `networking-prod`. Eventually, Terraform Enterprise will have functionality to enforce the stages in this pipeline.

This model will not work for a given repo if there are major environmental differences. For example, if the `networking-prod` workspace has 10 more unique resources than the `networking-stage` workspace, they likely cannot share the same Terraform configuration and thus cannot share the same repo. If there are major structural differences between environments, one of the below approaches may be better.

### Branches

For organizations that prefer long-running branches, we recommend creating a branch for each environment. When using this model, one repo, such as `terraform-networking`, would have three long-running, branches — `prod`, `stage`, and `dev`.

Using the branch strategy reduces the number of files needed in the repo. In the example repo structure below, there is only one `main.tf` configuration and one `variables.tf` file. When connecting the repo to a workspace in TFE, you can set different variables for each workspace — one set of variables for `prod`, one set for `stage`, and one set for `dev`.

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

Each workspace listens to a specific branch for changes, as configured by the [VCS branch setting](./settings.html#vcs-branch). This means that plans will not occur in a given workspace until a PR is opened or a push event occurs on the designated branch. The `networking-prod` workspace would be configured to listen to the `prod` branch, `networking-stage` to `stage`, and `networking-dev` to `dev`. To promote a change to `stage`, open a PR against the `stage` branch. To promote to prod, open a PR from `stage` against `prod`.

The upside of this approach is that it requires fewer files and runs fewer plans, but the potential downside is that the branches can drift out of sync. Thus, in this model, it's very important to enforce consistent branch merges for promoting changes.

### Directories

For organizations that have significant differences between environments, or prefer short-lived branches that are frequently merged into the master branch, we recommend creating a separate directory for each environment.

~> **Important:** Since workspaces will queue a plan whenever their VCS branch changes or receives a pull request, you should avoid connecting too many workspaces to the same repository. Connecting more than about ten workspaces to one branch of a repo can cause slow performance and unnecessary noise; if you need to support more workspaces than that, we recommend splitting components into multiple repos.

In the example repo structure below, the prod, stage, and dev environments have separate `main.tf` configurations and `variables.tf` files. These environments can still refer to the same modules (like `compute` and `networking`).

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
│   ├── dev
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

When using this model, each workspace is configured with a different [Terraform Working Directory](./settings.html#terraform-working-directory). This setting tells TFE which directory to execute Terraform in. The `networking-prod` workspace is configured with `prod` as its working directory, the `networking-stage` workspace is configured with `stage` as its working directory, and likewise for `networking-dev`. Unlike in the previous example, every workspace listens for changes to the master branch. Thus, every workspace will run a plan when a change is made to master, because (for example) changes to the modules could affect any environment's behavior.

The potential downside to this approach is that changes have to be manually promoted between stages, and the directory contents can drift out of sync. This model also results in more plans than the long-lived branch model, since every workspace plans on each PR or change to master.
