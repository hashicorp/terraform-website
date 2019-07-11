---
layout: "extend"
page_title: "Resources - Customizing Differences"
sidebar_current: "docs-extend-resources-customizing-differences"
description: |-
  Difference customization within Resources.
---

# Resources - Customizing Differences

Terraform tracks the state of provisioned resources in its state file. The user passed configuration is compared against what is in the state file. When there is a detected discrepancy the user is presented with the difference of what is configured versus what is in state. Sometimes these scenarios require special handling, this is where the `CustomizeDiff` function is used. It is passed a `*schema.ResourceDiff`, a structure similar to `schema.ResourceData` but lacking most write functions like `Set`, while introducing new functions that work with the difference such as `SetNew`, `SetNewComputed`, and `ForceNew`.

While any function can be provided for difference customization, it is recommended to try and compose the behavior using the [customdiff](https://godoc.org/github.com/hashicorp/terraform/helper/customdiff) helper package. This will allow for a more declarative configuration; however, it should not be overused, so for highly custom requirements, opt for a tailor-made function.

```go
package example

import (
    "fmt"

    "github.com/hashicorp/terraform/helper/customdiff"
    "github.com/hashicorp/terraform/helper/schema"
)

func resourceExampleInstance() *schema.Resource {
    return &schema.Resource{
        Create: resourceExampleInstanceCreate,
        Read:   resourceExampleInstanceRead,
        Update: resourceExampleInstanceUpdate,
        Delete: resourceExampleInstanceDelete,

        Schema: map[string]*schema.Schema{
            "size": {
                Type:     schema.TypeInt,
                Required: true,
            },
        },
        CustomizeDiff: customdiff.All(
            customdiff.ValidateChange("size", func (old, new, meta interface{}) error {
                // If we are increasing "size" then the new value must be
                // a multiple of the old value.
                if new.(int) <= old.(int) {
                    return nil
                }
                if (new.(int) % old.(int)) != 0 {
                    return fmt.Errorf("new size value must be an integer multiple of old value %d", old.(int))
                }
                return nil
            }),
            customdiff.ForceNewIfChange("size", func (old, new, meta interface{}) bool {
                // "size" can only increase in-place, so we must create a new resource
                // if it is decreased.
                return new.(int) < old.(int)
            }),
       ),
    }
}
```

In this example we use the helpers to ensure the size can only be increased to multiples of the original size, and that if it is ever decreased it forces a new resource. The `customdiff.All` helper will run all the customization functions, collecting any errors as a `multierror`. To have the functions short-circuit on error, please use `customdiff.Sequence`.
