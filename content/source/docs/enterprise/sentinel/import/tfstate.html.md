---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfstate"
description: |-
  The tfstate import provides access to a Terraform state.
---

# Import: tfstate

The tfstate import provides access to the Terraform state.

This is the Terraform state as it exists at plan time. Depending on the state of
a Terraform workspace, the data in this import may be incomplete (such as when a
resource has not been created yet).

Depending on what you are looking for, the [`tfconfig`][import-tfconfig] and
[`tfplan`][import-tfplan] imports can assist with providing a more complete view
of the state and configuration of the workspace as it exists currently, or in
the future as well. `tfplan` also has aliases to both the `tfconfig` and
`tfplan` imports to help simplify policy.

[import-tfconfig]: /docs/enterprise/sentinel/import/tfconfig.html
[import-tfplan]: /docs/enterprise/sentinel/import/tfplan.html

-> To reiterate, this import works with the Terraform state that _currently
exists_ at plan time, not what it will look like _after_ the plan is applied.
This means that resources that have not been created yet (and hence, can have no
state) will not be present in the namespaces in this import. If you are looking
for something state-like but also contains future data, see the
[`applied`][import-tfplan-applied] resource namespace value in the `tfplan`
import.

[import-tfplan-applied]: /docs/enterprise/sentinel/import/tfplan.html#value-applied

## The Namespace

The following is a tree view of the import namespace. For more detail on a
particular part of the namespace, see below.

-> Note that the root-level alias keys shown here (`data`, `outputs`, `path`,
and `resources`) are shortcuts to a [module namespace](#namespace-module) scoped
to the root module. For more details, see the section on [root namespace
aliases](#root-namespace-aliases).

```
tfstate
├── module() (function)
│   └── (module namespace)
│       ├── path ([]string)
│       ├── data
│       │   └── TYPE.NAME.NUMBER
│       │       ├── attr (map of keys)
│       │       ├── depends_on ([]string)
│       │       ├── id (string)
│       │       └── tainted (boolean)
│       ├── outputs
│       │   └── NAME
│       │       ├── sensitive (bool)
│       │       ├── type (string)
│       │       └── value (value)
│       └── resources
│           └── TYPE.NAME.NUMBER
│               ├── attr (map of keys)
│               ├── depends_on ([]string)
│               ├── id (string)
│               └── tainted (boolean)
│
├── module_paths ([][]string)
├── terraform_version (string)
│
├── data (root module alias)
├── outputs (root module alias)
├── path (root module alias)
└── resources (root module alias)
```

## Namespace: Root

The root-level namespace consists of the values and functions documented below.

In addition to this, the root-level `data`, `outputs`, `path`, and `resources`
keys alias to their corresponding namespaces or values within the [module
namespace](#namespace-module).

### Function: `module()`

```
module = func(ADDR)
```

* **Return Type:** A [module namespace](#namespace-module).

The `module()` function in the [root namespace](#namespace-root) returns the
[module namespace](#namespace-module) for a particular module address.

The address must be a list and is the module address, split on the period (`.`),
excluding the root module.

Hence, a module with an address of simply `foo` (or `root.foo`) would be
`["foo"]`, and a module within that (so address `foo.bar`) would be read as
`["foo", "bar"]`.

As an example, given the following module block:

```hcl
module "foo" {
  # ...
}
```

If the module contained the following content:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```


The following policy would evaluate to `true`, if the resource was present in
the state:

```python
import "tfstate"

main = rule { tfstate.module(["foo"]).resources.null_resource.foo[0].attr.triggers.foo is "bar" }
```

### Value: `module_paths`

* **Value Type:** List of a list of strings.

The `module_paths` value within the [root namespace](#namespace-root) is a list
of all of the modules within the Terraform state at plan-time.

Note the distinction here - this means if a module is not present in state, it
will not be present in `module_paths`.

This data is represented as a list of a list of strings, with the inner list
being the module address, split on the period (`.`).

The root module is included in this list, represented as an empty inner list, as
long as it is present in state.

As an example, if the following module block was present within a Terraform
configuration:

```hcl
module "foo" {
  # ...
}
```

The value of `module_paths` would be:

```
[
	[],
	["foo"],
]
```

And the following policy would evaluate to `true`:

```python
import "tfstate"

main = rule { tfstate.module_paths contains ["foo"] }
```

-> Note the above example only applies if the module is present in the state.

#### Iterating through modules

Iterating through all modules to find particular resources can be useful. This
example shows how to use `module_paths` with the [`module()`
function](#function-module-) to retrieve all resources of a particular type from
all modules (in this case, the [`azurerm_virtual_machine`][ref-tf-azurerm-vm]
resource). Note the use of `else []` in case some modules don't have any
resources; this is necessary to avoid the function returning undefined.

[ref-tf-azurerm-vm]: /docs/providers/azurerm/r/virtual_machine.html

Remember again that this will only locate modules (and hence resources) that are
present in state.

```python
import "tfstate"

get_vms = func() {
	vms = []
	for tfstate.module_paths as path {
		vms += values(tfstate.module(path).resources.azurerm_virtual_machine) else []
	}
	return vms
}
```

### Value: `terraform_version`

* **Value Type:** String.

The `terraform_version` value within the [root namespace](#namespace-root)
represents the version of Terraform in use when the state was saved. This can be
used to enforce a specific version of Terraform in a policy check.

As an example, the following policy would evaluate to `true`, as long as the
state was made with a version of Terraform in the 0.11.x series, excluding any
pre-release versions (example: `-beta1` or `-rc1`):

```python
import "tfstate"

main = rule { tfstate.terraform_version matches "^0\\.11\\.\\d+$" }
```

## Namespace: Module

The **module namespace** can be loaded by calling
[`module()`](#function-module-) for a particular module.

It can be used to load the following child namespaces, in addition to the values
documented below:

* `data` - Loads the [resource namespace](#namespace-resources-data-sources),
  filtered against data sources.
* `outputs` - Loads the [output namespace](#namespace-outputs), which supply the
  outputs present in this module's state.
* `resources` - Loads the [resource
  namespace](#namespace-resources-data-sources), filtered against resources.

### Root Namespace Aliases

The root-level `data`, `outputs`, and `resources` keys both alias to their
corresponding namespaces within the module namespace, loaded for the root
module. They are essentially the equivalent of running `module([]).KEY`.

### Value: `path`

* **Value Type:** List of strings.

The `path` value within the [module namespace](#namespace-module) contains the
path of the module that the namespace represents. This is represented as a list
of stings.

As an example, if the following module block was present within a Terraform
configuration:

```hcl
module "foo" {
  # ...
}
```

The following policy would evaluate to `true`, _only_ if the module was present
in the state:

```python
import "tfstate"

main = rule { tfstate.module(["foo"]).path contains "foo" }
```

## Namespace: Resources/Data Sources

The **resource namespace** is a namespace _type_ that applies to both resources
(accessed by using the `resources` namespace key) and data sources (accessed
using the `data` namespace key).

Accessing an individual resource or data source within each individual namespace
can be accomplished by specifying the type, name, and resource number (as if the
resource or data source had a `count` value in it) in the syntax
`[resources|data].TYPE.NAME[NUMBER]`. Note that NUMBER is always needed, even if
you did not use `count` in the resource.

In addition, each of these namespace levels is a map, allowing you to filter
based on type and name. 

-> The (somewhat strange) notation here of `TYPE.NAME[NUMBER]` may imply that
the inner resource index map is actually a list, but it's not - using the square
bracket notation over the dotted notation (as instead of `TYPE.NAME.NUMBER`) is
actually required here as an identifier cannot start with number.

Some examples of multi-level access are below:

* To fetch all `aws_instance.foo` resource instances within the root module, you
  can specify `tfstate.resources.aws_instance.foo`. This would then be indexed
  off of the resource count index (`0`, `1`, `2`, and so on). Note that as
  mentioned above, these elements must be accessed using square-bracket map
  notation (so `["0"]`, `["1"]`, `["2"]`, and so on) instead of dotted notation.
* To fetch all `aws_instance` resources within the root module, you can specify
  `tfstate.resources.aws_instance`. This would be indexed off of the names of
  each resource (`foo`, `bar`, and so on), with each of those maps containing
  instances indexed on count index as per above.
* To fetch all resources indiscriminately within the root module,
  `tfstate.resources` will do. This is then indexed by resource type
  (`aws_instance`, for example), with the other maps cascading down from there.

Further explanation of the namespace will be in the context of resources. As
mentioned, when operating on data sources, use the same syntax, except with
`data` in place of `resources`.

### Value: `attr`

* **Value Type:** A string-keyed map of values.

The `applied` value within the [resource
namespace](#namespace-resources-data-sources) is a direct mapping to the state
of the resource. 

The map is a complex representation of these values with data going as far down
as needed to represent any state values such as maps, lists, and sets.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`, if the resource was in the state:

```python
import "tfstate"

main = rule { tfstate.resources.null_resource.foo[0].attr.triggers.foo is "bar" }
```

### Value: `depends_on`

* **Value Type:** A list of strings.

The `depends_on` value within the [resource
namespace](#namespace-resources-data-sources) contains the dependencies for the
resource.

This is a list of strings which will contain the resource address relative to
the module.

As an example, given the following resources:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}

resource "null_resource" "bar" {
  # ...

  depends_on = [
    "null_resource.foo",
  ]
}
```

The following policy would evaluate to `true`, if the resource was in the state:

```python
import "tfstate"

main = rule { tfstate.resources.null_resource.bar[0].depends_on contains "null_resource.foo" }
```

### Value: `id`

* **Value Type:** String.

The `id` value within the [resource
namespace](#namespace-resources-data-sources) contains id of the resource.

As an example, given the following data source:

-> Note that we use a _data source_ here because the
[`null_data_soruce`][ref-tf-null-data-source] data source gives a static ID,
which makes documenting the example easier. As previously mentioned, data
sources share the same namespace as resources, but need to be loaded with the
`data` key. For more information, see the
[synopsis](#namespace-resources-data-sources) for the namespace itself.

[ref-tf-null-data-source]: /docs/providers/null/d/data_source.html

```hcl
data "null_data_source" "foo" {
  # ...
}
```

The following policy would evaluate to `true`:

```python
import "tfstate"

main = rule { tfstate.data.null_data_source.foo[0].id is "static" }
```

### Value: `tainted`

* **Value Type:** Boolean.

The `tainted` value within the [resource
namespace](#namespace-resources-data-sources) is `true` if the resource is
marked as tainted in Terraform state.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`, if the resource was marked as
tainted in the state:

```python
import "tfstate"

main = rule { tfstate.resources.null_resource.foo[0].tainted }
```

## Namespace: Outputs

The **output namespace** represents all of the outputs present within a
[module](#namespace-module). This would be any outputs that would have been
saved to state either as the result of a previous apply, or from the pre-plan
refresh if their values were known at plan-time.

Note that this can be used to fetch both the outputs of the root module, and the
outputs of any module in the state below the root, allowing one to see outputs
that have not been threaded to the root module

This namespace is indexed by output name.

### Value: `sensitive`

* **Value Type:** Boolean.

The `sensitive` value within the [output namespace](#namespace-outputs) is
`true` when the output has been marked as sensitive.

As an example, given the following output:

```hcl
output "foo" {
  sensitive = true
  value     = "bar"
}
```

The following policy would evaluate to `true`:

```python
import "tfstate"

main = rule { tfstate.outputs.foo.sensitive }
```

### Value: `type`

* **Value Type:** String.

The `type` value within the [output namespace](#namespace-outputs) gives the
output's type. This will be one of either `string`, `list`, or `map`, which are
currently the only types available for outputs in Terraform.

As an example, given the following output:

```hcl
output "string" {
  value = "foo"
}

output "list" {
  value = [
    "foo",
    "bar",
  ]
}

output "map" {
  value = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`:

```python
import "tfstate"

type_string = rule { tfstate.outputs.string.type is "string" }
type_list = rule { tfstate.outputs.list.type is "list" }
type_map = rule { tfstate.outputs.map.type is "map" }

main = rule { type_string and type_list and type_map }
```

### Value: `value`

* **Value Type:** String, list, or map.

The `value` value within the [output namespace](#namespace-outputs) is the value
of the output in question.

Note that the only valid primitive output type in Terraform is currently a
string, which means that any int, float, or boolean value will need to be
converted before it can be used in comparison. This does not apply to primitives
within maps and lists, which will be their original types.

As an example, given the following output blocks:

```hcl
output "foo" {
  value = "bar"
}

output "number" {
  value = "42"
}

output "map" {
  value = {
    foo    = "bar"
    number = 42
  }
}
```

The following policy would evaluate to `true`:

```python
import "tfstate"

value_foo = rule { tfstate.outputs.foo.value is "bar" }
value_number = rule { int(tfstate.outputs.number.value) is 42 }
value_map_string = rule { tfstate.outputs.map.value["foo"] is "bar" }
value_map_int = rule { tfstate.outputs.map.value["number"] is 42 }

main = rule { value_foo and value_number and value_map_string and value_map_int }
```
