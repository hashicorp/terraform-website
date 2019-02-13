---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Encryption Password"
sidebar_current: "docs-enterprise2-private-installer-encryption-password"
---

# Private Terraform Enterprise Encryption Password

During the installation of Private Terraform Enterprise (PTFE),
a password is used to encrypt Vault's unseal key and root token at
rest. The encrypted Vault credentials are stored in PostgreSQL,
so they are included in normal backups and can be recovered with the password.

The default password is auto-generated, but we
strongly suggest you create your own.

Be sure to retain the password, because it is necessary for
restoring access to PTFE's data in the event of a reinstall.

## Specifying the Encryption Password

The password can be specified during an unattended
installation with the installer option `enc_password`
within the [application settings JSON file when
using the automated install procedure](https://www.terraform.io/docs/enterprise/private/automating-the-installer.html#available-settings):

```json
{
    "hostname": {
        "value": "terraform.example.com"
    },
    "installation_type": {
        "value": "poc"
    },
    "enc_password": {
        "value": "jzrtY@KE-bQ@mwQdxhYxj$WhhpPpZ8jz"
    }
}
```
