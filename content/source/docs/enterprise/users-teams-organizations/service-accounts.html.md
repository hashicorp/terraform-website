---
layout: enterprise2
page_title: "Service Accounts - Terraform Enterprise"
sidebar_current: "docs-enterprise2-users-teams-organizations-service-accounts"
---

# Service Accounts

Terraform Enterprise provides two types of service accounts. These accounts can be granted permission to access Terraform Enterprise APIs, but cannot be used interactively. The Service Accounts are designed to support server-to-server API calls using the service identity as opposed to individual user identities.

## Team service accounts

Team service accounts are generally used to perform operations on workspaces. They have the same access level as the team in which they are created.

Team service accounts are under the "Team API Token" section of the team management page. All the teams in your organization are under "Teams" on the organization settings page.


## Organization service accounts

Organization service accounts are associated with the organization and have permissions across the entire organization. These accounts have permission to perform all CRUD operations on all resources; however, these accounts do not have permission to trigger an apply on a workspace. To perform workspace operations like applying, use team service accounts.

Organization service accounts are under "API Token" on the Organization Settings page.

## Generating Tokens

If using the team or organization service accounts, consider the following criteria for generating and using the tokens:

- Teams and Organizations do not have tokens by default.
- Only one token is allowed per team.
- Only one token is allowed per organization.
- Any member of a team can generate a new token for that team.
- The tokens are generated and displayed only once when they are created, and are obfuscated thereafter. If the token is lost, it must be regenerated.
- When a token is regenerated, the previous token will immediately become invalid.
- Tokens can be revoked (deleted) by any member of the team.
- Generating, regenerating, and deleting tokens are all supported through both the UI and the API.
