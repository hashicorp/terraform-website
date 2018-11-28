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

#### Current mock limitations

There are currently some limitations mocking `tfplan` data in Sentinel. These
issues will be fixed in future releases of the import and core runtime.

* As functions cannot be mocked in the current Sentinel testing framework, the
  [module()][ref-module] function is not available. As a result, only root
  module data can be mocked at this time.

[ref-module]: /docs/enterprise/sentinel/import/tfplan.html#function-module-

* [Resource and data source][resource-and-data-source] count keys (`NUMBER` in
  `TYPE.NAME[NUMBER]`), which are actually represented as integers, cannot be
  represented accurately in JSON, and as a result, mocks that depend on count keys
  explicitly (example: `tfplan.resources.null_resource.foo[0]`) will not work
  properly with mocks.

[resource-and-data-source]: /docs/enterprise/sentinel/import/tfplan.html#namespace-resources-data-sources

```json
{
  "mock": {
    "tfplan": {
      "terraform_version": "0.11.7",
      "variables": {
        "foo": "bar",
        "map": {
          "foo": "bar",
          "number": 42
        },
        "number": "42"
      },
      "module_paths": [
        [],
        [
          "foo"
        ]
      ],
      "path": [],
      "data": {
        "null_data_source": {
          "baz": {
            "0": {
              "diff": {
                "has_computed_default": {
                  "old": "",
                  "new": "",
                  "computed": true
                },
                "id": {
                  "old": "",
                  "new": "",
                  "computed": true
                },
                "inputs.%": {
                  "old": "",
                  "new": "",
                  "computed": true
                },
                "outputs.%": {
                  "old": "",
                  "new": "",
                  "computed": true
                },
                "random": {
                  "old": "",
                  "new": "",
                  "computed": true
                }
              },
              "applied": {
                "has_computed_default": "74D93920-ED26-11E3-AC10-0800200C9A66",
                "id": "74D93920-ED26-11E3-AC10-0800200C9A66",
                "inputs": {},
                "outputs": {},
                "random": "74D93920-ED26-11E3-AC10-0800200C9A66"
              }
            }
          }
        }
      },
      "resources": {
        "null_resource": {
          "bar": {
            "0": {
              "diff": {
                "id": {
                  "old": "",
                  "new": "",
                  "computed": true
                },
                "triggers.%": {
                  "old": "",
                  "new": "",
                  "computed": true
                }
              },
              "applied": {
                "id": "74D93920-ED26-11E3-AC10-0800200C9A66",
                "triggers": {}
              }
            }
          },
          "foo": {
            "0": {
              "diff": {
                "id": {
                  "old": "",
                  "new": "",
                  "computed": true
                },
                "triggers.%": {
                  "old": "",
                  "new": "1",
                  "computed": false
                },
                "triggers.foo": {
                  "old": "",
                  "new": "bar",
                  "computed": false
                }
              },
              "applied": {
                "id": "74D93920-ED26-11E3-AC10-0800200C9A66",
                "triggers": {
                  "foo": "bar"
                }
              }
            }
          }
        }
      }
    }
  }
}
```
