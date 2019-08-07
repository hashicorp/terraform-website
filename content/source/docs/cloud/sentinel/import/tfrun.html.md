---
layout: cloud
page_title: "tfrun - Imports - Sentinel - Terraform Cloud"
description: |-
    The `tfrun` import provides access to data associated with a Terraform run.
---

# Import: tfrun

The `tfrun` import provides access to data associated with a [Terraform run][run-glossary].

This import currently includes a single namespace - `workspace` - which provides Sentinel policies with
static data regarding the Terraform Cloud [workspace][workspace-glossary] associated with the run.

```
tfrun
└── workspace
    ├── name (string)
    ├── description (string)
    ├── auto_apply (bool)
    ├── working_directory (string)
    └── vcs_repo (map of keys)
```

-> Note: When policies using this import, keep in mind that workspace
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

## Namespace: Workspace

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
contains the workspace [auto-apply](../../workspaces/settings.html#auto-apply-and-manual-apply) setting.

### Value: `working_directory`

* **Value Type:** String.

The `working_directory` value within the [workspace namespace](#namespace-workspace)
contains the working directory of the workspace.

This value is an empty string (`""`) when no working directory is set.

### Value: `vcs_repo`

* **Value Type:** A string-keyed map of values.

The `vcs_repo` value within the [workspace namespace](#namespace-workspace)
data associated with a VCS repository connected to the workspace.

Details regarding each attribute can be found in the documentation for the Terraform Cloud [Workspaces API](../../api/workspaces.html).

```
vcs_repo (map of keys)
├── identifier (string)
├── display_identifier (string)
├── branch (string)
└── ingress_submodules (bool)
```
