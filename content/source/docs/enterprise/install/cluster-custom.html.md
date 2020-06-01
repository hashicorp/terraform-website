---
layout: "enterprise_cluster"
hidden: true
page_title: "Custom - Clustered Deployment - Install and Config - Terraform Enterprise"
---

# Deploying a Terraform Enterprise Cluster into a Custom Environment

This page outlines the procedure for deploying a Terraform Enterprise cluster into a custom environment, using any type of cloud or on-premises infrastructure.

~> **Important:** The clustered version of Terraform Enterprise is in Controlled Availability as we refine the installation experience. Access is currently restricted to a select group of existing customers, and you should not attempt to install it until it reaches General Availability.

## Summary

Deploying Terraform Enterprise involves the following steps:

1. Follow the pre-install checklist.
1. Prepare the required infrastructure.
1. Configure and run the installer on the first primary instance.
1. Run the installer on the remaining primary instances.
1. Run the installer on the secondary instances.

## Pre-Install Checklist

Before you begin, follow the [Pre-Install Checklist](../before-installing/index.html) and ensure you have all of the prerequisites. This checklist includes several important decisions, some supporting infrastructure, and necessary credentials.

## Prepare Infrastructure

A Terraform Enterprise cluster requires several kinds of infrastructure resources, all configured to work together. This includes:

- Primary and secondary application instances
- Load balancers, both internal and external
- A PostgreSQL database
- Object storage
- Network connectivity over specific required ports

When deploying into a custom environment, you are responsible for provisioning and configuring every part of this infrastructure.

### Instances

The installation requires at least 3 primary nodes and any number of secondary nodes. The primary nodes run the cluster services themselves and are considered stateful instances. The secondary instances only run stateless workloads and can be added and removed from the cluster at will. At present, we recommend that the cluster not cycle through secondaries too quickly, as too much cluster reconfiguration can disrupt the cluster availability.

#### Disk Layout

The TFE installer puts all the cluster data into `/var`, which must have at least 100GB of storage available. We also recommend that `/` be at least 20GB.

#### Managing Secondary Instances

The secondary instances can be configured as an autoscaling group for easier management. This group can be configured for a static number of instances (for simplicity and cost control) or for elastic scaling (for fluctuating workloads).

If elastic scaling is enabled, it is common to configure a cooldown period between scaling events so as to not disrupt the cluster availability with too much cluster reconfiguration.

### Internal Load Balancer

The cluster relies on some internal API services that run on each of the primary nodes. For the cluster to operate properly, a load balancer should be configured to send TCP sessions to the primaries on the following ports. It is important that the load balancer not attempt to terminate the traffic as HTTPS because the clients and servers use an internally configured CA certificate chain for authentication.

- **Port 6443** — used for normal cluster operations.
- **Port 23010** — used to facilitate the cluster setup process.

### External Load Balancer

To provide access to the TFE application, an external load balancer should forward traffic to all instances on port 443. The load balancer should terminate the traffic as HTTPS and provide its own certificate before forwarding the traffic to the instances on 443. The load balancer should be configured to ignore certificate errors as the cluster is configured with a self-signed certificate.

### PostgreSQL Database

For proper production installations, a PostgreSQL database external to the cluster is required. We highly recommend that this database be configured to take automated backups for disaster recovery. Additionally, the resources available to the database should be in line with the size of the cluster itself.

We recommend at minimum 16GB of RAM and 100GB of storage for a basic server, scaling up with RAM as the number of cluster instances changes.

The database must be able to accept at least (cores in cluster / 3) * 41 concurrent connections. For example, if the cluster is using 6 instances with 4 cores each, it needs to allow (24 / 3) * 41, or 328 concurrent connections at a minimum.

### Object Storage

For proper production installations, an object storage service such as AWS S3 is required. The system supports S3, Azure Blob Storage, and Google Cloud Storage. S3-compatible servers such as MinIO are supported as well. The system should allow for a minimum of 250GB of storage to allow the system to safely grow as the number of Terraform states and logs increases.

### Network Configuration

The instances communicate with each other over TCP and UDP. The following list describes each port and where communication must be allowed to and from for the cluster to operate.

#### Ports

* From outside to all instances on 443/tcp — *Application HTTPS*
* From outside to all instances on 8800/tcp — *Cluster Dashboard*
* From all instances to all primaries on 6443/tcp — *Cluster Kubernetes API*
* From all instances to all primaries on 23010/tcp  — *Cluster Internal Setup*
* Between all instances on 6783/udp+tcp — *Cluster Internal Overlay Networking*
* Between all instances on 6784/udp — *Cluster Internal Overlay Networking*
* Between all instances on 10250/tcp — *Cluster Kubelet API*
* Between all primaries on allow 2379/tcp — *Cluster Internal ETCD*
* Between all primaries on allow 2380/tcp — *Cluster Internal ETCD*
* Between all primaries on 4001/tcp — *Cluster Internal ETCD*
* Between all primaries on 7001/tcp — *Cluster Internal ETCD*

#### Instance Internal Firewall Rules

If your application instances have internal firewalls, they need rules to allow access on the ports above plus the following additional rules:

* Allow out on `weave` to 10.32.0.0/12
* Allow in on `weave` from 10.32.0.0/12

-> **Note:** If you choose to use the installer's `--internal-cidr` option, make sure these firewall rules match your chosen address block. For example, if you pass `--internal-cidr=10.200.0.0/20` then the firewall rule should allow in and out on weave from `10.200.0.0/20`.

We recommend setting up firewall rules in the following order:

1. Configure the first set of rules before installing.
1. Disable the firewall and run the Terraform Enterprise installer.
1. Configure the rules for the `weave` interface.
1. Re-enable the firewall.

This is because Terraform Enterprise creates the `weave` interface (used for Cluster Internal Overlay Networking) during installation, and also manipulates the firewall after installation.


## Installer

The TFE installer takes the form of a single binary that must be run on the individual instances to create and join themselves to the cluster.

The instructions will make use of the following configuration values:

* The address of the Internal Load Balancer (`$internal_lb`). This can be either an IP or hostname.
* A setup token (`$setup_token`). This is a 32 character random sequence used to authenticate the primaries as they join the cluster.

~> **Important:** If you are using the release sequence variable to pin an install to a particular version of TFE, be aware that the release sequence numbers between the Clustering and Non-Clustering versions are different. Consult with HashiCorp or refer to an existing installation to determine which Clustering release sequence numbers to use.

### Differences Between Airgap and Online Installs

The TFE Clustering installer needs to download some additional code and data to install the full cluster. In an airgap situation, this additional code needs to be placed on the instance for the installer to use.

In online installs, the code is downloaded from HashiCorp servers automatically.

## First Primary

The first primary of the cluster is responsible for bootstrapping the cluster, so that the other instances can join it.

### Cluster Configuration

The software expects a couple of configuration files to be on the machine which will govern part of the setup process. These configuration files are only needed on the initial primary.

The process of creating these configuration files is the same for both clustered and non-clustered installation. Please see [Standalone Deployment: Automated Installation](https://www.terraform.io/docs/enterprise/install/automating-the-installer.html) for the full syntax and options.

At minimum, the installation requires that the `/etc/replicated.conf` file exist.

### Running Setup

Once the configuration files are in place, run the installer. For an online install:

```
ptfe install setup \
  --internal-load-balancer=$internal_lb \
  --setup-token=$setup_token
```

### Additional Options For Installation

You can configure the installation by providing any of the following options to the `ptfe install setup` and `ptfe install join` commands. If you specify any of these options for the first primary, be sure to also specify them for all of the other instances.

* `--airgap-installer`: The path on disk to the airgap installer package.
* `--http-proxy`: An http proxy to use for talking outside the cluster
* `--additional-no-proxy`: Any hostnames that should not be accessed via the given http proxy.
* `--internal-cidr`: An IPv4 CIDR range to use for internal communication between services. This range can be set in the case that the default values overlap with hosts that the cluster needs to access on a customers network. This value must be at least a /20, for example: `10.200.0.0/20`.

## Additional Primaries

On the other primaries, run `ptfe install join` instead of `ptfe install setup`. Include the same options as on the first primary, plus the additional `--as-primary` and `--role-id=1` options:

```
ptfe install join \
  --internal-load-balancer=$internal_lb \
  --setup-token=$setup_token \
  --as-primary \
  --role-id=1
```

## Secondaries

On the secondaries, run `ptfe install join`. Use the same options you used for the first primary; **do not** include the `--as-primary` and `--role-id=1` options that you used with the other primaries:

```
ptfe install join \
  --internal-load-balancer=$internal_lb \
  --setup-token=$setup_token
```
