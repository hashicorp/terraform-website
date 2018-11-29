---
layout: "enterprise2"
page_title: "Private Terraform Enterprise - Reliability & Availability"
sidebar_current: "docs-enterprise2-private-reliability-availability"
---

# Private Terraform Enterprise Reliability & Availability

This section covers details relating to the reliability and availability of
Private Terraform Enterprise (PTFE) installations. This documentation may be
useful to Customers evaluating PTFE or Operators responsible for installing and
maintaining PTFE.

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
    two types of Vault data in PTFE -
    [key material](https://www.vaultproject.io/docs/concepts/seal.html) and
    [storage backend data](https://www.vaultproject.io/docs/configuration/storage/index.html).

  - _Configuration Data_ - The information provided and/or generated at
    install-time (e.g. database credentials, hostname, etc.)


## Operation Modes

This section describes how to set up your PTFE deployment to recover from
failures in the various operational modes (demo, mounted disk, external
services). The operational mode is selected at install time and can not be
changed once the install is running.

The below tables explain where each data type in the
[Storage Layer](#components) is stored and
the corresponding snapshot and restore procedure. For the data types that use
PTFE's built-in snapshot and restore function, follow
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
| Demo              | PTFE          | PTFE  | PTFE       | PTFE         |
| Mounted Disk      | PTFE          | PTFE  | User       | User         |
| External Services | PTFE          | User  | User       | User         |
| External Vault    | -             | User  | -          | -            |

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
is not managed by PTFE's built-in systems.

_Configuration Data_ and _Vault Data_ for the installation are stored in Docker
volumes on the instance. The built-in snapshot mechanism can package up the
Configuration and Vault data and store it off the instance, and the built-in restore
mechanism can recover the configuration data and restore
operation in the event of a failure.
Configure snapshot and restore by following the [automated recovery instructions](./automated-recovery.html).

If the instance running Terraform Enterprise is lost, the use of mounted disks
means no state data is lost.

### External Services

In the External Services mode of the Installer Architecture, the
**Application Layer** and **Coordination Layer** execute on a Linux instance,
but the **Storage Layer** is configured to use external services in the form of
a PostgreSQL server, an S3-compatible Blob Storage, and optionally an
[external Vault](./vault.html).

The maintenance of PostgreSQL, Blob Storage, and Vault are handled by the user,
which includes backing up and restoring if necessary.

_Configuration Data_ for the installation is stored in Docker
volumes on the instance. The built-in snapshot mechanism can package up the
Configuration and Vault data and store it off the instance, and the built-in restore
mechanism can recover the configuration data and restore
operation in the event of a failure.
Configure snapshot and restore by following the [automated recovery instructions](./automated-recovery.html).

If the instance running Terraform Enterprise is lost, the use of
external services means no state data is lost.

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
