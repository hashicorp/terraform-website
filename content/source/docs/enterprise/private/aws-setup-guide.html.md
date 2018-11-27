---
layout: "enterprise2"
page_title: "Private Terraform Enterprise - Reference Architecture - AWS"
sidebar_current: "docs-enterprise2-private-reference-architecture-aws"
description: |-
  This document provides recommended practices and a reference architecture for
  HashiCorp Private Terraform Enterprise (PTFE) implementations on AWS.
---

# Private Terraform Enterprise AWS Reference Architecture

This document provides recommended practices and a reference architecture for
HashiCorp Private Terraform Enterprise (PTFE) implementations on AWS.

## Required Reading

Prior to making hardware sizing and architectural decisions, read through the
[installation information available for
PTFE](https://www.terraform.io/docs/enterprise/private/install-installer.html)
to familiarise yourself with the application components and architecture.
Further, read the [reliability and availability
guidance](https://www.terraform.io/docs/enterprise/private/reliability-availability.html)
as a primer to understanding the recommendations in this reference
architecture.

## Infrastructure Requirements

-> **Note:** This reference architecture focuses on the _Production - External
Services_ operational mode.

Depending on the chosen [operational
mode](https://www.terraform.io/docs/enterprise/private/preflight-installer.html#operational-mode-decision),
the infrastructure requirements for PTFE range from a single AWS EC2 instance
for demo installations to multiple instances connected to RDS and S3 for a
stateless production installation.

The following table provides high-level server guidelines. Of particular
note is the strong recommendation to avoid non-fixed performance CPUs,
or “Burstable CPU” in AWS terms, such as T-series instances.

### PTFE Server (EC2 via Auto Scaling Group)

| Type        | CPU      | Memory       | Disk | AWS Instance Types    |
|-------------|----------|--------------|------|-----------------------|
| Minimum     | 2 core   | 8 GB RAM     | 50GB | m5.large              |
| Recommended | 4-8 core | 16-32 GB RAM | 50GB | m5.xlarge, m5.2xlarge |

#### Hardware Sizing Considerations

- The minimum size would be appropriate for most initial production
  deployments, or for development/testing environments.

- The recommended size is for production environments where there is a
  consistent high workload in the form of concurrent terraform runs.

### PostgreSQL Database (RDS Multi-AZ)

| Type        | CPU      | Memory       | Storage | AWS Instance Types          |
|-------------|----------|--------------|---------|-----------------------------|
| Minimum     | 2 core   | 8 GB RAM     | 50GB    | db.m4.large                 |
| Recommended | 4-8 core | 16-32 GB RAM | 50GB    | db.m4.xlarge, db.m4.2xlarge |

#### Hardware Sizing Considerations

- The minimum size would be appropriate for most initial production
  deployments, or for development/testing environments.

- The recommended size is for production environments where there is a
  consistent high workload in the form of concurrent terraform runs.

### Object Storage (S3)

An [S3 Standard](https://aws.amazon.com/s3/storage-classes/) bucket must be
specified during the PTFE installation for application data to be stored
securely and redundantly away from the EC2 servers running the PTFE
application. This S3 bucket must be in the same region as the EC2 and RDS
instances. It is recommended the VPC containing the PTFE servers be configured
with a [VPC endpoint for
S3](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html).
Within the PTFE application, Vault is used to encrypt all application data stored in the S3 bucket.  This
allows for further [server-side
encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html)
by S3 if required by your security policy.

### Other Considerations

#### Additional AWS Resources

In order to successfully provision this reference architecture you must
also be permitted to create the following AWS resources:

- VPC
- Subnet
- Route Table
- Route Table Association
- Security Group
- Load Balancer (Application, Network, or Classic Load Balancer)
- Launch Configuration
- Auto Scaling Group
- Target Group (if using Application or Network Load Balancer)
- CloudWatch Alarm
- IAM Instance Profile
- IAM Role
- IAM Role Policy
- Route 53 (optional)

#### Network

To deploy PTFE in AWS you will need to create new or use existing
networking infrastructure. The below infrastructure diagram highlights
some of the key components (VPC, subnets, DB subnet group) and you will
also have security group, routing table and gateway requirements. These
elements are likely to be very unique to your environment and not
something this Reference Architecture can specify in detail. An [example Terraform
configuration](https://github.com/hashicorp/private-terraform-enterprise/blob/master/examples/aws/network/main.tf)
is provided to demonstrate how these resources can be provisioned and
how they interrelate.

#### DNS

DNS can be configured external to AWS or using [Route 53](https://aws.amazon.com/route53/). The
fully qualified domain name should resolve to the Load Balancer (if using one) or the PTFE instance using a
CNAME if using external DNS or an [alias
record set](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
if using Route 53. Creating the required DNS entry is outside the scope
of this guide.

Another approach would be to use an external registrar or DNS server to point to a Route 53 CNAME record using
a canonical, but not necessarily public, domain name, which then forwards to the ALIAS record for the ELB. This
pattern is required if using Route 53 Health Checks and failover pairs to automatically fail over to the standby
instance. This is documented further below.

#### SSL/TLS Certificates and Load Balancers

An SSL/TLS certificate signed by a public or private CA is required for secure communication between
clients, VCS systems, and the PTFE application server. The certificate can be specified during the
UI-based installation or in a configuration file used for an unattended installation.

If a Classic or Application Load Balancer is used, SSL/TLS will be terminated on the load balancer.
In this configuration, the PTFE instances should still be configured to listen
for incoming SSL/TLS connections. If a Network Load Balancer is used, SSL/TLS will be terminated on the PTFE instance.

HashiCorp does not recommend the use of self-signed certificates on the PTFE instance unless you use a
Classic or Application Load Balancer and place a public certificate (such as an AWS Certificate Manager certificate)
on the load balancer. Note that certificates cannot be placed on Network Load Balancers.

If you want to use a Network Load Balancer (NLB) with PTFE, use either an internet-facing NLB or an internal NLB that targets by IP.
An internal NLB that targets by instance ID cannot be used with PTFE since NLBs configured in this way do not support loopbacks.
Amazon provides [load balancer troubleshooting](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-troubleshooting.html)
information for Network Load Balancers.

A public AWS Certificate Manager (ACM) certificate cannot be used with a Network Load Balancer and PTFE since certificates cannot
be placed on NLBs and AWS does not support exporting the private key for public ACM certificates. This means you cannot load
the private key of a public ACM certificate on your PTFE instance.

## Infrastructure Diagram

![aws-infrastructure-diagram-asg](./assets/aws-setup-guide-ptfe-asg.png)

### Application Layer

The Application Layer is composed of two PTFE servers (EC2 instances)
running in different Availability Zones and operating in a main/standby
configuration. Traffic is routed only to *PTFE-main* via one of the above infrastructure options. 

### Storage Layer

The Storage Layer is composed of multiple service endpoints (RDS, S3) all
configured with or benefiting from inherent resiliency
provided by AWS.

#### Additional Information

- [RDS Multi-AZ deployments](https://aws.amazon.com/rds/details/multi-az/).

- [S3 Standard storage class](https://aws.amazon.com/s3/storage-classes/).

## Infrastructure Provisioning

The recommended way to deploy PTFE is through use of a Terraform configuration
that defines the required resources, their references to other resources, and
dependencies. An [example Terraform
configuration](https://github.com/hashicorp/private-terraform-enterprise/blob/master/examples/aws/pes/main.tf)
is provided to demonstrate how these resources can be provisioned and how they
interrelate. This Terraform configuration assumes the required networking
components are already in place. If you are creating networking components for
this PTFE installation, an [example Terraform configuration is available for
the networking
resources](https://github.com/hashicorp/private-terraform-enterprise/blob/master/examples/aws/network/main.tf)
as well.

## Normal Operation

### Component Interaction

The Load Balancer routes all traffic to the *PTFE* instance, which is managed by
an Auto Scaling Group with maximum and minimum instance counts set to 1.

The PTFE application is connected to the PostgreSQL database via the RDS
Multi-AZ endpoint and all database requests are routed via the RDS
Multi-AZ endpoint to the *RDS-main* database instance.

The PTFE application is connected to object storage via the S3 endpoint
for the defined bucket and all object storage requests are routed to the
highly available infrastructure supporting S3.

### Upgrades

See [the Upgrades section](./upgrades.html) of the documentation.

## High Availability

### Failure Scenarios

AWS provides availability and reliability recommendations in the [Well-Architected
framework](https://aws.amazon.com/architecture/well-architected/).
Working in accordance with those recommendations the PTFE Reference
Architecture is designed to handle different failure scenarios with
different probabilities. As the architecture evolves it may provide a
higher level of service continuity.

#### Single EC2 Instance Failure

In the event of the *PTFE* instance failing in a way that AWS can
observe, the health checks on the Auto Scaling Group trigger, causing
a new instance to be launched. Once the new EC2 instance is launched,
it reinitializes the software and once that is complete, service would
resume as normal.

#### Availability Zone Failure

In the event of the Availability Zone hosting the main instances (EC2
and RDS) failing, the Auto Scaling Group for the EC2 instance will automatically
begin booting a new one in an operational AZ.

- Multi-AZ RDS automatically fails over to the RDS Standby Replica
  (*RDS-standby*). The [AWS documentation provides more
  detail](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
  on the exact behaviour and expected impact.

- S3 is resilient to Availability Zone failure based on its architecture.

See below for more detail on how each component handles Availability
Zone failure.

##### PTFE Server

By utilizing an Auto Scaling Group, the PTFE instance automatically recovers
in the event of any outage except for the loss of an entire region.

With external services (PostgreSQL Database, Object Storage) in use,
there is still some application configuration data present on the PTFE server
such as installation type, database connection settings, hostname. This data
rarely changes. If the configuration on *PTFE* changes you should update the
Launch Configuration to include this updated configuration so that any newly
launched EC2 instance uses this new configuration.

##### PostgreSQL Database

Using RDS Multi-AZ as an external database service leverages the highly
available infrastructure provided by AWS. From the AWS website:

> *In a Multi-AZ deployment, Amazon RDS automatically provisions and
> maintains a synchronous standby replica in a different Availability
> Zone. In the event of a planned or unplanned outage of your DB
> instance, Amazon RDS automatically switches to a standby replica in
> another Availability Zone. ([source](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html))*

##### Object Storage

Using S3 as an external object store leverages the highly available
infrastructure provided by AWS. S3 buckets are replicated to all
Availability Zones within the region selected during bucket creation.
From the AWS website:

> *Amazon S3 runs on the world’s largest global cloud infrastructure,
> and was built from the ground up to deliver a customer promise of
> 99.999999999% of durability. Data is automatically distributed across
> a minimum of three physical facilities that are geographically
> separated within an AWS Region. ([source](https://aws.amazon.com/s3/))*

## Disaster Recovery

### Failure Scenarios

AWS provides availability and reliability recommendations in the
Well-Architected framework. Working in accordance with those
recommendations the PTFE Reference Architecture is designed to handle
different failure scenarios that have different probabilities. As the
architecture evolves it may provide a higher level of service
continuity.

#### Region Failure

PTFE is currently architected to provide high availability within a
single AWS Region. Using multiple AWS Regions will give you greater
control over your recovery time in the event of a hard dependency
failure on a regional AWS service. In this section, we’ll discuss
various implementation patterns and their typical availability.

An identical infrastructure should be provisioned in a secondary AWS
Region. Depending on recovery time objectives and tolerances for
additional cost to support AWS Region failure, the infrastructure can be
running (Warm Standby) or stopped (Cold Standby). In the event of the
primary AWS Region hosting the PTFE application failing, the secondary
AWS Region will require some configuration before traffic is directed to
it along with some global services such as DNS.

- [RDS cross-region read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html#USER_ReadRepl.XRgn) can be used in a warm standby architecture or [RDS database backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_CommonTasks.BackupRestore.html) can be used in a cold standby architecture.

- [S3 cross-region replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/crr.html) must be configured so the object storage component of the Storage Layer is available in the secondary AWS Region.

- DNS must be redirected to the Load Balancer acting as the entry point for the infrastructure deployed in the secondary AWS Region.

#### Data Corruption

The PTFE application architecture relies on multiple service endpoints
(RDS, S3) all providing their own backup and recovery
functionality to support a low MTTR in the event of data corruption.

##### PTFE Servers

With external services (PostgreSQL Database, Object Storage) in
use, there is still some application configuration data present on the
PTFE server such as installation type, database connection settings,
hostname. This data rarely changes. We recommend [configuring automated
snapshots](https://www.terraform.io/docs/enterprise/private/automated-recovery.html#1-configure-snapshots)
for this installation data so it can be recovered in the event of data
corruption.

##### PostgreSQL Database

Backup and recovery of PostgreSQL is managed by AWS and configured
through the AWS management console on CLI. More details of RDS for
PostgreSQL features are available [here](https://aws.amazon.com/rds/postgresql/)
and summarised below:

> *Automated Backups – The automated backup feature of Amazon RDS is
> turned on by default and enables point-in-time recovery for your DB
> Instance. Amazon RDS will backup your database and transaction logs
> and store both for a user-specified retention period.*
>
> *DB Snapshots – DB Snapshots are user-initiated backups of your DB
> Instance. These full database backups will be stored by Amazon RDS
> until you explicitly delete them.*

##### Object Storage

There is no automatic backup/snapshot of S3 by AWS, so it is recommended
to script a bucket copy process from the bucket used by the PTFE
application to a “backup bucket” in S3 that runs at regular intervals.
The [Amazon S3 Standard-Infrequent
Access](https://aws.amazon.com/s3/storage-classes/) storage class
is identified as a solution targeted more for DR backups than S3
Standard. From the AWS website:

> *Amazon S3 Standard-Infrequent Access (S3 Standard-IA) is an Amazon S3
> storage class for data that is accessed less frequently, but requires
> rapid access when needed. S3 Standard-IA offers the high durability,
> high throughput, and low latency of S3 Standard, with a low per GB
> storage price and per GB retrieval fee. This combination of low cost
> and high performance make S3 Standard-IA ideal for long-term storage,
> backups, and as a data store for disaster recovery. ([source](https://aws.amazon.com/s3/storage-classes/))*
