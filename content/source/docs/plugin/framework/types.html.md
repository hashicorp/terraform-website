---
layout: "extend"
page_title: "Plugin Development - Framework: Attribute Types"
description: |-
  A guide to the different attribute types available in the provider
  development framework, and how to make your own.
---

# Attribute Types

Attributes are the fields in a resource, data source, or provider. They hold
the values that end up in state. Every attribute has an attribute type, which
describes the constraints on the data the attribute can hold. When accessing an
attribute from the configuration, state, or plan, provider developers are
accessing attribute values, which are the actual data that was found in the
configuration, state, or plan.

The provider development framework separates these two concepts, and allows
provider developers to implement their own attribute types and attribute
values. It also has a built-in suite of generic attribute type and attribute
value implementations that a provider developer can use.

## Unknown and Null

There are two values every attribute in Terraform can hold, regardless of their
type: null and unknown.

### Null

Null is used to represent the absence of a Terraform value. It is usually
encountered with optional attributes that the practitioner neglected to specify
a value for, but can show up on any non-required attribute. Required attributes
can never be null.

### Unknown

Unknown is used to represent a Terraform value that is not yet known. Terraform
uses a graph of providers, resources, and data sources to do things in the
right order, and when a provider, resource, or data source relies on a value
from another provider, resource, or data source that has not been resolved yet,
it represents that state by using the unknown value. For example:

```tf
resource "example_foo" "bar" {
  hello = "world"
  demo = true
}

resource "example_baz" "quux" {
  foo_id = example_foo.bar.id
}
```

In the example above, `example_baz.quux` is relying on the `id` attribute of
`example_foo.bar`. The `id` attribute of `example_foo.bar` isn't known until
it's created, after the apply. The plan would list it as `(known after apply)`.
During the plan phase, `example_baz.quux` would get an unknown value as the
value for `foo_id`.

Because they can result from interpolations in the practitioner's config,
provider developers have no control over what attributes may contain an unknown
value. By the time a resource is expected to be created, read, updated, or
deleted, however, only its computed attributes can be unknown, the rest are
guaranteed to have known values (or be null).

Provider configuration values can be unknown, and providers should handle that
situation, even if that means just returning an error.

## Built-In Types and Values

The provider development framework provides a built-in collection of generic
attribute type and attribute value implementations in the
[`types`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/types)
package.

### StringType and String

Strings are a UTF-8 encoded collection of bytes.

```tf
hello = "world"
```

They are used by specifying the `types.StringType` constant in your
`schema.Attribute`'s `Type` property, and are represented by a `types.String`
struct in config, state, and plan. The `types.String` struct has the following
properties:

* `Value` contains the string's value as a Go `string` type.
* `Null` is set to `true` when the string's value is null.
* `Unknown` is set to `true` when the string's value is unknown.

### NumberType and Number

Numbers are numeric values, both whole values like `12` or fractional values
like `3.14`.

```tf
hello = 123
```

They are used by specifying the `types.NumberType` constant in your
`schema.Attribute`'s `Type` property, and are represented by a `types.Number`
struct in config, state, and plan. The `types.Number` struct has the following
properties:

* `Value` contains the number's value as a Go
  [`*big.Float`](https://golang.org/pkg/math/big#Float) type.
* `Null` is set to `true` when the number's value is null.
* `Unknown` is set to `true` when the number's value is unknown.

### BoolType and Bool

Bools are boolean values that can either be true or false.

```tf
hello = true
```

They are used by specifying the `types.BoolType` constant in your
`schema.Attribute`'s `Type` property, and are represented by a `types.Bool`
struct in config, state, and plan. The `types.Bool` struct has the following
properties:

* `Value` contains the boolean's value as a Go `bool` type.
* `Null` is set to `true` when the boolean's value is null.
* `Unknown` is set to `true` when the boolean's value is unknown.

### ListType and List

Lists are ordered collections of other types. Their elements, the values inside
the list, must all be of the same type.

```tf
hello = ["red", "blue", "green"]
```

They are used by specifying a `types.ListType` value in your
`schema.Attribute`'s `Type` property. You must specify an `ElemType` property
for your list, indicating what type the elements should be. Lists are
represented by a `types.List` struct in config, state, and plan. The
`types.List` struct has the following properties:

* `ElemType` will always contain the same type as the `ElemType` property of
  the `types.ListType` that created the `types.List`.
* `Elem` contains a list of values, one for each element in the list. The
  values will all be of the value type produced by the `ElemType` for the list.
* `Null` is set to `true` when the entire list's value is null. Individual
  elements may still be null even if the list's `Null` property is `false`.
* `Unknown` is set to `true` when the entire list's value is unknown.
  Individual elements may still be unknown even if the list's `Unknown`
  property is `false`.

Elements of a `types.List` with a non-null, non-unknown value can be accessed
without using type assertions by using the `types.List`'s [`ElementsAs`
method](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/types#List.ElementsAs),
which uses the same conversion rules as the `Get` methods described in [Access
State, Config, and Plan](/docs/plugin/framework/accessing-values.html).

### MapType and Map

Maps are unordered collections of other types with unique string indexes.
Their elements, the values inside the map, must all be of the same type, and
the keys used to index the elements must be strings, but there are
(theoretically) no limitations on what keys are acceptable or how many there
can be.

```tf
hello = {
  pi = 3.14
  random = 4
  "meaning of life" = 42
}
```

They are used by specifying a `types.MapType` value in your
`schema.Attribute`'s `Type` property. You must specify an `ElemType` property
for your map, indicating what type the elements should be. Maps are
represented by a `types.Map` struct in config, state, and plan. The
`types.Map` struct has the following properties:

* `ElemType` will always contain the same type as the `ElemType` property of
  the `types.MapType` that created the `types.Map`.
* `Elem` contains a map of values, one for each element in the map. The keys
  will be the keys defined in the config, state, or plan, and the values will
  all be of the value type produced by the `ElemType` for the map.
* `Null` is set to `true` when the entire map's value is null. Individual
  elements may still be null even if the map's `Null` property is `false`.
* `Unknown` is set to `true` when the entire map's value is unknown.
  Individual elements may still be unknown even if the map's `Unknown` property
  is `false`.

Elements of a `types.Map` with a non-null, non-unknown value can be accessed
without using type assertions by using the `types.Map`'s [`ElementsAs`
method](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/types#Map.ElementsAs),
which uses the same conversion rules as the `Get` methods described in [Access
State, Config, and Plan](/docs/plugin/framework/accessing-values.html).

### ObjectType and Object

Objects are unordered collections of other types with unique, pre-specified
attributes. The attributes have names represented by strings, and each
attribute can specify its own type, similar to a Go `struct` type. The
attributes and their types are considered part of the object's type; two
objects are not the same type unless they have the same attributes, and those
attributes have the same types.

```tf
hello = {
  pi = 3.14
  demo = true
  color = "red"
}
```

They are used by specifying a `types.ObjectType` value in your
`schema.Attribute`'s `Type` property. You must specify an `AttrTypes` property
for your object, indicating a map of the attribute names and the types of those
attributes. Objects are represented by a `types.Object` struct in config,
state, and plan. The `types.Object` struct has the following properties:

* `AttrTypes` will always contain the same attribute names and associated types
  as the `AttrTypes` property of the `types.ObjectType` that created the
  `types.Object`.
* `Attrs` contains a map of attribute names to values. Each attribute is
  guaranteed to always be present in the map. The values will always be of the
  value type for that attribute in the `AttrTypes` of the object.
* `Null` is set to `true` when the entire object's value is null. Individual
  attributes may still be null even if the object's `Null` property is false.
* `Unknown` is set to `true` when the entire object's value is unknown.
  Individual attributes may still be unknown even if the object's `Unknown`
  property is `false`.

A non-null, non-unknown `types.Object` value can be converted to a Go struct
without using type assertions by using the `types.Object`'s [`As`
method](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/types#Object.As),
which uses the same conversion rules as the `Get` methods described in [Access
State, Config, and Plan](/docs/plugin/framework/accessing-values.html).

## Creating Your Own Types and Values

While the built-in types should be enough for most provider developers to build
with, advanced provider developers may want to build their own attribute value
and attribute type implementations. This allows for providers to bundle
validation, description, and plan customization behaviors together into a
reusable bundle, avoiding duplication or reimplementation and ensuring
consistency.

~> **Important:** Specifying validation and plan customization for attribute
types is not yet supported, limiting their utility. Support is expected in the
near future.

### Implementing the `attr.Type` Interface

The [`attr.Type`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/attr#Type)
is used to implement an attribute type. Its job is to describe to Terraform
what its constraints are and to describe to the framework how to use it to
create new attribute values from the information Terraform supplies.

The `TerraformType` method is expected to return the [`tftypes.Type`
value](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tftypes#Type)
that describes its type constraints. This is how Terraform will know what type
of values it can accept.

The `ValueFromTerraform` method is expected to return an attribute value from
the
[`tftypes.Value`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tftypes#Value)
that Terraform supplies, or to return an error if it cannot. This error should
not be used for validation purposes, and is expected to indicate programmere
error, not practitioner error.

The `Equal` method is expected to return true if the attribute type is
considered equal to the passed attribute type.

Finally, the attribute type must implement the [`tftypes.AttributePathStepper`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tftypes#AttributePathStepper),
so the framework can access element or attribute types using attribute paths.

Attribute types that contain elements of the same type, like maps and lists,
are required to implement the [`attr.TypeWithElementType`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/attr#TypeWithElementType),
which adds `WithElementType` and `ElementType` methods to the `attr.Type`
interface. `WithElementType` must return a copy of the attribute type, but with
its element type set to the passed type. `ElementType` must return the
attribute type's element type.

Attribute types that contain elements of differing types, like tuples, are
required to implement the [`attr.TypeWithElementTypes`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/attr#TypeWithElementTypes),
which adds `WithElementTypes` and `ElementTypes` methods to the `attr.Type`
interface. `WithElementTypes` must return a copy of the attribute type, but
with its element types set to the passed element types. `ElementTypes` must
return the attribute type's element types.

Attribute types that contain attributes, like objects, are required to
implement the [`attr.TypeWithAttributeTypes`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/attr#TypeWithAttributeTypes),
which adds `WithAttributeTypes` and `AttributeTypes` methods to the `attr.Type`
interface. `WithAttributeTypes` must return a copy of the attribute type, but
with its attribute types set to the passed attribute types. `AttributeTypes`
must return the attribute type's attribute types.

### Implementing the `attr.Value` Interface

The [`attr.Value`
interface](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-framework/attr#Value)
is used to implement an attribute value. Its job is to describe to the
framework how to express that attribute value in a way that Terraform will
understand.

#### ToTerraformValue

`ToTerraformValue` returns a Go type that is valid
input for [`tftypes.NewValue`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tftypes#NewValue)
for the `tftypes.Type` specified by the `attr.Type` that creates the
`attr.Value`.

#### Equal

`Equal` returns true if the passed attribute value
should be considered to the attribute value the method is being called on. The
passed attribute value is not guaranteed to be of the same Go type.
