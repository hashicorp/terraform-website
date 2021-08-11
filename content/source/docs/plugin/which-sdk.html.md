---
layout: "extend"
page_title: "Home - Plugin Development: Which SDK Should I Use?"
description: |-
  A guide on picking which Terraform plugin development SDK is most appropriate
  for your provider.
---

# Which SDK Should I Use?

There are two SDKs that you can use to build Terraform providers:

-  [SDKv2](/docs/extend/sdkv2-intro.html) is what the majority of existing providers are built on, and it continues to provide a stable development experience.
- [Terraform Plugin Framework](/docs/plugin/framework/index.html) is a new SDK under active development, realigning the provider development experience and abstractions around the updated architecture of Terraform. It represents our vision of the future of Terraform plugin development.

This guide will help you decide whether you should continue using SDKv2, or begin using the framework.

## Are You Writing a New Provider or Maintaining an Existing Provider?

If you maintain a large existing provider, we recommend that you continue using
SDKv2 to develop new resources and data sources. We are actively working on
[terraform-plugin-mux](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-mux)
support for the framework, which will eventually allow you to use the framework
to build resources into an SDKv2 provider.

If you are developing a greenfield provider, you should consider building it
with the framework.

## Do You Need to Support Users Not On Terraform v1.0.3 Yet?

If you support user bases that have not upgraded to Terraform v1.0.3 in
significant numbers, we recommend that you continue using SDKv2. The framework
is built on Terraform protocol version 6, and Terraform could not download
providers using protocol version 6 until Terraform v1.0.3.

If you do not have a user base or your user base has mostly upgraded to v1.0.3,
the framework may be appropriate.

## Do You Have Bandwidth to Track and Resolve Breaking Changes?

The framework is still under development and its interfaces may change as we
learn more about how providers are interacting with it. We will strive to keep
these changes as small and as minimally disruptive as possible, but they are a
possibility with the framework.

If you don't have the time, bandwidth, or tolerance for breaking changes, we
recommend that you continue using SDKv2.

## Do You Need More Features Than SDKv2 Provides?

The framework provides several features that are not available in SDKv2. You
should consider using the framework if you would benefit from the ability to:

* Tell whether a value was set in the config, the state, or the plan.
* Tell whether a value is null, unknown, or the empty value.
* Have structured types like objects.
* Use nested attributes.
* Use any type as the elements of a map.
* Tell when an optional and computed field has been removed from a config.

## Do You Need Any Features That the Framework Doesn't Provide (Yet)?

The framework is still under development, and so it may not yet support some
features that are available in SDKv2. These include the ability to:

* Validate configurations.
* Modify plans and force resource recreation.
* Use sets.
* Import resources.
* Use timeouts.
* Define resource state upgraders.

These features are on our roadmap to implement and support, but if you need
them _today_, SDKv2 may be a better choice.

## Can't I Just Wait Until the Framework Is Stable?

The framework doesn't have as strong a compatibility guarantee as SDKv2, so you
may be tempted to wait until the framework matures before using it to develop
providers. While this is a reasonable and understandable position, community
adoption is important before we make a stronger backwards compatibility
commitment. SDKv2 has over a thousand providers built on it, so we're confident
in its interfaces. We want to make sure that the framework will also serve
various API patterns well.

So where possible, we are hoping that you will help us exercise the framework,
building confidence that its interfaces are appropriate for the next thousand
Terraform providers. We look forward to your feedback.
