---
layout: "enterprise"
page_title: "Deploying on Azure - Clustering Beta - Terraform Enterprise"
---

# Clustering Beta: Deploying on Azure

[mode]: ../before-installing/index.html#operational-mode-decision
[tf11]: https://releases.hashicorp.com/terraform/0.11.14/

~> **Please Note**: This software is a beta release. Some features may not yet be implemented, or may not work correctly. We are very interested in your feedback! Please contact your Technical Account Manager if you run into issues.

## Deployment Options

On Microsoft Azure, the clustering beta currently supports the following deployment options:

- **Installation mode:** Online. (Airgapped installation has not yet been tested.)
- [**Operational mode:**][mode] Demo (temporary storage) or external services (use an existing Postgres database and Azure blob storage).
- **Architecture:** Single zone. (Cross-zone configurations are not currently supported.)

Deployment options will be expanded in future releases.

## Architecture

The clustering beta can deploy a variety of architectures, from a single server to a large cluster. Cluster size is controlled by the Terraform module's input variables.

![Diagram of 3 tier clustered application with a loadbalancer, 3 primary vms, and a scaleset of secondary vms, with adjacent key vault for tls](/docs/enterprise/beta/assets/azure_diagram.png)

A Terraform Enterprise cluster consists of two types of servers: primaries and secondaries (also called workers). The primary instances run additional, stateful services that the secondaries do not.

Primaries should be deployed in odd numbers to ensure cluster quorum. Additional primary instances can be safely added while the cluster is running, but destroying a primary instance can cause application instability or outages. We do not recommend resizing the cluster by removing primaries after deployment.

To scale the cluster for higher or lower workloads, add or remove secondary instances.

## Before Installing

Before deploying Terraform Enterprise, you must prepare your credentials, a system to run Terraform from, and some required infrastructure.

### Credentials

Gather the following credentials:

* A license file for the beta. Please talk to your Technical Account Manager or Sales Rep.
* A certificate for the application, preferably a wildcard for the domain used by the load balancer.

### Terraform

The clustering beta relies on Terraform code that was written to support Terraform 0.11.x. You can run this configuration from a workspace in an existing Terraform Enterprise instance, or from an arbitrary workstation or server.

Decide where you'll be running Terraform, and ensure:

- [The latest Terraform 0.11 release][tf11] is installed and available in the PATH.
- The system running Terraform has access to the target subnet.
- The system running Terraform can authenticate to Azure. For more details, see [Azure Provider: Authenticating to Azure](/docs/providers/azurerm/index.html#authenticating-to-azure).
- You're familiar enough with Terraform to write simple configurations that call [modules ](/docs/configuration-0-11/modules.html) and specify [output values](/docs/configuration-0-11/outputs.html).

### Infrastructure

Make sure the following Azure infrastructure is available:

* Access to an existing Azure account and subscription.
* An existing Resource Group.
* An existing Virtual Network, with a subnet dedicated to the Terraform Enterprise clustering beta and an associated Network Security Group. The Network Security Group must permit TCP access over the following ports:

    | Port | Description |
    |------|-------------|
    | 22 | SSH access  |
    | 443 | Application Access |
    | 6443 | Cluster access |
    | 8800 | Installer Dashboard Access |
    | 23010 | Application Health Check |

    -> **Note:** This access list will be reduced for the GA release; it includes some additional ports for troubleshooting access during the beta.
* An Azure Key Vault (for storing/distributing an SSL certificate).
* A DNS zone.

    -> **Note:** The current module assumes the presence of a DNS zone on Azure, and will create DNS entries for the load balancer. If you do not use Azure's DNS services and wish to skip this, you will need to clone the module from GitHub, comment out the DNS resources and variable references, and call the modified copy of the module instead of referencing it from the Terraform Registry.

If you choose to install in external services mode, you will also need:

* An Azure Database for PostgreSQL - please see [PostgreSQL Requirements](../before-installing/postgres-requirements.html).
* An Azure Blob Storage container created specifically for Terraform Enterprise HA Beta. The container does not need to be in the same project as the Terraform Enterprise server(s), but you will need credentials for a service principal to access the container.

#### Automated Preparation

[bootstrap]: https://github.com/hashicorp/private-terraform-enterprise/tree/master/examples/bootstrap-azure

If you have an empty test subscription, you can create the required infrastructure resources with an [example bootstrap Terraform module][bootstrap]. This module only requires the following:

* Access to the subscription
* A DNS zone

The module will create the virtual network, the subnet, required firewalls, and an Azure key vault.

- [Clustering Beta for Azure: Bootstrap Example][bootstrap]

## Installation

[module]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/azurerm
[inputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/azurerm?tab=inputs
[outputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/azurerm?tab=outputs

1. In your web browser, go to the [hashicorp/terraform-enterprise/azurerm module][module] on the Terraform Registry. This is the module you'll use to deploy the clustering beta.
2. Review the module's [input variables][inputs].
3. Create a new Terraform configuration that calls the `hashicorp/terraform-enterprise/azurerm` module:
    - Start by copying the "Provision Instructions" example from the module's Terraform Registry page.
    - Fill in values for all of the required input variables.
    - Fill in any optional variables as desired. If you omit all optional variables, the module will deploy a mid-sized cluster using the **demo** operational mode.
    - Map all of the module's [output values][outputs] to root-level outputs, so that Terraform will display them after applying the configuration. For example:

        ```hcl
        output "tfe_beta" {
          value = {
            application_endpoint = "${module.terraform-enterprise.application_endpoint}"
            application_health_check = "${module.terraform-enterprise.application_health_check}"
            # ...
          }
        }
        ```

        ~> **Important:** The module's outputs include credentials necessary for completing the installation.
4. Initialize Terraform and run a plan. If you are running Terraform from the CLI, you can do this by navigating to the configuration's directory and running:

    ```
    $ terraform init
    $ terraform plan -out planfile
    ```
5. If the plan runs without errors and looks correct, apply it:

    ```
    $ terraform apply planfile
    ```

    -> **Note:** The apply can take several minutes.
6. Once the apply has finished, Terraform will display any root-level outputs you configured. For example:

    ```text
    Apply complete! Resources: 37 added, 0 changed, 0 destroyed.

    Outputs:

    tfe_beta = {
      application_endpoint = https://tfe-k6ad3oku.tfe.example.com
      application_health_check = http://tfe-k6ad3oku.tfe.example.com/_health_check
      installer_dashboard_endpoint = https://tfe-k6ad3oku.tfe.example.com:8800
      installer_dashboard_password = random-starting-password
      ssh_config_file = /path/to/ssh_config
    }
    ```

    At this point, the infrastructure is finished deploying, but the application is not. It can take up to 30 minutes before the website becomes available.

    The installer dashboard should become available first, and is accessible at the URL specified in the `installer_dashboard_endpoint` output. 
7. Open the installer dashboard in your web browser, and log in with the password specified in the `installer_dashboard_password` output. Follow the instructions at [Terraform Enterprise Configuration](../install/config.html) to finish setting up the application.

After the application is fully deployed, you can adjust the cluster's size by changing the module's inputs and re-applying the Terraform configuration.
