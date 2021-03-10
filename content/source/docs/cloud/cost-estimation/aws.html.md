---
layout: "cloud"
page_title: "AWS - Cost Estimation - Terraform Cloud and Terraform Enterprise"
---

# Supported AWS resources in Terraform Cloud Cost Estimation

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

Terraform Cloud can estimate monthly costs for many AWS Terraform resources.

-> **Note:** Terraform Enterprise requires AWS credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

## Handled Resources

Below is a list of resources that cost estimation supports:

* aws_alb
* aws_autoscaling_group
* aws_cloudhsm_v2_hsm
* aws_cloudwatch_dashboard
* aws_cloudwatch_metric_alarm
* aws_db_instance
* aws_dynamodb_table
* aws_ebs_volume
* aws_elasticache_cluster
* aws_elasticsearch_domain
* aws_elb
* aws_instance
* aws_kms_key
* aws_lb
* aws_rds_cluster
