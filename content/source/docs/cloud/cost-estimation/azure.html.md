---
layout: "cloud"
page_title: "Azure - Cost Estimation - Terraform Cloud"
---

# Supported Azure resources in Terraform Cloud Cost Estimation

Terraform Cloud can estimate monthly costs for many Azure Terraform resources.

-> **Note:** Terraform Enterprise requires Azure credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

Below is a list of resources that cost estimation supports so far. Resources that incur costs are marked as such; other resources do not have costs associated with them.

| Resource | Status |
| -- | -- |
| azurerm_managed_disk | IC |
| azurerm_virtual_machine | IC |
| azurerm_virtual_machine_scale_set | IC |
| azurerm_network_security_group | DNI |
| azurerm_resource_group | DNI |
| azurerm_sql_virtual_network_rule | DNI |
| azurerm_subnet | DNI |
| azurerm_subnet_route_table_association | DNI |
| azurerm_virtual_network | DNI |
