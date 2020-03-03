---
layout: "cloud"
page_title: "GCP - Cost Estimation - Terraform Cloud"
---

# Supported GCP resources in Terraform Cloud Cost Estimation

Terraform Cloud can estimate monthly costs for many GCP Terraform resources.

-> **Note:** Terraform Enterprise requires GCP credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

Below is a list of resources that cost estimation supports so far. Resources that incur costs are marked as such; other resources do not have costs associated with them.

| Resource | Status |
| -- | -- | -- |
| google_compute_disk | incurs cost |
| google_compute_instance | incurs cost |
| google_sql_database_instance | incurs cost |
| google_billing_account_iam_member | |
| google_compute_address | |
| google_compute_subnetwork_iam_member | |
| google_folder_iam_member | |
| google_folder_iam_policy | |
| google_kms_crypto_key_iam_member | |
| google_kms_key_ring_iam_member | |
| google_kms_key_ring_iam_policy | |
| google_organization_iam_member | |
| google_project | |
| google_project_iam_member | |
| google_project_iam_policy | |
| google_project_service | |
| google_pubsub_subscription_iam_member | |
| google_pubsub_subscription_iam_policy | |
| google_pubsub_topic_iam_member | |
| google_service_account | |
| google_service_account_iam_member | |
| google_service_account_key | |
| google_storage_bucket_iam_member | |
| google_storage_bucket_iam_policy | |