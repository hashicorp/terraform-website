---
layout: "enterprise"
page_title: "Deploying on AWS - Clustering Beta - Terraform Enterprise"
---

# Clustering Beta: Deploying on AWS

[mode]: ../before-installing/index.html#operational-mode-decision
[tf11]: https://releases.hashicorp.com/terraform/0.11.14/

~> **Please Note**: This software is a beta release. Some features may not yet be implemented, or may not work correctly. We are very interested in your feedback! Please contact your Technical Account Manager if you run into issues.

## Deployment Options

On AWS, the clustering beta currently supports the following deployment options:

- **Installation mode:** Online. (Airgapped installation has not yet been tested.)
- [**Operational mode:**][mode] Demo (temporary storage) or external services (use an existing Postgres database and S3 bucket).

Deployment options will be expanded in future releases.

## Architecture

The clustering beta can deploy a variety of architectures, from a single server to a large cluster. Cluster size is controlled by the Terraform module's input variables.

![architecture diagram](https://github.com/hashicorp/terraform-aws-terraform-enterprise/blob/v0.0.1-beta/assets/aws_diagram.jpg?raw=true)

A Terraform Enterprise cluster consists of two types of servers: primaries and secondaries (also called workers). The primary instances run additional, stateful services that the secondaries do not.

Primaries should be deployed in odd numbers to ensure cluster quorum. Additional primary instances can be safely added while the cluster is running, but destroying a primary instance can cause application instability or outages. We do not recommend resizing the cluster by removing primaries after deployment.

To scale the cluster for higher or lower workloads, add or remove secondary instances.

## Before Installing

Before deploying Terraform Enterprise, you must prepare your credentials, a system to run Terraform from, and some required infrastructure.

### Credentials

Gather the following credentials:

* A license file for the beta. Please talk to your Technical Account Manager or Sales Rep.
* A Certificate available in ACM for the application's hostname (or a wildcard certificate for the domain).

### Terraform

The clustering beta relies on Terraform code that was written to support Terraform 0.11.x. You can run this configuration from a workspace in an existing Terraform Enterprise instance, or from an arbitrary workstation or server.

Decide where you'll be running Terraform, and ensure:

- [The latest Terraform 0.11 release][tf11] is installed and available in the PATH.
- The system running Terraform has access to the target subnet.
- The system running Terraform can authenticate to AWS. For more details, see [AWS Provider: Authentication](/docs/providers/aws/index.html#authentication).
- You're familiar enough with Terraform to write simple configurations that call [modules ](/docs/configuration-0-11/modules.html) and specify [output values](/docs/configuration-0-11/outputs.html).

### Infrastructure

Make sure the following AWS infrastructure is available:

- A VPC
- Subnets (both public and private) spread across multiple AZs
- A DNS Zone

#### Automated Preparation

[bootstrap]: https://github.com/hashicorp/private-terraform-enterprise/tree/master/examples/bootstrap-aws

You can create the required infrastructure resources with an [example bootstrap Terraform module][bootstrap]. This module has no requirements beyond provider authentication.

## Installation

[module]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/aws
[inputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/aws?tab=inputs
[outputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/aws?tab=outputs

1. In your web browser, go to the [hashicorp/terraform-enterprise/aws module][module] on the Terraform Registry. This is the module you'll use to deploy the clustering beta.
2. Review the module's [input variables][inputs].
3. Create a new Terraform configuration that calls the `hashicorp/terraform-enterprise/aws` module:
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
    Apply complete! Resources: 33 added, 0 changed, 0 destroyed.

    Outputs:

    tfe-beta = {
      application_endpoint = https://tfe-hvg9o7lo.example.com
      application_health_check = https://tfe-hvg9o7lo.example.com/_health_check
      iam_role = tfe-hvg9o7lo
      install_id = hvg9o7lo
      installer_dashboard_url = https://tfe-hvg9o7lo.example.com:8800
      installer_dashboard_password = manually-grand-gator
      primary_public_ip = 12.34.56.78
      ssh_config_file = /Users/jsmith/Documents/tfe-beta/.terraform/modules/c8066b63fe35e7cb30635ab501caa438/hashicorp-terraform-aws-terraform-enterprise-4dc067c/work/ssh-config
      ssh_private_key = /Users/jsmith/Documents/tfe-beta/.terraform/modules/a1d4d4cc38b069facc8774038e3ad299/work/tfe-hvg9o7lo.priv
    }
    ```

    At this point, the infrastructure is finished deploying, but the application is not. It can take up to 30 minutes before the website becomes available.

    The installer dashboard should become available first, and is accessible at the URL specified in the `installer_dashboard_url` output. 
7. Open the installer dashboard in your web browser, and log in with the password specified in the `installer_dashboard_password` output. Follow the instructions at [Terraform Enterprise Configuration](../install/config.html) to finish setting up the application.

After the application is fully deployed, you can adjust the cluster's size by changing the module's inputs and re-applying the Terraform configuration.
