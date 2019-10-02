---
layout: "cloud"
page_title: "permissions - Terraform Cloud"
---

# Permissions

## Workspace-level permissions

Teams can have **read, plan, write,** or **admin** permissions on individual workspaces.

### Read

Can read any information on the workspace, including:

- StateVersions
- Runs
- ConfigurationVersions
- Variables

Cannot do anything which alters state of the above.

### Plan

Can do everything the read access level can do plus:

- Create runs

### Write

Can do everything the plan access level can do plus:

- Execute functions which alter state of the above models.
- Approve runs.
- Edit variables on the workspace.
- Lock and unlock the workspace.

### Admin

Can do everything the write access level can do, plus:

- Delete the workspace.
- Add and remove teams from the workspace at any access level.
- Read and write workspace settings (VCS config, etc).

## Organization-level permissions

Teams can be granted permissions to **manage Sentinel policies, workspaces,** and/or **VCS settings** across an organization.

### Manage Policies

Allows members to create, edit, and delete the organization's Sentinel policies and override soft-mandatory policy checks. Note that this setting implicitly gives read access to all workspaces to set enforcement of [policy sets](../sentinel/manage-policies.html).

### Manage Workspaces

Allows members to create and administrate all workspaces within the organization. This is synonymous to giving the team [admin permission level](./permissions.html) to all workspaces, plus the ability to create new workspaces (otherwise only available to the owners team). 

### Manage VCS Settings

Allows members to manage the organization's VCS Providers and SSH keys.
