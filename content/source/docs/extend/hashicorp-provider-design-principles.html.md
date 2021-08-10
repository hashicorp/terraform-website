---
layout: "extend"
page_title: "Provider Design Principles - Guides"
sidebar_current: "docs-extend-hashicorp-provider-design-principles"
description: |-
  Design principles for officially maintained Terraform Providers.
---

# Provider Design Principles

Over time, the Terraform development community has gained large amounts of experience across a wide breadth of Application Programming Interfaces (APIs) supported by Terraform and its Software Development Kit (SDK). Recommended practices have emerged with designing the expected operator and maintainer experience. The principles below highlight the most prolific patterns when designing Terraform providers and associated resources, which guide HashiCorp design decisions.

## Providers should focus on a single API or SDK

A Terraform provider should manage a single collection of components based on the underlying API or SDK, even if that API creates components that require further management by other APIs or SDKs.

The benefits of this practice include:

- Simplifying connectivity and authentication requirements for the provider
- Enabling composition of related or dependent systems in new and innovative ways
- Allowing maintainers to be experts in a single system or ecosystem.

## Resources should represent a single API object

A Terraform resource should be a declarative representation of single component, usually with create, read, delete, and optionally update methods. In general, abstractions of multiple components or advanced behaviors in Terraform should be accomplished via [Terraform Modules](/docs/language/modules/develop/index.html), potentially hosted in the [Terraform Registry](https://registry.terraform.io/).

The benefits of this practice include:

- Enabling composition of related or dependent components in new and innovative ways
- Maximizing predictability and minimizing blast radius of write/delete operations
- Preventing maintainer burden of managing multiple underlying components, which is not a native design pattern in the Terraform Plugin SDK.

## Resource and attribute schema should closely match the underlying API

A Terraform resource and associated schema should follow the naming and structure of the API, unless the it degrades the user experience or works in a way counter to a user's expectations of Terraform. Simplification of an API in Terraform should be accomplished via [Terraform Modules](/docs/language/modules/develop/index.html), potentially hosted in the [Terraform Registry](https://registry.terraform.io/). Additional guidance can be found in the [resource and attribute naming guide](/docs/extend/best-practices/naming.html).

The benefits of this practice include:

- Allowing operators to easily convert from or utilize multiple tools that interact with the same API without learning Terraform-specific terminology or handling.
- Preventing unexpected naming collisions created by Terraform-specific abstractions and future API changes.
- Preventing maintainer burden of Terraform-specific abstractions.
- Easing partial or full code generation.

Notes:

- Dates and times should always be modeled in RFC 3339 whenever possible
- Terraform does not support recursive types (but this can in some cases by modeled using a dynamic type)
- Boolean attributes should be oriented so that true means to do something and false means not to do it, sometimes this means inverting the API

## Resources should be importable

A Terraform resource should offer support for `terraform import`. Benefits include:

- Users are able to combine manual and automated provisioning and those operating in brownfield environments are able to still leverage the provider

## Consider state and versioning

As soon as a provider is released, users may have started managing their infrastructure with it. Care should be given to ensure state continuity is maintained and backwards compatible. When breaking changes need to occur, appropriate warning should be given to users using the plugin SDK's built-in mechanisms for deprecation and removal. In many cases this means maintaining both old and new names of resources and attributes.

Providers should follow [Semantic Versioning 2.0.0](https://semver.org/) in the context of user state and configurations. Code contracts and compatibility are not a concern in versioning. Breaking changes should increment the major version of the provider, backwards compatible resource and attribute additions should increment a minor version, and backwards compatible bug fixes should increment a patch version.
