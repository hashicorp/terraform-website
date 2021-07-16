---
layout: "enterprise"
page_title: "Azure Reference Architecture - Terraform Enterprise"
description: |-
  This document provides recommended practices and a reference
  architecture for HashiCorp Terraform Enterprise
  implementations on Azure.
---

# Terraform Enterprise Azure Reference Architecture

## Introduction

This document provides recommended practices and a reference
architecture for HashiCorp Terraform Enterprise
implementations on Azure.

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

-> **Note:** This reference architecture focuses on the *External Services* operational mode.

Depending on the chosen [operational
mode](../index.html#operational-mode-decision),
the infrastructure requirements for Terraform Enterprise range from a single [Azure VM
instance](https://azure.microsoft.com/en-us/services/virtual-machines/) for
demo or proof of concept installations to multiple instances connected to
[Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/) and
[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) for a stateless production installation.

The following table provides high-level server recommendations and is meant as
a guideline. Of particular note is the strong recommendation to avoid non-fixed
performance CPUs, or “Burstable CPU” in Azure terms, such as B-series
instances.

### Terraform Enterprise Servers (Azure VMs)

| Type    | CPU    | Memory    | Disk | Azure VM Sizes   |
|---------|--------|-----------|------|------------------|
| Minimum | 4 core | 16 GB RAM | 50GB | Standard\_D4\_v4 |
| Scaled  | 8 core | 32 GB RAM | 50GB | Standard\_D8\_v4 |

#### Hardware Sizing Considerations

- The default osDisk size for most Linux images on Azure is 30GB. When
  increasing the size of the osDisk partition, there may be additional
  steps required to fully utilize the disk space, such as using a tool
  like `fdisk`. This process is documented in the Azure knowledge base
  article ["How to: Resize Linux osDisk partition on Azure"](https://blogs.msdn.microsoft.com/linuxonazure/2017/04/03/how-to-resize-linux-osdisk-partition-on-azure/).

- The minimum size would be appropriate for most initial production
  deployments or for development/testing environments.

- The scaled size is for production environments where there is a
  consistently high workload in the form of concurrent Terraform runs.

### PostgreSQL Database (Azure Database for PostgreSQL)

| Type    | CPU    | Memory    | Storage | Azure DB Sizes |
|---------|--------|-----------|---------|----------------|
| Minimum | 4 core | 8 GB RAM  | 50GB    | GP_Gen5_4      |
| Scaled  | 8 core | 16 GB RAM | 50GB    | GP_Gen5_8      |

#### Hardware Sizing Considerations

- The minimum size would be appropriate for most initial production
  deployments or for development/testing environments.
- The scaled size is for production environments where there is
  a consistent high workload in the form of concurrent Terraform
  runs.
  - Be aware that a 4 vCPU database has a maximum capacity of 1Tb.  For organizations which require long-term logging for audit, larger databases may be required.  The 8 vCPU database has a maximum of 1.5Tb.

### Object Storage (Azure Blob Storage)

An Azure Blob Storage
[container](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction#container)
must be specified during the Terraform Enterprise installation for application data to
be stored securely and redundantly away from the Azure VMs running the
Terraform Enterprise application. This Azure Blob Storage container must be in the same
region as the VMs and Azure Database for PostgreSQL instance.

We recommend that the virtual network containing the Terraform Enterprise servers be configured with a
[Virtual Network (VNet) service
endpoint](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview)
for Azure Storage. Vault is used to encrypt all application data stored
in the Azure Blob Storage container. This allows for further
[server-side
encryption](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption)
by Azure Blob Storage if required by your security policy.

For increased durability in a single-region deployment, we recommend using zone-redundant storage (ZRS) which synchronously writes across three Azure availability zones in the region.  For a multi-region deployment, use geo-zone-redundant storage (GZRS) for added region redundancy.

### Other Considerations

#### Additional Azure Resources

In order to successfully provision this reference architecture you must
also be permitted to create the following Azure resources:

  - [Resource Group(s)](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#resource-groups)

  - [Load Balancer](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)

  - [Virtual Network](https://azure.microsoft.com/en-us/services/virtual-network/)

  - [Subnet](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-subnet)

  - [Public IP](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-ip-addresses-overview-arm#public-ip-addresses)

  - [Managed Disk](https://azure.microsoft.com/en-us/services/managed-disks/)

  - [Network Interface](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface)

#### Network

To deploy Terraform Enterprise in Azure you will need to create new or use existing
networking infrastructure. The infrastructure diagram highlights some of
the key components. These elements are likely to be very unique to your
environment and not something this Reference Architecture can specify in
detail.

#### Load Balancer

There are a few options available:

- Azure Public Load Balancer: This is a layer-4 Load Balancer and offers the simplest solution Azure has to offer. In this mode you must do TLS pass-through and can not use a Web Application Firewall (WAF), although this is often mitigated with other firewall appliances that sit in front of the Load Balancer

- Azure Public Application Gateway: this is a layer-7 Load Balancer, offers more features and is more reliable than the public Load Balancer, but is more complex. In this mode, you can do TLS termination, however, you must also serve the same certificate on the backend instances essentially creating a pass-through scenario. You can use a Web Application Firewall (WAF) in this configuration. Application Gateway can utilize version 2 of the PaaS in Azure, but private IP addressing is not possible with this option

- Azure Private Application Gateway: this is a layer-7 Load Balancer, offers more features and is more reliable than the public Load Balancer, but is more complex. In this mode you can do TLS termination, however, you must also serve the same certificate on the backend instances, essentially creating a pass-through scenario, and you must also upload a private CA bundle to the Application Gateway. In the Private configuration, Application Gateway can utilize **ONLY** version 1 of the PaaS in Azure, but can use private IP addresses.

#### DNS

DNS can be configured outside of Azure or using
[Azure
DNS](https://azure.microsoft.com/en-gb/services/dns/). The fully
qualified domain name should resolve to the Load Balancer. Creating the
required DNS entry is outside the scope of this guide.

#### SSL/TLS

An SSL/TLS certificate is required for secure communication between
clients and the Terraform Enterprise application server. The certificate can be
specified during the UI-based installation or the path to the
certificate codified during an unattended installation.

### Infrastructure Diagram - Standalone

![azure-infrastructure-diagram](./assets/RA-TFE-SA-Azure-SingleRegion.png)

The above diagram show the infrastructure components at a high-level.

-> **Note:** The diagram shows an Azure load balancer but for private IP usage in a hybrid model, use an Azure Application Gateway v1. Also note that the VM Scale Set would be declared as multi-zone in order to benefit from cross-availability zone redundancy.

### Application Layer

For a single-region deployment, the Application Layer is composed of a multi-AZ VM scale set of one Terraform Enterprise server (Azure VM) running in different availability zones in a single subnet. Were the VM to fail due to unplanned events such as hardware or software faults or a network issue such as an availability zone outage, the scale set would recreate the instance in the other zone.

-> **Note:** As Microsoft currently do not support multi-region global load balancing using private IP addressing, a multi-region deployment is only possible using public IP addressing.  See [this document](https://docs.microsoft.com/en-us/azure/architecture/guide/technology-choices/load-balancing-overview#decision-tree-for-load-balancing-in-azure) for more information.

### Storage Layer

The Storage Layer is composed of multiple service endpoints (Azure Database for PostgreSQL and
Azure Blob Storage) all configured with or benefitting from
inherent resiliency provided by Azure.

#### Additional Information

- [Azure Database for PostgreSQL deployments](https://docs.microsoft.com/en-us/azure/postgresql/concepts-business-continuity)

- [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

## Infrastructure Provisioning

The recommended way to deploy Terraform Enterprise is through use of a Terraform
configuration that defines the required resources, their references to
other resources, and associated dependencies.

## Normal Operation

### Component Interaction

The Load Balancer routes all traffic to the active Terraform Enterprise instance, which
handles all requests to the Terraform Enterprise application.

The Terraform Enterprise application is connected to the PostgreSQL database via the
Azure provided database server name endpoint. All database requests are
routed to the highly available infrastructure supporting Azure Database for PostgreSQL.

The Terraform Enterprise application is connected to object storage via the Azure Blob
Storage endpoint for the defined container. All object storage requests
are routed to the highly available infrastructure supporting Azure Storage.

### Monitoring

There is not currently a full monitoring guide for Terraform Enterprise. The following pages include information relevant to monitoring:

- [Logging](../../admin/logging.html)
- [Diagnostics](../../support/index.html)
- [Reliability and Availability](../../system-overview/reliability-availability.html)

### Upgrades

See [the Upgrades section](../../admin/upgrades.html) of the documentation.

## High Availability - Failure Scenarios

Azure provides availability and reliability recommendations on [Azure reliability](https://azure.microsoft.com/en-us/features/reliability/). Working in accordance with those recommendations, the Terraform Enterprise Reference Architecture is designed to handle different failure
scenarios that have different probabilities. As the architecture evolves it will provide a
higher level of service continuity.

### Terraform Enterprise Server

By utilizing an VM Scale Set, a Terraform Enterprise instance can automatically recover
in the event of any outage except for the loss of an entire region.

In the event of a Terraform Enterprise instance failing in a way that Azure can observe, the health checks on the VM Scale Set trigger, causing a replacement instance to be launched. Once launched, it reinitializes the software, and on completion, processing on this Azure VM will resume as normal.

With *External Services* (PostgreSQL Database, Object Storage) in use,
there is still some application configuration data present on the Terraform Enterprise server
such as installation type, database connection settings, hostname. This data
rarely changes. If the configuration on Terraform Enterprise changes you should include this updated scale set configuration so that any newly launched instance uses this it.

### PostgreSQL Database

The Azure Database for PostgreSQL service provides a guaranteed high
level of availability. The financially backed service level agreement
(SLA) is 99.99% upon general availability. There is virtually no
application down time when using this service. More information on Azure
Database for PostgreSQL service redundancy is available in the
[Azure
documentation](https://docs.microsoft.com/en-us/azure/postgresql/concepts-high-availability).

### Object Storage

Using Azure Blob Storage as an external object store leverages the
highly available infrastructure provided by Azure. More information on
Azure Storage redundancy is available in the
[Azure
documentation](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy).

## Disaster Recovery - Failure Scenarios

Azure provides availability and reliability recommendations on [Azure reliability](https://azure.microsoft.com/en-us/features/reliability/).Working in accordance with those recommendations the  Terraform Enterprise Reference Architecture is designed to handle different failure
scenarios that have different probabilities. The ability to provide better
service continuity will improve as the architecture evolves.

### Data Corruption

The Terraform Enterprise application architecture relies on multiple service endpoints
(Azure DB and Azure Storage) all providing their own backup and
recovery functionality to support a low MTTR in the event of data
corruption.

### PostgreSQL Database

Backup and recovery of PostgreSQL is managed by Azure and configured
through the Azure portal or CLI. More details of Azure DB for PostgreSQL
features are available
[here](https://docs.microsoft.com/en-us/azure/postgresql/concepts-backup)
and summarised below:

> *Automated Backups – Azure Database for PostgreSQL automatically
> creates server backups and stores them in user configured locally
> redundant or geo-redundant storage.*
>
> *Backup redundancy – Azure Database for PostgreSQL provides the
> flexibility to choose between locally redundant or geo-redundant
> backup storage.*

### Object Storage

There is no automatic backup/snapshot of Azure Blob Storage by Azure, so it
is recommended to script a container copy process from the container
used by the Terraform Enterprise application to a “backup container” in Azure Blob Storage
that runs at regular intervals. It is important the copy process is not
so frequent that data corruption in the source content is copied to the
backup before it is identified.

## Multi-Region Deployment to Address Region Failure

Terraform Enterprise is currently architected to provide high availability within a
single Azure Region only. It is possible to deploy to multiple Azure Regions to give you greater
control over your recovery time in the event of a hard dependency
failure on a regional Azure service. In this section, implementation patterns to support this are discussed.

An identical infrastructure should be provisioned in a secondary Azure
Region. Depending on recovery time objectives and tolerances for
additional cost to support Azure Region failure, the infrastructure can be
running (Warm Standby) or stopped (Cold Standby). In the event of the primary Azure Region hosting the Terraform Enterprise
application failing, the secondary Azure Region will require some
configuration before traffic is directed to it along with some global
services such as DNS.

  - [Azure Database for PostgreSQL's
    geo-restore
    feature](https://docs.microsoft.com/en-us/azure/postgresql/concepts-business-continuity)
    provides the ability to recover the database backup to the
    secondary Azure Region.

  - [Geo-zone-redundant storage (GZRS) for Azure
    Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy#redundancy-in-a-secondary-region)
    must be configured so the object storage component of the Storage
    Layer is available in the secondary Azure Region.

  - DNS must be redirected to the Load Balancer acting as the entry
    point for the infrastructure deployed in the secondary Azure
    Region.

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

![aws-aa-infrastructure-diagram](./assets/RA-TFE-AA-Azure-SingleRegion.png)

The above diagram shows the infrastructure components of an _Active/Active_ implementation at a high-level.

### Infrastructure Requirements

#### Active Nodes

The diagram depicts two active nodes to be concise. Additional nodes can be added by altering your configuration to launch another instance that points to the same shared external services. The number and sizing of nodes should be based on load requirements and redundancy needs. Nodes should be deployed in alternate zones to accommodate zone failure.

The cluster is comprised of essentially independent nodes in a SaaS type model. There are no concerns of leader election or minimal or optimum node counts. When a new node enters the cluster it simply starts taking new work from the load balancer and from the memory cache queue and thus spreading the load horizontally.

#### Memory Cache

The Azure implementation of the memory cache is handled by [Azure Cache for Redis](https://azure.microsoft.com/en-us/services/cache/). Specifically documented in [Azure Cache for Redis Documentation](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/).

[About Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview) provides a high level walk-through of implementing the memory cache with a description of some of the implementation options. Primary differentiators are set by tiers from "Basic" to "Enterprise Flash" described [this section](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview#service-tiers) including a chart by feature sets . The primary differences are sizing/capacity and how far high availability and fault tolerance might extend. Note that only the Premium and Enterprise tiers provide persistence and encryption and true zone redundancy.  The enterprise tiers involve actually acquiring Redis Enterprise licencees through the Azure Marketplace which is an option if that level of direct vendor support is desired/required. You can start at a lower tier and migrate upwards, however, migrating downwards is not supported, other than re-creating the memory cache.

You should start by selecting the tier level appropriate to the environment you are deploying. A lower testing or sandbox environment could use a Basic or Standard tier. However, a production level environment should always be configured with Premium or Enterprise tiers to benefit from the HA features that coincide with the other external services in the Terraform Enterprise platform. Additional considerations described in [Best practices](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices) can be useful for ensuring reliability and failover requirements for the environment.

Sizing for Azure Cache for Redis is determined by the tier, tier family, and capacity. Cache Names within tiers specify the sizing such as shown in these [pricing tables](https://azure.microsoft.com/en-au/pricing/details/cache/). You can start the size off in a small to moderate range such as a "P1" for Premium tier, with some consideration of anticipated active load, and scale up or down as demand is understood with the aid of [monitor Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-monitor).

Enterprise-grade security is inherently covered in the Azure Cache for Redis implementation because Redis instances are protected with [network isolation options](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-network-isolation) and particularly with [virtual network support](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-premium-vnet) in the Premium tier. There is also [detailed security information](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/security-baseline) available for hardening your implementation.

Terraform Enterprise supports Redis versions 4.0 and 5.0, but 5.0 is recommended unless there is strong reason to deviate. Azure Cache for Redis supports 5.0 and 6.0 as a preview mode, so still remain with 5.0 until 6.0 has been certified everywhere and do explicitly specify the version. The minimum TLS version can also be configured and defaults to 1.0 - you should explicitly set it to 1.2 for latest.

Terraform Enterprise _Active/Active_ does not currently support the Redis cluster protocol, so you should not enable clustering for a successful _Active/Active_ setup.

### Normal Operation

#### Component Interaction

The Load Balancer routes all traffic to the Terraform Enterprise instance, which is managed by
an VM Scale Set. This is a standard round-robin distribution for now, with no accounting for current load on the nodes. The instance counts on the VM Scale Set control the number of nodes in operation and can be used to increase or decrease the number of active nodes.

_Active/Active_ Terraform Enterprise is not currently architected to support dynamic scaling based on load or other factors. The maximum and minimum instance counts on the VM Scale Set should be set to the same value. Adding a node can be done at will bt setting these values. However, removing a node requires that the node be allowed to finish active work and stop accepting new work before being terminated. The operational documentation has the details on how to "drain" a node.

#### Replicated Console

The Replicated Console that allows access to certain information and realtime configuration for _Standalone_ is not available in _Active/Active_. This functionality, including generating support bundles, has been replaced with CLI commands to be executed on the nodes. The operational documentation has the details on how to utilize these commands.

#### Upgrades

Upgrading the Terraform Enterprise version still follows a similar pattern as with _Standalone_. However, there is not an online option with the Replicated Console. It is possible to upgrade a minor release with CLI commands in a rolling fashion. A "required" release or any change that potentially affects the shared external services will need to be done with a short outage. This involves scaling down to a single node, replacing that node, and then scaling back out. The operational documentation has the details on how these processes can operate.

### Failure Scenarios

#### Memory Cache

As mentioned, the Azure Cache for Redis service at the proper tier level provides automatic replication and failover. In the event of a larger failure or any normal maintenance with proper draining, the memory cache will not be required to be restored. If it is damaged it can be re-paved, and if not it can be left to continue operation.

### Multi-Region Implementation to Address Region Failure

Similar to _Standalone_, _Active/Active_ Terraform Enterprise is currently architected to provide high availability within a
single region. You cannot deploy additional nodes associated to the primary cluster in different regions. It is possible to deploy to multiple regions to give you greater
control over your recovery time in the event of a hard dependency
failure on a regional service. An identical infrastructure will still need to be instantiated separately with a failover scenario resulting in control of processing being transferred to the second implementation, as described in the earlier section on this topic. In addition, this identical infrastructure will require its own Memory Cache external service instance.
