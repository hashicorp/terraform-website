---
layout: "extend"
page_title: "Resources - Retries and Customizable Timeouts"
sidebar_current: "docs-extend-resources-retry-helpers"
description: |-
  Helpers for handling retries within Resources.
---

# Resources - Retries and Customizable Timeouts

The reality of cloud infrastructure is that it typically takes time to perform operations such as booting operating systems, discovering services, and replicating state across network edges. As the provider developer you should take known delays in resource APIs into account in the CRUD functions of the resource. Terraform supports configurable timeouts to assist in these situations.

```go
package example

import (
    "fmt"

    "github.com/hashicorp/terraform-plugin-sdk/helper/resource"
    "github.com/hashicorp/terraform-plugin-sdk/helper/schema"
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
        Timeouts: &schema.ResourceTimeout{
            Create: schema.DefaultTimeout(45 * time.Minute),
        },
    }
}
```

In the above example we see the usage of the timeouts in the schema being configured for what is deemed the appropriate amount of time for the `Create` function. `Read`, `Update`, and `Delete` are also configurable as well as a `Default`. These configured timeouts can be fetched later in the CRUD functions from the passed in `*schema.ResourceData`.

## Retry

The retry helper takes a timeout and a retry function. 

- The **timeout** value specifies the maximum time Terraform will invoke the retry function. You can retrieve the timeout from the `*schema.ResourceData` struct by passing the timeout key (`schema.TimeoutCreate`) to the `Timeout` method.
- The **retry function** returns either a `resource.NonRetryableError` for unexpected errors/states or a `resource.RetryableError` for expected errrors/states. If the function returns a `resource.RetryableError`, it will re-run the function.

In the context of a `CREATE` function, once the backend responds with the desired state, invoke the `READ` function. If `READ` errors, return that error wrapped with `resource.NonRetryableError`. Otherwise, return `nil` (no error) from the retry function.

```go
func resourceExampleInstanceCreate(d *schema.ResourceData, meta interface{}) error {
    name := d.Get("name").(string)
    client := meta.(*ExampleClient)
    resp, err := client.CreateInstance(name)

    if err != nil {
        return fmt.Errorf("Error creating instance: %s", err)
    }

    return resource.Retry(d.Timeout(schema.TimeoutCreate), func() *resource.RetryError {
        resp, err := client.DescribeInstance(name)

        if err != nil {
            return resource.NonRetryableError(fmt.Errorf("Error describing instance: %s", err))
        }

        if resp.Status != "CREATED" {
            return resource.RetryableError(fmt.Errorf("Expected instance to be created but was in state %s", resp.Status))
        }

        err = resourceExampleInstanceRead(d, meta)
        if err != nil {
            return resource.NonRetryableError(err)
        } else {
            return nil
        }
    })
}
```

## StateChangeConf

`resource.Retry` is useful for simple scenarios, particularly when the API response is either success or failure, but sometimes handling an APIs latency or eventual consistency requires more fine tuning. `resource.Retry` is in fact a wrapper for a another helper: `resource.StateChangeConf`.

Use `resource.StateChangeConf` when your resource has multiple states to progress though, you require fine grained control of retry and delay timing, or you want to ensure a minimum number of occurrences of a target state is reached (this is very common when dealing with eventually consistent APIs, where a response can reply back with an old state between calls before becoming consistent).

```go
func resourceExampleInstanceCreate(d *schema.ResourceData, meta interface{}) error {
    name := d.Get("name").(string)
    client := meta.(*ExampleClient)
    resp, err := client.CreateInstance(name)

    createStateConf := &resource.StateChangeConf{
        Pending: []string{
            client.ExampleInstanceStateRequesting,
            client.ExampleInstanceStatePending,
            client.ExampleInstanceStateCreating,
            client.ExampleInstanceStateVerifying,
        },
        Target: []string{
            client.ExampleInstanceStateCreateComplete,
        },
        Refresh: func() (interface{}, string, error) {
            resp, err := client.DescribeInstance(name)
            if err != nil {
                0, "", err
            }
            return resp, resp.Status, nil
        },
        Timeout:    d.Timeout(schema.TimeoutCreate),
        Delay:      10 * time.Second,
        MinTimeout: 5 * time.Second,
        ContinuousTargetOccurence: 5,
    }
    _, err = createStateConf.WaitForState()
    if err != nil {
        return fmt.Errorf("Error waiting for example instance (%s) to be created: %s", d.Id(), err)
    }

    return resourceExampleInstanceRead(d, meta)
}
```
