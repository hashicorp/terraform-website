---
layout: "enterprise"
page_title: "Terraform Enterprise"
---

# Terraform Enterprise

This is the documentation for Terraform Enterprise.

## About Terraform Cloud and Terraform Enterprise

Terraform Enterprise is our on-premises distribution of Terraform Cloud. It offers enterprises a private instance of the Terraform Cloud application, with no resource limits and with additional enterprise-grade architectural features like audit logging and SAML single sign-on.

[Terraform Cloud](https://www.hashicorp.com/products/terraform/) is an application that helps teams use Terraform together. It manages Terraform runs in a consistent and reliable environment, and includes easy access to shared state and secret data, access controls for approving changes to infrastructure, a private registry for sharing Terraform modules, detailed policy controls for governing the contents of Terraform configurations, and more.

For independent teams and small to medium-sized businesses, Terraform Cloud is also available as a hosted service at [https://app.terraform.io](https://app.terraform.io).

### Note About Product Names

Before mid-2019, Terraform Enterprise used to be called Private Terraform Enterprise.

We're still updating names throughout their UI, documentation, and supporting tools. While we finish these updates, you might still see occasional references to their old names:

Component               | New name             | Old name
------------------------|----------------------|----------------------
Primary application     | Terraform Cloud      | Terraform Enterprise
On-premises distribution | Terraform Enterprise | Private Terraform Enterprise (PTFE)

## Who is This Documentation For?

The Terraform Enterprise documentation is for admins and operators who install and maintain their organization's Terraform Enterprise instance. It is not intended for normal users of the Terraform Cloud application.

The [Terraform Cloud documentation](/docs/cloud/index.html) is for everyone who uses the Terraform Cloud application to provision and manage infrastructure. This includes Terraform Enterprise users, since the core application of Terraform Enterprise is still Terraform Cloud.

~> **Please Note**: This documentation is provided for customers who feel confident, after reading the full documentation, that they can successfully deploy Terraform Enterprise on their own. If you are unsure, or have questions, please talk to your Solutions Engineer (pre-sales, POC or trial) or Technical Account Manager (existing customers). If you have read the documentation and are ready to schedule your install, please inform your Sales Engineer (pre-sales, POC or trial) or Technical Account Manager (existing customers) of your install time window so they can make sure they are available if necessary.
