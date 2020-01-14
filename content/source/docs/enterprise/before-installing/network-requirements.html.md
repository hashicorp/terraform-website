---
layout: "enterprise"
page_title: "Network Requirements - Before Installing - Terraform Enterprise"
---

# Network Requirements for Terraform Enterprise

The Linux instance that runs Terraform Enterprise needs to allow several kinds of incoming network access. Terraform Enterprise also needs to access several external services to handle updates and resource downloads.

## Ingress

* **22**: To access the instance via SSH from your computer. SSH access to the instance is required for administration and debugging.
* **80**: To access the Terraform Cloud application via HTTP. This port redirects to port 443 for HTTPS.
* **443**: To access the Terraform Cloud appplication via HTTPS.
* **8800**: To access the installer dashboard.
* **9870-9880 (inclusive)**: For internal communication on the host and its subnet; not publicly accessible.
* **23000-23100 (inclusive)**: For internal communication on the host and its subnet; not publicly accessible.

## Egress

If Terraform Enterprise is installed in online mode, it accesses the following hostnames to get software updates:

* api.replicated.com
* get.replicated.com
* registry-data.replicated.com
* registry.replicated.com
* quay.io
* quay-registry.s3.amazonaws.com
* cloudfront.net
* index.docker.io
* auth.docker.io
* registry-1.docker.io
* download.docker.com
* production.cloudflare.docker.com

Airgapped installs do not check for updates over the network.

Additionally, the following hostnames are accessed unless a
[custom Terraform bundle](/docs/cloud/run/index.html#custom-and-community-providers)
is supplied:

* registry.terraform.io (when using Terraform 0.12 and later)
* releases.hashicorp.com

When [Cost Estimation](/docs/enterprise/admin/integration.html#cost-estimation-integration) is enabled, it uses the respective cloud provider's APIs to get up-to-date pricing info.

* api.pricing.us-east-1.amazonaws.com
* cloud.google.com
* azure.microsoft.com

## Other Configuration

1. If a firewall is configured on the instance, be sure that traffic can flow out of the `docker0` interface to the instance's primary address. For example, to do this with UFW run: `ufw allow in on docker0`. This rule can be added before the `docker0` interface exists, so it is best to do it now, before the Docker installation.
1. Get a domain name for the instance. Using an IP address to access the product is not supported as many systems use TLS and need to verify that the certificate is correct, which can only be done with a hostname at present.
1. **For GCP only:** Configure Docker to use an MTU (maximum transmission unit) of 1460, as required by Google ([GCP Cloud VPN Documentation: MTU Considerations](https://cloud.google.com/vpn/docs/concepts/mtu-considerations)).

    To configure Docker's MTU, create an `/etc/docker/daemon.conf` file with the following content:

    ```json
    {
      "mtu": 1460
    }
    ```

