---
layout: "cloud"
page_title: "tfconfig - Imports - Sentinel - Terraform Cloud and Terraform Enterprise"
description: |-
  The tfconfig import provides access to a Terraform configuration.
---

# Import: tfconfig

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

The `tfconfig` import provides access to a Terraform configuration.

The Terraform configuration is the set of `*.tf` files that are used to
describe the desired infrastructure state. Policies using the `tfconfig`
import can access all aspects of the configuration: providers, resources,
data sources, modules, and variables.

Some use cases for `tfconfig` include:

* **Organizational naming conventions**: requiring that configuration elements
  are named in a way that conforms to some organization-wide standard.
* **Required inputs and outputs**: organizations may require a particular set
  of input variable names across all workspaces or may require a particular
  set of outputs for asset management purposes.
* **Enforcing particular modules**: organizations may provide a number of
  "building block" modules and require that each workspace be built only from
  combinations of these modules.
* **Enforcing particular providers or resources**: an organization may wish to
  require or prevent the use of providers and/or resources so that configuration
  authors cannot use alternative approaches to work around policy
  restrictions.

Note with these use cases that this import is concerned with object _names_
in the configuration. Since this is the configuration and not an invocation
of Terraform, you can't see values for variables, the state, or the diff for
a pending plan. If you want to write policy around expressions used
within configuration blocks, you likely want to use the
[`tfplan`](./tfplan.html) import.

## Namespace Overview

The following is a tree view of the import namespace. For more detail on a
particular part of the namespace, see below.

-> **Note:** The root-level alias keys shown here (`data`, `modules`,
`providers`, `resources`, and `variables`) are shortcuts to a [module
namespace](#namespace-module) scoped to the root module. For more details, see
the section on [root namespace aliases](#root-namespace-aliases).

```
tfconfig
├── module() (function)
│   └── (module namespace)
│       ├── data
│       │   └── TYPE.NAME
│       │       ├── config (map of keys)
│       │       ├── references (map of keys) (TF 0.12 and later)
│       │       └── provisioners
│       │           └── NUMBER
│       │               ├── config (map of keys)
│       │               ├── references (map of keys) (TF 0.12 and later)
│       │               └── type (string)
│       ├── modules
│       │   └── NAME
│       │       ├── config (map of keys)
│       │       ├── references (map of keys) (TF 0.12 and later)
│       │       ├── source (string)
│       │       └── version (string)
│       ├──outputs
│       │   └── NAME
│       │       ├── depends_on (list of strings)
│       │       ├── description (string)
│       │       ├── sensitive (boolean)
│       │       ├── references (list of strings) (TF 0.12 and later)
│       │       └── value (value)
│       ├── providers
│       │   └── TYPE
│       │       ├── alias
│       │       │   └── ALIAS
│       │       │       ├── config (map of keys)
│       │       |       ├── references (map of keys) (TF 0.12 and later)
│       │       │       └── version (string)
│       │       ├── config (map of keys)
│       │       ├── references (map of keys) (TF 0.12 and later)
│       │       └── version (string)
│       ├── resources
│       │   └── TYPE.NAME
│       │       ├── config (map of keys)
│       │       ├── references (map of keys) (TF 0.12 and later)
│       │       └── provisioners
│       │           └── NUMBER
│       │               ├── config (map of keys)
│       │               ├── references (map of keys) (TF 0.12 and later)
│       │               └── type (string)
│       └── variables
│           └── NAME
│               ├── default (value)
│               └── description (string)
├── module_paths ([][]string)
│
├── data (root module alias)
├── modules (root module alias)
├── outputs (root module alias)
├── providers (root module alias)
├── resources (root module alias)
└── variables (root module alias)
```

### `references` with Terraform 0.12

**With Terraform 0.11 or earlier**, if a configuration value is defined as an
expression (and not a static value), the value will be accessible in its raw,
non-interpolated string (just as with a constant value).

As an example, consider the following resource block:

```hcl
resource "local_file" "accounts" {
  content  = "some text"
  filename = "${var.subdomain}.${var.domain}/accounts.txt"
}
```

In this example, one might want to ensure `domain` and `subdomain` input
variables are used within `filename` in this configuration. With Terraform 0.11 or
earlier, the following policy would evaluate to `true`:

```python
import "tfconfig"

# filename_value is the raw, non-interpolated string
filename_value = tfconfig.resources.local_file.accounts.config.filename

main = rule {
	filename_value contains "${var.domain}" and
	filename_value contains "${var.subdomain}"
}
```

**With Terraform 0.12 or later**, any non-static
values (such as interpolated strings) are not present within the
configuration value and `references` should be used instead:

```python
import "tfconfig"

# filename_references is a list of string values containing the references used in the expression
filename_references = tfconfig.resources.local_file.accounts.references.filename

main = rule {
  filename_references contains "var.domain" and
  filename_references contains "var.subdomain"
}
```

The `references` value is present in any namespace where non-constant
configuration values can be expressed. This is essentially every namespace
which has a `config` value as well as the `outputs` namespace.

-> **Note:** Remember, this import enforces policy around the literal Terraform
configuration and not the final values as a result of invoking Terraform. If
you want to write policy around the _result_ of expressions used within
configuration blocks (for example, if you wanted to ensure the final value of
`filename` above includes `accounts.txt`), you likely want to use the
[`tfplan`](./tfplan.html) import.

## Namespace: Root

The root-level namespace consists of the values and functions documented below.

In addition to this, the root-level `data`, `modules`, `providers`, `resources`,
and `variables` keys all alias to their corresponding namespaces within the
[module namespace](#namespace-module).

<a id="root-function-module" />

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
is not present in the configuration.

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
import "tfconfig"

main = rule { subject.module(["foo"]).resources.null_resource.foo.config.triggers[0].foo is "bar" }
```

<a id="root-value-module_paths" />

### Value: `module_paths`

* **Value Type:** List of a list of strings.

The `module_paths` value within the [root namespace](#namespace-root) is a list
of all of the modules within the Terraform configuration.

Modules not present in the configuration will not be present here, even if they
are present in the diff or state.

This data is represented as a list of a list of strings, with the inner list
being the module address, split on the period (`.`).

The root module is included in this list, represented as an empty inner list.

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
import "tfconfig"

main = rule { tfconfig.module_paths contains ["foo"] }
```

#### Iterating Through Modules

Iterating through all modules to find particular resources can be useful. This
[example][iterate-over-modules] shows how to use `module_paths` with the
[`module()` function](#function-module-) to find all resources of a
particular type from all modules using the `tfplan` import. By changing `tfplan`
in this function to `tfconfig`, you could make a similar function find all
resources of a specific type in the Terraform configuration.

[iterate-over-modules]: ./index.html#iterate-over-modules-and-find-resources

## Namespace: Module

The **module namespace** can be loaded by calling [`module()`](#root-function-module)
for a particular module.

It can be used to load the following child namespaces:

* `data` - Loads the [resource namespace](#namespace-resources-data-sources),
  filtered against data sources.
* `modules` - Loads the [module configuration
  namespace](#namespace-module-configuration).
* `outputs` - Loads the [output namespace](#namespace-outputs).
* `providers` - Loads the [provider namespace](#namespace-providers).
* `resources` - Loads the [resource
  namespace](#namespace-resources-data-sources), filtered against resources.
* `variables` - Loads the [variable namespace](#namespace-variables).

### Root Namespace Aliases

The root-level `data`, `modules`, `providers`, `resources`, and `variables` keys
all alias to their corresponding namespaces within the module namespace, loaded
for the root module. They are the equivalent of running `module([]).KEY`.

## Namespace: Resources/Data Sources

The **resource namespace** is a namespace _type_ that applies to both resources
(accessed by using the `resources` namespace key) and data sources (accessed
using the `data` namespace key).

Accessing an individual resource or data source within each respective namespace
can be accomplished by specifying the type and name, in the syntax
`[resources|data].TYPE.NAME`.

In addition, each of these namespace levels is a map, allowing you to filter
based on type and name. Some examples of multi-level access are below:

* To fetch all `aws_instance` resources within the root module, you can specify
  `tfconfig.resources.aws_instance`. This would give you a map of resource
  namespaces indexed from the names of each resource (`foo`, `bar`, and so
  on).
* To fetch all resources within the root module, irrespective of type, use
  `tfconfig.resources`. This is indexed by type, as shown above with
  `tfconfig.resources.aws_instance`, with names being the next level down.

As an example, perhaps you wish to deny use of the `local_file` resource
in your configuration. Consider the following resource block:

```hcl
resource "local_file" "foo" {
    content     = "foo!"
    filename = "${path.module}/foo.bar"
}
```

The following policy would fail:

```python
import "tfconfig"

main = rule { tfconfig.resources not contains "local_file" }
```

Further explanation of the namespace will be in the context of resources. As
mentioned, when operating on data sources, use the same syntax, except with
`data` in place of `resources`.

<a id="resources-value-config" />

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [resource
namespace](#namespace-resources-data-sources) is a map of key-value pairs that
directly map to Terraform config keys and values.

-> **With Terraform 0.11 or earlier**, if the config value is defined as an
expression (and not a static value), the value will be in its raw,
non-interpolated string. **With Terraform 0.12 or later**, any non-static
values (such as interpolated strings) are not present and
[`references`](#resources-value-references) should be used instead.

As an example, consider the following resource block:

```hcl
resource "local_file" "accounts" {
  content  = "some text"
  filename = "accounts.txt"
}
```

In this example, one might want to access `filename` to validate that the correct
file name is used. Given the above example, the following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule {
	tfconfig.resources.local_file.accounts.config.filename is "accounts.txt"
}
```

<a id="resources-value-provisioners" />

### Value: `references`

* **Value Type:** A string-keyed map of list values containing strings.

-> **Note:** This value is only present when using Terraform 0.12 or later.

The `references` value within the [resource namespace](#namespace-resources-data-sources)
contains the identifiers within non-constant expressions found in [`config`](#resources-value-config).
See the [documentation on `references`](#references-with-terraform-0-12) for more information.

<a id="resources-value-provisioners" />

### Value: `provisioners`

* **Value Type:** List of [provisioner namespaces](#namespace-provisioners).

The `provisioners` value within the [resource namespace](#namespace-resources)
represents the [provisioners][ref-tf-provisioners] within a specific resource.

Provisioners are listed in the order they were provided in the configuration
file.

While the `provisioners` value will be present within data sources, it will
always be an empty map (in Terraform 0.11) or `null` (in Terraform 0.12) since
data sources cannot actually have provisioners.

The data within a provisioner can be inspected via the returned [provisioner
namespace](#namespace-provisioners).

[ref-tf-provisioners]: /docs/provisioners/index.html

## Namespace: Provisioners

The **provisioner namespace** represents the configuration for a particular
[provisioner][ref-tf-provisioners] within a specific resource.

<a id="provisioners-value-config" />

### Value: `config`

* **Value Type:** A string-keyed map of values.

The `config` value within the [provisioner namespace](#namespace-provisioners)
represents the values of the keys within the provisioner.

-> **With Terraform 0.11 or earlier**, if the config value is defined as an
expression (and not a static value), the value will be in its raw,
non-interpolated string. **With Terraform 0.12 or later**, any non-static
values (such as interpolated strings) are not present and
[`references`](#provisioners-value-references) should be used instead.

As an example, given the following resource block:

```hcl
resource "null_resource" "foo" {
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
	tfconfig.resources.null_resource.foo.provisioners[0].config.command is "echo ${self.private_ip} > file.txt"
}
```

<a id="provisioners-value-references" />

### Value: `references`

* **Value Type:** A string-keyed map of list values containing strings.

-> **Note:** This value is only present when using Terraform 0.12 or later.

The `references` value within the [provisioner namespace](#namespace-provisioners)
contains the identifiers within non-constant expressions found in [`config`](#provisioners-value-config).
See the [documentation on `references`](#references-with-terraform-0-12) for more information.

<a id="provisioners-value-type" />

### Value: `type`

* **Value Type:** String.

The `type` value within the [provisioner namespace](#namespace-provisioner)
represents the type of the specific provisioner.

As an example, in the following resource block:

```hcl
resource "null_resource" "foo" {
  # ...

  provisioner "local-exec" {
    command = "echo ${self.private_ip} > file.txt"
  }
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.resources.null_resource.foo.provisioners[0].type is "local-exec" }
```

## Namespace: Module Configuration

The **module configuration** namespace displays data on _module configuration_
as it is given within a `module` block. This means that the namespace concerns
itself with the contents of the declaration block (example: the `source`
parameter and variable assignment keys), not the data within the module
(example: any contained resources or data sources). For the latter, the module
instance would need to be looked up with the [`module()`
function](#root-function-module).

<a id="modules-value-source" />

### Value: `source`

* **Value Type:** String.

The `source` value within the [module configuration
namespace](#namespace-module-configuration) represents the module source path as
supplied to the module configuration.

As an example, given the module declaration block:

```hcl
module "foo" {
  source = "./foo"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.modules.foo.source is "./foo" }
```

<a id="modules-value-version" />

### Value: `version`

* **Value Type:** String.

The `version` value within the [module configuration
namespace](#namespace-module-configuration) represents the [version
constraint][module-version-constraint] for modules that support it, such as
modules within the [Terraform Module Registry][terraform-module-registry] or the
[Terraform Cloud private module registry][tfe-private-registry].

[module-version-constraint]: /docs/configuration/modules.html#module-versions
[terraform-module-registry]: https://registry.terraform.io/
[tfe-private-registry]: /docs/cloud/registry/index.html

As an example, given the module declaration block:

```hcl
module "foo" {
  source  = "foo/bar"
  version = "~> 1.2"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.modules.foo.version is "~> 1.2" }
```

<a id="modules-value-config" />

### Value: `config`

* **Value Type:** A string-keyed map of values.

-> **With Terraform 0.11 or earlier**, if the config value is defined as an
expression (and not a static value), the value will be in its raw,
non-interpolated string. **With Terraform 0.12 or later**, any non-static
values (such as interpolated strings) are not present and
[`references`](#modules-value-references) should be used instead.

The `config` value within the [module configuration
namespace](#namespace-module-configuration) represents the values of the keys
within the module configuration. This is every key within a module declaration
block except [`source`](#modules-value-source) and [`version`](#modules-value-version), which
have their own values.

As an example, given the module declaration block:

```hcl
module "foo" {
  source = "./foo"

  bar = "baz"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.modules.foo.config.bar is "baz" }
```

<a id="modules-value-references" />

### Value: `references`

* **Value Type:** A string-keyed map of list values containing strings.

-> **Note:** This value is only present when using Terraform 0.12 or later.

The `references` value within the [module configuration namespace](#namespace-module-configuration)
contains the identifiers within non-constant expressions found in [`config`](#modules-value-config).
See the [documentation on `references`](#references-with-terraform-0-12) for more information.

## Namespace: Outputs

The **output namespace** represents _declared_ output data within a
configuration. As such, configuration for the [`value`](#outputs-value-value) attribute
will be in its raw form, and not yet interpolated. For fully interpolated output
values, see the [`tfstate` import][ref-tfe-sentinel-tfstate].

[ref-tfe-sentinel-tfstate]: ./tfstate.html

This namespace is indexed by output name.

<a id="outputs-value-depends_on" />

### Value: `depends_on`

* **Value Type:** A list of strings.

The `depends_on` value within the [output namespace](#namespace-outputs)
represents any _explicit_ dependencies for this output. For more information,
see the [depends_on output setting][ref-depends_on] within the general Terraform
documentation.

[ref-depends_on]: /docs/configuration/outputs.html#depends_on

As an example, given the following output declaration block:

```hcl
output "id" {
  depends_on = ["null_resource.bar"]
  value      = "${null_resource.foo.id}"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.outputs.id.depends_on[0] is "null_resource.bar" }
```

<a id="outputs-value-description" />

### Value: `description`

* **Value Type:** String.

The `description` value within the [output namespace](#namespace-outputs)
represents the defined description for this output.

As an example, given the following output declaration block:

```hcl
output "id" {
  description = "foobar"
  value       = "${null_resource.foo.id}"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.outputs.id.description is "foobar" }
```

<a id="outputs-value-sensitive" />

### Value: `sensitive`

* **Value Type:** Boolean.

The `sensitive` value within the [output namespace](#namespace-outputs)
represents if this value has been marked as sensitive or not.

As an example, given the following output declaration block:

```hcl
output "id" {
  sensitive = true
  value     = "${null_resource.foo.id}"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { subject.outputs.id.sensitive }
```

<a id="outputs-value-value" />

### Value: `value`

* **Value Type:** Any primitive type, list or map.

The `value` value within the [output namespace](#namespace-outputs) represents
the defined value for the output as declared in the configuration. Primitives
will bear the implicit type of their declaration (string, int, float, or bool),
and maps and lists will be represented as such.

-> **With Terraform 0.11 or earlier**, if the config value is defined as an
expression (and not a static value), the value will be in its raw,
non-interpolated string. **With Terraform 0.12 or later**, any non-static
values (such as interpolated strings) are not present and
[`references`](#outputs-value-references) should be used instead.

As an example, given the following output declaration block:

```hcl
output "id" {
  value = "${null_resource.foo.id}"
}
```

With Terraform 0.11 or earlier the following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.outputs.id.value is "${null_resource.foo.id}" }
```

<a id="outputs-value-references" />

### Value: `references`

* **Value Type:**. List of strings.

-> **Note:** This value is only present when using Terraform 0.12 or later.

The `references` value within the [output namespace](#namespace-outputs)
contains the names of any referenced identifiers when [`value`](#outputs-value-value)
is a non-constant expression.

As an example, given the following output declaration block:

```hcl
output "id" {
  value = "${null_resource.foo.id}"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.outputs.id.references contains "null_resource.foo.id" }
```

## Namespace: Providers

The **provider namespace** represents data on the declared providers within a
namespace.

This namespace is indexed by provider type and _only_ contains data about
providers when actually declared. If you are using a completely implicit
provider configuration, this namespace will be empty.

This namespace is populated based on the following criteria:

* The top-level namespace [`config`](#providers-value-config) and
  [`version`](#providers-value-version) values are populated with the configuration and
  version information from the default provider (the provider declaration that
  lacks an alias).
* Any aliased providers are added as namespaces within the
  [`alias`](#providers-value-alias) value.
* If a module lacks a default provider configuration, the top-level `config` and
  `version` values will be empty.

<a id="providers-value-alias" />

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

```hcl
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

<a id="providers-value-config" />

### Value: `config`

* **Value Type:** A string-keyed map of values.

-> **With Terraform 0.11 or earlier**, if the config value is defined as an
expression (and not a static value), the value will be in its raw,
non-interpolated string. **With Terraform 0.12 or later**, any non-static
values (such as interpolated strings) are not present and
[`references`](#providers-value-references) should be used instead.

The `config` value within the [provider namespace](#namespace-providers)
represents the values of the keys within the provider's configuration, with the
exception of the provider version, which is represented by the
[`version`](#providers-value-version) value. [`alias`](#providers-value-alias) is also not included
when the provider is aliased.

As an example, given the following provider declaration block:

```hcl
provider "aws" {
  region = "us-east-1"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.providers.aws.config.region is "us-east-1" }
```

<a id="providers-value-references" />

### Value: `references`

* **Value Type:** A string-keyed map of list values containing strings.

-> **Note:** This value is only present when using Terraform 0.12 or later.

The `references` value within the [provider namespace](#namespace-providers)
contains the identifiers within non-constant expressions found in [`config`](#providers-value-config).
See the [documentation on `references`](#references-with-terraform-0-12) for more information.

<a id="providers-value-version" />

### Value: `version`

* **Value Type:** String.

The `version` value within the [provider namespace](#namespace-providers)
represents the explicit expected version of the supplied provider. This includes
the pessimistic operator.

As an example, given the following provider declaration block:

```hcl
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

[ref-tfe-sentinel-tfplan]: ./tfplan.html

This namespace is indexed by variable name.

<a id="variables-value-default" />

### Value: `default`

* **Value Type:** Any primitive type, list, map, or `null`.

The `default` value within the [variable namespace](#namespace-variables)
represents the default for the variable as declared in the configuration.

The actual value will be as configured. Primitives will bear the implicit type
of their declaration (string, int, float, or bool), and maps and lists will be
represented as such.

If no default is present, the value will be [`null`][ref-sentinel-null] (not to
be confused with [`undefined`][ref-sentinel-undefined]).

[ref-sentinel-null]: https://docs.hashicorp.com/sentinel/language/spec#null
[ref-sentinel-undefined]: https://docs.hashicorp.com/sentinel/language/undefined

As an example, given the following variable blocks:

```hcl
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

<a id="variables-value-description" />

### Value: `description`

* **Value Type:** String.

The `description` value within the [variable namespace](#namespace-variables)
represents the description of the variable, as provided in configuration.

As an example, given the following variable block:

```hcl
variable "foo" {
  description = "foobar"
}
```

The following policy would evaluate to `true`:

```python
import "tfconfig"

main = rule { tfconfig.variables.foo.description is "foobar" }
```
