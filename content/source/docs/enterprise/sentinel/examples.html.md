---
layout: enterprise2
page_title: "Example Policies - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-examples"
---

# Example Policies

This page lists some example Sentinel policies. These examples are not exhaustive, but they demonstrate some of the most common use cases of Sentinel with Terraform Enterprise. For more examples, see the [Terraform Guides Governance repository](https://github.com/hashicorp/terraform-guides/tree/master/governance).  

~> **Important:** These examples are a demonstration of Sentinel's features. They should not be used verbatim in your Terraform Enterprise organization. Make sure you fully understand the intent and behavior of a policy before relying on it in production.

### Amazon Web Services

* [Enforce owner allow list on `aws_ami` data source](https://github.com/hashicorp/terraform-guides/blob/master/governance/aws/enforce-ami-owners.sentinel)
* [Enforce mandatory tags on instances](https://github.com/hashicorp/terraform-guides/blob/master/governance/aws/enforce-mandatory-tags.sentinel)
* [Restrict availability zones](https://github.com/hashicorp/terraform-guides/blob/master/governance/aws/restrict-aws-availability-zones.sentinel)
* [Disallow CIDR blocks](https://github.com/hashicorp/terraform-guides/blob/master/governance/aws/restrict-aws-cidr-blocks.sentinel)
* [Restrict the type of instance to be provisioned](https://github.com/hashicorp/terraform-guides/blob/master/governance/aws/restrict-aws-instance-type.sentinel)
* [Require VPCs to be tagged and have DNS hostnames enabled](https://github.com/hashicorp/terraform-guides/blob/master/governance/aws/aws-vpcs-must-have-tags-and-enable-dns-hostnames.sentinel)


### Microsoft Azure

* [Restrict VM images](https://github.com/hashicorp/terraform-guides/blob/master/governance/azure/restrict-vm-image-id.sentinel)
* [Restrict the type of VM to be provisioned](https://github.com/hashicorp/terraform-guides/blob/master/governance/azure/restrict-vm-size.sentinel)
* [Enforce limits on an ACS cluster](https://github.com/hashicorp/terraform-guides/blob/master/governance/azure/acs-cluster-policy.sentinel)
* [Enforce limits on an AKS cluster](https://github.com/hashicorp/terraform-guides/blob/master/governance/azure/aks-cluster-policy.sentinel)

### Google Cloud Platform

* [Disallow CIDR blocks](https://github.com/hashicorp/terraform-guides/blob/master/governance/gcp/block-allow-all-cidr.sentinel)
* [Enforce limits on a GKE cluster](https://github.com/hashicorp/terraform-guides/blob/master/governance/gcp/gke-cluster-policy.sentinel)
* [Restrict the type of machine to be provisioned](https://github.com/hashicorp/terraform-guides/blob/master/governance/gcp/restrict-machine-type.sentinel)

### VMware

* [Require Storage DRS to be enabled](https://github.com/hashicorp/terraform-guides/blob/master/governance/vmware/require-storage-drs.sentinel)
* [Restrict virtual disk size and type](https://github.com/hashicorp/terraform-guides/blob/master/governance/vmware/restrict-virtual-disk-size-and-type.sentinel)
* [Restrict VM CPU count and memory](https://github.com/hashicorp/terraform-guides/blob/master/governance/vmware/restrict-vm-cpu-and-memory.sentinel)
* [Enforce NFS 4.1 and Kerberos](https://github.com/hashicorp/terraform-guides/blob/master/governance/vmware/require_nfs41_and_kerberos.sentinel)
