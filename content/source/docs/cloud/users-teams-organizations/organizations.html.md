---
layout: "cloud"
page_title: "Organizations - Terraform Cloud"
---

[teams]: ./teams.html
[users]: ./users.html

# Organizations

Organizations are a shared space for [teams][] to collaborate on workspaces in Terraform Cloud.

-> **API:** See the [Organizations API](../api/organizations.html). <br/>
**Terraform:** See the `tfe` provider's [`tfe_organization`](/docs/providers/tfe/r/organization.html) resource.

## Selecting Organizations

On most pages within Terraform Cloud, the top navigation bar displays the name of the selected organization. Clicking the name reveals the organization switcher menu, which lists all of the organizations you belong to. You can switch to another organization by clicking its name, or you can create a new organization with the "Create new organization" button.

![screenshot: the organization switcher menu](./images/org-nav.png)

## Adding Users to Organizations

Organization membership is automatic, and is determined by team membership. To add a user to an organization, add them to one or more of that organization's teams. See [Teams][] for more information.

You can only add existing user accounts to teams. If a colleague has not created their account yet, send them the sign-up link (`https://app.terraform.io/account/new` for SaaS, `https://<TFE HOSTNAME>/account/new` for private installs) and ask them to send you their username.

## Creating Organizations

Users can create new organizations by clicking the "Create new organization" button in the organization switcher menu. The new organization page also displays automatically when the currently logged-in user does not belong to any organizations, as when first logging in as a new user.

![screenshot: the new organization page](./images/org-new.png)

To create a new organization, provide a unique name and a primary contact email address. Organization names can include numbers, letters, underscores (`_`), and hyphens (`-`).

Once you have created an organization, you can add other [users][] by adding them to one or more [teams][].

-> **Note:** On the SaaS version of Terraform Cloud, any user can create a new organization. On Terraform Enterprise, the administrators can restrict this ability, so that only site admins can create organizations. See [Administration: General Settings](/docs/enterprise/admin/general.html#organization-creation) for more details.

## Organization Settings

You can view and manage an organization's settings by clicking the "Settings" link in the top navigation bar.

![screenshot: the organization settings page](./images/org-settings.png)

Only [organization owners](./teams.html#the-owners-team) can manage an organization's settings. However, other users can use this section to view the organization's contact email, view the membership of any teams they belong to, and view the organization's authentication policy.

Most of the organization settings are documented near the specific workflows they enable. What follows is a brief summary with links to more relevant sections of the documentation.

### Profile / Delete

The profile page shows the organization's name and contact email, but does not allow you to change them.

The profile page is also where you can **delete your organization.**

### Teams

The teams page allows organization owners to manage the organization's teams, including creating and deleting teams, managing membership, and generating team API tokens.

Users who aren't organization owners can view the list of teams they belong to and the membership of those teams. They can't edit teams or view any teams they don't belong to.

See [Teams][] for more information.

### VCS Provider

The VCS provider page is used for setting up VCS access for Terraform Cloud. See [Connecting VCS Providers](../vcs/index.html) for more information.

### API Tokens

Organizations can have a special API token that is not associated with a specific user or team. See [API Tokens](./api-tokens.html) for more information.

### Authentication

The authentication page allows owners to determine when users must reauthenticate. It also allows owners to require [two-factor authentication](./2fa.html) for all members of the organization.

### Manage SSH Keys

The SSH keys page manages any keys necessary for cloning Git-based module sources during Terraform runs. It does not manage keys used for accessing a connected VCS provider. See [SSH Keys for Cloning Modules](../workspaces/ssh-keys.html) for more information.

### Cost Estimation

The Cost Estimation page allows for enabling and disabling the [cost estimation](../getting-started/cost-estimation.html) feature for all workspaces.

### Policies and Policy Sets

The policies page is for managing Sentinel policies, and the policy sets page is for assigning groups of policies to workspaces.

Sentinel is an embedded policy-as-code framework that can enforce rules about Terraform runs within an organization. See [Sentinel](../sentinel/index.html) for more information about Sentinel, or [Managing Sentinel Policies](../sentinel/manage-policies.html) for details about these two settings pages.

## Trial Expired Organizations

Terraform Cloud paid features are available as a free trial to organizations evaluating its features. If you are working with a Hashicorp Sales Representative, please ask them about how to get a free trial. 

When a free trial has expired, the organization displays a banner reading "TRIAL EXPIRED — Upgrade Required" in the top navigation bar:

![screenshot: the trial expiration banner](./images/org-inactive.png)

Organizations with expired trials return to the feature set of a free organization, but they retain any data created as part of paid features. Specifically:

- Teams other than `owners` are disabled, and users who don't belong to the `owners` team are locked out of the organization. Team membership and permissions are preserved, and are re-enabled on upgrade. 
- Sentinel policy checks are disabled. Existing policies and policy sets are preserved, and are re-enabled on upgrade. 
- Cost estimation is disabled.

