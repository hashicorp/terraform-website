---
layout: "enterprise"
page_title: "Terraform Enterprise"
---

# Terraform Enterprise

Terraform Enterprise is our self-hosted distribution of Terraform Cloud. It offers enterprises a private instance of the Terraform Cloud application, with no resource limits and with additional enterprise-grade architectural features like audit logging and SAML single sign-on.

[Terraform Cloud](https://www.hashicorp.com/products/terraform/) is an application that helps teams use Terraform together. It manages Terraform runs in a consistent and reliable environment, and includes easy access to shared state and secret data, access controls for approving changes to infrastructure, a private registry for sharing Terraform modules, detailed policy controls for governing the contents of Terraform configurations, and more.

For independent teams and small to medium-sized businesses, Terraform Cloud is also available as a hosted service at [https://app.terraform.io](https://app.terraform.io).

### Note About Product Names

Before mid-2019, all distributions of Terraform Cloud used to be called Terraform Enterprise; the self-hosted distribution was called Private Terraform Enterprise (PTFE). These previous names sometimes still appear in supporting tools (like [the `tfe` Terraform provider](https://registry.terraform.io/providers/hashicorp/tfe/latest), which is also intended for use with Terraform Cloud).

## Who is This Documentation For?

The **Deployment and Operation** section of the Terraform Enterprise documentation is for admins and operators who install and maintain their organization's Terraform Enterprise instance. It is not intended for end users of the Terraform Enterprise application.

The **Application Usage** section of the Terraform Enterprise documentation is intended for application end users. It is the same content as the [Terraform Cloud documentation](/docs/cloud/index.html) because the application is shared between both products. 

For expediency, we usually refer to the application as Terraform Cloud within the application usage documentation.

~> **Please Note**: This deployment and operation documentation is provided for customers who feel confident, after reading the full documentation, that they can successfully deploy Terraform Enterprise on their own. If you are unsure, or have questions, please talk to your Solutions Engineer (pre-sales, POC or trial) or Technical Account Manager (existing customers). If you have read the documentation and are ready to schedule your install, please inform your Sales Engineer (pre-sales, POC or trial) or Technical Account Manager (existing customers) of your install time window so they can make sure they are available if necessary.
