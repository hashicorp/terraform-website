---
layout: "cloud"
page_title: "Managing Access - Workspaces - Terraform Cloud"
---

# Managing Access to Workspaces

-> **Note:** Team management is a paid feature, available as part of the **Team** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

Terraform Cloud workspaces can only be accessed by users with the correct permissions. You can manage permissions for a workspace on a per-team basis.

Teams with [admin access](../users-teams-organizations/permissions.html) on a workspace can manage permissions for other teams on that workspace.

Teams with the [manage workspaces](../users-teams-organizations/permissions.html#manage-workspaces) permission can manage access for all workspaces in the organization. Since newly created workspaces don't have any team permissions configured, the initial setup of a workspace's permissions requires the manage workspaces permission.

-> **API:** See the [Team Access APIs](../api/team-access.html). <br/>
**Terraform:** See the `tfe` provider's [`tfe_team_access`](/docs/providers/tfe/r/team_access.html) resource.

## Background

Terraform Cloud manages workspace permissions with teams, and uses four levels of permissions (read, plan, write, and admin). Additionally, the organization-level "manage workspaces" permission can grant a team admin permissions on every workspace.

TODO: Rewrite this once we settle on language for it; also replace screenshots and update access workflow.

For more information see:

- [Users, Teams and Organizations](../users-teams-organizations/index.html)
- [Permissions](../users-teams-organizations/permissions.html)

## Managing Workspace Access Permissions

When a workspace is created, only [the owners team](../users-teams-organizations/teams.html#the-owners-team) and teams with the "manage workspaces" permission can access it, with full admin permissions. These teams' access can't be removed from a workspace.

To manage other teams' access, select "Team Access" from a workspace's "Settings" menu.

![Screenshot: a workspace's access settings page](./images/access.png)

This page has a pair of drop-downs for adding new teams, and a list of teams that already have access.

To add a team, select it from the first dropdown and use the second dropdown to choose which permissions it should have (read, write, plan, or admin), then click the "Add team" button.

To remove a team's permissions on the workspace, click the "🗑" (trash can) button next to that team's entry in the teams list.

To change a team's permissions on the workspace, you must remove the team and re-add it.
