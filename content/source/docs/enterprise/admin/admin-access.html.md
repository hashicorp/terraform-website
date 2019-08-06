---
layout: "enterprise"
page_title: "Accessing Admin Pages - Application Administration - Terraform Enterprise"
---

# Accessing the Admin Interface

In Terraform Enterprise instances, the Terraform Cloud application includes an admin interface for managing general settings, systemwide integration settings, and accounts and resources.

Administration functions can be managed via user interface (as described by the pages in this section) or via the [Admin API](/docs/cloud/api/admin/index.html). Only Terraform Enterprise users with the site-admin permission can access the administrative functions.

The initial user account for a Terraform Enterprise instance is the first site admin. Site admins can grant admin permissions to other users in the "Users" section of the admin pages. See [Promoting a User to Administrator](./resources.html#promoting-a-user-to-administrator) for details.

To navigate to the site admin section of the UI, click your user icon in the upper right, then click **Site Admin**:

![screenshot: the "Site Admin" link in the user menu](./images/admin-navigate.png)

This will take you to the admin area. Currently, it defaults to showing the user management page; use the navigation on the left to access the other administrative functions.

![screenshot: the user management page, with the site administration navigation list on the left side](./images/admin-users.png)

## Administration Tasks

* [General settings](./general.html)
* [Service Integrations](./integration.html)
* [Managing Accounts and Resources](./resources.html)
