---
layout: "enterprise"
page_title: "Interactive Installation - Install and Config - Terraform Enterprise"
---

# Interactive Terraform Enterprise Installation — Individual Instance

## Delivery

This document outlines the procedure for using the Terraform Enterprise
installer to set up Terraform Enterprise on a customer-controlled machine.

-> **Important:** Before you begin, consult the [Pre-Install Checklist](../before-installing/index.html) for prerequisites. You'll need to prepare data files and a Linux instance.

## Proxy Usage

If your installation requires using a proxy server, you will be asked for the proxy server information when you first
run the installer via `ssh`. This proxy server will be used for all outbound HTTP and HTTPS connections.

Optionally, if you're running the installer script in an automated manner, you can pass a `http-proxy` flag to set
the address of the proxy. For example:

```
./install.sh http-proxy=http://internal.mycompany.com:8080
```

### Proxy Exclusions (NO\_PROXY)

If certain hostnames should not use the proxy and the instance should connect directly to them (for instance, for S3), then you can pass an additional option to provide a list of domains:

```
./install.sh additional-no-proxy=s3.amazonaws.com,internal-vcs.mycompany.com,example.com
````

Passing this option to the installation script is particularly useful if the hostnames that should not use the proxy include services that the instance needs to be able to reach during installation, such as S3. Alternately, if the only hosts you need to add are those that are not used during installation, such as a private VCS instance, you can provide these hosts after initial installation is complete, in the settings tab in your dashboard (available on port 8800 under `/console/settings`).

### Reconfiguring the Proxy

To change the proxy settings after installation, use the Console settings page, accessed from the dashboard on port 8800 under `/console/settings`.

![Terraform Enterprise Console Settings](./assets/ptfe-console-settings.png)

On the Console Settings page, there is a section for HTTP Proxy:

![Terraform Enterprise HTTP Proxy Settings](./assets/ptfe-http-proxy.png)

This change updates the proxy settings for the Terraform Enterprise application services. To update the proxy settings for the installer (for example, to handle configuration tests correctly), additional steps are necessary:

1. Locate the Replicated configuration files on the instance under either `/etc/sysconfig/` or `/etc/default`: `replicated` and `replicated-operator`.
2. Open the files for editing. On the line that includes `REPLICATED_OPTS` for `replicated` or `REPLICATED_OPERATOR_OPTS` for `replicated-operator`, add `-e HTTP_PROXY=<your proxy url> -e NO_PROXY=<list of no_proxy hosts>` to the existing command options. The list of `no_proxy` hosts is a comma-separated list with no spaces, and should include following addresses `127.0.0.1,<DOCKER0 INTERFACE IP>,<IP ADDRESS OF PTFE INSTANCE>,<HOSTNAME OF PTFE INSTANCE>` but not limited to.
3. Docker also needs to be able to communicate to endpoints with the same rules of proxy settings as `replicated` and `replicated-operator`, the steps 1-6 of this [document](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy) are required.
`NOTE: Please take precautions on application outage when applying configuration change, i.e. wait for all runs to finish, prevent new runs to trigger`
4. Restart the Replicated services following [the instructions for your distribution](https://help.replicated.com/docs/native/customer-installations/installing-via-script/#restarting-replicated).

## Trusting SSL/TLS Certificates

There are two primary areas for SSL configuration.

### TLS Key & Cert

The TLS Key & Cert field (found in the console settings after initial installation) should contain Terraform Enterprise's own key and certificate, or key and certificate chain. A chain would be used in this field if the CA indicates an intermediate certificate is required as well.

### Certificate Authority (CA) Bundle

Terraform Enterprise needs to be able to access all services that it integrates with, such as VCS providers or database servers.
Because it typically accesses them via SSL/TLS, it is critical that the certificates used by any service
that Terraform Enterprise integrates with are trusted by Terraform Enterprise.

This section is used to allow Terraform Enterprise to connect to services that use SSL/TLS certificates issued by private CAs.
It allows multiple certificates to be specified as trusted, and should contain all certificates that Terraform Enterprise
should trust when presented with them from itself or another application.

A collection of certificates for trusted issuers is known as a `Certificate Authority (CA) Bundle`.
All certificates in the certificate signing chain, meaning the root certificate and any intermediate certificates,
must be included here. These multiple certificates are listed one after another in text format.

~> **Note:** If Terraform Enterprise is configured with a SSL key and certificate issued against a private CA,
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

![Terraform Enterprise ca ui](./assets/ptfe-ca-bundle.png)

#### TLS Versions

As of version 201902-01, TLS versions 1.0 and 1.1 are no longer supported in Terraform Enterprise. Your options now include TLS v1.2 and TLS v1.3:

![Terraform Enterprise tls ui](./assets/ptfe-tls-ui.png)

## Alternative Terraform worker image

TFE runs `terraform plan` and `terraform apply` operations in a disposable Docker containers. There are cases where runs may make frequent use of additional tools that are not available in the default Docker image. To allow use of these tools for any plan or apply, users can build their own image and configure TFE to use that instead. In order for this to happen the name of the alternative docker image must be set in the config by using the `Custom image tag` field as shown below:

![Terraform Enterprise docker image](./assets/ptfe-docker-image.png)

### Requirements
 - The base image must be `ubuntu:xenial`.
 - The image must exist on the Terraform Enterprise host. It can be added by running `docker pull` from a local registry or any other similar method.
 - CA certificates must be available when Terraform runs. During image creation, a file containing all necessary PEM encoded CA certificates must be placed in `/etc/ssl/certs/ca-certificates.crt`.
 - Terraform must not be installed on the image. TFE will take care of that at runtime.

 This is a sample `Dockerfile` you can use to start building your own image:

 ```
# This Dockerfile builds the image used for the worker containers.
FROM ubuntu:xenial

# Inject the ssl certificates
ADD ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

# Install software used by TFE
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo unzip daemontools git-core ssh wget curl psmisc iproute2 openssh-client redis-tools netcat-openbsd
```

### Image initialization
To run initialization commands in your image during runtime, create a script at `/usr/local/bin/init_custom_worker.sh` and make it executable. This script, and all commands it invokes, will be executed before TFE runs `terraform init`.

The name, location, and permissions of the script are not customizable.

## Operational Mode Decision

Terraform Enterprise can store its state in a few different ways, and you'll
need to decide which works best for your installation. Each option has a
different approach to
[recovering from failures](../system-overview/reliability-availability.html#recovery-from-failures-1).
The mode should be selected based on your organization's needs. See
[Pre-Install Checklist: Operational Mode Decision](../before-installing/index.html#operational-mode-decision)
for more details.

## Installation

The installer can run in two modes, Online or Airgapped. Each of these modes has a different way of executing the installer, but the result is the same.

~> **Note:** After running the installation script, the remainder of the installation is done through a browser using the installer dashboard on port 8800 of the TFE instance. To complete the installation, you must be able to connect to that port via HTTPS. The installer uses an internal CA to issue bootstrap certificates, so you will see a security warning when first connecting, and you'll need to proceed with the connection anyway.

### Run the Installer - Online

If your instance can access the Internet, use the Online install mode.

1. From a shell on your instance:
    * To execute the installer directly, run `curl https://install.terraform.io/ptfe/stable | sudo bash`
    * To inspect the script locally before running, run `curl https://install.terraform.io/ptfe/stable > install.sh` and, once you are satisfied with the script's content, execute it with `sudo bash install.sh`.
1. The installation will take a few minutes and you'll be presented with a message
    about how and where to access the rest of the setup via the web. This will be
    `https://<TFE HOSTNAME>:8800`.
    * You will see a security warning when first connecting. This is expected and you'll need
      to proceed with the connection anyway.

### Run the Installer - Airgapped

If the instance cannot reach the Internet, follow these steps to begin an Airgapped installation.

#### Prepare the Instance

1. Airgap installations require Docker to be pre-installed. Double-check that your instance has a supported version of Docker (see [Pre-Install Checklist: Software Requirements](../before-installing/index.html#software-requirements) for details).
1. Download the `.airgap` file using the information given to you in your setup email and place that file somewhere on the the instance.
    * If you use are using `wget` to download the file, be sure to use `wget --content-disposition "<url>"` so the downloaded file gets the correct extension.
    * The url generated for the .airgap file is only valid for a short time, so you may wish to download the file and upload it to your own artifacts repository.
1. [Download the installer bootstrapper](https://install.terraform.io/airgap/latest.tar.gz) and put it into its own directory on the instance (e.g. `/opt/tfe-installer/`)


#### Execute the Installer

From a shell on your instance, in the directory where you placed the `replicated.tar.gz` installer bootstrapper:

1. Run `tar xzf replicated.tar.gz`
1. Run `sudo ./install.sh airgap`
1. When asked, select the interface of the primary private network interface used to access the instance.
1. The software will take a few minutes and you'll be presented with a message about how and where to access the rest of the setup via the web. This will be `https://<TFE HOSTNAME>:8800`.
    * You will see a security warning when first connecting. This is expected and you'll need
      to proceed with the connection anyway.

### Continue Installation In Browser

1. Configure the hostname and the SSL certificate.
1. Upload the license file provided to you in your setup email.
1. Indicate whether you're doing an Online or Airgapped installation. Choose Online if
   you're not sure.
    * If you are doing an Airgapped install, provide the path on the the instance
      to the `.airgap` file that you downloaded using the initial instructions in
      your setup email.
1. Secure access to the installer dashboard. We recommend at least setting up the
   simple password authentication. If you're so inclined, LDAP authentication can also be
   configured.
1. The system will now perform a set of pre-flight checks on the instance and
   the configuration up to this point and indicate any failures. You can either fix the issues
   and re-run the checks, or ignore the warnings and proceed. If the system is running behind a proxy and is unable to connect to `releases.hashicorp.com:443`, it is likely safe to proceed; this check does not currently use the proxy. For any other issues, if you proceed despite the warnings, you are assuming the support responsibility.
1. Set an encryption password used to encrypt the sensitive information at rest. The default value is auto-generated,
   but we strongly suggest you create your own password. Be sure to retain the value, because you will need to use this
   password to restore access to the data in the event of a reinstall. See [Encryption Password](./encryption-password.html) for more information.
1. Configure the operational mode for this installation. See
   [Pre-Install Checklist: Operational Modes](../before-installing/index.html#operational-mode-decision) for information on what the different values are. Ensure that you've met the relevant pre-install requirements for the mode you chose.
1. _Optional:_ Adjust the concurrent capacity of the instance. This should
   only be used if the hardware provides more resources than the baseline
   configuration and you wish to increase the work that the instance does
   concurrently. This setting should be adjusted with care as setting it too
   high can result in an very unresponsive instance.
1. _Optional:_ Provide the text version of a certificate (or certificates) that will be added to the trusted
   list for the product. This is used when services the product communicates with do not use
   globally trusted certificates but rather a private Certificate Authority (CA). This is typically
   used when Terraform Enterprise uses a private certificate (it must trust itself) or a
   VCS provider uses a private CA.
1. _Optional:_ Adjust the path used to store the vault files that are used to encrypt
   sensitive data. This is a path on the host system, which allows you
   to store these files outside of the product to enhance security. Additionally,
   you can configure the system not to store the vault files within any snapshots,
   giving you full custody of these files. These files will need to be provided before
   any snapshot restore process is performed, and should be placed into the path configured.
1. _Optional:_ Configure the product to use an externally managed Vault cluster.
   See [Externally Managed Vault Cluster](../before-installing/vault.html) for details about the required Vault configuration before using this option.

### Finish Bootstrapping

Once configured, the software will finish downloading. When it’s ready, the UI
will indicate so and there will be an Open link to click to access the Terraform Enterprise UI.

## Configuration

After completing a new install you should head to the [configuration
page](./config.html) to continue setting up Terraform Enterprise.
