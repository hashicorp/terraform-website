---
layout: "cloud"
page_title: "Enforce and Override Policies - Sentinel - Terraform Cloud and Terraform Enterprise"
---

# Enforce and Override Policies

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

> For a hands-on tutorial, try the [Enforce Policy with Sentinel](https://learn.hashicorp.com/terraform/sentinel/sentinel-intro?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) track on HashiCorp Learn.

Once a policy is added to an organization it is enforced on all runs.

The policy check will occur immediately after a plan is successfully executed in the run. If the plan fails, the policy check will not be performed. The policy check uses the generated tfplan file, [simulated apply object](./import/tfplan.html#resource-applied-field), state and configuration to verify the rules in each of the policies.

Enforcement level details can be found in the [Managing Policies](./manage-policies.html) documentation.

All `hard mandatory` and `soft mandatory` policies must pass in order for the run to continue to the the "Confirm & Apply" state.

If a `soft mandatory` policy fails, users with permission to manage policies will be presented with an "Override & Continue" button in the run. They have the ability to override the failed check and continue the execution of the run. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

If an `advisory` fails, it will show the warning state in the run; however, the execution of the run will continue to the "Confirm & Apply" state. No user action is required to override or continue the run execution.
