---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Security"
sidebar_current: "docs-enterprise2-private-data-security"
---

# Private Terraform Enterprise - Security

This section covers the security of Private Terraform Enterprise (PTFE)
installations. This documentation may be
useful to customers evaluating PTFE or operators responsible for installing and
maintaining PTFE.

## Data at Rest

PTFE's primary security measure has to do with how it stores sensitive data at rest. 
Sensitive data is encrypted before storage via an integration with HashiCorp Vault.
In order to protect the sensitive data from direct access, 
the encyrpted data is then stored in either PostgreSQL, a local disk, 
or an external object storage system such as S3.

Private Terraform Enterprise (PTFE) takes the security of the data it manages
seriously. This table lists which parts of the PTFE app can contain sensitive data, what storage is used, and what encryption is used.

| Object                               | Storage       | Encrypted                             |
|:-------------------------------------|:--------------|:--------------------------------------|
| Ingressed VCS Data                   | Blob Storage  | Vault Transit Encryption              |
| Terraform Plan Result                | Blob Storage  | Vault Transit Encryption              |
| Terraform State                      | Blob Storage  | Vault Transit Encryption              |
| Terraform Logs                       | Blob Storage  | Vault Transit Encryption              |
| Terraform/Environment Variables      | PostgreSQL    | Vault Transit Encryption              |
| Organization/Workspace/Team Settings | PostgreSQL    | No                                    |
| Account Password                     | PostgreSQL    | bcrypt                                |
| 2FA Recovery Codes                   | PostgreSQL    | Vault Transit Encryption              |
| SSH Keys                             | PostgreSQL    | Vault Transit Encryption              |
| User/Team/Organization Tokens        | PostgreSQL    | HMAC SHA512                           |
| OAuth Client ID + Secret             | PostgreSQL    | Vault Transit Encryption              |
| OAuth User Tokens                    | PostgreSQL    | Vault Transit Encryption              |
| Twilio Account Configuration         | PostgreSQL    | Vault Transit Encryption              |
| SMTP Configuration                   | PostgreSQL    | Vault Transit Encryption              |
| SAML Configuration                   | PostgreSQL    | Vault Transit Encryption              |
| Vault Unseal Key                     | Host          | No                                    |

## Vault Transit Encryption
The [Vault Transit Secret Engine](https://www.vaultproject.io/docs/secrets/transit/index.html) handles encryption for data in-transit and is used when encrypting data from the application to the applicable [storage layer](https://www.terraform.io/docs/enterprise/private/reliability-availability.html#components).

## Vault Unseal Key

The Vault data, which is stored in PostgreSQL must be unsealed in order to read its encrypted values. 
In the  case of an external Vault, the unseal key(s) are a
concern exclusively of the external Vault cluster and are not in the path of PTFE.
When using the interval Vault, the unseal key is encrypted and stored in a
special table within PostgreSQL. The encryption key for the unseal key
is the *Encryption Password* that is part of the PTFE settings. PTFE stores
the *Encryption Password* on the local disk of the PTFE instance encrypted
with a key instance encryption key.

The consequence of how the unseal key is stored when using the internal Vault
is that a root user on the PTFE instance can extract the plaintext unseal key
and use it to access the encrypted data stored elsewhere. Ergo, from a security
perspective, access to the PTFE instance as root constitutes the ability to access
100% of the data stored by PTFE.

## Instance Security

The following policies should be used to secure the PTFE instance itself:

* Do not run other services on the instance running PTFE to prevent additional
  security exposure
* Use of SSH public key authentication
* SSH password authentication ONLY when coupled with automatic password rotation
  as available by some security protocols
* Shipping of login audit logs off the instance to an external logging system
  for detection and accounting
* Usage of RSA 4096 bit or higher SSL/TLS private keys
* When using external services, use SSL/TLS connections to communicate with
  PostgreSQL
