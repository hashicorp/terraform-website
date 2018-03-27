---
layout: "enterprise"
page_title: "Authentication Policy - Organizations - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-organizations-policy"
description: |-
  Owners can set organization-wide authentication policy in Terraform Enterprise.
---


# Set an Organization Authentication Policy

!> **Deprecation warning**: Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](https://www.terraform.io/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise.

Because organization membership affords members access to potentially sensitive
resources, owners can set organization-wide authentication policy in Terraform
Enterprise.

## Requiring Two-Factor Authentication

Organization owners can require that all organization team members use
[two-factor authentication](/docs/enterprise-legacy/user-accounts/authentication.html).
Those that lack two-factor authentication will be locked out of the web
interface until they enable it or leave the organization.

Visit your organization's configuration page to enable this feature. All
organization owners must have two-factor authentication enabled to require the
practice organization-wide. Note: locked-out users are still be able to interact
with Terraform Enterprise using their `ATLAS_TOKEN`.

## Disabling Two-Factor Authentication Requirement

Organization owners can disable the two-factor authentication requirement from
their organization's configuration page. Locked-out team members (those who have
not enabled two-factor authentication) will have their memberships reinstated.
