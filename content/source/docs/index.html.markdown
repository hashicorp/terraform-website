---
layout: "docs-frontpage"
page_title: "Documentation"
sidebar_current: "docs-frontpage"
description: |-
  A brief map of the documentation for Terraform CLI, Terraform Enterprise, the
  Terraform GitHub Actions, and the rest of the Terraform ecosystem.
---

# Terraform Documentation

Welcome to the Terraform documentation!

There are a lot of things a user of Terraform might need to know about. To help you manage this information, we've divided the Terraform docs into several sections.

You can navigate the docs via this index page, or you can jump from section to section using the "Other Docs" area of the navigation sidebar, available in most areas of this site.

<div class="container-fluid"><div class="row">

<div class="col-md-6 col-sm-12">

### [Terraform Glossary](/docs/glossary.html)

Definitions (and helpful links) for technical terms used throughout Terraform's documentation, help text, and UI. Visit the glossary whenever you get lost.

### [Terraform CLI](/docs/cli-index.html)

-> Intermediate and advanced users spend most of their time here.

Documentation for Terraform's core functionality, including:

- [Terraform's configuration language](/docs/configuration/index.html)
- [The `terraform` binary and its subcommands](/docs/commands/index.html)
- [The main Terraform providers](/docs/providers/index.html)

...and much more.

### [Terraform Enterprise](/docs/enterprise/index.html)

Documentation for Terraform Enterprise.

Terraform Enterprise is a supplementary paid product that makes it easier for teams to manage infrastructure together. It provides a way to share access to sensitive data, a consistent and reliable environment for Terraform runs, access controls for approving changes to infrastructure, a private registry for sharing Terraform modules, detailed policy controls for governing the contents of Terraform configurations, and more.

### [Introduction to Terraform](/intro/index.html)

-> Visitors who are curious about Terraform can start here.

A broad overview of what Terraform is and why people use it.

### [Learn Terraform](https://learn.hashicorp.com/terraform/) (➡︎ external site)

-> New users can start here.

Interactive guides to teach you how to use Terraform's features. Begin with the [Getting Started guide](https://learn.hashicorp.com/terraform/getting-started/install.html), then continue with task-specific advanced guides or go directly to the [Terraform CLI docs](/docs/cli-index.html).

</div>






<div class="col-md-6 col-sm-12">

### [Guides and Whitepapers](/guides/index.html)

-> Intermediate users can go here for a deeper understanding of what's possible with Terraform.

Detailed descriptions of various Terraform workflows, both general and specific. This includes things like:

- [The end-to-end loop of making infrastructure changes with Terraform](/guides/core-workflow.html)
- [The long-term process of evolving provisioning practices in a large organization](/docs/enterprise/guides/recommended-practices/index.html)
- [Tasks for upgrading to major new Terraform versions](/upgrade-guides/index.html)

This section is devoted to overviews and explanations of complex systems; the goal isn't to teach you how to accomplish a particular task (like the guides at [Learn Terraform](https://learn.hashicorp.com/terraform/)), but to explain best practices and show how the different pieces of a workflow fit together.

### [Terraform Registry](/docs/registry/index.html)

Documentation about the [Terraform Registry](https://registry.terraform.io/), a web service for distributing Terraform modules. Includes information about publishing, finding, and using modules.

### [Terraform GitHub Actions](/docs/github-actions/index.html)

Documentation about the Terraform GitHub Actions. [GitHub Actions](https://developer.github.com/actions) is GitHub's service for running commands in reaction to events in a Git repository, and HashiCorp publishes several actions for validating repositories that contain Terraform configurations.

### [Extending Terraform](/docs/extend/index.html)

-> If you need to create a new Terraform provider (for a public cloud service or a purely internal service), go here.

Documentation about developing Terraform providers, with extensive information about Terraform's internals.

Terraform relies on provider plugins to manage infrastructure resources across a wide variety of infrastructure services. Anyone can make and distribute a Terraform provider for their own service.

</div>

</div></div>
