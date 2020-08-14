---
layout: "cloud"
page_title: "Managing Access - Workspaces - Terraform Cloud and Terraform Enterprise"
---

# Managing Access to Workspaces

-> **Note:** Team management is a paid feature, available as part of the **Team** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

Terraform Cloud workspaces can only be accessed by users with the correct permissions. You can manage permissions for a workspace on a per-team basis.

Teams with [admin access](../users-teams-organizations/permissions.html) on a workspace can manage permissions for other teams on that workspace. Since newly created workspaces don't have any team permissions configured, the initial setup of a workspace's permissions requires the owners team or a team with permission to manage workspaces. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

-> **API:** See the [Team Access APIs](../api/team-access.html). <br/>
**Terraform:** See the `tfe` provider's [`tfe_team_access`](/docs/providers/tfe/r/team_access.html) resource.

## Background

Terraform Cloud manages users' permissions to workspaces with teams.

* [Workspace-level permissions](../users-teams-organizations/permissions.html#workspace-permissions) can be granted to an individual team on a particular workspace. These permissions can be managed on the workspace by anyone with admin access to the workspace.
* In addition, some [organization-level permissions](..//users-teams-organizations/permissions.html#organization-permissions) can be granted to a team which apply to every workspace in the organization. For example, the
[manage workspaces](../users-teams-organizations/permissions.html#manage-workspaces) grants the workspace-level admin permission to every workspace in the organization. Organization-level permissions can only be managed by organization owners.

For more information see:

- [Users, Teams and Organizations](../users-teams-organizations/index.html)
- [Permissions](../users-teams-organizations/permissions.html)

## Managing Workspace Access Permissions

When a workspace is created, only [the owners team](../users-teams-organizations/teams.html#the-owners-team) and teams with the "manage workspaces" permission can access it, with full admin permissions. These teams' access can't be removed from a workspace.

To manage other teams' access, select "Team Access" from a workspace's "Settings" menu.

![Screenshot: a workspace's access settings page](./images/access.png)

This screen displays all teams granted workspace-level permissions to the workspace. To add a team, select "Add team and
permissions".


![Screenshot: adding a team to a workspace](./images/add-team-access.png)

A list of teams which can be added to the workspace is shown. Select a team to continue and select the team's
permissions:

![Screenshot: adding team permissions](./images/add-team-perms-standard.png)

Four [fixed permissions sets](../users-teams-organizations/permissions.html#fixed-permission-sets) (read, plan, write, and admin) are available for basic usage.

To enable finer-grained selection of non-admin permissions, select "Customize permissions for this team":

![Screenshot: adding customized team permissions](./images/add-team-perms-cwa.png)

On this screen, you may pick and choose individual permissions to grant the team for the workspace.

For more information on permissions, see [the documentation on Workspace
Permissions](../users-teams-organizations/permissions.html#workspace-permissions).
