---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfconfig-module-paths"
description: |-
  Terraform Enterprise Sentinel entry: tfconfig -> module_paths
---

# Value: tfconfig.module_paths

The `module_paths` value provides a full list of module paths.

Each of these modules paths are split into their individual components, with no
root module identifier.

As an example, for a layout like:

```
root/
  main.tf
  modules/
    foo/
      module_foo.tf
    bar/
      module_bar.tf
      modules/
        baz/
          module_baz.tf
```

`module_paths` would be:

```
[
  ["foo"],
  ["bar"],
  ["bar", "baz"],
]
```

## Example
