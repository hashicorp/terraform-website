---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfconfig-module-function"
description: |-
  Terraform Enterprise Sentinel entry: tfconfig -> module()
---

# Function: tfconfig.module()

The `module` function returns a [module namespace](module/index.html) anchored
at the supplied module. This can be used to simplify a value lookup, or iterate
through module configuration when used with [`module_paths`](module_paths.html).

## Example
