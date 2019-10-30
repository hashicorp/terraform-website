---
layout: "enterprise"
page_title: "Pre-Install Checklist - Before Installing - Terraform Enterprise - Clustering"
---

# Terraform Enterprise Pre-Install Checklist

Before installing Terraform Enterprise, you'll need to have prepared your cloud according to the documentation for your cloud:

- [Amazon Web Services (aws)](../install/aws.html)
- [Google Cloud Platform (gcp)](../install/gcp.html)
- [Microsoft Azure (azure)](../install/azure.html)

## Summary

Prepare all of the following before installing:

1. **Credentials:** Ensure you have a Terraform Enterprise license and a TLS certificate for Terraform Enterprise to use.
2. **Operational mode decision:** Decide how Terraform Enterprise should store its data: in discrete external services, or on a plain mounted disk.
3. **Data storage:** Prepare data storage services.

## Credentials

* TLS private key and certificate
    * The installer allows for using a certificate signed by a public or private CA. If you do not use a trusted certificate, your VCS provider will likely reject that certificate when sending webhooks. The key and X.509 certificate should both be PEM (base64) encoded.
* License file (provided by HashiCorp)

~> **Important:** If you use a certificate issued by a private Certificate
   Authority, you must provide the certificate for that CA in the
   `Certificate Authority (CA) Bundle` section of the installation. This allows services
   running within Terraform Enterprise to access each other properly.
   See [Installation: Trusting SSL/TLS Certificates](../install/installer.html#trusting-ssl-tls-certificates)
   for more on this.

## Operational Mode Decision

Terraform Enterprise can store its state in a few different ways, and you'll
need to decide which works best for your installation. Each option has a
different approach to
[recovering from failures](../system-overview/reliability-availability.html#recovery-from-failures-1)
and should be selected based on your organization's preferences.

~> **Important:** Make this decision before you begin installation, because some modes have additional preflight requirements.
The operational mode is selected at install time and cannot be changed once Terraform Enterprise is running.

1. **Production - External Services** - This mode stores the 
   stateful data used by the instance in an external PostgreSQL database and
   an external S3-compatible endpoint or Azure blob storage. There is still critical data
   stored on the instance that must be managed with snapshots. Be sure to
   check the [PostgreSQL Requirements](./postgres-requirements.html) for information that
   needs to be present for Terraform Enterprise to work. This option is best
   for users with expertise managing PostgreSQL or users that have access
   to managed PostgreSQL offerings like [AWS RDS](https://aws.amazon.com/rds/).
1. **Demo** - This mode stores all data on the instance. This option is best for initial
   installation and testing, and is not recommended or supported for true production use.

## Data Storage

Make sure your data storage services or device meet Terraform Enterprise's requirements. These requirements differ based on operational mode:

- **External services:**
    - [PostgreSQL Requirements](./postgres-requirements.html)
    - Any S3-compatible object storage service (or Azure blob storage) meets Terraform Enterprise's object storage requirements. You must create a bucket for Terraform Enterprise to use, and specify that bucket during installation. Depending on your infrastructure provider, you might need to ensure the bucket is in the same region as the Terraform Enterprise instance.

## Instance Type/Size and Operating System

Terraform Enterprise with Clustering currently supports the following
operating systems:

* Ubuntu 16.04 / 18.04
* Red Hat Enterprise Linux 7.2 - 7.6

~> **Note:** Additional Operating System support will be added in future versions.

### Hardware Requirements

These requirements provide the instance with enough resources to run the
Terraform Cloud application as well as the Terraform plans and applies.

* At least 40GB of disk space on the root volume
* At least 8GB of system memory
* At least 2 CPU cores

The default instance type in each module meets these requirements. If you provide an alternate instance type, please ensure it meets or exceeds these requirements.

### Network Requirements

Terraform Enterprise is a networked application. Its Linux instance needs to allow several kinds of incoming and outgoing network traffic.

See [Network Requirements](./network-requirements.html) for details.
