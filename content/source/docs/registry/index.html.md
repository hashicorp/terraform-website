---
layout: "registry"
page_title: "Terraform Registry Publishing"
sidebar_current: "docs-registry-home"
description: |-
  The Terraform Registry is a repository of providers and modules written by the Terraform community.
---

# Terraform Registry Publishing

The [Terraform Registry](https://registry.terraform.io) is an interactive resource for discovering a wide selection of integrations (providers) and configuration packages (modules) for use with Terraform. The Registry includes solutions developed by HashiCorp, third-party vendors, and our Terraform community. Our goal with the Registry is to provide plugins to manage any infrastructure API, pre-made modules to quickly configure common infrastructure components, and examples of how to write quality Terraform code.

![screenshot: terraform registry landing page](./images/registry1.png)

The Terraform Registry is integrated [directly into Terraform](/docs/language/providers/requirements.html) so you can directly specify providers and modules. Anyone can publish and consume providers and modules on the public [Terraform Registry](https://registry.terraform.io). (To publish private modules within your organization, you can use a [private registry](/docs/registry/private.html) or [reference repositories and other sources directly](/docs/language/modules/sources.html).)

Use the navigation to the left to learn more about using the Terraform Registry.

## Navigating the Registry

The registry has a number of different categories for both modules and providers to help with navigating the large number of available options. Select a provider or module card to learn more, filter results to a [specific tier](./providers/index.html#provider-tiers-amp-namespaces), or use the search field at the top of the Registry to find what you’re looking for. (Note that search supports keyboard navigation.)

![screenshot: terraform registry browse](./images/registry2.png)

## User Account

Anyone interested in publishing a provider or module can create an account and sign in to the Terraform Registry using a GitHub account. Click the "Sign-in" button, and follow the login prompts. Once you have authorized the use of your GitHub account and are signed in, you can publish both providers and modules directly from one of the repositories you manage. To learn more, see [Publishing to the Registry](/docs/registry/providers/publishing.html).

![screenshot: terraform registry sign in](./images/user-account.png)

## Getting Help

Providers and modules available from the Terraform Registry are maintained either directly by HashiCorp, by trusted HashiCorp partners, or by members of the Terraform community ([see tiers & namespaces](./providers/index.html#provider-tiers-amp-namespaces)). Issues and contributions for a specific provider or module can be created via GitHub by selecting the "Report an issue" link on the detail view:

![Provider report issue link](./images/registry-issue.png)

If you have general questions or issues about using the Terraform Registry, you may [submit a request](mailto:terraform-registry@hashicorp.com). Note that there is currently a delay in response times, and we are unable to guarantee a response to all requests. If you are a HashiCorp Technology Partner, our Alliances team will get back to you with a timeline.
