---
layout: enterprise2
page_title: "Service Accounts - Terraform Enterprise"
sidebar_current: "docs-enterprise2-users-teams-organizations-service-accounts"
---

# Service Accounts

Terraform Enterprise (TFE) provides two types of service accounts: team, and organization. These accounts can access Terraform Enterprise APIs, but cannot be used interactively. The service accounts are designed to support server-to-server API calls using the service identity as opposed to individual user identities.

Team and organization service accounts don't have API tokens by default; you must generate a token before you can use them.

Like with [user tokens](./users.html#api-tokens), service account tokens are displayed only once when they are created, and are obfuscated thereafter. If the token is lost, it must be regenerated. When a token is regenerated, the previous token immediately becomes invalid.

~> **Important:** Unlike [user tokens][user token], team and organization tokens cannot authenticate with Terraform's `atlas` backend. This means they can't be used to run Terraform locally against state stored in TFE, access `terraform_remote_state` data sources during a run, or [migrate local state into TFE](../migrate/index.html). If you need to use the `atlas` backend for any reason, use a [user token][].

[user token]: ./users.html#api-tokens

## Team Service Accounts

-> **API:** See the [Team Token API](../api/team-tokens.html).

To manage the API token for a team service account, go to **Organization settings > Teams > (desired team)** and use the controls under the "Team API Token" header.

Each team can have **one** valid API token at a time, and any member of a team can generate or revoke that team's token. When a token is regenerated, the previous token immediately becomes invalid.

Team service accounts are designed for performing API operations on workspaces. They have access to the same workspaces as their team, at the same access level; for example, if a team has write access to a workspace, the team's token can create runs and configuration versions via the API.

Note that the individual members of a team can usually perform actions the team itself cannot, since users can belong to multiple teams, can belong to multiple organizations, and can authenticate with Terraform's `atlas` backend for running Terraform locally.

## Organization Service Accounts

-> **API:** See the [Organization Token API](../api/organization-tokens.html).

To manage the API token for an organization service account, go to **Organization settings > API Token** and use the controls under the "Organization Tokens" header.

Each organization can have **one** valid API token at a time. Only members of the owners team can generate or revoke an organization's token.

Organization service accounts are designed for creating and configuring workspaces and teams. We don't recommend using them as an all-purpose interface to TFE; their purpose is to do some initial setup before delegating a workspace to a team. For more routine interactions with workspaces, use team service accounts.

Organization service accounts have permissions across the entire organization. They can perform all CRUD operations on most resources, but have some limitations; most importantly, they cannot start runs or create configuration versions. Any API endpoints that can't be used with an organization account include a note like the following:

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

