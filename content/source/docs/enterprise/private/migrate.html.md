---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installer Migration"
sidebar_current: "docs-enterprise2-private-installer-migration"
---

# Private Terraform Enterprise Installer Migration

This document outlines the procedure for migrating from the AMI-based Private Terraform Enterprise (PTFE)
to the Installer-based PTFE.

## Terraform State

To run this procedure, you'll need the Terraform state file used to create the AMI-based installation. Additionally, we strongly suggest you back up this state file before proceeding with this process, in the event that you need to revert back to the AMI.

## Backup

Before beginning, it's best to create an additional backup of your RDS database. This will allow you to roll back the data and continue to use the AMI if necessary.

To create an RDS backup, go to the [Amazon RDS Instances](https://console.aws.amazon.com/rds/home?region=us-east-1#dbinstances:). You may need to change the region that you are viewing in order to see your PTFE instance. Once you find it, click on the instance name. On the next page, select **Instance Actions** and then **Take snapshot**. On the **Take DB Snapshot** page, enter a name for the snapshot such as `Pre-Installer Migration`, and then click **Take Snapshot**.

The snapshot will take a little while to create. After it has finished, you can continue with the rest of the migration steps.

### Reverting back to the AMI

To revert to the AMI after running the migration script:

* If you've already manipulated the state file to move the resources, you'll need to restore the original state file.
* With your original Terraform state file in place, return to the [Amazon RDS Snapshots](https://console.aws.amazon.com/rds/home?region=us-east-1#db-snapshots:) and find the snapshot you created before migrating. Click on the snapshot and note its **ARN** value. Open your **.tfvars** file and add `db_snapshot = "arn-value-of-snapshot"`.
* Run `terraform apply` to make sure everything is set up. This will result in a new RDS instance being built against the snapshot.
* If the EC2 instance is still running from the migration process, run `shutdown` on it to get a new instance created.
* Return to the original hostname used for the cluster.

## Simple Upgrade (Recommended)

For users who did not significantly change the reference Terraform modules used to deploy
the AMI, we recommend following the migration path outlined on the
[Simplified Migration Page](./simplified-migration.html).

For users who modified the Terraform modules, we recommend following the steps below. If you prefer,
you can follow the [simplified steps](./simplified-migration.html) as well, but you'll likely need to
modify some Terraform modules again to match the modifications you made in the past.

## Preflight

Before you begin, consult [Preflight](./preflight-installer.html) for pre-requisites for the installer setup. You'll need to prepare data files and a Linux instance.

## Proxy Usage

If your installation requires using a proxy server, you will be asked for the proxy server information when you first
run the installer via `ssh`. This proxy server will be used for all outbound HTTP and HTTPS connections.

Optionally, if you're running the installer script in an automated manner, you can pass a `http-proxy` flag to set
the address of the proxy. For example:

```
./install.sh http-proxy=http://internal.mycompany.com:8080
```

### Proxy Exclusions (NO\_PROXY)

If certain hostnames should not use the proxy and the instance should connect directly to them (for instance for S3), then you can pass an additional option to provide a list of domains:

```
./install.sh additional-no-proxy=s3.amazonaws.com,internal-vcs.mycompany.com,example.com
````

Passing this option to the installation script is particularly useful if the hostnames that should not use the proxy include services that the instance needs to be able to reach during installation, such as S3. Alternately, if the only hosts you need to add are those that are not used during installation, such as a private VCS instance, you can provide these hosts after initial installation is complete, in the installer settings (available on port 8800 under `/console/settings`).

### Reconfiguring the Proxy

To change the proxy settings after installation, use the Console settings page, accessed from the dashboard on port 8800 under `/console/settings`.

![PTFE Console Settings](./assets/ptfe-console-settings.png)

On the Console Settings page, there is a section for HTTP Proxy:

![PTFE HTTP Proxy Settings](./assets/ptfe-http-proxy.png)

## Trusting SSL/TLS Certificates

There are two primary areas for SSL configuration in the installer.

### TLS Key & Cert

The TLS Key & Cert field (found in the console settings after initial installation) should contain PTFE's own key and certificate, or key and certificate chain. A chain would be used in this field if the CA indicates an intermediate certificate is required as well.

### Certificate Authority (CA) Bundle

PTFE needs to be able to access all services that it integrates with, such as VCS providers.
Because it typically accesses them via SSL/TLS, it is critical that the certificates used by any service
that PTFE integrates with are trusted by PTFE.

This section is used to allow PTFE to connect to services that use SSL/TLS certificates issued by private CAs.
It allows multiple certificates to be specified as trusted, and should contain all certificates that PTFE
should trust when presented with them from itself or another application.

A collection of certificates for trusted issuers is known as a `Certificate Authority (CA) Bundle`.
All certificates in the certificate signing chain, meaning the root certificate and any intermediate certificates,
must be included here. These multiple certificates are listed one after another in text format.

~> **Note:** If PTFE is configured with a SSL key and certificate issued against a private CA,
   the certificate chain for that CA must be included here as well. This allows the instance
   to query itself.

Certificates must be formatted using PEM encoding, that is, as text. For example:

```
-----BEGIN CERTIFICATE-----
MIIFtTCCA52gAwIBAgIIYY3HhjsBggUwDQYJKoZIhvcNAQEFBQAwRDEWMBQGA1UE
AwwNQUNFRElDT00gUm9vdDEMMAoGA1UECwwDUEtJMQ8wDQYDVQQKDAZFRElDT00x
CzAJBgNVBAYTAkVTMB4XDTA4MDQxODE2MjQyMloXDTI4MDQxMzE2MjQyMlowRDEW
MBQGA1UEAwwNQUNFRElDT00gUm9vdDEMMAoGA1UECwwDUEtJMQ8wDQYDVQQKDAZF
....
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIB5zCCAY6gAwIBAgIUNJADaMM+URJrPMdoIeeAs9/CEt4wCgYIKoZIzj0EAwIw
UjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1TYW4gRnJhbmNp
c2NvMR4wHAYDVQQDExVoYXNoaWNvcnAuZW5naW5lZXJpbmcwHhcNMTgwMjI4MDYx
....
-----END CERTIFICATE-----
```

The UI to upload these certificates looks like:

![ptfe-ca-ui](./assets/ptfe-ca-bundle.png)

## Operational Mode

As you are migrating from the AMI, you'll be using **Production - External Services** to
access the data previously managed by the AMI-based installation. This means using RDS for
PostgreSQL and S3 to store the objects.

## Begin Migration

Now that the instance has been booted into the correct Linux environment, you're ready to begin
the migration process.

~> **Note:** The migration process will render the AMI-based installation inoperable. Be sure to back up
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

~> **Note:** The AMI instance will not function after this step. Certain services are stopped and
   should not be restarted after the migration. The migration moves data stored in Consul by
   the AMI (Vault data) into PostgreSQL to be used by the installer. If the AMI adds new
   data to Consul after the migration, the installer-based instance won't have access to it,
   destabilizing the system.

Next, create a password that will be used to protect the migration data
as it is passed to the installer. The password is only used for this migration process
and is not used after the migration is complete.

For this example, we'll use the password `ptfemigrate`, but you must change it to
a password of your own choosing.

This process shuts down certain services on the AMI instance to verify consistency
before moving data into the RDS instance to be used by the installer.

SSH into the AMI instance, then run these commands:

```shell
$ sudo ./migrator -password ptfemigrate
```

The command will ask you to confirm that you wish to continue. When are ready, run:

```shell
$ sudo ./migrator -password ptfemigrate -confirm
```

An example session of running the migrator looks like:

```shell
This program will prepare your database for migration as well as
output a block of text that you must provide when requested while
later running this program on the linux instance being used
to run the installer.

This program will now shutdown some primary services before
continuning to be sure that the database is consistent
Shutting down services...
2018/05/25 17:37:04 Generated new root token to transmit
2018/05/25 17:37:04 connecting to postgresql at postgres://atlas:xxyyzz@tfe-aabbcc.ddeeff.us-west-2.rds.amazonaws.com:5432/atlas_production?&options=-c%20search%5Fpath%3Dvault
2018/05/25 17:37:04 setup rails schema!
2018/05/25 17:37:04 writing core/audit
2018/05/25 17:37:04 writing core/auth
2018/05/25 17:37:04 writing core/cluster/local/info
2018/05/25 17:37:04 writing core/keyring
2018/05/25 17:37:04 writing core/leader/615b50e4-206d-9170-7971-f2b6b8a508fd
2018/05/25 17:37:04 writing core/local-audit
2018/05/25 17:37:04 writing core/local-auth
2018/05/25 17:37:04 writing core/local-mounts
2018/05/25 17:37:04 writing core/lock
2018/05/25 17:37:04 writing core/master
2018/05/25 17:37:04 writing core/mounts
2018/05/25 17:37:04 writing core/seal-config
2018/05/25 17:37:04 writing core/wrapping/jwtkey
2018/05/25 17:37:04 writing logical/91a7ef51-f1c5-b0a2-8755-3a4d86f1a082/ptfe-backup
2018/05/25 17:37:04 writing logical/91a7ef51-f1c5-b0a2-8755-3a4d86f1a082/setup-data
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/archivist_encoder
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/archivist_kdf
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_events_resource_diff
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_o_auth_clients_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_o_auth_clients_webhook_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_o_auth_tokens_info
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_o_auth_tokens_value
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_runs_metadata
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_runs_var_snapshot
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_setting_storage_postgres_value
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_vcs_hosts_webhook_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/archive/atlas_vcs_repos_webhook_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/archivist_encoder
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/archivist_kdf
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_events_resource_diff
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_o_auth_clients_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_o_auth_clients_webhook_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_o_auth_tokens_info
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_o_auth_tokens_value
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_runs_metadata
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_runs_var_snapshot
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_setting_storage_postgres_value
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_vcs_hosts_webhook_secret
2018/05/25 17:37:04 writing logical/e0eb6eb8-56e2-d564-8fc4-78ee882229e8/policy/atlas_vcs_repos_webhook_secret
2018/05/25 17:37:04 writing sys/expire/id/auth/token/create-orphan/5c40cdecc64ba276ca810a7d43cf69a4b486ad4d
2018/05/25 17:37:04 writing sys/expire/id/auth/token/create/aaf09a178b4658fd926f9193caef9e1817aae7c4
2018/05/25 17:37:04 writing sys/policy/archivist
2018/05/25 17:37:04 writing sys/policy/atlas
2018/05/25 17:37:04 writing sys/policy/default
2018/05/25 17:37:04 writing sys/policy/response-wrapping
2018/05/25 17:37:04 writing sys/token/accessor/105c7e4b4898cd905a915b48c7e8d3a20b7e8d25
2018/05/25 17:37:04 writing sys/token/accessor/9ff1ff31131be14d563ce1f0fb4781610175189f
2018/05/25 17:37:04 writing sys/token/accessor/b336f38abdbe381c8989c90f980c8267a3af999e
2018/05/25 17:37:04 writing sys/token/accessor/c0142d331857496927a3799ea9df277e69d0a982
2018/05/25 17:37:04 writing sys/token/id/5c40cdecc64ba276ca810a7d43cf69a4b486ad4d
2018/05/25 17:37:04 writing sys/token/id/5ed7ddc1674fbb42fe3ddcd278802a116b7cd4ab
2018/05/25 17:37:04 writing sys/token/id/aaf09a178b4658fd926f9193caef9e1817aae7c4
2018/05/25 17:37:04 writing sys/token/id/c356180d070a7aafa29f25416d5b8d2bba3dffa8
2018/05/25 17:37:04 writing sys/token/salt
2018/05/25 17:37:04 all vault data copied
copy and paste this data onto the instance PTFE will be installed on

-----BEGIN PTFE MIGRATION DATA-----
sl+VOHlCIKTq+aX7h/ZROP+bQkuJJlw/Is8WeFB/lfETBxXPmRwA6Ll9gYxyxpmq
hYUnw5Sj6IkHYGpwyw8tHdWyDTPHbtRZJtywGx8DAV6qi6gHbjjm93h4Rx5CIOZL
N3KBsHJR2tbp+xa1AtHxzzG+dzE1GzZwIbka/vOp2vQd47sroYSppMuH5GwcwM8G
sg64byIj00oj5UhF289hEoVlAL9jz51thzy8hXKC5UQtGnesva5c2hYMKu/Hkf68
7Irg7kWuruc+6MM9F2WIZ/gGGtMqEZQM2NL7WvBlcbbFZHDNGsWojiWhK+IJPK0C
vj217NebILBphOkoXiXsg0PnUNhovLl9Gp/4kuHUT01pZbTzdwd/Va0uLZLY4CFc
s8qx91pxLCVThCDEFJ4mfyFk7QObTl76ObxnqrGMSJ++Co/Wt264cUqDUoJ7rCdN
pQFtOcPk+0RLw4qBFPEL2iKOe4r878PajKaRThE4yt62noF/pfabV0yckVz2lfFY
vnlL85GxgpBdyMp4EGrJyxPqCMSCiBNLzMT6MZWynDlcRwkSf8xZyw36wMoF48Nz
nITmImg+IzyV+eb3gjRqAC6zl2Dd/QZiKti1fgwKt1YFSMIHOuHWpTsxh1b/fAtQ
Gchx01Jkp2kd73jxEEJ8r9yEDZzNf5Hh4U8IiLxFNCP/2UjEtPI5nNSnxm3/fj3v
EhdSjIQGthiXHuU4gAOC4c0=
-----END PTFE MIGRATION DATA-----
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

### Import data into the installer instance

To transfer the migration data to the installer-based instance, connect to it over SSH.

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
and outputs the values you'll need later in the process for the Installer web interface.

## Installing PTFE

The installer can run in two modes, Online or Airgapped. Each of these modes has a different way of executing the installer, but the result is the same.

### Run the Installer - Online

If your instance can access the Internet, use the Online install mode.

1. From a shell on your instance:
    * To execute the installer directly, run `curl https://install.terraform.io/ptfe/stable | sudo bash`
    * To inspect the script locally before running, run `curl https://install.terraform.io/ptfe/stable > install.sh` and, once you are satisfied with the script's content, execute it with `sudo bash install.sh`.
1. The installation will take a few minutes and you'll be presented with a message
   about how and where to access the rest of the setup via the web. This will be
   `https://<TFE HOSTNAME>:8800`
    * The installer uses an internal CA to issue bootstrap certificates, so you will
      see a security warning when first connecting. This is expected and you'll need
      to proceed with the connection anyway.

### Run the Installer - Airgapped

If the instance cannot reach the Internet, follow these steps to begin an Airgapped installation.

#### Prepare the Instance

1. Download the `.airgap` file using the information given to you in your setup email and place that file somewhere on the the instance.
    * If you use are using `wget` to download the file, be sure to use `wget --content-disposition "<url>"` so the downloaded file gets the correct extension.
    * The url generated for the .airgap file is only valid for a short time, so you may wish to download the file and upload it to your own artifacts repository.
1. [Download the installer bootstrapper](https://s3.amazonaws.com/replicated-airgap-work/replicated.tar.gz) and put it into its own directory on the instance (e.g. `/opt/tfe-installer/`)
1. Airgap installations require Docker to be pre-installed. Double check that your instance has a supported version of Docker (see [Preflight: Software Requirements](./preflight-installer.html#software-requirements) above for details).

#### Execute the Installer

From a shell on your instance, in the directory where you placed the `replicated.tar.gz` installer bootstrapper:

1. Run `tar xzf replicated.tar.gz`
1. Run `sudo ./install.sh airgap`
1. When asked, select the interface of the primary private network interface used to access the instance.
1. The software will take a few minutes and you'll be presented with a message about how and where to access the rest of the setup via the web. This will be https://<TFE HOSTNAME>:8800
    * The installer uses an internal CA to issue bootstrap certificates, so you will
      see a security warning when first connecting. This is expected and you'll need
      to proceed with the connection anyway.

### Continue Installation In Browser

1. Configure the hostname and the SSL certificate. **NOTE:** This does not need to be same hostname
   that was used by the AMI. It must be a hostname that currently resolves in DNS properly.
1. Upload your license file, provided to you in your setup email.
1. Indicate whether you're doing an Online or Airgapped installation. Choose Online if
   you're not sure.
    * If you are doing an Airgapped install, provide the path on the the instance
      to the `.airgap` file that you downloaded using the initial instructions in
      your setup email.
1. Secure access to the installer dashboard. We recommend at least setting up the
   simple password authentication. If you're so inclined, LDAP authentication can also be
   configured.
1. The system will now perform a set of pre-flight checks on the instance and
   configuration thus far and indicate any failures. You can either fix the issues
   and re-run the checks, or ignore the warnings and proceed. If the system is running behind a proxy and is unable to connect to `releases.hashicorp.com:443`, it is likely safe to proceed; this check does not currently use the proxy. For any other issues, if you proceed despite the warnings, you are assuming the support responsibility.
1. Set an encryption password used to encrypt the sensitive information at rest. The default value is auto-generated,
   but we strongly suggest you create your own password. Be sure to retain the value, because you will need to use this
   password to restore access to the data in the event of a reinstall.
1. Select **External Services** under Production Type.
1. For the PostgreSQL URL, copy and paste the value that was output by the `migrator` process for _PostgreSQL Database URL_.
1. Select **S3** under Object Storage.
1. Configure the Access Key ID and Secret Access Key, _OR_ indicate that you want to use an instance profile.
   **NOTE**: An instance profile must be previously configured on the instance.
1. For the Bucket, copy and paste the value that was output by the `migrator` process for _S3 Bucket_.
1. For the Region, copy and paste the value that was output by the `migrator` process for _S3 Region_.
1. For the Server-side Encryption, copy and paste the value that was output by the `migrator` process for the server-side encryption.
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

Now that the installer is using a subset of resources created by the AMI cluster Terraform configuration,
we need to move those resources from the Terraform state for the AMI cluster.

If these resources are not moved, it's possible to accidentally delete the data when the AMI
cluster is removed!

~> **NOTE:** If you have modified the Terraform modules we have provided, you'll need to adapt these instructions
   to fit your modifications.

### Move to new Terraform state

First, verify all the resources currently tracked in the Terraform state. If the `terraform.tfstate` file is on
your local disk, change to that directory. Next, list the state:

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

Of these resources, the ones to move from the state so they are can exist outside this Terraform configuration are:

```
aws_kms_alias.key
aws_kms_key.key
module.db.aws_db_instance.rds
module.db.aws_db_subnet_group.rds
module.db.aws_security_group.rds
module.instance.aws_s3_bucket.tfe_bucket
```

To move these resources from the state into a new state file for later use, run:

```shell
$ terraform state mv -state-out=terraform.tfstate.installer aws_kms_alias.key aws_kms_alias.key
$ terraform state mv -state-out=terraform.tfstate.installer aws_kms_key.key aws_kms_key.key
$ terraform state mv -state-out=terraform.tfstate.installer module.db.aws_db_instance.rds module.db.aws_db_instance.rds
$ terraform state mv -state-out=terraform.tfstate.installer module.db.aws_db_subnet_group.rds module.db.aws_db_subnet_group.rds
$ terraform state mv -state-out=terraform.tfstate.installer module.db.aws_security_group.rds module.db.aws_security_group.rds
$ terraform state mv -state-out=terraform.tfstate.installer module.instance.aws_s3_bucket.tfe_bucket module.instance.aws_s3_bucket.tfe_bucket
```

### Destroy AMI Cluster

Now that these resources have been moved out of the AMI state, it's safe to destroy the AMI cluster
without affecting the installer-based installation.

If you're ready to perform that step, run:

```shell
$ terraform destroy
```

You'll be asked to confirm the resources to be destroyed, and should double-check that the list doesn't contain the
resources moved earlier.

### Managing Installer Resources

To continue to manage the resources used by the Installer-based install using Terraform, you can move the resources
in the new `terraform.tfstate.installer` file to a large state file, along with the Terraform modules for them.

