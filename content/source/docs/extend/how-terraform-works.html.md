---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-how-terraform-works"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---


# How Terraform Works 

Terraform is a tool for building, changing, and versioning
infrastructure safely and efficiently. Terraform is built on a plugin-based
architecture, enabling developers to extend Terraform by writing new plugins or
compiling modified versions of existing plugins in order to support new
functionality and new infrastructure providers.

Terraform is logically split into two main parts: Terraform Core, and Terraform
Plugins. Terraform Core uses remote procedure calls (RPC) to communicate with
Terraform Plugins, and offers multiple ways to discover and load plugins to use.

## Terraform Core 

Terraform Core is a statically-compiled binary written in the
Go programming language. The compiled binary is the command line tool (CLI)
`terraform`, the entrypoint for anyone using Terraform. The code is open source
and hosted at github.com/hashicorp/terraform. 

### The primary responsibilities of Terraform Core are:

- Infrastructure as code: reading and interpolating configuration files and
modules 
- Resource state management 
- Construction of the resource graph 
- Plan execution 
- Communication with plugins over RPC


## Terraform Plugins 

Terraform Plugins are written in Go and are executable binaries invoked by
Terraform Core over RPC. Each plugin exposes an implementation for a specific
service, such as AWS, or provisioner, such as bash. All Providers and
Provisioners used in Terraform configurations are plugins, and are executed as a
separate process and communicate with the main Terraform binary over an RPC
interface. Terraform has several Provisioners built-in, while Providers are
discovered dynamically as needed (See Discovery below). Terraform Core provides
a high-level framework that abstracts away the details of plugin discovery and
RPC communication so developers do not need to manage either.

Terraform Plugins are responsible for the domain specific implementation of
their type. 

### The primary responsibilities of Provider Plugins are:

- Initialization of any included libraries used to make API calls 
- Authentication with the Infrastructure Provider 
- Define Resources that map to specific Services

### The primary responsibilities of Provisioner Plugins are:

- Executing commands or scripts on the designated Resource after creation, or on
destruction. 

## Discovery 

The `terraform` CLI tool includes several provisioner plugins for immediate use.
It does not include any Providers, due to the large number of them and the
various supported versions. Terraform reads configuration files and installs the
needed Providers automatically from releases.hashicorp.com. At time of writing
Terraform can only automatically install Providers distributed by HashiCorp,
which are found on [releases.hashicorp.com](https://releases.hashicorp.com).

Third-party providers can be manually installed by placing their plugin
executables in one of the following locations depending on the host operating
system:

- On Windows, in the sub-path terraform.d/plugins beneath your user's "Application
Data" directory. 
- On all other systems, in the sub-path .terraform.d/plugins in
your user's home directory.

[`terraform init`](https://www.terraform.io/docs/commands/init.html) will search
this directory for additional plugins during plugin initialization.

The naming scheme for plugins is `terraform-<type>-NAME_vX.Y.Z`, where `type` is
either `provider` or `provisioner`. Terraform uses the `NAME` to understand the
name and version of a particular provider binary. Third-party plugins will often
be distributed with an appropriate filename already set in the distribution
archive so that it can be extracted directly into the plugin directory described
above.
