---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-home"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Extending Terraform

Terraform enables you to safely and predictably create, change, and improve
infrastructure. It is an open source tool that codifies infrastructure provider
APIs with the goal of enabling users to codify and provision any infrastructure.
Terraform can be extended to provision more infrastructure providers with
Providers, more infrastructure resources with Resources, and more options to
store Terraform state with Backends. Providers, Resources, and Backends are
collectively categorized as "Plugins".

~> This is an advanced section! If you are looking for information on using
Terraform with any of the existing Plugins, please refer to the
[Docs](/docs/index.html) section of this website.

The Extending Terraform section is filled with content for users who wish to
extend Terraform. The intended audience is anyone wanting to add or edit source
code (“developers”) for either Terraform itself, or a Terraform Plugin. The
content assumes you have basic operating knowledge or experience using
Terraform.

Below is a brief description of each section. The content is organized from
simplest to most complex — developers new to writing code for Terraform should
start at the top. 

## [How Terraform Works](/docs/extend/how-terraform-works.html)

High level overview of how the Terraform tool works. Learn about the logical
components of Terraform (Core vs. Plugins) and the basics of how they interact.

## [Plugin Types](/docs/extend/plugin-types.html)

Learn about the different types of Terraform plugins — Providers, Resources,
Backends. 

## [Writing Custom Providers](/docs/extend/writing-custom-providers.html)

A step by step guide for writing, compiling, and executing an example Terraform
Provider. 

## [Schemas](/docs/extend/schemas/index.html)

The Schema package is a high-level framework for easily writing Plugins for
Terraform. Providers, Resources, and Backends are all defined in terms of the
Schema package, which includes builtin types and methods for developers to use
when writing plugins. 

## [Community](/docs/extend/community/index.html)

Terraform is a mature project with a growing community. There are active,
dedicated people willing to help you through various mediums. 
