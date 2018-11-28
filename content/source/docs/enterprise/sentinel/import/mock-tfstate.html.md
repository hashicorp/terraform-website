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

#### Current mock limitations

There are currently some limitations mocking `tfstate` data in Sentinel. These
issues will be fixed in future releases of the import and core runtime.

* As functions cannot be mocked in the current Sentinel testing framework, the
  [module()][ref-module] function is not available. As a result, only root
  module data can be mocked at this time.

[ref-module]: /docs/enterprise/sentinel/import/tfstate.html#function-module-

* [Resource and data source][resource-and-data-source] count keys (`NUMBER` in
  `TYPE.NAME[NUMBER]`), which are actually represented as integers, cannot be
  represented accurately in JSON and as a result, mocks that depend on count
  keys explicitly (example: `tfstate.resources.null_resource.foo[0]`) will not
  work properly with mocks.

[resource-and-data-source]: /docs/enterprise/sentinel/import/tfstate.html#namespace-resources-data-sources

```json
{
  "mock": {
    "tfstate": {
      "module_paths": [
        [],
        [
          "foo"
        ]
      ],
      "terraform_version": "0.11.7",
      "data": {
        "null_data_source": {
          "baz": {
            "0": {
              "depends_on": [
                "null_resource.bar",
                "null_resource.foo"
              ],
              "id": "static",
              "attr": {
                "has_computed_default": "default",
                "id": "static",
                "inputs": {
                  "bar_id": "5511801804920420639",
                  "foo_id": "3332481276939020374"
                },
                "outputs": {
                  "bar_id": "5511801804920420639",
                  "foo_id": "3332481276939020374"
                },
                "random": "1637775805155379683"
              },
              "tainted": false
            }
          }
        }
      },
      "path": [
        "root"
      ],
      "outputs": {
        "foo": {
          "sensitive": true,
          "type": "string",
          "value": "bar"
        },
        "list": {
          "sensitive": false,
          "type": "list",
          "value": [
            "foo",
            "bar"
          ]
        },
        "map": {
          "sensitive": false,
          "type": "map",
          "value": {
            "foo": "bar",
            "number": 42
          }
        },
        "string": {
          "sensitive": false,
          "type": "string",
          "value": "foo"
        }
      },
      "resources": {
        "null_resource": {
          "bar": {
            "0": {
              "depends_on": [
                "null_resource.foo"
              ],
              "id": "5511801804920420639",
              "attr": {
                "id": "5511801804920420639",
                "triggers": {
                  "foo_id": "3332481276939020374"
                }
              },
              "tainted": false
            }
          },
          "foo": {
            "0": {
              "depends_on": null,
              "id": "3332481276939020374",
              "attr": {
                "id": "3332481276939020374",
                "triggers": {
                  "foo": "bar"
                }
              },
              "tainted": false
            }
          }
        }
      }
    }
  }
}
```
