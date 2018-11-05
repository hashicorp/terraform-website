---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports"
---

# Defining Policies

Sentinel Policies for Terraform are defined using the [Sentinel policy
language](https://docs.hashicorp.com/sentinel/language/). A policy can include
[imports](https://docs.hashicorp.com/sentinel/concepts/imports) which enable a
policy to access reusable libraries, external data and functions. Terraform
Enterprise provides three imports to define policy rules for the configuration,
state and plan.

- [tfplan](./tfplan.html) - This provides access to a Terraform plan, the file created as a result of `terraform plan`.  The plan represents the changes that Terraform needs to make to infrastructure to reach the desired state represented by the configuration.
- [tfconfig](./tfconfig.html) - This provides access to a Terraform configuration, the set of "tf" files that are used to describe the desired infrastructure state.
- [tfstate](./tfstate.html) - This provides access to the Terraform state, the file used by Terraform to map real world resources to your configuration.

-> **Note:** Terraform Enterprise does not currently support custom imports.
