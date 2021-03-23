---
layout: "cloud"
page_title: "Defining Policies - Sentinel - Terraform Cloud and Terraform Enterprise"
---

# Defining Policies

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

Sentinel Policies for Terraform are defined using the [Sentinel policy
language](https://docs.hashicorp.com/sentinel/language). A policy can include
[imports](https://docs.hashicorp.com/sentinel/concepts/imports) which enable a
policy to access reusable libraries, external data and functions. Terraform
Cloud provides four imports to define policy rules for the plan, configuration,
state, and run associated with a policy check.

- [tfplan](./tfplan.html) - This provides access to a Terraform plan, the file
  created as a result of `terraform plan`.	 The plan represents the changes
  that Terraform needs to make to infrastructure to reach the desired state
  represented by the configuration.
- [tfconfig](./tfconfig.html) - This provides access to a Terraform
  configuration, the set of "tf" files that are used to describe the desired
  infrastructure state.
- [tfstate](./tfstate.html) - This provides access to the Terraform state, the
  file used by Terraform to map real world resources to your configuration.
- [tfrun](./tfrun.html) - This provides access to data associated with a run
  in Terraform Cloud, such as the run's workspace.

Terraform Cloud allows you to create mocks of these imports from plans for use
with the mocking or testing features of the [Sentinel
CLI](https://docs.hashicorp.com/sentinel/commands). For more information, see
[Mocking Terraform Sentinel Data](../mock.html).

-> **Note:** Terraform Cloud does not currently support custom imports.

## Useful Functions and Idioms for Terraform Sentinel Policies

The following functions and idioms will be useful as you start writing Sentinel
policies for Terraform.

### Iterate over Modules and Find Resources

The most basic Sentinel task for Terraform is to enforce a rule on all resources
of a given type. Before you can do that, you need to get a collection of all the
relevant resources from all modules. The easiest way to do that is to copy and
use a function like the following into your policies:

```python
import "tfplan"
import "strings"

# Find all resources of specific type from all modules using the tfplan import
find_resources_from_plan = func(type) {
    resources = {}
    for tfplan.module_paths as path {
        for tfplan.module(path).resources[type] else {} as name, instances {
            for instances as index, r {
                # Get the address of the resource instance
                if length(path) == 0 {
                    # root module
                    address = type + "." + name + "[" + string(index) + "]"
                } else {
                    # non-root module
                    address = "module." + strings.join(path, ".module.") + "." +
                              type + "." + name + "[" + string(index) + "]"
                }
                # Add the instance to resources, setting the key to the address
                resources[address] = r
            }
        }
    }
    return resources
}
```

-> **Note:** This example uses the `tfplan` import. You can find similar
functions that iterate over the `tfconfig` and `tfstate` imports
[here](https://github.com/hashicorp/terraform-guides/tree/master/governance/second-generation/common-functions).

You can call this function to get all resources of a desired type by passing the
type as a string in quotes:

```python
aws_instances = find_resources_from_plan("aws_instance")
```

This example function does several useful things while finding resources:

- It checks every module (including the root module) for resources of the
  specified type by iterating over the `module_paths` namespace. The top-level
  `resources` namespace is more convenient, but it only reveals resources from
  the root module.
- It iterates over the named resources and [resource
  instances](/docs/language/expressions/references.html#resources)
  found in each module, starting with `tfplan.module(path).resources[type]`
  which is a series of nested maps keyed by resource names and instance counts.
- It uses the Sentinel [`else`
  operator](https://docs.hashicorp.com/sentinel/language/spec#else-operator) to
  recover from `undefined` values which would occur for modules that don't have
  any resources of the specified type.
- It builds a flat `resources` map of all resource instances of the specified
  type. Using a flat map simplifies the code used by Sentinel policies to
  evaluate rules.
- It computes an `address` variable for each resource instance and uses this as
  the key in the `resources` map. This allows writers of Sentinel policies to
  print the full [address](/docs/cli/state/resource-addressing.html) of each
  resource instance that violate a policy, using the same address format used in
  plan and apply logs. Doing this tells users who see violation messages exactly
  which resources they need to modify in their Terraform code to comply with the
  Sentinel policies.
- It sets the value of the `resources` map to the data associated with the
  resource instance (`r`). This is the data that Sentinel policies apply rules
  against.

### Validate Resource Attributes

Once you have a collection of resources instances of a desired type indexed by
their addresses, you usually want to validate that one or more resource
attributes meets some conditions by iterating over the resource instances.

While you could use Sentinel's [`all` and `any`
expressions](https://docs.hashicorp.com/sentinel/language/boolexpr#any-all-expressions)
directly inside Sentinel rules, your rules would only report the first violation
because Sentinel uses short-circuit logic. It is therefore usually preferred to
use a [`for` loop](https://docs.hashicorp.com/sentinel/language/loops) outside
of your rules so that you can report all violations that occur. You can do this
inside functions or directly in the policy itself.

Here is a function that calls the `find_resources_from_plan` function and
validates that the instance types of all EC2 instances being provisioned are in
a given list:

```python
# Validate that all EC2 instances have instance_type in the allowed_types list
validate_ec2_instance_types = func(allowed_types) {
    validated = true
    aws_instances = find_resources_from_plan("aws_instance")
    for aws_instances as address, r {
        # Determine if the attribute is computed
        if r.diff["instance_type"].computed else false is true {
            print("EC2 instance", address,
                  "has attribute, instance_type, that is computed.")
        } else {
            # Validate that each instance has allowed value
            if (r.applied.instance_type else "") not in allowed_types {
                print("EC2 instance", address, "has instance_type",
                    r.applied.instance_type, "that is not in the allowed list:",
                    allowed_types)
                validated = false
            }
        }
    }
    return validated
}
```

The boolean variable `validated` is initially set to `true`, but it is set to
`false` if any resource instance violates the condition requiring that the
`instance_type` attribute be in the `allowed_types` list. Since the function
returns `true` or `false`, it can be called inside Sentinel rules.

Note that this function prints a warning message for **every** resource instance
that violates the condition. This allows writers of Terraform code to fix all
violations after just one policy check. It also prints warnings when the
attribute being evaluated is
[computed](./tfplan.html#value-computed) and does
not evaluate the condition in this case since the applied value will not be
known.

While this function allows a rule to validate an attribute against a list, some
rules will only need to validate an attribute against a single value; in those
cases, you could either use a list with a single value or embed that value
inside the function itself, drop the `allowed_types` parameter from the function
definition, and use the `is` operator instead of the `in` operator to compare
the resource attribute against the embedded value.

### Write Rules

Having used the standardized `find_resources_from_plan` function and having
written your own function to validate that resources instances of a specific
type satisfy some condition, you can define a list with allowed values and write
a rule that evaluates the value returned by your validation function.

```python
# Allowed Types
allowed_types = [
    "t2.small",
    "t2.medium",
    "t2.large",
]

# Main rule
main = rule {
    validate_ec2_instance_types(allowed_types)
}

```

### Validate Multiple Conditions in a Single Policy

If you want a policy to validate multiple conditions against resources of a
specific type, you could define a separate validation function for each
condition or use a single function to evaluate all the conditions. In the latter
case, you would make this function return a list of boolean values, using one
for each condition.  You can then use multiple Sentinel rules that evaluate
those boolean values or evaluate all of them in your `main` rule. Here is a
partial example:

```python
# Function to validate that S3 buckets have private ACL and use KMS encryption
validate_private_acl_and_kms_encryption = func() {
    result = {
        "private":          true,
        "encrypted_by_kms": true,
    }
    s3_buckets = find_resources_from_plan("aws_s3_bucket")
    # Iterate over resource instances and check that S3 buckets
    # have private ACL and are encrypted by a KMS key
    # If an S3 bucket is not private, set result["private"] to false
    # If an S3 bucket is not encrypted, set result["encrypted_by_kms"] to false
    for s3_buckets as joined_path, resource_map {
        #...
    }
    return result
}

# Call the validation function
validations = validate_private_acl_and_kms_encryption()

# ACL rule
is_private = rule {
    validations["private"]
}

# KMS Encryption Rule
is_encrypted_by_kms = rule {
    validations["encrypted_by_kms"]
}

# Main rule
main = rule {
    is_private and is_encrypted_by_kms
}
```

Similar functions and policies can be written to restrict Terraform
configurations using the tfconfig import and to restrict Terraform state using
the tfstate import.
