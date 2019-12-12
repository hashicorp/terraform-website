---
layout: cloud
page_title: "tfrun - Imports - Sentinel - Terraform Cloud"
description: |-
    The `tfrun` import provides access to data associated with a Terraform run.
---

# Import: tfrun

The `tfrun` import provides access to data associated with a [Terraform run][run-glossary].

This import currently consist of a `root` namespace, as well as namespaces for the `organization`, `workspace` and `cost-estimate`. Each namespace provides static data regarding the Terraform Cloud application that can then be consumed by Sentinel during a policy evaluation.


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

The `created_at` value within the [root namespace](#root-namespace) specifies the time that the run was created.

### Value: `message`

* **Value Type:** String.

The `message` value within the [root namespace](#root-namespace) specifies the message that is associated with the run.

The default value is *"Queued manually via the Terraform Enterprise API"*.

### Value: `speculative`

* **Value Type:** Boolean.

The `speculative` value within the [root namespace](#root-namespace) specifies whether the plan associated with the run is a [speculative plan](../../run/index.html#speculative-plans) only.

### Value: `is_destroy`

* **Value Type:** Boolean.

The `is_destroy` value within the [root namespace](#root-namespace) specifies whether the run will perform a destroy operation.

### Value: `variables`

* **Value Type:** A string-keyed map of values.

The `variables` value within the [root namespace](#root-namespace) provides the names of the variables that are configured within the run and the [sensitivity](../../workspaces/variables.html#sensitive-values) state of the value.

```
variables (map of keys)
└── name (string)
    └── sensitive (boolean)
```

## Namespace: organization

The **organization namespace** contains data associated with the current run's Terraform Cloud [organization](../../users-teams-organizations/organizations.html).

### Value: `name`

* **Value Type:** String.

The `name` value within the [organization namespace](#organization-namespace) specifies the name assigned to the Terraform Cloud organization.

## Namespace: workspace

The **workspace namespace** contains data associated with the current run's workspace.

### Value: `name`

* **Value Type:** String.

The `name` value within the [workspace namespace](#namespace-workspace) contains the workspace name.

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

The `description` value within the [workspace namespace](#namespace-workspace) contains the workspace description.

This value can be `null`.

### Value: `auto_apply`

* **Value Type:** Boolean.

The `auto_apply` value within the [workspace namespace](#namespace-workspace)
contains the workspace's [auto-apply](../../workspaces/settings.html#auto-apply-and-manual-apply) setting.

### Value: `working_directory`

* **Value Type:** String.

The `working_directory` value within the [workspace namespace](#namespace-workspace)
contains the configured [Terraform working directory](../../workspaces/settings.html#terraform-working-directory) of the workspace.

This value can be `null`.

### Value: `vcs_repo`

* **Value Type:** A string-keyed map of values.

The `vcs_repo` value within the [workspace namespace](#namespace-workspace)
contains data associated with a VCS repository connected to the workspace.

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

The **cost_estimation namespace** contains data associated with the current run's cost estimate. This
namespace is only present if a cost estimate is available. Note that cost estimates are not
available for Terraform 0.11.

### Value: `prior_monthly_cost`

* **Value Type:** String.

The `prior_monthly_cost` value within the [cost_estimate namespace](#namespace-cost_estimate) contains the
monthly cost estimate at the beginning of a plan.

This value contains a positive decimal and can be `"0.0"`.

### Value: `proposed_monthly_cost`

* **Value Type:** String.

The `proposed_monthly_cost` value within the [cost_estimate namespace](#namespace-cost_estimate) contains the
monthly cost estimate if the plan were to be applied.

This value contains a positive decimal and can be `"0.0"`.

### Value: `delta_monthly_cost`

* **Value Type:** String.

The `delta_monthly_cost` value within the [cost_estimate namespace](#namespace-cost_estimate) contains the
difference between the prior and proposed monthly cost estimates.

This value contains a positive or negative decimal and can be `"0.0"`.
