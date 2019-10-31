---
layout: "enterprise"
page_title: "Pre-Install Checklist - Before Installing - Terraform Enterprise"
---

# Terraform Enterprise Pre-Install Checklist

Before installing Terraform Enterprise, you'll need to make several key architecture decisions and prepare some infrastructure and data files. Please make careful note of these requirements, as the installation may not be successful if these requirements are not met.

## Summary

Prepare all of the following before installing:

1. **Choose a deployment method:** Decide whether to perform a clustered deployment of Terraform Enterprise (using a HashiCorp-provided Terraform module) or use the installer to deploy individual instances.
2. **Choose an operational mode:** Decide how Terraform Enterprise should store its data. This is affected by your choice of deployment method.
3. **Credentials:** Ensure you have a Terraform Enterprise license and a TLS certificate for Terraform Enterprise to use.
4. **Data storage:** Depending on your operational mode, prepare data storage services or a block storage device.
5. **Linux instance:** Prepare a Linux machine image (if clustering) or a running Linux instance (if deploying individually) for Terraform Enterprise. This might require additional configuration or software installation, depending on the OS and your operational requirements.

## Deployment Method Decision

There are two ways to install Terraform Enterprise:

- **Clustered deployment:** Deploy Terraform Enterprise as a cluster of three or more instances using a Terraform module. Installation is automated, and you configure your deployment via the module's input variables. The cluster's secondary instances can scale horizontally to fit your enterprise's workloads.

    We think this method is best for most enterprises, but it doesn't support every possible use case. It only supports deployment on AWS, GCP, and Azure, and we don't recommend it if you only want a single Terraform Enterprise instance.

    For more information, see [Cluster Architecture](./cluster-architecture.html).

- **Individual deployment:** Deploy Terraform Enterprise directly onto prepared Linux instances using an executable installer. The installer can be automated (with configuration via a JSON file) or run interactively (with configuration via a web interface).

    This method requires more effort to ensure availability and redundancy, and requires you to provision more infrastructure prior to deploying Terraform Enterprise. For more information about what's necessary to use this deployment mode effectively, see [Reference Architectures (Individual Deployment)](./reference-architecture/index.html).

Decide which deployment method you want to use; if you choose individual deployment, also decide whether to use automated installation. Once you are ready to install, refer to the installation guide that matches your choice.

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

    ~> **Important:** Mounted disk mode is not available with clustered deployment. Clusters must use either external services or demo mode.
1. **Demo** - This mode stores all data on the instance. The data can be
   backed up with the snapshot mechanism for restore later. This option is best for initial
   installation and testing, and is not recommended or supported for true production use.

The decision you make will be entered during setup.

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

## Data Storage

Make sure your data storage services or device meet Terraform Enterprise's requirements. These requirements differ based on operational mode:

- **External services:**
    - [PostgreSQL Requirements](./postgres-requirements.html)
    - Any S3-compatible object storage service (or Azure blob storage) meets Terraform Enterprise's object storage requirements. You must create a bucket for Terraform Enterprise to use, and specify that bucket during installation. Depending on your infrastructure provider, you might need to ensure the bucket is in the same region as the Terraform Enterprise instance.
        - In environments without their own storage service, it may be possible to use [Minio](https://minio.io) for object storage. See the [Minio Setup Guide](./minio-setup-guide.html) for details.
    - Optionally: if you already run your own [Vault](https://www.vaultproject.io/) cluster in production, you can configure Terraform Enterprise to use that instead of running its own internal Vault instance. Before installing Terraform Enterprise, follow the instructions in [Externally Managed Vault Configuration](./vault.html).
- **Mounted disk:**
    - [Mounted Disk Requirements](./disk-requirements.html)

-> **Note:** If you are following one of the [reference architectures](./reference-architecture/index.html), refer to it while preparing your data storage services.

## Linux Instance

Terraform Enterprise runs on Linux instances. The source of these instances depends on your deployment method:

- **Clustered deployment:** Terraform automatically provisions all instances for Terraform Enterprise. The machine image and the instance type are configurable:
    - By default, the module uses an official Ubuntu image; you can override this with any image that meets the [software requirements below](#software-requirements).
    - The default instance type depends on the cloud you deploy to; see the module documentation for details. You can override this, and can optionally specify separate image types for primary and secondary instances.
- **Individual deployment:** You must prepare a running Linux instance for Terraform Enterprise before running the installer. You will start and manage this instance like any other server.

In either case, note that Terraform Enterprise currently supports running under the following operating systems:

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
