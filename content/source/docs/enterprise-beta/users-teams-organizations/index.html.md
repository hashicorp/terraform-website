---
layout: enterprise2
page_title: "Users, Teams, and Organizations - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-users-teams-organizations"
---

# Users, Teams, and Organizations

Terraform Enterprise's organizational and access control model is based around three units: users, teams, and organizations.

- **Users** are individual members of an organization. They belong to teams, which
are granted permissions on an organization’s workspaces.
- **Teams** are groups of users that reflect your company's organizational
structure. Organization owners can create teams and manage their membership.
- **Organizations** are shared spaces for teams to collaborate on workspaces.
An organization can have many teams, and the owners of the organization set
which users have which privileges (read/write/admin) on which workspaces.
