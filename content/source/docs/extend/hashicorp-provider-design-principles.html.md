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

- Giving operators the most flexibility for composing their environments as varying team structures may have differing expertise, impose permission limitations, or otherwise have separate automation desires.
- Assuring operators there are no additional networking access requirements for individual resources, which may not be possible when they are configured with networking restrictions to the underlying component.
- Allowing maintainers to be experts in a single system or ecosystem.

## Resources should represent a single API object/mapping/event

A Terraform resource should be a declarative representation of single component, usually with Create, Read, Delete, and sometimes Update methods. In general, abstractions of multiple components in Terraform should be accomplished via [Terraform Modules](/docs/modules/), potentially hosted in the [Terraform Registry](https://registry.terraform.io/).

The benefits of this practice include:

- Giving operators the most flexibility for composing their environments as varying team structures may impose permission limitations or automation desires.
- Assuring operators that there are no unexpected interactions between multiple API components.
- Preventing maintainer burden of managing multiple underlying components, which is not a native design pattern in the Terraform Plugin SDK.

## Resources and attributes should closely match underlying API naming

A Terraform resource and associated schema should follow the naming and structure of the API, unless the user experience is impractical. In general, simplifications of an API in Terraform should be accomplished via [Terraform Modules](/docs/modules/), potentially hosted in the [Terraform Registry](https://registry.terraform.io/). Additional guidance can be found in the [resource and attribute naming guide](/docs/extend/best-practices/naming.html).

The benefits of this practice include:

- Allowing operators to easily convert from or utilize multiple tools that interact with the same API without learning Terraform-specific terminology or handling.
- Preventing unexpected naming collisions created by Terraform-specific abstractions and future API changes.
- Preventing maintainer burden of Terraform-specific abstractions.
- Easing partial or full code generation.
