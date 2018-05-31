---
layout: enterprise2
page_title: "Service Accounts - Terraform Enterprise"
sidebar_current: "docs-enterprise2-users-teams-organizations-service-accounts"
---

# Service Accounts

Terraform Enterprise provides two types of service accounts. These accounts can be granted permission to access Terraform Enterprise APIs, but cannot be used interactively. The Service Accounts are designed to support server-to-server API calls using the service identity as opposed to individual user identities.

## Team Service Accounts

To manage the API token for a team service account, go to **Organization settings > Teams > (desired team)** and use the controls under the "Team API Token" header.

Team service accounts are designed for performing operations on workspaces. They have the same access level as the team in which they are created.

## Organization Service Accounts

To manage the API token for an organization service account, go to **Organization settings > API Token** and use the controls under the "Organization Tokens" header.

Organization service accounts are designed for creating and configuring workspaces and teams. We don't recommend using them as an all-purpose interface to TFE; their purpose is to do some initial setup before delegating a workspace to a team. For more routine interactions with workspaces, use team service accounts.

Organization service accounts have permissions across the entire organization. They can perform all CRUD operations on most resources, but have some limitations; most importantly, they cannot start runs or create configuration versions. Any API endpoints that can't be used with an organization account include a note like the following:

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

## Generating Tokens

The following rules apply to team and organization service accounts:

- Teams and organizations do not have tokens by default.
- Team and organization tokens cannot authenticate with Terraform's `atlas` backend; they only work with the v2 API. If you need to use the `atlas` backend (to migrate state, for example), use a [user token](./users.html#api-tokens).
- Only one token is allowed per team.
- Only one token is allowed per organization.
- Any member of a team can generate and revoke tokens for that team.
- Only members of the owners team can generate and revoke organization tokens.
- Tokens are displayed only once when they are created, and are obfuscated thereafter. If the token is lost, it must be regenerated.
- When a token is regenerated, the previous token immediately becomes invalid.
- Generating, regenerating, and deleting tokens are all supported through both the UI and the API.
