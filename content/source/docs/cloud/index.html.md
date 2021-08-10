---
layout: "cloud"
page_title: "Home - Terraform Cloud and Terraform Enterprise"
description: |-
  Terraform Cloud is an application that helps teams use Terraform to provision infrastructure.
---

# Terraform Cloud and Terraform Enterprise

This is the documentation for Terraform Cloud and Terraform Enterprise.

Terraform Cloud and Terraform Enterprise are different distributions of the same application; this documentation applies to both of them except when specifically stated otherwise.

For expediency, this documentation refers to the application as Terraform Cloud.

## About Terraform Cloud and Terraform Enterprise

[Terraform Cloud](https://terraform.io/cloud) is an application that helps teams use Terraform together. It manages Terraform runs in a consistent and reliable environment, and includes easy access to shared state and secret data, access controls for approving changes to infrastructure, a private registry for sharing Terraform modules, detailed policy controls for governing the contents of Terraform configurations, and more.

Terraform Cloud is available as a hosted service at [https://app.terraform.io](https://app.terraform.io). Small teams can sign up for free to connect Terraform to version control, share variables, run Terraform in a stable remote environment, and securely store remote state. Paid tiers allow you to add more than five users, create teams with different levels of permissions, enforce policies before creating infrastructure, and collaborate more effectively. 

The [Business tier](https://www.hashicorp.com/products/terraform/editions/cloud) allows large organizations to scale to multiple concurrent runs, create infrastructure in private environments, manage user access with SSO, and automates self-service provisioning for infrastructure end users. 

Enterprises with advanced security and compliance needs can purchase [Terraform Enterprise](/docs/enterprise/index.html), our self-hosted distribution of Terraform Cloud. It offers enterprises a private instance that includes the advanced features available in Terraform Cloud.

### Note About Product Names

Before mid-2019, all distributions of Terraform Cloud used to be called Terraform Enterprise; the self-hosted distribution was called Private Terraform Enterprise (PTFE). These previous names sometimes still appear in supporting tools (like [the `tfe` Terraform provider](https://registry.terraform.io/providers/hashicorp/tfe/latest), which is also intended for use with Terraform Cloud).

## Who is This Documentation For?

The Terraform Cloud documentation is for everyone who uses the Terraform Cloud application to provision and manage infrastructure. This includes Terraform Enterprise users, since Terraform Enterprise and Terraform Cloud are the same application.

The [Terraform Enterprise deployment and operation documentation](/docs/enterprise/index.html) is for admins and operators who install and maintain their organization's Terraform Enterprise instance.

## Where Should I Go First?

- If you want to learn by doing, begin with [the Terraform Cloud Getting Started collection](https://learn.hashicorp.com/collections/terraform/cloud-get-started?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) on learn.hashicorp.com.
- If you want a high-level overview of nearly everything Terraform Cloud does, begin with [the overview of features](./overview.html).
