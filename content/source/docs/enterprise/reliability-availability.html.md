---
layout: "enterprise"
page_title: "Reliability & Availability - Terraform Enterprise"
---

# Terraform Enterprise Reliability & Availability

This section covers details relating to the reliability and availability of
Terraform Enterprise installations. This documentation may be
useful to customers evaluating Terraform Enterprise or operators responsible for installing and
maintaining Terraform Enterprise.

## Components

Terraform Enterprise consists of several distinct components that each play a
role when considering the reliability of the overall system:

- **Application Layer**

  - _TFE Core_ - A Rails application at the center of Terraform Enterprise;
    consists of web frontends and background workers

  - _TFE Services_ - A set of Go services that provide various pieces of key
    functionality for Terraform Enterprise

  - _Terraform Workers_ - A fleet of isolated execution environments that
    perform Terraform Runs on behalf of Terraform Enterprise users

- **Coordination Layer**

  - _Redis_ - Used for Rails caching and coordination between TFE Core's web
    and background workers

  - _RabbitMQ_ Used for Terraform Worker job coordination

- **Storage Layer**

  - _PostgreSQL Database_ - Serves as the primary store of Terraform
    Enterprise's application data such as workspace settings and user settings

  - _Blob Storage_ - Used for storage of Terraform state files, plan files,
    configuration, and output logs

  - _HashiCorp Vault_ - Used for encryption of sensitive data. There are
    two types of Vault data in Terraform Enterprise -
    [key material](https://www.vaultproject.io/docs/concepts/seal.html) and
    [storage backend data](https://www.vaultproject.io/docs/configuration/storage/index.html).

  - _Configuration Data_ - The information provided and/or generated at
    install-time (e.g. database credentials, hostname, etc.)

## AMI Architecture

In the AMI Architecture, both the **Application Layer** and the **Coordination
Layer** execute on a single EC2 instance.

_Configuration Data_ is provided via inputs to the [Terraform modules that are
published alongside the AMI][tf-modules]. These inputs are interpolated into an
encrypted file on S3. The EC2 instance is granted access to download this file
via its IAM instance profile and configured to do so on boot via its User Data
script.

This setup allows the instance to automatically reconfigure itself on each
boot, making for a consistent story for upgrades and recovery. The instance is
launched in an Auto Scaling Group of size one, which facilitates automatic
re-launch in the case of instance loss.

The **Storage Layer** is delegated to Amazon services and inherits their
respective reliability and availability properties:

- _PostgreSQL Database_ - Amazon RDS is configured by default to use a
  [Multi-AZ][multi-az] deployment, which provides high availability and
  automated failover of the database instance. Nightly database snapshots are
  automatically configured and retained for 31 days. The [Amazon RDS
  Documentation][rds-docs] has much more information about the reliability and
  availability of this service.

- _Blob Storage_ - Amazon S3 is used for all blob storage. The [Amazon S3
  Documentation][s3-docs] has much more information about the reliability and
  availability of this service.

- _HashiCorp Vault_ - Consul is run on the Terraform Enterprise EC2 instance and stores all
  Vault data. Consul data is backed up hourly to S3 alongside of the
  _Configuration Data_ and is set to automatically restore on boot.

[tf-modules]: https://github.com/hashicorp/terraform-enterprise-modules
[multi-az]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html
[rds-docs]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html
[s3-docs]: https://aws.amazon.com/documentation/s3/

### Availability During Upgrades

Upgrades for the AMI Architecture are delivered as new AMIs. Switching AMI IDs
within the Terraform config that manages your Terraform Enterprise installation will cause the
plan to include replacement of the Launch Configuration and Auto Scaling Group
associate with your Terraform Enterprise instance.

Applying this plan will result in the instance being relaunched. It will
automatically recover the latest backup of _Configuration Data_ from S3 and
resume normal operations.

In normal conditions, Terraform Enterprise will be unavailable for less than
five minutes as the old instance terminates and the new instance launches and
boots the application.

### Recovery From Failures

The boot behavior and Auto Scaling Group configuration described above means
that the system can automatically recover from any failure that results in loss
of the instance. This recovery generally completes in less than five minutes.

The Multi-AZ setup used for RDS protects against failures that affect the
Database Instance, and the nightly automated RDS Snapshots provide coverage
against data corruption.

The redundancy guarantees of Amazon S3 serve to protect the files that Terraform Enterprise
stores there.

## Installer Architecture

This section describes how to set up your Terraform Enterprise deployment to recover from
failures in the various operational modes (demo, mounted disk, external
services). The operational mode is selected at install time and can not be
changed once the install is running.

The below tables explain where each data type in the
[Storage Layer](#components) is stored and
the corresponding snapshot and restore procedure. For the data types that use
Terraform Enterprise's built-in snapshot and restore function, follow
[these instructions](./automated-recovery.html). For the data types that do
**not** use the built-in functionality, backup and restore is the responsibility
of the user.

*Data Location*

|  | Configuration | Vault | PostgreSQL | Blob Storage |
|-------------------|--------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------|--------------------------------------|
| Demo | Stored in Docker volumes on instance | Key material is stored in Docker volumes on instance, storage backend is internal PostgreSQL | Stored in Docker volumes on instance | Stored in Docker volumes on instance |
| Mounted Disk | Stored in Docker volumes on instance | Key material on host in `/var/lib/tfe-vault`, storage backend is mounted disk PostgreSQL | Stored in mounted disks | Stored in mounted disks |
| External Services | Stored in Docker volumes on instance | Key material on host in `/var/lib/tfe-vault`, storage backend is external PostgreSQL | Stored in external service | Stored in external service |
| External Vault | - | Key material in external Vault with user-defined storage backend | - | - |

*Backup and Restore Responsibility*

|                   | Configuration | Vault | PostgreSQL | Blob Storage |
|-------------------|---------------|-------|------------|--------------|
| Demo              | Terraform Enterprise | Terraform Enterprise | Terraform Enterprise | Terraform Enterprise |
| Mounted Disk      | Terraform Enterprise | Terraform Enterprise | User                 | User                 |
| External Services | Terraform Enterprise | Terraform Enterprise | User                 | User                 |
| External Vault    | -                    | User                 | -                    | -                    |

### Demo

All data (Configuration, PostgreSQL, Blob Storage, Vault) is stored within
Docker volumes on the instance.

**Snapshot:** The built-in Snapshot mechanism can be used to package up
all data and store it off the instance. The frequency of automated snapshots can
be configured hourly such that the worst-case data loss can be as low as 1 hour.

**Restore:** If the instance running Terraform Enterprise is lost, the only recovery
mechanism in demo mode is to create a new instance and use the builtin Restore
mechanism to recreate it from a previous snapshot.

[Configure Snapshot and Restore following these instructions](./automated-recovery.html).

### Mounted Disk

_PostgreSQL Database_ and _Blob Storage_ use mounted disks for their
data. Backup and restore of those volumes is the responsibility of the user, and
is not managed by Terraform Enterprise's built-in systems.

_Vault Data_ is stored in PostgreSQL and accordingly lives on the mounted disk. As
long as the user has restored the mounted disk successfully, the built-in restore
mechanism will restore Vault operations in the event of a failure.

_Configuration Data_ for the installation is stored in Docker
volumes on the instance. The built-in snapshot mechanism can package up the
Configuration data and store it off the instance, and the built-in restore
mechanism can recover the configuration data and restore
operation in the event of a failure.
Configure snapshot and restore by following the [automated recovery instructions](./automated-recovery.html).

If the instance running Terraform Enterprise is lost, the use of mounted disks
means no state data is lost.

### External Services

In the External Services mode of the Installer Architecture, the
**Application Layer** and **Coordination Layer** execute on a Linux instance,
but the **Storage Layer** is configured to use external services in the form of
a PostgreSQL server and an S3-compatible Blob Storage.

The maintenance of PostgreSQL and Blob Storage are handled by the user,
which includes backing up and restoring if necessary.

_Vault Data_ is stored in PostgreSQL. As long as PostgreSQL has been restored
successfully by the user, the built-in restore mechanism will restore Vault
operations in the event of a failure.

_Configuration Data_ for the installation is stored in Docker
volumes on the instance. The built-in snapshot mechanism can package up the
data and store it off the instance, and the built-in restore
mechanism can recover the data and restore operation in the event of a failure.
Configure snapshot and restore by following the [automated recovery instructions](./automated-recovery.html).

If the instance running Terraform Enterprise is lost, the use of
external services means no state data is lost.

-> **NOTE:** Customers running an [optional external Vault cluster](./vault.html) are
responsible for backing up the Vault data and restoring it if necessary.

### Availability During Upgrades

Upgrades for the Installer architecture use the Installer dashboard.
Once an upgrade has been been detected (either online or airgap), the new code
is imported. Once ready, all services on the instance are restarted running
the new code. The expected downtime is between 30 seconds and 5 minutes,
depending on whether database updates have to be applied.

Only application services are changed during the upgrade; data is not backed up
or restored. The only data changes that may occur during upgrade are the application of
migrations the new version might apply to the _PostgreSQL Database_.

When an upgrade is ready to start the new code, the system waits for all
Terraform runs to finish before continuing. Once the new code has started, the
queue of runs is continued in the same order.
