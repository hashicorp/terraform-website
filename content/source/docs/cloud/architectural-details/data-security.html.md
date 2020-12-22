---
layout: "cloud"
page_title: "Data Security - Architectural Details - Terraform Cloud and Terraform Enterprise"
---

# Data Security

Terraform Cloud takes the security of the data it manages
seriously. This table lists which parts of the Terraform Cloud and Terraform Enterprise app can contain sensitive data, what storage is used, and what encryption is used.


### Terraform Cloud and Enterprise

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

### Terraform Enterprise Specific

| Object                               | Storage       | Encrypted                             |
|:-------------------------------------|:--------------|:--------------------------------------|
| Twilio Account Configuration         | PostgreSQL    | Vault Transit Encryption              |
| SMTP Configuration                   | PostgreSQL    | Vault Transit Encryption              |
| SAML Configuration                   | PostgreSQL    | Vault Transit Encryption              |
| Vault Unseal Key                     | PostgreSQL    | ChaCha20+Poly1305                     |

## Vault Transit Encryption

The [Vault Transit Secret Engine](https://www.vaultproject.io/docs/secrets/transit/index.html) handles encryption for data in-transit and is used when encrypting data from the application to persistent storage.
