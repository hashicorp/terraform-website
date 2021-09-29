---
layout: "cloud"
page_title: "Adding Public Modules - Private Module Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Learn to add public modules from the public Terraform Registry to your organization's private module registry.  
---

[vcs]: ../vcs/index.html

# Adding Public Modules to the Terraform Cloud Private Module Registry

> **Hands-on:** Try the [Add Public Modules to your Private Module Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry-add?in=terraform/modules&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

You can add modules from the public [Terraform Registry](/docs/registry/index.html) to your Terraform Cloud private module registry. Once added, Terraform Cloud automatically synchronizes public modules with their source on the Terraform Registry. The private module registry handles downloads and controls access with Terraform Cloud API tokens, so consumers don't need access to the module's source repository, even when they run Terraform from the command line.

All members of an organization can view and use public modules, but you need [owners team](/docs/cloud/users-teams-organizations/permissions.html#organization-owners) permissions to add them to the private module registry. Owners can add modules through the UI as shown below or through the [Registry Modules API](../api/modules.html#create-a-module-with-no-vcs-connection-).

-> **Note:** Public modules are not supported in Terraform Enterprise.
[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Adding a Public Module

1. Click "Registry" in the main navigation bar to go to your organization's module registry and then click "Find public modules".

    ![Terraform Cloud screenshot: the "registry" button and the "find public modules" button](./images/add-find-button.png)

    The Search Public Modules page appears.
2. Enter any combination of namespaces (e.g. hashicorp), module names, and provider names to find public modules.


3. Do one of the following to add the module to your private module registry:
     - Hover over the module and click "+ Add" (shown below). 
     - Click the module to view its details and then click "Add to Terraform Cloud".

![Terraform Cloud screenshot: the "+ Add" button](./images/add-add-button.png)

4. Click "Add to organization" in the dialog box. The module is now included in the private module registry's list of available public modules, and members of your organization can begin using it.
## Deleting a Public Module

Deleting a public module from a private module registry does not remove it from the Terraform Registry. To delete a public module from your organization's module registry:

1. Select the module to view its details, open the "Manage Module for Organization" dropdown menu, and click  "Delete module".

2. Enter the module name in the dialog box to confirm and then click "Delete."
     ![Terraform Cloud screenshot: the delete module button](./images/add-delete-module-button.png)
