---
layout: enterprise2
page_title: "permissions - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-users-teams-organizations-permissions"
---

# Permissions

Teams can be given read, write, or admin permissions on workspaces.

**Read**

Can read any information on the workspace including:

- StateVersions
- Runs
- ConfigurationVersions

Cannot do anything which alters state of the above.

**Write**

Can do everything the read access level can do plus:

- Execute functions which alter state of the above models
- Create and approve Runs.
- Lock and Unlock the Workspace

**Admin**

Can do everything the write access level can do, plus:

- Read and Write Variables on the workspace
- Delete the workspace
- Add and Remove Teams from the Workspace at any access level
- Read and Write Workspace settings (VCS config, etc)
