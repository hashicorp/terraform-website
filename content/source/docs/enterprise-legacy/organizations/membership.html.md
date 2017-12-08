---
layout: "enterprise"
page_title: "Membership - Organizations - Terraform Enterprise"
sidebar_current: "docs-enterprise-organizations-membership"
description: |-
  Terraform Enterprise allows collaboration in organizations. However, there are several membership levels within organizations.
---

# Membership

Terraform Enterprise allows collaboration in organizations. However, there are several membership levels within organizations.

### Admin

Admin is the top-most access level within Terraform Enterprise and is reserved for Terraform install admins. Admins can manage users, organizations, and jobs. For example, our support team can clear out stuck plans within Terraform environments or view organization data in order to resolve requests. Admins do not have access to sensitive variables.

### Owner

Owners are the top-most access level within an organization and have complete administrative rights. An owner can manage teams and memberships, and can enforce two factor authentication across the organization.

Every organization has a special **owners** team, made up of every user that has `owner` permissions. The **owners** team has implied access for all of the organization's resources, but also has the ability to manage the organization.

Owners can also restrict access to resources (Terraform Environments, Packer Builds, and Artifacts). To manage access go to the Access settings for the specific resource and enter the team or collaborators name, then specify whether they should have `read`, `write`, or `admin`.

### Member

Members are Terraform Enterprise users with access to your organization. Owners can organize members into teams and restrict their permissions via Access. See the [documentation on access controls](../user-accounts/access.html) for details.
