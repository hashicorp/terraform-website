---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation (Installer Beta)"
sidebar_current: "docs-enterprise2-private-install-installer"
---

# Private Terraform Enterprise Installation (Installer Beta)

## Delivery

This document outlines the procedure for using the Private Terraform Enterprise
installer to set up Terraform Enterprise on a customer-controlled machine.

~> **Note**: This document is only meant for those customers in the Private
Terraform Enterprise installer beta program. All other customers can follow the
[instructions for the AMI-based install](./install-ami.html).

## Preflight

Before you begin, you'll need to get a few bits of data as well as get a Linux
instance ready.

### Data Files

* TLS private key and certificate _Optional: Self-signed materials can be used_
* License key (provided by HashiCorp)

### Linux Instance

You'll be installing the software onto a Linux instance of your own choosing.
You will start and manage this instance like any other server.

The Private Terraform Enterprise Installer currently supports the following
operating systems:

* Debian 7.7+
* Ubuntu 14.04 / 15.10 / 16.04
* Fedora 21 / 22
* Red Hat Enterprise Linux 6.5+
* CentOS 6+
* Amazon Linux 2014.03 / 2014.09 / 2015.03 / 2015.09 / 2016.03 / 2016.09 / 2017.03
* Oracle Linux 6.5+

#### Hardware Requirements

These requirements are to provide the instance with enough resources to run the
Terraform Enterprise application as well as the Terraform plans and applies.

 * At least 40GB of disk space on the root volume
 * At least 8GB of system memory
 * At least 2 CPU cores

#### Software Requirements

Check Docker compatability:

  * The instance should run a current version of Docker engine (1.7.1 - 17.06.2-ce with 17.06.2-ce being the recommended version). This also requires a 64-bit distribution with a minimum Linux Kernel version of 3.10. In online mode, the installer will install Docker automatically. In airgapped mode, Docker should be installed before you begin.
  * For _Redhat Enterprise_, _Oracle Linux_, and _SUSE Enterprise_, you **must** pre-install Docker as these distribtions are [not officially supported by Docker Community Edition](https://docs.docker.com/engine/installation/#server).

#### Network Requirements

1. Have the following ports available to the Linux instance:
  * **22** - to access the instance via SSH from your computer
  * **8800** - to access the Admin Console
  * **443** and **80** - to access the TFE app (both ports are needed; HTTP will redirect to HTTPS)
  * **9870-9880 (inclusive)** - for internal communication on the host and its subnet; not publicly accessible
1. If a firewall is configured on the instance, be sure that traffic can flow out of the `docker0` interface to the instances primary address. For example, to do this with UFW run: `ufw allow in on docker0`. This rule can be added before the `docker0` interface exists, so it is best to do it now, before the install begins.
1. _Optional_: Get a domain name for the instance.  If you opt to use only an IP to access the instance, enter the IP into the hostname field when prompted during the web portion of the setup.

### Operational Mode Decision

Terraform Enterprise can store it's state in a few different ways and you'll
need to decide which works best for your installation:

1. **Demo** - This mode stores all data on the instance. The data can be
   backed up with the snapshot mechanism for restore later.
1. **Production - External Services** - This mode stores the majority of the
   stateful data used by the instance in an external Postgresql database as
   well as an external S3 compatible endpoint. There is still critical data
   stored on the instance that must be managed with snapshots. Be sure to
   checked the [PostgreSQL Requirements](#postgresql-requirements) for what
   needs to be present for Terraform Enterprise to work.
1. **Production - Mounted Disk** - This mode stores data in a separate
   directory on the host, with the intention that the directory is
   configured to stored it's data on an external disk, such as EBS, iSCSI,
   etc.

The decision you make will be entered during setup.

## Installation

The installer can run in two modes, Online or Airgap. Each of these modes has a different way of executing the installer, but afterwards everything is the same.

### Run The Installer - Online

If your instance can access the internet, you should run the Online install mode.

1. From a shell on your instance:
  * To execute the installer directly, run `curl https://install.terraform.io/ptfe/beta | sudo bash`
	* To inspect the script locally before running, run `curl https://install.terraform.io/ptfe/beta > install.sh` and then once you are satisfied with the script's content, execute it with `sudo bash install.sh`
1. The software will take a few minutes and you'll be presented with a message
	 about how/where to access the rest of the setup via the web. This will be
   `https://[hostname or ip of your instance]:8800`
  * The Admin Console an internal CA to issue bootstrap certificates, so you will
		see a security warning first connecting. This is expected and you'll need
    to proceed with the connection anyway.

### Run The Installer - Airgap

If the instance can not reach the internet, then you can follow these steps to begin an Airgap installation.

Preparing the instance:

1. Download the `.airgap` file using the information given to you in your setup email and place that file somewhere on the the instance.
  * If you use are using `wget` to download the file, be sure to use `wget --content-disposition "<url>"` so the downloaded file gets the correct extension.
  * The url generated for the .airgap file is only valid for a short time, so you may wish to download the file and upload it to your own artifacts repository.
1. [Download the installer bootstrapper](https://s3.amazonaws.com/replicated-airgap-work/replicated.tar.gz) put it into its own directory on the instance (e.g. `/opt/tfe-installer/`)
1. Airgap installations require Docker be pre-installed. Double check that your instance has a supported version of Docker (see [Software Requirements](#software-requirements) above for details).

Executing the installer:

1. From a shell on your instance, in the directory where you placed the `replicated.tar.gz` installer bootstrapper.
1. Run `tar xzf replicated.tar.gz`
1. Run `sudo ./install.sh airgap`
1. When asked, select the interface of your primary private network interface used to access the instance.
1. The software will take a few minutes and you'll be presented with a message about how/where to access the rest of the setup via the web. This will be https://[hostname or ip of your instance]:8800
  1. The web interface uses an internal CA to issues certificates, so you will
     see a security warning. This is expected and you'll need to proceed with
     the connection anyway.

### Continue Installation In Browser

1. Configure the hostname (which can be an IP only) and the SSL certificate.
1. Upload your license file. (It was provided to you in your setup email.)
1. Indicate if you're doing an Online or Airgap installation (Choose Online if
   you're not sure.)
	* If you are doing an Airgap install, provide the path on the the instance
	  to the `.airgap` file that you downloaded using the inital instruction in
    your setup email.
1. Secure access to the Admin Console. We recommend at least setting up the
   simple password auth. If you're so inclined, LDAP authentication that only
   applies to the Admin Console can be configured as well.
1. The system will now perform a set of pre-flight checks on the instance and
   configuration thus far. If any of these fail, it will indicate as much. You
   can either fix the issues and re-run the checks or ignore the warnings and
   proceed. If you do proceed despite the warnings, you are assuming the
   support responsibility.
1. Configure the operational mode for this installation. See
   [Operational Modes](#operational-mode-decision) for information on what the different values
   are.
1. _Optional:_ Adjust the concurrent capacity of the instance. This should
   only be used if the hardware provides more resources than the baseline
   configuration and you wish to increase the work that the instance does
   concurrently. This setting should be adjusted with care as setting it too
   high can result in an very unresponsive instance.

#### PostgreSQL Requirements

When Terraform Enterprise is using an external PostgreSQL database, the
following must be present on it:

* The version of PostgreSQL must be 9.4 or greater
* User with access to ownership semantics on the referenced database
* The following PostgreSQL schemas must be installed into the database: `rails`, `vault`, `registry`

To create schemas in PostgreSQL, the `CREATE SCHEMA` command is used. So to
create the above required schemas, the follow snippit must be run on the
database:

```
CREATE SCHEMA rails;
CREATE SCHEMA vault;
CREATE SCHEMA registry;
```

When specifying which PostgreSQL database to use, the value specified must
be a valid Database URL, as [specified in the libpq documentation](https://www.postgresql.org/docs/9.3/static/libpq-connect.html#AEN39514).

Additionally, the URL must include the `sslmode` parameter indicating if SSL
should be used to connect to the database. There is no assumed SSL mode, the
parameter must be specified.

### Finish Bootstrapping

Once configured, the software will finish downloading. When it’s ready, the UI
will indicate so and there will be an Open link to click to access the Terraform Enterprise UI.

## Configuration

After completing a new install you should head to the [configuration
page](./config.html) to continue setting up Terraform Enterprise.

