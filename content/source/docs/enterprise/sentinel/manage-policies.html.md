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

**Policy sets** are groups of policies that can be enforced on [workspaces][]. A policy set can be enforced on designated workspaces, or to all workspaces in the organization.

After the plan stage of a Terraform run, Terraform Enterprise (TFE) checks every Sentinel policy that should be enforced on the run's workspace. This includes policies from global policy sets, and from any policy sets that are explicitly assigned to the workspace.

~> **Important:** In order for a policy to take effect, it must be in one or more policy sets. Individual policies cannot be assigned to workspaces, and policies that are not in any policy sets will never be checked.

Policies and policy sets are managed at an organization level, and only [organization owners](../users-teams-organizations/teams.html#the-owners-team) can create, edit or delete them.

-> **Note:** The UI controls for managing Sentinel policies are designed for demos and other simple use cases; for complex usage with multiple policies, we recommend [storing Sentinel code in version control](./integrate-vcs.html) and using your CI system to test and upload policies via TFE's API. In the future, Terraform Enterprise will integrate directly with VCS providers for the Sentinel workflow.

## Managing Policies

[organization settings]: ../users-teams-organizations/organizations.html#organization-settings

To manage an organization's Sentinel policies, go to the [organization settings][] and navigate to the "Policies" page.

To create a new policy, click the "Create a new policy" button; to edit an existing policy, click its entry in the list. Click the "Create policy" or "Update policy" button when finished.

When creating or editing a policy, the following fields are available:

- **Policy Name:** The name of the policy, which is used in the UI and Sentinel output. Accepts letters, numbers, `-`, and `_`. (Names cannot be modified after creation, and this field is disabled when editing an existing policy.)
- **Description:** A brief note about the policy's purpose, displayed in the policy list.
- **Enforcement Mode:** How the policy is enforced when performing a run. The following modes are available:
  - **hard-mandatory (cannot override):** This policy is required on all Terraform runs. It cannot be overridden by any users.
  - **soft-mandatory (can override):** This policy is required, but organization owners can override the policy and allow a non-compliant run to continue.
  - **advisory (logging only):** This policy will allow the run to continue regardless of whether it passes or fails.
- **Policy Code:** The text of the [Terraform-compatible Sentinel](https://docs.hashicorp.com/sentinel/app/terraform/) policy which defines the rules for the Terraform configurations, states and plans. Please note that custom imports are not available for use in Terraform Enterprise at this time.
- **Policy Sets:** Which policy sets your policy will belong to. Use the drop-down menu and "Add policy set" button to add the policy to a set, and the trash can (🗑) button to remove the policy from a set.

To delete an existing policy, navigate to its edit page and use the "Delete policy" button at the bottom of the page.

## Managing Policy Sets

To manage policy sets, go to the [organization settings][] and navigate to the "Policy Sets" page. Policy sets enforced on all workspaces are marked with a "GLOBAL" tag in this list; other policy sets show how many workspaces they are enforced on.

To create a new policy set, click the "Create a new policy set" button; to edit an existing set, click its entry in the list. Click the "Create policy set" or "Update policy set" button when finished.

When creating or editing a policy set, the following fields are available:

- **Name**: The name of the policy set, which is used in the UI. Must be unique to your organization. Accepts letters, numbers, `-`, and `_`.
- **Description**: A description of the policy set's purpose. The description can be any length and supports Markdown rendering.
- **Scope of policies:** Whether the set should be enforced on all workspaces, or only on a chosen list of workspaces.
- **Policies:** Which policies to include in the set. Any policy can be in multiple policy sets. Use the drop-down menu and "Add policy" button to add policies to the set, and the trash can (🗑) button to remove policies.
- **Workspaces:** Which workspaces the policy set should be enforced on. This is only shown when the scope of policies is set to "Policies enforced on selected workspaces." Use the drop-down menu and "Add workspace" button to add workspaces, and the trash can (🗑) button to remove them.
