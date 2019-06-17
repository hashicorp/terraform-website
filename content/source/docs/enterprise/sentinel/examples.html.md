---
layout: enterprise2
page_title: "Example Policies - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-examples"
---

# Example Policies

This page lists some example Sentinel policies. These examples are not exhaustive, but they demonstrate some of the most common use cases of Sentinel with Terraform Enterprise. For more examples, see the [Governance section of the Terraform Guides repository](https://github.com/hashicorp/terraform-guides/tree/master/governance).  

~> **Important:** These examples are a demonstration of Sentinel's features. They should not be used verbatim in your Terraform Enterprise organization. Make sure you fully understand the intent and behavior of a policy before relying on it in production.

### Amazon Web Services

* [Enforce owner allow list on `aws_ami` data source](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/aws/enforce-ami-owners.sentinel)
* [Enforce mandatory tags on instances](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/aws/enforce-mandatory-tags.sentinel)
* [Restrict availability zones](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/aws/restrict-aws-availability-zones.sentinel)
* [Disallow 0.0.0.0/0 CIDR blocks](https://github.com/hashicorp/terraform-guides/blob/master/governance/second-generation/aws/restrict-ingress-sg-rule-cidr-blocks.sentinel)
* [Restrict instance types of EC2 instances](https://github.com/hashicorp/terraform-guides/blob/master/governance/second-generation/aws/restrict-ec2-instance-type.sentinel)
* [Require VPCs to be tagged and have DNS hostnames enabled](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/aws/aws-vpcs-must-have-tags-and-enable-dns-hostnames.sentinel)


### Microsoft Azure

* [Restrict VM images](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/azure/restrict-vm-image-id.sentinel)
* [Restrict the size of Azure VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/second-generation/azure/restrict-vm-size.sentinel)
* [Enforce limits on AKS clusters](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/azure/aks-cluster-policy.sentinel)

### Google Cloud Platform

* [Disallow 0.0.0.0/0 CIDR blocks](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/gcp/block-allow-all-cidr.sentinel)
* [Enforce limits on a GKE cluster](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/gcp/gke-cluster-policy.sentinel)
* [Restrict machine type of Virtual Machine instances](https://github.com/hashicorp/terraform-guides/blob/master/governance/second-generation/gcp/restrict-gce-machine-type.sentinel)

### VMware

* [Require Storage DRS to be enabled](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/vmware/require-storage-drs.sentinel)
* [Restrict virtual disk size](https://github.com/hashicorp/terraform-guides/blob/master/governance/second-generation/vmware/restrict-vm-disk-size.sentinel)
* [Restrict VM CPU count and memory](https://github.com/hashicorp/terraform-guides/blob/master/governance/second-generation/vmware/restrict-vm-cpu-and-memory.sentinel)
* [Enforce NFS 4.1 and Kerberos](https://github.com/hashicorp/terraform-guides/blob/master/governance/first-generation/vmware/require_nfs41_and_kerberos.sentinel)
