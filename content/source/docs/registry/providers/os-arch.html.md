---
layout: "registry"
page_title: "Recommended Provider Binary Operating Systems and Architectures - Terraform Registry"
sidebar_current: "docs-registry-provider-os-arch"
description: |-
  Recommended Provider Binary Operating Systems and Architectures
---

# Recommended Provider Binary Operating Systems and Architectures

We recommend the following operating system / architecture combinations for compiled binaries available in the registry (this list is already satisfied by our [recommended **.goreleaser.yml** configuration file](https://github.com/hashicorp/terraform-provider-scaffolding/blob/main/.goreleaser.yml)):

* Darwin / AMD64
* Linux / AMD64 (this is **required** for usage in Terraform Cloud, see below)
* Linux / ARMv8 (sometimes referred to as AArch64 or ARM64)
* Linux / ARMv6
* Windows / AMD64

We also recommend shipping binaries for the following combinations, but we typically do not prioritize fixes for these:

* Linux / 386
* Windows / 386
* FreeBSD / 386
* FreeBSD / AMD64

-> **Note:** Darwin / ARMv8 support (the new M1 chip), once GA in Go 1.16, will be added to our recommended combinations.

## Terraform Cloud Compatibility

To ensure your provider can run in Terraform Cloud, please include a Linux / AMD64 binary. This binary should also not have CGO enabled and should not depend on command line execution of any external tools or binaries. We cannot guarantee availibility of any package/library/binary within the Terraform Cloud images.
