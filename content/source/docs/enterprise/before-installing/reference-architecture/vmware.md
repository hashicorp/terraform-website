---
layout: "enterprise"
page_title: "VMware Reference Architecture - Terraform Enterprise"
description: |-
  This document provides recommended practices and a reference architecture for
  HashiCorp Terraform Enterprise implementations on VMware.
---

# Terraform Enterprise VMware Reference Architecture

This document provides recommended practices and a reference architecture for
HashiCorp Terraform Enterprise implementations on VMware.

## Required Reading

Prior to making hardware sizing and architectural decisions, read through the
[pre-install checklist](../index.html)
to familiarise yourself with the application components and architecture.
Further, read the [reliability and availability
guidance](../../system-overview/reliability-availability.html)
as a primer to understanding the recommendations in this reference
architecture.

## Infrastructure Requirements

-> **Note:** This reference architecture focuses on the _Production - Mounted Disk_ operational mode.

Depending on the chosen [operational
mode](../index.html#operational-mode-decision),
the infrastructure requirements for Terraform Enterprise range from a single virtual machine
for demo or proof of concept installations, to multiple virtual machines
hosting the Terraform Cloud application, PostgreSQL, and external Vault servers for
a stateless production installation.

This reference architecture focuses on the _Production - Mounted Disk_ operational mode. This mode will require you to specify the
local path for data storage. The assumption is this
local path is a mounted disk from either a SAN or NAS device (or some other
replicated storage), allowing for rapid recovery or failover. More information
about the *Mounted Disk* option can be found at the end of this document.

The following table provides high-level server recommendations as a guideline.
Please note, thick provision, lazy zeroed storage is preferred. Thin
provisioned is only recommended if you are using an external PostgreSQL database and external Vault server. Using thin provisioned disks when using
the internal database or Vault may result in serious performance issues.

### Terraform Enterprise Servers

| Type        | CPU Sockets | Total Cores\* | Memory       | Disk |
| ----------- | ----------- | ------------- | ------------ | ---- |
| Minimum     | 2           | 2             | 8 GB RAM     | 40GB |
| Recommended | 2           | 4             | 16-32 GB RAM | 40GB |

-> **Note:** Per VMWare’s recommendation, always allocate the least amount of CPU necessary. HashiCorp recommends starting with 2 CPUs and increasing if necessary.

#### Hardware Sizing Considerations

- The minimum size would be appropriate for most initial production
  deployments, or for development/testing environments.

- The recommended size is for production environments where there is
  a consistent high workload in the form of concurrent terraform
  runs.

- Please monitor the actual CPU utilization in vCenter before making
  the decision to increase the CPU allocation.

### Other Considerations

#### Network

To deploy Terraform Enterprise on VMWare you will need to create new or use existing networking
infrastructure that has access to any infrastructure you expect to
manage with the Terraform Enterprise server. If you plan to use your Terraform Enterprise server to manage or
deploy infrastructure on external providers (eg Amazon Web Services, Microsoft Azure or Google Cloud), you will need to make sure the Terraform Enterprise server has unimpeded access to those providers. The same goes for any other public or private datacenter the server will need to
connect with.

#### DNS

The fully qualified domain name should resolve to the IP address of the virtual
machine using an A record. Creating the required DNS entry is outside the scope
of this guide.

#### SSL/TLS

A valid, signed SSL/TLS certificate is required for secure communication between clients and
the Terraform Enterprise application server. Requesting a certificate is outside the scope
of this guide. You will be prompted for the public and private certificates during installation.

## Infrastructure Diagram

![vmware-mounted-disk-infrastructure-diagram](./assets/vmware-mounted-disk-infrastructure-diagram.jpg)

### Application Layer

The Application Layer is composed of an Auto Scaling Group and a Launch Configuration
providing an auto-recovery mechanism in the event of an instance or Availability Zone failure.

### Storage Layer

The Storage Layer is composed of multiple service endpoints (datastores,
asd
asd
asd

## Infrastructure Provisioning

The recommended way to deploy Terraform Enterprise for production is through use of a Terraform configuration
that defines the required resources, their references to other resources and
dependencies.

### Normal Operation

### Component Interaction

The PostgreSQL database will be run in a local container and data will be
written to the specified path (which should be a mounted storage device,
replicated and/or backed up frequently.)

State and other data will be
written to the specified local path (which should be a mounted storage
device, replicated and/or backed up frequently.)

Vault will be run in a local container and used only for transit data encryption and decryption. This stateless use of Vault provides easy recovery in the event of a Vault service failure.

### Monitoring

While there is not currently a full monitoring guide for Terraform Enterprise, information around
[logging](../../admin/logging.html),
[diagnostics](../../support/index.html)
as well as [reliability and
availability](../../system-overview/reliability-availability.html)
can be found on our website.

### Upgrades

See [the Upgrades section](../../admin/upgrades.html) of the documentation.

## High Availability

### Failure Scenarios

VMWare hypervisor provides a high level of resilience in various cases
of failure (at the server hardware layer through vMotion, at the storage
layer through RDS, and at the network layer through virtual distributed
networking.) In addition, having ESX failover to a DR datacenter
provides recovery in the case of a total data center outage (see the Disaster Recovery section).

#### Terraform Enterprise Servers (VMware Virtual Machine)

Through deployment of two virtual machines in different ESX clusters,
the Terraform Enterprise Reference Architecture is designed to provide improved
availability and reliability. Should the *TFE-main* server fail, it can
be recovered, or traffic can be routed to the *TFE-standby* server to
resume service when the failure is limited to the Terraform Enterprise server layer. The
load balancer should be manually updated to point to the stand-by Terraform Enterprise
VM after services have been started on it in the event of a failure.

#### Single ESX Server Failure

In the event of a single ESX server failure, ESX will vMotion the Terraform Enterprise virtual
machine to a functioning ESX host. This typically does not result in any
visible outage to the end-user.

#### ESX Cluster Failure

```
Check with Amy about this requirement

Check with Amy about this requirement

Check with Amy about this requirement
```

#### PostgreSQL Database

When running in mounted storage mode the PostgreSQL server runs inside a
Docker container. If the PostgreSQL service fails a new container should
be automatically created. However, if the service is hung, or otherwise
fails without triggering a new container deployment, the Terraform Enterprise server
should be stopped and the standby server started. All PostgreSQL data will
have been written to the mounted storage and will then be accessible on
the standby node.

#### Object Storage

The object storage will be stored on the mounted disk and the
expectation is that the NAS or SAN or other highly available mounted
storage is fault tolerant and replicated or has fast recovery available.
The configuration of the storage device is not covered in this document.
For more information about highly available storage please see your
storage vendor.

## Disaster Recovery

### Failure Scenarios

#### Terraform Enterprise Servers

Through deployment of two virtual machines in different ESX clusters,
the Terraform Enterprise Reference Architecture is designed to provide improved
availability and reliability. Should the *TFE-main* server fail, it can
be recovered, or traffic can be routed to the *TFE-standby* server to
resume service when the failure is limited to the Terraform Enterprise server layer. The
load balancer should be manually updated to point to the stand-by Terraform Enterprise
VM after services have been started on it in the event of a failure.

#### Mounted Disk - PostgreSQL Database

The PostgreSQL data will be written to the mounted storage. The
expectation is that the storage server is replicated or backed up
offsite and will be made available to the server in the event of a DR.

#### Mounted Disk - Object Storage

Object storage will be written to the mounted storage. The expectation
is that the storage server is replicated or backed up offsite and will
be made available to the server in the event of a DR.

#### ESX Cluster Failure

```
Check with Amy about this requirement

Check with Amy about this requirement

Check with Amy about this requirement
```
