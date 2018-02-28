---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-enterprise-home"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Extending Terraform

Terraform enables you to safely and predictably create, change, and improve
infrastructure. It is an open source tool that codifies APIs, with the goal of
being extendable to provision any infrastructure for any application.

~> This is an advanced section! If you are looking for information on using
Terraform with any of the existing Providers or Plugins, please refer to the
[Docs](/docs/index.html) section of this website.

The Extending Terraform section is filled with content dedicated to those who
wish to extend Terraform. The intended audience is anyone wanting to add or edit
source code (“developers”) for either Terraform itself, or a Terraform Plugin.
The content assumes you have basic operating knowledge or experience with using
Terraform, and is under active development. 

Below is a brief description of each subsection, with the content being
organized in a progressive manner. Developers new to Terraform should start at
the top and work their way down. 

## How Terraform Works 

High level overview of how the Terraform tool works. Learn about the logical
components of Terraform (Core vs. Plugins) and the basics of how they interact. 

## Plugin Types

Terraform uses a plugin system to achieve its goals. Learn about the types of
plugins Terraform uses, and their responsibilities. 

## Writing a Custom Provider 

A step by step guide that walks you through writing, compiling, and executing an
example Terraform Provider. 

## Schemas

The Schema package is a high-level framework provided by Terraform Core for
easily writing Plugins for Terraform. Providers, Resources, and Backends are all
defined in terms of the Schema package, and it includes many builtin types and
methods for developers to use when writing plugins. 

## Community

Terraform is a mature project with a growing community. There are active,
dedicated people willing to help you through various mediums. 

~> This documentation is open source! To contribute to this documentation, or to
report an issue, please visit the [`hashicorp/terraform-website` GitHub
repository](https://github.com/hashicorp/terraform-website). 
