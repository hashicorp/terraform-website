---
layout: enterprise2
page_title: "Service Accounts - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-users-teams-organizations-service-accounts"
---

# Service Accounts

Terraform Enterprise provides two types of service accounts. These accounts can be granted permission to access Terraform Enterprise APIs but cannot be used interactively. The Service Accounts are designed to support server-to-server API calls using the service identity as opposed to individual user identities.

## Team service accounts

Team service accounts are generally used to perform operations on workspaces. They have the same access level as the team in which they are created.

Team service accounts can be found under "Team API Token" section of the team management page. You can find all the teams in your organization in "Teams" on the organization settings page.


## Organization service accounts
Organization service accounts are associated with the organization and have permissions across the entire organization. These accounts have permission to perform all CRUD operation all all resources; however, these accounts do not have permission to trigger an apply on a workspace. To perform workspace operations like applying, use team service accounts.


Organization service accounts can be found under "API Token" on the Organization Settings page.

## Generating Tokens

If using the team or organization service accounts, consider the following criteria around generating and using the tokens:

- Teams and Organizations do not have tokens by default.
- Any member of that team can generate a new token.
- The tokens are generated and displayed only once when they are created and obfuscated thereafter. If the token is lost, it must be regenerated.
- When a token is regenerated the previous token will become immediately invalid. 
- Tokens can be revoked (deleted) by any member of the team.
- Generating, regenerated, and deleting are all supported through both the UI and the API.
