---
layout: "extend"
page_title: "Resources - Guides"
sidebar_current: "docs-extend-resources"
description: |-
  Resources are a key component to provider development. This guide covers using advanced resource APIs.
---

# Resources

A key component to Provider development is defining a resource. Aspects of this component have already been covered in [Writing Custom Providers](/docs/extend/writing-custom-providers.html) and [Schemas](/docs/extend/schemas/), this document will cover the other features of `schema.Resource`.

## Table of Contents

- [State Migrations](#state-migrations)
- [Retry Helpers](#retry-helpers)
  - [Retry](#retry)
  - [StateChangeConf](#statechangeconf)
- [Importers](#importers)
- [Customizing Differences](#customizing-differences)

## State Migrations

Resources define the data types and API interactions required to create, update, and destroy infrastructure with a cloud vendor while the [Terraform state](/docs/state/index.html) stores mapping and metadata information for those remote objects. There are several reasons why a resource implementation needs to change: backend APIs Terraform interacts with will change overtime, or the current implementation might be incorrect or unmaintainable. Some of these changes may not be backward compatible and a migration is needed for resources provisioned in the wild with old schema configurations.

The mechanism that is used for state migrations changed between v0.11 and v0.12 of the SDK bundled with Terraform core. Be sure to choose the method that matches your Terraform dependency.

### Terraform v0.12 SDK State Migrations

~> *NOTE:* This method of state migration does not work if the provider has a dependency on the Terraform v0.11 SDK. See the [Terraform v0.11 SDK State Migrations](#terraform-v0-11-sdk-state-migrations) section for details on using `MigrateState` instead.

For this task provider developers should use a resource's `SchemaVersion` and `StateUpgraders` fields. Resources typically do not have these fields configured unless state migrations have been perfomed in the past.

When Terraform encounters a newer resource `SchemaVersion` during planning, it will automatically migrate the state through each `StateUpgrader` function until it matches the current `SchemaVersion`.

State migrations performed with `StateUpgraders` are compatible with the Terraform 0.11 runtime, if the provider still supports the Terraform 0.11 protocol. Additional `MigrateState` implementation is not necessary and any existing `MigrateState` implementations do not need to be converted to `StateUpgraders`.

The general overview of this process is:

- Create a new function that copies the existing `schema.Resource`, but only includes the `Schema` field. Terraform needs the type information of each attribute in the previous schema version to successfully migrate the state.
- Change the existing resource `Schema` as necessary.
- If the `SchemaVersion` field for the resource is already defined, increase its value by one. If `SchemaVersion` is not defined for the resource, add `SchemaVersion: 1` to the resource (resources default to `SchemaVersion: 0` if undefined).
- Implement the `StateUpgraders` field for the resource, which is a list of `StateUpgrade`. The new `StateUpgrade` should be configured with the following:
  - `Type` set to `CoreConfigSchema().ImpliedType()` of the saved `schema.Resource` function above.
  - `Upgrade` set to a function that modifies the attribute(s) appropriately for the migration.
  - `Version` set to the version of the schema before this migration. If no previous state migrations were performed, this should be set to `0`.

For example, with a resource without previous state migrations:

```go
package example

import "github.com/hashicorp/terraform/helper/schema"

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
    }
}
```

Say the `instance` resource API now requires the `name` attribute to end with a period `"."`

```go
package example

import (
    "fmt"
    "strings"

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
                ValidateFunc: func(v interface{}, k string) (warns []string, errs []error) {
                    if !strings.HasSuffix(v.(string), ".") {
                        errs = append(errs, fmt.Errorf("%q must end with a period '.'", k))
                    }
                    return
                },
            },
        },
        SchemaVersion: 1,
        StateUpgraders: []schema.StateUpgrader{
            {
                Type:    resourceExampleInstanceResourceV0().CoreConfigSchema().ImpliedType(),
                Upgrade: resourceExampleInstanceStateUpgradeV0,
                Version: 0,
            },
        },
    }
}

func resourceExampleInstanceResourceV0() *schema.Resource {
    return &schema.Resource{
        Schema: map[string]*schema.Schema{
            "name": {
                Type:     schema.TypeString,
                Required: true,
            },
        },
    }
}

func resourceExampleInstanceStateUpgradeV0(rawState map[string]interface{}, meta interface{}) (map[string]interface{}, error) {
    rawState["name"] = rawState["name"] + "."

    return rawState, nil
}
```

To unit test this migration, the following can be written:

```go
func testResourceExampleInstanceStateDataV0() map[string]interface{} {
    return map[string]interface{}{
        "name": "test",
    }
}

func testResourceExampleInstanceStateDataV1() map[string]interface{} {
    v0 := testResourceExampleInstanceStateDataV0()
    return map[string]interface{}{
        "name": v0["name"] + ".",
    }
}

func TestResourceExampleInstanceStateUpgradeV0(t *testing.T) {
    expected := testResourceExampleInstanceStateDataV1()
    actual, err := resourceExampleInstanceStateUpgradeV0(testResourceExampleInstanceStateDataV0(), nil)
    if err != nil {
        t.Fatalf("error migrating state: %s", err)
    }

    if !reflect.DeepEqual(expected, actual) {
        t.Fatalf("\n\nexpected:\n\n%#v\n\ngot:\n\n%#v\n\n", expected, actual)
    }
}
```

### Terraform v0.11 SDK State Migrations

~> *NOTE:* This method of state migration does not work if the provider has a dependency on the Terraform v0.12 SDK.  See the [Terraform v0.11 SDK State Migrations](#terraform-v0-11-sdk-state-migrations) section for details on using `StateUpgraders` instead.

For this task provider developers should use a resource's `SchemaVersion` and `MigrateState` function. Resources do not have these options set on first implementation, the `SchemaVersion` defaults to `0`.

```go
package example

import "github.com/hashicorp/terraform/helper/schema"

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
    }
}
```

Say the `instance` resource API now requires the `name` attribute to end with a period `"."`

```go
package example

import (
    "fmt"
    "strings"

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
                ValidateFunc: func(v interface{}, k string) (warns []string, errs []error) {
                    if !strings.HasSuffix(v.(string), ".") {
                        errs = append(errs, fmt.Errorf("%q must end with a period '.'", k))
                    }
                    return
                },
            },
        },
        SchemaVersion: 1,
        MigrateState: resourceExampleInstanceMigrateState,
    }
}
```

To trigger the migration we set the `SchemaVersion` to `1`. When Terraform saves state it also sets the `SchemaVersion` at the time, that way when differences are calculated, if the saved `SchemaVersion` is less than what the Resource is currently set to, the state is run through the `MigrateState` function.

```go
func resourceExampleInstanceMigrateState(v int, inst *terraform.InstanceState, meta interface{}) (*terraform.InstanceState, error) {
    switch v {
    case 0:
        log.Println("[INFO] Found Example Instance State v0; migrating to v1")
        return migrateExampleInstanceStateV0toV1(inst)
    default:
        return inst, fmt.Errorf("Unexpected schema version: %d", v)
    }
}

func migrateExampleInstanceStateV0toV1(inst *terraform.InstanceState) (*terraform.InstanceState, error) {
    if inst.Empty() {
        log.Println("[DEBUG] Empty InstanceState; nothing to migrate.")
        return inst, nil
    }

    if !strings.HasSuffix(inst.Attributes["name"], ".") {
        log.Printf("[DEBUG] Attributes before migration: %#v", inst.Attributes)
        inst.Attributes["name"] = inst.Attributes["name"] + "."
        log.Printf("[DEBUG] Attributes after migration: %#v", inst.Attributes)
    }

    return inst, nil
}
```

Although not required, it's a good idea to break the migration function up into version jumps. As the provider developer you will have to account for migrations that are larger than one version upgrade, using the switch/case pattern above will allow you to create codepaths for states coming from all the versions of state in the wild. Please be careful to allow all legacy versions to migrate to the latest schema. Consider the code now where the `name` attribute has moved to an attribute called `fqdn`.

```go
func resourceExampleInstanceMigrateState(v int, inst *terraform.InstanceState, meta interface{}) (*terraform.InstanceState, error) {
    var err error
    switch v {
    case 0:
        log.Println("[INFO] Found Example Instance State v0; migrating to v1")
        inst, err = migrateExampleInstanceV0toV1(inst)
        if err != nil {
            return inst, err
        }
        fallthrough
    case 1:
        log.Println("[INFO] Found Example Instance State v1; migrating to v2")
        return migrateExampleInstanceStateV1toV2(inst)
    default:
        return inst, fmt.Errorf("Unexpected schema version: %d", v)
    }
}

func migrateExampleInstanceStateV1toV2(inst *terraform.InstanceState) (*terraform.InstanceState, error) {
    if inst.Empty() {
        log.Println("[DEBUG] Empty InstanceState; nothing to migrate.")
        return inst, nil
    }

    if inst.Attributes["name"] != "" {
        inst.Attributes["fqdn"] = inst.Attributes["name"]
        delete(inst.Attributes, "name")
    }
    return inst, nil
}
```

The fallthrough allows a very old state to move from 0 to 1 and now to 2. Sometimes state migrations are more complicated, and requires making API calls, to allow this the configured `meta interface{}` is also passed to the `MigrateState` function.

## Retry Helpers

The reality of cloud infrastructure is that it typically takes time to do things like boot operating systems, discover services, and replicate state across network edges. As the provider developer you should take known delays in resource APIs into account in the CRUD functions of the resource. Terraform supports configurable timeouts to assist in these situations.

```go
package example

import (
    "fmt"

    "github.com/hashicorp/terraform/helper/resource"
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
        Timeouts: &schema.ResourceTimeout{
            Create: schema.DefaultTimeout(45 * time.Minute),
        },
    }
}
```

In the above example we see the usage of the timeouts in the schema being configured for what is deemed the appropriate amount of time for the `Create` function. `Read`, `Update`, and `Delete` are also configurable as well as a `Default`. These configured timeouts can be fetched later in the CRUD functions from the passed in `*schema.ResourceData`.

### Retry

A common case for requiring retries or polling is when the backend infrastructure being provisioned is designed to be asynchronous, requiring the developer to repeatedly check the status of the resource. The retry helper takes a timeout and a function that is retried repeatedly. The timeout can be retrieved from the `*schema.ResourceData` struct, using the `Timeout` method, passing in the appropriate timeout key (`scheme.TimeoutCreate`). The retry function provided should return either a `resource.NonRetryableError` for unexpected errors or states, otherwise continue to retry with a `resource.RetryableError`. In the context of a `CREATE` function, once the backend responds with the desired state, finish the function with a `resource.NonRetryableError` wrapping the `READ` function (anything that goes wrong in there is considered unexpected).

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

        return resource.NonRetryableError(resourceExampleInstanceRead(d, meta))
    })
}
```

### StateChangeConf

`resource.Retry` is useful for simple scenarios, particularly when the API response is either success or failure, but sometimes handling an APIs latency or eventual consistency requires more fine tuning. `resource.Retry` is in fact a wrapper for a another helper: `resource.StateChangeConf`.

Use `resource.StateChangeConf` when your resource has multiple states to progress though, you require fine grained control of retry and delay timing, or you want to ensure a minimum number of occurrences of a target state is reached (this is very common when dealing with eventually consistent APIs, where a response can reply back with an old state between calls before becoming consistent).

```go
func resourceExampleInstanceCreate(d *schema.ResourceData, meta interface{}) error {
    name := d.Get("name").(string)
    client := meta.(*ExampleClient)
    resp, err := client.CreateInstance(name)

    createStateConf := &resource.StateChangeConf{
        Pending: []string{
            client.ExampleInstaceStateRequesting,
            client.ExampleInstaceStatePending,
            client.ExampleInstaceStateCreating,
            client.ExampleInstaceStateVerifying,
        },
        Target: []string{
            client.ExampleInstaceStateCreateComplete,
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

## Importers

Many users migrating to Terraform often have manually managed infrastructure they want to bring under the management of Terraform. Terraform provides a mechanism known as an importer to consolidate those resources into state. As of writing the user will still have to write configuration that will be associated to the import.

When importing the user will specify the configuration address and id of the resource

```
terraform import example_instance.foo 000-0000
```

A resources `READ` function will perform a lookup based on the configured `id`. To support this Terraform provides a convenience that allows this passthrough.

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

## Customizing Differences

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
