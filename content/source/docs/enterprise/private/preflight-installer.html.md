---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation (Preflight)"
sidebar_current: "docs-enterprise2-private-installer-preflight"
---

# Private Terraform Enterprise Installation (Preflight Requirements)

Before installing the Private Terraform Enterprise software, you'll need to prepare an appropriate instance and relevant data files. Please make careful note of these requirements, as the installation may not be successful if these requirements are not met.

## Data Files

* TLS private key and certificate
  * The installer allows for using a certificate signed by a public or private CA. If you do not use a trusted certificate, your VCS provider will likely reject that certificate when sending webhooks.
* License key (provided by HashiCorp)

~> **Note:** If you use a certificate issued by a private Certificate
   Authority, you must provide the certificate for that CA in the
   `Certificate Authority (CA) Bundle` section of the installation. This allows services
   running within PTFE to access each other properly.

## Linux Instance

Install the software on a Linux instance of your choosing.
You will start and manage this instance like any other server.

The Private Terraform Enterprise Installer currently supports the following
operating systems:

* Debian 7.7+
* Ubuntu 14.04 / 16.04 / 18.04
* Red Hat Enterprise Linux 7.2+
* CentOS 7+
* Amazon Linux 2016.03 / 2016.09 / 2017.03 / 2017.09 / 2018.03 / 2.0
* Oracle Linux 7.2+

### Hardware Requirements

These requirements provide the instance with enough resources to run the
Terraform Enterprise application as well as the Terraform plans and applies.

 * At least 40GB of disk space on the root volume
 * At least 8GB of system memory
 * At least 2 CPU cores

### Software Requirements

~> RedHat Enterprise Linux (RHEL) has a specific set of requirements. Please see the [RHEL Install Guide](./rhel-install-guide.html) before continuing.

For Linux distributions other than RHEL, check Docker compatibility:

  * The instance should run a supported version of Docker engine (1.7.1 or later, minimum 17.06.2-ce, maximum 17.12.1). This also requires a 64-bit distribution with a minimum Linux Kernel version of 3.10.
    * At this time, the **18.x and higher Docker versions are not supported**
    * In Online mode, the installer will install Docker automatically
    * In Airgapped mode, Docker should be installed before you begin
  * For _Redhat Enterprise_, _Oracle Linux_, and _SUSE Enterprise_, you **must** pre-install Docker as these distributions are [not officially supported by Docker Community Edition](https://docs.docker.com/engine/installation/#server).

~> **Note**: It is not recommended to run Docker under a 2.x kernel.

### SELinux

Private Terraform Enterprise does not support SELinux. The host running the installer must be configured in permissive mode by running: `setenforce 0`.

Future releases may add native support for SELinux.

### Network Requirements

1. Have the following ports available to the Linux instance:
  * **22** - to access the instance via SSH from your computer
  * **8800** - to access the Admin Console
  * **443** and **80** - to access the TFE app (both ports are needed; HTTP will redirect to HTTPS)
  * **9870-9880 (inclusive)** - for internal communication on the host and its subnet; not publicly accessible
1. If a firewall is configured on the instance, be sure that traffic can flow out of the `docker0` interface to the instance's primary address. For example, to do this with UFW run: `ufw allow in on docker0`. This rule can be added before the `docker0` interface exists, so it is best to do it now, before the Docker installation.
1. Get a domain name for the instance. Using an IP address to access the product is not supported as many systems use TLS and need to verify that the certificate is correct, which can only be done with a hostname at present.
