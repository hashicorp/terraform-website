---
layout: enterprise2
page_title: "permissions - Terraform Enterprise"
sidebar_current: "docs-enterprise2-users-teams-organizations-permissions"
---

# Permissions

Teams can have **read, write,** or **admin** permissions on workspaces.

## Read

Can read any information on the workspace, including:

- StateVersions
- Runs
- ConfigurationVersions
- Variables

Cannot do anything which alters state of the above.

## Plan

Can do everything the read access level can do plus:

- Create runs

## Write

Can do everything the plan access level can do plus:

- Execute functions which alter state of the above models.
- Approve runs.
- Edit variables on the workspace.
- Lock and unlock the workspace.

## Admin

Can do everything the write access level can do, plus:

- Delete the workspace.
- Add and remove teams from the workspace at any access level.
- Read and write workspace settings (VCS config, etc).
