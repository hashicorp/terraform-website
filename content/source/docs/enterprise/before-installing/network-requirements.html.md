---
layout: "enterprise"
page_title: "Network Requirements - Before Installing - Terraform Enterprise"
---

# Network Requirements for Terraform Enterprise

The Linux instance that runs Terraform Enterprise needs to allow several kinds of incoming network access. Terraform Enterprise also needs to access several external services to handle updates and resource downloads.

## Ingress

### Source — User/Client/VCS

* **80:** Terraform Enterprise application access (HTTP; redirects to HTTPS)
* **443:** Terraform Enterprise application access (HTTPS)

### Source — Administrators

* **22:** SSH access (administration and debugging)
* **8800:** Replicated (TFE setup dashboard, HTTPS)
* **32846:** TFE admin console (a Replicated service)

### Source — TFE Server(s)

* **8201:** Vault HA request forwarding (only necessary when operating in Active/Active mode)

Additionally, the following ports are used by various application components internally.
This list serves as a point of reference; it is not necessary to expose these ports
for accessibility in a firewall:

* **2003:** Graphite (Carbon) feeding port (monitoring, metrics)
* **2004:** Graphite (Carbon) feeding port (monitoring, metrics)
* **3121:** TFE private registry
* **4150-4151, 4160-4161, 4170-4171:** Replicated NSQD (messaging platform daemon for internal communication)
* **5432:** PostgreSQL
* **5672:** RabbitMQ TFE worker coordination
* **6379:** Redis (application-level caching and coordination)
* **7586:** TFE ingress (pulls in version control system data for application, stores it via Archivist)
* **7588:** TFE state parser
* **7675:** TFE Archivist (stores data in object storage, encrypts it via Vault)
* **8086:** InfluxDB default UDP Service (monitoring, metrics)
* **8125:** StatsD (monitoring, metrics)
* **8200:** Vault (encryption service)
* **9292:** Atlas engine (old name of TFE engine)
* **9870-9880 (inclusive):** host and subnet traffic only; not publicly accessible
    * **9873:** Replicated Retraced engine API (Replicated audit subcomponent)
    * **9874-9879:** Replicated entry point span
* **23000-23100 (inclusive):** host and subnet traffic only; not publicly accessible
    * **23005:** TFE health check point
    * **23020:** Nomad (scheduler for Sentinel runs)
* **32774-32776:** Replicated internal Graphite and StatsD ports (mapped to external ports 2003, 2004, and 8125)

## Egress

If Terraform Enterprise is installed in online mode, it accesses the following hostnames to get software updates:

* `api.replicated.com`
* `get.replicated.com`
* `registry-data.replicated.com`
* `registry.replicated.com`
* `*.quay.io`
* `cdn.quay.io`
* `quay-registry.s3.amazonaws.com`
* `*.cloudfront.net`
* `hub.docker.com`
* `index.docker.io`
* `auth.docker.io`
* `registry-1.docker.io`
* `download.docker.com`
* `production.cloudflare.docker.com`

Airgapped installs do not check for updates over the network.

Additionally, the following hostnames are accessed unless a
[custom Terraform bundle](/docs/cloud/run/install-software.html#custom-and-community-providers)
is supplied:

* `registry.terraform.io` (when using Terraform 0.12 and later)
* `releases.hashicorp.com`

Online and airgap installs also need egress access to any VCS servers/services that will be utilized, login/authentication servers if SAML will be configured (ADFS, Okta, etc), the various cloud API endpoints that will be managed with Terraform and any other third party services that will either be integrated with the Terraform Enteprise server or managed with it.

When [Cost Estimation](/docs/enterprise/admin/integration.html#cost-estimation-integration) is enabled, it uses the respective cloud provider's APIs to get up-to-date pricing info.

* `api.pricing.us-east-1.amazonaws.com`
* `cloudbilling.googleapis.com`
* `management.azure.com`
* `ratecard.azure-api.net`

## Other Configuration

1. If a firewall is configured on the instance, be sure that traffic can flow out of the `docker0` interface to the instance's primary address. For example, to do this with UFW run: `ufw allow in on docker0`. This rule can be added before the `docker0` interface exists, so it is best to do it now, before the Docker installation.
1. Get a domain name for the instance. Using an IP address to access the product is not supported as many systems use TLS and need to verify that the certificate is correct, which can only be done with a hostname at present.
1. **For GCP only:** Configure Docker to use an MTU (maximum transmission unit) of 1460, as required by Google ([GCP Cloud VPN Documentation: MTU Considerations](https://cloud.google.com/network-connectivity/docs/vpn/concepts/mtu-considerations)).

    To configure Docker's MTU, create an `/etc/docker/daemon.json` file with the following content:

    ```json
    {
      "mtu": 1460
    }
    ```

1. Ensure the Docker bridge network address is not in use elsewhere on the network. If it is, please refer to the [Docker documentation](https://docs.docker.com/network/bridge/) for information on how to change it.
