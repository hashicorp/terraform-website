---
layout: "cloud"
page_title: "Managing Policies with VCS - Sentinel - Terraform Enterprise"
---

# Managing Sentinel Policies with Version Control

~> **Note**: This guide uses deprecated features in Terraform Enterprise. It is recommended to use the first-class VCS integration with [policy sets](./manage-policies.html#managing-policy-sets) instead.

[test]: https://docs.hashicorp.com/sentinel/writing/testing
[tfe_sentinel_policy]: /docs/providers/tfe/r/sentinel_policy.html
[tfe_policy_set]: /docs/providers/tfe/r/policy_set.html
[tfe_provider]: /docs/providers/tfe/index.html
[example_repo]: https://github.com/hashicorp/tfe-policies-example/
[defining_policies]: ./import/index.html
[example_policies]: ./examples.html
[import]: /docs/import/index.html
[remote]: /docs/backends/types/remote.html
[organization token]: ../users-teams-organizations/service-accounts.html#organization-service-accounts
[team token]: ../users-teams-organizations/service-accounts.html#team-service-accounts
[user token]: ../users-teams-organizations/users.html#api-tokens
[owners team]: ../users-teams-organizations/teams.html#the-owners-team

Terraform Enterprise (TFE)'s [UI for managing Sentinel policies](./manage-policies.html) is designed primarily for _viewing_ your organization's policies and policy sets. It also works well for demos and other simple use cases.

For complex day-to-day use, we recommend keeping Sentinel code in version control and using Terraform to automatically deploy your policies. This approach is a better fit with Sentinel's policy-as-code design, and scales better for organizations with multiple owners and administrators.

This page describes an end-to-end process for managing TFE's Sentinel policies with version control and Terraform. Use this outline and the [example repository][example_repo] as a starting point for managing your own organization's policies.

## Summary

Managing policies with version control and Terraform requires the following steps:

- Create a VCS repository for policies.
- Write Sentinel policies and add them to the policy repo.
- Write a Terraform configuration for managing policies in TFE, and add it to the policy repo. This configuration must:
    - Configure [the `tfe` provider][tfe_provider].
    - Manage individual policies with `tfe_sentinel_policy` resources.
    - Manage policy sets with `tfe_policy_set` resources.
- Create a TFE workspace linked to the policy repo.
- Write tests for your Sentinel policies.
- Use CI to run Sentinel tests automatically.

## Repository Structure

-> **Example:** We've provided a complete and working [example policy repo][example_repo], which you can use as a template for your own policy repo.

Create a single VCS repository for managing your organization's Sentinel policies. We recommend a short and descriptive name like "tfe-policies". Later, you will create a TFE workspace based on this repo.

Once the policy management process is fully implemented, the repo will contain the following:

- **Sentinel policies** stored as `.sentinel` files in the root of the repo.
- **A Terraform configuration** stored in the root of the repo. This can be a single `main.tf` file, or several smaller configuration files.
- **Sentinel tests** stored in a `test/` directory.
- Optionally: other information or metadata, which might include a README file, editor configurations, and CI configurations.

~> **Important:** When managing policies with Terraform, the security of your policy repo determines the security of your policies. You should strictly control merge access to this repo, prohibit direct pushes to master, and enforce a consistent process for reviewing and merging changes to policy code.

## Sentinel Policies

-> **Example:** See the `.sentinel` files included in the [example policy repo][example_repo], or browse the [list of example policies][example_policies].

Write some [Sentinel policies for TFE][defining_policies], and commit them to your repo as `.sentinel` files. If you're already enforcing Sentinel policies in TFE, copy them into the new repo.

-> **Note:** Since your Terraform configuration for policies will be using [the `tfe` provider][tfe_provider] with very elevated permissions, you might want to use a Sentinel policy to restrict which `tfe` resources the workspace can manage. The example policy repo [includes a policy](https://github.com/hashicorp/tfe-policies-example/blob/master/tfe_policies_only.sentinel) that only allows `tfe_sentinel_policy` and `tfe_policy_set` resources in the policy workspace.

## Terraform Configuration

Next, write a Terraform configuration to manage your policies and policy sets in TFE using [the `tfe` provider][tfe_provider].

-> **Example:** The example policy repo includes a [complete Terraform configuration for policies](https://github.com/hashicorp/tfe-policies-example/blob/master/main.tf), with comments for clarity. If you prefer to read the Terraform code without a guided walkthrough, you can [skip to the next section][inpage_workspace].

### Define Variables for Accessing TFE

The `tfe` provider needs a highly privileged Terraform Enterprise API token in order to manage policies. The best way to handle this type of secret is with a sensitive variable in a TFE workspace. To enable this, define a variable in the configuration.

```hcl
variable "tfe_token" {}
```

If you use a private install of TFE or multiple TFE organizations (or if you might do so in the future), you can set your TFE hostname and TFE organization as variables:

```hcl
variable "tfe_hostname" {
  description = "The domain where your TFE is hosted."
  default     = "app.terraform.io"
}

variable "tfe_organization" {
  description = "The TFE organization to apply your changes to."
  default     = "example_corp"
}
```

### Configure the `tfe` Provider

Configure the `tfe` provider (version 0.3 or higher) with your API token and hostname variables.

```hcl
provider "tfe" {
  hostname = "${var.tfe_hostname}"
  token    = "${var.tfe_token}"
  version  = "~> 0.6"
}
```

### Optional: Use a Data Source to Get Workspace IDs

[inpage_ids]: #optional-use-a-data-source-to-get-workspace-ids

The `tfe_policy_set` resource uses workspace IDs, which can be found on a workspace's [settings page](../workspaces/settings.html#id). There are several ways to work with these IDs in your configuration, all of which have advantages and disadvantages:

Method | Pros | Cons
-------|------|-----
Use literal ID strings. | Highly secure, since workspace IDs never change. | Policy set configs are opaque. Accidental misconfigurations are difficult to spot.
Use a data source to look up IDs by name. | Convenient and easy to read. | Renaming a workspace (requires admin permissions) can remove it from a policy set.
Use a variable to map workspace names to IDs. | Secure and easy to read. | Keeping the variable up-to-date is inconvenient.
Use `external_id` attribute of `tfe_workspace` resources. | Secure, readable, automatically updated. | Only available if you already manage your TFE workspaces with the `tfe` Terraform provider.

In our examples, we want to clearly show what our policy sets are doing, which is much easier if we can refer to workspaces by name. The [`tfe_workspace_ids` data source](/docs/providers/tfe/d/workspace_ids.html) (in `tfe` provider versions ≥ 0.6) makes it easy to use workspace names:

```hcl
data "tfe_workspace_ids" "all" {
  names        = ["*"]
  organization = "${var.tfe_organization}"
}

locals {
  # Use a shorter name for this map in policy set resources:
  workspaces = "${data.tfe_workspace_ids.all.external_ids}"
}
```

~> **Important:** Before using this approach in your organization, make sure you understand the security and usability trade-offs.

### Create Policy Resources

Create a [`tfe_sentinel_policy` resource][tfe_sentinel_policy] for each Sentinel policy in the repo.

- Set the resource name and the `name` attribute to the policy's filename, minus the `.sentinel` extension.
- Use the `file()` function to pull the policy contents into the `policy` attribute.

```hcl
resource "tfe_sentinel_policy" "aws-block-allow-all-cidr" {
  name         = "aws-block-allow-all-cidr"
  description  = "Avoid nasty firewall mistakes (AWS version)"
  organization = "${var.tfe_organization}"
  policy       = "${file("./aws-block-allow-all-cidr.sentinel")}"
  enforce_mode = "hard-mandatory"
}
```

### Create Policy Set Resources

-> **Note:** See [Managing Sentinel Policies](./manage-policies.html) for a complete description of TFE's policy sets.

Create a [`tfe_policy_set` resource][tfe_policy_set] for each policy set you wish to create.

- Use the `policy_ids` list to specify which policies to include. Reference the `id` attributes from your policy resources, like `"${tfe_sentinel_policy.aws-block-allow-all-cidr.id}"`.
- Set a value for either `global` or `workspace_external_ids`, to specify which workspaces these policies should be enforced on.

    -> **Note:** In our examples, we use a data source to reference workspace IDs by name. Your configuration might handle workspace IDs differently; see the [section about workspace IDs][inpage_ids] above for more info.

```hcl
# A global policy set
resource "tfe_policy_set" "global" {
  name         = "global"
  description  = "Policies that should be enforced on ALL infrastructure."
  organization = "${var.tfe_organization}"
  global       = true

  policy_ids = [
    "${tfe_sentinel_policy.aws-restrict-instance-type-default.id}",
  ]
}

# A non-global policy set
resource "tfe_policy_set" "production" {
  name         = "production"
  description  = "Policies that should be enforced on production infrastructure."
  organization = "${var.tfe_organization}"

  policy_ids = [
    "${tfe_sentinel_policy.aws-restrict-instance-type-prod.id}",
  ]

  workspace_external_ids = [
    "${local.workspaces["app-prod"]}",
  ]
}
```

### Importing Resources

If your TFE organization already has some policies or policy sets, make sure to include them when writing your Terraform configuration.

To bring the old resources under management, you can either delete them and let Terraform re-create them, or [import them into the Terraform state][import].

To import existing resources into your TFE workspace, you must configure [the `atlas` backend](/docs/backends/types/terraform-enterprise.html) and run `terraform import` on your local workstation. Be sure to import resources **after** you have created a TFE workspace for managing policies, but **before** you have performed any runs in that workspace.

For the specific import syntax to use, see the documentation for [the `tfe_sentinel_policy` resource][tfe_sentinel_policy] and [the `tfe_policy_set` resource][tfe_policy_set]. You can find policy and policy set IDs in the URL bar when viewing them in TFE.

~> **Important:** [The `remote` backend](/docs/backends/types/remote.html) does not currently support the `terraform import` command. If you plan to import, configure [the `atlas` backend](/docs/backends/types/terraform-enterprise.html) instead.

## TFE Workspace

[inpage_workspace]: #tfe-workspace

Create a [new TFE workspace](../workspaces/creating.html) linked to to your policy management repo.

-> **Note:** This workspace doesn't have to belong to the organization whose policies it manages. If you use multiple TFE organizations, one of them can manage policies for the others.

Before performing any runs, go to the workspace's "Variables" page and set the following Terraform variables (using whichever names you used in the configuration):

- `tfe_token` (mark as "Sensitive") — A TFE API token that can manage your organization's Sentinel policies. This token must be one of the following:
    - The [organization token][] (recommended)
    - The [team token][] for the [owners team][]
    - A [user token][] from a member of the owners team
- `tfe_organization` — The name of the organization you want to manage policies for.
- `tfe_hostname` — The hostname of your TFE instance.

Once the variables are configured, you can queue a Terraform run to begin managing policies.

## Policy Tests

It's easier and safer to collaborate on policy as code when your code is well-tested. Take advantage of Sentinel's built-in testing capabilities by adding tests to your policy repo.

-> **Example:** The example policy repo includes [tests for every policy](https://github.com/hashicorp/tfe-policies-example/tree/master/test/).

See the [Sentinel testing documentation][test] to learn how to write and run tests. In brief, you should:

- Create a `test/<NAME>` directory for each policy file.
- Add JSON files (one per test case) to those directories. The object in each file should include the following keys:
    - `mock` — Mock data that represents the test case. Usually you'll mock data for one or more of the Terraform imports; some policies might also require additional imports. For more details about mocking Terraform imports, see see [Mocking Terraform Sentinel Data](./mock.html).
    - `test` — Expected results for the policy's rules in this test case. (If the only expected result is `"main": true`, you can omit the `test` key.)

    For each policy, make at least two tests: one that obeys the policy, and one that violates the policy (using `"test": {"main": false}` so that the failed policy results in a passing test). Add more test cases for more complex policies.
- Run `sentinel test` (in the root of the policy repo) to see results for all of your tests.

An example Sentinel test:

```json
{
  "test": {
    "main": false,
    "instance_type_allowed": false
  },
  "mock": {
    "tfplan": "../../testdata/mock-tfplan.sentinel"
  }
}
```

## Continuous Integration

Once you have working Sentinel tests, use your preferred continuous integration (CI) system to automatically run those tests on pull requests to your policy repo.

-> **Example:** The example policy repo uses [GitHub Actions](https://developer.github.com/actions/) to run `sentinel test` for every PR. You can view [the repo's Actions workflow](https://github.com/hashicorp/tfe-policies-example/blob/master/.github/main.workflow), as well as the code for the [example Sentinel test action](https://github.com/hashicorp/sentinel-github-actions/tree/master/test).

