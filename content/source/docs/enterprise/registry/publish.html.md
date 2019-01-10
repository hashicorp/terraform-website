---
layout: "enterprise2"
page_title: "Publishing Private Modules - Private Module Registry - Terraform Enterprise"
sidebar_current: "docs-enterprise2-registry-publish"
---

[vcs]: ../vcs/index.html

# Publishing Modules to the Terraform Enterprise Private Module Registry

-> **Note:** Currently, the private module registry works with all supported VCS providers except Bitbucket Cloud; however, the private module registry does not support [GitLab subgroups](https://about.gitlab.com/features/subgroups/).

Terraform Enterprise (TFE)'s private module registry lets you publish Terraform modules to be consumed by users across your organization. It works much like the public [Terraform Registry](/docs/registry/index.html), except that it uses your configured [VCS integrations][vcs] instead of requiring public GitHub repositories.

Only members of the "owners" team can publish new modules. Once a module is published, the ability to release new versions is managed by your VCS provider.

-> **API:** See the [Registry Modules API](../api/modules.html). Note that the API also supports publishing modules without using a VCS repo as the source, which is not possible via the UI.

## Workflow Summary

The private module registry is designed to be be as automatic as possible, so it defers to your VCS provider for most management tasks. The only manual tasks are adding a new module and deleting versions.

After configuring at least one [connection to a VCS provider][vcs], you can publish a new module by specifying a properly formatted VCS repository (one module per repo, with an expected name and tag format; see below for details). The registry automatically detects the rest of the information it needs, including the module's name and its available versions.

To release a new version of an existing module, push a new tag to its repo. The registry updates automatically.

Consumers of a module don't need access to its source repository, even when running Terraform from the command line; the registry handles downloads, and uses TFE's API tokens to control access.

## Preparing a Module Repository

Since the registry relies on VCS repositories for most of its data, you must ensure your module repositories are in a format it can understand. A module repository must meet all of the following requirements before you can add it to the registry:

- **Available in a connected VCS provider.** The repository must be in one of
your configured [VCS providers][vcs], and TFE's VCS user account must have admin
access to the repository. (Since the registry uses webhooks to import new module
versions, it needs admin access to create those webhooks.) For GitLab, the repository
must be in the main organization or group, not in any subgroups.

- **One module per repository.** The registry cannot use combined repositories
with multiple modules.

- **Named `terraform-<PROVIDER>-<NAME>`.** Module repositories must use this
three-part name format, where `<NAME>` reflects the type of infrastructure the
module manages and `<PROVIDER>` is the main provider where it creates that
infrastructure. The `<NAME>` segment can contain additional hyphens. Examples:
`terraform-google-vault` or `terraform-aws-ec2-instance`.

- **Standard module structure.** The module must adhere to the
[standard module structure](/docs/modules/create.html#standard-module-structure).
This allows the registry to inspect your module and generate documentation,
track resource usage, and more.

- **`x.y.z` tags for releases.** The registry uses tags to identify module
versions. Release tag names must be a [semantic version](http://semver.org),
which can optionally be prefixed with a `v`. For example, `v1.0.4` and `0.9.2`.
To publish a module initially, at least one release tag must be present. Tags
that don't look like version numbers are ignored.

## Publishing a New Module

To publish a module, navigate to the modules list with the "Modules" button and click the "+ Add Module" button in the upper right.

![TFE screenshot: the "modules" button and the "+Add Module" button](./images/publish-add-button.png)

This brings you to the "Add a New Module" page, which has a text field and at least one VCS provider button.

![TFE screenshot: the "add a new module" page, with a repository name entered](./images/publish-add-module.png)

If you have multiple VCS providers configured, use the buttons to select one. In the text field, enter the name of the repository for the module you're adding. Then click the "Publish Module" button.

~> **Note:** The name you type into the repo field will usually be something like `hashicorp/terraform-aws-vpc` or `INFRA/terraform-azure-appserver`. Module repo names use a `terraform-<PROVIDER>-<NAME>` format, and VCS providers use `<NAMESPACE>/<REPO NAME>` strings to locate repositories. (For most providers the namespace is an organization name, but Bitbucket Server uses project keys, like `INFRA`.)

TFE will display a loading page while it imports the module versions from version control, and will then take you to the new module's details page. On the details page you can view available versions, read documentation, and copy a usage example.

![TFE screenshot: the module loading page](./images/publish-loading.png)

![TFE screenshot: a module details page](./images/publish-module-details.png)

## Releasing New Versions of a Module

To release a new version of a module, push a new version tag to its VCS repository. The registry will automatically import the new version.

Version tags must be a [semantic version](http://semver.org), which can optionally be prefixed with a `v`. For example, `v1.0.4` and `0.9.2`.

## Deleting Versions and Modules

Each module's details page includes a "Delete Module 🗑" button, which can delete individual versions of a module or entire modules.

~> **Important:** Use caution; deletion can't be undone. However, you can restore a deleted module by re-adding it as a new module. You can also restore a deleted version by deleting the corresponding tag from VCS and pushing a new tag with the same name, or by deleting the whole module from the registry and re-adding it.

To delete a module or version:

1. Navigate to the module's details page.
2. If you only want to delete a single version, use the "Versions" drop-down to select it.
3. Click the "Delete Module 🗑" button.
4. Select the desired action from the drop-down and confirm with the "Delete" button.
    - "Delete only this module version" affects the version of the module you were viewing when you clicked delete.
    - The other two options are only different if you have modules with the same name but different providers. (For example, if you have module repos named `terraform-aws-appserver` and `terraform-azure-appserver`, the registry treats them as alternate providers of the same `appserver` module.) If you use multi-provider modules like this, the "Delete all providers and versions for this module" option can delete multiple modules.

~> **Note:** If a deletion would leave a module with no versions, the module will be automatically deleted.

![TFE screenshot: the deletion dialog](./images/publish-delete.png)

## Sharing Modules Across Organizations

In normal operation, TFE doesn't allow one organization's workspaces to use private modules from a different organization. (When TFE runs Terraform, it provides temporary credentials that are only valid for the workspace's organization, and uses those credentials to access modules.) And although it's possible to mix modules from multiple organizations when running Terraform on the command line, we strongly recommend against it.

However, you can easily share modules across organizations by sharing the underlying VCS repository. Grant each organization access to the module's repo, then add the module to each organization's registry. When you push tags to publish new module versions, both organizations will update appropriately.
