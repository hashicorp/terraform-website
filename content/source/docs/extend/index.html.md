---
layout: "extend"
page_title: "Home - Plugin Development"
description: |-
  Learn about developing plugins that connect Terraform to external services.
---

# Plugin Development
Terraform is logically split into two main parts:

- **Terraform Core**: This is the Terraform binary that communicates with plugins to manage infrastructure resources. It provides a common interface that allows you to leverage many different cloud providers, databases, services, and in-house solutions.
- **Terraform Plugins**: These are executable binaries written in Go that communicate with Terraform Core over an RPC interface. Each plugin exposes an implementation for a specific service, such as the [AWS provider](https://registry.terraform.io/providers/hashicorp/aws/latest)
or the [cloud-init provider](https://registry.terraform.io/providers/hashicorp/cloudinit/latest/docs).

Terraform currently supports one type of Plugin called [providers](/docs/language/providers/index.html).

## Get Started
- Learn more about [how Terraform Core interacts with plugins](/docs/extend/how-terraform-works.html).
- Learn the [design principles](/docs/extend/hashicorp-provider-design-principles.html) HashiCorp developers follow when creating providers.
- Decide [which SDK](/docs/plugin/which-sdk.html) is right for your provider.
- Try these hands-on tutorials on HashiCorp Learn: [Call APIs with Terraform Providers (SDKv2)](https://learn.hashicorp.com/collections/terraform/providers?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) and [Implement Create and Read (Framework)](https://learn.hashicorp.com/tutorials/terraform/plugin-framework-create?in=terraform/providers)

## Develop and Share Providers
- Learn more about **how to use SDKv2** to develop providers. This includes details about how to define attributes and behaviors using [schemas](/docs/extend/schemas/index.html), [develop resources](/docs/extend/resources/index.html), [debug providers](/docs/extend/debugging.html), and [test plugins](/docs/extend/testing/index.html).
- Learn more about **how to use the [framework](/docs/plugin/framework/index.html)** to develop providers. This includes details about how to define attributes and behaviors using [schemas](/docs/plugin/framework/schemas.html), develop [resources](/docs/plugin/framework/resources.html) and [data sources](/docs/plugin/framework/data-sources.html), and [write tests](/docs/plugin/framework/acctests.html).
- [Publish your provider on the Terraform Registry](/docs/registry/index.html) to make it publicly available.   
- Get HashiCorp to [officially approve and verify](/guides/terraform-provider-development-program.html) your provider. Verified providers get a special badge on the Terraform Registry.


## Get Support

- Ask questions and learn useful patterns in the [Terraform Providers section](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43) of HashiCorp discuss.

- Report bugs to the [Terraform Plugin SDK Issue Tracker](https://github.com/hashicorp/terraform-plugin-sdk/issues).


