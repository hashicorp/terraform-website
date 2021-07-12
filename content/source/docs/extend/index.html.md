---
layout: "extend"
page_title: "Home - Building Terraform Providers"
description: |-
  Building Terraform Providersis a section for content dedicated to developing
  providers to extend Terraform's core offering.
---

# Building Terraform Providers

Terraform can be extended to allow users to manage more infrastructure providers with
[providers](/docs/providers/index.html)
(containing [resources](/docs/configuration/resources.html)
and/or [data sources](/docs/language/data-sources/index.html)). **Providers**
are a type of Terraform "plugin".

~> This is an advanced section! If you are looking for information on using
Terraform with any of the existing plugins, please refer to the
[Docs](/docs/index.html) section of this website.

The Building Terraform Providers section contains content for users who wish to
build their own providers. The intended audience is anyone wanting to add or
edit source code (“developers”) for a Terraform provider. The content assumes
you have basic operating knowledge or experience using Terraform.

Below is a brief description of each section. The content is organized from
simplest to most complex — developers new to writing code for Terraform should
start at the top.

## [How Terraform Works](/docs/extend/how-terraform-works.html)

High level overview of how the Terraform tool works. Learn about the logical
components of Terraform (Core vs. Plugins) and the basics of how they interact.

## [Plugin Types](/docs/extend/plugin-types.html)

Learn about Terraform plugins that you can develop using the Terraform Plugin SDK (currently only Providers).

## [Call APIs with Terraform Providers](https://learn.hashicorp.com/collections/terraform/providers?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS)

A collection of step by step tutorials for writing, compiling, and executing an
example Terraform Provider.

## [HashiCorp Provider Design Principles](/docs/extend/hashicorp-provider-design-principles.html)

Emergent practices learned by official Terraform Provider developers that can
guide design and decision making for all providers.

## [Schemas](/docs/extend/schemas/index.html)

The Schema package is a high-level framework for easily writing Plugins for
Terraform. Providers (with Resources and/or Data Sources)
are defined in terms of the Schema package, which includes builtin types
and methods for developers to use when writing plugins.

## [Resources](/docs/extend/resources/index.html)

The Resource package provides several utilities and conveniences for handling
tasks such as state migrations and customized difference behavior, these tasks
often come up during provider development as schemas must change and evolve over
time.

## [Best Practices](/docs/extend/best-practices/index.html)

The Best Practices section offers guides on techniques that range from the steps
required to deprecate schema attributes, to testing patterns,
and how to version and manage a provider changelog. These techniques were
learned through years of Terraform development from both HashiCorp employees
and Community members.

## [Testing](/docs/extend/testing/index.html)

Terraform provides a testing framework for validating resource implementations.
The Testing section provides a breakdown of how to compose these tests using
Test Cases and Test Steps, as well as covering unit test conventions and how
they apply to Terraform plugin development.

## [Community](/docs/extend/community/index.html)

Terraform is a mature project with a growing community. There are active,
dedicated people willing to help you through various mediums.
