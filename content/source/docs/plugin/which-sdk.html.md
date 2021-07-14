---
layout: "extend"
page_title: "Home - Plugin Development: Which SDK Should I Use?"
description: |-
  A guide on picking which Terraform plugin development SDK is most appropriate
  for your provider.
---

# Which SDK Should I Use?

Terraform plugin development is in an exciting time of flux, in which there are
multiple SDKs available to build plugins against. The existing
[SDKv2](/docs/extend/index.html) is what the bulk of existing providers are
built on, and continues to provide a stable development experience for
providers to build on. The [next-generation
framework](/docs/plugin/framework/index.html) is a new SDK under heavy
development, realigning the provider development experience and abstractions
around the updated architecture of Terraform. It represents our vision of the
future of Terraform plugin development.

Which leads provider developers to be unsure whether they should stick with
writing providers in the existing, reliable, stable SDKv2, or if they should
prepare for the future by writing providers in the forward-looking
next-generation framework. This guide aims to help provider developers make
that decision.

## Are You Writing a New Provider or Maintaining an Existing Provider?

We currently recommend that maintainers of large existing providers continue
using SDKv2 for future resource and data source development in that provider.
There is a migration story around building some resources of an otherwise-SDKv2
provider using the next-generation framework, but it still needs a little
tweaking. For those feeling adventurous, see
[terraform-plugin-mux](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-mux).

Developers of greenfield providers likely should at least consider building
their provider using the next-generation framework.

## Do You Need to Support Users Not On Terraform v1.0.3 Yet?

Provider developers supporting user bases that have not upgraded to Terraform
v1.0.3 in significant numbers yet may want to hold off on adopting the
next-generation framework. The next-generation framework is built on Terraform
protocol version 6, and Terraform didn't gain the ability to download providers
using Terraform protocol version 6 until Terraform v1.0.3.

For provider developers without an existing user base or with a user base that
has mostly upgraded to v1.0.3, the next-generation framework may be
appropriate.

## Do You Have Bandwidth to Track and Resolve Breaking Changes?

The next-generation framework is still under development and its interfaces may
change as we learn more about how providers are interacting with it. We will
strive to keep these changes as small and as least-disruptive as possible, but
provider developers should understand that they are a possibility with the
framework.

Provider developers that don't have the time, bandwidth, or tolerance for
breaking changes are likely better served by SDKv2 than the next-generation
framework at this time.

## Do You Need More Features Than SDKv2 Provides?

There are several features that SDKv2 doesn't provide that the next-generation
framework surfaces for provider developers. Provider developers that would
benefit from these features should consider whether the framework is an
appropriate choice:

* The ability to tell whether a value was set in the config, the state, or the
  plan.
* The ability to tell whether a value is null, unknown, or the empty value.
* The ability to have structured types like objects.
* The ability to use nested attributes.
* The ability to use any type as the elements of a map.
* The ability to tell when an optional and computed field has been removed from
  a config.

## Do You Need Any Features That the Framework Doesn't Provide (Yet)?

The next-generation framework is still under development, and so some features
that SDKv2 supports the next-generation framework may not support yet. These
include:

* The ability to use sets.
* The ability to import resources.
* The ability to use timeouts.
* The ability to define resource state upgraders.

These features are on our roadmap to implement and support, but if you need
them _today_, SDKv2 may be a better choice.

## Can't I Just Wait Until the Framework Is Stable?

Knowing that the next-generation framework doesn't have as strong a
compatibility guarantee as SDKv2 does makes it tempting to just wait until it
matures to the point that it does. This is a reasonable and understandable
position for provider developers to take. But one of the things we're waiting
for before adopting a stronger backwards compatibility guarantee for the
next-generation framework is for it to have more mileage being used in more
providers of varying types. SDKv2 has over a thousand providers built on it,
and so we're confident in its interfaces; we want that confidence that the
next-generation framework's interfaces will serve various API patterns well.
And while we aren't waiting for a thousand providers to be built on the
framework to commit to its interfaces, community adoption is one of the things
we're looking for before making that commitment. So we're hoping that provider
developers that are able to will help us put some mileage on these interfaces,
building confidence that they are appropriate for the next thousand Terraform
providers.
