---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installer Migration"
sidebar_current: "docs-enterprise2-private-installer-migration"
---

# Private Terraform Enterprise Installer Migration

This document outlines the procedure for migrating from the AMI-based Private Terraform Enterprise (PTFE)
to the Installer-based PTFE.

## Preflight

Before you begin, you'll need to prepare data files and a Linux instance.

### Data Files

* TLS private key and certificate
  * The installer allows for using a self-signed certificate but HashiCorp does
    _not_ recommended this. Your VCS provider will likely reject that certificate
    when sending webhooks. If you do use the self-signed certificate, you must configure
    each webhook to ignore SSL errors within your VCS provider.
* License key (provided by HashiCorp)

~> **Note:** If you use your own certificate and it is issued by a private Certificate
   Authority, you must provide the certificate for that CA in the
   `Certificate Authority (CA) Bundle` section of the installation. This allows services
   running within PTFE to access each other properly.

### Linux Instance

Install the software on a Linux instance of your choosing.
You will start and manage this instance like any other server.

The Private Terraform Enterprise Installer currently supports the following
operating systems:

* Debian 7.7+
* Ubuntu 14.04 / 16.04
* Red Hat Enterprise Linux 7.2+
* CentOS 7+
* Amazon Linux 2016.03 / 2016.09 / 2017.03 / 2017.09
* Oracle Linux 7.2+

#### Hardware Requirements

These requirements provide the instance with enough resources to run the
Terraform Enterprise application as well as the Terraform plans and applies.

 * At least 40GB of disk space on the root volume
 * At least 8GB of system memory
 * At least 2 CPU cores

#### Software Requirements

~> RedHat Enterprise Linux (RHEL) has a specific set of requirements. Please see the [RHEL Install Guide](./rhel-install-guide.html) before continuing.

For Linux distributions other than RHEL, check Docker compatibility:

  * The instance should run a current version of Docker engine (1.7.1 or later, minimum 17.06.2-ce recommended). This also requires a 64-bit distribution with a minimum Linux Kernel version of 3.10.
    * In Online mode, the installer will install Docker automatically
    * In Airgapped mode, Docker should be installed before you begin
  * For _Redhat Enterprise_, _Oracle Linux_, and _SUSE Enterprise_, you **must** pre-install Docker as these distributions are [not officially supported by Docker Community Edition](https://docs.docker.com/engine/installation/#server).

~> **Note**: It is not recommended to run Docker under a 2.x kernel.

#### Network Requirements

1. Have the following ports available to the Linux instance:
  * **22** - to access the instance via SSH from your computer
  * **8800** - to access the Admin Console
  * **443** and **80** - to access the TFE app (both ports are needed; HTTP will redirect to HTTPS)
  * **9870-9880 (inclusive)** - for internal communication on the host and its subnet; not publicly accessible
1. If a firewall is configured on the instance, be sure that traffic can flow out of the `docker0` interface to the instance's primary address. For example, to do this with UFW run: `ufw allow in on docker0`. This rule can be added before the `docker0` interface exists, so it is best to do it now, before the Docker installation.
1. Get a domain name for the instance. Using an IP address to access the product is not supported as many systems use TLS and need to verify that the certificate is correct, which can only be done with a hostname at present.

### Proxy Usage

If your installation requires using a proxy server, you will be asked for the proxy server information when you first
run the installer via `ssh`. This proxy server will be used for all outbound HTTP and HTTPS connections.

Optionally, if you're running the installer script in an automated manner, you can pass a `http-proxy` flag to set the address of the proxy.
For example:

```
./install.sh http-proxy=http://internal.mycompany.com:8080
```

To exclude certain hosts from being accessed through the proxy (for instance, an internal VCS service), you will be
provided a place on the Settings page available on port 8800 under `/settings` to enter in these exclusions.

#### Reconfiguring the Proxy

To change the proxy settings after installation, use the Console settings page, accessed from the dashboard on port 8800 under `/console/settings`.

![PTFE Console Settings](./assets/ptfe-console-settings.png)

On the Console Settings page, there is a section for HTTP Proxy:

![PTFE HTTP Proxy Settings](./assets/ptfe-http-proxy.png)

#### Trusting SSL/TLS Certificates

The installer has a section that allows multiple certificates to be specified as trusted.
A collection of certificates for trusted issuers are known as a `Certificate Authority (CA) Bundle` and are
used to allow PTFE to connect to services that use SSL/TLS certificates issued by private CAs.

All certificates in the certificate signing chain, meaning the root certificate and any intermediate certificates,
must be included here. These multiple certificates are listed one after another in text format.

Certificates must be formatted using PEM encoding, ie as text. For example:

```
-----BEGIN CERTIFICATE-----
MIIFtTCCA52gAwIBAgIIYY3HhjsBggUwDQYJKoZIhvcNAQEFBQAwRDEWMBQGA1UE
AwwNQUNFRElDT00gUm9vdDEMMAoGA1UECwwDUEtJMQ8wDQYDVQQKDAZFRElDT00x
CzAJBgNVBAYTAkVTMB4XDTA4MDQxODE2MjQyMloXDTI4MDQxMzE2MjQyMlowRDEW
MBQGA1UEAwwNQUNFRElDT00gUm9vdDEMMAoGA1UECwwDUEtJMQ8wDQYDVQQKDAZF
....
-----END CERTIFICATE-----
```

The UI to upload these certificates looks like:

![ptfe-ca-ui](./assets/ptfe-ca-bundle.png)

~> **Note**: PTFE needs to be able to access all services that it integrates with, such as VCS providers,
   terraform providers, etc. Because it typically accesses them via SSL/TLS, it is critical that the
   certificates used by any service that is accessed is trusted by PTFE. This means properly configuring
   the `Certificate Authority (CA) Bundle` option so that PTFE can properly trust any certificates
   issued by private CAs.

~> **Note**: If PTFE is configured with a SSL key and certificate issued against a private CA,
   the certificate chain for that CA must be included here as well. This allows the instance
   to properly query itself.

### Operational Mode

As you are migrating from the AMI, you'll be using **Production - External Services** to
access the data previously managed by the AMI-based installation. This means using RDS for
PostgreSQL and S3 to store the objects.

## Begin Migration

Now that the linux instance has been booted into the correct Linux environment, you're ready to begin
the migration process.

~> NOTE: The migration process will render the AMI-based installation inoperable. Be sure to back up
   RDS before beginning.

Schedule downtime for the installation and do not continue until that downtime period has
arrived.

### Prepare for migration

SSH to the instance currently running in your PTFE AutoScaling group. Then download
the migrator tool onto it to run the migration procedure:

```shell
$ curl -O https://s3.amazonaws.com/hashicorp-ptfe-data/migrator
$ chmod a+x migrator
```

### Migrate data out of the AMI instance

~> NOTE: The AMI instance will not function after this step.

Next, create a password that will be used to protect the migration data
as it is passed to the installer. This password is only used for this migration process
and is not used after the migration is complete. 

For this example, we'll use the password `ptfemigrate` but you must change it to
a password of your own choosing.

This process shuts down certain services on the AMI instance to verify consistency
before moving data into the RDS instance to be used by the installer.

SSH into the AMI instance, and then run these commands:

```shell
$ sudo ./migrator -password ptfemigrate
```

The command will ask you to confirm that you wish to continue. When are ready, run:

```shell
$ sudo ./migrator -password ptfemigrate -confirm
```

When the migrator command completes, the output will include some debugging information
to provide to support if there is an issue as well as a specially-formatting block of text
that looks like:

```
-----BEGIN PTFE MIGRATION DATA-----
rbBuoUY1CZxFBH8sLHYpZzc7ndBD7on3aaro4Br9kV9W2t8PqOMYhS9Ts/nHr2ev
cpN3EQEuK+Bur/TBYEEHjXiiv71aGjO6c2z68yhvfafDbTfvW8N0rXDQM26F2rTa
1NGZNB1FUFPWFvPqbLW25xw5h+wn1FuOlEkqVsaBSdpYWGH/7NPtRDX2dN2ZhPYN
vs5T0wZ3ToPM7e7yfwI/0uMg+2lAK0h4L/ioYgLHBSN/bGr/Plfj6+CR7zza8XC3
kSv6kzGFr7fCT4BWzSJc38sOMviBY/TdyDPRlmmM7Flg9JLYIvLVxosRfIneQn60
K5Jcf1wJEsH/ZAQpEkbp6PzQKUmAlvEHf/fSAPxf3W3ulAubrCe2QmwsPIJkIGx/
uwfKgTCFr/svIkAtccTmeQ8pxAmNEA4CW/jEGlFkkZiu74+ia8KdF5lrtJBLA9Lj
J8sue9KYAB64fwQ+fISLfrMeahjgFip3gPXofDevM2gbIFvde2iCFFbPlL3oYlRK
nNVGb9Fa2ttIlP6oFZTbp7Ph0FZ+oSCtmFeDmpjQ5aM5C4WxmfMjs7IDJGup2ZyI
l7X33mQ270NGbKc/k6aCaqMZXyKewDk9bGalULh4dwSZXzNl4sJeb6DarkMyN1gp
SggAGKOsNGVfaGlm5WNTAxRJRZ3dS4UV3ar9UVhblXKO14cm6fKt5ByNBvGTtuy0
h3tR9gbjVjBA5S+iXP7lSb8=
-----END PTFE MIGRATION DATA-----
```

The first and last lines will be the same as above but the body will be entirely different. This
is a PEM encoded block that contains the configuration as well as Vault keys to allow
the installer to access your data.

Copy this block of text, including the beginning and ending lines beginning with `-----`
to your computer's clipboard by selecting the text and typing Control-C (Windows) or Command-C (macOS).

### Importing data into the installer instance

To transfer the migration data to the installer instance, connect to it over SSH.

Once connected, run the following commands to add the migrator tool to the instance:

```
$ curl -O https://s3.amazonaws.com/hashicorp-ptfe-data/migrator
$ chmod a+x migrator
```

Then, to import the data, run the following command, passing in the same password used
to generate the migration data.

```
$ sudo ./migrator -password ptfemigrate
```

When prompted, paste the data you previously copied to your computer's clipboard.

The migrator process places the Vault data in the default path for the installer to find,
and outputs the	values you'll need later in the process for the Installer web interface.

## Installing PTFE

The installer can run in two modes, Online or Airgapped. Each of these modes has a different way of executing the installer, but the result is the same.

### Run The Installer - Online

If your instance can access the Internet, use the Online install mode.

1. From a shell on your instance:
  * To execute the installer directly, run `curl https://install.terraform.io/ptfe/stable | sudo bash`
	* To inspect the script locally before running, run `curl https://install.terraform.io/ptfe/stable > install.sh` and then once you are satisfied with the script's content, execute it with `sudo bash install.sh`
1. The software will take a few minutes and you'll be presented with a message
	 about how/where to access the rest of the setup via the web. This will be
   `https://[hostname or ip of your instance]:8800`
  * The Admin Console uses an internal CA to issue bootstrap certificates, so you will
		see a security warning when first connecting. This is expected and you'll need
    to proceed with the connection anyway.

### Run The Installer - Airgapped

If the instance cannot reach the internet, then follow these steps to begin an Airgapped installation.

Preparing the instance:

1. Download the `.airgap` file using the information given to you in your setup email and place that file somewhere on the the instance.
  * If you use are using `wget` to download the file, be sure to use `wget --content-disposition "<url>"` so the downloaded file gets the correct extension.
  * The url generated for the .airgap file is only valid for a short time, so you may wish to download the file and upload it to your own artifacts repository.
1. [Download the installer bootstrapper](https://s3.amazonaws.com/replicated-airgap-work/replicated.tar.gz) and put it into its own directory on the instance (e.g. `/opt/tfe-installer/`)
1. Airgap installations require Docker to be pre-installed. Double check that your instance has a supported version of Docker (see [Software Requirements](#software-requirements) above for details).

Executing the installer:

From a shell on your instance, in the directory where you placed the `replicated.tar.gz` installer bootstrapper:

1. Run `tar xzf replicated.tar.gz`
1. Run `sudo ./install.sh airgap`
1. When asked, select the interface of your primary private network interface used to access the instance.
1. The software will take a few minutes and you'll be presented with a message about how/where to access the rest of the setup via the web. This will be https://[hostname or ip of your instance]:8800
  1. The web interface uses an internal CA to issues certificates, so you will
     see a security warning. This is expected and you'll need to proceed with
     the connection anyway.

### Continue Installation In Browser

1. Configure the hostname and the SSL certificate. **NOTE:** This does not need to be same hostname
   that was used by the AMI. It must be a hostname that currently resolves in DNS properly.
1. Upload your license file, provided to you in your setup email.
1. Indicate whether you're doing an Online or Airgapped installation. Choose Online if
   you're not sure.
	* If you are doing an Airgapped install, provide the path on the the instance
	  to the `.airgap` file that you downloaded using the initial instructions in
    your setup email.
1. Secure access to the Admin Console. We recommend at least setting up the
   simple password auth. If you're so inclined, LDAP authentication can also be
   configured for the Admin Console.
1. The system will now perform a set of pre-flight checks on the instance and
   configuration thus far and indicate any failures. You can either fix the issues
   and re-run the checks, or ignore the warnings and proceed. If the system is running behind a proxy and is unable to connect to `releases.hashicorp.com:443`, it is likely safe to proceed; this check does not currently use the proxy. For any other issues, if you proceed despite the warnings, you are assuming the support responsibility.
1. Select **External Services** under Production Type
1. For the PostgreSQL url, copy and paste the value that was output by the `migrator` process for _PostgreSQL Database URL_.
1. Select **S3** under Object Storage
1. Configure the Access Key ID and Secret Access Key _OR_ indicate that you want to use an instance profile.
   **NOTE**: An instance profile must be previously configured on the instance.
1. For the Bucket, copy and paste the value that was output by the `migrator` process for _S3 Bucket_.
1. For the Region, copy and paste the value that was output by the `migrator` process for _S3 Region_.
1. For the server-side Encrytion, copy and paste the value that was output by the `migrator` process for the server-side encryption.
1. For the KMS key, copy and paste the value that was output by the `migrator` process for _Optional KMS key_. **NOTE:** This key is not optional for migration, as it is used to read all the data in S3.
1. _Optional:_ Adjust the concurrent capacity of the instance. This should
   only be used if the hardware provides more resources than the baseline
   configuration and you wish to increase the work that the instance does
   concurrently. This setting should be adjusted with care as setting it too
   high can result in an very unresponsive instance.
1. _Optional:_ Provide the text version of a certificate (or certificates) that will be added to the trusted
   list for the product. This is used when services the product communicates with do not use
   globally trusted certificates but rather a private Certificate Authority (CA). This is typically
   used when Private Terraform Enterprise uses a private certificate (it must trust itself) or a
   VCS provider uses a private CA.

### Finish Installing

Once configured, the software will finish downloading. When it’s ready, the UI
will indicate so and there will be an Open link to click to access the Terraform Enterprise UI.

## Access

You can now access your PTFE installation using the previously configured hostname.

## Cleanup

Now that the installer is using a subset of resources created by the AMI cluster terraform,
we need to remove those resources from the terraform state used to create the AMI cluster.

If these resources are not removed, it's possible to accidentally delete the data when the AMI
cluster is removed!

~> **NOTE:** If you have modified the terraform modules we have provided, you'll need to adapt these instructions
   to fit your modifications.

### Move to new terraform state

First, verify all the resources currently tracked in the terraform state. If the terraform.state is on your local
disk, change to that directory. Next, list the state:

```shell
$ terraform state list
aws_caller_identity.current
aws_kms_alias.key
aws_kms_key.key
aws_subnet.instance
aws_vpc.vpc
module.db.aws_db_instance.rds
module.db.aws_db_subnet_group.rds
module.db.aws_security_group.rds
module.instance.aws_autoscaling_group.ptfe
module.instance.aws_ebs_volume.data[0]
module.instance.aws_ebs_volume.data[1]
module.instance.aws_elb.ptfe
module.instance.aws_iam_instance_profile.tfe_instance
module.instance.aws_iam_policy_document.tfe-perms
module.instance.aws_iam_role.tfe_iam_role
module.instance.aws_iam_role_policy.tfe-perms
module.instance.aws_launch_configuration.ptfe
module.instance.aws_s3_bucket.tfe_bucket
module.instance.aws_s3_bucket_object.setup
module.instance.aws_security_group.ptfe
module.instance.aws_security_group.ptfe-external
module.instance.aws_subnet.subnet
module.route53.aws_route53_record.rec
random_id.installation-id
```

Of these resources, the ones to move from the state so they are can exist outside this terraform config are:
```
aws_kms_alias.key
aws_kms_key.key
module.db.aws_db_instance.rds
module.db.aws_db_subnet_group.rds
module.db.aws_security_group.rds
module.instance.aws_s3_bucket.tfe_bucket
```

To remove these resources from the state, run:
```shell
$ terraform state mv -state-out=terraform.tfstate.installer aws_kms_alias.key aws_kms_alias.key
$ terraform state mv -state-out=terraform.tfstate.installer aws_kms_key.key aws_kms_key.key
$ terraform state mv -state-out=terraform.tfstate.installer module.db.aws_db_instance.rds module.db.aws_db_instance.rds 
$ terraform state mv -state-out=terraform.tfstate.installer module.db.aws_db_subnet_group.rds module.db.aws_db_subnet_group.rds
$ terraform state mv -state-out=terraform.tfstate.installer module.db.aws_security_group.rds module.db.aws_security_group.rds
$ terraform state mv -state-out=terraform.tfstate.installer module.instance.aws_s3_bucket.tfe_bucket module.instance.aws_s3_bucket.tfe_bucket
```

### Destroy AMI cluster

Now that these resources have been removed, it's safe to destroy the AMI cluster without affecting the installer-based installation.

If you're ready to perform that step, run:

```shell
$ terraform destroy
```

You'll be asked to confirm the resources to destroyed and should double check that the list doesn't contain the
resources we moved earlier.

### Managing Installer Resources

To continue to manage the resource used by the Installer-based install, you can move the resources in the new `terraform.tfstate.installer` file
to a large state file along with the terraform modules for them.

