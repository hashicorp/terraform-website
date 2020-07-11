---
layout: "cloud"
page_title: "tfstate - Imports - Sentinel - Terraform Cloud and Terraform Enterprise"
description: |-
  The tfstate import provides access to a Terraform state.
---

# Import: tfstate

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

The `tfstate` import provides access to the Terraform state.

The _state_ is the data that Terraform has recorded about a workspace at a
particular point in its lifecycle, usually after an apply. You can read more
general information about how Terraform uses state [here][ref-tf-state].

[ref-tf-state]: /docs/state/index.html

-> **Note:** Since Terraform Cloud currently only supports policy checks at plan
time, the usefulness of this import is somewhat limited, as it will usually give
you the state _prior_ to the plan the policy check is currently being run for.
Depending on your needs, you may find the
[`applied`](./tfplan.html#value-applied) collection in `tfplan` more useful,
which will give you a _predicted_ state by applying plan data to the data found
here. The one exception to this rule is _data sources_, which will always give
up to date data here, as long as the data source could be evaluated at plan
time.

## Namespace Overview

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
│       │   └── TYPE.NAME[NUMBER]
│       │       ├── attr (map of keys)
│       │       ├── depends_on ([]string)
│       │       ├── id (string)
│       │       └── tainted (boolean)
│       ├── outputs (root module only in TF 0.12 or later)
│       │   └── NAME
│       │       ├── sensitive (bool)
│       │       ├── type (string)
│       │       └── value (value)
│       └── resources
│           └── TYPE.NAME[NUMBER]
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

[`null`][ref-null] is returned if a module address is invalid, or if the module
is not present in the state.

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


The following policy would evaluate to `true` if the resource was present in
the state:

```python
import "tfstate"

main = rule { tfstate.module(["foo"]).resources.null_resource.foo[0].attr.triggers.foo is "bar" }
```

### Value: `module_paths`

* **Value Type:** List of a list of strings.

The `module_paths` value within the [root namespace](#namespace-root) is a list
of all of the modules within the Terraform state at plan-time.

Modules not present in the state will not be present here, even if they are
present in the configuration or the diff.

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

#### Iterating Through Modules

Iterating through all modules to find particular resources can be useful. This
[example][iterate-over-modules] shows how to use `module_paths` with the
[`module()` function](#function-module-) to find all resources of a
particular type from all modules using the `tfplan` import. By changing `tfplan`
in this function to `tfstate`, you could make a similar function find all
resources of a specific type in the current state.

[iterate-over-modules]: ./index.html#iterate-over-modules-and-find-resources

### Value: `terraform_version`

* **Value Type:** String.

The `terraform_version` value within the [root namespace](#namespace-root)
represents the version of Terraform in use when the state was saved. This can be
used to enforce a specific version of Terraform in a policy check.

As an example, the following policy would evaluate to `true` as long as the
state was made with a version of Terraform in the 0.11.x series, excluding any
pre-release versions (example: `-beta1` or `-rc1`):

```python
import "tfstate"

main = rule { tfstate.terraform_version matches "^0\\.11\\.\\d+$" }
```

-> **NOTE:** This value is also available via the [`tfplan`](./tfplan.html)
import, which will be more current when a policy check is run against a plan.
It's recommended you use the value in `tfplan` until Terraform Cloud
supports policy checks in other stages of the workspace lifecycle. See the
[`terraform_version`][import-tfplan-terraform-version] reference within the
`tfplan` import for more details.

[import-tfplan-terraform-version]: ./tfplan.html#value-terraform-version

## Namespace: Module

The **module namespace** can be loaded by calling
[`module()`](#function-module-) for a particular module.

It can be used to load the following child namespaces, in addition to the values
documented below:

* `data` - Loads the [resource namespace](#namespace-resources-data-sources),
  filtered against data sources.
* `outputs` - Loads the [output namespace](#namespace-outputs), which supply the
  outputs present in this module's state. Note that with Terraform 0.12 or
  later, this value is only available for the root namespace.
* `resources` - Loads the [resource
  namespace](#namespace-resources-data-sources), filtered against resources.

### Root Namespace Aliases

The root-level `data`, `outputs`, and `resources` keys both alias to their
corresponding namespaces within the module namespace, loaded for the root
module. They are the equivalent of running `module([]).KEY`.

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
as an identifier cannot start with number.

Some examples of multi-level access are below:

* To fetch all `aws_instance.foo` resource instances within the root module, you
  can specify `tfstate.resources.aws_instance.foo`. This would then be indexed
  by resource count index (`0`, `1`, `2`, and so on). Note that as mentioned
  above, these elements must be accessed using square-bracket map notation (so
  `[0]`, `[1]`, `[2]`, and so on) instead of dotted notation.
* To fetch all `aws_instance` resources within the root module, you can specify
  `tfstate.resources.aws_instance`. This would be indexed from the names of
  each resource (`foo`, `bar`, and so on), with each of those maps containing
  instances indexed by resource count index as per above.
* To fetch all resources within the root module, irrespective of type, use
  `tfstate.resources`. This is indexed by type, as shown above with
  `tfstate.resources.aws_instance`, with names being the next level down, and so
  on.

Further explanation of the namespace will be in the context of resources. As
mentioned, when operating on data sources, use the same syntax, except with
`data` in place of `resources`.

### Value: `attr`

* **Value Type:** A string-keyed map of values.

The `attr` value within the [resource
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

The following policy would evaluate to `true` if the resource was in the state:

```python
import "tfstate"

main = rule { tfstate.resources.null_resource.foo[0].attr.triggers.foo is "bar" }
```

### Value: `depends_on`

* **Value Type:** A list of strings.

The `depends_on` value within the [resource
namespace](#namespace-resources-data-sources) contains the dependencies for the
resource.

This is a list of full resource addresses, relative to the module (example:
`null_resource.foo`).

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

The following policy would evaluate to `true` if the resource was in the state:

```python
import "tfstate"

main = rule { tfstate.resources.null_resource.bar[0].depends_on contains "null_resource.foo" }
```

### Value: `id`

* **Value Type:** String.

The `id` value within the [resource
namespace](#namespace-resources-data-sources) contains the id of the resource.

-> **NOTE:** The example below uses a _data source_ here because the
[`null_data_source`][ref-tf-null-data-source] data source gives a static ID,
which makes documenting the example easier. As previously mentioned, data
sources share the same namespace as resources, but need to be loaded with the
`data` key. For more information, see the
[synopsis](#namespace-resources-data-sources) for the namespace itself.

[ref-tf-null-data-source]: /docs/providers/null/data_source.html

As an example, given the following data source:

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
[module](#namespace-module). Outputs are present in a state if they were saved
during a previous apply, or if they were updated with known values during the
pre-plan refresh.

**With Terraform 0.11 or earlier** this can be used to fetch both the outputs
of the root module, and the outputs of any module in the state below the root.
This makes it possible to see outputs that have not been threaded to the root
module.

**With Terraform 0.12 or later** outputs are available in the top-level (root
module) namespace only and not accessible within submodules.

This namespace is indexed by output name.

### Value: `sensitive`

* **Value Type:** Boolean.

The `sensitive` value within the [output namespace](#namespace-outputs) is
`true` when the output has been [marked as sensitive][ref-tf-sensitive-outputs].

[ref-tf-sensitive-outputs]: /docs/configuration/outputs.html#sensitive-outputs

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
output's type. This will be one of `string`, `list`, or `map`. These are
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
