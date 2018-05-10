---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Security"
sidebar_current: "docs-enterprise2-private-data-security"
---

# Private Terraform Enterprise - Security

Private Terraform Enterprise (PTFE) takes the security of the data it manages
seriously. This document will go over a number of specific forms of data and how
they are secured.

## Reference Table

| Object                               | Cached                     | Storage       | Encrypted                             |
|:-------------------------------------|:---------------------------|:--------------|:--------------------------------------|
| Ingressed VCS Data                   | No                         | Object Store  | Vault Datakeys + AES-128              |
| Terraform Plan Result                | No                         | Object Store  | Vault Datakeys + AES-128              |
| Terraform State                      | No                         | Object Store  | Vault Datakeys + AES-128              |
| Terraform Logs                       | Yes                        | Object Store  | Vault Datakeys + AES-128              |
| Terraform/Environment Variables      | Yes (not sensitive fields) | PostgreSQL    | Vault Transit Encryption              |
|                                      |                            |               |                                       |
| Organization/Workspace/Team Settings | Yes                        | PostgreSQL    | No                                    |
| Account Password                     | No                         | PostgreSQL    | bcrypt                                |
| 2FA Recovery Codes                   | No                         | PostgreSQL    | Vault Transit Encryption              |
| SSH Keys                             | No                         | PostgreSQL    | Vault Transit Encryption              |
| User/Team/Organization Tokens        | No                         | PostgreSQL    | HMAC SHA512                           |
| OAuth Client ID + Secret             | No                         | PostgreSQL    | Vault Transit Encryption              |
| OAuth User Tokens                    | No                         | PostgreSQL    | Vault Transit Encryption              |
|                                      |                            |               |                                       |
| Twilio Account Configuration         | No                         | PostgreSQL    | Vault Transit Encryption              |
| SMTP Configuration                   | No                         | PostgreSQL    | Vault Transit Encryption              |
| SAML Configuration                   | No                         | PostgreSQL    | Vault Transit Encryption              |
|                                      |                            |               |                                       |
| Vault Unseal Key                     | No                         | Host          | No                                    |
| PTFE Token to access Vault           | No                         | Redis on Host | Protected by Installer Primary Secret |
| Installer Primary Secret Key         | No                         | Host          | Encrypted by Installer                |

## Terraform States

Terraform states are one of the most sensitive pieces of data in Terraform
Enterprise because it contains information about infrastructure resources
including IP addresses, keys, secrets, machine configuration, and more.

### Creation

Terraform states are created by terraform as part of the `plan` and `apply`
phases.

### Encryption

Terraform sends the new state as opaque data to an internal service that encrypts it
using a Vault transit backend using AES128-bit encryption. This means that
Vault, either running within the cluster or external depending on the
configuration, is now required to decrypt and read any terraform state.

### Storage

The encrypted state is stored on whichever Object Store is configured.

* For Production installation types with external services, that means either S3 or Azure Blob Storage.
* For Production installation types with mounted disk, that means written to a directory on the
  mounted disk.
* For Demo installation type, that means on the local disk.

## Terraform Variables

Terraform variables often contain access credentials for providers and services.

### Encryption

After a variable is submitted via the UI or API, the value is encrypted using a
Vault transit key that is only used for terraform variables.

### Storage

The encrypted variables are stored in PostgreSQL indexed by the key. This means
that any Terraform variable has its key visible in plaintext in the database but
values require the availability of the proper Vault cluster to view.

## Configuration Data

All the following configuration data has the same security approach:

* OAuth Secret Access Keys
* OAuth Tokens
* SSH Keys

### Encryption

Each configuration value is encrypted using a Vault transit key that is only
used for each type of data.

### Storage

The encrypted values are stored in PostgreSQL indexed by the key. This means
that any terraform variable has it's key visible in plaintext in the database
but values require the availability of the proper Vault cluster to view.
