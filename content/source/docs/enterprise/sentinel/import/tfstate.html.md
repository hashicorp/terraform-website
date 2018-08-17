---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfstate"
description: |-
  The tfstate import provides access to a Terraform state.
---

# Import: tfstate

The tfstate import provides access to the Terraform state.

### tfstate.module_paths

All the module paths represented in the state. This can be used along
with tfstate.module() to iterate through all modules.

### tfstate.terraform_version

The terraform version that made this state.

### tfstate.resources

Resources returns a map of all the resources in the root module.
This is identical to tfstate.module([]).resources.

### tfstate.data

Resources returns a map of all the data sources in the root module.
This is identical to tfstate.module([]).data.

### tfstate.module(path)

The module function finds the module at the given path.

## Type: m

### m.path

This returns the path for this module. This is a usable argument to
tfstate.module() if necessary.

### m.resources

This returns all the resources in the module as a map. The map
key is the type, the value is the same as `m.resources.TYPE`.

### m.resources.TYPE

This returns all the resources in the module with the given type
as a map from name to resource. For the documentation on the
value, see `m.resources.TYPE.NAME`

### m.resources.TYPE.NAME

This returns the list of resources with the given type and name. The
result is a list because the plan is aware that the count may be greater
than zero.

### m.data

This returns all the data sources in the module as a map. The map key is the
type, the value is the same as `m.data.TYPE`.

### m.data.TYPE

This returns all the data sources in the module with the given type as a map
from name to data source. For the documentation on the value, see
`m.data.TYPE.NAME`

### m.data.TYPE.NAME

This returns a list of data sources and behaves exactly how a resource lookup
behaves with the m.resources.TYPE.NAME syntax above. All fields that are
accessible within resources are available within a data source, save `tainted`,
as data sources cannot be tainted.

### m.outputs.NAME

Returns the output specified by NAME. This works in submodules as well.

## Type: o

### o.value

The output value

### o.sensitive

True if the output is marked as sensitive

### o.type

The data type of this output.

## Type: r

### r.id

Returns the ID for this resource.

### r.tainted

This returns true if this resource is currently tainted.

### r.attr.FIELD

The FIELD is a field within the resource to access. FIELD May return
a complex type such as a map or a list depending on the data type in the
state.


