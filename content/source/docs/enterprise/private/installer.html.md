---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installer"
sidebar_current: "docs-enterprise2-private-installer"
---

# Private Terraform Enterprise Installer

## Delivery

The goal of this installation procedure is to set up a Terraform Enterprise
cluster that is available on a DNS name that is accessed via HTTPS. This
standard configuration package uses Terraform to create both the compute and
data layer resources, and optionally uses Route53 to configure the DNS automatically.

## Preflight

Before you begin, you'll need to get a few bits of data as well as get a linux
instance ready.

### Data Files
* TLS private key and certificate _Optional: Self-signed materials can be used_
* License key (provided by HashiCorp)

### Linux Instance
You'll be installing the software onto a linux instance of your own choosing.
You will start and manage this instance like any other server.

Supported Linux operating systems:
* Debian 7.7+
* Ubuntu 14.04 / 15.10 / 16.04
* Fedora 21 / 22
* Red Hat Enterprise Linux 6.5+
* CentOS 6+
* Amazon Linux 2014.03 / 2014.09 / 2015.03 / 2015.09 / 2016.03 / 2016.09 / 2017.03
* Oracle Linux 6.5+

#### Hardware Requirements

These requirements are to provide the instance with enough power to run the
application as well as the Terraform plans and applies.

 * 80GB or greater disk
 * 8GB or greater memory
 * 2 or more CPU cores

#### Software Requirements
* Check docker compatability
  * The instance should run a current version of Docker engine (1.7.1 - 17.06.2-ce with 17.06.2-ce being the recommended version). This also requires a 64-bit distribution with a kernel minimum of 3.10. The software will install docker automatically, no need to do that manually.
  * For _Redhat Enterprise_, _Oracle Linux_, and _SUSE Enterprise_, you **must** pre-install docker as these distros have non-free support situations with docker. For information, please see https://docs.docker.com/engine/installation/#server

#### Network Requirements

* Have ports available to the linux instance
  * **22** - to access the instance via SSH from your computer
  * **8800** - to access the Setup app. Ok to be publicly accessible
  * **443 and 80** - to access the PTFE app (both ports are needed)
  * **9870 to 9880** - Internal to the host and subnet, not publicly accessible
  * If a firewall is configured on the instance, be sure that traffic can flow out of the docker0 interface to the instances primary address. For example, to do this with ufw do `ufw allow in on docker0`. The rule to allow traffic from the docker0 interface can be done before the interface exists, so we ask that you do it now, before install begins.
* _Optional_: Get a domain name for the instance
  * If you opt to use a IP only to access the instance, enter the IP into the hostname field when prompted during the web portion of the setup

## Installation

### Run The Installer

1. SSH into the instance
1. At the prompt, run `curl https://install.terraform.io/ptfe/beta | sudo bash`
1. The software will take a few minutes and you'll be presented with a message about how/where to access the rest of the setup via the web. This will be https://[hostname/ip of your instance]:8800
  1. The web interface uses an internal CA to issues certificates, so you will
     see a security warning. This is expected and you'll need to proceed with
     the connection anyway.

### Continue Installation In Browser

1. Configure the hostname (which can be an IP only) and the SSL certificate
1. Upload your license file
1. Indicate if you're doing an online or airgap installation (online if
   you're not sure)
1. If indicated, lookup and enter your activation code
1. Secure access to the admin console. We recommend at least setting up the
   simple password auth. If you're so inclined, LDAP authenication that only
   applies to the admin console can be configured as well.
1. The system will now perform a set of preflight checks on the instance and
   configuration thus far. If any of these fail, it will indicate as much. You
   can either fix the issues and re-run the checks or ignore the warnings and
   proceed. If you do proceed despite the warnings, you are assuming the
   support responsibility.
1. Enter the email for your administrator when requested
1. Configure the operational mode for this installation
  1. **Demo** - This mode stores all data on the instance. The data can be
     backed up with the snapshot mechanism for restore later.
  1. **Production - External Services** - This mode stores the majority of the
     stateful data used by the instance in an external Postgresql database as
     well as an external S3 compatible endpoint. There is still critical data
     stored on the instance that must be managed with snapshots.
  1. **Production - Mounted Disk** - This mode stores data in a separate
     directory on the host, with the intention that the directory is
     configured to stored it's data on an external disk, such as EBS, iSCSI,
     etc.
1. _Optional:_ Adjust the concurrent capacity of the instance. This should
   only be used if the hardware provides more resources than the baseline
   configuration and you wish to increase the work that the instance does
   concurrently. This setting should be adjusted with care as setting it too
   high can result in an very unresponsive instance.

### Finish Bootstrapping

Once configured, the software will finish downloading. When it’s ready, the UI
will indicate so and there will be an Open link to click to access the Terraform Enterprise UI.

## Configuration

After completing a new install you should head to the
[configuration page](./config.html) to create users and teams.
