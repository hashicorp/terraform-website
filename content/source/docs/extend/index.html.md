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
or the [cloud-init provider](https://registry.terraform.io/providers/hashicorp/cloudinit/latest/docs). Terraform handles the the network communication and RPC automatically, so you can focus on the implementation of your specific plugin.

Terraform currently supports one type of Plugin called [providers](/docs/language/providers/index.html).

## Get Started
- [How Terraform Works With Plugins](/docs/extend/how-terraform-works.html)
- [Call APIs with Terraform Providers](https://learn.hashicorp.com/collections/terraform/providers?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorials on HashiCorp Learn.

## Develop Plugins
- [HashiCorp Provider Design Principles](/docs/extend/hashicorp-provider-design-principles.html)
- [SDKv2](/docs/extend/hashicorp-provider-design-principles.html) - A tool to help developers write providers for Terraform.  
- [HashiCorp Provider Developer Program](/docs/extend/TBDDDDD)


## Get Support

- Ask questions and learn useful patterns from other plugin developers in the [Terraform Plugin SDK section](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk) of HashiCorp discuss.

- Report bugs to the [Terraform Plugin SDK Issue Tracker](https://github.com/hashicorp/terraform-plugin-sdk/issues). Please only use this to report bugs and ask for help in the HashiCorp portal.
