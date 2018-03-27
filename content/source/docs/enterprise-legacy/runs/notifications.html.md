---
layout: "enterprise"
page_title: "Notifications - Runs - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-runs-notifications"
description: |-
  Terraform Enterprise can send notifications to your organization. This post is on how.
---


# Terraform Run Notifications

!> **Deprecation warning**: Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](https://www.terraform.io/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise.

Terraform Enterprise can send run notifications, the following events are
configurable:

- **Needs Confirmation** - The plan phase has succeeded, and there are changes
  that need to be confirmed before applying.

- **Confirmed** - A plan has been confirmed, and it will begin applying shortly.

- **Discarded** - A user has discarded the plan.

- **Applying** - The plan has begun to apply and make changes to your
  infrastructure.

- **Applied** - The plan was applied successfully.

- **Errored** - An error has occurred during the plan or apply phase.

> Emails will include logs for the **Needs Confirmation**, **Applied**, and
> **Errored** events.

You can toggle notifications for each of these events on the "Integrations" tab
of an environment.
