---
page_title: "Part 3.1: From Manual Changes to Semi-Automation - Terraform Recommended Practices"
layout: "intro"
---

# Part 3.1: How to Move from Manual Changes to Semi-Automation

Building infrastructure manually (with CLI or GUI tools) results in infrastructure that is hard to audit, hard to reproduce, hard to scale, and hard to share knowledge about.

If your current provisioning practices are largely manual, your first goal is to begin using open source Terraform in a small, manageable subset of your infrastructure. Once you’ve gotten some small success using Terraform, you’ll have reached the semi-automated stage of provisioning maturity, and can begin to scale up and expand your Terraform usage.

Allow one individual (or a small group) in your engineering team to get familiar with Terraform by following these steps:

## 1. Install Terraform

[Follow the instructions here to install Terraform OSS](https://learn.hashicorp.com/tutorials/terraform/install-cli?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS).

## 2. Write Some Code

Write your first [Terraform Configuration file](https://learn.hashicorp.com/tutorials/terraform/aws-build?in=terraform/aws-get-started&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS).

## 3. Follow the Getting Started Tutorials

Follow the rest of the [Terraform: Get Started collection](https://learn.hashicorp.com/collections/terraform/aws-get-started?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) on HashiCorp Learn. These tutorials will walk you through [changing](https://learn.hashicorp.com/tutorials/terraform/aws-change?in=terraform/aws-get-started&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) and [destroying](https://learn.hashicorp.com/tutorials/terraform/aws-destroy?in=terraform/aws-get-started&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) resources, and more.

## 4. Implement a Real Infrastructure Project

Choose a small real-life project and implement it with Terraform. Look at your organization’s list of upcoming projects, and designate one to be a Terraform proof-of-concept. Alternately, you can choose some existing infrastructure to re-implement with Terraform.

The key is to choose a project with limited scope and clear boundaries, such as provisioning infrastructure for a new application on AWS. This helps keep your team from getting overwhelmed with features and possibilities. You can also look at some [example AWS projects](https://github.com/terraform-providers/terraform-provider-aws/tree/master/examples) to get a feel for your options. (The [AWS two-tier example](https://github.com/terraform-providers/terraform-provider-aws/tree/master/examples/two-tier) is often a good start.)

Your goal here is to build a small but reliable core of expertise with Terraform, and demonstrate its benefits to others in the organization.

## Next

At this point, you’ve reached a semi-automated stage of provisioning practices — one or more people in the organization can write Terraform code to provision and modify resources, and a small but meaningful subset of your infrastructure is being managed as code. This is a good time to provide a small demo to the rest of team to show how easy it is to write and provision infrastructure with Terraform.

Next, it's time to transition to a more complete infrastructure as code workflow. Continue on to [Part 3.2: How to Move from Semi-Automation to Infrastructure as Code](./part3.2.html).
