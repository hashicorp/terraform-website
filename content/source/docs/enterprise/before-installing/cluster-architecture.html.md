---
layout: "enterprise_cluster"
hidden: true
page_title: "Clustered Deployment Architecture - Before Installing - Terraform Enterprise"
---

# Architecture Overview for Clustered Deployment

Terraform Enterprise's clustered deployment method deploys Terraform Enterprise in a flexible and scalable architecture, which can range from a three-node cluster to over a hundred nodes.

~> **Important:** The clustered version of Terraform Enterprise is in Controlled Availability as we refine the installation experience. Access is currently restricted to a select group of existing customers, and you should not attempt to install it until it reaches General Availability.

## Terraform-based Deployment

The clustered deployment method relies on HashiCorp-provided per-cloud Terraform modules, which provision the necessary resources and automate installation and configuration.

We expect operators to keep the resulting Terraform state available _outside of Terraform Enterprise,_ so that Terraform runs that affect Terraform Enterprise's availability are not, themselves, dependent on Terraform Enterprise's availability.

## Application Instances

A Terraform Enterprise cluster consists of two types of servers: primaries and secondaries (also called workers). The primary instances run additional, stateful services that the secondaries do not.

There should always be three primary nodes to ensure cluster stability, but the cluster can scale by adding or removing secondary nodes.

Clustered deployment relies on a Terraform module to provision infrastructure. Cluster size is controlled by the module's input variables, and the number of secondary instances can be changed at any time by editing the variables and re-applying the configuration.

## Load Balancing

A Terraform Enterprise cluster relies on a load balancer to direct traffic to application instances.

## Capacity Management

There is a direct relationship between a cluster's total resources and the amount of work it can do concurrently.

Run concurrency is usually limited by memory. By default, each Terraform run is allocated 512MB of RAM, and a cluster can schedule new runs as long as one of its instances has enough memory available.

To calculate how big a cluster should be, first decide how many concurrent Terraform runs you require. For instance, if you need to be able to execute 100 runs simultaneously, then the cluster needs at least 50GB of RAM available for runs. Because the services that run the Terraform Enterprise application run also share that memory, we suggest adding 16GB to the number. So in this case, the cluster would require 66GB of RAM. The most common way to achieve at least 66GB of cluster RAM is a pool of 5 secondary instances and 3 primary instances, all with 16GB of RAM.

The amount of memory used per Terraform run is configurable in the installer dashboard (`https://<TFE HOSTNAME>:8800`), and changing that amount will alter the maximum concurrent capacity of the cluster.

## Architecture Diagrams

The following diagrams represent the architectures used on the three supported cloud platforms:

### AWS

![AWS architecture diagram. Includes a load balancer, three primary instances, and multiple secondary instances in multiple zones, which are part of an auto-scaling group.](https://github.com/hashicorp/terraform-aws-terraform-enterprise/blob/master/assets/aws_diagram.jpg?raw=true)

### GCP

![Google Cloud Platform architecture diagram. Includes a load balancer, three primary instances, and multiple secondary instances in multiple zones, which are part of a managed instance group.](https://github.com/hashicorp/terraform-google-terraform-enterprise/blob/master/assets/gcp_diagram.jpg?raw=true)

### Azure

![Azure architecture diagram. Includes a load balancer, three primary instances, and multiple secondary instances, which are part of a scaleset. Also includes an adjacent key vault for TLS.](https://github.com/hashicorp/terraform-azurerm-terraform-enterprise/blob/master/assets/azure_diagram.png?raw=true)

## Data Storage

Clustered deployment is designed for use with external data services. These include a PostgreSQL database and a blob storage service.

These services are outside the scope of the module that deploys Terraform Enterprise; the operator is expected to provision and configure the services prior to installation, and provide access information and credentials as inputs to the module.

The clustered deployment modules can also deploy a temporary demo of Terraform Enterprise that does not require external data services.
