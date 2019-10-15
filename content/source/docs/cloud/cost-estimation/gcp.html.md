---
layout: "cloud"
page_title: "GCP - Cost Estimation - Terraform Cloud"
---

# Supported GCP resources in Terraform Cloud Cost Estimation

Cost Estimation support for GCP allows you to expose and control many terraform resources within GCP. Setup for GCP credenitals in Cost Estimation in Terraform Enterprise is found in the [Application Administration docs](/docs/enterprise/admin/integration.html).

Resources that incurr costs are marked as `IC`. Resources marked `DNI` do not have costs associated with them.

| Resource | Status |
| -- | -- | -- |
| google_compute_disk | IC |
| google_compute_instance | IC |
| google_sql_database_instance | IC |
| google_billing_account_iam_member | DNI |
| google_compute_address | DNI |
| google_compute_subnetwork_iam_member | DNI |
| google_folder_iam_member | DNI |
| google_folder_iam_policy | DNI |
| google_kms_crypto_key_iam_member | DNI |
| google_kms_key_ring_iam_member | DNI |
| google_kms_key_ring_iam_policy | DNI |
| google_organization_iam_member | DNI |
| google_project | DNI |
| google_project_iam_member | DNI |
| google_project_iam_policy | DNI |
| google_project_service | DNI |
| google_pubsub_subscription_iam_member | DNI |
| google_pubsub_subscription_iam_policy | DNI |
| google_pubsub_topic_iam_member | DNI |
| google_service_account | DNI |
| google_service_account_iam_member | DNI |
| google_service_account_key | DNI |
| google_storage_bucket_iam_member | DNI |
| google_storage_bucket_iam_policy | DNI |