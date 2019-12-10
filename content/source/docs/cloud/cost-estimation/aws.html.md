---
layout: "cloud"
page_title: "AWS - Cost Estimation - Terraform Cloud"
---

# Supported AWS resources in Terraform Cloud Cost Estimation

Terraform Cloud can estimate monthly costs for many AWS Terraform resources.

-> **Note:** Terraform Enterprise requires AWS credentials to support cost estimation. These credentials are configured at the instance level, not the organization level. See the [Application Administration docs](/docs/enterprise/admin/integration.html) for more details.

Below is a list of resources that cost estimation supports so far. Resources that incur costs are marked as such; other resources do not have costs associated with them.

| Resource | Status |
| -- | -- | -- |
| aws_alb | incurs cost |
| aws_autoscaling_group | incurs cost |
| aws_cloudwatch_dashboard | incurs cost |
| aws_cloudwatch_metric_alarm | incurs cost |
| aws_db_instance | incurs cost |
| aws_ebs_volume | incurs cost |
| aws_elasticache_cluster | incurs cost |
| aws_elb | incurs cost |
| aws_instance | incurs cost |
| aws_lb | incurs cost |
| aws_rds_cluster | incurs cost |
| aws_acm_certificate_validation | |
| aws_alb_listener | |
| aws_alb_listener_rule | |
| aws_alb_target_group | |
| aws_alb_target_group_attachment | |
| aws_api_gateway_api_key | |
| aws_api_gateway_deployment | |
| aws_api_gateway_integration | |
| aws_api_gateway_integration_response | |
| aws_api_gateway_method | |
| aws_api_gateway_method_response | |
| aws_api_gateway_resource | |
| aws_api_gateway_usage_plan_key | |
| aws_appautoscaling_policy | |
| aws_appautoscaling_target | |
| aws_autoscaling_lifecycle_hook | |
| aws_autoscaling_policy | |
| aws_cloudformation_stack | |
| aws_cloudfront_origin_access_identity | |
| aws_cloudwatch_event_rule | |
| aws_cloudwatch_event_target | |
| aws_cloudwatch_log_group | |
| aws_cloudwatch_log_metric_filter | |
| aws_cloudwatch_log_stream | |
| aws_cloudwatch_log_subscription_filter | |
| aws_codebuild_webhook | |
| aws_codedeploy_deployment_group | |
| aws_config_config_rule | |
| aws_customer_gateway | |
| aws_db_parameter_group | |
| aws_db_subnet_group | |
| aws_dynamodb_table | |
| aws_dynamodb_table_item | |
| aws_ecr_lifecycle_policy | |
| aws_ecr_repository_policy | |
| aws_ecs_cluster | |
| aws_ecs_task_definition | |
| aws_efs_mount_target | |
| aws_eip_association | |
| aws_elastic_beanstalk_application | |
| aws_elastic_beanstalk_application_version | |
| aws_elastic_beanstalk_environment | |
| aws_elasticache_parameter_group | |
| aws_elasticache_subnet_group | |
| aws_flow_log | |
| aws_iam_access_key | |
| aws_iam_account_alias | |
| aws_iam_account_password_policy | |
| aws_iam_group | |
| aws_iam_group_membership | |
| aws_iam_group_policy | |
| aws_iam_group_policy_attachment | |
| aws_iam_instance_profile | |
| aws_iam_policy | |
| aws_iam_policy_attachment | |
| aws_iam_role | |
| aws_iam_role_policy | |
| aws_iam_role_policy_attachment | |
| aws_iam_saml_provider | |
| aws_iam_service_linked_role | |
| aws_iam_user | |
| aws_iam_user_group_membership | |
| aws_iam_user_login_profile | |
| aws_iam_user_policy | |
| aws_iam_user_policy_attachment | |
| aws_iam_user_ssh_key | |
| aws_internet_gateway | |
| aws_key_pair | |
| aws_lambda_alias | |
| aws_lambda_event_source_mapping | |
| aws_lambda_layer_version | |
| aws_lambda_permission | |
| aws_launch_configuration | |
| aws_lb_listener | |
| aws_lb_listener_rule | |
| aws_lb_target_group | |
| aws_lb_target_group_attachment | |
| aws_nat_gateway | |
| aws_network_acl | |
| aws_network_acl_rule | |
| aws_network_interface | |
| aws_placement_group | |
| aws_rds_cluster_parameter_group | |
| aws_route | |
| aws_route_table | |
| aws_route_table_association | |
| aws_route53_record | |
| aws_route53_zone_association | |
| aws_s3_bucket | |
| aws_s3_bucket_notification | |
| aws_s3_bucket_policy | |
| aws_s3_bucket_public_access_block | |
| aws_security_group | |
| aws_security_group_rule | |
| aws_service_discovery_service | |
| aws_sns_topic_subscription | |
| aws_sqs_queue_policy | |
| aws_ssm_maintenance_window | |
| aws_ssm_maintenance_window_target | |
| aws_ssm_maintenance_window_task | |
| aws_ssm_parameter | |
| aws_subnet | |
| aws_volume_attachment | |
| aws_vpc | |
| aws_vpc_dhcp_options | |
| aws_vpc_dhcp_options_association | |
| aws_vpc_endpoint | |
| aws_vpc_endpoint_route_table_association | |
| aws_vpc_endpoint_service | |
| aws_vpc_ipv4_cidr_block_association | |
| aws_vpc_peering_connection_accepter | |
| aws_vpc_peering_connection_options | |
| aws_vpn_connection_route | |
| aws_waf_ipset | |
| aws_waf_rule | |
| aws_waf_web_acl | |
