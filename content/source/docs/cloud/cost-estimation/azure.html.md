---
layout: "cloud"
page_title: "Azure - Cost Estimation - Terraform Cloud and Terraform Enterprise"
---

# Supported Azure resources in Terraform Cloud Cost Estimation

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

Terraform Cloud can estimate monthly costs for many Azure Terraform resources.

-> **Note:** Terraform Enterprise requires Azure credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

## Handled Resources

Below is a list of resources that cost estimation supports:

* azurerm_firewall
* azurerm_linux_virtual_machine
* azurerm_linux_virtual_machine_scale_set
* azurerm_managed_disk
* azurerm_mariadb_server
* azurerm_mssql_elasticpool
* azurerm_mysql_server
* azurerm_postgresql_server
* azurerm_sql_database
* azurerm_virtual_machine
* azurerm_virtual_machine_scale_set
* azurerm_windows_virtual_machine
* azurerm_windows_virtual_machine_scale_set
