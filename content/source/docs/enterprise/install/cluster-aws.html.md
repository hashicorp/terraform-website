---
layout: "enterprise"
page_title: "AWS - Clustered Deployment - Install and Config - Terraform Enterprise"
---

# Deploying a Terraform Enterprise Cluster on AWS

[mode]: ../before-installing/index.html#operational-mode-decision
[tf11]: https://releases.hashicorp.com/terraform/0.11.14/
[module]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/aws
[inputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/aws?tab=inputs
[outputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/aws?tab=outputs
[bootstrap]: https://github.com/hashicorp/private-terraform-enterprise/tree/master/examples/bootstrap-aws

This page outlines the procedure for deploying a Terraform Enterprise cluster on Amazon Web Services (AWS).

## Summary

Deploying Terraform Enterprise involves the following steps:

1. Follow the pre-install checklist.
2. Prepare the machine that will run Terraform.
3. Prepare some required AWS infrastructure.
4. Write a Terraform configuration that calls the deployment module.
5. Apply the configuration to deploy the cluster.

## Terraform Module

The clustered deployment process relies on a Terraform module, which is available here:

- [**Terraform Registry: Terraform Enterprise for AWS**][module]

This page should be used in conjunction with the module's documentation on the Terraform Registry, which includes full documentation for the module's input variables and outputs.

## Pre-Install Checklist

Before you begin, follow the [Pre-Install Checklist](../before-installing/index.html) and ensure you have all of the prerequisites. This checklist includes several important decisions, some supporting infrastructure, and necessary credentials.

In particular, note that Terraform Enterprise's certificate must be available in ACM matching the domain provided or via ARN.

## Prepare a Machine for Terraform

The Terraform module that deploys Terraform Enterprise is written to support Terraform 0.11.x. You can run this configuration from a workspace in an existing Terraform Enterprise instance, or from an arbitrary workstation or server.

Decide where you'll be running Terraform, and ensure:

- [The latest Terraform 0.11 release][tf11] is installed and available in the PATH.
- The system running Terraform has access to the target subnet.
- The system running Terraform can authenticate to AWS. For more details, see [AWS Provider: Authentication](/docs/providers/aws/index.html#authentication).
- You're familiar enough with Terraform to write simple configurations that call [modules ](/docs/configuration-0-11/modules.html) and specify [output values](/docs/configuration-0-11/outputs.html).

## Prepare Infrastructure

Make sure the following foundational AWS infrastructure is available:

- A VPC
- Subnets (both public and private) spread across multiple AZs
- A DNS Zone

### Automated Preparation

You can create the required infrastructure resources with an [example bootstrap Terraform module][bootstrap]. This module has no requirements beyond provider authentication.

## Write the Terraform Configuration

1. In your web browser, go to the [hashicorp/terraform-enterprise/aws module][module] on the Terraform Registry. This is the module you'll use to deploy Terraform Enterprise.
2. Review the module's [input variables][inputs].
3. Create a new Terraform configuration that calls the `hashicorp/terraform-enterprise/aws` module:
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
    Apply complete! Resources: 33 added, 0 changed, 0 destroyed.

    Outputs:

    tfe_cluster = {
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
