---
layout: "enterprise"
page_title: "Azure - Clustered Deployment - Install and Config - Terraform Enterprise"
---

# Deploying a Terraform Enterprise Cluster on Azure

[mode]: ../before-installing/index.html#operational-mode-decision
[tf11]: https://releases.hashicorp.com/terraform/0.11.14/
[module]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/azurerm
[inputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/azurerm?tab=inputs
[outputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/azurerm?tab=outputs
[bootstrap]: https://github.com/hashicorp/private-terraform-enterprise/tree/master/examples/bootstrap-azure

This page outlines the procedure for deploying a Terraform Enterprise cluster on Azure.

## Summary

Deploying Terraform Enterprise involves the following steps:

1. Follow the pre-install checklist.
2. Prepare the machine that will run Terraform.
3. Prepare some required Azure infrastructure.
4. Write a Terraform configuration that calls the deployment module.
5. Apply the configuration to deploy the cluster.

## Terraform Module

The clustered deployment process relies on a Terraform module, which is available here:

- [**Terraform Registry: Terraform Enterprise for Azure**][module]

This page should be used in conjunction with the module's documentation on the Terraform Registry, which includes full documentation for the module's input variables and outputs.

## Pre-Install Checklist

Before you begin, follow the [Pre-Install Checklist](../before-installing/index.html) and ensure you have all of the prerequisites. This checklist includes several important decisions, some supporting infrastructure, and necessary credentials.

In particular, note that Terraform Enterprise's certificate must be in PFX format.

## Prepare a Machine for Terraform

The Terraform module that deploys Terraform Enterprise is written to support Terraform 0.11.x. You can run this configuration from a workspace in an existing Terraform Enterprise instance, or from an arbitrary workstation or server.

Decide where you'll be running Terraform, and ensure:

- [The latest Terraform 0.11 release][tf11] is installed and available in the PATH.
- The system running Terraform has access to the target subnet.
- The system running Terraform can authenticate to Azure. For more details, see [Azure Provider: Authenticating to Azure](/docs/providers/azurerm/index.html#authenticating-to-azure).
- You're familiar enough with Terraform to write simple configurations that call [modules ](/docs/configuration-0-11/modules.html) and specify [output values](/docs/configuration-0-11/outputs.html).

## Prepare Infrastructure

Make sure the following foundational Azure infrastructure is available:

* Access to an existing Azure account and subscription.
* An existing Resource Group.
* An existing Virtual Network, with a subnet dedicated to the Terraform Enterprise cluster and an associated Network Security Group. The Network Security Group must permit TCP access over the following ports:

    | Port | Description |
    |------|-------------|
    | 22 | SSH access  |
    | 443 | Application Access |
    | 6443 | Cluster access |
    | 8800 | Installer Dashboard Access |
    | 23010 | Application Health Check |

    -> **Note:** This access list includes some additional ports for troubleshooting access.
* An Azure Key Vault (for storing/distributing an SSL certificate).
* A DNS zone.

    -> **Note:** The current module assumes the presence of a DNS zone on Azure, and will create DNS entries for the load balancer. If you do not use Azure's DNS services and wish to skip this, you will need to clone the module from GitHub, comment out the DNS resources and variable references, and call the modified copy of the module instead of referencing it from the Terraform Registry.

If you choose to install in external services mode, you will also need:

* An Azure Database for PostgreSQL - please see [PostgreSQL Requirements](../before-installing/postgres-requirements.html).
* An Azure Blob Storage container created specifically for Terraform Enterprise. The container does not need to be in the same project as the Terraform Enterprise server(s), but you will need credentials for a service principal to access the container.

### Automated Preparation

If you have an empty test subscription, you can create the required infrastructure resources with an [example bootstrap Terraform module][bootstrap]. This module only requires the following:

* Access to the subscription
* A DNS zone

The module will create the virtual network, the subnet, required firewalls, and an Azure key vault.

## Write the Terraform Configuration

1. In your web browser, go to the [hashicorp/terraform-enterprise/azurerm module][module] on the Terraform Registry. This is the module you'll use to deploy Terraform Enterprise.
2. Review the module's [input variables][inputs].
3. Create a new Terraform configuration that calls the `hashicorp/terraform-enterprise/azurerm` module:
    - Start by copying the "Provision Instructions" example from the module's Terraform Registry page.
    - Fill in values for all of the required input variables.
    - Fill in any optional variables as desired. If you omit all optional variables, the module will deploy a mid-sized cluster using the **demo** operational mode.
    - Map all of the module's [output values][outputs] to root-level outputs, so that Terraform will display them after applying the configuration. For example:

        ```hcl
        output "tfe_cluster" {
          value = {
            application_endpoint = "${module.terraform-enterprise.application_endpoint}"
            application_health_check = "${module.terraform-enterprise.application_health_check}"
            # ...
          }
        }
        ```

        ~> **Important:** The module's outputs include credentials necessary for completing the installation.

## Init, Plan, Apply

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

    tfe_cluster = {
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
