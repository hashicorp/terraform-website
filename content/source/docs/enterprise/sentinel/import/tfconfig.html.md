---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfconfig"
description: |-
  The tfconfig import provides access to a Terraform configuration.
---

# Import: tfconfig

The `tfconfig` import provides access to a Terraform configuration.

The Terraform configuration is the set of "tf" files that are used
to describe the desired infrastructure state. This import alone doesn't
give you access to the state of the infrastructure. To view the state
of the infrastructure, see the [`tfstate`][import-tfstate] import.

[import-tfstate]: /docs/enterprise/sentinel/import/tfstate.html

Policies using the `tfconfig` import can access all aspects of the
configuration: providers, resources, data sources, modules, variables, etc. Note
that since this is the configuration and not an invocation of Terraform, you
can't see values for variables, state, etc.

## Example

## The Namespace

The following is a tree view of the import namespace. For more detail on a
particular part of the namespace, see below.

```
tfconfig
├── module() (function)
│   └── (module namespace)
│       ├── data
│       │   └── TYPE.NAME
│       │       ├── config (map of keys)
│       │       └── provisioners
│       │           └── NUMBER
│       │               ├── config (map of keys)
│       │               └── type (string)
│       ├── modules
│       │   └── NAME
│       │       ├── config (map of keys)
│       │       └── source (string)
│       ├── providers
│       │   └── TYPE
│       │       ├── alias
│       │       │   └── ALIAS
│       │       │       ├── config (map of keys)
│       │       │       └── version (string)
│       │       ├── config (map of keys)
│       │       └── version (string)
│       ├── resources
│       │   └── TYPE.NAME
│       │       ├── config (map of keys)
│       │       └── provisioners
│       │           └── NUMBER
│       │               ├── config (map of keys)
│       │               └── type (string)
│       └── variables
│           └── NAME
│               ├── default (value)
│               └── description (string)
├── module_paths ([][]string)
│
├── data (root module alias)
├── modules (root module alias)
├── providers (root module alias)
├── resources (root module alias)
└── variables (root module alias)
```

## Namespace: Root

The root-level consists of the values and functions documented below.

In addition to this, the root-level `data`, `modules`, `providers`, `resources`,
and `variables` keys all alias to their corresponding namespaces within the
[module namespace](namespace-module).

### Function: `module()`

* **Return Type:** Namespace.

The `module()` function returns the [module namespace](namespace-module) for a
particular module address.

ADDR must be a list and is the module address, split on the `.`, excluding the
root module.

Hence, a module with an address of simply `foo` (or `root.foo`) would be
`["foo"]`, and a module within that (so address `foo.bar`) would be read as
`["foo", "bar"]`.

### Value: `module_paths`

* **Value Type:** List of a list of strings.

`module_paths` is a list of all of the modules within the Terraform
configuration. This data is represented as a list of a list of strings, with the
inner list being the module address, split on the `.`.

The root module is included in this list, represented as an empty inner list.

Using the example in [the module function](#function-module-), `module_paths`
would return:

```
[
  [],
  ["foo"],
  ["foo", "bar"],
]
```

## Namespace: Module

The module namespace can be loaded by calling [`module()`](#function-module-)
for a particular module.

It's a namespace that can be used to load the following data:

* `data` - Loads the [data source namespace](#namespace-data-source).
* `modules` - Loads the [module configuration
  namespace](#namespace-module-configuration).
* `providers` - Loads the [provider configuration
  namespace](#namespace-provider-configuration).
* `resources` - Loads the [resource namespace](#namespace-resource).
* `variables` - Loads the [variable namespace](#namespace-variable).

### Root Namespace Aliases

The root-level `data`, `modules`, `providers`, `resources`, and `variables` keys
all alias to their corresponding namespaces within the module namespace. They
are essentially the equivalent of running `module([]).KEY`.

## Namespace: Data Source

The data source namespace represents data sources that have been found within
the Terraform configuration.

Accessing an individual resource within this namespace can be accomplished by
specifying type and name, in the syntax `data.TYPE.NAME`.

In addition, each of these namespace levels is a map, so to access all data
sources _matching a certain type_, you can use `data.TYPE`, and to access all
data sources _grouped by type_, you can use a simple bareword `data`.

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [data source namespace](#namepace-data-source) is
a map of key-value pairs that directly map to Terraform config keys and values.

As a consequence of the mapping of this key to raw Terraform configuration,
complex structures within Terraform configuration are grouped _per-instance_ as
they are represented within the actual configuration itself. This has
implications when defining policy correctly.

As an example, consider the following resource block:

```
resource "aws_instance" "foo" {
  # ...

  tags {
    foo = "one"
  }

  tags {
    bar = "two"
  }
}
```

In this example, one would need to access both
`tfconfig.resources.aws_instance.foo.config.tags[0].foo` and
`tfconfig.resources.aws_instance.foo.config.tags[1].bar` to reach both tags.

This can be better represented by a loop:

```python
all tfconfig.resources.aws_instance.foo.config.tags as tags {
  all tags as _, value {
    value in ["one", "two"]
  }
}
```

### Value: `provisioners`

* **Value Type:** List of namespaces.

The `provisioners` value within a resource or data source namespace represents
the [provisioners][ref-tf-provisioners] within a specific resource or data
source.

Provisioners are listed in the order they were provided in the configuration
file.

The data within a provisioner can be inspected via the returned [provisioner
namespace](#namespace-provisioner).

[ref-tf-provisioners]: /docs/provisioners/index.html

## Namespace: Provisioner

The provisioner namespace represents the configuration for a particular
[provisioner][ref-tf-provisioners] within a specific resource or data source.

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the provisioner namespace represents the values of the
keys within the provisioner.

As an example, in the following resource block:

```
resource "aws_instance" "foo" {
  # ...

  provisioner "local-exec" {
    command = "echo ${self.private_ip} > file.txt"
  }
}
```

One could access the value of `command` via
`tfconfig.resources.aws_instance.foo.provisioners.[0].config.command`.

### Value: `type`

* **Value Type:** String.

The `type` value within the provisioner namespace represents the type of the
specific provisioner.

As an example, in the following resource block:

```
resource "aws_instance" "foo" {
  # ...

  provisioner "local-exec" {
    command = "echo ${self.private_ip} > file.txt"
  }
}
```

The following would evaluate to `true`: 

```
tfconfig.resources.aws_instance.foo.provisioners.[0].type is "local-exec"
```
