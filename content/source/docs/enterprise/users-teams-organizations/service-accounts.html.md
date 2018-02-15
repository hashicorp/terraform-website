---
layout: enterprise2
page_title: "Service Accounts - Terraform Enterprise"
sidebar_current: "docs-enterprise2-users-teams-organizations-service-accounts"
---

# Service Accounts

Terraform Enterprise provides two types of service accounts. These accounts can be granted permission to access Terraform Enterprise APIs, but cannot be used interactively. The Service Accounts are designed to support server-to-server API calls using the service identity as opposed to individual user identities.

## Team Service Accounts

Team service accounts are generally used to perform operations on workspaces. They have the same access level as the team in which they are created.

Team service accounts are under the "Team API Token" section of the team management page. All the teams in your organization are under "Teams" on the organization settings page.


## Organization Service Accounts

Organization service accounts are associated with the organization and have permissions across the entire organization. These accounts have permission to perform all CRUD operations on all resources; however, these accounts do not have permission to trigger an apply on a workspace. To perform workspace operations like applying, use team service accounts.

Organization service accounts are under "API Token" on the Organization Settings page.

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
