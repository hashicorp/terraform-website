---
layout: "cloud"
page_title: "API Tokens - Terraform Cloud and Terraform Enterprise"
sidebar_current: "docs-cloud-users-teams-organizations-api-tokens"
---

# API Tokens

Terraform Cloud supports three distinct types of API tokens with varying levels of access: user, team, and organization. There are differences in access levels and generation workflows for each of these token types, which are outlined below.

API tokens are displayed only once when they are created, and are obfuscated thereafter. If the token is lost, it must be regenerated.

-> **API:** See the [Team Token API](../api/team-tokens.html) and [Organization Token API](../api/organization-tokens.html).

## User API Tokens

API tokens may belong directly to a user. User tokens are the most flexible token type because they inherit permissions from the user they are associated with. For more information on user tokens and how to generate them, see the [Users](./users.html#api-tokens) documentation.

## Team API Tokens

API tokens may belong to a specific team. Team API tokens allow access to the workspaces that the team has access to, without being tied to any specific user.

To manage the API token for a team, go to **Organization settings > Teams > (desired team)** and use the controls under the "Team API Token" header.

Each team can have **one** valid API token at a time, and any member of a team can generate or revoke that team's token. When a token is regenerated, the previous token immediately becomes invalid.

Team API tokens are designed for performing API operations on workspaces. They have the same access level to the workspaces the team has access to. For example, if a team has permission to apply runs on a workspace, the team's token can create runs and configuration versions for that workspace via the API. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Note that the individual members of a team can usually perform actions the team itself cannot, since users can belong to multiple teams, can belong to multiple organizations, and can authenticate with Terraform's `atlas` backend for running Terraform locally.

If an API token is generated for the "owners" team, then that API token will have all of the same permissions that an organization owner would.

## Organization API Tokens

API tokens may generated for a specific organization. Organization API tokens allow access to the organization-level settings and resources, without being tied to any specific team or user.

To manage the API token for an organization, go to **Organization settings > API Token** and use the controls under the "Organization Tokens" header.

Each organization can have **one** valid API token at a time. Only [organization owners](./teams.html#the-owners-team) can generate or revoke an organization's token.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Organization API tokens are designed for creating and configuring workspaces and teams. We don't recommend using them as an all-purpose interface to Terraform Cloud; their purpose is to do some initial setup before delegating a workspace to a team. For more routine interactions with workspaces, use [team API tokens](#team-api-tokens).

Organization API tokens have permissions across the entire organization. They can perform all CRUD operations on most resources, but have some limitations; most importantly, they cannot start runs or create configuration versions. Any API endpoints that can't be used with an organization API token include a note like the following:

-> **Note:** This endpoint cannot be accessed with [organization tokens](#organization-api-tokens). You must access it with a [user token](./users.html#api-tokens) or [team token](#team-api-tokens).

## Agent API Tokens

[Agent pools](/docs/cloud/agents/index.html) have their own set of API tokens which allow agents to communicate with Terraform Cloud, scoped to an organization. These tokens are not valid for direct usage in the Terraform Cloud API and are only used by agents.

## Access Levels

The following chart illustrates the various access levels for the supported API token types. Some permissions are implicit based on the token type, others are dependent on the permissions of the associated user, team, or organization.

🔷 = Implicit for token type 🔶 = Requires explicit permission

|                                | User tokens | Team tokens | Organization tokens |
|--------------------------------|:-----------:|:-----------:|:-------------------:|
| **Users**                      |             |             |                     |
| Manage user settings           | 🔷          |             |                     |
| Manage user tokens             | 🔷          |             |                     |
| **Workspaces**                 |             |             |                     |
| Read workspace variables       | 🔶          | 🔶          | 🔷                  |
| Write workspace variables      | 🔶          | 🔶          | 🔷                  |
| Plan, apply, upload states     | 🔶          | 🔶          |                     |
| Force cancel runs              | 🔶          | 🔶          |                     |
| Create configuration versions  | 🔶          | 🔶          |                     |
| Create or modify workspaces    | 🔶          | 🔶          | 🔷                  |
| Remote operations              | 🔶          | 🔶          |                     |
| Manage run triggers            | 🔶          | 🔶          | 🔷                  |
| Manage notification configurations | 🔶      | 🔶          |                     |
| **Teams**                      |             |             |                     |
| Create teams                   | 🔶          | 🔷 (owners) | 🔷                  |
| Modify team                    | 🔶          | 🔷 (owners) | 🔷                  |
| Read team                      | 🔶          | 🔷          | 🔷                  |
| Manage team tokens             | 🔶          | 🔷          | 🔷                  |
| Manage team workspace access   | 🔶          | 🔶          | 🔷                  |
| Manage team membership         | 🔶          | 🔷 (owners) | 🔷                  |
| **Organizations**              |             |             |                     |
| Create organizations           | 🔷           |           |                       |
| Modify organizations           | 🔶          |             |                     |
| Manage organization tokens     | 🔶          |             |                     |
| **Sentinel**                   |             |             |                     |
| Manage Sentinel policies       | 🔶          | 🔶          | 🔷                  |
| Manage policy sets             | 🔶          | 🔶          | 🔷                  |
| Override policy checks         | 🔶          | 🔶          |                     |
| **Integrations**               |             |             |                     |
| Manage VCS connections         | 🔶          | 🔶          | 🔷                  |
| Manage SSH keys                | 🔶          | 🔶          |                     |
| **Modules**                    |             |             |                     |
| Manage Terraform modules       | 🔶          | 🔷 (owners) |                     |
