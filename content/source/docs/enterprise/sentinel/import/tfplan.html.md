---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfplan"
description: |-
    The tfplan import provides access to a Terraform plan. A Terraform plan is the file created as a result of `terraform plan` and is the input to `terraform apply`. The plan represents the changes that Terraform needs to make to infrastructure to reach the desired state represented by the configuration.
---

# Import: tfplan

The `tfplan` import provides access to a Terraform plan. A Terraform plan is the
file created as a result of `terraform plan` and is the input to `terraform
apply`. The plan represents the changes that Terraform needs to make to
infrastructure to reach the desired state represented by the configuration.

In addition to the diff data available in the plan, there is an
[`applied`](#value-applied) state available that merges the plan with the state
to create the planned state after apply. Note that any computed values will not
be visible in this state.

Finally, this import also allows you to access the configuration files and the
Terraform state at the time the plan was run. See the section on [accessing a
plan's state and configuration
data](#accessing-a-plan-39-s-state-and-configuration-data) for more information.

## The Namespace

The following is a tree view of the import namespace. For more detail on a
particular part of the namespace, see below.

-> Note that the root-level alias keys shown here (`data`, `path`, and
`resources`) are shortcuts to a [module namespace](#namespace-module) scoped to
the root module. For more details, see the section on [root namespace
aliases](#root-namespace-aliases).

```
tfplan
├── module() (function)
│   └── (module namespace)
│       ├── path ([]string)
│       ├── data
│       │   └── TYPE.NAME[NUMBER]
│       │       ├── applied (map of keys)
│       │       └── diff
│       │           └── KEY
│       │               ├── computed (bool)
│       │               ├── new (string)
│       │               └── old (string)
│       └── resources
│           └── TYPE.NAME[NUMBER]
│               ├── applied (map of keys)
│               └── diff
│                   └── KEY
│                       ├── computed (bool)
│                       ├── new (string)
│                       └── old (string)
├── module_paths ([][]string)
├── terraform_version (string)
├── variables (map of keys)
│
├── data (root module alias)
├── path (root module alias)
├── resources (root module alias)
│
├── config (tfconfig namespace alias)
└── state (tfstate import alias)
```

## Namespace: Root

The root-level namespace consists of the values and functions documented below.

In addition to this, the root-level `data`, `path`, and `resources` keys alias
to their corresponding namespaces or values within the [module
namespace](#namespace-module).

### Accessing a Plan's State and Configuration Data

The `config` and `state` keys alias to the [`tfconfig`][import-tfconfig] and
[`tfstate`][import-tfstate] namespaces, respectively, with the data sourced from
the Terraform _plan_ (as opposed to actual configuration and state).

[import-tfconfig]: /docs/enterprise/sentinel/import/tfconfig.html
[import-tfstate]: /docs/enterprise/sentinel/import/tfstate.html

-> Note that these aliases are not represented as maps. While they will appear
empty when viewed as maps, the specific import namespace keys will still be
accessible.

-> Note that while current versions of Terraform Enterprise (TFE) source _all_
data (including configuration and state) from the plan for the Terraform run in
question, future versions of TFE may source data accessed through the `tfconfig`
and `tfstate` imports (as opposed to `tfplan.config` and `tfplan.state`) from
actual config bundles, or state as stored by TFE. When this happens, the
distinction here will be useful - the data in the aliased namespaces will be the
config and state data as the _plan_ sees it, versus the actual "physical" data.

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


The following policy would evaluate to `true`:

```python
import "tfplan"

main = rule { tfplan.module(["foo"]).resources.null_resource.foo[0].applied.triggers.foo is "bar" }
```

### Value: `module_paths`

* **Value Type:** List of a list of strings.

The `module_paths` value within the [root namespace](#namespace-root) is a list
of all of the modules within the Terraform _diff_ for the current plan.

Note the distinction here - this means if there are no changes for any resources
within the module of concern, the module will not show up in `module_paths`.

This data is represented as a list of a list of strings, with the inner list
being the module address, split on the period (`.`).

The root module is included in this list, represented as an empty inner list, as
long as there are changes.

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
import "tfplan"

main = rule { tfplan.module_paths contains ["foo"] }
```

-> Note the above example only applies if the module is present in the diff.

#### Iterating through modules

Iterating through all modules to find particular resources can be useful. This
example shows how to use `module_paths` with the [`module()`
function](#function-module-) to retrieve all resources of a particular type from
all modules (in this case, the [`azurerm_virtual_machine`][ref-tf-azurerm-vm]
resource). Note the use of `else []` in case some modules don't have any
resources; this is necessary to avoid the function returning undefined.

[ref-tf-azurerm-vm]: /docs/providers/azurerm/r/virtual_machine.html

Remember again that this will only locate modules (and hence resources) that
have pending changes.

```python
import "tfplan"

get_vms = func() {
	vms = []
	for tfplan.module_paths as path {
		vms += values(tfplan.module(path).resources.azurerm_virtual_machine) else []
	}
	return vms
}
```

### Value: `terraform_version`

* **Value Type:** String.

The `terraform_version` value within the [root namespace](#namespace-root)
represents the version of Terraform used to create the plan. This can be used to
enforce a specific version of Terraform in a policy check.

As an example, the following policy would evaluate to `true`, as long as the
plan was made with a version of Terraform in the 0.11.x series, excluding any
pre-release versions (example: `-beta1` or `-rc1`):

```python
import "tfplan"

main = rule { tfplan.terraform_version matches "^0\\.11\\.\\d+$" }
```

### Value: `variables`

* **Value Type:** A string-keyed map of values.

The `variables` value within the [root namespace](#namespace-root) represents
all of the variables that were set when creating the plan. This will only
contain variables set for the root module.

Note that unlike the [`default`][import-tfconfig-variables-default] value in the
[`tfconfig` variables namespace][import-tfconfig-variables], primitive values
here are stringified, and type conversion will need to be performed to perform
comparison for int, float, or boolean values. This only applies to variables
that are primitives themselves and not primitives within maps and lists, which
will be their original types.

[import-tfconfig-variables-default]: /docs/enterprise/sentinel/import/tfconfig.html#value-default
[import-tfconfig-variables]: /docs/enterprise/sentinel/import/tfconfig.html#namespace-variables

If a default was accepted for the particular variable, the default value will be
populated here.

As an example, given the following variable blocks:

```hcl
variable "foo" {
  default = "bar"
}

variable "number" {
  default = 42
}

variable "map" {
  default = {
    foo    = "bar"
    number = 42
  }
}
```

The following policy would evaluate to `true`, if no values were entered to
change these variables:

```python
import "tfplan"

default_foo = rule { tfplan.variables.foo is "bar" }
default_number = rule { tfplan.variables.number is "42" }
default_map_string = rule { tfplan.variables.map["foo"] is "bar" }
default_map_int = rule { tfplan.variables.map["number"] is 42 }

main = rule { default_foo and default_number and default_map_string and default_map_int }
```

## Namespace: Module

The **module namespace** can be loaded by calling
[`module()`](#function-module-) for a particular module.

It can be used to load the following child namespaces, in addition to the values
documented below:

* `data` - Loads the [resource namespace](#namespace-resources-data-sources),
  filtered against data sources.
* `resources` - Loads the [resource
  namespace](#namespace-resources-data-sources), filtered against resources.

### Root Namespace Aliases

The root-level `data` and `resources` keys both alias to their corresponding
namespaces within the module namespace, loaded for the root module. They are the
equivalent of running `module([]).KEY`.

### Value: `path`

* **Value Type:** List of strings.

The `path` value within the [module namespace](#namespace-module) contains the
path of the module that the namespace represents. This is represented as a list
of strings.

As an example, if the following module block was present within a Terraform
configuration:

```hcl
module "foo" {
  # ...
}
```

The following policy would evaluate to `true` _only_ if the diff had changes for
that module:

```python
import "tfplan"

main = rule { tfplan.module(["foo"]).path contains "foo" }
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
bracket notation over the dotted notation (`TYPE.NAME.NUMBER`) is required here
as an identifier cannot start with number.

Some examples of multi-level access are below:

* To fetch all `aws_instance.foo` resource instances within the root module, you
  can specify `tfplan.resources.aws_instance.foo`. This would then be indexed by
  resource count index (`0`, `1`, `2`, and so on). Note that as mentioned above,
  these elements must be accessed using square-bracket map notation (so `[0]`,
  `[1]`, `[2]`, and so on) instead of dotted notation.
* To fetch all `aws_instance` resources within the root module, you can specify
  `tfplan.resources.aws_instance`. This would be indexed off of the names of
  each resource (`foo`, `bar`, and so on), with each of those maps containing
  instances indexed by resource count index as per above.
* To fetch all resources within the root module, irrespective of type, use
  `tfplan.resources`. This is indexed by type, as shown above with
  `tfplan.resources.aws_instance`, with names being the next level down, and so
  on.

Further explanation of the namespace will be in the context of resources. As
mentioned, when operating on data sources, use the same syntax, except with
`data` in place of `resources`.

### Value: `applied`

* **Value Type:** A string-keyed map of values.

The `applied` value within the [resource
namespace](#namespace-resources-data-sources) contains a "predicted"
representation of the resource's state post-apply. It's created using the
existing data from the resource's state (if any), and merging the pending
resource's diff on top of it.

The map is a complex representation of these values with data going as far down
as needed to represent any state values such as maps, lists, and sets.

Note that currently, computed values are represented by the placeholder value
`74D93920-ED26-11E3-AC10-0800200C9A66`. This is not a stable API and should not
be relied on. Instead, use the [`computed`](#value-computed) key within the [diff
namespace](#namespace-resource-diff) to determine if a value is known or not.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`, if the resource was in the diff:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.foo[0].applied.triggers.foo is "bar" }
```

### Value: `diff`

* **Value Type:** A map of [diff namespaces](#namespace-resource-diff).

The `diff` value within the [resource
namespace](#namespace-resources-data-sources) contains the diff for a particular
resource. Each key within the map links to a [diff
namespace](#namespace-resource-diff) for that particular key.

Note that unlike the [`applied`](#value-applied) value, this map is not complex;
the map is only 1 level deep with each key possibly representing a diff for a
particular complex value within the resource.

See the diff namespace for specific examples.

## Namespace: Resource Diff

The **diff namespace** is a namespace that represents the diff for a specific
attribute within a resource. For particulars on reading a particular attribute,
see the [`diff`](#diff) value in the [resource
namespace](#namespace-resources-data-sources).

### Value: `computed`

* **Value Type:** Boolean.

The `computed` value within the [diff namespace](#namespace-resource-diff) is
`true` if a value is currently unknown in the diff, but is changing. This
happens when a value depends on a value belonging to a resource that either does
not exist yet or is changing state in a way that the new value will not be known
until the apply for that resource completes.

-> Keep in mind when using `computed` with complex structures such as maps,
lists, and sets, that it's sometimes necessary to test the count attribute for
the structure, versus a key within it, depending on whether or not the diff has
marked the whole structure as computed. This is demonstrated in the example
below.  Count keys are `%` for maps, and `#` for lists and sets. If you are
having trouble determining the actual type of specific field within a resource,
contact the support team.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}

resource "null_resource" "bar" {
  triggers = {
    foo_id = "${null_resource.foo.id}"
  }
}
```

The following policy would evaluate to `true`, if the resource was in the diff,
the value of the tag was changing, and the `id` of `null_resource.foo` was
currently not known (example: the resource has not been created yet):

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.bar[0].diff["triggers.%"].computed }
```

### Value: `new`

* **Value Type:** String.

The `new` value within the [diff namespace](#namespace-resource-diff) contains
the new value of a changing attribute, _if_ the value is known at plan time.

If the value is currently unknown, this field will be blank. Use the
[`computed`](#value-computed) value to determine if the value contained here is
actually a known zero value or not.

Note that this value is _always_ a string, regardless of the actual type of the
value changing. Type conversion within policy may be necessary to achieve the
comparison needed.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`, if the resource was in the diff,
and each of the concerned keys were changing to new values:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.foo[0].diff["triggers.foo"].new is "bar" }
```

### Value: `old`

* **Value Type:** String.

The `old` value within the [diff namespace](#namespace-resource-diff) contains
the old value of a changing attribute.

Note that this value is _always_ a string, regardless of the actual type of the
value changing. Type conversion within policy may be necessary to achieve the
comparison needed.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "baz"
  }
}
```

If that resource was previously in config as:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.foo[0].diff["triggers.foo"].old is "bar" }
```
