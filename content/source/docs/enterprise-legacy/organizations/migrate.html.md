---
layout: "enterprise"
page_title: "Migrate - Organizations - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-organizations-migrate"
description: |-
  How to migrate existing organization.
---

# Migrate Organization

 !> **Deprecation warning**: Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](https://www.terraform.io/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise.

To migrate an existing user account to an organization:

1. Create or retrieve the username of a new personal account. You'll add this
account as an "owner" for the new organization during the migration process. If
you already have another account, write down your username.

2. Sign in as the account you wish to migrate and visit the [migration page](https://atlas.hashicorp.com/account/migrate).

3. Put the username of the personal account you wish to make an owner of the
organization into the username text field and press "Migrate".

4. You will be logged out and receive a confirmation email with the
personal account you migrated to.

5. Now, sign in with the personal account created during step 1. Visit your [account settings](https://atlas.hashicorp.com/settings/resources).
In the resource list, you should see your migrated organization available to administrate.
