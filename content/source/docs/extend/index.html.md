---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-home"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Extending Terraform

Terraform can be extended to allow users to manage more infrastructure providers with
[Providers](/docs/providers/index.html)
(containing [Resources](/docs/configuration/resources.html)
and/or [Data Sources](/docs/configuration/data-sources.html)),
more options to store Terraform state with [Backends](/docs/backends)
and more options to provision instance with
[Provisioners](/docs/provisioners/index.html). **Providers**
and **Provisioners** are collectively categorized as "Plugins".

~> This is an advanced section! If you are looking for information on using
Terraform with any of the existing Plugins, please refer to the
[Docs](/docs/index.html) section of this website.

The Extending Terraform section contains content for users who wish to
extend Terraform. The intended audience is anyone wanting to add or edit source
code (“developers”) for either Terraform itself or a Terraform Plugin. The
content assumes you have basic operating knowledge or experience using
Terraform.

Below is a brief description of each section. The content is organized from
simplest to most complex — developers new to writing code for Terraform should
start at the top. 

## [How Terraform Works](/docs/extend/how-terraform-works.html)

High level overview of how the Terraform tool works. Learn about the logical
components of Terraform (Core vs. Plugins) and the basics of how they interact.

## [Plugin Types](/docs/extend/plugin-types.html)

Learn about the different types of Terraform plugins — Providers and Provisioners.

## [Writing Custom Providers](/docs/extend/writing-custom-providers.html)

A step by step guide for writing, compiling, and executing an example Terraform
Provider. 

## [Schemas](/docs/extend/schemas/index.html)

The Schema package is a high-level framework for easily writing Plugins for
Terraform. Providers (with Resources and/or Data Sources), and Provisioners
are all defined in terms of the Schema package, which includes builtin types
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
