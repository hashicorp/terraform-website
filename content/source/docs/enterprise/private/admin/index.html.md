---
layout: "enterprise2"
page_title: "Admin - Private Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-administration"
---

# Administering Private Terraform Enterprise

Private Terraform Enterprise (PTFE) is software provided to customers that allows full use of Terraform Enterprise in a private, isolated environment.

Administration of a PTFE instance has two main domains:

- Installation, upgrades, and operational tasks like backups and monitoring, which take place outside the Terraform Enterprise application.
- Administrative tasks and configuration within the application itself.

This section is about in-application administration, including general settings, systemwide integration settings, and management of accounts and resources. Administration functions can be managed via user interface (the focus of this guide) or via the [Admin API](../api/admin/index.html).

## Accessing the Admin Interface

Only Private Terraform Enterprise users with the site-admin permission can access the administrative functions. To view, search, and update settings in the UI, click your user icon in the upper right:

(screenshot)

which will take you to the admin area. Currently, it defaults to showing the user management page. 

(screenshot of admin pages)

## Administration Tasks

* [General settings](./general.html)
* [Integration Settings](./integrations.html)
* [Managing Accounts and Resources](./resources.html)