---
layout: "extend"
page_title: "Terraform custom plugin path"
sidebar_current: "custom-plugin-path"
description: |-
  How to use custom plugin locally 
---

# Terraform custom plugin path

When Terraform can't download the provider from the Terraform Registry 
(for example if the provider is local, or because of firewall restrictions), 
you can specify the installation method configuration explicitly. Otherwise, 
Terraform will implicitly attempt to find the provider locally in the appropriate 
subdirectory within the user plugins directory.

Default plugin path is

`~/.terraform.d/plugins/${host_name}/${namespace}/${type}/${version}/${target}`

So, when source is defined like `source = "localproviders/myname/myplugin"`

the custom plugin binary path is

`~/.terraform.d/plugins/localproviders/myname/myplugin/0.1.2/linux_amd64/terraform-provider-myplugin_v0.1.2`

Example code for main.tf:

```hcl
terraform {
  required_providers {
    myplugin = {
      source = "localproviders/myname/myplugin"
    }
  }
}
```

And for any of the sources

`source = "registry.terrafrorm.io/myname/myplugin"`

`source = "myname/myplugin"`

`source = "myplugin"`

path is 

`~/.terraform.d/plugins/registry.terrafrorm.io/myname/myplugin/0.1.2/linux_amd64/terraform-provider-myplugin_v0.1.2`

Example code for main.tf:

```hcl
terraform {
  required_providers {
    myplugin = {
      source = "myplugin"
    }
  }
}
```

