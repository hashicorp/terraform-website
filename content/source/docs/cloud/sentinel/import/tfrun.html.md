---
layout: cloud
page_title: "tfrun - Imports - Sentinel - Terraform Cloud and Terraform Enterprise"
description: |-
    The `tfrun` import provides access to data associated with a Terraform run.
---

# Import: tfrun

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

The `tfrun` import provides access to data associated with a [Terraform run][run-glossary].

This import currently consists of run attributes, as well as namespaces for the `organization`, `workspace` and `cost-estimate`. Each namespace provides static data regarding the Terraform Cloud application that can then be consumed by Sentinel during a policy evaluation.


```
tfrun
├── id (string)
├── created_at (string)
├── message (string)
├── commit_sha (string)
├── is_destroy (boolean)
├── refresh (boolean)
├── refresh_only (boolean)
├── replace_addrs (array of strings)
├── speculative (boolean)
├── target_addrs (array of strings)
├── variables (map of keys)
├── organization
│   └── name (string)
├── workspace
│   ├── id (string)
│   ├── name (string)
│   ├── created_at (string)
│   ├── description (string)
│   ├── auto_apply (bool)
│   ├── tags (array of strings)
│   ├── working_directory (string)
│   └── vcs_repo (map of keys)
└── cost_estimate
    ├── prior_monthly_cost (string)
    ├── proposed_monthly_cost (string)
    └── delta_monthly_cost (string)
```

-> **Note:** When writing policies using this import, keep in mind that workspace
data is generally editable by users outside of the context of policy
enforcement. For example, consider the case of omitting the enforcement of
policy rules for development workspaces by the workspace name (allowing the
policy to pass if the workspace ends in `-dev`). While this is useful for
extremely granular exceptions, the workspace name could be edited by
workspace admins, effectively bypassing the policy. In this case, where an
extremely strict separation of policy managers vs. workspace practitioners is
required, using [policy sets](../manage-policies.html)
to only enforce the policy on non-development workspaces is more appropriate.

[run-glossary]: /docs/glossary.html#run
[workspace-glossary]: /docs/glossary.html#workspace

## Namespace: root

The **root namespace** contains data associated with the current run.

### Value: `id`

* **Value Type:** String.

Specifies the ID that is associated with the current Terraform run.

### Value: `created_at`

* **Value Type:** String.

The `created_at` value within the [root namespace](#namespace-root) specifies the time that the run was created. The timestamp returned follows the format outlined in [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339).

Users can use the `time` import to [load](https://docs.hashicorp.com/sentinel/imports/time#time-load-timeish) a run timestamp and create a new timespace from the specified value. See the `time` import [documentation](https://docs.hashicorp.com/sentinel/imports/time#import-time) for available actions that can be performed on timespaces.

### Value: `message`

* **Value Type:** String.

Specifies the message that is associated with the Terraform run.

The default value is *"Queued manually via the Terraform Enterprise API"*.

### Value: `commit_sha`

* **Value Type:** String.

Specifies the checksum hash (SHA) that identifies the commit.

### Value: `is_destroy`

* **Value Type:** Boolean.

Specifies if the plan is a destroy plan, which will destroy all provisioned resources.

### Value: `refresh`

* **Value Type:** Boolean.

Specifies whether the state was refreshed prior to the plan.

### Value: `refresh_only`

* **Value Type:** Boolean.

Specifies whether the plan is in refresh-only mode, which ignores configuration changes and updates state with any changes made outside of Terraform.

### Value: `replace_addrs`

* **Value Type:** An array of strings representing [resource addresses](/docs/cli/state/resource-addressing.html).

Provides the targets specified using the [`-replace`](/docs/cli/commands/plan.html#resource-targeting) flag in the CLI or the `replace-addrs` attribute in the API. Will be undefined if no resource targets are specified.

### Value: `speculative`

* **Value Type:** Boolean.

Specifies whether the plan associated with the run is a [speculative plan](../../run/index.html#speculative-plans) only.

### Value: `target_addrs`

* **Value Type:** An array of strings representing [resource addresses](/docs/cli/state/resource-addressing.html).

Provides the targets specified using the [`-target`](/docs/cli/commands/plan.html#resource-targeting) flag in the CLI or the `target-addrs` attribute in the API. Will be undefined if no resource targets are specified.

To prohibit targeted runs altogether, make sure the `target_addrs` value is undefined or empty:

```
import "tfrun"

main = (length(tfrun.target_addrs) else 0) == 0
```

### Value: `variables`

* **Value Type:** A string-keyed map of values.

Provides the names of the variables that are configured within the run and the [sensitivity](../../workspaces/variables.html#sensitive-values) state of the value.

```
variables (map of keys)
└── name (string)
    └── category (string)
    └── sensitive (boolean)
```

## Namespace: organization

The **organization namespace** contains data associated with the current run's Terraform Cloud [organization](../../users-teams-organizations/organizations.html).

### Value: `name`

* **Value Type:** String.

Specifies the name assigned to the Terraform Cloud organization.

## Namespace: workspace

The **workspace namespace** contains data associated with the current run's workspace.

### Value: `id`

* **Value Type:** String.

Specifies the ID that is associated with the Terraform workspace.

### Value: `name`

* **Value Type:** String.

The name of the workspace, which can only include letters, numbers, `-`, and `_`.

As an example, in a workspace named `app-us-east-dev` the following policy would evaluate to `true`:

```
# Enforces production rules on all non-development workspaces

import "tfrun"
import "strings"

# (Actual policy logic omitted)
evaluate_production_policy = rule { ... }

main = rule when strings.has_suffix(tfrun.workspace.name, "-dev") is false {
    evaluate_production_policy
}
```

### Value: `created_at`

* **Value Type:** String.

Specifies the time that the workspace was created. The timestamp returned follows the format outlined in [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339).

Users can use the `time` import to [load](https://docs.hashicorp.com/sentinel/imports/time#time-load-timeish) a workspace timestamp, and create a new timespace from the specicied value. See the `time` import [documentation](https://docs.hashicorp.com/sentinel/imports/time#import-time) for available actions that can be performed on timespaces.

### Value: `description`

* **Value Type:** String.

Contains the description for the workspace.

This value can be `null`.

### Value: `auto_apply`

* **Value Type:** Boolean.

Contains the workspace's [auto-apply](../../workspaces/settings.html#auto-apply-and-manual-apply) setting.

### Value: `tags`

* **Value Type:** Array of strings.

Contains the list of tag names for the workspace.

### Value: `working_directory`

* **Value Type:** String.

Contains the configured [Terraform working directory](../../workspaces/settings.html#terraform-working-directory) of the workspace.

This value can be `null`.

### Value: `vcs_repo`

* **Value Type:** A string-keyed map of values.

Contains data associated with a VCS repository connected to the workspace.

Details regarding each attribute can be found in the documentation for the Terraform Cloud [Workspaces API](../../api/workspaces.html).

This value can be `null`.

```
vcs_repo (map of keys)
├── identifier (string)
├── display_identifier (string)
├── branch (string)
└── ingress_submodules (bool)
```

## Namespace: cost_estimate

The **cost_estimation namespace** contains data associated with the current run's cost estimate.

This namespace is only present if a cost estimate is available.

-> Cost estimation is disabled for runs using [resource targeting](/docs/cli/commands/plan.html#resource-targeting), which may cause unexpected failures.

-> **Note:** Cost estimates are not available for Terraform 0.11.

### Value: `prior_monthly_cost`

* **Value Type:** String.

Contains the monthly cost estimate at the beginning of a plan.

This value contains a positive decimal and can be `"0.0"`.

### Value: `proposed_monthly_cost`

* **Value Type:** String.

Contains the monthly cost estimate if the plan were to be applied.

This value contains a positive decimal and can be `"0.0"`.

### Value: `delta_monthly_cost`

* **Value Type:** String.

Contains the difference between the prior and proposed monthly cost estimates.

This value may contain a positive or negative decimal and can be `"0.0"`.
