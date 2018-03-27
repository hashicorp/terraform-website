---
layout: "enterprise"
page_title: "Packer Artifacts - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-packerartifacts"
description: |-
  Packer creates and uploads artifacts to Terraform Enterprise.
---

# About Packer and Artifacts

!> **Deprecation warning**: The Packer, Artifact Registry and Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise and our [guide on building immutable infrastructure with Packer on CI/CD](https://www.packer.io/guides/packer-on-cicd/) for ideas on implementing these features yourself.

Packer creates and uploads artifacts to Terraform Enterprise. This is done
with the [post-processor](https://packer.io/docs/post-processors/atlas.html).

Artifacts can then be used to deploy services or access via Vagrant. Artifacts
are generic, but can be of varying types. These types define different behavior
within Terraform Enterprise.

For uploading artifacts `artifact_type` can be set to any unique identifier,
however, the following are recommended for consistency.

- `amazon.image`
- `azure.image`
- `digitalocean.image`
- `docker.image`
- `google.image`
- `openstack.image`
- `parallels.image`
- `qemu.image`
- `virtualbox.image`
- `vmware.image`
- `custom.image`
- `application.archive`
- `vagrant.box`

Packer can create artifacts when running in Terraform Enterprise or locally.
This is possible due to the post-processors use of the public artifact API to
store the artifacts.

You can read more about artifacts and their use in the
[Terraform section](/docs/enterprise-legacy/) of the documentation.
