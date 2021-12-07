---
layout: "cloud"
page_title: "Adding Public Providers and Modules - Private Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Add providers and modules from the public Terraform Registry to your organization's private registry.
---

[vcs]: ../vcs/index.html

# Adding Public Providers and Modules to the Private Registry

You can add providers and modules from the public [Terraform Registry](/docs/registry/index.html) to your Terraform Cloud private registry. This lets you clearly designate which public providers and modules are recommended for the organization and makes their supporting documentation and examples centrally accessible.

-> **Note:** Public modules are not supported in Terraform Enterprise.
[permissions-citation]: #intentionally-unused---keep-for-maintainers

The private registry automatically synchronizes public providers and modules with their source on the Terraform Registry. The private registry handles downloads and controls access with Terraform Cloud API tokens, so consumers do not need access to the provider and module source repositories, even when they run Terraform from the command line.

All members of an organization can view and use public providers and modules, but only members of the [owners team](/docs/cloud/users-teams-organizations/permissions.html#organization-owners) can add them to the private registry. Owners can add providers and modules through the UI as detailed below or through the [Registry Providers API](/docs/cloud/api/providers.html) and the [Registry Modules API](../api/modules.html#create-a-module-with-no-vcs-connection-).

## Adding a Public Provider or Module

> **Hands-on:** Try the [Add Public Providers and Modules to your Private Registry](https://learn.hashicorp.com/tutorials/terraform/private-registry-add) tutorial and [Share Modules in the Private Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry?in=terraform/modules) tutorials on HashiCorp Learn.

To add a public provider or module:

1. Click **Registry** in the main navigation bar. The organization's private registry appears with a list of available providers and modules.

    ![Terraform Cloud screenshot: The "registry" button](./images/registry-button.png)

1. Click **Search public registry**. The **Public Registry Search** page appears.

    ![Terraform Cloud screenshot: the Search Public Modules page](./images/add-search-public-modules-providers.png)

1. Enter any combination of namespaces (e.g. hashicorp), and module or provider names into the search field. You can click **Providers** and **Modules** to toggle between lists of providers and modules that meet the search criteria.

1. Do one of the following to add a provider or module to your private registry:
    - Hover over the provider or module and click **+ Add**.
     ![Terraform Cloud screenshot: the "+ Add" button](./images/add-add-button.png)
    - Click the provider or module to view its details and then click **Add to Terraform Cloud**.
     ![Terraform Cloud screenshot: the "+ Add" button](./images/add-add-to-terraform-cloud-button.png)

1. Click **Add to organization** in the dialog box. Members of your organization can now  begin using it from the private registry.

## Removing a Public Provider or Module

Removing a public provider or module from a private registry does not remove it from the public Terraform Registry. Users in the organization will still be able to use the removed provider or module without changing their configurations.

To remove a public provider or module from an organization's private registry:

1. Click **Registry** in the main navigation bar. The organization's private registry appears with a list of available providers and modules.

1. Select the provider or module to view its details, open the **Manage for Organization** menu, and click **Remove from organization** (providers) or **Delete module** (modules).
   ![Terraform Cloud screenshot: the delete module button](./images/add-delete-module-button.png)

1. Enter the provider or module name in the dialog box to confirm and then click **Remove** (providers) or **Delete** (modules). The provider or module is removed from the organization's private registry.
