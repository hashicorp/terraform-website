---
layout: "extend-testing"
page_title: "Extending Terraform - Acceptance Testing: TestCase"
sidebar_current: "docs-extend-testing-acceptance-testcase"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---

# Acceptance Tests: TestCases

Acceptance tests are expressed in terms of **Test Cases**, each using one or
more Terraform configurations designed to create a set of resources under test,
and then verify the actual infrastructure created. Terraform’s `resource`
package offers a method `Test()`, accepting two parameters and acting as the
entry point to Terraform’s acceptance test framework. The first parameter is the
standard [*testing.T struct from Golang’s Testing package][3], and the second is
[TestCase][1], a Go struct that developers use to setup the acceptance tests. 

Here’s an example acceptance test. Here the Provider is named `Example`, and the
Resource under test is `Widget`. The parts of this test are explained below the
example.

```go
package example

// example.Widget represents a concrete Go type that represents an API resource
func TestAccExampleWidget_basic(t *testing.T) {
	var widgetBefore, widgetAfter example.Widget
	rName := acctest.RandStringFromCharSet(10, acctest.CharSetAlphaNum)

	resource.Test(t, resource.TestCase{
		PreCheck:     func() { testAccPreCheck(t) },
		Providers:    testAccProviders,
		CheckDestroy: testAccCheckExampleResourceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccExampleResource(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckExampleResourceExists("example_widget.foo", &widgetBefore),
				),
			},
			{
				Config: testAccExampleResource_removedPolicy(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckExampleResourceExists("example_widget.foo", &widgetAfter),
				),
			},
		},
	})
}
```

## Creating Acceptance Tests Functions

Terraform acceptance tests are declared with the naming pattern `TestAccXxx`
with the standard Go test function signature of `func TestAccXxx(*testing.T)`.
Using the above test as an example:

```go
// File: example/widget_test.go
package example

func TestAccExampleWidget_basic(t *testing.T) {
  // ...
}
```

Inside this function we invoke `resource.Test()` with the `*testing.T` input and
a new testcase object:

```go
// File: example/widget_test.go
package example

func TestAccExampleWidget_basic(t *testing.T) {
  resource.Test(t, resource.TestCase{
  	// ...
  }
}
```

The majority of acceptance tests will only invoke `resource.Test()` and exit. If
at any point this method encounters an error, either in executing the provided
Terraform configurations or subsequent developer defined checks, `Test()` will
invoke the `t.Error` method of Go’s standard testing framework and the test will
fail. A failed test will not halt or otherwise interrupt any other tests
currently running.

## TestCase Reference API

`TestCase` offers several fields for developers to add to customize and validate
each test, defined below. The source for `TestCase` can be viewed [here on
godoc.org](https://godoc.org/github.com/hashicorp/terraform/helper/resource#TestCase)

### IsUnitTest 
**Type:** [bool](https://golang.org/pkg/builtin/#bool)  
**Default:** `false`  
**Required:** no  

**IsUnitTest** allows a test to run regardless of the TF_ACC environment
variable. This should be used with care - only for fast tests on local resources
(e.g. remote state with a local backend) but can be used to increase confidence
in correct operation of Terraform without waiting for a full acceptance test
run.

### PreCheck 

**Type:** `function`  
**Default:** `nil`  
**Required:** no  

**PreCheck** if non-nil, will be called before any test steps are executed. It
is commonly used to verify that required values exist for testing, such as
environment variables containing test keys that are used to configure the
Provider or Resource under test. 

**Example usage:**

```go
// File: example/widget_test.go
package example

func TestAccExampleWidget_basic(t *testing.T) {
  resource.Test(t, resource.TestCase{
    PreCheck:     func() { testAccPreCheck(t) },
  	// ...
  }
}


// testAccPreCheck validates the necessary test API keys exist 
// in the testing environment
func testAccPreCheck(t *testing.T) {
  if v := os.Getenv("EXAMPLE_KEY"); v == "" {
    t.Fatal("EXAMPLE_KEY must be set for acceptance tests")
  if v := os.Getenv("EXAMPLE_SECRET"); v == "" {
    t.Fatal("EXAMPLE_SECRET must be set for acceptance tests")
  }
}
```

### Providers 

**Type:**
`map[string]`[terraform.ResourceProvider](https://github.com/hashicorp/terraform/blob/0cc9e050ecd4a46ba6448758c2edc0b29bef5695/terraform/resource_provider.go#L10-L171)  
**Required:** Yes  

**Providers** is a map of `terraform.ResourceProvider` values with `string`
keys, representing the Providers that will be under test. Only the Providers
included in this map will be loaded during the test, so any Provider included in
a configuration file for testing must be represented in this map or the test
will fail during initialization. 

This map is most commonly constructed once in a common `init()` method of the
Provider’s main test file, and includes an object of the current Provider type.

**Example usage:** (note the different files `widget_test.go` and `provider_test.go`)

```go
// File: example/widget_test.go
package example

func TestAccExampleWidget_basic(t *testing.T) {
  resource.Test(t, resource.TestCase{
    PreCheck:     func() { testAccPreCheck(t) },
		Providers:    testAccProviders,
  	// ...
  }
}

// File: example/provider_test.go
package example

var testAccProviders map[string]terraform.ResourceProvider
var testAccProvider *schema.Provider

func init() {
  testAccProvider = Provider().(*schema.Provider)
  testAccProviders = map[string]terraform.ResourceProvider{
    "example": testAccProvider,
  }
}
```


### CheckDestroy 

**Type:** [TestCheckFunc](https://github.com/hashicorp/terraform/blob/0cc9e050ecd4a46ba6448758c2edc0b29bef5695/helper/resource/testing.go#L182-L186)  
**Default:** `nil`  
**Required:** no  

**CheckDestroy** is called after all test steps have been ran, and Terraform
has ran `destroy` on the remaining state. This allows developers to ensure any
resource created is truly destroyed. This method receives the last known
Terraform state as input, and commonly uses infrastructure SDKs to query APIs
directly to verify the expected objects are no longer found, and should return
an error if any resources remain.

**Example usage:**

```go
// File: example/widget_test.go
package example

func TestAccExampleWidget_basic(t *testing.T) {
  resource.Test(t, resource.TestCase{
    PreCheck:     func() { testAccPreCheck(t) },
    Providers:    testAccProviders,
    CheckDestroy: testAccCheckExampleResourceDestroy,
    // ...
  }
}

// testAccCheckExampleResourceDestroy verifies the Widget 
// has been destroyed
func testAccCheckExampleResourceDestroy(s *terraform.State) error {
  // retrieve the connection established in Provider configuration
  conn := testAccProvider.Meta().(*ExampleClient)

  // loop through the resources in state, verifying each widget 
  // is destroyed
  for _, rs := range s.RootModule().Resources {
    if rs.Type != "example_widget" {
      continue
    }

    // Retrieve our widget by referencing it's state ID for API lookup
    request := &example.DescribeWidgets{
      IDs: []string{rs.Primary.ID},
    }
    
    response, err := conn.DescribeWidgets(request)
    if err == nil {
      if len(response.Widgets) > 0 && *response.Widgets[0].ID == rs.Primary.ID {
        return fmt.Errorf("Widget (%s) still exists.", rs.Primary.ID)
      }

      return nil
    }

    // If the error is equivalent to 404 not found, the widget is destroyed.
    // Otherwise return the error
    if !strings.Contains(err.Error(), "Widget not found" {
      return err
    }
  }

  return nil
}
```

### Steps 

**Type:** [[]TestStep](https://github.com/hashicorp/terraform/blob/0cc9e050ecd4a46ba6448758c2edc0b29bef5695/helper/resource/testing.go#L249-L367)  
**Required:** yes  

**TestStep** is a single apply sequence of a test, done within the context of a
state. Multiple `TestStep`s can be sequenced in a Test to allow testing
potentially complex update logic and usage. Basic tests typically contain one to
two steps, to verify the resource can be created and subsequently updated,
depending on the properties of the resource. In general, simply create/destroy
tests will only need one step. 

`TestStep`s are covered in detail in [the next section, `TestSteps`](/docs/extend/testing/acceptance-tests/teststep.html).

**Example usage:**

```go
// File: example/widget_test.go
package example

func TestAccExampleWidget_basic(t *testing.T) {
  resource.Test(t, resource.TestCase{
    PreCheck:     func() { testAccPreCheck(t) },
    Providers:    testAccProviders,
    CheckDestroy: testAccCheckExampleResourceDestroy,
    Steps: []resource.TestStep{
      {
        Config: testAccExampleResource(rName),
        Check: resource.ComposeTestCheckFunc(
          testAccCheckExampleResourceExists("example_widget.foo", &widgetBefore),
        ),
      },
      {
        Config: testAccExampleResource_removedPolicy(rName),
        Check: resource.ComposeTestCheckFunc(
          testAccCheckExampleResourceExists("example_widget.foo", &widgetAfter),
        ),
      },
    },
  })
}
```

## Next Steps

`TestCases` are used to verify the features of a given part of a plugin. Each
case should represent a scenario of normal usage of the plugin, from simple
creation to creating, adding, and removing specific properties. In the next
Section [`TestSteps`][2], we’ll detail `Steps` portion of `TestCase` and see how
to create these scenarios by iterating on Terraform configurations. 

[1]: https://github.com/hashicorp/terraform/blob/0cc9e050ecd4a46ba6448758c2edc0b29bef5695/helper/resource/testing.go#L195-L247
[2]: /docs/extend/testing/acceptance-tests/teststep.html
[3]: https://golang.org/pkg/testing/#T
