---
layout: "cloud"
page_title: "GCP - Cost Estimation - Terraform Cloud and Terraform Enterprise"
---

# Supported GCP resources in Terraform Cloud Cost Estimation

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

Terraform Cloud can estimate monthly costs for many GCP Terraform resources.

-> **Note:** Terraform Enterprise requires GCP credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

## Handled Resources

Below is a list of resources that cost estimation supports:

* google_compute_disk
* google_compute_instance
* google_sql_database_instance
