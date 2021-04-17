---
layout: "cloud"
page_title: "Terraform State - Workspaces - Terraform Cloud and Terraform Enterprise"
---

# Terraform State in Terraform Cloud

Each Terraform Cloud workspace has its own separate state data, used for runs within that workspace.

-> **API:** See the [State Versions API](../api/state-versions.html).

## State Usage in Terraform Runs

In [remote runs](../run/index.html), Terraform Cloud automatically configures Terraform to use the workspace's state; the Terraform configuration does not need an explicit backend configuration. (If a backend configuration is present, it will be overridden.)

In local runs (available for workspaces whose execution mode setting is set to "local"), you can use a workspace's state by configuring [the `remote` backend](/docs/language/settings/backends/remote.html) and authenticating with a user token that has permission to read and write state versions for the relevant workspace. When using a Terraform configuration that references outputs from another workspace, the authentication token must also have permission to read state outputs for that workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## State Versions

In addition to the current state, Terraform Cloud retains historical state versions, which can be used to analyze infrastructure changes over time.

You can view a workspace's state versions from its "States" tab. Each state in the list indicates which run and which VCS commit (if applicable) it was associated with. Click a state in the list for more details, including a diff against the previous state and a link to the raw state file.

## State Manipulation

Certain tasks (including importing resources, tainting resources, moving or renaming existing resources to match a changed configuration, and more) require modifying Terraform state outside the context of a run.

Manual state manipulation in Terraform Cloud workspaces requires the use of Terraform CLI, using the same commands as would be used in a local workflow (`terraform import`, `terraform taint`, etc.). To manipulate state, you must configure [the `remote` backend](/docs/language/settings/backends/remote.html) and authenticate with a user token that has permission to read and write state versions for the relevant workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Accessing State from Other Workspaces

-> **Note:** Provider-specific [data sources](/docs/language/data-sources/index.html) are usually the most resilient way to share information between separate Terraform configurations. `terraform_remote_state` is more flexible, but we recommend using specialized data sources whenever it is convenient to do so.

Terraform's built-in [`terraform_remote_state` data source](/docs/language/state/remote-state-data.html) lets you share arbitrary information between configurations via root module [outputs](/docs/language/values/outputs.html).

Terraform Cloud automatically manages API credentials for `terraform_remote_state` access during [runs managed by Terraform Cloud](/docs/cloud/run/index.html#remote-operations). This means you do not usually need to include an API token in a `terraform_remote_state` data source's configuration.

### Remote State Access Controls

Remote state access between workspaces is subject to access controls:

- Only workspaces within the same organization can access each other's state.
- The workspace whose state is being read must be configured to allow that access. State access permissions are configured on a workspace's [general settings page](/docs/cloud/workspaces/settings.html). There are two ways a workspace can allow access:
    - Globally, to all workspaces within the same organization.
    - Selectively, to a list of specific approved workspaces.

By default, new workspaces in Terraform Cloud do not allow other workspaces to access their state. We recommend that you follow the principle of least privilege and only enable state access between workspaces that specifically need information from each other.

-> **Note:** The default access permissions for new workspaces in Terraform Cloud changed in April 2021. Workspaces created before this change defaulted to allowing global access within their organization. These workspaces can be changed to more restrictive access at any time on their [general settings page](/docs/cloud/workspaces/settings.html). Terraform Enterprise administrators can choose whether new workspaces on their instances default to global access or selective access.

### Data Source Configuration

To configure a `terraform_remote_state` data source that references a Terraform Cloud workspace, set the data source's `backend` argument to `remote` and specify the organization and workspace in the `config` argument.

``` hcl
data "terraform_remote_state" "vpc" {
  backend = "remote"
  config = {
    organization = "example_corp"
    workspaces = {
      name = "vpc-prod"
    }
  }
}

resource "aws_instance" "redis_server" {
  # Terraform 0.12 and later: use the "outputs.<OUTPUT NAME>" attribute
  subnet_id = data.terraform_remote_state.vpc.outputs.subnet_id
}
```
