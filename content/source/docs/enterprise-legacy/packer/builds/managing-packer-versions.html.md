---
layout: "enterprise"
page_title: "Managing Packer Versions - Packer Builds - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-packerbuilds-versions"
description: |-
  Terraform Enterprise does not automatically upgrade the version of Packer used to run builds or compiles.
---

# Managing Packer Versions

-> **Deprecation warning**:  The Packer and Artifact Registry features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Friday, March 30, 2018. Please see our [guide on building immutable infrastructure with Packer on CI/CD](https://www.packer.io/guides/packer-on-cicd/) for ideas on implementing these features yourself.

Terraform Enterprise does not automatically upgrade the version of Packer used
to run builds or compiles. This is intentional, as occasionally there can be
backwards incompatible changes made to Packer that cause templates to stop
building properly, or new versions that produce some other unexpected behavior.

All upgrades must be performed by a user, but Terraform Enterprise will display
a notice above any builds run with out of date versions. We encourage the use of
the latest version when possible.

### Upgrading Packer

1. Go the Settings tab of a build configuration or application

2. Go to the "Packer Version" section and select the version you wish to use

3. Review the changelog for that version and previous versions

4. Click the save button. At this point, future builds will use that version
