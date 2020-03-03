---
layout: "cloud"
page_title: "VCS Repository Structure - Workspaces - Terraform Cloud"
---

# Repository Structure

Terraform Cloud integrates with version control repositories to obtain
configurations and trigger Terraform runs. Structuring these repos properly is
important because it determines which files Terraform has access to when
Terraform is executed within Terraform Cloud, and when Terraform plans will run.

## Manageable Repos

As a best practice for repository structure, each repository containing Terraform code should be a [manageable chunk of infrastructure](/docs/cloud/guides/recommended-practices/part1.html#the-recommended-terraform-workspace-structure), such as an application, service, or specific type of infrastructure (like common networking infrastructure).

When repositories are interrelated, we recommend using [remote state](/docs/cloud/guides/recommended-practices/part3.3.html#3-design-your-organization-s-workspace-structure) to transfer information between workspaces. Small configurations connected by remote state are more efficient for collaboration than monolithic repos, because they let you update infrastructure without running unnecessary plans in unrelated workspaces.

## Structuring Repos for Multiple Environments

When each repository represents a manageable chunk of Terraform code, it's often still useful to attach a single repository to multiple workspaces in order to handle multiple environments or other cases where similar infrastructure is used in a different context. There are three primary ways to structure the Terraform code in your repository to manage multiple environments (such as dev, stage, prod).

Depending on your organization's use of version control, one method for multi-environment management may be better than another.

### Multiple Workspaces per Repo (Recommended)

Using a single repo attached to multiple workspaces is the simplest best-practice approach, as it enables the creation of a pipeline to promote changes through environments, without additional overhead in version control. When using this model, one repo, such as `terraform-networking`, is connected to multiple workspaces — `networking-prod`, `networking-stage`, `networking-dev`. While the repo connection is the same in each case, each workspace can have a unique set of variables to configure the differences per environment.

To make an infrastructure change, a user opens a pull request on the `terraform-networking` repo, which will trigger a [speculative plan](../run/index.html#speculative-plans) in all three connected workspaces. The user can then merge the PR and apply it in one workspace at a time, first with `networking-dev`, then `networking-stage`, and finally `networking-prod`. Eventually, Terraform Cloud will have functionality to enforce the stages in this pipeline.

This model will not work for a given repo if there are major environmental differences. For example, if the `networking-prod` workspace has 10 more unique resources than the `networking-stage` workspace, they likely cannot share the same Terraform configuration and thus cannot share the same repo. If there are major structural differences between environments, one of the below approaches may be better.

### Branches

For organizations that prefer long-running branches, we recommend creating a branch for each environment. When using this model, one repo, such as `terraform-networking`, would have three long-running, branches — `prod`, `stage`, and `dev`.

Using the branch strategy reduces the number of files needed in the repo. In the example repo structure below, there is only one `main.tf` configuration and one `variables.tf` file. When connecting the repo to a workspace in Terraform Cloud, you can set different variables for each workspace — one set of variables for `prod`, one set for `stage`, and one set for `dev`.

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

Each workspace listens to a specific branch for changes, as configured by the [VCS branch setting](./vcs.html#vcs-branch). This means that plans will not occur in a given workspace until a PR is opened or a push event occurs on the designated branch. The `networking-prod` workspace would be configured to listen to the `prod` branch, `networking-stage` to `stage`, and `networking-dev` to `dev`. To promote a change to `stage`, open a PR against the `stage` branch. To promote to prod, open a PR from `stage` against `prod`.

The upside of this approach is that it requires fewer files and runs fewer plans, but the potential downside is that the branches can drift out of sync. Thus, in this model, it's very important to enforce consistent branch merges for promoting changes.

### Directories

For organizations that have significant differences between environments, or prefer short-lived branches that are frequently merged into the master branch, we recommend creating a separate directory for each environment.

-> **Note:** By default, Terraform Cloud will only trigger runs when the contents of the workspace's working directory changes. You can configure your workspace to also trigger runs when modules or other dependencies change. See [Automatic Run Triggering](./vcs.html#automatic-run-triggering) settings for more details.

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

When using this model, each workspace is configured with a different [Terraform Working Directory](./settings.html#terraform-working-directory). This setting tells Terraform Cloud which directory to execute Terraform in. The `networking-prod` workspace is configured with `prod` as its working directory, the `networking-stage` workspace is configured with `stage` as its working directory, and likewise for `networking-dev`. Unlike in the previous example, every workspace listens for changes to the master branch. Thus, every workspace will run a plan when a change is made to master, because (for example) changes to the modules could affect any environment's behavior.

The potential downside to this approach is that changes have to be manually promoted between stages, and the directory contents can drift out of sync. This model also results in more plans than the long-lived branch model, since every workspace plans on each PR or change to master.
