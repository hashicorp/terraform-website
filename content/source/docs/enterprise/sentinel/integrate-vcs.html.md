---
layout: enterprise2
page_title: "Managing Policies with VCS - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-integrate-vcs"
---

# Managing Sentinel Policies with Version Control

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

Terraform Enterprise (TFE)'s [UI for managing Sentinel policies](./manage-policies.html) is designed primarily for _viewing_ your organization's policies and policy sets. It also works well for demos, proofs of concept, and other simple use cases.

For complex day-to-day use, we recommend keeping Sentinel code in version control and using Terraform to automatically deploy your policies. This approach is a better fit with Sentinel's policy-as-code design, and scales better for organizations with multiple owners and administrators.

This page describes an end-to-end process for managing TFE's Sentinel policies with version control and Terraform. Use this outline and the [example repository][example_repo] as a starting point for managing your own organization.

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

Once your policy management process is fully implemented, the repo will contain the following:

- **Sentinel policies,** stored as `.sentinel` files in the root of the repo.
- **A Terraform configuration,** stored in the root of the repo. This can be a single `main.tf` file, or several smaller configuration files.
- **Sentinel tests,** stored in a `test/` directory.
- Optionally: other information or metadata, which might include a README file, editor configurations, and CI configurations.

### Important Note About Security

When managing policies with TFE's UI, only organization owners can make changes. When managing policies with Terraform, changes are made automatically.

This means write access to your policies is governed by the policy repository, so you should strictly control access to it. In particular, make sure to:

- Limit merge permissions to a small number of trusted users.
- Prohibit direct pushes to master.
- Enforce a consistent process for reviewing and merging changes to policy code.

## Sentinel Policies

-> **Example:** See the `.sentinel` files included in the [example policy repo][example_repo], or browse the [list of example policies][example_policies].

Write some [Sentinel policies for TFE][defining_policies], and commit them to your repo as `.sentinel` files. If you're already enforcing Sentinel policies in TFE, copy them into the new repo.

### A Meta-Policy to Protect the Policies Workspace

The workspace that manages your Sentinel policies will be using [the `tfe` provider][tfe_provider] with very elevated permissions, which means it can change any of your organization's settings if the Terraform configuration dictates.

You can make this less likely by using Sentinel to restrict which resources the workspace can manage. The example repo includes [a Sentinel policy to forbid the other `tfe` resources](https://github.com/hashicorp/tfe-policies-example/blob/master/tfe_policies_only.sentinel), so that the policies workspace can only manage policies and policy sets.

This doesn't protect the repo from untrusted users; an attacker able to write to the Terraform configuration could also change the policy to allow their changes. However, it's an efficient way to keep trusted users from misusing the policies workspace by accident or by misunderstanding.

## Terraform Configuration

-> **Example:** The example policy repo includes a [complete Terraform configuration for policies](https://github.com/hashicorp/tfe-policies-example/blob/master/main.tf).

Next, write a Terraform configuration to manage your policies and policy sets in TFE using [the `tfe` provider][tfe_provider].

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

### Optional: Define a Workspace IDs Variable

[workspace_ids]: #optional-define-a-workspace-ids-variable

-> **Note:** This is a temporary workaround. A future version of the `tfe` provider will provide a way to look up workspace IDs without pre-populating a map.

The `tfe_policy_set` resource uses opaque workspace IDs, but you can refer to workspaces by name if you provide a map of names to IDs. Use a Terraform variable for this map, so you can update it in TFE without changing the configuration:

```hcl
variable "tfe_workspace_ids" {
  description = "Mapping of workspace names to IDs, for easier use in policy sets."
  type        = "map"

  default = {
    "app-prod"                = "ws-LbK9gZEL4beEw9A2"
    "app-dev"                 = "ws-uMM93B6XrmCwh3Bj"
    "app-staging"             = "ws-Mp6tkwtspVNZ5DSf"
    "app-dev-sandbox-bennett" = "ws-s7jPpcQG4AGrSsTb"
    "tfe-policies"            = "ws-Vt9UKZE5ejqGMp94"
  }
}
```

To quickly get a list of workspace names and IDs, you can make an API call to the [List Workspaces endpoint](../api/workspaces.html#list-workspaces) (with a large enough page size to include all workspaces) and pipe the result to a `jq` program:

```
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces?page%5Bnumber%5D=1&page%5Bsize%5D=100 \
  | jq --raw-output '.data[] | "\"\(.attributes.name)\" = \"\(.id)\""'
```

### Configure the `tfe` Provider

Configure the `tfe` provider with your API token and hostname variables. Make sure the provider is set to version 0.3 or higher.

```hcl
provider "tfe" {
  hostname = "${var.tfe_hostname}"
  token    = "${var.tfe_token}"
  version  = "~> 0.4"
}
```

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

Create a [`tfe_policy_set` resource][tfe_policy_set] for each policy set you wish to create, and specify which policies are part of the set. Each policy set must also set a value for either `global` or `workspace_external_ids`, to specify which workspaces it should be enforced on.

-> **Note:** See [Managing Sentinel Policies](./manage-policies.html) for a complete description of TFE's policy sets.

- To build the `policy_ids` list, interpolate `id` attributes from your policy resources, like `"${tfe_sentinel_policy.aws-block-allow-all-cidr.id}"`.
- To build the `workspace_external_ids` list, interpolate values from your name-to-ID map variable, like `"${var.tfe_workspace_ids["app-prod"]}"`

```hcl
resource "tfe_policy_set" "global" {
  name         = "global"
  description  = "Policies that should be enforced on ALL infrastructure."
  organization = "${var.tfe_organization}"
  global       = true

  policy_ids = [
    "${tfe_sentinel_policy.passthrough.id}",
    "${tfe_sentinel_policy.aws-block-allow-all-cidr.id}",
    "${tfe_sentinel_policy.azurerm-block-allow-all-cidr.id}",
    "${tfe_sentinel_policy.gcp-block-allow-all-cidr.id}",
    "${tfe_sentinel_policy.aws-restrict-instance-type-default.id}",
    "${tfe_sentinel_policy.azurerm-restrict-vm-size.id}",
    "${tfe_sentinel_policy.gcp-restrict-machine-type.id}",
  ]
}

resource "tfe_policy_set" "production" {
  name         = "production"
  description  = "Policies that should be enforced on production infrastructure."
  organization = "${var.tfe_organization}"

  policy_ids = [
    "${tfe_sentinel_policy.aws-restrict-instance-type-prod.id}",
  ]

  workspace_external_ids = [
    "${var.tfe_workspace_ids["app-prod"]}",
  ]
}
```

### Importing Resources

If your TFE organization already has some unmanaged policies or policy sets, make sure to include them when writing your Terraform configuration.

To bring the old resources under management, you can either delete them and allow Terraform to re-create them, or [import them into the Terraform state][import]. Deleting is easier, but importing lets you ensure that you correctly transcribed the information.

To import Sentinel resources, perform the following steps **after** you have created a TFE workspace for managing policies, but **before** you have performed any runs in that workspace.

1. In a local checkout of your policy management repo, configure [the remote backend][remote] to use your TFE policies workspace. (You can do this in `main.tf`, or in a separate `.tf` file that is excluded from version control.)
2. Run `terraform init`.
3. For each existing Sentinel policy, run:

    ```
    $ terraform import tfe_sentinel_policy.<NAME> <ORGANIZATION>/<POLICY ID>
    ```

    `<NAME>` is the name you used for the corresponding resource in the Terraform configuration. You can find the policy ID in the URL bar when viewing a policy page.

    Note that this resource uses the organization name as part of the import ID.
4. For each existing policy set, run:

    ```
    $terraform import tfe_policy_set.<NAME> <POLICY SET ID>
    ```

    `<NAME>` is the name you used for the corresponding resource in the Terraform configuration. You can find the policy set ID in the URL bar when viewing a policy set page.

    Note that this resource _doesn't_ use the organization name as part of the import ID.


## TFE Workspace

Create a [new TFE workspace](../workspaces/creating.html) linked to to your policy management repo. Use a short and obvious name like `tfe-policies`.

-> **Note:** This workspace doesn't have to belong to the organization whose policies it manages. If you use multiple TFE organizations, one of them can manage policies for the others.

Before performing any runs, go to the workspace's "Variables" page and set the following Terraform variables (using whichever names you used in the configuration):

- `tfe_token` (mark as "Sensitive") — A TFE API token that can manage your organization's Sentinel policies. This token must be one of the following:
    - The [organization token][] (recommended)
    - The [team token][] for the [owners team][]
    - A [user token][] from a member of the owners team
- `tfe_organization` — The name of the organization you want to manage policies for.
- `tfe_hostname` — The hostname of your TFE instance.
- `tfe_workspace_ids` (mark as "HCL") — A map of workspace names to workspace IDs. ([See above][workspace_ids].)

Once the variables are configured, you can queue a Terraform run to begin managing policies.

## Policy Tests

It's easier and safer to collaborate on policy as code when your code is well tested. Take advantage of Sentinel's built-in testing capabilities by adding tests to your policy repo.

-> **Example:** The example policy repo includes [tests for every policy](https://github.com/hashicorp/tfe-policies-example/tree/master/test/).

See the [Sentinel testing documentation][test] to learn how to write and run tests. In brief, you should:

- Create a `test/<NAME>` directory for each policy file.
- Add JSON files (one per test case) to those directories. The object in each file should include the following keys:
    - `mock` — Mock data that represents the test case. Usually you'll mock data for one or more of the Terraform imports; some policies might also require additional imports. For more details about mocking Terraform imports, see:

        - [Mocking `tfplan` data](./import/mock-tfplan.html)
        - [Mocking `tfconfig` data](./import/mock-tfconfig.html)
        - [Mocking `tfstate` data](./import/mock-tfstate.html)
    - `test` — Expected results for the policy's rules in this test case. (If the only expected result is `"main": true`, you can omit the `test` key.)

    For each policy, make at least two tests: one that obeys the policy, and one that violates the policy (using `"test": {"main": false}` so that the failed policy results in a passing test). Add more test cases for more complex policies.
- Run `sentinel test` (in the root of the policy repo) to see results for every test in the `test` directory.

An example Sentinel test:

```json
{
  "test": {
    "main": false,
    "instance_type_allowed": false
  },
  "mock": {
    "tfplan": {
      "resources": {
        "aws_instance": {
          "always-bad": {
            "0": {
              "applied": {
                "ami": "ami-0afae182eed9d2b46",
                "instance_type": "t3.2xlarge",
                "tags": {
                  "Name": "HelloWorld"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Continuous Integration

Once you have working Sentinel tests, use your preferred continuous integration (CI) system to automatically run those tests on pull requests to your policy repo.

-> **Example:** The example policy repo uses [GitHub Actions](https://developer.github.com/actions/) to run `sentinel test` for every PR. View [the repo's Actions workflow](https://github.com/hashicorp/tfe-policies-example/blob/master/.github/main.workflow), or the code for the [example Sentinel test action](https://github.com/thrashr888/sentinel-github-actions/tree/master/test).

