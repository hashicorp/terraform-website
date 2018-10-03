---
layout: "enterprise2"
page_title: "Private Terraform Enterprise - Security"
sidebar_current: "docs-enterprise2-private-installer-security"
---

# Private Terraform Enterprise Security

This section covers the security of Private Terraform Enterprise (PTFE)
installations. This documentation may be
useful to Customers evaluating PTFE or Operators responsible for installing and
maintaining PTFE.

## Data at Rest

PTFE's primary security has to do with how it stores sensitive data at rest. All
sensitive data is encrypted before storage via integration with HashiCorp Vault.
The encyrpted data is then stored in either PostgreSQL, a local disk, or in
an external object storage system like S3. This protects the sensitive data
from being accessed directly.

In order to read this encrypted data, the Vault data, which is stored in
PostgreSQL must be unsealed. For an external Vault, the unseal key(s) are a
concern exclusively of that Vault cluster and are not in the path of PTFE.
When using the interval Vault, the unseal key is encrypted and stored in a
special table within PostgreSQL. The encryption key for the unseal key
is the *Encryption Password* that is part of the PTFE settings. PTFE stores
the *Encryption Password* on the local disk of the PTFE instance encrypted
with a key instance encryption key.

The ramifications of how the unseal key is stored when using the internal Vault
is that a root user on the PTFE instance can extract the plaintext unseal key
and use it to access the encrypted data stored elsewhere.

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
