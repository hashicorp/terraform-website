---
layout: "cloud"
page_title: "tfplan - Imports - Sentinel - Terraform Cloud and Terraform Enterprise"
description: |-
    The tfplan import provides access to a Terraform plan. A Terraform plan is the file created as a result of `terraform plan` and is the input to `terraform apply`. The plan represents the changes that Terraform needs to make to infrastructure to reach the desired state represented by the configuration.
---

# Import: tfplan

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

The `tfplan` import provides access to a Terraform plan. A Terraform plan is the
file created as a result of `terraform plan` and is the input to `terraform
apply`. The plan represents the changes that Terraform needs to make to
infrastructure to reach the desired state represented by the configuration.

In addition to the diff data available in the plan, there is an
[`applied`](#value-applied) state available that merges the plan with the state
to create the planned state after apply.

Finally, this import also allows you to access the configuration files and the
Terraform state at the time the plan was run. See the section on [accessing a
plan's state and configuration
data](#accessing-a-plan-39-s-state-and-configuration-data) for more information.

## Namespace Overview

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
│               ├── destroy (bool)
│               ├── requires_new (bool)
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

[import-tfconfig]: ./tfconfig.html
[import-tfstate]: ./tfstate.html

-> Note that these aliases are not represented as maps. While they will appear
empty when viewed as maps, the specific import namespace keys will still be
accessible.

-> Note that while current versions of Terraform Cloud source configuration and
state data from the plan for the Terraform run in question, future versions may
source data accessed through the `tfconfig` and `tfstate` imports (as opposed to
`tfplan.config` and `tfplan.state`) from actual config bundles, or state as
stored by Terraform Cloud. When this happens, the distinction here will be useful -
the data in the aliased namespaces will be the config and state data as the
_plan_ sees it, versus the actual "physical" data.

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

[`null`][ref-null] is returned if a module address is invalid, or if the module
is not present in the diff.

[ref-null]: https://docs.hashicorp.com/sentinel/language/spec#null

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
of all of the modules within the Terraform diff for the current plan.

Modules not present in the diff will not be present here, even if they are
present in the configuration or state.

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

#### Iterating Through Modules

Iterating through all modules to find particular resources can be useful. This
[example][iterate-over-modules] shows how to use `module_paths` with the
[`module()` function](#function-module-) to find all resources of a
particular type from all modules that have pending changes using the `tfplan`
import.

[iterate-over-modules]: ./index.html#iterate-over-modules-and-find-resources

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

[import-tfconfig-variables-default]: ./tfconfig.html#value-default
[import-tfconfig-variables]: ./tfconfig.html#namespace-variables

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

Accessing an individual resource or data source within each respective namespace
can be accomplished by specifying the type, name, and resource number (as if the
resource or data source had a `count` value in it) in the syntax
`[resources|data].TYPE.NAME[NUMBER]`. Note that NUMBER is always needed, even if
you did not use `count` in the resource.

In addition, each of these namespace levels is a map, allowing you to filter
based on type and name.

-> The (somewhat strange) notation here of `TYPE.NAME[NUMBER]` may imply that
the inner resource index map is actually a list, but it's not - using the square
bracket notation over the dotted notation (`TYPE.NAME.NUMBER`) is required here
as an identifier cannot start with a number.

Some examples of multi-level access are below:

* To fetch all `aws_instance.foo` resource instances within the root module, you
  can specify `tfplan.resources.aws_instance.foo`. This would then be indexed by
  resource count index (`0`, `1`, `2`, and so on). Note that as mentioned above,
  these elements must be accessed using square-bracket map notation (so `[0]`,
  `[1]`, `[2]`, and so on) instead of dotted notation.
* To fetch all `aws_instance` resources within the root module, you can specify
  `tfplan.resources.aws_instance`. This would be indexed from the names of
  each resource (`foo`, `bar`, and so on), with each of those maps containing
  instances indexed by resource count index as per above.
* To fetch all resources within the root module, irrespective of type, use
  `tfplan.resources`. This is indexed by type, as shown above with
  `tfplan.resources.aws_instance`, with names being the next level down, and so
  on.

~> When [resource targeting](/docs/commands/plan.html#resource-targeting) is in effect, `tfplan.resources` will only include the resources specified as targets for the run. This may lead to unexpected outcomes if a policy expects a resource to be present in the plan. To prohibit targeted runs altogether, ensure [`tfrun.target_addrs`](./tfrun.html#value-target_addrs) is undefined or empty.

Further explanation of the namespace will be in the context of resources. As
mentioned, when operating on data sources, use the same syntax, except with
`data` in place of `resources`.

### Value: `applied`

* **Value Type:** A string-keyed map of values.

The `applied` value within the [resource
namespace](#namespace-resources-data-sources) contains a "predicted"
representation of the resource's state post-apply. It's created by merging the
pending resource's diff on top of the existing data from the resource's state
(if any). The map is a complex representation of these values with data going
as far down as needed to represent any state values such as maps, lists, and
sets.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true` if the resource was in the diff:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.foo[0].applied.triggers.foo is "bar" }
```

-> Note that some values will not be available in the `applied` state because
they cannot be known until the plan is actually applied. In Terraform 0.11 or
earlier, these values are represented by a placeholder (the UUID value
`74D93920-ED26-11E3-AC10-0800200C9A66`) and in Terraform 0.12 or later they
are `undefined`. **In either case**, you should instead use the
[`computed`](#value-computed) key within the [diff
namespace](#namespace-resource-diff) to determine that a computed value will
exist.

-> If a resource is being destroyed, its `applied` value is omitted from the
namespace and trying to fetch it will return undefined.

### Value: `diff`

* **Value Type:** A map of [diff namespaces](#namespace-resource-diff).

The `diff` value within the [resource
namespace](#namespace-resources-data-sources) contains the diff for a particular
resource. Each key within the map links to a [diff
namespace](#namespace-resource-diff) for that particular key.

Note that unlike the [`applied`](#value-applied) value, this map is not complex;
the map is only 1 level deep with each key possibly representing a diff for a
particular complex value within the resource.

See the below section for more details on the diff namespace, in addition to
usage examples.

### Value: `destroy`

* **Value Type:** Boolean.

The `destroy` value within the [resource
namespace](#namespace-resources-data-sources) is `true` if a resource is being
destroyed for _any_ reason, including cases where it's being deleted as part of
a resource re-creation, in which case [`requires_new`](#value-requires_new) will
also be set.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true` when `null_resource.foo` is being
destroyed:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.foo[0].destroy }
```

### Value: `requires_new`

* **Value Type:** Boolean.

The `requires_new` value within the [resource
namespace](#namespace-resources-data-sources) is `true` if the resource is still
present in the configuration, but must be replaced to satisfy its current diff.
Whenever `requires_new` is `true`, [`destroy`](#value-destroy) is also `true`.

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true` if one of the `triggers` in
`null_resource.foo` was being changed:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.foo[0].requires_new }
```

## Namespace: Resource Diff

The **diff namespace** is a namespace that represents the diff for a specific
attribute within a resource. For details on reading a particular attribute,
see the [`diff`](#diff) value in the [resource
namespace](#namespace-resources-data-sources).

### Value: `computed`

* **Value Type:** Boolean.

The `computed` value within the [diff namespace](#namespace-resource-diff) is
`true` if the resource key in question depends on another value that isn't yet
known. Typically, that means the value it depends on belongs to a resource that
either doesn't exist yet, or is changing state in such a way as to affect the
dependent value so that it can't be known until the apply is complete.

-> Keep in mind that when using `computed` with complex structures such as maps,
lists, and sets, it's sometimes necessary to test the count attribute for the
structure, versus a key within it, depending on whether or not the diff has
marked the whole structure as computed. This is demonstrated in the example
below.  Count keys are `%` for maps, and `#` for lists and sets. If you are
having trouble determining the type of specific field within a resource, contact
the support team.

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

The following policy would evaluate to `true`, if the `id` of
`null_resource.foo` was currently not known, such as when the resource is
pending creation, or is being deleted and re-created:

```python
import "tfplan"

main = rule { tfplan.resources.null_resource.bar[0].diff["triggers.%"].computed }
```

### Value: `new`

* **Value Type:** String.

The `new` value within the [diff namespace](#namespace-resource-diff) contains
the new value of a changing attribute, _if_ the value is known at plan time.

-> `new` will be an empty string if the attribute's value is currently unknown.
For more details on detecting unknown values, see [`computed`](#value-computed).

Note that this value is _always_ a string, regardless of the actual type of the
value changing. [Type conversion][ref-sentinel-type-conversion] within policy
may be necessary to achieve the comparison needed.

[ref-sentinel-type-conversion]: https://docs.hashicorp.com/sentinel/language/values#type-conversion

As an example, given the following resource:

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
  }
}
```

The following policy would evaluate to `true`, if the resource was in the diff
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
value changing. [Type conversion][ref-sentinel-type-conversion] within policy
may be necessary to achieve the comparison needed.

If the value did not exist in the previous state, `old` will always be an empty
string.

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
