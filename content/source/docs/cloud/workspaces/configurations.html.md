---
layout: "cloud"
page_title: "Terraform Configurations - Workspaces - Terraform Cloud"
---


# Terraform Configurations in Terraform Cloud Workspaces

[remote operations]: ../run/index.html
[remote backend]: /docs/backends/types/remote.html
[execution mode]: ./settings.html#execution-mode
[Terraform configuration]: /docs/configuration/index.html

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
