---
layout: enterprise2
page_title: "Mocking tfplan Data - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfplan-mock"
description: |-
    This page provides a mock for the tfplan Sentinel import.
---

# Mocking tfplan Data

Below is a sample of what a mock for the [`tfplan`][ref-tfplan] import would
look like. You can use this data with the mocking or testing features of the
[Sentinel Simulator][ref-sentinel-simulator] to create test data for rules.

[ref-tfplan]: /docs/enterprise/sentinel/import/tfplan.html
[ref-sentinel-simulator]: https://docs.hashicorp.com/sentinel/commands/

For more details on how to work with mock data in Sentinel, see the section on
[Mocking Imports][ref-mocking-imports] in the [official Sentinel
documentation][ref-official-sentinel-documentation].

[ref-mocking-imports]: https://docs.hashicorp.com/sentinel/writing/imports#mocking-imports
[ref-official-sentinel-documentation]: https://docs.hashicorp.com/sentinel/

-> **NOTE:** The top-level `config` and `state` keys are not included in this
mock. Their layouts are identical to those found in the [`tfconfig`
mock][ref-tfconfig-mock] and the [`tfstate` mock][ref-tfstate-mock].

[ref-tfconfig-mock]: /docs/enterprise/sentinel/import/mock-tfconfig.html
[ref-tfstate-mock]: /docs/enterprise/sentinel/import/mock-tfstate.html

## Configuring Sentinel Simulator for Terraform Mocks

Terraform mocks make use of the ability to provide mocks as Sentinel code,
which requires Sentinel Simulator 0.8.0 or higher to use. To get the latest
version of the simulator, see the [downloads page][ref-downloads-page].

[ref-downloads-page]: https://docs.hashicorp.com/sentinel/downloads

These mocks are configured differently than JSON mocks:

* Save the mock file contents below to a `.sentinel` file within your project
  directory. The example below uses `mock-tfplan.sentinel`.
* Add the following to your Sentinel configuration file (for example,
  `sentinel.json`):

    ```json
    {
      "mock": {
        "tfplan": "mock-tfplan.sentinel"
      }
    }
    ```

* Run the Sentinel Simulator:

    ```
    sentinel apply -config=sentinel.json policy.sentinel
    ```

The above can be adjusted for use with `sentinel test` as well. As an example,
assuming you save the mock to `test/shared/mock-tfplan.sentinel`, and you are
editing a `test/policy/pass.json` test case:

```json
{
  "mock": {
    "tfplan": "../shared/mock-tfplan.sentinel"
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
          "applied": {
            "has_computed_default": "74D93920-ED26-11E3-AC10-0800200C9A66",
            "id":      "74D93920-ED26-11E3-AC10-0800200C9A66",
            "inputs":  {},
            "outputs": {},
            "random":  "74D93920-ED26-11E3-AC10-0800200C9A66",
          },
          "diff": {
            "has_computed_default": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "id": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "inputs.%": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "outputs.%": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "random": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
          },
        },
      },
    },
  },
  "path": [],
  "resources": {
    "null_resource": {
      "bar": {
        0: {
          "applied": {
            "id":       "74D93920-ED26-11E3-AC10-0800200C9A66",
            "triggers": {},
          },
          "diff": {
            "id": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "triggers.%": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
          },
        },
      },
      "foo": {
        0: {
          "applied": {
            "id": "74D93920-ED26-11E3-AC10-0800200C9A66",
            "triggers": {
              "foo": "bar",
            },
          },
          "diff": {
            "id": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "triggers.%": {
              "computed": false,
              "new":      "1",
              "old":      "",
            },
            "triggers.foo": {
              "computed": false,
              "new":      "bar",
              "old":      "",
            },
          },
        },
      },
    },
  },
}

module_foo = {
  "data": {},
  "path": [
    "foo",
  ],
  "resources": {
    "null_resource": {
      "foo": {
        0: {
          "applied": {
            "id": "74D93920-ED26-11E3-AC10-0800200C9A66",
            "triggers": {
              "foo": "bar",
            },
          },
          "diff": {
            "id": {
              "computed": true,
              "new":      "",
              "old":      "",
            },
            "triggers.%": {
              "computed": false,
              "new":      "1",
              "old":      "",
            },
            "triggers.foo": {
              "computed": false,
              "new":      "bar",
              "old":      "",
            },
          },
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

terraform_version = "0.11.11"

variables = {
  "foo": "bar",
  "map": {
    "foo":    "bar",
    "number": 42,
  },
  "number": "42",
}

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
path = _root.path
resources = _root.resources
```
