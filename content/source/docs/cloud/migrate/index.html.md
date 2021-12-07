---
layout: "cloud"
page_title: "Migrating to Terraform Cloud - Terraform Cloud and Terraform Enterprise"
description: |-
  Migrate state to Terraform Cloud to continue managing existing infrastructure without de-provisioning.
---

# Migrating to Terraform Cloud

You can begin using Terraform Cloud to manage existing resources without de-provisioning them. This requires migrating the Terraform [state files](/docs/language/state/index.html) for those resources to one or more Terraform Cloud workspaces. You can perform this migration with either the Terraform CLI or the Terraform Cloud API.

## Requirements

Stop all Terraform operations involving the state files before migrating them. You should also only migrate state files into Terraform Cloud workspaces that have never performed a run.


## CLI Migration

> **Hands-on:** Try the [Migrate State to Terraform Cloud](https://learn.hashicorp.com/tutorials/terraform/cloud-migrate?in=terraform/state) tutorial on HashiCorp Learn.

To migrate with the Terraform CLI, add the `cloud` block to your configuration, specify one or more Terraform Cloud workspaces for the state files, and run `terraform init`. If the workspaces you choose do not yet exist, Terraform Cloud creates them automatically in the specified organization.

The example below shows how you can map your CLI workspaces to Terraform Cloud workspaces that have a specific tag.

```
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      tags = ["networking"]
    }
  }
}
```

Refer to [Using Terraform Cloud](/docs/cli/cloud/index.html) in the Terraform CLI documentation for details about how to configure the `cloud` block and migrate state to one or more Terraform Cloud workspaces.

-> **Note:** The `cloud` block is available in Terraform v1.1 and later and Terraform Enterprise v202201 and later. Previous versions can use the [`remote` backend](/docs/language/settings/backends/remote.html) to configure the CLI workflow and migrate state.


## API Migration

You can use the Terraform Cloud API to automate migrating many state files at once.

This blog post contains an example of how to automate state migration with the API: [Migrating A Lot of State with Python and the Terraform Cloud API](https://medium.com/hashicorp-engineering/migrating-a-lot-of-state-with-python-and-the-terraform-cloud-api-997ec798cd11). The example uses the [Workspaces API](/docs/cloud/api/workspaces.html#create-a-workspace) to create the necessary workspaces in Terraform Cloud and the [State Versions API](../api/state-versions.html) to migrate the state files to those workspaces.