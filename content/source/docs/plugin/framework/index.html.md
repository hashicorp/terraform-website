---
layout: "extend"
page_title: "Home - Plugin Development: Framework"
description: |-
  An overview of terraform-plugin-framework, a next-generation SDK for
  Terraform plugin development.
---

# Next-Generation Plugin Framework

Terraform can be extended to manage infrastructure with
[providers](/docs/providers/index.html)
(containing [resources](/docs/configuration/resources.html)
and/or [data sources](/docs/language/data-sources/index.html)). **Providers**
are a type of Terraform plugin.

~> This is an advanced section! If you are looking for information on using
Terraform with any of the existing plugins, please refer to the
[Docs](/docs/index.html) section of this website.

This section of the documentation contains content for users who wish to use
our next-generation framework to develop their own Terraform providers. For
provider development using version 2 of the Terraform Plugin SDK, please see
[the SDKv2 documentation](/docs/extend/index.html), instead.

The next-generation framework for Terraform plugin development is still early
in its development cycle; it may not support all the features provider
developers are looking for yet, and it can only build providers that require
Terraform v1.0.3 or later to use. It is currently under active development and
its interfaces are currently subject to change. But HashiCorp is developing
providers against it, and we believe it is ready for third party developers to
develop against, as long as they understand its compatibility situation and
current limitations. For more information on whether the next-generation
framework is right for your provider, see [Which SDK Should I
Use?](/docs/plugin/which-sdk.html).
