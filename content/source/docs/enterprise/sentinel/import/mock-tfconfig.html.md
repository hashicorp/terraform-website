---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
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

```json
{
  "mock": {
    "tfconfig": {
      "module_paths": [
        [],
        [
          "foo"
        ]
      ],
      "data": {
        "null_data_source": {
          "baz": {
            "config": {
              "inputs": [
                {
                  "bar_id": "${null_resource.bar.id}",
                  "foo_id": "${null_resource.foo.id}"
                }
              ]
            },
            "provisioners": []
          }
        }
      },
      "modules": {
        "foo": {
          "config": {
            "bar": "baz"
          },
          "source": "./foo"
        }
      },
      "providers": {
        "aws": {
          "config": {},
          "version": "~\u003e 1.34",
          "alias": {
            "east": {
              "config": {
                "region": "us-east-1"
              },
              "version": ""
            }
          }
        },
        "null": {
          "config": {},
          "version": "",
          "alias": {}
        }
      },
      "resources": {
        "null_resource": {
          "bar": {
            "config": {
              "triggers": [
                {
                  "foo_id": "${null_resource.foo.id}"
                }
              ]
            },
            "provisioners": []
          },
          "foo": {
            "config": {
              "triggers": [
                {
                  "foo": "bar"
                }
              ]
            },
            "provisioners": [
              {
                "config": {
                  "command": "echo hello"
                },
                "type": "local-exec"
              }
            ]
          }
        }
      },
      "variables": {
        "foo": {
          "default": "bar",
          "description": "foobar"
        },
        "map": {
          "default": {
            "foo": "bar",
            "number": 42
          },
          "description": ""
        },
        "number": {
          "default": "42",
          "description": ""
        }
      }
    }
  }
}
```
