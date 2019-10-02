---
layout: "enterprise"
page_title: "Pre-Install Checklist - Before Installing - Terraform Enterprise"
---

# Terraform Enterprise Pre-Install Checklist

Before installing Terraform Enterprise, you'll need to prepare an appropriate instance, supporting services, and relevant data files. Please make careful note of these requirements, as the installation may not be successful if these requirements are not met.

## Summary

Prepare all of the following before installing:

1. **Credentials:** Ensure you have a Terraform Enterprise license and a TLS certificate for Terraform Enterprise to use.
2. **Operational mode decision:** Decide how Terraform Enterprise should store its data: in discrete external services, or on a plain mounted disk.
3. **Data storage:** Depending on your operational mode, prepare data storage services or a block storage device.
4. **Linux instance:** Prepare a Linux instance for Terraform Enterprise. This might require additional configuration or software installation, depending on the OS and your operational requirements.

-> **Note:** We publish [Terraform Enterprise reference architectures](./reference-architecture/index.html) for several of the most popular infrastructure platforms, including AWS, Azure, GCP, and VMware. These reference architectures go beyond the bare requirements to offer detailed and opinionated advice about how to configure your services, instances, and networking infrastructure. If you are following a reference architecture, refer to it while preparing the data storage services and the Linux instance.

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

1. **Production - External Services** - This mode stores the majority of the
   stateful data used by the instance in an external PostgreSQL database and
   an external S3-compatible endpoint or Azure blob storage. There is still critical data
   stored on the instance that must be managed with snapshots. Be sure to
   check the [PostgreSQL Requirements](./postgres-requirements.html) for information that
   needs to be present for Terraform Enterprise to work. This option is best
   for users with expertise managing PostgreSQL or users that have access
   to managed PostgreSQL offerings like [AWS RDS](https://aws.amazon.com/rds/).
1. **Production - Mounted Disk** - This mode stores data in a separate
   directory on the host, with the intention that the directory is
   configured to store its data on an external disk, such as EBS, iSCSI,
   etc. This option is best for users with experience mounting performant
   block storage.
1. **Demo** - This mode stores all data on the instance. The data can be
   backed up with the snapshot mechanism for restore later. This option is best for initial
   installation and testing, and is not recommended or supported for true production use.

The decision you make will be entered during setup.

## Data Storage

Make sure your data storage services or device meet Terraform Enterprise's requirements. These requirements differ based on operational mode:

- **External services:**
    - [PostgreSQL Requirements](./postgres-requirements.html)
    - Any S3-compatible object storage service (or Azure blob storage) meets Terraform Enterprise's object storage requirements. You must create a bucket for Terraform Enterprise to use, and specify that bucket during installation. Depending on your infrastructure provider, you might need to ensure the bucket is in the same region as the Terraform Enterprise instance.
        - In environments without their own storage service, it may be possible to use [Minio](https://minio.io) for object storage. See the [Minio Setup Guide](./minio-setup-guide.html) for details.
    - Optionally: if you already run your own [Vault](https://www.vaultproject.io/) cluster in production, you can configure Terraform Enterprise to use that instead of running its own internal Vault instance. Before installing Terraform Enterprise, follow the instructions in [Externally Managed Vault Configuration](./vault.html).
- **Mounted disk:**
    - [Mounted Disk Requirements](./disk-requirements.html)

## Linux Instance

Install Terraform Enterprise on a Linux instance of your choosing.
You will start and manage this instance like any other server.

The Terraform Enterprise installer currently supports the following
operating systems:

* Debian 7.7+
* Ubuntu 14.04 / 16.04 / 18.04
* Red Hat Enterprise Linux 7.2+
* CentOS 7+
* Amazon Linux 2016.03 / 2016.09 / 2017.03 / 2017.09 / 2018.03 / 2.0
* Oracle Linux 7.2+

### Hardware Requirements

These requirements provide the instance with enough resources to run the
Terraform Cloud application as well as the Terraform plans and applies.

* At least 40GB of disk space on the root volume
* At least 8GB of system memory
* At least 2 CPU cores

### Network Requirements

Terraform Enterprise is a networked application. Its Linux instance needs to allow several kinds of incoming and outgoing network traffic.

See [Network Requirements](./network-requirements.html) for details.

### Software Requirements

Some operating systems have specific configuration requirements:

- [RedHat Enterprise Linux (RHEL) Requirements](./rhel-requirements.html)
- [CentOS Requirements](./centos-requirements.html)

For other Linux distributions, check Docker compatibility:

* The instance should run a supported version of Docker engine (1.7.1 or later, minimum 17.06.2-ce, maximum 18.09.2). This also requires a 64-bit distribution with a minimum Linux Kernel version of 3.10.
    * Replicated 2.32.0 and above required when running Docker 18+
    * In Online mode, the installer will install Docker automatically
    * In Airgapped mode, Docker should be installed before you begin
* For _RedHat Enterprise_ and _Oracle Linux_, you **must** pre-install Docker as these distributions are [not officially supported by Docker Community Edition](https://docs.docker.com/engine/installation/#server).

~> **Important:** We do not recommend running Docker under a 2.x kernel.

### SELinux

SELinux is supported when Terraform Enterprise runs in `External Services` mode and only the default SELinux policies provided by RedHat are used. Terraform Enterprise v201812-1 or later is required for this support.

SELinux is not supported when Terraform Enterprise runs in in `Demo` and `Mounted Disk` modes. When running in these modes the host running the installer must have SELinux configured in permissive mode.

To configure SELinux in permissive mode for the runtime only, run `setenforce 0` as root.

To configure SELinux in permissive mode persistently on boot, ensure the `/etc/selinux/config` file contains the following content:

```
SELINUX=permissive
```
