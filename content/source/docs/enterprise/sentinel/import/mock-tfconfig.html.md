---
layout: enterprise2
page_title: "Mocking tfconfig Data - Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-imports-tfconfig-mock"
description: |-
    This page provides a mock for the tfconfig Sentinel import.
---

# Mocking tfconfig Data

Below is a sample of what a mock for the [`tfconfig`][ref-tfconfig] import
would look like. You can use this data with the mocking or testing features of
the [Sentinel Simulator][ref-sentinel-simulator] to create test data for rules.

[ref-tfconfig]: /docs/enterprise/sentinel/import/tfconfig.html
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

* Save the mock file contents below to a `.sentinel` file within your project
  directory. The example below uses `mock-tfconfig.sentinel`.
* Add the following to your Sentinel configuration file, example
  `sentinel.json`:

    ```json
    {
      "mock": {
        "tfconfig": "mock-tfconfig.sentinel"
      }
    }
    ```

* Run the Sentinel Simulator:

    ```
    sentinel apply -config=sentinel.json policy.sentinel
    ```

The above can be adjusted for use with `sentinel test` as well. As an example,
assuming you save the mock to `test/shared/mock-tfconfig.sentinel`, and you are
editing a `test/policy/pass.json` test case:

```json
{
  "mock": {
    "tfconfig": "../shared/mock-tfconfig.sentinel"
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
        "config": {
          "inputs": [
            {
              "bar_id": "${null_resource.bar.id}",
              "foo_id": "${null_resource.foo.id}",
            },
          ],
        },
        "provisioners": null,
      },
    },
  },
  "modules": {
    "foo": {
      "config": {
        "bar": "baz",
      },
      "source":  "./foo",
      "version": "",
    },
  },
  "outputs": {
    "foo": {
      "depends_on":  [],
      "description": "",
      "sensitive":   true,
      "value":       "bar",
    },
    "list": {
      "depends_on":  [],
      "description": "",
      "sensitive":   false,
      "value": [
        "foo",
        "bar",
      ],
    },
    "map": {
      "depends_on":  [],
      "description": "",
      "sensitive":   false,
      "value": [
        {
          "foo":    "bar",
          "number": 42,
        },
      ],
    },
    "string": {
      "depends_on":  [],
      "description": "",
      "sensitive":   false,
      "value":       "foo",
    },
  },
  "providers": {
    "aws": {
      "alias": {
        "east": {
          "config": {
            "region": "us-east-1",
          },
          "version": "",
        },
      },
      "config":  {},
      "version": "~> 1.34",
    },
    "null": {
      "alias":   {},
      "config":  {},
      "version": "",
    },
  },
  "resources": {
    "null_resource": {
      "bar": {
        "config": {
          "triggers": [
            {
              "foo_id": "${null_resource.foo.id}",
            },
          ],
        },
        "provisioners": null,
      },
      "foo": {
        "config": {
          "triggers": [
            {
              "foo": "bar",
            },
          ],
        },
        "provisioners": [
          {
            "config": {
              "command": "echo hello",
            },
            "type": "local-exec",
          },
        ],
      },
    },
  },
  "variables": {
    "foo": {
      "default":     "bar",
      "description": "foobar",
    },
    "map": {
      "default": {
        "foo":    "bar",
        "number": 42,
      },
      "description": "",
    },
    "number": {
      "default":     "42",
      "description": "",
    },
  },
}

module_foo = {
  "data":      {},
  "modules":   {},
  "outputs":   {},
  "providers": {},
  "resources": {
    "null_resource": {
      "foo": {
        "config": {
          "triggers": [
            {
              "foo": "bar",
            },
          ],
        },
        "provisioners": null,
      },
    },
  },
  "variables": {
    "bar": {
      "default":     null,
      "description": "",
    },
  },
}

module_paths = [
  [],
  [
    "foo",
  ],
]

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
modules = _root.modules
providers = _root.providers
resources = _root.resources
variables = _root.variables
outputs = _root.outputs
```
