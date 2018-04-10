---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Security"
sidebar_current: "docs-enterprise2-private-security"
---

# Private Terraform Enterprise - Security

Private Terraform Enterprise (PTFE) takes the security of the data it manages quite seriously.
This document will go over a number of specific forms of data and how they are secured.

## Terraform States

This is one of the most precious bits of state because it commonly contains sensitive data
as well as is critical for the operation of PTFE.

### Creation

Terraform state is created by terraform as part of the `apply` phase.

### Encryption

`terraform` sends the new state as opaque data to an internal service that encrypts it
using a Vault transit backend. This means that Vault, either running within the cluster
or external depending on the configuration, is now required to read any terraform state.

### Storage

After encrypting, the encrypted state is then stored on whichever state backend is configured.

* For Production installation types with external services, that means either S3 or Azure.
* For Production installation types with mounted disk, that means written to a directory on the
  mounted disk.
* For Demo installation type, that means on the local disk.

## Terraform Variables

These are another very common location of senitive information, usually containing access
credentials for various services.

### Encryption

After a variable is submitted on the UI or API, the value is encrypted using a Vault transit key that
is only used for terraform variables.

### Storage

The encrypted values are then stored in PostgreSQL indexed by the key. This means that any terraform
variable has it's key visibile in plaintext in the database but values require the availibility of
the proper Vault cluster to view.

## Configuration Data

All the following configuration data has the same security approach:

* OAuth Secret Access Keys
* OAuth Tokens
* SSH Keys

### Encryption

Each configuration value is encrypted using a Vault transit key that is only used for each type of data.

### Storage

The encrypted values are then stored in PostgreSQL indexed by the key. This means that any terraform
variable has it's key visibile in plaintext in the database but values require the availibility of
the proper Vault cluster to view.
