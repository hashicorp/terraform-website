---
layout: "cloud"
page_title: "Users, Teams, and Organizations - Terraform Cloud"
---

# Users, Teams, and Organizations

Terraform Enterprise's organizational and access control model is based on three units: users, teams, and organizations.

- [Users](./users.html) are individual members of an organization. They belong to teams, which
are granted permissions on an organization’s workspaces.
- [Teams](./teams.html) are groups of users that reflect your company's organizational
structure. Organization owners can create teams and manage their membership.
- [Organizations](./organizations.html) are shared spaces for teams to collaborate on workspaces.
An organization can have many teams, and the owners of the organization set
which teams have which permissions (read/write/admin) on which workspaces.
