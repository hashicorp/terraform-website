---
layout: "cloud"
page_title: "Azure - Cost Estimation - Terraform Cloud and Terraform Enterprise"
---

# Supported Azure resources in Terraform Cloud Cost Estimation

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

Terraform Cloud can estimate monthly costs for many Azure Terraform resources.

-> **Note:** Terraform Enterprise requires Azure credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

## Handled Resources

Below is a list of resources that cost estimation supports:

* azurerm_app_service_custom_hostname_binding
* azurerm_app_service_environment
* azurerm_app_service_plan
* azurerm_app_service_virtual_network_swift_connection
* azurerm_cosmosdb_sql_database
* azurerm_databricks_workspace
* azurerm_firewall
* azurerm_hdinsight_hadoop_cluster
* azurerm_hdinsight_hbase_cluster
* azurerm_hdinsight_interactive_query_cluster
* azurerm_hdinsight_kafka_cluster
* azurerm_hdinsight_spark_cluster
* azurerm_integration_service_environment
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
