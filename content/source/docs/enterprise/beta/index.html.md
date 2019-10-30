---
layout: "enterprise"
page_title: "Terraform Enterprise - Clustering"
---

# Terraform Enterprise with Clustering

## About Terraform Enterprise with Clustering

Previous versions of Terraform Enterprise ran on a single Linux instance (with an optional redundant standby node). In the current release, Terraform Enterprise uses a cluster-based architecture to provide horizontal scaling and high availability (HA).

## Before Deploying

Make sure you're familiar with the [pre-install checklist](./before-installing/index.html) before deploying Terraform Enterprise. You will not need to provision the required infrastructure ahead of time, but you should understand the differences between the operational modes.

Additionally, ensure you have your Terraform Enterprise license file before deploying.

## Deployment Instructions

Terraform Enterprise with Clustering is deployed with a cloud-specific Terraform module, which provisions the necessary resources and automates installation and configuration.

For full deployment instructions, choose your preferred cloud provider:

- [Amazon Web Services (aws)](./install/aws.html)
- [Google Cloud Platform (gcp)](./install/gcp.html)
- [Microsoft Azure (azure)](./install/azure.html)
