---
layout: "enterprise"
page_title: "Clustering Beta - Terraform Enterprise"
---

# Terraform Enterprise - Clustering Beta

~> **Please Note**: This software is a beta release. Some features may not yet be implemented, or may not work correctly. We are very interested in your feedback! Please contact your Technical Account Manager if you run into issues.

## About the Terraform Enterprise Clustering Beta

Current versions of Terraform Enterprise run on a single Linux instance (with an optional redundant standby node). In an upcoming release, we're changing Terraform Enterprise to use a new cluster-based architecture to provide horizontal scaling and high availability (HA).

This next-gen architecture is currently available as a beta, so customers can evaluate it against their scaling needs and give feedback. We do not yet recommend using the clustering beta in production.

## Before Deploying

Make sure you're familiar with the [pre-install checklist](../before-installing/index.html) before deploying Terraform Enterprise. You will not need to provision the required infrastructure ahead of time, but you should understand the differences between the operational modes.

Additionally, ensure you have your Terraform Enterprise license file before deploying.

## Beta Limitations

The clustering beta does not yet support all of Terraform Enterprise's installation options:

- Airgapped installation is not supported. The Linux instances must be able to download software from the internet during installation.
- Only the **demo** (all services and data are run and stored on the server) and **external services** (requires an external blob storage service (s3/gcs/etc) and postgres server) operational modes are supported.

We plan to add more installation options in future updates.

## Deployment Instructions

The clustering beta is deployed with a cloud-specific Terraform module, which provisions the necessary resources and automates installation and configuration.

This is a significant change for existing users of Terraform Enterprise, since the current version is deployed by running an executable installer after the instance is provisioned. Although an installer is still involved in new deployment process, we do not recommend using the installer directly; cluster management is complex, and a Terraform configuration makes it much easier to work with.

For full deployment instructions, choose your preferred cloud provider:

- [Amazon Web Services (aws)](./aws.html)
- [Google Cloud Platform (gcp)](./gcp.html)
- [Microsoft Azure (azure)](./azure.html)
