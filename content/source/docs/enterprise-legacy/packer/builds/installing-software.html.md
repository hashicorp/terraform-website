---
layout: "enterprise"
page_title: "Installing Software - Packer Builds - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-packerbuilds-installing"
description: |-
  Installing software with Packer.
---

# Installing Software

!> **Deprecation warning**: The Packer, Artifact Registry and Terraform Enterprise (Legacy) features of Atlas will no longer be actively developed or maintained and will be fully decommissioned on Thursday, May 31, 2018. Please see our [Upgrading From Terraform Enterprise (Legacy)](/docs/enterprise/upgrade/index.html) guide to migrate to the new Terraform Enterprise and our [guide on building immutable infrastructure with Packer on CI/CD](https://www.packer.io/guides/packer-on-cicd/) for ideas on implementing the Packer and Artifact features yourself.

Please review the [Packer Build Environment](/docs/enterprise-legacy/packer/builds/build-environment.html)
specification for important information on isolation, security, and hardware
limitations before continuing.

In some cases, it may be necessary to install custom software to build your
artifact using Packer. The easiest way to install software on the Packer builder
is via the `shell-local` provisioner. This will execute commands on the host
machine running Packer.

    {
      "provisioners": [
        {
          "type": "shell-local",
          "command": "sudo apt-get install -y customsoftware"
        }
      ]
    }

Please note that nothing is persisted between Packer builds, so you will need
to install custom software on each run.

The Packer builders run the latest version of Ubuntu LTS.
