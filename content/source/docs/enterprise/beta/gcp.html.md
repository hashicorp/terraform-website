---
layout: "enterprise"
page_title: "Deploying on GCP - Clustering Beta - Terraform Enterprise"
---

# Clustering Beta: Deploying on Google Cloud Platform (GCP)

[mode]: ../before-installing/index.html#operational-mode-decision
[tf11]: https://releases.hashicorp.com/terraform/0.11.14/

~> **Please Note**: This software is a beta release. Some features may not yet be implemented, or may not work correctly. We are very interested in your feedback! Please contact your Technical Account Manager if you run into issues.

## Deployment Options

On GCP, the clustering beta currently supports the following deployment options:

- **Installation mode:** Online. (Airgapped installation has not yet been tested.)
- [**Operational mode:**][mode] Demo (temporary storage) or external services (use an existing Postgres database and Azure blob storage).

Deployment options will be expanded in future releases.

## Architecture

The clustering beta can deploy a variety of architectures, from a single server to a large cluster. Cluster size is controlled by the Terraform module's input variables.

![architecture diagram](https://github.com/hashicorp/terraform-google-terraform-enterprise/blob/v0.0.1-beta/assets/gcp_diagram.jpg?raw=true)

A Terraform Enterprise cluster consists of two types of servers: primaries and secondaries (also called workers). The primary instances run additional, stateful services that the secondaries do not.

Primaries should be deployed in odd numbers to ensure cluster quorum. Additional primary instances can be safely added while the cluster is running, but destroying a primary instance can cause application instability or outages. We do not recommend resizing the cluster by removing primaries after deployment.

To scale the cluster for higher or lower workloads, add or remove secondary instances.

## Before Installing

Before deploying Terraform Enterprise, you must prepare your credentials, a system to run Terraform from, and some required infrastructure.

### Credentials

Gather the following credentials:

* A license file for the beta. Please talk to your Technical Account Manager or Sales Rep.
* A certificate for the load balancer (or a Google API link to a managed SSL cert).

### Terraform

The clustering beta relies on Terraform code that was written to support Terraform 0.11.x. You can run this configuration from a workspace in an existing Terraform Enterprise instance, or from an arbitrary workstation or server.

Decide where you'll be running Terraform, and ensure:

- [The latest Terraform 0.11 release][tf11] is installed and available in the PATH.
- The system running Terraform has access to the target subnet.
- The system running Terraform can authenticate to GCP. For more details, see [Google Provider Configuration Reference: Credentials](/docs/providers/google/provider_reference.html#credentials-1).
- You're familiar enough with Terraform to write simple configurations that call [modules ](/docs/configuration-0-11/modules.html) and specify [output values](/docs/configuration-0-11/outputs.html).

### Infrastructure

Make sure the following GCP infrastructure is available:

* Access to an existing GCP project via a JSON authentication file.
* An IP address for the frontend load balancer, along with a valid DNS entry for that IP.
* A VPC to install into, with a subnet specifically dedicated to the Terraform Enterprise clustering beta.
* A firewall to allow for application traffic. This must permit TCP access over the following ports:

    | Port | Description |
    |------|-------------|
    | 22 | SSH access  |
    | 443 | Application Access |
    | 6443 | Cluster access |
    | 8800 | Installer Dashboard Access |
    | 23010 | Application Health Check |

    -> **Note:** This access list will be reduced for the GA release; it includes some additional ports for troubleshooting access during the beta.
* A firewall for the load balancer health checks. Currently, this must permit the following source IP ranges:

    ```
    "35.191.0.0/16", "209.85.152.0/22", "209.85.204.0/22", "130.211.0.0/22"
    ```

    -> **Note:** These are GCP ranges, and might change in the future. More information can be found at Google's [Load Balancing: Creating Health Checks](https://cloud.google.com/load-balancing/docs/health-checks) documentation.
* A DNS zone.

    -> **Note:** The current module assumes the presence of a DNS zone on GCP, and will create DNS entries for the primary cluster nodes. If you do not use GCP's DNS services and wish to skip this, you will need to clone the module from GitHub, comment out the relevant resources and variable references, and call the modified copy of the module instead of referencing it from the Terraform Registry. Objects to comment out include the `google_dns_record_set` resource and `google_dns_managed_zone` data source in the `primary.tf` file, and references to the DNS zone in the variables.tf and outputs.tf files.

If you choose to install in Production mode you will also need:

* A Google Cloud SQL PostgreSQL instance - please see [PostgreSQL Requirements](../before-installing/postgres-requirements.html).
* A Google Cloud Storage bucket created specifically for the Terraform Enterprise clustering beta. The GCS bucket does not need to be in the same project as the Terraform Enterprise server(s), but you will need a JSON authentication file to access the bucket.

#### Automated Preparation

[bootstrap]: https://github.com/hashicorp/private-terraform-enterprise/tree/master/examples/bootstrap-gcp

If you have an empty test project, you can create the required infrastructure resources with an [example bootstrap Terraform module][bootstrap]. This module only requires the following:

* Access to the project via a JSON authentication file.
* A DNS zone.

The module will create the VPC, the subnet, and the required firewalls. It will also get a public IP, create a DNS entry for it, and create a managed SSL certificate for the domain and an SSL policy for the certificate.

- [Clustering Beta for GCP: Bootstrap Example][bootstrap]

## Installation

[module]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/google
[inputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/google?tab=inputs
[outputs]: https://registry.terraform.io/modules/hashicorp/terraform-enterprise/google?tab=outputs

1. In your web browser, go to the [hashicorp/terraform-enterprise/google module][module] on the Terraform Registry. This is the module you'll use to deploy the clustering beta.
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
      application_endpoint = https://tfe.example.com
      application_health_check = https://tfe.example.com/_health_check
      installer_dashboard_password = hideously-stable-baboon
      installer_dashboard_url = https://12.34.56.78:8800
      primary_public_ip = 23.45.67.89
    }
    ```

    At this point, the infrastructure is finished deploying, but the application is not. It can take up to 30 minutes before the website becomes available.

    The installer dashboard should become available first, and is accessible at the URL specified in the `installer_dashboard_url` output. This will be the first primary server; currently, the dashboard is not behind the load balancer. After other primary servers come up, you can access the dashboard on any of them.
7. Open the installer dashboard in your web browser, and log in with the password specified in the `installer_dashboard_password` output. Follow the instructions at [Terraform Enterprise Configuration](../install/config.html) to finish setting up the application.

After the application is fully deployed, you can adjust the cluster's size by changing the module's inputs and re-applying the Terraform configuration.


## Explanation of variables

Please see the [hashicorp/terraform-enterprise/google registry page][inputs] for a complete list of input variables. The following variables have some additional notes:

* `certificate` - The GCP link to the certificate. If you'd like to use a certificate from another source, you can specify the filename in this variable, and then comment out lines 13 and 14 in the file `gcp/modules/lb/forwarding_rule.tf` and uncomment line 15.
* `ssl_policy` - The GCP SSL policy to use. If you are providing a certificate file, comment out this section in the `variables.tf` file and the `gcp/modules/lb/forwarding_rule.tf` file.
* `pg_password` - This is the password for connecting to Postgres, in base64. To base64 encode your password, run `base64 <<< databasepassword` on the command line. Specify that output as the variable's value.
* `airgap_package_url` - Please download the airgap package you'll use and store it in an artifact repository or some other web-accessible location. Do not use the direct download URL from the vendor site - that URL is time-limited!
