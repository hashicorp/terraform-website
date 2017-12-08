---
layout: "enterprise"
page_title: "Migrate - Organizations - Terraform Enterprise"
sidebar_current: "docs-enterprise-organizations-migrate"
description: |-
  How to migrate existing organization.
---

# Migrate Organization

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
