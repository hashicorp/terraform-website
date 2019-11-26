---
layout: "enterprise"
page_title: "Clustered Deployment Architecture - Before Installing - Terraform Enterprise"
---

# Architecture Overview for Clustered Deployment

Terraform Enterprise's clustered deployment method deployes Terraform Enterprise in a flexible and scalable architecture, which can range from a three-node cluster to over a hundred nodes.

## Terraform-based Deployment

The clustered deployment method relies on HashiCorp-provided per-cloud Terraform modules, which provision the necessary resources and automate installation and configuration.

We expect operators to keep the resulting Terraform state avaliable _outside of Terraform Enterprise,_ so that Terraform runs that affect Terraform Enterprise's availability are not, themselves, dependent on Terraform Enterprise's availability.

## Application Instances

A Terraform Enterprise cluster consists of two types of servers: primaries and secondaries (also called workers). The primary instances run additional, stateful services that the secondaries do not.

There should always be three primary nodes to ensure cluster stability, but the cluster can scale by adding or removing secondary nodes.

Clustered deployment relies on a Terraform module to provision infrastructure. Cluster size is controlled by the module's input variables, and the number of secondary instances can be changed at any time by editing the variables and re-applying the configuration.

## Load Balancing

A Terraform Enterprise cluster relies on a load balancer to direct traffic to application instances.

## Capacity Management

There is a direct relationship between a cluster's total resources and the amount of work it can do concurrently.

By default, each Terraform run is allocated 512MB of RAM which has the majority of the impact upon the ability to schedule new Terraform runs.

To calculate how big a cluster should be, a customer needs to first decide how many concurrent Terraform runs they require. For instance, if they need to be able to execute 100 runs simultaniously, then the cluster needs to have at least 50GB of RAM available for runs. Because the services that run the Terraform Enterprise application run also share that memory, we suggest adding 16GB to the number. So in this case, the cluster would require 66GB of RAM. **The most common way to achieve at least 66GB of cluster RAM is a pool of 5 secondary instances and 3 primary instances, all with 16GB of RAM**.

The amount of memory used per Terraform run is configurable in the Management UI and changing that amount will alter the maximum concurrent capacity of the cluster.

## Architecture Diagrams

The following diagrams represent the architectures used on the three supported cloud platforms:

### AWS

![AWS architecture diagram. Includes a load balancer, three primary instances, and multiple secondary instances in multiple zones, whach are part of an auto-scaling group.](https://github.com/hashicorp/terraform-aws-terraform-enterprise/blob/master/assets/aws_diagram.jpg?raw=true)

### GCP

![Google Cloud Platform architecture diagram. Includes a load balancer, three primary instances, and multiple secondary instances in multiple zones, which are part of a managed instance group.](https://github.com/hashicorp/terraform-google-terraform-enterprise/blob/master/assets/gcp_diagram.jpg?raw=true)

### Azure

![Azure architecture diagram. Includes a load balancer, three primary instances, and multiple secondary instances, which are part of a scaleset. Also includes an adjacent key vault for TLS.](https://github.com/hashicorp/terraform-azurerm-terraform-enterprise/blob/master/assets/azure_diagram.png?raw=true)

## Data Storage

Clustered deployment is designed for use with external data services. These include a PostgreSQL database and a blob storage service.

These services are outside the scope of the module that deploys Terraform Enterprise; the operator is expected to provision and configure the services prior to installation, and provide access information and credentials as inputs to the module.

The clustered deployment modules can also deploy a temporary demo of Terraform Enterprise that does not require external data services.
