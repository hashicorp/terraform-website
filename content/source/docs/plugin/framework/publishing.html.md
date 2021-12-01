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

Add the following contents to a file (e.g. `terraform-registry-manifest.json`). The version number in the file is the version of the manifest format, not the version of your provider.

```json
{
  "version": 1,
  "metadata": {
    "protocol_versions": ["6.0"],
  },
}
```

When you upload your new provider version to GitHub:

1. Add the manifest file next to the zip files containing your binaries for each platform.
2. Include the SHA-256 checksum of this JSON file in your `SHA256SUMS` file.

The Terraform Registry will detect this file and understand that this version of your provider only supports version 6 of the Terraform protocol. It will correctly advertise that fact to Terraform, so that Terraform versions that don't support protocol 6 will not download it.

[GoReleaser](https://goreleaser.com/) is a release automation tool for Go projects. You can use GoReleaser 1.1.0 and later to automatically checksum and upload your manifest file name to reflect the versioned file name for the release. Add the `extra_files` configuration below to the `checksum` and `release` sections of the `.goreleaser.yml` file. The `glob` pattern must match the manifest file name.

```yaml
checksum:
  # ... other configuration ...
  extra_files:
    - glob: 'terraform-registry-manifest.json'
      name_template: '{{ .ProjectName }}_{{ .Version }}_manifest.json'
release:
  # ... potentially other configuration ...
  extra_files:
    - glob: 'terraform-registry-manifest.json'
      name_template: '{{ .ProjectName }}_{{ .Version }}_manifest.json'
```
