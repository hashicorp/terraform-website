---
layout: "cloud"
page_title: "Workspaces - Terraform Cloud and Terraform Enterprise"
description: |-
  Workspaces enable Terraform Cloud to manage collections of infrastructure resources. Learn basics and recommended organization.
---

# Workspaces

Working with Terraform involves managing collections of infrastructure resources, and most organizations manage many different collections.

When run locally, Terraform manages each collection of infrastructure with a persistent working directory, which contains a configuration, state data, and variables. Since Terraform CLI uses content from the directory it runs in, you can organize infrastructure resources into meaningful groups by keeping their configurations in separate directories.

Terraform Cloud manages infrastructure collections with _workspaces_ instead of directories. A workspace contains everything Terraform needs to manage a given collection of infrastructure, and separate workspaces function like completely separate working directories.

> **Hands-on:** Try the [Create a Workspace](https://learn.hashicorp.com/tutorials/terraform/cloud-workspace-create?in=terraform/cloud-get-started) tutorial on HashiCorp Learn.


## Workspace Contents

Terraform Cloud workspaces and local working directories serve the same purpose, but they store their data differently:

Component | Local Terraform | Terraform Cloud
--|--|--
Terraform configuration | On disk | In linked version control repository, or periodically uploaded via API/CLI
Variable values | As `.tfvars` files, as CLI arguments, or in shell environment | In workspace
State | On disk or in remote backend | In workspace
Credentials and secrets | In shell environment or entered at prompts | In workspace, stored as sensitive variables

In addition to the basic Terraform content, Terraform Cloud keeps some additional data for each workspace:

- **State versions:** Each workspace retains backups of its previous state files. Although only the current state is necessary for managing resources, the state history can be useful for tracking changes over time or recovering from problems. Refer to [Terraform State in Terraform Cloud](./state.html) for more details.

- **Run history:** When Terraform Cloud manages a workspace's Terraform runs, it retains a record of all run activity, including summaries, logs, a reference to the changes that caused the run, and user comments. Refer to [Viewing and Managing Runs](../run/manage.html) for more details.

## Terraform Runs

For workspaces with remote operations enabled (the default), Terraform Cloud performs Terraform runs on its own disposable virtual machines, using that workspace's configuration, variables, and state.

Refer to [Terraform Runs and Remote Operations](../run/index.html) for more details.

## Terraform Cloud vs. Terraform CLI Workspaces

Both Terraform Cloud and Terraform CLI have features called workspaces, but they function differently.

- Terraform Cloud workspaces are required. They manage collections of infrastructure and are a major component of role-based access in Terraform Cloud. You can grant individual users and user groups permissions for one or more workspaces that dictate whether they can manage variables, perform runs, etc. You cannot manage resources in Terraform Cloud without creating at least one workspace.

- Terraform CLI workspaces isolate multiple state files in the same working directory, letting you manage multiple groups of resources with a single configuration. The Terraform CLI does not require you to create CLI workspaces. Refer to [Workspaces](/docs/language/state/workspaces.html) in the Terraform Language documentation for more details.

## Listing and Filtering Workspaces

Click **Workspaces** in the top navigation bar. Terraform Cloud shows a list of all workspaces in the current organization.

![Screenshot: the list of workspaces](./images/index-list.png)

This list only includes workspaces where the current user account has permission to read runs. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

If the list is large, you can use the filter tools at the top of the list to find the workspaces you're interested in.

The following filters are available:

- **Status filters:** These filters show workspaces by the status of their current run. There are five quick filter buttons that collect the most commonly used groups of statuses (needs attention, errored, running, on hold and success), and a custom filter button (with a funnel icon) where you can select any number of statuses from a menu.

    When you choose a status filter, the list will only include workspaces whose current runs match the selected statuses. You can remove the status filter by clicking the "All" button, or by unchecking everything in the custom filter menu.
- **Tag filter:** The tag filter shows a list of tags added to all workspaces. Choosing one or more will show only workspaces tagged with all of the chosen tags.
- **List order:** The list order button is marked with two arrows, pointing up and down. You can choose to order the list by time or by name, in forward or reverse order.
- **Name filter:** The search field at the far right of the filter bar lets you filter workspaces by name. If you enter a string in this field and press enter, only workspaces whose names contain that string will be shown.

    The name filter can combine with a status and/or tag filter, to narrow the list down further.

## Planning and Organizing Workspaces

We recommend that organizations break down large monolithic Terraform configurations into smaller ones, then assign each one to its own workspace and delegate permissions and responsibilities for them. Terraform Cloud can manage monolithic configurations just fine, but managing infrastructure as smaller components is the best way to take full advantage of Terraform Cloud's governance and delegation features.

For example, the code that manages your production environment's infrastructure could be split into a networking configuration, the main application's configuration, and a monitoring configuration. After splitting the code, you would create "networking-prod", "app1-prod", "monitoring-prod" workspaces, and assign separate teams to manage them.

Much like splitting monolithic applications into smaller microservices, this enables teams to make changes in parallel. In addition, it makes it easier to re-use configurations to manage other environments of infrastructure ("app1-dev," etc.).

## Creating Workspaces

You can create workspaces through the [Terraform Cloud UI](/docs/cloud/workspaces/creating.html) or the [Workspaces API](../api/workspaces.html).

