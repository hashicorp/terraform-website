---
layout: enterprise2
page_title: "State Versions - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-state-versions"
---

# State Versions API

-> **Note**: These API endpoints are in beta and are subject to change.

## Create a State Version

`POST /workspaces/:workspace_id/state-versions`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The workspace ID to create the new state version. |

Creates a state version and sets it as the current state version for the given
workspace.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[201][] | [JSON API document][]                        | Successfully created a state version
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[409][] | [JSON API error object][]                    | Conflict; check the error object for more information
[412][] | [JSON API error object][]                    | Precondition failed; check the error object for more information
[422][] | [JSON API error object][]                    | Malformed request body (missing attributes, wrong types, etc.)

[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[409]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
[412]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                    | Type    | Default   | Description
----------------------------|---------|-----------|------------
`data.type`                 | string  |           | Must be `"state-versions"`.
`data.attributes.serial`    | integer |           | The serial of the state version. Must match the serial value extracted from the raw state file.
`data.attributes.md5`       | string  |           | An MD5 hash of the raw state version
`data.attributes.lineage`   | string  | (nothing) | **Optional** Lineage of the state version. Should match the lineage extracted from the raw state file. Early versions of terraform did not have the concept of lineage, so this is an optional attribute.
`data.attributes.state`     | string  |           | Base64 encoded raw state file

### Sample Payload

```json
{
  "data": {
    "type":"state-versions",
    "attributes": {
      "serial": 1,
      "md5": "871d1b4a-e579-fb7c-ffdb-f0c858a647a7",
      "lineage": "871d1b4a-e579-fb7c-ffdb-f0c858a647a7",
      "state": "..."
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-6fHMCom98SDXSQUv/state-versions
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": {
        "id": "sv-DmoXecHePnNznaA4",
        "type": "state-versions",
        "attributes": {
            "vcs-commit-sha": null,
            "vcs-commit-url": null,
            "created-at": "2018-07-12T20:32:01.490Z",
            "hosted-state-download-url": "https://terraform.io/v1/object/f55b739b-ff03-4716-b436-726466b96dc4",
            "serial": 1
        },
        "links": {
            "self": "/api/v2/state-versions/sv-DmoXecHePnNznaA4"
        }
    }
}
```

## List State Versions for a Workspace

`GET /state-versions`

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                    | Description
-----------------------------|------------
`filter[workspace][name]`    | **Required** The name of one workspace to list versions for.
`filter[organization][name]` | **Required** The name of the organization that owns the desired workspace.
`page[number]`               | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                 | **Optional.** If omitted, the endpoint will return 20 state versions per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/state-versions?filter%5Bworkspace%5D%5Bname%5D=my-workspace&filter%5Borganization%5D%5Bname%5D=my-organization
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": [
        {
            "id": "sv-SDboVZC8TCxXEneJ",
            "type": "state-versions",
            "attributes": {
                "vcs-commit-sha": null,
                "vcs-commit-url": null,
                "created-at": "2018-08-27T14:49:47.902Z",
                "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
                "serial": 3
            },
            "relationships": {
                "run": {
                    "data": {
                        "type": "runs"
                    }
                },
                "created-by": {
                    "data": {
                        "id": "api-org-my-organization",
                        "type": "users"
                    },
                    "links": {
                        "related": "/api/v2/runs/sv-SDboVZC8TCxXEneJ/created-by"
                    }
                }
            },
            "links": {
                "self": "/api/v2/state-versions/sv-SDboVZC8TCxXEneJ"
            }
        },
        {
            "id": "sv-UdqGARTddt8SEJEi",
            "type": "state-versions",
            "attributes": {
                "vcs-commit-sha": null,
                "vcs-commit-url": null,
                "created-at": "2018-08-27T14:49:46.102Z",
                "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
                "serial": 2
            },
            "relationships": {
                "run": {
                    "data": {
                        "type": "runs"
                    }
                },
                "created-by": {
                    "data": {
                        "id": "api-org-my-organization",
                        "type": "users"
                    },
                    "links": {
                        "related": "/api/v2/runs/sv-UdqGARTddt8SEJEi/created-by"
                    }
                }
            },
            "links": {
                "self": "/api/v2/state-versions/sv-UdqGARTddt8SEJEi"
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/state-versions?filter%5Borganization%5D%5Bname%5D=my-organization&filter%5Bworkspace%5D%5Bname%5D=my-workspace&page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/state-versions?filter%5Borganization%5D%5Bname%5D=my-organization&filter%5Bworkspace%5D%5Bname%5D=my-workspace&page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/state-versions?filter%5Borganization%5D%5Bname%5D=my-organization&filter%5Bworkspace%5D%5Bname%5D=my-workspace&page%5Bnumber%5D=1&page%5Bsize%5D=20"
    },
    "meta": {
        "pagination": {
            "current-page": 1,
            "prev-page": null,
            "next-page": null,
            "total-pages": 1,
            "total-count": 2
        }
    }
}
```

## Fetch the Current State Version for a Workspace

`GET /workspaces/:workspace_id/current-state-version`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The ID for the workspace whose current state version you want to fetch |

Fetches the current state version for the given workspace. This state version
will be the input state when running terraform operations.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully returned current state version for the given workspace
[404][] | [JSON API error object][]                    | Workspace not found, workspace does not have a current state version, or user unauthorized to perform action

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-6fHMCom98SDXSQUv/current-state-version
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": {
        "id": "sv-SDboVZC8TCxXEneJ",
        "type": "state-versions",
        "attributes": {
            "vcs-commit-sha": null,
            "vcs-commit-url": null,
            "created-at": "2018-08-27T14:49:47.902Z",
            "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
            "serial": 3
        },
        "relationships": {
            "run": {
                "data": {
                    "type": "runs"
                }
            },
            "created-by": {
                "data": {
                    "id": "api-org-hashicorp",
                    "type": "users"
                },
                "links": {
                    "related": "/api/v2/runs/sv-SDboVZC8TCxXEneJ/created-by"
                }
            }
        },
        "links": {
            "self": "/api/v2/state-versions/sv-SDboVZC8TCxXEneJ"
        }
    }
}
```
