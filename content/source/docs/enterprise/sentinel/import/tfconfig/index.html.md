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

## Namespace: Root

The following documents the root-level namespace of this import. For more
details on the particular import, click one of the linked namespaces below, or
look on the left sidebar.

### Module Namespaces and Functions

The following namespaces relate to accessing module configuration data, or allow
you to load the resource, data source, and variables namespaced to a particular
module.

* `module_paths` - (List of list of strings) Returns a list of each module, with
  its path broken up into its individual components.
  [Deatils](ns/module_paths.html)
* `module()` - (Function, returns namespace) Returns a [module
  namespace](ns/module/index.html) anchored at the supplied module.
  [Deatils](ns/module.html)

### Root Module Namespace

The following keys are essentially aliases of the [module
namespace](ns/module/index.html), anchored to the root module, and exist for
convening. They are the same as performing `tfconfig.module([])`.

* `data` - (Namespace) A namespace for returning the data sources within
  a configuration. This namespace is identical to the `resources` namespace, but
  does not return data sources.[Deatils](ns/module/data.html)
* `modules` - (Namespace) A namespace for returning the configuration of
  a module itself, versus its resources and data sources.
  [Deatils](ns/module/modules.html)
* `providers` - (Namespace) A namespace for returning the configuration of
  providers within the module. [Deatils](ns/module/providers.html)
* `resources` - (Namespace) A namespace for returning the resources
  within a configuration. This namespace is identical to the `data` namespace,
  but does not return data sources. [Deatils](ns/module/resources.html)
