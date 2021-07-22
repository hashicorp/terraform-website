---
layout: "extend"
page_title: "Plugin Development - Framework: Errors and Warnings"
description: |-
  How to return errors and warnings from the Terraform provider development
  framework.
---

# Returning Errors and Warnings

It would be nice if things always worked, but that's rarely the case. Providers
often find that they need to tell the practitioner about something that went
wrong. Terraform's abstraction for this is called a "diagnostic", and it's a
powerful tool for surfacing information to practitioners.

In the provider development framework, diagnostics are often found in response
structs or as returns from functions or methods:

```go
func (m myResource) Create(ctx context.Context, req tfsdk.CreateResourceRequest, resp *tfsdk.CreateResourceResponse)
```

This is the most common form for Diagnostics: a slice that has one or more errors appended to it. This approach allows your provider to inform practitioners about all relevant errors and warnings at the same time, allowing practitioners to fix their configuration or environment more quickly. You should only append to Diagnostics slices and never replace or remove information from them.

~> **Important:** The design of diagnostics is expected to change to something
less verbose in the near future.
## Diagnostic Properties
### Severity

Required

`Severity` specifies whether the diagnostic is an error or a warning.  

- An **error** will be displayed to the practitioner and halt Terraform's execution,
not continuing to apply changes to later resources in the graph. We recommend using errors to inform practitioners about a situation
the provider could not recover from.
- A **warning** will be displayed to the practitioner, but will not halt further execution, and is considered informative only. We recommend using warnings to inform practitioners about suboptimal situations that the practitioner should resolve to ensure stable functioning (e.g., deprecations) or to inform practitioners about possible unexpected behaviors.

### Summary

Required

`Summary` is a short, practitioner-oriented description of the problem. Good summaries are general&mdash;they don't contain specific details about values&mdash;and concise. For example, "Error creating resource", "Invalid value for foo", or "Field foo is deprecated".

### Detail

Required

`Detail` is a longer, more specific practitioner-oriented description of
precisely what went wrong. Good details are specific&mdash;they tell the
practitioner exactly what they need to fix and how. For example, "The API
is currently unavailable, please try the request again.", "foo can only contain
letters, numbers, and digits.", or "foo has been deprecated in favor of bar.
Please update your configuration to use bar instead. foo will be removed in a
future release.".

### Attribute

Optional

`Attribute` identifies the specific part of a configuration that caused the error or warning. If no specific part is the cause, don't set an `Attribute`.

~> **Important:** Specifying attribute paths is currently a rather verbose
process. The design for specifying attribute paths is evolving, and a revamped
interface is expected in the near future.

## How Errors Affect State

**Returning an error diagnostic does not stop the state from being updated**. Terraform will still persist the
returned state even when an error diagnostic is returned with it. This is to allow Terraform to persist the values that have already been modified when a resource modification requires multiple API requests or an API
request fails after an earlier one succeeded.

When returning error diagnostics, we recommend resetting the state in the response to the prior state available in the configuration.
