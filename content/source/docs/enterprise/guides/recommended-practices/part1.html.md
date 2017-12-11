---
page_title: "Part 1: Overview of Our Recommended Workflow - Terraform Recommended Practices"
layout: "guides"
sidebar_current: "recommended-practices-1"
---


# Part 1: An Overview of Our Recommended Workflow

Terraform's purpose is to provide one workflow to provision any infrastructure. In this section, we'll show you our recommended practices for organizing Terraform usage across a large organization. This is the set of practices that we call "collaborative infrastructure as code."

## Fundamental Challenges in Provisioning

There are two major challenges everyone faces when trying to improve their provisioning practices: technical complexity and organizational complexity.

1. Technical complexity — Different infrastructure providers use different interfaces to provision new resources, and the inconsistency between these interfaces imposes extra costs on daily operations. These costs get worse as you add more infrastructure providers and more collaborators.

    Terraform addresses this complexity by separating the provisioning workload. It uses a single core engine to read infrastructure as code configurations and determine the relationships between resources, then uses many [provider plugins](https://www.terraform.io/docs/providers/index.html) to create, modify, and destroy resources on the infrastructure providers. These provider plugins can talk to IaaS (e.g. AWS, GCP, Microsoft Azure, OpenStack), PaaS (e.g. Heroku), or SaaS services (e.g. GitHub, DNSimple, Cloudflare).

    In other words, Terraform uses a model of workflow-level abstraction, rather than resource-level abstraction. It lets you use a single workflow for managing  infrastructure, but acknowledges the uniqueness of each provider instead of imposing generic concepts on non-equivalent resources.

2. Organizational complexity — As infrastructure scales, it requires more teams to maintain it. For effective collaboration, it's important to delegate ownership of infrastructure across these teams and empower them to work in parallel without conflict. Terraform and Terraform Enterprise can help delegate infrastructure in the same way components of a large application are delegated.

    To delegate a large application, companies often split it into small, focused microservice components that are owned by specific teams. Each microservice provides an API, and as long as those APIs don't change, microservice teams can make changes in parallel despite relying on each others' functionality.

    Similarly, infrastructure code can be split into smaller Terraform configurations, which have limited scope and are owned by specific teams. These independent configurations use [output variables](https://www.terraform.io/docs/configuration/outputs.html) to publish information and [remote state resources](https://www.terraform.io/docs/providers/terraform/d/remote_state.html) to access output data from other workspaces. Just like microservices communicate and connect via APIs, Terraform workspaces connect via remote state.

    Once you have loosely-coupled Terraform configurations, you can delegate their development and maintenance to different teams. To do this effectively, you need to control access to that code. Version control systems can regulate who can commit code, but since Terraform affects real infrastructure, you also need to regulate who can run the code.

    This is how Terraform Enterprise (TFE) solves the organizational complexity of provisioning: by providing a centralized run environment for Terraform that supports and enforces your organization's access control decisions across all workspaces. This helps you delegate infrastructure ownership to enable parallel development.

## Personas, Responsibilities, and Desired User Experiences

There are four main personas for managing infrastructure at scale. These roles have different responsibilities and needs, and Terraform Enterprise supports them with different tools and permissions.

### Central IT

This team is responsible for defining common infrastructure practices, enforcing policy across teams, and maintaining shared services.

Central IT users want a single dashboard to view the status and compliance of all infrastructure, so they can quickly fix misconfigurations or malfunctions. Since Terraform Enterprise is tightly integrated with Terraform's run data and is designed around Terraform's concepts of workspaces and runs, it offers a more integrated workflow experience than a general-purpose CI system.

### Organization Architect

This team defines how global infrastructure is divided and delegated to the teams within the business unit. This team also enables connectivity between workspaces by defining the APIs each workspace must expose, and sets organization-wide variables and policies.

Organization Architects want a single dashboard to view the status of all workspaces and the graph of connectivity between them.

### Workspace Owner

This individual owns a specific set of workspaces, which build a given Terraform configuration across several environments. They are responsible for the health of those workspaces, managing the full change lifecycle through dev, UAT, staging, and production. They are the main approver of changes to production within their domain.

Workspace Owners want:

* A single dashboard to view the status of all workspaces that use their infrastructure code.
* A streamlined way to promote changes between environments.
* An interface to set variables used by a Terraform configuration across environments.

### Workspace Contributor

Contributors submit changes to workspaces by making updates to the infrastructure as code configuration. They usually do not have approval to make changes to production, but can make changes in dev, UAT, and staging.

Workspace Contributors want a simple workflow to submit changes to a workspace and promote changes between workspaces. They can edit a subset of workspace variables and their own personal variables.

Workspace contributors are often already familiar with Terraform's operating model and command line interface, and can usually adapt quickly to TFE's web interface.

## The Recommended Terraform Workspace Structure

### About Workspaces

Terraform Enterprise's main unit of organization is a workspace. A workspace is a collection of everything Terraform needs to run: a Terraform configuration (usually from a VCS repo), values for that configuration's variables, and state data to keep track of operations between runs.

In Terraform open source, a workspace is just an independent state file on the local disk. In TFE, they're persistent shared resources; you can assign them their own access controls, monitor their run states, and more.

### One Workspace Per Environment Per Terraform Configuration

Workspaces are TFE's primary tool for delegating control, which means their structure should match your organizational permissions structure. The best approach is to use one workspace for each environment of a given infrastructure component. Or in other words, Terraform configurations * environments = workspaces.

This is different from how some other tools view environments; notably, you shouldn't use a single Terraform workspace to manage everything that makes up your production or staging environment. Instead, make smaller workspaces that are easy to delegate. This also means not every configuration has to use the exact same environments; if a UAT environment doesn't make sense for your security infrastructure, you aren't forced to use one.

Name your workspaces with both their component and their environment. For example, if you have a Terraform configuration for managing an internal billing app and another for your networking infrastructure, you could name the workspaces as follows:

* billing-app-dev
* billing-app-stage
* billing-app-prod
* networking-dev
* networking-stage
* networking-prod

### Delegating Workspaces

Since each workspace is one environment of one infrastructure component, you can use per-workspace access controls to delegate ownership of components and regulate code promotion across environments. For example:

* Teams that help manage a component can start Terraform runs and edit variables in dev or staging.
* The owners or senior contributors of a component can start Terraform runs in production, after reviewing other contributors' work.
* Central IT and organization architects can administer permissions on all workspaces, to ensure everyone has what they need to work.
* Teams that have no role managing a given component don't have access to its workspaces.

To use TFE effectively, you must make sure the division of workspaces and permissions matches your organization's division of responsibilities. If it's difficult to separate your workspaces effectively, it might reveal an area of your infrastructure where responsibility is muddled and unclear. If so, this is a chance to disentangle the code and enforce better boundaries of ownership.

## Promoting Changes Between Related Workspaces (Coming Soon)

In a future version, TFE will let you create promotion pipelines across workspaces.

As we described above, each workspace is a specific environment of a given Terraform configuration. Today, you must handle code promotion manually, by switching the code used in a higher environment to match the code that successfully passed the prior environment.

Later, you'll be able to set up promotion relationships, so instead of checking out code directly from version control, a higher environment can accept code directly from a prior environment. This can help provide a guarantee that high environments only run known good code.

## Variable and Policy Management

Terraform Enterprise has multiple places to set variables, which override each other in hierarchical order. For all of these levels, TFE securely stores variables in Vault.

### Organization

Any workspace can use default variables from the organization level. For example, the organization might specify a default billing tag to use on all resources.

This is the lowest level of the hierarchy; all subsequent levels can override it.

### Workspace

Per-workspace variables. Most variables are stored at the workspace level; this is the best place for things like AMI IDs, machine counts, SSL certificates, and more.

### User

Variables attached to a specific user, which are used in all workspaces and which override workspace variables. For example, each user can be associated with their ARN.

## Next

Now that you're familiar with the outlines of the Terraform Enterprise workflow, it's time to assess your organization's provisioning practices. Continue on to [Part 2: Evaluating Your Current Provisioning Practices](./part2.html).
