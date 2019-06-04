---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation (Preflight)"
sidebar_current: "docs-enterprise2-private-installer-preflight"
---

# Private Terraform Enterprise Installation (Preflight Requirements)

Before installing the Private Terraform Enterprise software, you'll need to prepare an appropriate instance and relevant data files. Please make careful note of these requirements, as the installation may not be successful if these requirements are not met.

## Data Files

* TLS private key and certificate
  * The installer allows for using a certificate signed by a public or private CA. If you do not use a trusted certificate, your VCS provider will likely reject that certificate when sending webhooks. The key and X.509 certificate should both be PEM (base64) encoded.
* License file (provided by HashiCorp)

~> **Note:** If you use a certificate issued by a private Certificate
   Authority, you must provide the certificate for that CA in the
   `Certificate Authority (CA) Bundle` section of the installation. This allows services
   running within PTFE to access each other properly.
   See [Installation: Trusting SSL/TLS Certificates](./install-installer.html#trusting-ssl-tls-certificates)
   for more on this.

## Linux Instance

Install the software on a Linux instance of your choosing.
You will start and manage this instance like any other server.

The Private Terraform Enterprise Installer currently supports the following
operating systems:

* Debian 7.7+
* Ubuntu 14.04 / 16.04 / 18.04
* Red Hat Enterprise Linux 7.2+
* CentOS 7+
* Amazon Linux 2016.03 / 2016.09 / 2017.03 / 2017.09 / 2018.03 / 2.0
* Oracle Linux 7.2+

### Hardware Requirements

These requirements provide the instance with enough resources to run the
Terraform Enterprise application as well as the Terraform plans and applies.

 * At least 40GB of disk space on the root volume
 * At least 8GB of system memory
 * At least 2 CPU cores

### Software Requirements

~> RedHat Enterprise Linux (RHEL) has a specific set of requirements. Please see the [RHEL Install Guide](./rhel-install-guide.html) before continuing.

-> See the [CentOS Install Guide](./centos-install-guide.html) for additional guidance if installing on CentOS.

For Linux distributions other than RHEL, check Docker compatibility:

  * The instance should run a supported version of Docker engine (1.7.1 or later, minimum 17.06.2-ce, maximum 18.09.2). This also requires a 64-bit distribution with a minimum Linux Kernel version of 3.10.
    * Replicated 2.32.0 and above required when running Docker 18+
    * In Online mode, the installer will install Docker automatically
    * In Airgapped mode, Docker should be installed before you begin
  * For _RedHat Enterprise_ and _Oracle Linux_, you **must** pre-install Docker as these distributions are [not officially supported by Docker Community Edition](https://docs.docker.com/engine/installation/#server).

~> **Note**: It is not recommended to run Docker under a 2.x kernel.

### SELinux

SELinux is supported when Private Terraform Enterprise runs in `External Services` mode and only the default SELinux policies provided by RedHat are used. Private Terraform Enterprise v201812-1 or later is required for this support.

SELinux is not supported when Private Terraform Enterprise runs in in `Demo` and `Mounted Disk` modes. When running in these modes the host running the installer must have SELinux configured in permissive mode.

To configure SELinux in permissive mode for the runtime only, run `setenforce 0` as root.

To configure SELinux in permissive mode persistently on boot, ensure the `/etc/selinux/config` file contains the following content:

```
SELINUX=permissive
```

### Network Requirements

#### Ingress

  * **22**: To access the instance via SSH from your computer. SSH access to the instance is required for administration and debugging.
  * **80**: To access the Terraform Enterprise appplication via HTTP. This port redirects to port 443 for HTTPS.
  * **443**: To access the Terraform Enterprise appplication via HTTPS.
  * **8800**: To access the installer dashboard.
  * **9870-9880 (inclusive)**: For internal communication on the host and its subnet; not publicly accessible.
  * **23000-23100 (inclusive)**: For internal communication on the host and its subnet; not publicly accessible.

#### Egress

The following hostnames are accessed in online mode:

* api.replicated.com
* get.replicated.com
* quay.io
* registry-data.replicated.com
* registry.replicated.com

Additionally, the following hostnames are accessed unless a
[custom Terraform bundle](/docs/enterprise/run/index.html#custom-and-community-providers)
is supplied:

* registry.terraform.io (when using Terraform 0.12 and later)
* releases.hashicorp.com

#### Other Configuration 

1. If a firewall is configured on the instance, be sure that traffic can flow out of the `docker0` interface to the instance's primary address. For example, to do this with UFW run: `ufw allow in on docker0`. This rule can be added before the `docker0` interface exists, so it is best to do it now, before the Docker installation.
1. Get a domain name for the instance. Using an IP address to access the product is not supported as many systems use TLS and need to verify that the certificate is correct, which can only be done with a hostname at present.
1. **For GCP only:** Configure Docker to use an MTU (maximum transmission unit) of 1460, as required by Google ([GCP Cloud VPN Documentation: MTU Considerations](https://cloud.google.com/vpn/docs/concepts/mtu-considerations)).

    To configure Docker's MTU, create an `/etc/docker/daemon.conf` file with the following content:

    ```json
    {
      "mtu": 1460
    }
    ```

## Operational Mode Decision

Terraform Enterprise can store its state in a few different ways, and you'll
need to decide which works best for your installation. Each option has a
different approach to
[recovering from failures](./reliability-availability.html#recovery-from-failures-1)
and should be selected based on your organization's preferences.

~> **Note:** This decision should be made before you begin installation, because some modes have additional preflight requirements that are detailed below.
The operational mode is selected at install time and cannot be changed once the install is running.

1. **Production - External Services** - This mode stores the majority of the
   stateful data used by the instance in an external PostgreSQL database as
   well as an external S3-compatible endpoint or Azure blob storage. There is still critical data
   stored on the instance that must be managed with snapshots. Be sure to
   check the [PostgreSQL Requirements](#postgresql-requirements) for information that
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

### Mounted Disk Guidelines

The mounted disk option provides significant flexibility in how PTFE stores its data. To help narrow down the possibilites, we've provided the following guidelines for mounted disk storage.

#### Supported Mounted Disk Types

The following are **supported** mounted disk types:

* AWS EBS
* GCP Zonal Persistent Disk
* Azure Disk Storage
* iSCSI
* SAN
* Physically connected disks as in non-cloud hardware

##### Disk Resizing

Depending on your cloud or storage application, you may need to confirm the disk has been resized to above Private Terraform Enterprise's minimum disk size of 40GB.

For example, with RedHat-flavor (RHEL, CentOS, Oracle Linux) images in Azure Cloud, the storage disk must be resized above the 30GB default after initial boot with `fdisk`, as documented in the Azure knowledge base article [How to: Resize Linux osDisk partition on Azure](https://blogs.msdn.microsoft.com/linuxonazure/2017/04/03/how-to-resize-linux-osdisk-partition-on-azure/).

#### Unsupported Mounted Disk Types

The following are **not** supported mounted disk types:

* NFS
* SMB/CIFS

The supported mounted disk types provide the necessary reliability and performance for data storage and retrieval in PTFE.

If the type of mounted disk you wish to use is not listed, please contact your HashiCorp representative to get clarification on whether that type is supported.

### PostgreSQL Requirements

When Terraform Enterprise uses an external PostgreSQL database, the
following must be present on it:

* PostgreSQL version 9.4 or greater
* User with the ability to create/modify/read tables and indices on all schemas created
  * If it's not feasible to have a user with "CREATE EXTENSION", then create the [extensions](#extensions) below before installation
* The following PostgreSQL schemas must be installed into the database: `rails`, `vault`, `registry`

To create schemas in PostgreSQL, the `CREATE SCHEMA` command is used. So to
create the above required schemas, the following snippet must be run on the
database:

```sql
CREATE SCHEMA rails;
CREATE SCHEMA vault;
CREATE SCHEMA registry;
```

When providing optional extra keyword parameters for the database connection,
note an additional restriction on the `sslmode` parameter is that only the
`require`, `verify-full`, `verify-ca`, and `disable` values are allowed.


#### Extensions

If the configured PostgreSQL user does not have permission to create PostgreSQL extensions
(ie is not a superuser), then run the following SQL commands to create the proper extensions:

```sql
CREATE EXTENSION IF NOT EXISTS "hstore" WITH SCHEMA "rails";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "rails";
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "registry";
```

### External Vault Option

If you already manage your own Vault cluster, you can choose to use it in Production
operational mode, rather than the default internal Vault provided by PTFE.

~> **Note:** This option is also selected at initial installation, and cannot be changed later.

If you will want to use an external Vault cluster when running Terraform Enterprise in production, select that option when initially switching to the Production operational mode. See [Externally Managed Vault Cluster](./vault.html) for more information on what this option requires.
