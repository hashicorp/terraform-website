---
layout: "cloud"
page_title: "Overview of Features - Terraform Cloud and Terraform Enterprise"
---

# Overview of Terraform Cloud Features

[cli]: /docs/cli-index.html
[remote backend]: /docs/backends/types/remote.html
[speculative plans]: ./run/index.html#speculative-plans
[remote_state]: /docs/providers/terraform/d/remote_state.html
[outputs]: /docs/configuration/outputs.html
[modules]: /docs/modules/index.html
[terraform enterprise]: /docs/enterprise/index.html


> For a hands-on tutorial, try the [Get Started — Terraform Cloud](https://learn.hashicorp.com/terraform/cloud-getting-started/signup?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) guide on HashiCorp Learn.

Terraform Cloud is a platform that performs Terraform runs to provision infrastructure, either on demand or in response to various events. Unlike a general-purpose continuous integration (CI) system, it is deeply integrated with Terraform's workflows and data, which allows it to make Terraform significantly more convenient and powerful.

This page is a brief overview of Terraform Cloud's features and how they fit together.

## Terraform Workflow

Terraform Cloud runs [Terraform CLI][cli] to provision infrastructure.

In its default state, Terraform CLI uses a local workflow, performing operations on the workstation where it is invoked and storing state in a local directory.

Since teams must share responsibilities and awareness to avoid single points of failure, working with Terraform in a team requires a remote workflow. At minimum, state must be shared; ideally, Terraform should execute in a consistent remote environment.

Terraform Cloud offers a team-oriented remote Terraform workflow, designed to be comfortable for existing Terraform users and easily learned by new users. The foundations of this workflow are remote Terraform execution, a workspace-based organizational model, version control integration, command-line integration, remote state management with cross-workspace data sharing, and a private Terraform module registry.

### Remote Terraform Execution

Terraform Cloud runs Terraform on disposable virtual machines in its own cloud infrastructure. Remote Terraform execution is sometimes referred to as "remote operations."

Remote execution helps provide consistency and visibility for critical provisioning operations. It also enables powerful features like Sentinel policy enforcement, cost estimation, notifications, version control integration, and more.

- More info: [Terraform Runs and Remote Operations](./run/index.html)

#### Support for Local Execution

[execution_mode]: ./workspaces/settings.html#execution-mode

Remote execution can be disabled on specific workspaces with the ["Execution Mode" setting][execution_mode]. The workspace will still host remote state, and Terraform CLI can use that state for local runs via the [remote backend][].

### Workspaces for Organizing Infrastructure

Terraform's local workflow manages a collection of infrastructure with a _persistent working directory,_ which contains configuration, state data, and variables. Practitioners can use separate directories to organize infrastructure resources into meaningful groups, and Terraform will use content from whichever directory it is invoked from.

Terraform Cloud organizes infrastructure with _workspaces_ instead of directories. Each workspace contains everything necessary to manage a given collection of infrastructure, and Terraform uses that content whenever it executes in the context of that workspace.

- More info: [Workspaces](./workspaces/index.html)

### Remote State Management, Data Sharing, and Run Triggers

Terraform Cloud acts as a remote backend for your Terraform state. State storage is tied to workspaces, which helps keep state associated with the configuration that created it.

Terraform Cloud also enables you to share information between workspaces with root-level [outputs][]. Separate groups of infrastructure resources often need to share a small amount of information, and workspace outputs are an ideal interface for these dependencies.

Any workspace that uses remote operations can use [`terraform_remote_state` data sources][remote_state] to access other workspaces' outputs, without any additional configuration or authentication. And since new information from one workspace might change the desired infrastructure state in another, you can create workspace-to-workspace run triggers to ensure downstream workspaces react when their dependencies change.

- More info: [Terraform State in Terraform Cloud](./workspaces/state.html), [Run Triggers](./workspaces/run-triggers.html)

### Version Control Integration

Like other kinds of code, infrastructure-as-code belongs in version control, so Terraform Cloud is designed to work directly with your version control system (VCS) provider.

Each workspace can be linked to a VCS repository that contains its Terraform configuration, optionally specifying a branch and subdirectory. Terraform Cloud automatically retrieves configuration content from the repository, and will also watch the repository for changes:

- When new commits are merged, linked workspaces automatically run Terraform plans with the new code.
- When pull requests are opened, linked workspaces run speculative plans with the proposed code changes and post the results as a pull request check; reviewers can see at a glance whether the plan was successful, and can click through to view the proposed changes in detail.

VCS integration is powerful, but optional; if you use an unsupported VCS or want to preserve an existing validation and deployment pipeline, you can use the API or Terraform CLI to upload new configuration versions. You'll still get the benefits of remote execution and Terraform Cloud's other features.

- More info: [VCS-driven Runs](./run/ui.html)
- More info: [Supported VCS Providers](./vcs/index.html#supported-vcs-providers)

### Command Line Integration

Remote execution offers major benefits to a team, but local execution offers major benefits to individual developers; for example, most Terraform users run `terraform plan` to interactively check their work while editing configurations.

Terraform Cloud offers the best of both worlds, allowing you to run remote plans from your local command line. Configure the [remote backend][], and the `terraform plan` command will start a remote run in the configured Terraform Cloud workspace. The output of the run streams directly to your terminal, and you can also share a link to the remote run with your teammates.

Remote CLI-driven runs use the current working directory's Terraform configuration and the remote workspace's variables, so you don't need to obtain production cloud credentials just to preview a configuration change.

The remote backend also supports state manipulation commands like `terraform import` or `terraform taint`.

-> **Note:** When used with Terraform Cloud, the `terraform plan` command runs [speculative plans][], which preview changes without modifying real infrastructure. You can also use `terraform apply` to perform full remote runs, but only with workspaces that are _not_ connected to a VCS repository. This helps ensure that your VCS remains the source of record for all real infrastructure changes.

- More info: [CLI-driven Runs](./run/cli.html)

### Private Module Registry

Even small teams can benefit greatly by codifying commonly used infrastructure patterns into reusable [modules][].

Terraform CLI can already fetch modules from arbitrary VCS sources, but Terraform Cloud improves this with a private module registry. Users throughout your organization can browse a directory of internal modules, and can specify flexible version constraints for the modules they use in their configurations. Easy versioning lets downstream teams use modules with confidence, and frees upstream teams to iterate faster.

The private registry uses your VCS as the source of truth, relying on Git tags to manage module versions. Tell Terraform Cloud which repositories contain modules, and the registry handles the rest.

- More info: [Private Module Registry](./registry/index.html)

## Integrations

In addition to providing powerful extensions to the core Terraform workflow, Terraform Cloud makes it simple to integrate infrastructure provisioning with your business's other systems.

### Full API

Nearly all of Terraform Cloud's features are available in [its API](./api/index.html), which means other services can create or configure workspaces, upload configurations, start Terraform runs, and more. There's even [a Terraform provider based on the API](/docs/providers/tfe/index.html), so you can manage your Terraform Cloud teams and workspaces as a Terraform configuration.

- More info: [API](./api/index.html)

### Notifications

Terraform Cloud can send notifications about Terraform runs to other systems, including Slack and any other service that accepts webhooks. Notifications can be configured per-workspace.

- More info: [Notifications](./workspaces/notifications.html)

## Access Control and Governance

Larger organizations are more complex, and tend to use access controls and explicit policies to help manage that complexity. Terraform Cloud's paid upgrade plans provide extra features to help meet the control and governance needs of large organizations.

- More info: [Free and Paid Plans](./paid.html)

### Team-Based Permissions System

With Terraform Cloud's team management, you can define groups of users that match your organization's real-world teams and assign them only the permissions they need. When combined with the access controls your VCS provider already offers for code, workspace permissions are an effective way to follow the principle of least privilege.

- More info: [Users, Teams, and Organizations](./users-teams-organizations/index.html)

### Sentinel Policies

Terraform Cloud embeds the Sentinel policy-as-code framework, which lets you define and enforce granular policies for how your organization provisions infrastructure. You can limit the size of compute VMs, confine major updates to defined maintenance windows, and much more.

Policies can act as firm requirements, advisory warnings, or soft requirements that can be bypassed with explicit approval from your compliance team.

- More info: [Sentinel Policies](./sentinel/index.html)

### Cost Estimation

Before making changes to infrastructure in the major cloud providers, Terraform Cloud can display an estimate of its total cost, as well as any change in cost caused by the proposed updates. Cost estimates can also be used in Sentinel policies to provide warnings for major price shifts.

- More info: [Cost Estimation](./cost-estimation/index.html)
