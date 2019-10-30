---
layout: "enterprise"
page_title: "Encryption Password - Install and Config - Terraform Enterprise"
---

# Terraform Enterprise Encryption Password

The modules used to install Terraform Enterprise with Clustering allow you to set
a password that is used to encrypt sensitive information at
rest. The default value is auto-generated, but we
strongly suggest you create your own password and pass it to the module.

Be sure to retain the value, because you will need
to use this password to restore access to the data
in the event of a reinstall.

The Encryption Password is used to protect the vault unseal
key and root token when the internal Vault is used.
It allows us to store those details in PostgreSQL,
which means that Vault is only dependent on the
encryption password itself and details in PostgreSQL.
