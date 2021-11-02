---
layout: "enterprise"
page_title: "Terraform Cloud Agents on TFE - Infrastructure Administration - Terraform Enterprise"
description: |-
    Cloud agents let Terraform manage isolated, private, or on-premises infrastructure.
    Learn what's different when you use cloud agents in Terraform Enterprise vs. Terraform Cloud.
---

# Terraform Cloud Agents on TFE

Terraform Cloud Agents allow Terraform Enterprise to communicate with isolated,
private, or on-premises infrastructure. By deploying lightweight agents within a
specific network segment, you can establish a simple connection between your
environment and Terraform Enterprise which allows for provisioning operations and
management.

Terraform Cloud Agents on TFE behave very similarly to [Terraform Cloud Agents on TFC](/docs/cloud/agents/index.html),
with a few exceptions listed below.

-> **Note:** Terraform Cloud Agents on TFE are available in TFE releases `v202109-1`
and later.

## Differences Between Agents on TFC and TFE

* **No restriction on Agent or Agent Pool Count**: Terraform Enterprise does not
place a limitation on the number of Agent Pools that can be created per organization,
or the number of Agents that may register themselves with a given pool.

* **Hostname Registration**: Terraform Cloud Agents registering with a TFE instance
must define the TFE hostname via the `-address` CLI flag or `TFC_ADDRESS` environment
variable when running `tfc-agent`. By default, `tfc-agent` will attempt to connect to
Terraform Cloud, so this value must be explicitly defined when registering with a
TFE instance.

* **Custom Bundle Support**: Terraform Cloud Agents on TFE support
[custom Terraform bundles](https://github.com/hashicorp/terraform/tree/main/tools/terraform-bundle).
Custom bundles are created and defined within the TFE application; Agents will
download the custom bundle based on the Terraform version information. See
[using a custom Terraform bundle](https://support.hashicorp.com/hc/en-us/articles/360016992613-Using-custom-and-community-providers-in-Terraform-Cloud-and-Enterprise)
for more detail on custom bundles in TFE.

* **Network Access Requirements**: Terraform Cloud Agents on TFE must be able to
communicate with the TFE instance via HTTPS. Additionally, the agent must also be
able to communicate with any services required by the Terraform code it is executing.
This includes the Terraform releases distribution service, [releases.hashicorp.com](https://releases.hashicorp.com),
as well as the [Terraform provider registry](https://registry.terraform.io). Agents
executing in a workspace that leverage a Terraform version that provides a custom
Terraform bundle with pre-existing provider binaries do not need access to these resources.

* **Agent Version Compatibility**: TFE places restrictions on what versions of Terraform Cloud Agents can be registered. This is to prevent an incompatible agent from registering with a TFE instance and attempting to execute a Terraform operation in an undefined way. Compatible versions of Terraform Cloud Agents on TFE will vary based on the specific TFE release sequence; any changes to compatible Terraform Cloud Agents versions will be noted in the [TFE release notes](https://github.com/hashicorp/terraform-enterprise-release-notes).

-> **Note:** TFE is currently compatible with Terraform Cloud agents versions `0.4.2` and lower.
