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
mode](https://www.terraform.io/docs/enterprise/private/install-installer.html#operational-mode-decision),
the infrastructure requirements for PTFE range from a single AWS EC2 instance
for demo installations to multiple instances connected to RDS, S3, and an
external Vault cluster for a stateless production installation.

The following table provides high-level server guidelines. Of particular
note is the strong recommendation to avoid non-fixed performance CPUs,
or “Burstable CPU” in AWS terms, such as T-series instances.

### PTFE Server (EC2)

| Type        | CPU      | Memory       | Disk | AWS Instance Types    |
|-------------|----------|--------------|------|-----------------------|
| Minimum     | 2 core   | 8 GB RAM     | 50GB | m5.large              |
| Recommended | 4-8 core | 16-32 GB RAM | 50GB | m5.xlarge, m5.2xlarge |

#### Hardware Sizing Considerations

- The minimum size would be appropriate for most initial production
- deployments, or for development/testing environments.

- The recommended size is for production environments where there is a
- consistent high workload in the form of concurrent terraform runs.

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
Vault is used to encrypt all application data stored in the S3 bucket.  This
allows for further [server-side
encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html)
by S3 if required by your security policy.

### Vault Cluster

In order to provide a fully stateless application instance, PTFE must be
configured to speak with an [external Vault
cluster](https://www.terraform.io/docs/enterprise/private/vault.html).  This
reference architecture assumes that a highly available Vault cluster is
accessible at an endpoint the PTFE servers can reach.

For more information on setting up an external Vault cluster, please visit the [Vault 
Reference Architecture](https://www.vaultproject.io/guides/operations/reference-architecture.html).

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
- Target Group (if using an Application or Network Load Balancer)
- CloudWatch Alarm
- IAM Instance Profile
- IAM Role
- IAM Role Policy
- Route 53 (optional for High Availability)

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

## Infrastructure Diagrams

Below are two recommended infrastructure modes for PTFE, including a brief description of each.

### Load Balancer Mode

![aws-infrastructure-diagram-elb](./assets/aws-setup-guide-ptfe-elb.png)

In this design, we employ an AWS ELB or ALB to control primary/standby and traffic routing. ELB Configuration or
target group membership is used to designate the active node, and failover is managed manually by the operator.
Load balancers are configured in TCP passthrough so that SSL termination can occur on the Terraform instances directly.

### DNS Failover Pair Mode

![aws-infrastructure-diagram-route53](./assets/aws-setup-guide-ptfe-route53.png)

In this design, Route 53 Failover Pairs and Health Checks are used to automatically switch over to the standby instance
in the case of a master node failure. No human intervention is required to complete the failover action.

### Application Layer

The Application Layer is composed of two PTFE servers (EC2 instances)
running in different Availability Zones and operating in a main/standby
configuration. Traffic is routed only to *PTFE-main* via one of the above infrastructure options. 

### Storage Layer

The Storage Layer is composed of multiple service endpoints (RDS, S3,
Vault) all configured with or benefiting from inherent resiliency
provided by AWS (in the case of RDS and S3) or resiliency provided by a
well-architected deployment (in the case of Vault).

#### Additional Information

- [RDS Multi-AZ deployments](https://aws.amazon.com/rds/details/multi-az/).

- [S3 Standard storage class](https://aws.amazon.com/s3/storage-classes/).

- [Highly available Vault deployments](https://www.vaultproject.io/guides/operations/vault-ha-consul.html)

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

The Load Balancer routes all traffic to the *PTFE-main* instance, which
in turn handles all requests to the PTFE application.

The PTFE application is connected to the PostgreSQL database via the RDS
Multi-AZ endpoint and all database requests are routed via the RDS
Multi-AZ endpoint to the *RDS-main* database instance.

The PTFE application is connected to object storage via the S3 endpoint
for the defined bucket and all object storage requests are routed to the
highly available infrastructure supporting S3.

The PTFE application is connected to the Vault cluster via the Vault
cluster endpoint URL.

### Upgrades

See [the upgrading
section](https://www.terraform.io/docs/enterprise/private/install-installer.html#upgrading)
of the installation guide.

## High Availability

### Failure Scenarios

AWS provides availability and reliability recommendations in the [Well-Architected
framework](https://aws.amazon.com/architecture/well-architected/).
Working in accordance with those recommendations the PTFE Reference
Architecture is designed to handle different failure scenarios with
different probabilities. As the architecture evolves it may provide a
higher level of service continuity.

#### Single EC2 Instance Failure

In the event of the *PTFE-main* instance failing in a way that AWS can
observe, a CloudWatch alarm can trigger [EC2
instance
recovery](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html)
automatically. This would result in the EC2 instance being started on
different physical hardware. A recovered instance is identical to the
original instance, including the instance ID, private IP addresses,
Elastic IP addresses, and all instance metadata. Once the EC2 instance
is running again service would resume as normal.

#### Availability Zone Failure

In the event of the Availability Zone hosting the main instances (EC2
and RDS) failing, traffic must be routed to the standby instances to
resume service.

- If using a load balancer, the listener must be reconfigured to direct traffic to
  the *PTFE-standby* instance. This can be managed manually or automated.

- If using Route 53, no action is necessary, as the health checks will
  automatically change the CNAME pointer to the healthy standby instance.

- Multi-AZ RDS automatically fails over to the RDS Standby Replica
  (*RDS-standby*). The [AWS documentation provides more
  detail](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
  on the exact behaviour and expected impact.

- Both S3 and Vault are resilient to Availability Zone failure based
  on their architecture.

See below for more detail on how each component handles Availability
Zone failure.

##### PTFE Servers

Through deployment of two EC2 instances in different availability zones, the
PTFE Reference Architecture is designed in accordance with the [Reliability
Pillar of the AWS
Well-Architected](https://d1.awsstatic.com/whitepapers/architecture/AWS-Reliability-Pillar.pdf)
framework to provide improved availability and reliability. Should the
*PTFE-main* server fail, it can be automatically recovered, or traffic can be
routed to the *PTFE-standby* server to resume service when the failure is
limited to the PTFE server layer.

With external services (PostgreSQL Database, Object Storage, Vault) in use,
there is still some application configuration data present on the PTFE server
such as installation type, database connection settings, hostname. This data
rarely changes. If the application configuration has not changed since
installation, both *PTFE-main* and *PTFE-standby* will be using the same
configuration and no action is required. If the configuration on *PTFE-main*
changes you should [create a
snapshot](https://www.terraform.io/docs/enterprise/private/automated-recovery.html#1-configure-snapshots)
via the UI or CLI and recover this to *PTFE-standby* so both instances use the
same configuration.

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

##### Vault Cluster

For the purposes of this guide, the external Vault cluster is expected
to be deployed and configured in line with the [HashiCorp Vault Enterprise Reference
Architecture](https://www.vaultproject.io/guides/operations/reference-architecture.html).
This would provide high availability and disaster recovery support,
minimising downtime in the event of an outage.

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

- [Vault Disaster Recovery (DR) Replication](https://www.vaultproject.io/docs/enterprise/replication/index.html#performance-replication-and-disaster-recovery-dr-replication) must be configured for a Vault cluster in the secondary AWS Region.

- DNS must be redirected to the Load Balancer acting as the entry point for the infrastructure deployed in the secondary AWS Region.

#### Data Corruption

The PTFE application architecture relies on multiple service endpoints
(RDS, S3, Vault) all providing their own backup and recovery
functionality to support a low MTTR in the event of data corruption.

##### PTFE Servers

With external services (PostgreSQL Database, Object Storage, Vault) in
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

##### Vault Cluster

The recommended Vault Reference Architecture uses Consul for storage.
Consul provides the underlying [snapshot
functionality](https://www.consul.io/docs/commands/snapshot.html)
to support Vault backup and recovery.
