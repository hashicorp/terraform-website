---
layout: "cloud"
page_title: "Example Policies - Policies - Terraform Cloud and Terraform Enterprise"
---

# Example Policies

-> **Note:** Terraform policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

> **Hands-on:** Try the [Enforce Policy with Sentinel](https://learn.hashicorp.com/collections/terraform/policy?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) collection on HashiCorp Learn.

This page lists some example policies. These examples are not exhaustive, but they demonstrate some of the most common use cases of policies with Terraform Cloud. For more examples, see the [Governance section of the hashicorp/terraform-guides repository](https://github.com/hashicorp/terraform-guides/tree/master/governance/third-generation).

~> **Important:** These examples are a demonstration of the Sentinel policy language and its features. They should not be used verbatim in your Terraform Cloud organization. Make sure you fully understand the intent and behavior of a policy before relying on it in production.

### Amazon Web Services

* [Restrict owners of the `aws_ami` data source](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/restrict-ami-owners.sentinel)
* [Enforce mandatory tags on taggable AWS resources](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/enforce-mandatory-tags.sentinel)
* [Restrict availability zones used by EC2 instances](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/restrict-availability-zones.sentinel)
* [Disallow 0.0.0.0/0 CIDR block in security groups](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/restrict-ingress-sg-rule-cidr-blocks.sentinel)
* [Restrict instance types of EC2 instances](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/restrict-ec2-instance-type.sentinel)
* [Require S3 buckets to be private and encrypted by KMS keys](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/require-private-acl-and-kms-for-s3-buckets.sentinel)
* [Require VPCs to have DNS hostnames enabled](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/aws/require-dns-support-for-vpcs.sentinel)

### Microsoft Azure

* [Enforce mandatory tags of VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/azure/enforce-mandatory-tags.sentinel)
* [Restrict publishers of VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/azure/restrict-vm-publisher.sentinel)
* [Restrict VM images](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/azure/restrict-vm-image-id.sentinel)
* [Restrict the size of Azure VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/azure/restrict-vm-size.sentinel)
* [Enforce limits on AKS clusters](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/azure/restrict-aks-clusters.sentinel)
* [Restict CIDR blocks of security groups](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/azure/restrict-source-address-prefixes.sentinel)

### Google Cloud Platform

* [Enforce mandatory labels on VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/gcp/enforce-mandatory-labels.sentinel)
* [Disallow 0.0.0.0/0 CIDR block in network firewalls](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/gcp/restrict-firewall-source-ranges.sentinel)
* [Enforce limits on GKE clusters](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/gcp/restrict-gke-clusters.sentinel)
* [Restrict machine type of VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/gcp/restrict-gce-machine-type.sentinel)

### VMware

* [Require Storage DRS on datastore clusters](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/vmware/require-storage-drs.sentinel)
* [Restrict size and type of virtual disks](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/vmware/restrict-virtual-disk-size-and-type.sentinel)
* [Restrict CPU count and memory of VMs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/vmware/restrict-vm-cpu-and-memory.sentinel)
* [Restrict size of VM disks](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/vmware/restrict-vm-disk-size.sentinel)
* [Require NFS 4.1 and Kerberos on NAS datastores](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/vmware/require_nfs41_and_kerberos.sentinel)

### Cloud-Agnostic

* [Allowed providers](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/allowed-providers.sentinel)
* [Prohibited providers](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/prohibited-providers.sentinel)
* [Limit proposed monthly costs](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/limit-proposed-monthly-cost.sentinel)
* [Prevent providers in non-root modules](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/prevent-non-root-providers.sentinel)
* [Require all modules have version constraints](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/require-all-modules-have-version-constraint.sentinel)
* [Require all resources be created in modules in a private module registry](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/require-all-resources-from-pmr.sentinel)
* [Use most recent versions of modules in a private module registry](https://github.com/hashicorp/terraform-guides/blob/master/governance/third-generation/cloud-agnostic/http-examples/use-latest-module-versions.sentinel)

Note that the last policy illustrates how to use Sentinel's [http import](https://docs.hashicorp.com/sentinel/imports/http) to send an HTTP request to an API endpoint (Terraform Cloud's own API in this case).

-> **Note:** We've also developed a number of first-class foundational policies to work out-of-the-box with Amazon Web Services, Microsoft Azure and Google Cloud Platform. These policies are based on several [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/). Check out the library of [Terraform Foundational Policies](https://github.com/hashicorp/terraform-foundational-policies-library) written by HashiCorp to get up and running with your next [Policy Set](./manage-policies.html#policies-and-policy-sets).
