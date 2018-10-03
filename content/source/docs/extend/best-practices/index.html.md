---
layout: "extend"
page_title: "Extending Terraform: Best Practices"
sidebar_current: "docs-extend-best-practices"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Terraform Plugin Best Practices

A key feature of Terraform is it’s plugin system, separating the logic of
managing state and configuration and providing  safe plan and apply lifecycle
management, from the details of specific vendor APIs. Plugins are responsible
for the  implementation of functionality for provisioning resources for a
specific cloud provider, allowing each Provider to fully support it’s unique
resources and lifecycles and not settling for the lowest common denominator
across all Provider resources of that type (virtual machines, networks,
configuration management systems, et. al). While each Provider is unique, over
the years we’ve accumulated some patterns that should be adhered to in order to
ensure a consistent user experience when using Terraform for any given provider.
Listed below are a few Best Practices we’ve found to generally apply most
Providers, with a brief description of each, and link to read more. Each
practice is also linked in navigation on the left.

The Best Practices section is a work in progress, with more sections to come.

## Naming

Most names in a Terraform provider will be drawn from the upstream API/SDK that 
the provider is using. The upstream API names will likely need to be 
modified for casing or changing between plural and singular to make 
the provider more consistent with the common Terraform practices below.

### Resource Names

Resource names are nouns, since resource blocks each represent a single
object Terraform is managing. Resource names must always start with their
containing provider's name followed by an underscore, so a resource from
the provider `postgresql` might be named `postgresql_database`.

It is preferable to use resource names that will be familiar to those with
prior experience using the service in question, e.g. via a web UI it provides.

### Data Source Names

Similar to resource names, data source names should be nouns. The main difference 
is that in some cases data sources are used to return a list and can in 
those cases be plural. For example the data source 
[`aws_availability_zones`](https://www.terraform.io/docs/providers/aws/d/availability_zones.html) 
in the AWS provider returns a list of availability zones.

### Attribute Names

Below is an example of a resource configuration block which illustrates some
general design patterns that can apply across all plugin object types:

```hcl
resource "aws_instance" "example" {
  ami                    = "ami-408c7f28"
  instance_type          = "t1.micro"
  monitoring             = true
  vpc_security_group_ids = [
      "sg-1436abcf",
  ]
  tags          = {
    Name        = "Application Server"
    Environment = "production"
  }
   root_block_device {
    delete_on_termination = false
  }
}
```

Attribute names within Terraform configuration blocks are conventionally named
as all-lowercase with underscores separating words, as shown above.

Simple single-value attributes, like `ami` and `instance_type` in the above
example, are given names that are singular nouns, to reflect that only one
value is required and allowed.

Boolean attributes like `monitoring` are usually written also as nouns
describing what is being enabled. However, they can sometimes be named as
verbs if the attribute is specifying whether to take some action, as with the
`delete_on_termination` flag within the `root_block_device` block.

Boolean attributes are ideally oriented so that `true` means to do something
and `false` means not to do it; it can be confusing do have "negative" flags
that prevent something from happening, since they require the user to follow
a double-negative in order to reason about what value should be provided.

Some attributes expect list, set or map values. In the above example,
`vpc_security_group_ids` is a set of strings, while `tags` is a map
from strings to strings. Such attributes should be named with *plural* nouns,
to reflect that multiple values may be provided.

List and set attributes use the same bracket syntax, and differ only in how
they are described to and used by the user. In lists, the ordering is
significant and duplicate values are often accepted. In sets, the ordering is
*not* significant and duplicated values are usually *not* accepted, since
presence or absense is what is important.

Map blocks use the same syntax as other configuration blocks, but the keys in
maps are arbitrary and not explicitly named by the plugin, so in some cases
(as in this `tags` example) they will not conform to the usual "lowercase with
underscores" naming convention.

Configuration blocks may contain other sub-blocks, such as `root_block_device`
in the above example. The patterns described above can also apply to such
sub-blocks. Sub-blocks are usually introduced by a singular noun, even if
multiple instances of the same-named block are accepted, since each distinct
instance represents a single object.



## Deprecations, Removals, and Renames

Over time, remote services evolve and better workflows are designed.
Terraform's plugin system has functionality to aid in iterative improvements.
In [Deprecations, Removals, and Renames][deprecations], we cover procedures for
backwards compatible code and documentation updates to ensure that operators
are well informed of changes ahead of functionality being removed or renamed.

## Detecting Drift

Terraform is a declarative tool designed to be the source of truth for
infrastructure. In order to safely and predictably change and iterate
infrastructure, Terraform needs to be able to detect changes made outside of
it's configuration and provide means of reconciliation. In [Detecting
Drift][drift], we cover some best practices to ensure Terraform's statefile is
an accurate reflection of reality, in order to provide accurate plan and apply
functionality.

## Testing Patterns

Terraform developers are encouraged to write acceptance tests that create real
resource to verify the behavior of plugins, ensuring a reliable and safe
way to manage infrastructure. In [Testing Patterns][testing-patterns] we cover
some basic acceptance tests that almost all resources should have to validate
not only the functionality of the resource, but that the resource behaves as
Terraform would expect a resource to behave.

## Versioning and Changelog

Terraform development serves two distinct audiences: those writing plugin code
and those implementing them. By clearly and consistently allowing operators to
easily understand changes in plugin implementation via version numbering and
documenting those changes, a trust is formed between the two audiences. In
[Versioning and Changelog][versioning] we cover some guidelines when deciding
release versions and how to relay changes through documentation.

[deprecations]: /docs/extend/best-practices/deprecations.html
[drift]: /docs/extend/best-practices/detecting-drift.html
[testing-patterns]: /docs/extend/best-practices/testing.html
[versioning]: /docs/extend/best-practices/versioning.html
