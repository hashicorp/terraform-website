---
layout: enterprise2
page_title: "Mocking tfstate Data - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfstate-mock"
description: |-
    This page provides a mock for the tfstate Sentinel import.
---

# Mocking tfstate Data

Below is a sample of what a mock for the [`tfstate`][ref-tfstate] import would
look like. You can use this data with the mocking or testing features of the
[Sentinel Simulator][ref-sentinel-simulator] to create test data for rules.

[ref-tfstate]: /docs/enterprise/sentinel/import/tfstate.html
[ref-sentinel-simulator]: https://docs.hashicorp.com/sentinel/commands/

For more details on how to work with mock data in Sentinel, see the section on
[Mocking Imports][ref-mocking-imports] in the [official Sentinel
documentation][ref-official-sentinel-documentation].

[ref-mocking-imports]: https://docs.hashicorp.com/sentinel/writing/imports#mocking-imports
[ref-official-sentinel-documentation]: https://docs.hashicorp.com/sentinel/

## Configuring Sentinel Simulator for Terraform Mocks

Terraform mocks make use of the ability to provide mocks as Sentinel code,
which requires Sentinel Simulator 0.8.0 or higher to use. To get the latest
version of the simulator, see the [downloads page][ref-downloads-page].

[ref-downloads-page]: https://docs.hashicorp.com/sentinel/downloads

These mocks are configured differently than JSON mocks: 

* Save the contents below to a `.sentinel` file within your project directory.
   The example below uses `mock-tfstate.sentinel`.
* Add the following to your Sentinel configuration file, example
   `sentinel.json`:

```json
{
  "mock": {
    "tfstate": "mock-tfstate.sentinel"
  }
}
```

* Run the Sentinel Simulator:

```
sentinel apply -config=sentinel.json policy.sentinel
```

The above can be adjusted for use with `sentinel test` as well. As an example,
assuming you save the mock to `test/shared/mock-tfstate.sentinel`, and you are
editing a `test/policy/pass.json` test case:

```json
{
  "mock": {
    "tfstate": "../shared/mock-tfstate.sentinel"
  },
  "test": {
    "main": true
  }
}
```

More information on configuring mocks using Sentinel code can be found
[here][ref-sentinel-mocking-with-sentinel-code].

[ref-sentinel-mocking-with-sentinel-code]: https://docs.hashicorp.com/sentinel/commands/config#mocking-with-sentinel-code

## Mock File Contents

```python
_root = {
  "data": {
    "null_data_source": {
      "baz": {
        0: {
          "attr": {
            "has_computed_default": "default",
            "id": "static",
            "inputs": {
              "bar_id": "5511801804920420639",
              "foo_id": "3332481276939020374",
            },
            "outputs": {
              "bar_id": "5511801804920420639",
              "foo_id": "3332481276939020374",
            },
            "random": "4165965928584338859",
          },
          "depends_on": [
            "null_resource.bar",
            "null_resource.foo",
          ],
          "id":      "static",
          "tainted": false,
        },
      },
    },
  },
  "outputs": {
    "foo": {
      "sensitive": true,
      "type":      "string",
      "value":     "bar",
    },
    "list": {
      "sensitive": false,
      "type":      "list",
      "value": [
        "foo",
        "bar",
      ],
    },
    "map": {
      "sensitive": false,
      "type":      "map",
      "value": {
        "foo":    "bar",
        "number": 42,
      },
    },
    "string": {
      "sensitive": false,
      "type":      "string",
      "value":     "foo",
    },
  },
  "path": [],
  "resources": {
    "null_resource": {
      "bar": {
        0: {
          "attr": {
            "id": "5511801804920420639",
            "triggers": {
              "foo_id": "3332481276939020374",
            },
          },
          "depends_on": [
            "null_resource.foo",
          ],
          "id":      "5511801804920420639",
          "tainted": false,
        },
      },
      "foo": {
        0: {
          "attr": {
            "id": "3332481276939020374",
            "triggers": {
              "foo": "bar",
            },
          },
          "depends_on": [],
          "id":         "3332481276939020374",
          "tainted":    false,
        },
      },
    },
  },
}

module_foo = {
  "data":    {},
  "outputs": {},
  "path": [
    "foo",
  ],
  "resources": {
    "null_resource": {
      "foo": {
        0: {
          "attr": {
            "id": "7102772838417697789",
            "triggers": {
              "foo": "bar",
            },
          },
          "depends_on": [],
          "id":         "7102772838417697789",
          "tainted":    false,
        },
      },
    },
  },
}

module_paths = [
  [],
  [
    "foo",
  ],
]

terraform_version = "0.11.7"

module = func(path) {
  if length(path) == 0 {
    return _root
  }
  if length(path) == 1 and path[0] is "foo" {
    return module_foo
  }

  return undefined
}

data = _root.data
outputs = _root.outputs
path = _root.path
```
