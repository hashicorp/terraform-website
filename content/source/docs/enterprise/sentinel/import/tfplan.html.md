---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfplan"
description: |-
    The tfplan import provides access to a Terraform plan. A Terraform plan is the file created as a result of `terraform plan` and is the input to `terraform apply`. The plan represents the changes that Terraform needs to make to infrastructure to reach the desired state represented by the configuration.
---

# Import: tfplan

The tfplan import provides access to a Terraform plan. A Terraform
plan is the file created as a result of `terraform plan` and is
the input to `terraform apply`. The plan represents the changes that
Terraform needs to make to infrastructure to reach the desired state
represented by the configuration.

The Terraform plan import also allows you to access the configuration
files as well as the Terraform state at the time the plan was run.
You can also access an "applied" state that merges the plan with the
state to create the planned state after apply. Note that any computed
values will not be visible in this state.

### tfplan.config

The Terraform configuration when this plan was created. This value
is the same as the `tfconfig` import. See the documentation for the
`tfconfig` import for more information.

This is useful to verify that certain values are set in the
configuration and not only visible in the plan. For example, a policy
may require that a certain setting is statically set on all
load balancers. The configuration is the place to verify this.

### tfplan.state

The Terraform state when this plan was created, but without applying
the plan. This can also be viewed as the "prior" state if this
plan is applied. The returned value is the same as the `tfstate` import.
Please see the documentation for the `tfstate` import for more
informationon available fields.

This is useful for policies that may restrict behaviors depending
on prior state. For example, a policy that doesn't allow changing
removing old values once they're set can use this to determine what
values were set previously.

### tfplan.module_paths

All the module paths represented in the diff. This can be used along
with tfplan.module() to iterate through all modules. An example of
a function to retrive all resources in all modules is shown below:

```python
import "tfplan"

all_resources = func() {
    resources = []
    for tfplan.module_paths as path {
        resources += values(tfplan.module(path).resources)
    }

    return resources
}
```

Here is an example of a function to retrieve all resources of a particular type
from all modules. Note the use of `else []` in case some modules don't have any
vms; this is necessary to avoid the function returning `undefined`.

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

### tfplan.terraform_version

The terraform version that made this plan. This will be the same
version returned by `terraform version`. This can be used to verify
certain Terraform versions are used. An example value is "0.10.4".

### tfplan.variables.NAME

Variables returns the map of set variables for the root module.
This may also include variables that are set that don't correspond
to any valid input for the configuration. These variables are ignored
by Terraform but are still stored within the plan.

Example, if you execute Terraform with `terraform plan -var foo=bar`,
then you could write a policy to verify plan was executed with that
variable as shown below. Note that we use the "else" undefined escape
in case the variable is not set.

```python
import "tfplan"

main = rule { tfplan.variables.foo else "" is "bar" }
```

You can also access `tfplan.variables` which returns the map of
available variables. For example, to verify exactly 3 variables are set:

```python
import "tfplan"

main = rule { length(tfplan.variables) is 3 }
```

### tfplan.resources

Resources returns a map of all the resources in the root module.
This is identical to `tfplan.module([]).resources`. If you want to
validate a policy against all resources of a particular type, you will
need to use logic similar to that in the second example in the
[tfplan.module_paths](#tfplan-module_paths) section above.

### tfplan.data

`data` returns a map of all the data sources in the root module.
This is identical to `tfplan.module([]).data`. If you want to
validate a policy against all data sources of a particular type,
you will need to use logic similar to that in the second example in
the [tfplan.module_paths](#tfplan-module_paths) section above.

### tfplan.module(path)

The module function finds the module at the given path and returns
the type "module". See the documentation for the type "module" for
available attributes.

The path is a list. An empty list is the root module. Each element
of the list is the name of a child module to access. For example, if
you have a module named "child" which itself includes a module named
"grandchild", it could be accessed like this:

```python
tfplan.module(["child", "grandchild"])
```

If a module path doesn't exist, `undefined` is returned.

## Type: attribute

### attribute.old

This is the old value. If it wasn't set before, the returned value
will be an empty string. It is not possible to distinguish between
an old value of an empty string and the value not being set before.

This value can be used to enforce policy on the types of changes that
can occur in certain attribute values. For example, there may be a policy
that tag values can only be appended to, and not replaced.

### attribute.new

This is the new value that the attribute is going to, as a string.
This may be the empty string if the value is computed. You can check if
the value is computed using the `computed` field.

### attribute.computed

This is a boolean value that is true if this attribute's new value is
a computed value. A computed value is a value that is not known until
apply time. This can be because this is a dynamic value from this
resource itself such as the IP address of a new compute instance, or
because it is a parameter that is being populated from a dynamic
value from another resource.

If a value is computed, it cannot be known until after apply. If policy
must be enforced on the value of this field, it must be done post-apply
or by disallowing computed values.

### attribute.removed

This is a boolean value that is true if this field is being removed.
This can be set if the entire configuration is deleted, or if the element
of a map or list is being removed. This is set for example when a tag is
removed from an AWS resource.

When a value is removed, its `new` value will be an empty string.

## Type: module

### module.resources.TYPE.NAME

This returns the list of resources with the given type and name.

The result is a list because the plan is aware that the count may be greater
than zero. If a resource has no `count` set and is only a single item, the
result is still a list with a single element. Otherwise, the list is
indexed by the count index. Note that in some cases not every index
is populated. The Sentinel `for`, `any`, and `all` iteration mechanisms
will not include those.

You can also access a map of name to resource by accessing
`module.resource.TYPE` or a map of types using `module.resource`.

An example of accessing a resource named "app" of type "aws_instance"
in a module named "web".

```python
import "tfplan"

m = tfplan.module(["web"])
r = m.resources.aws_instance.app

// There should only be a single app instance being created.
main = rule { length(r) is 1 }
```

### module.data.TYPE.NAME

This returns a list of data sources with the given type and name, and behaves
exactly how a resource lookup behaves with the module.resources.TYPE.NAME syntax
above. All fields that are accessible within [resources](#type-resource) are
available within a data source.

Note for a data source to be present here, it must be in the plan, which
generally means it must have some unknown data at plan time.

## Type: resource

### resource.diff.FIELD

The `FIELD` is a changed field within the resource to access.

Only fields that are changing within the plan are available here. If
a field already was set in the state and wasn't changed, no change
is required and it will not be present in the plan. You can still find
the field in the `tfplan.state`. You can also use the `resource.applied`
value, which will retain the old value.

If FIELD contains a period, it must be accessed as a map. For example:
`resource.diff[FIELD]`. Map and list elements may contain periods. For
example a tag "foo" being set on an instance may require this
sort of access:

```python
import "tfplan"

r = tfplan.resources.aws_instance.web
main = rule { not r.diff["tag.foo"].computed }
```

You can check if the value is computed by using the `computed` property,
as in this example.

### resource.applied.FIELD

The value of `FIELD` in this resource after the plan is applied.

This merges the plan to the prior state to simulate an apply. An actual
apply does not take place at this time. From the simulated apply, the
value of `FIELD` can be tested.

This is the best method to actual do any sort of value checking for
a plan. For any policies that require certain fields have certain values,
this is the mechanism to use. For example, a policy that requires a certain
tag be set on a resource should use this to find the tag.

Note that if `FIELD` is a computed value, then this will return a
special UUID marker noting it is computed.
