---
layout: "extend"
page_title: "Plugin Development - Framework: Publishing to the Registry"
description: |-
  How to publish providers built on the provider development framework to the
  Terraform Registry.
---

# Publishing to the Registry

You can publish providers to the Terraform Registry using the same [process as providers built on SDKv2](/docs/registry/providers/publishing.html), with one extra step.

The Terraform Registry assumes that published providers support
version 5 of the Terraform protocol, but providers built using the framework are built on version 6. You need to add a manifest to your provider's release assets that tells the Terraform Registry about this difference.

## Add a Version Manifest

When you upload your new provider version to GitHub:

1. Next to the zip files containing your binaries for each platform, include a file named `terraform-provider-$NAME_$VERSION_manifest.json` (where `$NAME` is your provider's name, like `random` and `$VERSION` is your provider's version, like `1.2.3`). Add the following contents:

    ```
{
  "version": 1,
  "metadata": {
    "protocol_versions": ["6.0"],
  },
}
    ```

2. Include the SHA-256 checksum of this JSON file in your `SHA256SUMS` file.

The Terraform Registry will detect this file and understand that this version of your provider only supports version 6 of the Terraform protocol. It and will correctly advertise that fact to Terraform, so that Terraform versions that don't support protocol 6 will not download it.
