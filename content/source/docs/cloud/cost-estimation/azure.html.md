---
layout: "cloud"
page_title: "Azure - Cost Estimation - Terraform Cloud"
---

# Supported Azure resources in Terraform Cloud Cost Estimation

Cost estimation support for Azure allows you to expose and control many terraform resources within Azure. Adding Azure credenitals for cost estimation in Terraform Enterprise is found in the [Application Administration docs](/docs/enterprise/admin/integration.html).

Below is a list of resources that cost estimation supports so far. Resources that incur costs are marked as `IC`. Resources marked `DNI` do not have costs associated with them.

| Resource | Status |
| -- | -- | -- |
| azurerm_virtual_machine | IC |
| azurerm_sql_virtual_network_rule | DNI |