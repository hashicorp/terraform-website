---
layout: "enterprise2"
page_title: "Using Private Modules - Private Module Registry - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-registry-using"
---

# Using Modules from the Terraform Enterprise Private Module Registry

~> **Note:** Currently, the private module registry is only enabled on private installs of TFE using Bitbucket Server as the VCS provider. Support for the SaaS version of TFE and other VCS providers is coming in a future update.

By design, the private module registry works much like the [public Terraform Registry](/docs/registry/index.html). If you're already familiar with the public registry, here are the main differences:

- Use TFE's web UI to browse and search for modules.
- In Terraform configurations, add TFE's hostname as a prefix to the module identifier. For example:

    ```hcl
    module "vpc" {
      source  = "atlas.hashicorp.com/example_corp/vpc/aws"
      version = "1.0.4"
    }
    ```
- The second part of the source string (the namespace) is your TFE organization. The module in the example above is loaded from the `example_corp` organization.
- TFE can automatically access your private modules during Terraform runs. However, if you're running Terraform on the command line, you must configure credentials in your [CLI configuration file (`.terraformrc`)](/docs/commands/cli-config.html).

## Finding Modules

All users in your organization can view your private module registry.

To see which modules are available, click the "Modules" button in TFE's main navigation bar.

![TFE screenshot: Navigation bar with modules button highlighted](./images/using-modules-button.png)

This brings you to the modules page, which lists all available modules.

![TFE screenshot: the list of available modules](./images/using-modules-list.png)

You can browse the complete list, or shrink the list by searching or filtering.

- The "Providers" drop-down filters the list to show only modules for the selected provider.
- The search field searches by keyword. This only searches the titles of modules, not READMEs or resource details.

### Viewing Module Details and Versions

Click a module's "Details" button to view its details page. Use the "Versions" dropdown in the upper right to switch between the available versions, and use the Readme/Inputs/Outputs/Dependencies/Resources tabs to view detailed documentation and information about a version.

![TFE screenshot: a module details page](./images/publish-module-details.png)

## Using Modules in Terraform Configurations

In Terraform configurations, you can use any private module from your organization's registry. The syntax for referencing private modules in `source` attributes is `<TFE HOSTNAME>/<TFE ORGANIZATION>/<MODULE NAME>/<PROVIDER>`.

```hcl
module "vpc" {
  source  = "atlas.hashicorp.com/example_corp/vpc/aws"
  version = "1.0.4"
}
```

If you're using the SaaS version of TFE, the hostname is `atlas.hashicorp.com`; private installs have their own hostnames. The second part of the source string (the namespace) is the name of your TFE organization.

For more details on using modules in Terraform configurations, see ["Using Modules" in the Terraform docs.](/docs/modules/usage.html)

### Usage Examples and the Configuration Designer

Each registry page for a module version includes a usage example, which you can copy and paste to get started.

Alternately, you can use the configuration designer, which lets you select multiple modules and fill in their variables to build a much more useful initial configuration. See [the configuration designer docs](./design.html) for details.

## Running Configurations with Private Modules

### In Terraform Enterprise

TFE can use your private modules during plans and applies with no extra configuration, _as long as the workspace is configured to use Terraform 0.11 or higher._

Note that you can only use private modules from your own organization's registry. If you need to share modules across organizations, do so at the VCS repository level — share access to the backing repository, and add the module to each organization's registry.

### On the Command Line

If you're using Terraform 0.11 or higher, you can use private modules when applying configurations on the CLI. However, you must provide a valid TFE API token to access private modules.

To configure private module access, add a `credentials` block to your [CLI configuration file (`.terraformrc`)](/docs/commands/cli-config.html).

``` hcl
credentials "atlas.hashicorp.com" {
  token = "xxxxxx.atlasv1.zzzzzzzzzzzzz"
}
```

The block label for the `credentials` block must be TFE's hostname (either `atlas.hashicorp.com` or the hostname of your private install), and the block body must contain a `token` attribute whose value is a TFE authentication token. You can generate a personal API token from your user settings page in TFE.

~> **Important:** When adding an authentication token to your CLI config file, check the file permissions and make sure other users on the same computer cannot view its contents.

