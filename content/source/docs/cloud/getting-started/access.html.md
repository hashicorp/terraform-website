---
layout: "cloud"
page_title: "Accessing Terraform Cloud - Getting Started - Terraform Cloud"
---

# Accessing Terraform Cloud

To start using Terraform Cloud, you need a **Terraform Cloud account** and an **organization.**

## Terraform Cloud Accounts

[signup]: https://app.terraform.io/signup/account
[app]: https://app.terraform.io

Terraform Cloud accounts are always free.

- To make an account on the SaaS version of Terraform Cloud, [sign up here][signup].
- If your organization uses Terraform Enterprise, ask your IT or operations staff how to get an account. You might need to create an account manually, or you might need to sign in with your organization's single sign-on system.

If you already have a Terraform Cloud account, you can sign in at [https://app.terraform.io][app].

## Terraform Cloud Organizations

[organizations]: ../users-teams-organizations/organizations.html

[Organizations][] are shared spaces for teams to collaborate on infrastructure. Almost every task in Terraform Cloud happens within the context of an organization, and a user can join multiple organizations.

### Joining an Existing Organization

If you are joining an existing team of Terraform Cloud users, they already have an organization. They'll need to add you to their organization before you can collaborate with them on provisioning tasks.

Organization membership is managed by _organization owners._ Your new teammates should be able to tell you who your organization's owners are. Contact an owner, tell them your Terraform Cloud username, and ask them to add you to one or more teams.

Once you've been added to an organization, navigate to Terraform Cloud's front page at:

- [app.terraform.io](https://app.terraform.io) if you've using for the SaaS version of Terraform Cloud.
- The hostname of your private instance if you're using Terraform Enterprise.

Your organization should be available in the organization switcher menu at the left side of the top navigation bar.

If you are joining a company that uses Terraform Enterprise with SAML single sign-on, you might have been automatically added to your organization. Contact your IT or operations staff to find out more.

### Creating an Organization

If you're not joining an existing team of Terraform Cloud users, you will need to create an organization before you can perform any provisioning tasks.

You can create a Terraform Cloud organization for free. Later, you can add additional users to the organization, purchase upgrades to make more features available in the organization, and more.

In your web browser, go to:

- [app.terraform.io](https://app.terraform.io) if you've using for the SaaS version of Terraform Cloud.
- The hostname of your private instance if you're using Terraform Enterprise.

After you've navigated to Terraform Cloud, it will prompt you to create a new organization. Enter a name and an admin email address at the prompt:

![Terraform Cloud's new organization prompt](../users-teams-organizations/images/org-new.png)

### Adding Other Users to an Organization

To collaborate with your colleagues in Terraform Cloud, you'll all need access to the same organization. You can add users to an organization by adding users to a _team._ Free organizations only have a single team; paid organizations can create multiple teams to divide responsibilities and manage access to resources.

To add teammates, navigate to the settings page for your organization — you can reach it from the "Settings" link found at the top of every page. Once there, click the "Teams" link in the sidebar navigation.

The list of teams starts with just one team, named "owners." You can add users to this team, or, if you have a paid organization, you can create a new team by entering a name (like "core-infrastructure") and clicking the "Create team" button. This will take you to the new team's settings page:

![adding members to a team](../users-teams-organizations/images/teams-team-settings.png)

Add as many users as you'd like by typing their Terraform Cloud username in the text field and clicking "Add member". Added users won't receive a notification, but your organization will be available the next time they access Terraform Cloud.

Team membership is how Terraform Cloud controls access to workspaces. Later, you can create more teams and assign them different permissions on a per-workspace basis. For more information, see [Teams](../users-teams-organizations/teams.html).

## Next Steps

After you've created an organization, you should [configure version control access.](./vcs.html)

