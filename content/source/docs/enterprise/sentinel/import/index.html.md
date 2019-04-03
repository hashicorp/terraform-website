---
layout: enterprise2
page_title: "Defining Policies - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports"
---

# Defining Policies

Sentinel Policies for Terraform are defined using the [Sentinel policy
language](https://docs.hashicorp.com/sentinel/language/). A policy can include
[imports](https://docs.hashicorp.com/sentinel/concepts/imports) which enable a
policy to access reusable libraries, external data and functions. Terraform
Enterprise provides three imports to define policy rules for the configuration,
state and plan.

- [tfplan](./tfplan.html) - This provides access to a Terraform plan, the file created as a result of `terraform plan`.	 The plan represents the changes that Terraform needs to make to infrastructure to reach the desired state represented by the configuration.
- [tfconfig](./tfconfig.html) - This provides access to a Terraform configuration, the set of "tf" files that are used to describe the desired infrastructure state.
- [tfstate](./tfstate.html) - This provides access to the Terraform state, the file used by Terraform to map real world resources to your configuration.

To create test data for rules, Terraform Enterprise allows you to create mocks
of these imports from executable plans for use with the mocking or testing
features of the [Sentinel Simulator](https://docs.hashicorp.com/sentinel/commands/).
To download tfplan, tfconfig, and tfstate mocks of an executable plan in your
organization, navigate to any run for you'd like to download mock data, and expand
the run's plan information to find a button to download mock data:

![Download Sentinel Mocks](/assets/images/guides/sentinel/download-mocks.png)

Terraform Enterprise retains the executable plan for seven days, so as long as the
plan is finished and is not over seven days old, mock data can be downloaded.

-> **Note:** Terraform Enterprise does not currently support custom imports.

## Useful Idioms for Terraform Sentinel Policies

Terraform's internal data formats are complex, which means basic Sentinel policies for Terraform are more verbose than basic policies that use simpler data sources.

This will improve in future versions of Terraform and Sentinel; in the meantime, be aware of the following idioms as you start writing policies for Terraform.

### To Find Resources, Iterate over Modules

The most basic Sentinel task for Terraform is to enforce a rule on all resources of a given type. Before you can do that, you need to get a collection of all the relevant resources.

The easiest way to do that is to copy a function like the following into any policies that examine every resource in a configuration:

```python
import "tfplan"

# Get an array of all resources of the given type (or an empty array).
get_resources = func(type) {
	if length(tfplan.module_paths else []) > 0 { # always true in the real tfplan import
		return get_resources_all_modules(type)
	} else { # fallback for tests
		return get_resources_root_only(type)
	}
}

get_resources_root_only = func(type) {
	resources = []
	named_and_counted_resources = tfplan.resources[type] else {}
	# Get resource bodies out of nested resource maps, from:
	# {"name": {"0": {"applied": {...}, "diff": {...} }, "1": {...}}, "name": {...}}
	# to:
	# [{"applied": {...}, "diff": {...}}, {"applied": {...}, "diff": {...}}, ...]
	for named_and_counted_resources as _, instances {
		for instances as _, body {
			append(resources, body)
		}
	}
	return resources
}

get_resources_all_modules = func(type) {
	resources = []
	for tfplan.module_paths as path {
		named_and_counted_resources = tfplan.module(path).resources[type] else {}
		# Get resource bodies out of nested resource maps, from:
		# {"name": {"0": {"applied": {...}, "diff": {...} }, "1": {...}}, "name": {...}}
		# to:
		# [{"applied": {...}, "diff": {...}}, {"applied": {...}, "diff": {...}}, ...]
		for named_and_counted_resources as _, instances {
			for instances as _, body {
				append(resources, body)
			}
		}
	}
	return resources
}
```

-> **Note:** This example uses the tfplan import. You can easily substitute tfconfig or tfstate, depending on your needs.

Later, use the function to get a collection of resources:

```python
aws_instances = get_resources("aws_instance")
```

This example function handles several things that are tricky about finding resources:

- It checks every module for resources (including the root module) by looping over the `module_paths` namespace. The top-level `resources` namespace is more convenient, but it only reveals resources from the root module.
- It unwraps the import's nested data structures, leaving only an array of resource bodies. The value of `tfplan.module(path).resources[type]` is a series of nested maps keyed by resource name and by [`count`](/docs/configuration/resources.html#count), but the name and count are almost never relevant to a policy. Removing them early makes the rest of the policy more readable.
- It uses `else` expressions to recover from `undefined` values, for modules that don't have any resources of that type.
- It falls back to the `resources` namespace if the real tfplan import isn't available, to support [testing](https://docs.hashicorp.com/sentinel/writing/testing). Since current versions of Sentinel don't allow you to mock tfplan's `module()` function, it isn't possible to test Sentinel code that accesses non-root modules. However, you can still test the rest of the policy by mocking resource data under the `resources` namespace.

-> **Note:** This example is checking whether it's in a test by looking for an empty `module_paths` namespace, which assumes that our organization is omitting that key in our mock data for Sentinel tests. For policies that need to test mocked `module_paths` data for other purposes, you might need to use a different method to check for the real Terraform imports.

### To Test Resources, Use `all`/`any` Expressions

Once you have a collection of resources, you usually want to test some property of each resource in the collection — for example, the planned final value of a particular resource attribute.

The most concise tool for this is Sentinel's [`all` and `any` expressions](https://docs.hashicorp.com/sentinel/language/boolexpr#any-all-expressions). For example:

```python
# Allowed Types
allowed_types = [
	"t2.small",
	"t2.medium",
	"t2.large",
]

# Rule to restrict instance types
instance_type_allowed = rule {
	all get_resources("aws_instance") as r {
		r.applied.instance_type in allowed_types
	}
}
```

-> **Note:** This example assumes that you are unwrapping the import's nested maps when finding resources, as described in the previous section. If you leave the nested maps in place, you will have to use nested `all`/`any` expressions to reach the resource attributes.
