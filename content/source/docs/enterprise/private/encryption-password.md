---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Encryption Password"
sidebar_current: "docs-enterprise2-private-encryption-password"
---

# Private Terraform Enterprise Encryption Password

During the installation of Private Terraform Enterprise,
a password is used to encrypt sensitive information at
rest. The default value is auto-generated, but we
strongly suggest you create your own password.

Be sure to retain the value, because you will need
to use this password to restore access to the data
in the event of a reinstall.

The Encryption Password is used to protect the vault unseal
key and root token when the internal Vault is used.
It allows us to store those details in PostgreSQL,
which means that Vault is only dependent on the
encryption password itself and details in PostgreSQL.

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
