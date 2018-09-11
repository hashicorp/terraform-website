---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel"
---

# Sentinel Overview

[Sentinel](https://www.hashicorp.com/sentinel) is an embedded policy-as-code
framework integrated with the HashiCorp Enterprise products. It enables
fine-grained, logic-based policy decisions, and can be extended to use
information from external sources.

To learn how to use Sentinel and begin writing policies with the Sentinel
language, see [the Sentinel documentation](https://docs.hashicorp.com/sentinel/writing/).

## Sentinel in Terraform Enterprise

Using Sentinel with Terraform Enterprise involves:

- [Defining the Policies](./import/index.html) - Policies are defined using the
[policy language](https://docs.hashicorp.com/sentinel/concepts/language) with
imports for parsing the Terraform plan, state and configuration.
- [Managing the policies for organizations](./manage-policies.html) - Policies
are added to an organization by an organization owner by setting the policy
name, policy file, and the enforcement level.
- [Enforcing policy checks on runs](./enforce.html) - Policies are checked when
a run is performed, after the `terraform plan` but before it can be confirmed or
the `terraform apply` is executed.









