---
layout: "cloud"
page_title: "Workspaces - Terraform Cloud"
---

# Workspaces

Workspaces are how Terraform Enterprise (TFE) organizes infrastructure.

A workspace consists of:

- A Terraform configuration (usually retrieved from a VCS repo, but sometimes uploaded directly).
- Values for variables used by the configuration.
- Persistent stored state for the resources the configuration manages.
- Historical state and run logs.

## Listing and Filtering Workspaces

-> **API:** See the [Workspaces API](../api/workspaces.html).

TFE's top navigation bar includes a "Workspaces" link, which takes you to the list of workspaces in the current  organization.

![Screenshot: the list of workspaces](./images/index-list.png)

This list only includes workspaces where your user account has at least [read permissions](../users-teams-organizations/permissions.html).

If the list is large, you can use the filter tools at the top of the list to find the workspaces you're interested in.

The following filters are available:

- **Status filters:** These filters sort workspaces by the status of their current run. There are four quick filter buttons that collect the most commonly used groups of statuses (success, error, needs attention, and running), and a custom filter button (with a funnel icon) where you can select any number of statuses from a menu.

    When you choose a status filter, the list will only include workspaces whose current runs match the selected statuses. You can remove the status filter by clicking the "All" button, or by unchecking everything in the custom filter menu.
- **List order:** The list order button is marked with two arrows, pointing up and down. You can choose to order the list by time or by name, in forward or reverse order.
- **Name filter:** The search field at the far right of the filter bar lets you filter workspaces by name. If you enter a string in this field and press enter, only workspaces whose names contain that string will be shown.

    The name filter can combine with a status filter, to narrow the list down further.


## Planning and Organizing Workspaces

We recommend that organizations break down large monolithic Terraform configurations into smaller ones, then assign each one to its own workspace and delegate permissions and responsibilities for them. TFE can manage monolithic configurations just fine, but managing smaller infrastructure components like this is the best way to take full advantage of TFE's governance and delegation features.

For example, the code that manages your production environment's infrastructure could be split into a networking configuration, the main application's configuration, and a monitoring configuration. After splitting the code, you would create "networking-prod", "app1-prod", "monitoring-prod" workspaces, and assign separate teams to manage them.

Much like splitting monolithic applications into smaller microservices, this enables teams to make changes in parallel. In addition, it makes it easier to re-use configurations to manage other environments of infrastructure ("app1-dev," etc.).

