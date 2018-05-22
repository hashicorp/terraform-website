---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Security"
sidebar_current: "docs-enterprise2-private-data-security"
---

# Private Terraform Enterprise - Security

Private Terraform Enterprise (PTFE) takes the security of the data it manages
seriously. This table lists which parts of the PTFE app can contain sensitive data, what storage is used, and what encryption is used.

| Object                               | Cached                     | Storage       | Encrypted                             |
|:-------------------------------------|:---------------------------|:--------------|:--------------------------------------|
| Ingressed VCS Data                   | No                         | Object Store  | Vault Datakeys + AES-128              |
| Terraform Plan Result                | No                         | Object Store  | Vault Datakeys + AES-128              |
| Terraform State                      | No                         | Object Store  | Vault Datakeys + AES-128              |
| Terraform Logs                       | Yes                        | Object Store  | Vault Datakeys + AES-128              |
| Terraform/Environment Variables      | Yes (not sensitive fields) | PostgreSQL    | Vault Transit Encryption              |
| Organization/Workspace/Team Settings | Yes                        | PostgreSQL    | No                                    |
| Account Password                     | No                         | PostgreSQL    | bcrypt                                |
| 2FA Recovery Codes                   | No                         | PostgreSQL    | Vault Transit Encryption              |
| SSH Keys                             | No                         | PostgreSQL    | Vault Transit Encryption              |
| User/Team/Organization Tokens        | No                         | PostgreSQL    | HMAC SHA512                           |
| OAuth Client ID + Secret             | No                         | PostgreSQL    | Vault Transit Encryption              |
| OAuth User Tokens                    | No                         | PostgreSQL    | Vault Transit Encryption              |
| Twilio Account Configuration         | No                         | PostgreSQL    | Vault Transit Encryption              |
| SMTP Configuration                   | No                         | PostgreSQL    | Vault Transit Encryption              |
| SAML Configuration                   | No                         | PostgreSQL    | Vault Transit Encryption              |
| Vault Unseal Key                     | No                         | Host          | No                                    |
| PTFE Token to access Vault           | No                         | Redis on Host | Protected by Installer Primary Secret |
| Installer Primary Secret Key         | No                         | Host          | Encrypted by Installer                |