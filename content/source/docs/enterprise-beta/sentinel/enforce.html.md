---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-sentinel-enforce"
---

# Enforce and Override Policies

Once a policy is added to an organization it is enforced on all Workspace Runs.

The policy check will occur immediately after a plan is successfully executed in the run. If the plan fails, the policy check will not be performed. The policy check uses the generated tfplan file along with the state and configuration to verify the rules in each of the policies.

Enforcement level details can be found in the [Managing Policies](/docs/enterprise-beta/sentinel/manage-policies.html) documentation.

All `hard mandatory` and `soft mandatory` policies must pass in order for the run to continue to the the "Confirm & Apply" state. A failed advisory policy will allow the run to continue.

If a `soft mandatory` policy fails a member of the organization owners team will be presented with an "Override & Continue" button in the run. They have the ability to override the failed check and continue the execution of the run.
