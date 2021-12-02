---
layout: "cloud"
page_title: "Migrating to Terraform Cloud - Terraform Cloud and Terraform Enterprise"
description: |-
  Migrate state to Terraform Cloud to continue managing existing infrastructure without de-provisioning.
---

# Migrating to Terraform Cloud

If you already use Terraform to manage infrastructure, you're probably managing some resources that you want to transfer to Terraform Cloud. By migrating your Terraform [state](/docs/language/state/index.html) to Terraform Cloud, you can continue managing that infrastructure without de-provisioning anything.

-> **API:** See the [State Versions API](../api/state-versions.html). Be sure to stop Terraform runs before migrating state to Terraform Cloud, and only import state into Terraform Cloud workspaces that have never performed a run.

## CLI Workflow

> **Hands-on:** Try the [Migrate State to Terraform Cloud](https://learn.hashicorp.com/tutorials/terraform/cloud-migrate?in=terraform/state&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

## VCS Workflow