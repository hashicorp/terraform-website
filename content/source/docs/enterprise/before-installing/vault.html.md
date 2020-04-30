---
layout: "enterprise"
page_title: "Externally Managed Vault - Terraform Enterprise"
---

# Externally Managed Vault Requirements for Terraform Enterprise

Terraform Enterprise uses Vault to encrypt sensitive information such as variables and state versions.

By default, Terraform Enterprise automatically configures and manages its own instance of Vault, and we recommend that most organizations use this default behavior. However, organizations with special needs around data encryption and record keeping can configure Terraform Enterprise to use an external Vault cluster rather than the internal Vault instance.

!> **Warning:** This is only recommended if you currently run your own Vault cluster in production.
Choosing this option means you assume full responsibility for how the Vault cluster is managed;
for example, how it is sealed and unsealed, replicated, etc.

~> **Important:** The external Vault option must be selected at initial installation, and cannot be changed later.
Do not attempt to migrate an existing Terraform Enterprise instance between internal and external
Vault options.

## Setup

Use the following as a guide to configure an external Vault instance:

1. Enable AppRole: `vault auth enable approle`.
1. Enable transit: `vault secrets enable transit`.
1. Install the `tfe` policy (See below for policy):
   `vault policy write tfe tfe.hcl`.
1. Create an AppRole instance:
   `vault write auth/approle/role/tfe policies="tfe" token_period=24h`.
1. Retrieve the AppRole `role_id`: `vault read auth/approle/role/tfe/role-id`.
1. Retrieve the AppRole `secret_id`:
   `vault write -f auth/approle/role/tfe/secret-id`.
1. Input the address of the vault cluster, role\_id, and secret\_id during the
   install process.

## role\_id and secret\_id

The `role_id` and `secret_id` values created during configuration will be input during
the Terraform Enterprise installation along with the Vault cluster URL such as
`https://vault.mycompany.com:8200`. If you use SSL to access the Vault cluster,
the certificate must be trusted by Terraform Enterprise. That means the issuer of the certificate
is either globally trusted or you have provided the certificate for the issuer
in the "Certificate Authority bundle" section of the installer configuration.

## Vault Policy

Vault utilizes policies to restrict portions of the data. See [the official
Vault docs](https://www.vaultproject.io/docs/concepts/policies.html) for a
more extensive overview.

The following policy is required for the correct operations of Terraform Enterprise:

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
