---
layout: "cloud"
page_title: "Azure - Cost Estimation - Terraform Cloud"
---

# Supported Azure resources in Terraform Cloud Cost Estimation

Terraform Cloud can estimate monthly costs for many Azure Terraform resources.

-> **Note:** Terraform Enterprise requires Azure credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

Below is a list of resources that cost estimation supports so far. Resources that incur costs are marked as `IC`. Resources marked `DNI` do not have costs associated with them.

| Resource | Status |
| -- | -- | -- |
| azurerm_virtual_machine | IC |
| azurerm_sql_virtual_network_rule | DNI |