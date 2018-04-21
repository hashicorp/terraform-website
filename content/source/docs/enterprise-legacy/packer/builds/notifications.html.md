---
layout: "enterprise"
page_title: "Build Notifications - Packer Builds - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-packerbuilds-notifications"
description: |-
  Terraform Enterprise can send build notifications to your organization.
---

# About Packer Build Notifications

!> **Deprecation warning**: The Packer, Artifact Registry and Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise and our [guide on building immutable infrastructure with Packer on CI/CD](https://www.packer.io/guides/packer-on-cicd/) for ideas on implementing the Packer and Artifact features yourself.

Terraform Enterprise can send build notifications to your organization for the
following events:

- **Starting** - The build has begun.
- **Finished** - All build jobs have finished successfully.
- **Errored** - An error has occurred during one of the build jobs.
- **Canceled** - A user has canceled the build.

> Emails will include logs for the **Finished** and **Errored** events.

You can toggle notifications for each of these events on the "Integrations" tab
of a build configuration.
