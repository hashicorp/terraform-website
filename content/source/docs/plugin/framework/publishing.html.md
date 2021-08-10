---
layout: "extend"
page_title: "Plugin Development - Framework: Publishing to the Registry"
description: |-
  How to publish providers built on the provider development framework to the
  Terraform Registry.
---

# Publishing to the Registry

Publishing providers built on the provider development framework to the
Terraform Registry works the same as [publishing providers built on
SDKv2](/docs/registry/providers/publishing.html), with a minor difference.
Providers built on the framework are built on version 6 of the Terraform
protocol. The Registry, by default, assumes providers being published support
version 5 of the Terraform protocol, which providers built on the framework do
not. The Registry needs to be told about this difference in protocol version
support. This is done by adding a manifest to the provider's release assets.

## Add a Version Manifest

When uploading your new provider version to GitHub, next to the zip files
containing your binaries for each platform, include a file named
`terraform-provider-$NAME_$VERSION_manifest.json` (where `$NAME` is your
provider's name, like `random` and `$VERSION` is your provider's version, like
`1.2.3`) with the following contents:

```
{
  "version": 1,
  "metadata": {
    "protocol_versions": ["6.0"],
  },
}
```

Include the SHA-256 checksum of this JSON file in your `SHA256SUMS` file.

The registry will detect this file and understand this version of your provider
only supports version 6 of the Terraform protocol, and will correctly advertise
that fact to Terraform, so Terraform versions that don't support protocol 6
will not download it.
