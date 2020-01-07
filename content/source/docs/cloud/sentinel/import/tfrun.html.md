---
layout: cloud
page_title: "tfrun - Imports - Sentinel - Terraform Cloud"
description: |-
    The `tfrun` import provides access to data associated with a Terraform run.
---

# Import: tfrun

The `tfrun` import provides access to data associated with a [Terraform run][run-glossary].

This import currently consists of run attributes, as well as namespaces for the `organization`, `workspace` and `cost-estimate`. Each namespace provides static data regarding the Terraform Cloud application that can then be consumed by Sentinel during a policy evaluation.


```
tfrun
├── created_at (string)
├── message (string)
├── speculative (boolean)
├── is_destroy (boolean)
├── variables (map of keys)
├── organization
│   └── name (string)
├── workspace
│   ├── name (string)
│   ├── description (string)
│   ├── auto_apply (bool)
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

### Value: `created_at`

* **Value Type:** String.

The `created_at` value within the [root namespace](#root-namespace) specifies the time that the run was created. The timestamp returned follows the format outlined in [RFC3339](https://tools.ietf.org/html/rfc3339).

Users can use the `time` import to [load](https://docs.hashicorp.com/sentinel/imports/time/#timeloadtimeish) a run timestamp and create a new timespace from the specicied value. See the `time` import [documentation](https://docs.hashicorp.com/sentinel/imports/time/#import-time) for available actions that can be performed on timespaces.

### Value: `message`

* **Value Type:** String.

Specifies the message that is associated with the run.

The default value is *"Queued manually via the Terraform Enterprise API"*.

### Value: `speculative`

* **Value Type:** Boolean.

Specifies whether the plan associated with the run is a [speculative plan](../../run/index.html#speculative-plans) only.

### Value: `is_destroy`

* **Value Type:** Boolean.

Specifies if the plan is a destroy plan, which will destroy all provisioned resources.

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

### Value: `name`

* **Value Type:** String.

The name of the workspace, which can only include letters, numbers, `-`, and `_`.

As an example, in a workspace named `app-dev-us-east` the following policy would evaluate to `true`:

```
# Enforces production rules on all non-development workspaces

import "tfrun"
import "strings"

# (Actual policy logic omitted)
meets_production_policy = rule { ... }

main = rule {
    if strings.has_suffix(tfrun.workspace.name, "-dev") {
        true
    } else
        meets_production_policy
    }
}
```

### Value: `description`

* **Value Type:** String.

Contains the description for the workspace.

This value can be `null`.

### Value: `auto_apply`

* **Value Type:** Boolean.

Contains the workspace's [auto-apply](../../workspaces/settings.html#auto-apply-and-manual-apply) setting.

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