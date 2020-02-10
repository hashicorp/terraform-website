---
layout: "extend"
page_title: "HashiCorp Provider Design Principles - Guides"
sidebar_current: "docs-extend-hashicorp-provider-design-principles"
description: |-
  Design principles for officially maintained Terraform Providers.
---

# HashiCorp Provider Design Principles

Over time, the Terraform development community has gained large amounts of experience across a wide breadth of Application Programming Interfaces (APIs) supported by Terraform and its Software Development Kit (SDK). Recommended practices have emerged with designing the expected operator and maintainer experience. The principles below highlight the most prolific patterns when designing Terraform providers and associated resources, which guide HashiCorp design decisions.

## Providers should focus on a single API or SDK

A Terraform provider should manage a single collection of components based on the underlying API or SDK, even if that API creates components that require further management by other APIs or SDKs.

The benefits of this practice include:

- Simplyfing connectivity and authentication requirements for the provider
- Enabling composition of related or dependent systems in new and innovative ways
- Allowing maintainers to be experts in a single system or ecosystem.

## Resources should represent a single API object

A Terraform resource should be a declarative representation of single component, usually with create, read, delete, and optionally update methods. In general, abstractions of multiple components or advanced behaviors in Terraform should be accomplished via [Terraform Modules](/docs/modules/), potentially hosted in the [Terraform Registry](https://registry.terraform.io/).

The benefits of this practice include:

- Enabling composition of related or dependent components in new and innovative ways
- Maximizing predictability and minimizing blast radius of write/delete operations
- Preventing maintainer burden of managing multiple underlying components, which is not a native design pattern in the Terraform Plugin SDK.

## Resource and attribute schema should closely match the underlying API

A Terraform resource and associated schema should follow the naming and structure of the API, unless the it degrades the user experience or works in a way counter to a user's expectations of Terraform. In general, simplifications of an API in Terraform should be accomplished via [Terraform Modules](/docs/modules/), potentially hosted in the [Terraform Registry](https://registry.terraform.io/). Additional guidance can be found in the [resource and attribute naming guide](/docs/extend/best-practices/naming.html).

The benefits of this practice include:

- Allowing operators to easily convert from or utilize multiple tools that interact with the same API without learning Terraform-specific terminology or handling.
- Preventing unexpected naming collisions created by Terraform-specific abstractions and future API changes.
- Preventing maintainer burden of Terraform-specific abstractions.
- Easing partial or full code generation.
