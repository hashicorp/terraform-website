---
layout: "extend"
page_title: "Resources - Guides"
sidebar_current: "docs-extend-resources"
description: |-
  Resources are a key component to provider development. This guide covers using advanced resource APIs.
---

# Resources

A key component to Terraform Provider development is defining the creation, read, update, and deletion functionality of a resource to map those API operations into the Terraform lifecycle. While the basic aspects of developing Terraform resources have already been covered in [Writing Custom Providers](/docs/extend/writing-custom-providers.html) and [Schemas](/docs/extend/schemas/), this section covers more advanced features of resource development.

## Import

Many operators migrating to Terraform will have previously existing infrastructure they want to bring under the management of Terraform. Terraform allows resources to implement [Import Support](/docs/extend/resources/import.html) to begin managing those existing infrastructure components.

## Retries and Customizable Timeouts

The reality of cloud infrastructure is that it typically takes time to perform operations such as booting operating systems, discovering services, and replicating state across network edges. Terraform implements functionality to retry API requests or specificaly declare state change criteria, while allowing customizable timeouts for operators. More information can be found in the [Retries and Customizable Timeouts section](/docs/extend/resources/retries-and-customizable-timeouts.html).

## Customizing Differences

Terraform tracks the state of provisioned resources in its state file. The user passed configuration is compared against what is in the state file. When there is a detected discrepancy the user is presented with the difference of what is configured versus what is in state. Sometimes these scenarios require special handling, which is where [Customizing Differences](/docs/extend/resources/customizing-differences.html) can help.

## State Migrations

Resources define the data types and API interactions required to create, update, and destroy infrastructure with a cloud vendor while the [Terraform state](/docs/state/index.html) stores mapping and metadata information for those remote objects. There are several reasons why a resource implementation needs to change: backend APIs Terraform interacts with will change overtime, or the current implementation might be incorrect or unmaintainable. Some of these changes may not be backward compatible and a migration is needed for resources provisioned in the wild with old schema configurations. Terraform resources support migrating state values in these scenarios via [State Migration](/docs/extend/resources/state-migration.html).
