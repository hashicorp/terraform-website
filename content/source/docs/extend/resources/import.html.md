---
layout: "extend"
page_title: "Resources - Import"
sidebar_current: "docs-extend-resources-import"
description: |-
  Implementing resource import support.
---

# Resources - Import

Many users migrating to Terraform often have manually managed infrastructure they want to bring under the management of Terraform. Terraform provides a mechanism known as an importer to consolidate those resources into state.

~> **Note:** Operators are responsible for writing the appropriate configuration that will be associated with the resource import. This restriction may be removed in a future version of Terraform.

When importing, the user will specify the configuration address and id of the resource:

```
terraform import example_instance.foo 000-0000
```

A resource's `READ` function will perform a lookup based on the configured `id`. As a convenience, Terraform provides a `schema.ImportStatePassthrough` importer that just uses the read function. 

```go
package example

import (
    "fmt"

    "github.com/hashicorp/terraform/helper/schema"
)

func resourceExampleInstance() *schema.Resource {
    return &schema.Resource{
        Create: resourceExampleInstanceCreate,
        Read:   resourceExampleInstanceRead,
        Update: resourceExampleInstanceUpdate,
        Delete: resourceExampleInstanceDelete,

        Schema: map[string]*schema.Schema{
            "name": {
                Type:     schema.TypeString,
                Required: true,
            },
        },
        Importer: &schema.ResourceImporter{
            State: schema.ImportStatePassthrough,
        },
    }
}

func resourceExampleInstanceRead(d *schema.ResourceData, meta interface{}) error {
    client := m.(*MyClient)

    obj, err := client.Get(d.Id())

    if err != nil {
        d.SetId("")
        return fmt.Errorf("Error retrieving example instance: %s: %s", d.Id(), err)
    }

    d.Set("name", obj.Name)
    return nil
}
```

There are other cases where the `READ` function uses configuration parameters as the identifier or support for importing multiple resources, as seen in the [AWS Provider](https://github.com/terraform-providers/terraform-provider-aws/blob/d3fe7e9907263b1aa41ddc0736a34b42899d1536/aws/import_aws_dx_gateway.go#L12) is needed. In general it is advised to stick to the passthrough importer when possible.
