---
layout: "enterprise"
page_title: "Interactive Installation - Install and Config - Terraform Enterprise"
---

# Interactive Terraform Enterprise Installation

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

![Terraform Enterprise Console Settings](./assets/tfe-console-settings.png)

On the Console Settings page, there is a section for HTTP Proxy:

![Terraform Enterprise HTTP Proxy Settings](./assets/tfe-http-proxy.png)

This change updates the proxy settings for the Terraform Enterprise application services. To update the proxy settings for the installer (for example, to handle configuration tests correctly), additional steps are necessary:

1. Locate the Replicated configuration files on the instance under either `/etc/sysconfig/` or `/etc/default`: `replicated` and `replicated-operator`.
2. Open the files for editing. On the line that includes `REPLICATED_OPTS` for `replicated` or `REPLICATED_OPERATOR_OPTS` for `replicated-operator`, add `-e HTTP_PROXY=<your proxy url> -e NO_PROXY=<list of no_proxy hosts>` to the existing command options. The list of `no_proxy` hosts is a comma-separated list with no spaces, and should include following addresses `127.0.0.1,<DOCKER0 INTERFACE IP>,<IP ADDRESS OF TFE INSTANCE>,<HOSTNAME OF TFE INSTANCE>` but not limited to.
3. Docker also needs to be able to communicate to endpoints with the same rules of proxy settings as `replicated` and `replicated-operator`, the steps 1-6 of this [document](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy) are required.
`NOTE: Please take precautions on application outage when applying configuration change, i.e. wait for all runs to finish, prevent new runs to trigger`
4. Restart the Replicated services following [the instructions for your distribution](https://help.replicated.com/docs/native/customer-installations/installing-via-script/#restarting-replicated).

### Proxy and Service Discovery Process

Unless the execution mode of a workspace is set to "local", Terraform Enterprise performs [remote operations](/docs/cloud/run/index.html#remote-operations), running Terraform in its own worker VMs.

When running within Terraform Enterprise's worker VMs, Terraform uses [service discovery](/docs/internals/remote-service-discovery.html) to find the Terraform Enterprise service itself. Depending on your infrastructure setup, you may need to tell Terraform Enterprise not to access its own hostname via the proxy, so that Terraform can communicate with the Terraform Enterprise services.

To do this, add Terraform Enterprise's fully qualified hostname to the **Proxy Bypass** setting in Terraform Enterprise's dashboard. The proxy bypass setting can be found on port **8800** on the path `/settings`.

![Terraform Enterprise Proxy Bypass](./assets/tfe-proxy-bypass.png)

Save the configuration using the **Save** button at the bottom of the page. Once configuration has been saved, please proceed to restart the application.

You can use the equivalent setting, [extra_no_proxy](./automating-the-installer.html#available-settings), to automate this step.

The Terraform CLI performs a TLS handshake with Terraform Enterprise during service discovery, and will need access to the Certificate Authority that Terraform Enterprise uses.

Either add the CA to the [CA Custom Bundle](#certificate-authority-ca-bundle) configuration so that Terraform Enterprise will make the CA available in the worker container, or, if a [custom worker image](#alternative-terraform-worker-image) is configured, add the CA directly to its certificate file (located at `/etc/ssl/certs/ca-certificates.crt`).

## TLS Configuration

There are two sections for TLS configuration; the "TLS Key & Cert" section and the "SSL/TLS Configuration" section.

### TLS Key & Cert

The "TLS Key & Cert" section is where the TLS certificate and private key can be configured to allow HTTPS connections to Terraform Enterprise. The TLS certificate and private key files can be self-signed, located in a path on the server, or uploaded. Both the TLS certificate and private key files must be PEM-encoded. The TLS certificate file can contain a full chain of TLS certificates if necessary.

For convenience, a brand new Terraform Enterprise installation may prompt for these settings after the initial setup. You can provide a key and certificate immediately, or use a self-signed certificate to begin with and change the settings later.

![Installer TLS Key and Cert](./assets/tls-installer.png)

For an existing installation, these settings can be found in the Replicated console on port 8800. Click on the gear icon in the top right corner, click "Console Settings", and scroll to the "TLS Key & Cert" section.

The key and certificate settings can be one of three values, each of which are detailed below.

#### Self-signed (generated)

When the "Self-signed (generated)" radio button is selected, a self-signed TLS certificate and private key will be automatically generated. An example screenshot is below:

![Self-signed TLS Key and Cert](./assets/tls-self-signed.png)

#### Server path

When the "Server path" radio button is selected, the TLS certificate and private key will be read from the specified file paths on the server. An example screenshot is below:

![Server Path TLS Key and Cert](./assets/tls-server-path.png)

#### Upload files

When the "Upload file" radio button is selected, the TLS certificate and private key must be uploaded. An example screenshot is below:

![Upload File TLS Key and Cert](./assets/tls-upload.png)

~> **Note:** Changes to the key and certificate settings require a restart of the Terraform Enterprise application.

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

The user interface to upload these certificates looks like this:

![Terraform Enterprise Certificate Authority User Interface](./assets/tls-ca.png)

#### TLS Versions

As of version 201902-01, TLS versions 1.0 and 1.1 are no longer supported in Terraform Enterprise. Your options now include TLS v1.2 and TLS v1.3:

![Terraform Enterprise TLS Versions User Interface](./assets/tls-versions.png)

## Alternative Terraform worker image

TFE runs `terraform plan` and `terraform apply` operations in a disposable Docker containers. There are cases where runs may make frequent use of additional tools that are not available in the default Docker image. To allow use of these tools for any plan or apply, users can build their own image and configure TFE to use that instead. In order for this to happen the name of the alternative docker image must be set in the config by using the `Custom image tag` field as shown below:

![Terraform Enterprise docker image](./assets/tfe-docker-image.png)

### Requirements
 - The base image must be `ubuntu:xenial`.
 - The image must exist on the Terraform Enterprise host. It can be added by running `docker pull` from a local registry or any other similar method.
 - All necessary PEM-encoded CA certificates must be placed within the `/usr/local/share/ca-certificates` directory. Each file added to this directory must end with the `.crt` extension. The CA certificates configured in the [CA Bundle settings](#certificate-authority-ca-bundle) will not be automatically added to this image at runtime.
 - Terraform must not be installed on the image. Terraform Enterprise will take care of that at runtime.

This is a sample `Dockerfile` you can use to start building your own image:

```
# This Dockerfile builds the image used for the worker containers.
FROM ubuntu:xenial

# Install software used by Terraform Enterprise.
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo unzip daemontools git-core awscli ssh wget curl psmisc iproute2 openssh-client redis-tools netcat-openbsd ca-certificates

# Include all necessary CA certificates.
ADD example-root-ca.crt /usr/local/share/ca-certificates/
ADD example-intermediate-ca.crt /usr/local/share/ca-certificates/

# Update the CA certificates bundle to include newly added CA certificates.
RUN update-ca-certificates
```

### Executing Custom Scripts

The alternative worker image supports executing custom scripts during different points of a Terraform Enterprise run.
These custom scripts allow Terraform Enterprise administrators to extend the functionality of Terraform Enterprise runs.

Please note the following when utilizing custom scripts:

- If the script exits with a non-zero exit code, the Terraform Enterprise run will immediately fail with an error.
- The name and location of the script are not customizable.
- The script must be executable. That is, the script must have execute permissions.
- The execution of the script does not have a timeout. It is up to the Terraform Enterprise administrator to ensure
  scripts execute in a timely fashion.
- The execution of the script is not sandboxed. The script is executed in the same container `terraform` is executed in.

#### Initialize Script

To execute an initialize script, ensure your worker image contains an executable shell script at
`/usr/local/bin/init_custom_worker.sh`. This script, and all commands it invokes, will be executed before a Terraform
Enterprise run executes `terraform init`. This initialize script will be executed during both plans and applies.

Example `Dockerfile` snippet for adding an initialize script:

```
ADD init_custom_worker.sh /usr/local/bin/init_custom_worker.sh
```

#### Finalize Script

To execute a finalize script, ensure your worker image contains an executable shell script at
`/usr/local/bin/finalize_custom_worker.sh`. This script, and all commands it invokes, will be executed after a Terraform
Enterprise run finishes executing `terraform plan` or `terraform apply`. This finalize script will be executed during
both plans and applies.

Example `Dockerfile` snippet for adding a finalize script:

```
ADD finalize_custom_worker.sh /usr/local/bin/finalize_custom_worker.sh
```

## Operational Mode Decision

Terraform Enterprise can store its state in a few different ways, and you'll
need to decide which works best for your installation. Each option has a
different approach to
[recovering from failures](../admin/automated-recovery.html).
The mode should be selected based on your organization's needs. See
[Pre-Install Checklist: Operational Mode Decision](../before-installing/index.html#operational-mode-decision)
for more details.

## Installation

The installer can run in two modes, Online or Airgapped. Each of these modes has a different way of executing the installer, but the result is the same.

~> **Note:** After running the installation script, the remainder of the installation is done through a browser using the installer dashboard on port 8800 of the TFE instance. To complete the installation, you must be able to connect to that port via HTTPS. The installer uses an internal CA to issue bootstrap certificates, so you will see a security warning when first connecting, and you'll need to proceed with the connection anyway.

### Run the Installer - Online

If your instance can access the Internet, use the Online install mode.

1. From a shell on your instance:
    * To execute the installer directly, run `curl https://install.terraform.io/ptfe/stable | sudo bash`.
    * To inspect the script locally before running, run `curl https://install.terraform.io/ptfe/stable > install.sh` and, once you are satisfied with the script's content, execute it with `sudo bash install.sh`.
      * RedHat Enterprise Linux requires Docker to be pre-installed. As such, execute the installer script using `sudo bash install.sh no-docker` to prevent the installer script from automatically installing Docker.
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

From a shell on your instance, in the directory where you placed the `latest.tar.gz` installer bootstrapper:

1. Run `tar xzf latest.tar.gz`
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
