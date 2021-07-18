---
layout: "extend"
page_title: "Plugin Development - Framework: Errors and Warnings"
description: |-
  How to return errors and warnings from the next-generation Terraform provider
  development framework.
---

# Returning Errors and Warnings

It would be nice if things always worked, but that's rarely the case. Providers
often find that they need to tell the practitioner about something that went
wrong. Terraform's abstraction for this is called a "diagnostic", and it's a
powerful tool for surfacing information to practitioners.

In the next-generation provider development framework, diagnostics are often
found in response structs or as returns from functions or methods:

```go
func (m myResource) Create(ctx context.Context, req tfsdk.CreateResourceRequest, resp *tfsdk.CreateResourceResponse)
```

In this example, `resp` has a `Diagnostics` property on it, containing a slice
of
[`*tfprotov6.Diagnostics`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-go/tfprotov6#Diagnostic).
This is almost always how you'll encounter diagnostics, as a slice that gets
appended to. This allows providers to inform practitioners about as many errors
and warnings as they've discovered, instead of just picking one, allowing
practitioners to need fewer modifications of their configuration or environment
to get things working again.

Diagnostics slices should always be appended to, never replaced or removed
from.

~> **Important:** The design of diagnostics is expected to change to something
less verbose in the near future.

## Severity

The `Diagnostic` type has a required `Severity` property on it, allowing the
provider developer to specify whether the diagnostic is an error or a warning.
An error will be displayed to the practitioner and halt Terraform's execution,
not continuing to apply changes to later resources in the graph. A warning will
be displayed to the practitioner, but will not halt further execution, and is
considered informative only.

It is recommended that errors be used to inform practitioners about a situation
the provider could not recover from, and that warnings be used to inform
practitioners about suboptimal situations that the provider can recover from
but which the practitioner should resolve to ensure stable functioning (e.g.,
deprecations) or to inform practitioners about potentially-unexpected
behaviors.

## Summary

The summary is a short, practitioner-oriented description of the general
problem that was encountered. Good summaries are general&mdash;they don't
contain specific details about values&mdash;and concise. For example, "Error
creating resource", "Invalid value for foo", or "Field foo is deprecated".

## Detail

The detail is a longer, more specific practitioner-oriented description of
precisely what went wrong. Good details are specific&mdash;they tell the
practitioner exactly what needs fixing, and ideally how. For example, "The API
is currently unavailable, please try the request again.", "foo can only contain
letters, numbers, and digits.", or "foo has been deprecated in favor of bar.
Please update your configuration to use bar instead. foo will be removed in a
future release.".

## Attribute

The `Attribute` property of the `Diagnostic` type is the only optional property
on the struct, and is used to identify the specific part of a configuration
that caused the error or warning to be returned. If no specific part is the
cause, don't set an `Attribute`. Otherwise, setting the `Attribute` points the
practitioner to precisely what needs fixing.

~> **Important:** Specifying attribute paths is currently a rather verbose
process. The design for specifying attribute paths is evolving, and a revamped
interface is expected in the near future.

## What Happens to State When Errors Are Returned?

Response types can contain both the state and diagnostics, and so it's not
clear what happens to the state when error diagnostics are returned. Provider
developers may be surprised to learn that **returning an error diagnostic does
not stop the state from being updated**. Terraform will still persist the
returned state even when an error diagnostic is returned with it. This is to
allow Terraform to persist the values that have already been modified in the
case of a resource modification requiring multiple API requests, and an API
request failing after an earlier one succeeded.

As a general rule of thumb, provider developers probably want to default to
resetting the state in the response to the prior state available in the
configuration when returning error diagnostics.
