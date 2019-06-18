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

Terraform Enterprise allows you to create mocks of these imports from plans for
use with the mocking or testing features of the [Sentinel
Simulator](https://docs.hashicorp.com/sentinel/commands/). For more information,
see [Mocking Terraform Sentinel Data](../mock.html).

-> **Note:** Terraform Enterprise does not currently support custom imports.

## Useful Functions and Idioms for Terraform Sentinel Policies

The following functions and idioms will be useful as you start writing Sentinel policies for Terraform.

### To Find Resources, Iterate over Modules

The most basic Sentinel task for Terraform is to enforce a rule on all resources of a given type. Before you can do that, you need to get a collection of all the relevant resources. The easiest way to do that is to copy a function like the following into your policies:

```python
import "tfplan"
import "strings"

# Find all resources of a specific type from all modules using the tfplan import
find_resources_from_plan = func(type) {
        resource_maps = {}
        for tfplan.module_paths as path {
                # Compute joined_path from the module path
                if length(path) == 0 {
                        joined_path = ""
                } else {
                        joined_path = "module." + strings.join(path, ".module.") + "."
                }
                # Append all resources of the specified type from the current module
                resource_maps[joined_path] = tfplan.module(path).resources[type] else {}
        }
        return resource_maps
}
```

-> **Note:** This example uses the `tfplan` import to find all resources of the specified type that have pending changes. You can easily substitute `tfconfig` or `tfstate` and change the name of the function, depending on your needs.

Later, you can call this function to get all resources of a desired type by passing the type as a string in quotes:

```python
aws_instances = find_resources_from_plan("aws_instance")
```

This example function handles several things that are tricky about finding resources:

- It checks every module for resources (including the root module) by looping over the `module_paths` namespace. The top-level `resources` namespace is more convenient, but it only reveals resources from the root module.
- It computes a `joined_path` variable from Sentinel's module path structure and uses this as the key for the module-specific maps added to the `resource_maps` map.
- It sets the values of these module-level maps to `tfplan.module(path).resources[type]` which gives a series of nested maps keyed by resource name and instance [`count`](/docs/configuration/resources.html#count-multiple-resource-instances). When combined with the `joined_path` keys, the resource names and instance counts allow writers of Sentinel policies to print the full [addresses](/docs/internals/resource-addressing.html) of resource instances that violate policies. This makes it easier for users who see violation messages to know exactly which resources they need to modify. (See the `validate_instance_types` function below for an example.)
- It uses the Sentinel `else` operator to recover from `undefined` values which would occur for modules that don't have any resources of the specified type.

### A Function to Give the Full Addresses of Resources

Here is a function which can be used to give the full [address](/docs/internals/resource-addressing.html) of a resource instance that violates a policy.

```python
# Get the full address of a resource instance including modules, type,
# name, and index in form module.<A>.module.<B>.<type>.<name>[<index>]
get_instance_address = func(joined_path, type, name, index) {
        address = joined_path + type + "." + name + "[" + string(index) + "]"
        return address
}
```

-> **Note:** This example is intended for use with the tfplan and tfstate imports. For printing resource addresses with the tfconfig import, you could use a function called `get_resource_address` which would leave out the `index` argument and set `address` to `joined_path + type + "." + name`. For all three imports, `joined_path` should be formatted as it is in the `find_resources_from_plan` function above.

We show this function being called in the next section.

### To Validate Resources, Use `for` Loops Inside Functions

Once you have a collection of resources instances of a desired type and know how to give resource instance addresses, you usually want to validate that a particular resource attribute meets some condition.

While you could use Sentinel's [`all` and `any` expressions](https://docs.hashicorp.com/sentinel/language/boolexpr#any-all-expressions) directly inside Sentinel rules, your rules would only report the first violation because Sentinel uses short-circuit logic. It is therefore usually preferred to use [`for` loops](https://docs.hashicorp.com/sentinel/language/loops) inside functions called from your rules so that you can report all violations that occur. Another benefit of calling a function from a rule is that the standard Sentinel output is streamlined allowing users to focus on the warnings your print in your policies.

Here is a function that validates that the instance types of all EC2 instances being provisioned are in a given list:

```python
# Validate that all EC2 instances have instance_type
# in the allowed_types list
validate_instance_types = func(allowed_types) {
        validated = true
        aws_instances = find_resources_from_plan("aws_instance")
        # Loop through the resource maps, resources, and instances
        for aws_instances as joined_path, resource_map {
                for resource_map as name, instances {
                        for instances as index, r {
                                # Get address of the resource instance
                                address = get_instance_address(joined_path, resource_type, name, index)
                                # Validate that each instance has allowed value
                                # If not, print violation message
                                if r.applied.instance_type not in allowed_types {
                                        print("EC2 instance", address, "has attribute",
                                                r.applied.instance_type, "that is not in the list", allowed_types)
                                        validated = false
                                }
                        }
                }
        }
        return validated
}
```

This function calls the `find_resources_from_plan` and `get_instance_address` functions described above.

The boolean variable `validated` is initially set to `true`, but it is set to `false` if any resource instance violates the condition requiring that the `instance_type` attribute be in the `allowed_types` list. Since the function returns `true` or `false`, it can be called inside Sentinel rules.

Note that this function prints a warning message for each resource instance that violates the condition. This allows the writer of a Sentinel rule that calls it to tell a user about **all** resource instances that violate it. This is much better than just reporting the first violation since a user with multiple violations learns about all of them in a single shot.

### Call Functions From Rules

Finally, having re-used the standardized `find_resources_from_plan` and `get_instance_address` functions and having written your own function to validate that resources instances of a specific type satisfy some condition, you can define a list with allowed values and write a rule that calls your function:

```python
# Allowed Types
allowed_types = [
        "t2.small",
        "t2.medium",
        "t2.large",
]

# Call the validation function and assign results
instance_types_validated = validate_instance_types(allowed_types)

# Main rule
main = rule {
        instance_types_validated
}

```

### Validating Multiple Conditions in a Single Policy

If you want a policy to validate multiple conditions against resources of a specific type, we recommend that you use a single function to iterate over all resource instances of that type and make this function return a list of boolean values, using one for each condition.  You can then use multiple Sentinel rules that evaluate those boolean values or evaluate them all in your `main` rule. Here is a partial example:

```python
# Function to validate that S3 buckets have private ACL and use KMS encryption
validate_private_acl_and_kms_encryption = func() {
        private = true
        encrypted_by_kms = true

        s3_buckets = find_resources_from_plan("aws_s3_bucket")
        # Iterate over resource instances and check that S3 buckets
        # have private ACL and are encrypted by a KMS key
        # If an S3 bucket is not private, set private to false
        # If an S3 bucket is not encrypted, set encrypted_by_kms to false
        for s3_buckets as joined_path, resource_map {
                #...
        }

        return [private, encrypted_by_kms]

}

# Call the validation function and assign results
validations = validate_private_acl_and_kms_encryption()
private = validations[0]
encrypted_by_kms = validations[1]

# Main rule
main = rule {
        private and encrypted_by_kms
}
```

Similar functions and policies can be written to restrict Terraform configurations using the tfconfig import and to restrict Terraform state using  the tfstate import.
