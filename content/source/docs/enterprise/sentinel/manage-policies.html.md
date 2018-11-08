---
layout: enterprise2
page_title: "Managing Sentinel Policies - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-manage-policies"
---

# Managing Sentinel Policies

-> **API:** See the [Policies API](../api/policies.html) and [Policy Sets API](../api/policy-sets.html).

Sentinel Policies are rules which are enforced on every Terraform run to validate that the plan and corresponding resources are in compliance with company policies.

## Policies and Policy Sets

[teams]: ../users-teams-organizations/teams.html
[users]: ../users-teams-organizations/users.html
[workspaces]: ../workspaces/index.html

**Policies** consist of a Sentinel policy file, a name, and an enforcement level.

**Policy sets** are groups of policies that can be applied to [workspaces][]. A policy set can apply to designated workspaces, or to all workspaces in the organization.

During a Terraform run, Terraform Enterprise (TFE) checks all of the Sentinel policies that apply to the run's workspace. This includes the members of any global policy sets, and of any policy sets that are explicitly applied to that workspace.

~> **Important:** In order for a policy to take effect, it must be in one or more policy sets. Individual policies cannot be assigned to workspaces, and policies that are not in any policy sets will never be checked.

Policies and policy sets are managed at an organization level, and only [organization owners](../users-teams-organizations/teams.html#the-owners-team) can create, edit or delete them.

-> **Note:** The UI controls for managing Sentinel policies are designed for demos and other simple use cases; for complex usage with multiple policies, we recommend [storing Sentinel code in version control](./integrate-vcs.html) and using your CI system to test and upload them via TFE's API. In the future, Terraform Enterprise will integrate directly with VCS providers for the Sentinel workflow.

## Managing Policies

[organization settings]: ../users-teams-organizations/organizations.html#organization-settings

To manage an organization's Sentinel policies, go to the [organization settings][] and navigate to the "Policies" page.

To create a new policy, click the "Create a new policy" button; to edit an existing policy, click its entry in the list. Be sure to click the "Create policy" or "Update policy" button when finished.

When creating or editing a policy, the following fields are available:

- **Policy Name:** The name of your policy, which is used in the UI and Sentinel output. Accepts letters, numbers, `-`, and `_`. (Names cannot be modified after creation, and this field is disabled when editing an existing policy.)
- **Description:** A brief note about the policy's purpose, displayed in the policy list.
- **Enforcement Mode:** The level to which the policy is enforced when performing a run. The following modes are available:
  - **hard-mandatory (cannot override):** This policy is required on all Terraform runs. It cannot be overridden by any users.
  - **soft-mandatory (can override):** This policy is required. If a Terraform plan fails to comply, it can be overridden by a member of the organization owners team.
  - **advisory (logging only):** This policy will allow the run to continue regardless of whether it passes or fails.
- **Policy Code:** The text of the [Terraform-compatible Sentinel](https://docs.hashicorp.com/sentinel/app/terraform/) policy which defines the rules for the Terraform configurations, states and plans. Please note that custom imports are not available for use in Terraform Enterprise at this time.
- **Policy Sets:** Which policy sets your policy should belong to. Use the drop-down menu and "Add policy set" button to add the policy to a set, and the trash can (🗑) button to remove the policy from a set.

You can delete an existing policy by navigating to its edit page and using the "Delete policy" button at the bottom of the page.

## Managing Policy Sets

To manage policy sets, go to the [organization settings][] and navigate to the "Policy Sets" page. Policy sets that apply to all workspaces are marked with a "GLOBAL" tag in this list; other policy sets show how many workspaces they apply to.

To create a new policy set, click the "Create a new policy set" button; to edit an existing set, click its entry in the list. Be sure to click the "Create policy set" or "Update policy set" button when finished.

When creating or editing a policy set, the following fields are available:

- **Name**: The name of your policy set, which is used in the UI. Must be unique to your organization. Accepts letters, numbers, `-`, and `_`.
- **Description**: A description of the policy set's purpose. The description can be any length and supports Markdown rendering.
- **Applicability:** Whether the set should apply to all workspaces, or only to a chosen list of workspaces.
- **Policies:** Which policies to include in the set. Any policy can be in multiple policy sets. Use the drop-down menu and "Add policy" button to add policies to the set, and the trash can (🗑) button to remove policies.
- **Workspaces:** Which workspaces the policy set should apply to. This is only shown when the applicability is set to "Only apply to the attached workspaces." Use the drop-down menu and "Add workspace" button to add workspaces, and the trash can (🗑) button to remove them.
