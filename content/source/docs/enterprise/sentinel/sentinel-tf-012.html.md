---
layout: enterprise2
page_title: "Using Sentinel with Terraform 0.12 - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-sentinel-tf-012"
description: |-
  Read about the changes made to Sentinel in Terraform 0.12.
---

# Using Sentinel with Terraform 0.12

The Terraform Sentinel imports
([`tfconfig`](/docs/enterprise/sentinel/import/tfconfig.html),
[`tfplan`](/docs/enterprise/sentinel/import/tfplan.html), and
[`tfstate`](/docs/enterprise/sentinel/import/tfstate.html)) have been updated to
work with Terraform 0.12. Care has been taken to ensure that the API is as
backwards compatible as possible and most policies will continue to work without
modification.

However, due to fundamental changes introduced in Terraform 0.12, some API
changes were required. While `tfconfig` was most impacted, there have been
notable changes to both `tfplan` and `tfstate` as well.

Your policies will need to be adjusted if they are affected by these changes.

## Changes to `tfconfig`

Terraform 0.12 no longer exports raw configuration to Sentinel and as such the
[`tfconfig`](/docs/enterprise/sentinel/import/tfconfig.html) import has seen the
most profound changes, with the introduction of the `references` key in several
of the namespaces within the import. Certain block values (such as maps) are
also referenced slightly differently on part of the greater emphasis on
correctness in their definition in Terraform 0.12.

### The `references` Key

In Terraform 0.12, configuration values that do not contain static, constant
values can no longer be referenced directly within their respective `config` or
`value` keys. Attempting to do so will yield an undefined value.

Instead, any identifiers referenced directly in an expression or via
interpolation are now added to a `references` value, mirroring the structure of
`config` or `value`, depending on the namespace.

This affects resources, data sources, module calls, outputs, providers, and
provisioners. Variables are not affected by this change as they cannot contain
referenced expressions.

**With Terraform 0.11 and Earlier:**

```python
import "tfconfig"

# filename_value is the raw, non-interpolated string
filename_value = tfconfig.resources.local_file.accounts.config.filename

main = rule {
	filename_value contains "${var.domain}" and
	filename_value contains "${var.subdomain}"
}
```

**With Terraform 0.12 or Later:**

```python
import "tfconfig"

# filename_references is a list of string values containing the references used in the expression
filename_references = tfconfig.resources.local_file.accounts.references.filename

main = rule {
  filename_references contains "var.domain" and
  filename_references contains "var.subdomain"
}
```

You can read more about `references` in `tfconfig`
For more information, see [`references` in the `tfconfig` import](/docs/enterprise/sentinel/import/tfconfig.html#references-with-terraform-0-12).

### Referencing Map Values

As a consequence of no longer receiving raw Terraform configuration, map values
are no longer represented as lists separated by their block index.

This can be best demonstrated with a simple Sentinel policy for
[`null_resource`](/docs/providers/null/resource.html). In Terraform 0.11 and
earlier, this is a valid `null_resource` declaration, and the two map values
would be merged:

**Valid `null_resource` Configuration for Terraform 0.11 or Earlier**

```hcl
resource "null_resource" "foo" {
  triggers {
    foo = "bar"
  }

  triggers {
    baz = "qux"
  }
}
```

When using `tfconfig` in Terraform 0.11 and earlier, you need to reference the
values in each configuration block separately. This is done by referring to each
block index of the list representation, within `triggers` in this case:

**Sentinel Policy for `null_resource` in Terraform 0.11 or Earlier**

```python
main = rule {
	tfconfig.resources.null_resource.foo.config.triggers[0].foo is "bar" and
	tfconfig.resources.null_resource.foo.config.triggers[1].baz is "qux"
}
```

In Terraform 0.12, this is no longer valid configuration for maps. The
(previously optional) `=` assignment operator is now required, and as map values
are technically not configuration sub-blocks, they can only be defined once.

**Valid `null_resource` Configuration for Terraform 0.12 or Earlier**

```hcl
resource "null_resource" "foo" {
  triggers = {
    foo = "bar"
    baz = "qux"
  }
}
```

This configuration is also now correctly defined in Sentinel as an actual map.
As this value is no longer a block, it is no longer referenced by a block index.

**Sentinel Policy for `null_resource` in Terraform 0.12 or Later**

```python
main = rule {
	tfconfig.resources.null_resource.foo.config.triggers.foo is "bar" and
	tfconfig.resources.null_resource.foo.config.triggers.baz is "qux"
}
```

Note that this does not affect _actual_ blocks, which are generally represented as
lists or sets - configuration for these cases will still need to be checked for
at the expected block index for the relevant data.

## Changes to `tfplan`

When used as directed, the
[`tfplan`](/docs/enterprise/sentinel/import/tfplan.html) import behaves
exactly the same way with Terraform 0.12 as it does with Terraform 0.11. The
only change that has been made is to the behavior of unknown values within
[`applied`](/docs/enterprise/sentinel/import/tfplan.html#value-applied).

### Changes to Unknown Values in `applied`

Unknown values within
[`applied`](/docs/enterprise/sentinel/import/tfplan.html#value-applied) in the
[resource
namespace](/docs/enterprise/sentinel/import/tfplan.html#namespace-resources-data-sources)
no longer return the magic UUID value (defined as
`74D93920-ED26-11E3-AC10-0800200C9A66` in Terraform 0.11 or earlier). Instead,
unknown values are now returned as undefined.

As mentioned within the documentation for `tfplan`, relying on specific behavior
of unknown data within `applied` is not supported. Instead, it is recommended to
check the
[`computed`](/docs/enterprise/sentinel/import/tfplan.html#value-computed) key
within the [diff
namespace](/docs/enterprise/sentinel/import/tfplan.html#namespace-resource-diff)
to validate whether or not a value is unknown before looking for it in
`applied`.

## Changes to `tfstate`

The [`tfstate`](/docs/enterprise/sentinel/import/tfstate.html) import has had
the availability of outputs restricted to the top-level of the namespace,
effectively restricting it to the root module only.

###  Non-Root `outputs` are no Longer Available

The [output
namespace](/docs/enterprise/sentinel/import/tfstate.html#namespace-outputs) is
no longer available within `tfstate`'s [module
namespace](/docs/enterprise/sentinel/import/tfstate.html#namespace-module). The
namespace must now be accessed from the top-level `tfstate` namespace,
effectively allowing outputs to be viewed for the root module only.

**Valid**

```python
main = rule { tfstate.outputs.foo is "bar" }
```

**No Longer Valid**

```python
main = rule {
	tfstate.module([]).outputs.foo is "bar" or
	tfstate.module(["foo"]).outputs.foo is "bar"
}
```
