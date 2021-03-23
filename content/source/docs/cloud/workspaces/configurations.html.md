---
layout: "cloud"
page_title: "Terraform Configurations - Workspaces - Terraform Cloud and Terraform Enterprise"
---


# Terraform Configurations in Terraform Cloud Workspaces

[remote operations]: ../run/index.html
[remote backend]: /docs/language/settings/backends/remote.html
[execution mode]: ./settings.html#execution-mode
[Terraform configuration]: /docs/language/index.html

Each Terraform Cloud workspace is associated with a particular [Terraform configuration][], which is expected to change and evolve over time.

Since every organization has its own preferred source code control practices, Terraform Cloud does not provide integrated version management. Instead, it expects Terraform configurations to be managed in your existing version control system (VCS).

In order to perform [remote Terraform runs][remote operations] for a given workspace, Terraform Cloud needs to periodically receive new versions of its configuration. Usually, this can be handled automatically by connecting a workspace to a VCS repository.

-> **Note:** If a workspace's [execution mode is set to local][execution mode], it doesn't require configuration versions, since Terraform Cloud won't perform runs for that workspace.

## Providing Configuration Versions

There are two ways to provide configuration versions for a workspace:

- **With a connected VCS repository.** Terraform Cloud can automatically fetch content from supported VCS providers, and uses webhooks to get notified of code changes. This is the most convenient way to use Terraform Cloud. See [The UI- and VCS-driven Run Workflow](../run/ui.html) for more information.

    A VCS connection can be configured [when a workspace is created](./creating.html), or later in its [version control settings](./vcs.html).

    -> **Note:** When a workspace is connected to a VCS repository, directly uploaded configuration versions can only be used for [speculative plans](../run/index.html#speculative-plans). This helps ensure your VCS remains the source of truth for all real infrastructure changes.

- **With direct uploads.** You can use a variety of tools to directly upload configuration content to Terraform Cloud:
    - **Terraform CLI:** With [the `remote` backend][remote backend] configured, the `terraform plan` and `terraform apply` commands will perform remote runs by uploading a configuration from a local working directory. See [The CLI-driven Run Workflow](../run/cli.html) for more information.
    - **API:** Terraform Cloud's API can accept configurations as `.tar.gz` files, which can be uploaded by a CI system or other workflow tools. See [The API-driven Run Workflow](../run/api.html) for more information.

    When configuration versions are provided via the CLI or API, Terraform Cloud can't automatically react to code changes in the underlying VCS repository.

## Code Organization and Repository Structure

### Organizing Separate Configurations

Most organizations either keep each Terraform configuration in a separate repository, or keep many Terraform configurations as separate directories in a single repository (often called a "monorepo").

Terraform Cloud works well with either approach, but monorepos require some extra configuration:

- Each workspace must [specify a Terraform working directory](./settings.html#terraform-working-directory), so Terraform Cloud knows which configuration to use.
- If the repository includes any shared Terraform modules, you must add those directories to the [automatic run triggering setting](./vcs.html#automatic-run-triggering) for any workspace that uses those modules.

-> **Note:** If your organization does not have a strong preference, we recommend using separate repositories for each configuration and using the private module registry to share modules. This allows for faster module development, since you don't have to update every configuration that consumes a module at the same time as the module itself.

### Organizing Multiple Environments for a Configuration

There are also a variety of ways to handle multiple environments. The most common approaches are:

- All environments use the same main branch, and environment differences are handled with Terraform variables. To protect production environments, wait to apply runs until their changes are verified in staging.
- Different environments use different long-lived VCS branches. To protect production environments, merge changes to the production branch after they have been verified in staging.
- Different environments use completely separate configurations, and shared behaviors are handled with shared Terraform modules. To protect production environments, verify new module versions in staging before updating the version used in production.

Terraform Cloud works well with all of these approaches. If you used long-lived branches, be sure to specify which branch to use in each workspace's VCS connection settings.
