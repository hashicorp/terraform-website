---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-plugin-types"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Terraform Plugin Types	

Terraform is logically split into two main parts: Terraform Core and Terraform
Plugins. Each plugin exposes an implementation for a specific service, such as
the AWS provider or bash provisioner. Terraform Plugins are written in Go and are
executable binaries executed as a separate process and communicate with the main
Terraform binary over an RPC interface. The network communication and RPC is
handled automatically by higher-level Terraform libraries, so developers need
only worry about the implementation of their specific Plugin behavior. 

There are two types of plugins supported by Terraform:

## Providers

Providers are the most common type of Plugin, which expose the features that a
specific service offers via its [application programming
interface](https://en.wikipedia.org/wiki/Application_programming_interface)
(API). Providers define **Resources** and are responsible for managing their
life cycles. Examples of providers are the [Amazon Web Service
Provider](/docs/providers/aws/index.html) or the [Google Cloud
Provider](/docs/providers/google/index.html). Example resources are
`aws_instance` and `google_compute_instance`. 

Terraform Providers contain all the code needed to authenticate and connect to a
service on behalf of the user. Each Resource implements `CREATE`, `READ`,
`UPDATE`, and `DELETE` (CRUD) methods to manage itself, while Terraform Core
manages a [Resource Graph](/docs/internals/graph.html) of all the resources
declared in the configuration as well as their current state. Resources remain
ignorant of the current state, only responding to method calls from Terraform
Core and performing the matching CRUD action. 

Terraform determines the Providers needed by reading and interpolating
configuration files. Terraform will dynamically discover and fetch the needed
providers from [releases.hashicorp.com](https://releases.hashicorp.com), or from
specific [locations on disk](/docs/extend/how-terraform-works.html#discovery).
At time of writing, the source code for all Providers distributed by HashiCorp
for automatic discovery are hosted on in the
[`terraform-providers` GitHub
Organization](https://github.com/terraform-providers). 

Visit the [Provider index](/docs/providers/index.html) in our documentation
section to learn more about our existing Providers.

## Provisioners

Provisioners are used to execute scripts on a local or remote machine as part of
resource creation or destruction. Provisioners can be used to bootstrap a
resource, cleanup before destroy, run configuration management, etc.

The official Terraform Provisioners are included in the Terraform Core codebase
and are compiled into the `terraform` binary. While they are built in,
Provisioners are still executed in a separate process over RPC, and benefit from
the same discovery process as Terraform Providers, making custom Provisioners
just as easy to create and use. 

Visit the [Provisioners index](/docs/provisioners/index.html) in our
documentation section to learn more about our existing Provisioners. 
