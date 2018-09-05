---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfconfig"
description: |-
  The tfconfig import provides access to a Terraform configuration.
---

# Import: tfconfig

The `tfconfig` import provides access to a Terraform configuration.

The Terraform configuration is the set of `*.tf` files that are used
to describe the desired infrastructure state. This import alone doesn't
give you access to the state of the infrastructure. To view the state
of the infrastructure, see the [`tfstate`][import-tfstate] import.

[import-tfstate]: /docs/enterprise/sentinel/import/tfstate.html

Policies using the `tfconfig` import can access all aspects of the
configuration: providers, resources, data sources, modules, and variables. Note
that since this is the configuration and not an invocation of Terraform, you
can't see values for variables, the state, or the diff for a pending plan.

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

The root-level namespace consists of the values and functions documented below.

In addition to this, the root-level `data`, `modules`, `providers`, `resources`,
and `variables` keys all alias to their corresponding namespaces within the
[module namespace](#namespace-module).

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
resource "aws_instance" "foo" {
  ami = "ami-1234567"
}
```


The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { module(["foo"]).resources.aws_instance.foo.config.ami is "ami-1234567" }
```

### Value: `module_paths`

* **Value Type:** List of a list of strings.

The `module_paths` value within the [root namespace](#namespace-root) is a list
of all of the modules within the Terraform configuration. This data is
represented as a list of a list of strings, with the inner list being the module
address, split on the period (`.`).

The root module is included in this list, represented as an empty inner list.

As an example, if the following module block was the only module within a
Terraform configuration:

```hcl
module "foo" {
  # ...
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { module_paths is [[], ["foo"]] }
```

## Namespace: Module

The **module namespace** can be loaded by calling [`module()`](#function-module-)
for a particular module.

It's a namespace that can be used to load the following data:

* `data` - Loads the [resource namespace](#namespace-resources-data-sources),
  filtered against data sources.
* `modules` - Loads the [module configuration
  namespace](#namespace-module-configuration).
* `providers` - Loads the [provider namespace](#namespace-providers).
* `resources` - Loads the [resource
  namespace](#namespace-resources-data-sources), filtered against resources.
* `variables` - Loads the [variable namespace](#namespace-variables).

### Root Namespace Aliases

The root-level `data`, `modules`, `providers`, `resources`, and `variables` keys
all alias to their corresponding namespaces within the module namespace. They
are essentially the equivalent of running `module([]).KEY`.

## Namespace: Resources/Data Sources

The **resource namespace** is a namespace shared between resources and data
sources, and is identical in structure and behavior regardless of which
classification you are loading.

Accessing an individual resource or data source within this namespace can be
accomplished by specifying the type and name, in the syntax
`[resources|data].TYPE.NAME`, depending on whether or not you are loading the
namespace for a resource (accessed in the `resources` name space) or data
sources (accessed in the `data`) namespace.

In addition, each of these namespace levels is a map, so to access all items
_matching_ a certain type, you can use `[resources|data].TYPE`, and to access
all data sources _grouped by_ type, you can use a simple bareword `resources` or
`data` map.

Further explanation of the namespace will be in the context of resources. As
mentioned, when operating on data sources, use the same syntax, except with
`data` in place of `resources`.

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [resource
namespace](##namespace-resources-data-sources) is a map of key-value pairs that
directly map to Terraform config keys and values.

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

This can be better represented by a loop. Given the above example, the following
policy would evaluate to `true`:

```python
import "tfconfig"

all tfconfig.resources.aws_instance.foo.config.tags as tags {
  all tags as _, value {
    value in ["one", "two"]
  }
}
```

### Value: `provisioners`

* **Value Type:** List of [provisioner namespaces](#namespace-provisioners).

The `provisioners` value within the [resource namespace](#namespace-resources)
represents the [provisioners][ref-tf-provisioners] within a specific resource.

Provisioners are listed in the order they were provided in the configuration
file.

The data within a provisioner can be inspected via the returned [provisioner
namespace](#namespace-provisioners).

[ref-tf-provisioners]: /docs/provisioners/index.html

## Namespace: Provisioners

The **provisioner namespace** represents the configuration for a particular
[provisioner][ref-tf-provisioners] within a specific resource or data source.

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [provisioner namespace](#namespace-provisioner)
represents the values of the keys within the provisioner.

As an example, given the following resource block:

```
resource "aws_instance" "foo" {
  # ...

  provisioner "local-exec" {
    command = "echo ${self.private_ip} > file.txt"
  }
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule {
	tfconfig.resources.aws_instance.foo.provisioners[0].config.command is "echo ${self.private_ip} > file.txt"
}
```

### Value: `type`

* **Value Type:** String.

The `type` value within the [provisioner namespace](#namespace-provisioner)
represents the type of the specific provisioner.

As an example, in the following resource block:

```
resource "aws_instance" "foo" {
  # ...

  provisioner "local-exec" {
    command = "echo ${self.private_ip} > file.txt"
  }
}
```

The following policy would evaluate to `true`: 

```
import "tfconfig"

main = rule { tfconfig.resources.aws_instance.foo.provisioners[0].type is "local-exec" }
```

## Namespace: Module Configuration

The **module configuration** namespace displays data on _module configuration_
as it is given within a `module` block within a configuration itself.

Consider the module below:

```hcl
module "foo" {
  source = "./foo"

  bar = "baz"
}
```

As mentioned, this namespace concerns itself with the contents of the
declaration block itself, not the data within the module. This means that data
can be extracted such as the source and config, (example:
`tfconfig.modules.foo.source` and `tfconfig.modules.foo.config.bar`), but not
any information from within the module (such as resources or data sources). For
the latter, the module instance would need to be looked up with the [`module()`
function](#function-module-).

### Value: `source`

* **Value Type:** String.

The `source` value within the [module configuration
namespace](#namespace-module-configuration) represents the module source path as
supplied to the module configuration.

As an example, given the module declaration
[above](#namespace-module-configuration), the following policy would evaluate to
`true`:

```python
import "tfconfig"

main = rule { tfconfig.modules.foo.source is "./foo" }
```

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [module configuration
namespace](#namespace-module-configuration) represents the values of the keys
within the module configuration.

As an example, given the module declaration
[above](#namespace-module-configuration), the following policy would evaluate to
`true`:

```python
import "tfconfig"

main = rule { tfconfig.modules.foo.config.bar is "baz" }
```

## Namespace: Providers

The **provider namespace** represents data on the declared providers within a
namespace.

This namespace is indexed by provider type and _only_ contains data about
providers when actually declared. Hence, if you are using a completely implicit
provider configuration, this namespace will be empty.

### Value: `alias`

* **Value Type:** A map of [provider namespaces](#namespace-providers), indexed
  by alias.

The `alias` value within the [provider namespace](#namespace-providers)
represents all declared [non-default provider
instances][ref-tf-provider-instances] for a specific provider type, indexed by
their specific alias.

[ref-tf-provider-instances]: /docs/configuration/providers.html#multiple-provider-instances

The return type is a provider namespace with the data for the instance in
question loaded. The `alias` key will not be available within this namespace.

As an example, given the following provider declaration block:

```
provider "aws" {
  alias  = "east"
  region = "us-east-1"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.providers.aws.alias.east.config.region is "us-east-1" }
```

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [provider namespace](#namespace-providers)
represents the values of the keys within the provider's configuration, with the
exception of the provider version, which is represented by the [`version`
value](#value-version).

As an example, given the following provider declaration block:

```
provider "aws" {
  region = "us-east-1"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.providers.aws.config.region is "us-east-1" }
```

### Value: `version`

* **Value Type:** String.

The `version` value within the [provider namespace](#namespace-providers)
represents the explicit expected version of the supplied provider. This includes
the pessimistic operator.

As an example, given the following provider declaration block:

```
provider "aws" {
  version = "~> 1.34"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.providers.aws.version is "~> 1.34" }
```

## Namespace: Variables

The **variable namespace** represents _declared_ variable data within a
configuration. As such, static data can be extracted, such as defaults, but not
dynamic data, such as the current value of a variable within a plan (although
this can be extracted within the [`tfplan` import][ref-tfe-sentinel-tfplan]).

[ref-tfe-sentinel-tfplan]: /docs/enterprise/sentinel/import/tfplan.html

This namespace is indexed by variable name.

### Value: `default`

* **Value Type:** Any primitive type, list, map, or `null`.

The `default` value within the [variable namespace](#namespace-variables)
represents the default for the variable as declared in the configuration.

The actual value will be as configured. Primitives will bear the implicit type
of its declaration (string, int, float, or bool), and maps and lists will be
represented as such.

If no default is present, the value will be [`null`][ref-sentinel-null] (not to
be confused with [`undefined`][ref-sentinel-undefined]).

[ref-sentinel-null]: https://docs.hashicorp.com/sentinel/language/spec#null
[ref-sentinel-undefined]: https://docs.hashicorp.com/sentinel/language/undefined

As an example, given the following variable blocks:

```
variable "foo" {
  default = "bar"
}

variable "number" {
  default = 42
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

default_foo = rule { tfconfig.variables.foo.default is "bar" } 
default_number = rule { tfconfig.variables.number.default is 42 } 

main = rule { default_foo and default_number }
```

### Value: `description`

* **Value Type:** String.

The `description` value within the [variable namespace](#namespace-variables)
represents the description of the variable, as provided in configuration.

As an example, given the following variable block:

```
variable "foo" {
  description = "foobar"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.variables.foo.description is "foobar" }
```
