---
layout: "enterprise"
page_title: "Network Requirements - Before Installing - Terraform Enterprise"
---

# Network Requirements for Terraform Enterprise

The Linux instance that runs Terraform Enterprise needs to allow several kinds of incoming network access. Terraform Enterprise also needs to access several external services to handle updates and resource downloads.

## Ingress

* **22**: To access the instance via SSH from your computer. SSH access to the instance is required for administration and debugging.
* **443**: To access the Terraform Cloud appplication via HTTPS.
* **6443**: To access specific cluster information.
* **8800**: To access the installer dashboard.
* **23010**: To access the application health check endpoint.
* **9870-9880 (inclusive)**: For internal communication on the host and its subnet; not publicly accessible.
* **23000-23100 (inclusive)**: For internal communication on the host and its subnet; not publicly accessible.

## Egress

If Terraform Enterprise is installed in online mode, it accesses the following hostnames to get software updates:

* api.replicated.com
* get.replicated.com
* quay.io
* registry-data.replicated.com
* registry.replicated.com

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