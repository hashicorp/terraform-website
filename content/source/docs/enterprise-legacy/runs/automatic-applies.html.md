---
layout: "enterprise"
page_title: "Automatic Applies - Runs - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-runs-applies"
description: |-
  How to automatically apply plans.
---

# Automatic Terraform Applies

!> **Deprecation warning**: Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](https://www.terraform.io/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise.

You can automatically apply successful Terraform plans to your
infrastructure. This option is disabled by default and can be enabled by an
organization owner on a per-environment basis.

-> This is an advanced feature that enables changes to active infrastructure
without user confirmation. Please understand the implications to your
infrastructure before enabling.

## Enabling Auto-Apply

To enable auto-apply for an environment, visit the environment settings page
check the box labeled "auto apply" and click the save button to persist the
changes. The next successful Terraform plan for the environment will
automatically apply without user confirmation.
