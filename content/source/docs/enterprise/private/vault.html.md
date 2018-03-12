---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Customer Managed Vault (Installer Beta)"
sidebar_current: "docs-enterprise2-private-vault"
---

# Private Terraform Enterprise Customer Managed Vault

The installer product can be configured to use a customer managed Vault cluster
rather than the internal Vault instance.

This allows customers to have full control over how the Vault cluster is
managed, for example how it is sealed and unsealed, replicated, etc.

When this is configured along side the External Services installation mode,
the product becomes fully stateless, meaning it can be run in a hot-standby
configuration to provide failover.

## Setup

To setup your Vault cluster to be used, follow the following steps:

1. Enable AppRole: `vault auth-enable approle`
1. Enable transit: `vault mount transit`
1. Install the `ptfe` policy (See below for policy):
   `vault policy-write ptfe ptfe.hcl`
1. Create an AppRole instance:
   `vault write auth/approle/role/ptfe policies="ptfe"`.
1. Retrieve the AppRole `role_id`: `vault read auth/approle/role/ptfe/role-id`
1. Retrieve the AppRole `secret_id`:
   `vault write -f auth/approle/role/ptfe/secret-id`

## role\_id and secret\_id

The `role_id` and `secret_id` values created during setup will be input during
the installation of the product, along with the URL to be used to access your
vault cluster, such as `https://vault.mycompany.com:8200`. If you use SSL to
access the vault cluster, be sure that the Certificate Authority used is a
globally trusted one or input in the section of the installer to upload a
custom CA bundle.

## Vault Policy

Vault utilizes policies to restrict portions of the data. See [the official
Vault docs](https://www.vaultproject.io/docs/concepts/policies.html) for a
more extensive overview.

The following policy is required for the correct operations of the product:

```
path "auth/approle/login" {
  capabilities = ["create", "read"]
}

path "sys/renew/*" {
  policy = "write"
}

path "auth/token/renew/*" {
  policy = "write"
}

path "transit/encrypt/atlas_*" {
  capabilities = ["create", "update"]
}

path "transit/decrypt/atlas_*" {
  capabilities = ["update"]
}

path "transit/encrypt/archivist_*" {
  capabilities = ["create", "update"]
}

# For decrypting datakey ciphertexts.
path "transit/decrypt/archivist_*" {
  capabilities = ["update"]
}

# To upsert the transit key used for datakey generation.
path "transit/keys/archivist_*" {
  capabilities = ["create", "update"]
}

# For performing key derivation.
path "transit/datakey/plaintext/archivist_*" {
  capabilities = ["update"]
}

# For health checks to read the mount table.
path "sys/mounts" {
  capabilities = ["read"]
}
```
