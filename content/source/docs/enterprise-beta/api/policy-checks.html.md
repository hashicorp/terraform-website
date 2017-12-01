---
layout: enterprise2
page_title: "Policy Checks - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-policy-checks"
---

# Policy Checks API

-> **Note**: These API endpoints are in beta and are subject to change.

## List policy checks

This endpoint lists the policy checks in a run.

| Method | Path           |
| :----- | :------------- |
| GET | /runs/:run_id/policy-checks |

### Parameters

- `run_id` (`string: <required>`) - specifies the run ID for which to list policy checks

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://atlas.hashicorp.com/api/v2/runs/run-CZcmD7eagjhyXavN/policy-checks
```

### Sample Response

```json
{
  "data": [
    {
      "id": "polchk-9VYRc9bpfJEsnwum",
      "type": "policy-checks",
      "attributes": {
        "result": {
          "result": false,
          "passed": 0,
          "total-failed": 1,
          "hard-failed": 0,
          "soft-failed": 1,
          "advisory-failed": 0,
          "duration-ms": 0,
          "sentinel": {
            "can-override": true,
            "error": null,
            "policies": [
              {
                "allowed-failure": false,
                "error": null,
                "policy": "contains-billing-tag.sentinel",
                "result": false,
                "trace": {
                  "description": "",
                  "error": null,
                  "print": "",
                  "result": false,
                  "rules": {
                    "main": {
                      "ident": "main",
                      "root": {
                        "children": [
                          {
                            "children": null,
                            "expression": "r.applied contains \"tags\"",
                            "value": "false"
                          }
                        ],
                        "expression": "all tfplan.resources.aws_instance as _, instances {\n\tall instances as _, r {\n\t\tr.applied contains \"tags\" and r.applied.tags contains \"billing-id\"\n\t}\n}",
                        "value": "false"
                      },
                      "string": "Rule \"main\" (byte offset 18) = false\n  false (offset 120): r.applied contains \"tags\"\n"
                    }
                  }
                }
              }
            ],
            "result": false
          }
        },
        "scope": "organization",
        "status": "soft_failed",
        "status-timestamps": {
          "queued-at": "2017-11-29T20:02:17+00:00",
          "soft-failed-at": "2017-11-29T20:02:20+00:00"
        },
        "may-override": false
      },
      "links": {
        "output": "/api/v2/policy-checks/polchk-9VYRc9bpfJEsnwum/output"
      }
    }
  ]
}
```

## Override Policy

This endpoint overrides a soft-mandatory or warning policy.

| Method | Path           |
| :----- | :------------- |
| GET | /policy-checks/:policy_check_id/actions/override |

### Parameters

- `policy_check_id` (`string: <required>`) - specifies the ID for the policy check to override

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://atlas.hashicorp.com/api/v2/policy-checks/polchk-EasPB4Srx5NAiWAU/actions/override
```

### Sample Response

```json
{
  "data": {
    "id": "polchk-EasPB4Srx5NAiWAU",
    "type": "policy-checks",
    "attributes": {
      "result": {
        "result": false,
        "passed": 0,
        "total-failed": 1,
        "hard-failed": 0,
        "soft-failed": 1,
        "advisory-failed": 0,
        "duration-ms": 0,
        "sentinel": {
          "can-override": true,
          "error": null,
          "policies": [
            {
              "allowed-failure": false,
              "error": null,
              "policy": "contains-billing-tag.sentinel",
              "result": false,
              "trace": {
                "description": "",
                "error": null,
                "print": "",
                "result": false,
                "rules": {
                  "main": {
                    "ident": "main",
                    "root": {
                      "children": [
                        {
                          "children": null,
                          "expression": "r.applied contains \"tags\"",
                          "value": "false"
                        }
                      ],
                      "expression": "all tfplan.resources.aws_instance as _, instances {\n\tall instances as _, r {\n\t\tr.applied contains \"tags\" and r.applied.tags contains \"billing-id\"\n\t}\n}",
                      "value": "false"
                    },
                    "string": "Rule \"main\" (byte offset 18) = false\n  false (offset 120): r.applied contains \"tags\"\n"
                  }
                }
              }
            }
          ],
          "result": false
        }
      },
      "scope": "organization",
      "status": "overridden",
      "status-timestamps": {
        "queued-at": "2017-11-29T20:13:37+00:00",
        "soft-failed-at": "2017-11-29T20:13:40+00:00",
        "overridden-at": "2017-11-29T20:14:11+00:00"
      },
      "may-override": false
    },
    "links": {
      "output": "/api/v2/policy-checks/polchk-EasPB4Srx5NAiWAU/output"
    }
  }
}
```