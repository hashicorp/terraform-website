---
layout: enterprise2
page_title: "permissions - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-users-teams-organizations-permissions"
---

# Permissions

Teams can have **read, write,** or **admin** permissions on workspaces.

## Read

Can read any information on the workspace including:

- StateVersions
- Runs
- ConfigurationVersions

Cannot do anything which alters state of the above.

## Write

Can do everything the read access level can do plus:

- Execute functions which alter state of the above models
- Create and approve runs.
- Lock and unlock the workspace

## Admin

Can do everything the write access level can do, plus:

- Read and write variables on the workspace
- Delete the workspace
- Add and remove teams from the workspace at any access level
- Read and write workspace settings (VCS config, etc)
