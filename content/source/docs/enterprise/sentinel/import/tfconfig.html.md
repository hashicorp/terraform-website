---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfconfig"
description: |-
  The tfconfig import provides access to a Terraform configuration.
---

# Import: tfconfig

The tfconfig import provides access to a Terraform configuration.

The Terraform configuration is the set of "tf" files that are used
to describe the desired infrastructure state. This import alone doesn't
give you access to the state of the infrastructure. To view the state
of the infrastructure, see the `tfstate` import.

Policies using the tfconfig import can access all aspects of the configuration:
providers, resources, data sources, modules, variables, etc. Note that since
this is the configuration and not an invocation of Terraform, you can't see
values for variables, state, etc.

### tfconfig.modules

All the module paths represented in the config. This can be used along
with tfconfig.module() to iterate through all modules.

### tfconfig.module(path)

The module function finds the module at the given path.

## Type: m

### m.modules.NAME

This returns the module configuration for the module NAME. This
does NOT return the full module configuration, only the usage from
this module. This allows you to inspect the parameters to a module.

### m.providers

This returns all the configured providers in the module. Note
that this will only contain the configuration that was set explicitly
within this module.

### m.providers.NAME

This returns the configuration for the provider with the given name.

### m.resources

This returns all the resources in the module as a map. The map
key is the type, the value is the same as `m.resources.TYPE`.

### m.resources.TYPE

This returns all the resources in the module with the given type
as a map from name to resource. For the documentation on the
value, see `m.resources.TYPE.NAME`

### m.resources.TYPE.NAME

This returns the resource with the given type and name.

### m.data

This returns all the data sources in the module as a map. The map
key is the type, the value is the same as `m.data.TYPE`.

### m.data.TYPE

This returns all the data sources in the module with the given type
as a map from name to data source. For the documentation on the
value, see `m.data.TYPE.NAME`

### m.data.TYPE.NAME

This returns the data source with the given type and name.

### m.variables

This returns all the defined variables for the module.

### m.variables.NAME

This returns the variable with the given name.

## Type: mc

### mc.source

The source of the module.

### mc.config.FIELD

The FIELD is a field within the module to configure it.

## Type: p

### p.alias.NAME

This accesses the provider with the alias of name NAME.

### p.config.FIELD

The FIELD is a field within the provider configuration to access.
This returns the value of the field.

## Type: r

### r.config.FIELD

The FIELD is a field within the resource to access. This returns the
value of the field.

## Type: d

### d.config.FIELD

The FIELD is a field within the data source to access. This returns the
value of the field.

## Type: v

### v.type

This accesses all the information related to variables.

### v.default

### v.description
