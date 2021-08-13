---
layout: "cloud"
page_title: "Organizations - Terraform Cloud and Terraform Enterprise"
---

[teams]: ./teams.html
[users]: ./users.html
[owners]: ./teams.html#the-owners-team

# Organizations

Organizations are a shared space for [teams][] to collaborate on workspaces in Terraform Cloud.

-> **API:** See the [Organizations API](../api/organizations.html). <br/>
**Terraform:** See the `tfe` provider's [`tfe_organization`](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs/resources/organization) resource.

## Selecting Organizations

On most pages within Terraform Cloud, the top navigation bar displays the name of the selected organization. Clicking the name reveals the organization switcher menu, which lists all of the organizations you belong to. You can switch to another organization by clicking its name, or you can create a new organization with the "Create new organization" button.

![screenshot: the organization switcher menu](./images/org-nav.png)

## Joining and Leaving Organizations

To join an organization, you must be invited by one of its [owners][] and must accept the emailed invitation. See [Organization Settings: Users](#users) below for details.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

You can leave an organization from your user account settings. See [User Settings: Organizations](./users.html#organizations) for details.

## Creating Organizations

Users can create new organizations by clicking the "Create new organization" button in the organization switcher menu. The new organization page also displays automatically when the currently logged-in user does not belong to any organizations, as when first logging in as a new user.

![screenshot: the new organization page](./images/org-new.png)

To create a new organization, provide a unique name and a primary contact email address. Organization names can include numbers, letters, underscores (`_`), and hyphens (`-`).

Once you have created an organization, you can invite other users from your organization settings. [See below for more details.](#users)

-> **Note:** On the SaaS version of Terraform Cloud, any user can create a new organization. On Terraform Enterprise, the administrators can restrict this ability, so that only site admins can create organizations. See [Administration: General Settings](/docs/enterprise/admin/general.html#organization-creation) for more details.

## Organization Settings

You can view and manage an organization's settings by clicking the "Settings" link in the top navigation bar.

![screenshot: the organization settings page](./images/org-settings.png)

The contents of the organization settings depends on the current user's permissions within the organization:

- Users with permission to manage VCS settings or manage policies can manage the settings they have access to. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))
- [Organization owners][owners] can view and manage the entire list of organization settings. Most settings cannot be delegated, and are only available to owners.
- Other users can use this section to view the organization's contact email, view the membership of any teams they belong to, and view the organization's authentication policy.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Most of the organization settings are documented near the specific workflows they enable. What follows is a brief summary with links to more relevant sections of the documentation.

### General

The general settings page is shown to all users in an organization, and displays the organization's name and contact email.

Organization owners can use this page to change the organization's name and contact email or delete the organization.

#### Renaming an Organization

!> **Warning:** Renaming an organization can be very disruptive. With the exception of new organizations with no collaborators, we strongly recommend against renaming organizations.

To rename a new organization with few or no collaborators, make sure there are no runs in progress and then update the name on the general settings page. Renaming a brand new organization is generally harmless and non-disruptive.

To rename an organization that is already managing significant infrastructure, you must:

1. Alert all members of the organization ahead of time, so they're prepared for the disruption.
1. Lock all workspaces, and bring all current and pending runs to an end (by cancelling them or by waiting for them to finish). For your protection, Terraform Cloud won't change the name of an organization with runs in progress; locking workspaces ensures no new runs will start before you attempt to change the name.
1. Rename the organization.
1. Update anything that uses Terraform Cloud's API with the organization to use its new name. This includes Terraform's `remote` backend, the `tfe` Terraform provider, and any external API integrations.
1. Unlock workspaces and resume normal operations.

### Plan & Billing

The plan and billing page allows organization owners to upgrade to one of Terraform Cloud's paid plans, downgrade to a free plan, or begin a free trial of paid features. It also displays any invoices for previous plan payments.

### Users

The users page allows organization owners to invite new Terraform Cloud users into the organization, cancel invitations, and remove existing members.

The list of users is split into two tabs: one for currently active users, and one for invited users who haven't accepted their invitations yet. If the lists are large, you can filter them by username or email using the search field at the top. For active users, the list includes usernames, email addresses, avatar icons, two-factor authentication status, and current team memberships.

![Screenshot: the users list, showing information for the currently active users.](./images/org-users.png)

To invite a user to an organization, click the "Invite a user" button on the "Users" page. You will be asked to provide an email address and an optional list of teams. If the user accepts the emailed invitation, they will be automatically added to the specified teams.

![Screenshot: the "Invite a user" dialog, which includes fields for email address and teams.](./images/org-users-invite.png)

User invitations are always sent by email; you cannot invite someone using their Terraform Cloud username.

-> **Note:** All permissions in Terraform Cloud are managed via teams. Although users can join an organization without belonging to any teams, they won't be able to do anything until they are also added to a team. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Teams

-> **Note:** Team management is a paid feature, available as part of the **Team** upgrade package. Free organizations only include an owners team, which can include up to five members. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

The teams page is shown to all users in an organization.

Organization owners can use this page to create and delete teams, manage team membership, and manage team API tokens. Note that users can only be added to teams after they have received and accepted an invitation to the organization.

Non-owners can view the list of teams (excluding [secret teams](./teams.html#team-visibility) they aren't members of), view the membership of those teams, and manage team API tokens for those teams. They can't edit team memberships.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

See [Teams][] for more information.

### Tags

This page shows the list of tags used for all resources across the organization. Tags can be added directly to workspaces. Tags deleted here will be removed from all other resources, and can be deleted in bulk.

![Screenshot: the tags list, showing a list of currently used tags.](./images/tag-management.png)

### VCS Providers

The VCS providers page is used for configuring VCS providers for use within the organization. It is available to users with permission to manage VCS settings. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

See [Connecting VCS Providers](../vcs/index.html) for more information.

### API Tokens

Organizations can have a special API token that is not associated with a specific user or team. See [API Tokens](./api-tokens.html) for more information.

### Authentication

The authentication page allows owners to determine when users must reauthenticate. It also allows owners to require [two-factor authentication](./2fa.html) for all members of the organization.

### SSH Keys

The SSH keys page manages any keys necessary for cloning Git-based module sources during Terraform runs. It does not manage keys used for accessing a connected VCS provider. See [SSH Keys for Cloning Modules](../workspaces/ssh-keys.html) for more information.

### Cost Estimation

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

The Cost Estimation page allows for enabling and disabling the [cost estimation](../cost-estimation/index.html) feature for all workspaces.

### Policies

The policies page is a deprecated interface for managing Sentinel policies. Use the policy sets page instead.

### Policy Sets

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

The policy sets page is for creating groups of Sentinel policies from a connected VCS repository, and assigning those policy sets to workspaces. It is available to users with permission to manage policies. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Sentinel is an embedded policy-as-code framework that can enforce rules about Terraform runs within an organization. See [Sentinel](../sentinel/index.html) for more information about Sentinel, or [Managing Sentinel Policies](../sentinel/manage-policies.html) for details about these two settings pages.

## Trial Expired Organizations

Terraform Cloud paid features are available as a free trial to organizations evaluating its features. If you are working with a HashiCorp Sales Representative, please ask them about how to get a free trial.

When a free trial has expired, the organization displays a banner reading "TRIAL EXPIRED — Upgrade Required" in the top navigation bar:

![screenshot: the trial expiration banner](./images/org-inactive.png)

Organizations with expired trials return to the feature set of a free organization, but they retain any data created as part of paid features. Specifically:

- Teams other than `owners` are disabled, and users who don't belong to the `owners` team are locked out of the organization. Team membership and permissions are preserved, and are re-enabled on upgrade.
- Sentinel policy checks are disabled. Existing policies and policy sets are preserved, and are re-enabled on upgrade.
- Cost estimation is disabled.
