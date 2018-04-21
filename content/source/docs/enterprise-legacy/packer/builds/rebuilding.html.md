---
layout: "enterprise"
page_title: "Rebuilding - Packer Builds - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-packerbuilds-rebuilding"
description: |-
  Sometimes builds fail due to temporary or remotely controlled conditions.
---

# Rebuilding Builds

!> **Deprecation warning**: The Packer, Artifact Registry and Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise and our [guide on building immutable infrastructure with Packer on CI/CD](https://www.packer.io/guides/packer-on-cicd/) for ideas on implementing the Packer and Artifact features yourself.

Sometimes builds fail due to temporary or remotely controlled conditions.

In this case, it may make sense to "rebuild" a Packer build. To do so, visit the
build you wish to run again and click the Rebuild button. This will take that
exact version of configuration and run it again.

You can rebuild at any point in history, but this may cause side effects that
are not wanted. For example, if you were to rebuild an old version of a build,
it may create the next version of an artifact that is then released, causing a
rollback of your configuration to occur.
