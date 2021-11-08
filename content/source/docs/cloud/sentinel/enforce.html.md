---
layout: "cloud"
page_title: "Enforce and Override Policies - Sentinel - Terraform Cloud and Terraform Enterprise"
description: |-
  Learn when Terraform Cloud performs policy checks and what happens when different types of policy checks fail.
---

# Enforce and Override Policies

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

> **Hands-on:** Try the [Enforce Policy with Sentinel](https://learn.hashicorp.com/collections/terraform/policy?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) collection on HashiCorp Learn.

Policies are defined within policy sets which can be applied to selected or to all workspaces in an organization. Once a policy set is added to an organization, all of its policies are enforced on all runs in those workspaces to which the policy set is applied.

The policy checks will occur after a plan is successfully executed in the run. However, if cost estimates are enabled on the workspace, then the policy checks occur after the cost estimates are executed. This allows the policies to restrict costs based on the data in the cost estimates. If the plan fails, the policy checks will not be performed. The policy checks use data provided to Sentinel from the plan, state, configuration, workspace, and run to verify the rules in each of the policies.

Enforcement level details can be found in the [Managing Policies](./manage-policies.html) documentation.

All `hard-mandatory` must pass in order for the run to continue to the "Confirm & Apply" state. All `soft-mandatory` policies must pass or be overridden for the run to continue to the "Confirm & Apply" state.

If any `soft-mandatory` policies fail and no `hard-mandatory` policies fail, users with permission to override policies will be presented with an "Override & Continue" button in the run in the Terraform Cloud workspace. They have the ability to override the failed `soft-mandatory` policy checks and continue the execution of the run. This will not have any impact on future runs. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html)) Those same users can also override `soft-mandatory` policies when running the `terrform apply` command with the Terraform CLI by typing "override" when promoted to override failed `soft-mandatory` policies for the run.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

If an `advisory` policy check fails, it will show the warning state in the run; however, the execution of the run will continue to the "Confirm & Apply" state. No user action is required to override or continue the run execution.
