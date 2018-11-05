---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-manage-policies"
---

# Managing Policies

-> **API:** See the [Policies API](../api/policies.html).

Sentinel Policies are rules which are enforced on every workspace run to validate the terraform plan and corresponding resources are in compliance with company policies. Policies are made up of a sentinel policy file, a name, and an enforcement level. They are managed at an organization level and a user must be in the organization's owners team to create, edit or delete policies.

To view the policies navigate to the organization's settings page under "Sentinel Policy". From the "Sentinel Policy" section you can view, list, edit, create and delete the policies.

To create a new policy, navigate to "Create Policy". Sentinel is designed to enable policy as code. As such, it is recommended to use the Terraform Enterprise UI to manage policy only for demos and simple integrations. For complex integrations, it is [recommended to store Sentinel policies in version control](./integrate-vcs.html).

- **Policy Name**: The name of your policy is used in the UI and Sentinel output. Accepts alphanumeric characters, as well as `-` and `_`. Cannot be modified after creation.
- **Enforcement Mode**: This sets the level to which the policy is enforced when performing a run.
  - **hard-mandatory (cannot override)**: This policy is required on all terraform runs. It cannot be overridden by any users.
  - **soft-mandatory (can override)**: This policy is required. If a terraform plan fails to comply, it can be overridden by a member of the organization owners team.
  - **advisory (logging only)**: This policy will allow the run to continue to an apply in both pass and failures of the policy check.
- **Policy Code**: The [Terraform compatible sentinel](https://docs.hashicorp.com/sentinel/app/terraform/) policy which defines the rules for the terraform configurations, states and plans. Please note that custom imports are not available for use in Terraform Enterprise at this time.

Consider integrating with the Terraform Enterprise API in CI to test and upload policy files. In the future, Terraform Enterprise will integrate directly with VCS providers for the Sentinel workflow.

### Organizing Policies With Policy Sets

~> **Important:** In order for Sentinel policies to be checked during runs, they must be added to at least one policy set that has been attached to a workspace. Policies that are not a member of a policy set, or are a member of a policy set that has not been attached to any workspaces, will not be checked during any runs in any workspace.

To manage your organization's policy sets, navigate to the organization's settings page under "Policy Sets". From the "Policy Sets" section you can view, list, create, edit, and delete policy sets. Editing a policy set allows you to add or remove policies from the set, or attach or detach the policy set from workspaces.

To create a new policy set, navigate to "Create Policy Set".

- **Policy Set Name**: The name of your policy set is used in the UI and must be unique to your organization. Accepts alphanumeric characters, as well as `-` and `_`.
- **Description**: A description of the policy set's purpose. The description can be any length and supports Markdown rendering.
- **Global**: Global policy sets are automatically attached to all of your organization's workspaces. Policies that are members of a global policy set will be checked during all runs in the organization. To apply policies only to specific workspaces, add them to a policy set that is _not_ global, and make sure that policy set has been directly attached to those workspaces.
