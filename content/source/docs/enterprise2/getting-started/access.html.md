---
layout: "enterprise"
page_title: "Accessing TFE Beta - Getting Started - Terraform Enterprise Beta"
---

# Accessing Terraform Enterprise Beta

The Terraform Enterprise beta is a rewritten version of TFE, and you can't currently use it with your existing TFE data and configurations. To start testing TFE v2, you must:

- Make sure you have a TFE account.
- Contact HashiCorp sales to request access to the TFE beta.
- Manually navigate to TFE v2.
- Create a new organization for working with TFE v2.

## Creating a TFE Account

If you don't already have a TFE account, you must create one. You can use the same user account to access TFE classic and TFE beta, although you'll use separate organizations.

[Click here to request a free trial of TFE][signup], or contact HashiCorp sales to purchase a TFE subscription.

[signup]: https://www.hashicorp.com/products/terraform/?utm_source=oss&utm_medium=header-nav&utm_campaign=terraform&_ga=2.40850658.1512399790.1504740058-931972891.1498668200#terraform-contact-form

## Getting Accepted into the Beta Program

This beta program is currently by invitation only. User accounts that aren't on the beta list cannot navigate to the beta version of TFE.

To participate, please contact HashiCorp sales.

TODO: get details from product when this is solidified. Likely there'll be a web form.


## Navigating to TFE Beta

To access TFE beta, you must manually navigate to the following URL:

<https://atlas.hashicorp.com/v2>

At a later date, when the beta version is more mature, we will add a discoverable link in the TFE navigation menu.

## Creating an Organization

After you've navigated to TFE beta, you will be prompted to create a new organization. Enter a name (distinct from your main TFE organization) and an admin email address at the prompt:

![TFE's new organization prompt](./images/new_organization.png)

TFE beta cannot currently import settings and workspaces from an existing TFE classic organization. We will enable migration from TFE classic at a later date, when the beta version is more mature.

For more information about organizations, see [the TFE docs about users, teams, and organizations.](TODO)

## Next Steps

After you have a TFE v2 organization, you can start [configuring version control access, users, and teams.](./TODO)

