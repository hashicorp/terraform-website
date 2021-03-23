---
layout: "enterprise"
page_title: "GCP Reference Architecture - Terraform Enterprise"
description: |-
  This document provides recommended practices and a reference architecture for
  HashiCorp Terraform Enterprise implementations on GCP.
---

# Terraform Enterprise GCP Reference Architecture

## Introduction

This document provides recommended practices and a reference architecture for
HashiCorp Terraform Enterprise implementations on GCP.

## Implementation Modes

Terraform Enterprise can be installed and function in different implementation modes with increasing capability and complexity:

- _Standalone:_ The base architecture with a single application node that supports the standard implementation requirements for the platform.
- _Active/Active:_ This is an extension of *Standalone* mode that adds multiple active node capability that can expand horizontally to support larger and increasing execution loads.

Since the architectures of the modes progresses logically, this guide will present the base _Standalone_ mode first and then discuss the differences that alter the implementation into the _Active/Active_ mode.

## Required Reading

Prior to making hardware sizing and architectural decisions, read through the
[pre-install checklist](../index.html)
to familiarize yourself with the application components and architecture.
Further, read the [reliability and availability
guidance](../../system-overview/reliability-availability.html)
as a primer to understanding the recommendations in this reference
architecture.

## Infrastructure Requirements

-> **Note:** This reference architecture focuses on the _External Services_ operational mode.

Depending on the chosen [operational
mode](../index.html#operational-mode-decision),
the infrastructure requirements for Terraform Enterprise range from a single Cloud Compute VM instance
for demo installations to multiple instances connected to Cloud SQL and Cloud Storage for a
stateless production installation.

The following table provides high-level server guidelines. Of particular
note is the strong recommendation to avoid non-fixed performance CPUs,
or “Shared-core machine types” in GCP terms, such as f1-series and g1-series instances.

### Terraform Enterprise Server (Compute Engine VM via Regional Managed Instance Group)

| Type    | CPU    | Memory    | Disk        | GCP Machine Types |
|---------|--------|-----------|-------------|-------------------|
| Minimum | 4 core | 15 GB RAM | 50GB/200GB* | n1-standard-4     |
| Scaled  | 8 core | 30 GB RAM | 50GB/200GB* | n1-standard-8     |

#### Hardware Sizing Considerations

- \*Terraform Enterprise requires 50GB for installation, but
  [GCP documentation for storage performance](https://cloud.google.com/compute/docs/disks/#performance)
  recommends "to ensure consistent performance for more general use of the boot device,
  use either an SSD persistent disk as your boot disk or use a standard persistent disk
  that is at least 200 GB in size."

- The minimum size would be appropriate for most initial production
  deployments, or for development/testing environments.

- The scaled size is for production environments where there is a
  consistent high workload in the form of concurrent Terraform runs.

### PostgreSQL Database (Cloud SQL PostgreSQL Production)

| Type    | CPU    | Memory    | Storage | GCP Machine Types            |
|---------|--------|-----------|---------|------------------------------|
| Minimum | 4 core | 16 GB RAM | 50GB    | Custom PostgreSQL Production |
| Scaled  | 8 core | 32 GB RAM | 50GB    | Custom PostgreSQL Production |

#### Hardware Sizing Considerations

- The minimum size would be appropriate for most initial production
  deployments, or for development/testing environments.

- The scaled size is for production environments where there is a
  consistent high workload in the form of concurrent Terraform runs.

### Object Storage (Cloud Storage)

A [Regional Cloud Storage](https://cloud.google.com/storage/docs/storage-classes#regional) bucket must be
specified during the Terraform Enterprise installation for application data to be stored
securely and redundantly away from the Compute Engine VMs running the
application. This Cloud Storage bucket must be in the same region as the Compute Engine and Cloud SQL
instances.
Vault is used to encrypt all application data stored in the Cloud Storage bucket. This
allows for further [server-side
encryption](https://cloud.google.com/storage/docs/encryption/).
by Cloud Storage.

### Other Considerations

#### Additional GCP Resources

In order to successfully provision this reference architecture you must
also be permitted to create the following GCP resources:

- [Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
- [VPC Network](https://cloud.google.com/vpc/docs/vpc)
- [Subnet](https://cloud.google.com/vpc/docs/using-vpc)
- [Firewall](https://cloud.google.com/vpc/docs/firewalls)
- [Target Pool](https://cloud.google.com/load-balancing/docs/target-pools)
- [Forwarding Rule](https://cloud.google.com/load-balancing/docs/forwarding-rules)
- [Compute Instance Template](https://cloud.google.com/compute/docs/instance-templates/)
- [Regional Managed Instance Group](https://cloud.google.com/compute/docs/instance-groups/distributing-instances-with-regional-instance-groups)
- [Cloud DNS (optional)](https://cloud.google.com/dns/)

#### Network

To deploy Terraform Enterprise in GCP you will need to create new or use existing
networking infrastructure. The below infrastructure diagram highlights
some of the key components (network, subnets) and you will
also have firewall and gateway requirements. These
elements are likely to be very unique to your environment and not
something this Reference Architecture can specify in detail.

#### DNS

DNS can be configured external to GCP or using [Cloud DNS](https://cloud.google.com/dns/). The
fully qualified domain name should resolve to the Forwarding Rules associated with the Terraform Enterprise deployment.
Creating the required DNS entry is outside the scope
of this guide.

#### SSL/TLS Certificates and Load Balancers

An SSL/TLS certificate signed by a public or private CA is required for secure communication between
clients, VCS systems, and the Terraform Enterprise application server. The certificate can be specified during the
UI-based installation or in a configuration file used for an unattended installation.

### Infrastructure Diagram - Standalone

![gcp-infrastructure-diagram](./assets/RA-TFE-SA-GCP-SingleRegion.png)

The above diagram shows the infrastructure components at a high-level.

### Application Layer

The Application Layer is composed of a Regional Managed Instance Group and an Instance Template
providing an auto-recovery mechanism in the event of an instance or Zone failure.

### Storage Layer

The Storage Layer is composed of multiple service endpoints (Cloud SQL, Cloud Storage) all
configured with or benefiting from inherent resiliency
provided by GCP.

#### Additional Information

- [Cloud SQL high-availability](https://cloud.google.com/sql/docs/postgres/high-availability).

- [Regional Cloud Storage](https://cloud.google.com/storage/docs/storage-classes).

## Infrastructure Provisioning

The recommended way to deploy Terraform Enterprise is through use of a Terraform configuration
that defines the required resources, their references to other resources, and associated
dependencies.

## Normal Operation

### Component Interaction

The Forwarding Rule routes all traffic to the Terraform Enterprise instance, which is managed by
a Regional Managed Instance Group with maximum and minimum instance counts set to one.

The Terraform Enterprise application is connected to the PostgreSQL database via the Cloud SQL
endpoint and all database requests are routed via the Cloud SQL endpoint to the database instance.

The Terraform Enterprise application is connected to object storage via the Cloud Storage endpoint
for the defined bucket and all object storage requests are routed to the
highly available infrastructure supporting Cloud Storage.

### Monitoring

There is not currently a full monitoring guide for Terraform Enterprise. The following pages include information relevant to monitoring:

- [Logging](../../admin/logging.html)
- [Diagnostics](../../support/index.html)
- [Reliability and Availability](../../system-overview/reliability-availability.html)

### Upgrades

See [the Upgrades section](../../admin/upgrades.html) of the documentation.

## High Availability - Failure Scenarios
GCP provides guidance on [designing robust systems](https://cloud.google.com/compute/docs/tutorials/robustsystems).
Working in accordance with those recommendations, the Terraform Enterprise Reference
Architecture is designed to handle different failure scenarios with
different probabilities. As the architecture evolves it will provide a
higher level of service continuity.

### Terraform Enterprise Server

By utilizing a Regional Managed Instance Group, a Terraform Enterprise instance can automatically recover
in the event of any outage except for the loss of an entire region.

In the event of the Terraform Enterprise instance failing in a way that GCP can
observe, [Live Migration](https://cloud.google.com/compute/docs/instances/live-migration)
is used to move the instance to new physical hardware automatically.
In the event that Live Migration is not possible the instance will crash and be restarted
on new physical hardware automatically. Once launched, it reinitializes the software, and on completion, processing on this  instance will resume as normal.

With _External Services_ (PostgreSQL Database, Object Storage) in use, there is still some application configuration data present on the Terraform Enterprise server such as installation type, database connection settings, hostname. This data rarely changes. If the configuration on Terraform Enterprise changes you should update the
Instance Template to include the updates so that any newly
launched Compute Engine VM uses them.

### Zone Failure

In the event of the Zone hosting the main instances (Compute Engine and Cloud SQL) failing,
the Regional Managed Instance Group for the Compute VMs will automatically
begin booting a new one in an operational Zone.

- Cloud SQL automatically and transparently fails over to the standby zone.
  The [GCP documentation provides more
  detail](https://cloud.google.com/sql/docs/postgres/high-availability)
  on the exact behavior and expected impact.

- Cloud Storage is resilient to Zone failure based on its architecture.

See below for more detail on how each component handles Zone failure.

### PostgreSQL Database

Using Cloud SQL as an external database service leverages the highly
available infrastructure provided by GCP. From the GCP website:

> *A Cloud SQL instance configured for high availability is also called a regional instance.
> A regional instance is located in two zones within the configured region, so if it cannot
> serve data from its primary zone, it fails over and continues to serve data from its secondary zone.
> ([source](https://cloud.google.com/sql/docs/postgres/high-availability))*

### Object Storage

Using Regional Cloud Storage as an external object store leverages the highly available
infrastructure provided by GCP. Regional Cloud Storage buckets are resilient to Zone failure
within the region selected during bucket creation.
From the GCP website:

> *Regional Storage is appropriate for storing data in the same regional location
> as Compute Engine instances or Kubernetes Engine clusters that use the data.
> Doing so gives you better performance for data-intensive computations, as opposed
> to storing your data in a multi-regional location.
> ([source](https://cloud.google.com/storage/docs/storage-classes))*

## Disaster Recovery - Failure Scenarios

GCP provides guidance on [designing robust systems](https://cloud.google.com/compute/docs/tutorials/robustsystems).
Working in accordance with those recommendations the Terraform Enterprise Reference Architecture is designed to handle
different failure scenarios that have different probabilities. As the
architecture evolves it will continue to provide a higher level of service
continuity.

### Data Corruption

The Terraform Enterprise application architecture relies on multiple service endpoints
(Cloud SQL, Cloud Storage) all providing their own backup and recovery
functionality to support a low MTTR in the event of data corruption.

### PostgreSQL Database

Backup and restoration of PostgreSQL is managed by GCP and configured
through the GCP management console or CLI.

Automated (scheduled) and on-demand backups are available in GCP. Review the
[backup](https://cloud.google.com/sql/docs/postgres/backup-recovery/backups)
and [restoration](https://cloud.google.com/sql/docs/postgres/backup-recovery/restore)
documentation for further guidance.

More details of Cloud SQL (PostgreSQL) features are available [here](https://cloud.google.com/sql/docs/postgres/).

### Object Storage

There is no automatic backup/snapshot of Cloud Storage by GCP, so it is recommended
to script a bucket copy process from the bucket used by the Terraform Enterprise
application to a “backup bucket” in Cloud Storage that runs at regular intervals.
The [Nearline Storage](https://cloud.google.com/storage/docs/storage-classes#nearline) storage class
is identified as a solution targeted more for DR backups. From the GCP website:

> *Nearline Storage is ideal for data you plan to read or modify on average once a month or less.
> For example, if you want to continuously add files to Cloud Storage and plan to access those
> files once a month for analysis, Nearline Storage is a great choice.
> Nearline Storage is also appropriate for data backup, disaster recovery, and archival storage.
([source](https://cloud.google.com/storage/docs/storage-classes#nearline))*

## Multi-Region Deployment to Address Region Failure

Terraform Enterprise is currently architected to provide high availability within a
single GCP Region only. It is possible to deploy to multiple GCP Regions to give you greater
control over your recovery time in the event of a hard dependency
failure on a regional GCP service. In this section, implementation patterns to support this are discussed.

An identical infrastructure should be provisioned in a secondary GCP
Region. Depending on recovery time objectives and tolerances for
additional cost to support GCP Region failure, the infrastructure can be
running (Warm Standby) or stopped (Cold Standby). In the event of the
primary GCP Region hosting the Terraform Enterprise application failing, the secondary
GCP Region will require some configuration before traffic is directed to
it along with some global services such as DNS.

- [Cloud SQL cross-region read replicas](https://cloud.google.com/sql/docs/postgres/replication/cross-region-replicas)  can be used in a warm standby architecture. See also [Managing Cloud SQL read replicas](https://cloud.google.com/sql/docs/postgres/replication/manage-replicas).

  - Note that read replicas do not inherently provide high availability in the sense that there can be automatic failover from the primary to the read replica. As described in the above reference, the read replica will need to be promoted to a stand-alone Cloud SQL primary instance. Promoting a replica to a stand-alone Cloud SQL primary instance is an irreversible action, so when the failover needs to be reverted, the database must be restored to an original primary location (potentially by starting it as a read replica and promoting it), and the secondary read replica will need to be destroyed and re-established.

  - GCP now offers a [high availability option for Cloud SQL](https://cloud.google.com/sql/docs/mysql/high-availability) databases which could be incorporated into a more automatic failover scenario.\*

- [Cloud SQL database backups](https://cloud.google.com/sql/docs/postgres/backup-recovery/restoring) can be used in a cold standby architecture.

  - GCP now offers a [Point-in-time recovery](https://cloud.google.com/sql/docs/postgres/backup-recovery/pitr) option for Cloud SQL databases which could be incorporated into a backup and recovery scheme with reduced downtime and higher reliability.\*

- [Multi-Regional Cloud Storage replication](https://cloud.google.com/storage/docs/storage-classes#multi-regional) must be configured so the object storage component of the Storage Layer is available in multiple GCP Regions.

- DNS must be redirected to the Forwarding Rule acting as the entry point for the infrastructure deployed in the secondary GCP Region.

- Terraform Enterprise in the _Standalone_ mode is an Active/Passive model. At no point should more than one Terraform Enterprise instance be actively connected to the same database instance.

\* **Note:** We are investigating incorporating these newer CloudSQL capabilities into this reference architecture, but do not have additional details at this time.

## Active/Active Implementation Mode

### Overview

As stated previously, the _Active/Active_ implementation mode is an extension of the _Standalone_ implementation mode that increases the scalability and load capacity of the Terraform Enterprise platform. The same application runs on multiple Terraform Enterprise instances utilizing the same external services in a shared model. The primary architectural and implementation differences for _Active/Active_ are:

- It can only be run in the _External Services_ mode.
- The additional nodes are active and processing work at all times.
- In an addition to the existing external services, there is a memory cache which is currently implemented with cloud native implementations of Redis. This is used for the processing queue for the application and has been moved from the individual instance to be a shared resource that manages distribution of work.
- There are additional configuration parameters to manage the operation of the node cluster and the memory cache.

The following sections will provide further detail on the infrastructure and implementation differences.

### Migration to Active/Active

If you are considering a migration from a _Standalone_ implementation to _Active/Active_, it is straightforward and there is guidance available to assist with that effort. However, you should first make a determination if the move is necessary. The _Standalone_ mode is capable of handling significant load and the first paths to supporting higher load can be simply increasing the compute power in the existing implementation.  A discussion with your HashiCorp representatives may be warranted.

Also note that if your existing architecture does not already depict what is shown and discussed above, you will likely need to make adjustments to bring it into alignment. This could be either before or during the migration. Certain tenets of the reference architecture described here are highly recommended and potentially necessary to support _Active/Active_ mode such as load balancers and scaling groups.

### Infrastructure Diagram - Active/Active

![gcp-aa-infrastructure-diagram](./assets/RA-TFE-AA-GCP-SingleRegion.png)

The above diagram shows the infrastructure components of an _Active/Active_ implementation at a high-level.

### Infrastructure Requirements

#### Active Nodes

The diagram depicts two active nodes to be concise. Additional nodes can be added by altering your configuration to launch another instance that points to the same shared external services. The number and sizing of nodes should be based on load requirements and redundancy needs. Nodes should be deployed in alternate zones to accommodate zone failure.

The cluster is comprised of essentially independent nodes in a SaaS type model. There are no concerns of leader election or minimal or optimum node counts. When a new node enters the cluster it simply starts taking new work from the load balancer and from the memory cache queue and thus spreading the load horizontally.

#### Memory Cache

The GCP implementation of the memory cache is handled by [Google Cloud Memorystore services](https://https://cloud.google.com/memorystore). Specifically using [Memorystore for Redis](https://https://cloud.google.com/memorystore/docs/redis).

[Memorystore for Redis Overview](https://cloud.google.com/memorystore/docs/redis/redis-overview) provides a high level description of the implementation options for the memory cache. A primary differentiator is Basic Tier and Standard Tier. The primary difference is that the Standard Tier offers [high availability](https://cloud.google.com/memorystore/docs/redis/high-availability)] where instances are always replicated across zones and provides 99.9% availability SLAs (note that reading from a replica is not supported). A lower testing or sandbox environment could use the Basic Tier, however, a production level environment should always use Standard Tier to gain the HA features that coincide with the other external services in the Terraform Enterprise platform.

Memorystore for Redis service supports [realtime scaling of instance size](https://cloud.google.com/memorystore/docs/redis/scaling-instances). You can start the size off in a smaller range with some consideration of anticipated active load, and scale up or down as demand is understood with the aid of [monitoring ](https://cloud.google.com/memorystore/docs/redis/monitoring-instances).

Enterprise-grade security is inherently covered in the Memorystore for Redis implementation because Redis instances are protected from the Internet using private IPs, and access to instances is controlled and limited to applications running on the same Virtual Private Network as the Redis instance. Additional security measures can be instituted using [IAM based access control and permissions](https://cloud.google.com/memorystore/docs/redis/access-control). However, this may add additional complication to your realtime scaling of instances.

Terraform Enterprise supports Redis versions 4.0 and 5.0, but 5.0 is recommended unless there is strong reason to deviate. Memorystore for Redis supports 4.0 and 5.0 also so do explicitly specify the version.

### Normal Operation

#### Component Interaction

The Forwarding Rule routes traffic to the Terraform Enterprise node instances, which is managed by
a Regional Managed Instance Group. This is a standard round-robin distribution for now, with no accounting for current load on the nodes. The instance counts on the Regional Managed Instance Group control the number of nodes in operation and can be used to increase or decrease the number of active nodes.

_Active/Active_ Terraform Enterprise is not currently architected to support dynamic scaling based on load or other factors. The maximum and minimum instance counts on the Regional Managed Instance Group should be set to the same value. Adding a node can be done at will by setting these values. However, removing a node requires that the node be allowed to finish active work and stop accepting new work before being terminated. The operational documentation has the details on how to "drain" a node.

#### Replicated Console

The Replicated Console that allows access to certain information and realtime configuration for _Standalone_ is not available in _Active/Active_. This functionality, including generating support bundles, has been replaced with CLI commands to be executed on the nodes. The operational documentation has the details on how to utilize these commands.

#### Upgrades

Upgrading the Terraform Enterprise version still follows a similar pattern as with _Standalone_. However, there is not an online option with the Replicated Console. It is possible to upgrade a minor release with CLI commands in a rolling fashion. A "required" release or any change the potentially affects the shared external services will need to be done with a short outage. This involves scaling down to a single node, replacing that node, and then scaling back out. The operational documentation has the details on how these processes can operate.

### Failure Scenarios

#### Memory Cache

As mentioned, the Memorystore for Redis service in Standard Tier mode provides automatic replication and failover. In the event of a larger failure or any normal maintenance with proper draining, the memory cache will not be required to be restored. If it is damaged it can be re-paved, and if not it can be left to continue operation.

### Multi-Region Implementation to Address Region Failure

Similar to _Standalone_, _Active/Active_ Terraform Enterprise is currently architected to provide high availability within a
single region. You cannot deploy additional nodes associated to the primary cluster in different regions. It is possible to deploy to multiple regions to give you greater
control over your recovery time in the event of a hard dependency
failure on a regional service. An identical infrastructure will still need to be instantiated separately with a failover scenario resulting in control of processing being transferred to the second implementation, as described in the earlier section on this topic. In addition, this identical infrastructure will require its own memory cache external service instance.
