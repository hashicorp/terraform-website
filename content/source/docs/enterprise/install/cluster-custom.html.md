---
layout: "enterprise"
page_title: "Custom - Clustered Deployment - Install and Config - Terraform Enterprise"
---

# Deploying a Terraform Enterprise Cluster into a Custom Environment

To perform an installation of TFE for Clustering, you’ll require a number of different bits of infrastructure, all configured to work together.

### Infrastructure

#### Instances
The installation requires at least 3 primary nodes and any number of secondary nodes. The primary nodes run the cluster services themselves and are considered stateful instances. The secondary instances are only run stateless workloads and can be added and removed from the cluster at will, It’s recommended at present that the cluster not cycle through secondaries too quickly as it can disrupt the cluster availability if there is too much cluster reconfiguration.

##### Secondary Instances
The secondary instances can be configured in a form of autoscaling group for easier management. This group need not perform elastic scaling unless necessary, but rather can simply be an easy way to manage the fleet of instances. It’s common to configure such a group for a static number of instances as well, for better cost control.

If elastic scaling is enabled, it is common to configure a cooldown period between scaling events so as to not disrupt the cluster availability with too much cluster reconfiguration.

#### Internal Load Balancer
The cluster utilizes an API service that run on each of the primary nodes to run properly. For the cluster to operate properly, a load balancer should be configured to send TCP sessions to the primaries on port *6443*. It is important that the load balancer not attempt to terminate the traffic as HTTPS because the clients and servers use an internally configured CA certificate chain that is used for authentication.

Additionally, the internal load balancer must send traffic on port *23010* to the primaries. This port is used to facilitate the cluster setup process.

#### External Load Balancer
To provide access to the TFE application, an external load balancer should forward traffic to all instances on port *443*. The load balancer should terminate the traffic as HTTPS and provide its own certificate before forwarding the traffic to the instances on *443*. The load balancer should be configured to ignore certificate errors as the cluster is configured with a self-signed certificate.

#### PostgreSQL Database
For proper production installations, a PostgreSQL database external to the cluster is required. It’s highly recommended that this database be configured to take automated backups in the case of disaster recovery. Additionally, the resources available to the database should be inline with the size of the cluster itself.

We recommend at minimum 16GB of RAM and 100GB of storage for a basic server, scaling up with RAM as the number of cluster instances changes.

The database must be able to accept at least (cores in cluster / 3) * 16 concurrent connections. For example, if the cluster is using 6 instances with 4 cores each, it needs to allow (24 / 3) * 41, or 328 concurrent connections at a minimum.

#### Object Storage
For proper production installations, an Object Storage server such as AWS S3 is required. The system support S3, Azure Blob Storage, and Google Cloud Storage. S3 work-alike servers such as minio are supported as well. The system should allow for at a minimum of 250GB of storage to allow the system to safely grow as the number of terraform states and logs increase.

### Network Configuration
The instances communicate with each other over TCP and UDP. The following list describes each port and where communication must be allowed to and from for the cluster to operate.

#### Ports
* from outside to 443/tcp - *Application HTTPS*
* from outside to 8800/tcp - *Cluster Dashboard*
* between all instances on 6443/tcp - *Cluster Kubernetes API*
* between all instances on 6783/udp+tcp - *Cluster Internal Overlay Networking*
* between all instances on 6784/udp+tcp - *Cluster Internal Overlay Networking*
* between all instances on 23010/tcp  - *Cluster Internal Setup*
* between all primaries on allow 2379/tcp - *Cluster Internal ETCD*
* between all primaries on allow 2380/tcp - *Cluster Internal ETCD*
* between all primaries on 4001/tcp - *Cluster Internal ETCD*
* between all primaries on 7001/tcp - *Cluster Internal ETCD*


### Instance Configuration

#### Instance Internal Firewall Rules
If the instance has an internal firewall, be sure that the above ports are added to it for access. TFE also manipulates the firewall after installation, so the recommended practice is to setup the above rules, then disable the firewall while the installer runs, finally reenabling the firewall after the installer finishes.

In additional to the above ports, if a firewall is used on the instance, the following rules must be installed:

* allow out on weave to 10.32.0.0/12
* allow in on weave from 10.32.0.0/12

_(weave is the service that is used for Cluster Internal Overlay Networking)_

The _weave_ interface is created by the TFE installer itself and thusly it is necessary to disable any instance firewall while the installer runs, after which you can setup the weave interface rules, and then re-enable the firewall.

~> *NOTE:* The above _10.32.0.0/12_ should be replaced if you use the below `--internal-cidr` option with the same value. So if you pass `--internal-cidr=10.200.0.0/20` then the firewall rule should allow in and out on weave from 10.200.0.0/20.

#### Disk Layout
The TFE installer puts all the cluster data into /var and it must have at least 100GB of storage available. It’s recommended that / be at least 20GB.


### TFE Configuration

#### Release Sequence
If you are using the release sequence variable to pin an install to a particular version of TFE, be aware that the release sequence numbers between the Clustering and Non-Clustering versions are different. Consult with HashiCorp or an existing installation to find out the Clustering release sequence numbers to use.

## Installer
The TFE installer takes the form of a single binary that must be run on the individual instances to create and join themselves to the cluster.

The instructions will make use of the following configuration values:
* The address of the Internal Load Balancer (`$internal_lb`). This can be either an IP or hostname.
* A setup token (`$setup_token`). which is a 32 character random sequence used to authenticate the primaries as they join the cluster.

## Airgap or Online
The TFE Clustering installer needs to download some additional code and data to install the full cluster. In an airgap situation,  this additional code needs to be placed on the instance for the installer to use.

In online installs, the code is downloaded from HashiCorp servers automatically.

## First Primary
The first primary of the cluster has an important task, it has to bootstrap the cluster for all other instances to join it.

### Cluster Configuration
The software expects a couple of configuration files to be on the machine which will govern part of the setup process. These configuration files are only needed on the initial primary.

This steps follows the same ones for the non Cluster installer. Please see the documentation under [Automated Installation - Install and Config - Terraform Enterprise - Terraform by HashiCorp](https://www.terraform.io/docs/enterprise/install/automating-the-installer.html) for the full syntax and options.

The installation requires at a minimum the `/etc/replicated.conf` file to exist.

*NOTE:* The release sequence numbers been the Cluster and Non-Cluster installs are different, be sure to consult HashiCorp for determining the correct value.

### Running Setup
Once the configuration files are in place, it’s time to run the install. For an online install:

```
ptfe install setup \
  —-internal-load-balancer=$internal_lb \
  --setup-token=$setup_token
```

### Additional Flags For Setup
* `--airgap-installer`: The path on disk to the airgap installer package. 
* `—-http-proxy`: An http proxy to use for talking outside the cluster
* `—-additional-no-proxy`: Any hostnames that should not be accessed via the given http proxy.
* `—-internal-cidr`: An IPv4 CIDR range to use for internal communication between services. This range can be set in the case that the default values overlap with hosts that the cluster needs to access on a customers network. This value must be at least a /20, for example: `10.200.0.0/20`. 

## Additional Primaries
On the other primaries, the ptfe tool is used in a similar way to the primary, but with `join` instead of `setup`:

```
ptfe install join \
  —-internal-load-balancer=$internal_lb \
  --setup-token=$setup_token \
  —-as-primary \
  —-role-id=1
```


## Secondaries
All secondaries are joined similar to primaries, just without the extra `—as-primary` flag set:

```
ptfe install join \
  —-internal-load-balancer=$internal_lb \
  --setup-token=$setup_token
```

### Additional Flags For Join
* `--airgap-installer`: The path on disk to the airgap installer package. 
* `—-http-proxy`: An http proxy to use for talking outside the cluster
* `—-additional-no-proxy`: Any hostnames that should not be accessed via the given http proxy.
* `—-internal-cidr`: An IPv4 CIDR range to use for internal communication between services. This range can be set in the case that the default values overlap with hosts that the cluster needs to access on a customers network. This value must be at least a /20, for example: `10.200.0.0/20`. 
