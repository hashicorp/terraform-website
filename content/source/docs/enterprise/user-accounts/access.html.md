---
layout: "enterprise"
page_title: "Access - Accounts - Terraform Enterprise"
sidebar_current: "docs-enterprise-accounts-access"
description: |-
  Terraform Enterprise allows collaboration on resources, with several levels of access.
---

# Access

Terraform Enterprise allows collaboration on resources, with several access levels available for users.

### Read

Read is the lowest level of access within Terraform Enterprise. Users with read access on a resource can view it, but are unable to modify or delete it.

### Write

Write access allows collaborating users the abilty to view the resource and perform create, update, and edit actions on a resource. Users with write access are not able to destroy resources. For example, users with write access are able to view and edit Terraform environment variables as well as push new configuration.

### Admin

Admin is the top-most user access level within Terraform Enterprise and is reserved for organization owners and select user accounts. Beyond read and write access, admins are given ownership permissions on the resource that allow them to manage collaborations and destroy the resource.
