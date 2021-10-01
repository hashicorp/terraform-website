---
layout: "cloud"
page_title: "Publishing Private Modules - Private Module Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  Learn to prepare private modules for publishing, add them to the registry, and release new versions.
---

[vcs]: ../vcs/index.html

# Publishing Modules to the Terraform Cloud Private Module Registry

> **Hands-on:** Try the [Share Modules in the Private Module Registry](https://learn.hashicorp.com/tutorials/terraform/module-private-registry-share) tutorial on HashiCorp Learn.

In addition to [adding modules from the Terraform Registry](./add.html), you can publish private modules to your Terraform Cloud private module registry.

Each organization has its own private module registry, and private modules are only available to members of the organization where you add them. In Terraform Enterprise, they are also available to organizations that are configured to [share modules](/docs/enterprise/admin/module-sharing.html) with that organization. The registry handles downloads and controls access with Terraform Cloud API tokens, so consumers don't need access to the module's source repository, even when running Terraform from the command line.


The private module registry uses your configured [Version Control System (VCS) integrations][vcs] and defers to your VCS provider for most management tasks. For example, your VCS provider handles new version releases. The only manual tasks are adding a new module and deleting module versions.

[permissions-citation]: #intentionally-unused---keep-for-maintainers


## Preparing a Module Repository

After you configure at least one [connection to a VCS provider][vcs], you can publish a new module by specifying a properly formatted VCS repository (details below). The registry automatically detects the rest of the information it needs, including the module's name and its available versions.

A module repository must meet all of the following requirements before you can add it to the registry:

- **Location and permissions:** The repository must be in one of
  your configured [VCS providers][vcs], and Terraform Cloud's VCS user account must have admin access to the repository. The registry needs admin access to create the webhooks to import new module versions. GitLab repositories must be in the main organization or group, and not in any subgroups.

- **Named `terraform-<PROVIDER>-<NAME>`:** Module repositories must use this
  three-part name format, where `<NAME>` reflects the type of infrastructure the
  module manages and `<PROVIDER>` is the main provider where it creates that
  infrastructure. The `<NAME>` segment can contain additional hyphens. Examples:
  `terraform-google-vault` or `terraform-aws-ec2-instance`.

- **Standard module structure:** The module must adhere to the
  [standard module structure](/docs/language/modules/develop/structure.html).
  This allows the registry to inspect your module and generate documentation,
  track resource usage, and more.

- **`x.y.z` tags for releases:** At least one release tag must be present for you to publish a module. The registry uses release tags to identify module
  versions. Release tag names must be a [semantic version](http://semver.org),
  which can optionally be prefixed with a `v`. For example, `v1.0.4` and `0.9.2`. The registry ignores tags that do not look like version numbers.

## Publishing a New Module

You need [owners team](/docs/cloud/users-teams-organizations/permissions.html#organization-owners) permissions to publish private modules to the private module registry. You can publish modules through the UI as shown below or with the [Registry Modules API](../api/modules.html). The API also supports publishing modules without a VCS repo as the source, which is not possible via the UI.

To publish a new module:

1. Click "Registry" in the main navigation bar. Then click "Publish" and select "Module" in the dropdown.

    ![Terraform Cloud screenshot: the "registry" button and the "+Add Module" button](./images/publish-add-button.png)

      The "Add Module" page appears with a list of available repositories.

      ![Terraform Cloud screenshot: the "add module" page, with a repository name entered](./images/publish-add-module.png)

2. Select the repository containing the module you want to publish.

    You can search the list by typing part or all of a repository name into the filter field. Remember that VCS providers use `<NAMESPACE>/<REPO NAME>` strings to locate repositories. The namespace is an organization name for most providers, but Bitbucket Server (not Bitbucket Cloud) uses project keys, like `INFRA`.

3. Click "Publish module".

    Terraform Cloud displays a loading page while it imports the module versions and then takes you to the new module's details page. On the details page, you can view available versions, read documentation, and copy a usage example.

      ![Terraform Cloud screenshot: a module details page](./images/publish-module-details.png)

## Releasing New Versions of a Module

To release a new version of a module, push a new release tag to its VCS repository. The registry will automatically import the new version.

Refer to [Preparing a Module Repository](#preparing-a-module-repository) for details about release tag requirements.

## Deleting Versions and Modules

You can delete individual versions of a module or entire modules. If a deletion would leave a module with no versions, Terraform Cloud will remove the entire module. To delete a module or version:

1. Navigate to the module's details page.
2. If you want to delete a single version, use the "Versions" dropdown to select it.
3. Click "Delete module".
4. Select the desired action from the dropdown:
   - **Delete only this module version:** Deletes only the version of the module you were viewing when you clicked "Delete module".
   - **Delete all versions for this provider for this module:** Deletes the entire module for a single provider. This is important if you have modules with the same name but with different providers. For example, if you have module repos named `terraform-aws-appserver` and `terraform-azure-appserver`, the registry treats them as alternate providers of the same `appserver` module.
   - **Delete all providers and versions for this module:** Deletes all modules with this name, even if they are from different providers. For example, both `terraform-aws-appserver` and `terraform-azure-appserver` would be deleted.

    ![Terraform Cloud screenshot: the deletion dialog](./images/publish-delete.png)

5. Type the module name and click "Delete".




### Restoring a Deleted Module or Version
Deletion is permanent, but there are ways to restore deleted modules and module versions.

- To restore a deleted module, re-add it as a new module.
- To restore a deleted version, either delete the corresponding tag from your VCS and push a new tag with the same name, or delete the entire module from the registry and re-add it.


## Sharing Modules Across Organizations

Terraform Cloud does not typically allow one organization's workspaces to use private modules from a different organization. This is because Terraform Cloud gives Terraform temporary credentials to access modules that are only valid for that workspace's organization. Although it is possible to mix modules from multiple organizations when you run Terraform on the command line, we strongly recommend against it.

Instead, you can share modules across organizations by sharing the underlying VCS repository. Grant each organization access to the module's repository, and then add the module to each organization's registry. When you push tags to publish new module versions, both organizations will update accordingly.

In Terraform Enterprise version 202012-1 and later, the site admin can configure [module sharing](/docs/enterprise/admin/module-sharing.html) to allow organizations to use private modules from other organizations.
