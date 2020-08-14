---
layout: "cloud"
page_title: "Using Private Modules - Private Module Registry - Terraform Cloud and Terraform Enterprise"
---

# Using Modules from the Terraform Cloud Private Module Registry

> For a hands-on tutorial, try the [Use Terraform Modules](https://learn.hashicorp.com/terraform/modules/using-modules?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) guide on HashiCorp Learn.

By design, Terraform Cloud's private module registry works much like the [public Terraform Registry](/docs/registry/index.html). If you're already familiar with the public registry, here are the main differences:

- Use Terraform Cloud's web UI to browse and search for modules.
- Module `source` strings are slightly different. The public registry uses a three-part `<NAMESPACE>/<MODULE NAME>/<PROVIDER>` format, and private modules use a four-part `<HOSTNAME>/<ORGANIZATION>/<MODULE NAME>/<PROVIDER>` format. For example, to load a module from the `example_corp` organization on the SaaS version of Terraform Cloud:

    ```hcl
    module "vpc" {
      source  = "app.terraform.io/example_corp/vpc/aws"
      version = "1.0.4"
    }
    ```
- Terraform Cloud can automatically access your private modules during Terraform runs. However, when running Terraform on the command line, you must configure a `credentials` block in your [CLI configuration file (`.terraformrc`)](/docs/commands/cli-config.html). See below for the [credentials format](#on-the-command-line).

## Finding Modules

All users in your organization can view your private module registry.

To see which modules are available, click the "Modules" button in Terraform Cloud's main navigation bar.

![Terraform Cloud screenshot: Navigation bar with modules button highlighted](./images/using-modules-button.png)

This brings you to the modules page, which lists all available modules.

![Terraform Cloud screenshot: the list of available modules](./images/using-modules-list.png)

You can browse the complete list, or shrink the list by searching or filtering.

- The "Providers" drop-down filters the list to show only modules for the selected provider.
- The search field searches by keyword. This only searches the titles of modules, not READMEs or resource details.

### Viewing Module Details and Versions

Click a module's "Details" button to view its details page. Use the "Versions" dropdown in the upper right to switch between the available versions, and use the Readme/Inputs/Outputs/Dependencies/Resources tabs to view detailed documentation and information about a version.

![Terraform Cloud screenshot: a module details page](./images/publish-module-details.png)

## Using Private Modules in Terraform Configurations

In Terraform configurations, you can use any private module from your organization's registry. The syntax for referencing private modules in `source` attributes is `<HOSTNAME>/<ORGANIZATION>/<MODULE NAME>/<PROVIDER>`.

```hcl
module "vpc" {
  source  = "app.terraform.io/example_corp/vpc/aws"
  version = "1.0.4"
}
```

If you're using the SaaS version of Terraform Cloud, the hostname is `app.terraform.io`; Terraform Enterprise instances have their own hostnames. The second part of the source string (the namespace) is the name of your organization.

For more details on using modules in Terraform configurations, see ["Configuration Language: Modules"](/docs/configuration/modules.html) in the Terraform docs.

### Usage Examples and the Configuration Designer

Each registry page for a module version includes a usage example, which you can copy and paste to get started.

Alternately, you can use the configuration designer, which lets you select multiple modules and fill in their variables to build a much more useful initial configuration. See [the configuration designer docs](./design.html) for details.

### The Generic Module Hostname (`localterraform.com`)

Optionally, you can use the generic hostname `localterraform.com` in module sources instead of the literal hostname of a Terraform Enterprise instance. When Terraform is executed on a Terraform Enterprise instance, it automatically requests any `localterraform.com` modules from that instance.

For example:

```hcl
module "vpc" {
  source  = "localterraform.com/example_corp/vpc/aws"
  version = "1.0.4"
}
```

Configurations that reference modules via the generic hostname can be used without modification on any Terraform Enterprise instance, which is not possible when using hardcoded hostnames.

~> **Important:** `localterraform.com` only works within a Terraform Enterprise instance — when run outside of Terraform Enterprise, Terraform can only use private modules with a literal hostname. To test configurations on a developer workstation without the remote backend configured, you must replace the generic hostname with a literal hostname in any module sources, then change them back before committing to VCS. We are working on ways to make this smoother in the future; in the meantime, we only recommend `localterraform.com` for large organizations that use multiple Terraform Enterprise instances.

## Running Configurations with Private Modules

### In Terraform Cloud

Terraform Cloud can use your private modules during plans and applies with no extra configuration, _as long as the workspace is configured to use Terraform 0.11 or higher._

A given workspace can only use private modules from the organization it belongs to. If you want to use the same module in multiple organizations, you should add it to both organizations' registries. (See [Sharing Modules Across Organizations](./publish.html#sharing-modules-across-organizations).)

### On the Command Line

If you're using Terraform 0.11 or higher, you can use private modules when applying configurations on the CLI. To do this, you must provide a valid [Terraform Cloud API token](../users-teams-organizations/users.html#api-tokens).

#### Permissions

When you authenticate with a user token, you can access modules from any organization you are a member of. (A user is a member of an organization if they belong to any team in that organization.)

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Within a given Terraform configuration, you should only use modules from one organization. Mixing modules from different organizations might work on the CLI with your user token, but it will make your configuration difficult or impossible to collaborate with. If you want to use the same module in multiple organizations, you should add it to both organizations' registries. (See [Sharing Modules Across Organizations](./publish.html#sharing-modules-across-organizations).)

#### Configuration

To configure private module access, you need to authenticate against Terraform Cloud (or your Terraform Enterprise instance).  If you're using Terraform 0.12.21 or later, you can use the `terraform login` command. Alternatively, you can create a [user API token][user-token] and [manually configure credentials in the CLI config file][cli-credentials].

Make sure the hostname matches the hostname you use in module sources — if the same Terraform Cloud server is available at two hostnames, Terraform doesn't have any way to know that they're the same. If you need to support multiple hostnames for module sources, use the `terraform login` command multiple times, specifying the hostname each time.

[user-token]: ../users-teams-organizations/users.html#api-tokens
[cli-credentials]: /docs/commands/cli-config.html#credentials
