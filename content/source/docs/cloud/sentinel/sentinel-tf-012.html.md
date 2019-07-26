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

## Testing a Policy With 0.11 and 0.12 Simultaneously

It's strongly advised that you test your Sentinel policies after upgrading to
Terraform 0.12 to ensure they continue to work as expected. [Mock
generation](/docs/enterprise/sentinel/mock.html) has also been updated to
produce mock data for the Sentinel imports as they appear in Terraform 0.12.

It's possible to set up a policy to be tested against both 0.11 and 0.12
simultaneously by generating the mock data necessary for both configurations,
and setting up your Sentinel repository appropriately.

### Generating Mock Data for Both Terraform Versions

~> **NOTE:** The following steps will **permanently** upgrade your workspace's
state file to Terraform 0.12. This cannot be rolled back! Only carry these steps
out on a workspace that you are okay with upgrading, or use a workspace solely
devoted to testing.

Use the steps below to generate mock data for both Terraform versions:

1. Follow the instructions on [configuring the Terraform version of the
   workspace](/docs/enterprise/workspaces/settings.html#terraform-version) and
   ensure that it set to the latest 0.11 release.
1. [Start a run](/docs/enterprise/run/ui.html#starting-runs) for the workspace
   and let it finish the plan phase.
1. Follow the instructions to [generate mock data using the
   UI](/docs/enterprise/sentinel/mock.html#generating-mock-data-using-the-ui)
   for a plan on the workspace. Save this data to a file reflective of its
   version, example: `run-abcdEFgH-sentinel-mocks-011.tar.gz`.
1. [Discard the plan](/docs/enterprise/run/ui.html#confirming-or-discarding-plans).
1. Re-configure the Terraform version for the workspace, this time selecting the
   latest 0.12 release.
1. Start a run for the workspace again.
1. Generate the mock data for the plan again, this time saving it in something
   similar to `run-abcdEFgH-sentinel-mocks-012.tar.gz`.
1. Discard the plan again.

### Data and Test Structure

Once you have the mock data for both versions, it needs to be laid out
properly so that it can be utilized by the tests that require a specific
version.

Building on the file layout we use in [using mock
data](/docs/enterprise/sentinel/mock.html#using-mock-data) section of our
[mocking guide](/docs/enterprise/sentinel/mock.html), the following layout will
allow you to have mock data for two versions co-exist at the same time:

```
.
├── test
│   └── test_tf_011_012
│       ├── tf011.json
│       └── tf012.json
├── test_tf_011_012.sentinel
└── testdata
    ├── tf-011
    │   ├── mock-tfconfig.sentinel
    │   ├── mock-tfplan.sentinel
    │   └── mock-tfstate.sentinel
    └── tf-012
        ├── mock-tfconfig.sentinel
        ├── mock-tfplan.sentinel
        └── mock-tfstate.sentinel
```

In this example, the `test_tf_011_012.sentinel` policy is a poilcy that would
work for both Terraform 0.11 and Terraform 0.12. In the test suite
(`test/test_tf_011_012`), we have two tests, one for each Terraform version,
`tf011.json` (for Terraform 0.11) and `tf012.json` (for Terraform 0.12).

The contents of each file indicates the test data to be used:

`tf011.json`:

```
{
  "mock": {
    "tfconfig": "../../testdata/tf-011/mock-tfconfig.sentinel",
    "tfplan": "../../testdata/tf-011/mock-tfplan.sentinel",
    "tfstate": "../../testdata/tf-011/mock-tfstate.sentinel"
  },
  "test": {
    "main": true
  }
}
```

`tf012.json`:

```
{
  "mock": {
    "tfconfig": "../../testdata/tf-012/mock-tfconfig.sentinel",
    "tfplan": "../../testdata/tf-012/mock-tfplan.sentinel",
    "tfstate": "../../testdata/tf-012/mock-tfstate.sentinel"
  },
  "test": {
    "main": true
  }
}
```

With this setup, you can now run `sentinel test` and have the test assert
against both sets of mock data at once:

```
$ sentinel test
PASS - test_tf_011_012.sentinel
  PASS - test/test_tf_011_012/tf011.json
  PASS - test/test_tf_011_012/tf012.json
```
