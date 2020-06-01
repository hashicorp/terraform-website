---
layout: "cloud"
page_title: "Azure - Cost Estimation - Terraform Cloud"
---

# Supported Azure resources in Terraform Cloud Cost Estimation

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

Terraform Cloud can estimate monthly costs for many Azure Terraform resources.

-> **Note:** Terraform Enterprise requires Azure credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

Below is a list of resources that cost estimation supports so far. Resources that incur costs are marked as such; other resources do not have costs associated with them.

| Resource | Status |
| -- | -- |
| azurerm_managed_disk | incurs cost |
| azurerm_mariadb_server | incurs cost |
| azurerm_mssql_elasticpool | incurs cost |
| azurerm_mysql_server | incurs cost |
| azurerm_postgresql_server | incurs cost |
| azurerm_sql_database | incurs cost |
| azurerm_virtual_machine | incurs cost |
| azurerm_virtual_machine_scale_set | incurs cost |
| azurerm_mysql_database | |
| azurerm_network_security_group | |
| azurerm_postgresql_database | |
| azurerm_resource_group | |
| azurerm_sql_server | |
| azurerm_sql_virtual_network_rule | |
| azurerm_subnet | |
| azurerm_subnet_route_table_association | |
| azurerm_virtual_network | |
