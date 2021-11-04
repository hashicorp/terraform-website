---
layout: "cloud"
page_title: "Run Tasks - API Docs - Terraform Cloud and Terraform Enterprise"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[202]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[401]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
[403]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[409]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
[412]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[429]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
[500]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
[504]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
[JSON API document]: /docs/cloud/api/index.html#json-api-documents
[JSON API error object]: https://jsonapi.org/format/#error-objects

# Run Tasks API

-> Note: As of September 2021, Run Tasks are available only as a beta feature, are subject to change, and not all customers will see this functionality in their Terraform Cloud organization.

[Run tasks](../workspaces/run-tasks.html) allow Terraform Cloud to execute tasks in external systems at specific points in the Terraform Cloud run lifecycle. Run tasks are reusable configurations that you can attach to any workspace in an organization. This page lists the API endpoints for run tasks in an organization and explains how to attach run tasks to workspaces.

## Required Permissions

You need organization owner [permissions](../users-teams-organizations/permissions.html) to interact with run tasks and workspace administrator permissions to connect run tasks to workspaces.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Create a Run Task

`POST /organizations/:organization_name/tasks`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to create a run task in. The organization must already exist in Terraform Cloud, and the token authenticating the API request must have [owner permission](/docs/cloud/users-teams-organizations/permissions.html).

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[201][] | [JSON API document][] (`type: "tasks"`) | Successfully created a run task
[404][] | [JSON API error object][]                     | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                     | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required unless otherwise specified.

Key path                                      | Type            | Default | Description
----------------------------------------------|-----------------|---------|------------
`data.type`                                   | string          |         | Must be `"tasks"`.
`data.attributes.name`                        | string          |         | The name of the task. Can include letters, numbers, `-`, and `_`.
`data.attributes.url`                         | string          |         | URL to send a run task payload.
`data.attributes.category`                    | string          |         | Must be `"task"`.
`data.attributes.hmac-key`                    | string          |         | (Optional) HMAC key to verify run task.

### Sample Payload

```json
{
  "data": {
    "type": "tasks",
      "attributes": {
        "name": "example",
        "url": "http://example.com",
        "hmac_key": "secret",
        "category": "task"
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
  https://app.terraform.io/api/v2/organizations/my-organization/tasks
```

### Sample Response

```json
{
  "data": {
    "id": "task-7oD7doVTQdAFnMLV",
      "type": "tasks",
      "attributes": {
        "category": "task",
        "name": "my-run-task",
        "url": "http://example.com",
        "hmac-key": null,
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "hashicorp",
            "type": "organizations"
          }
        },
        "tasks": {
          "data": []
        }
      },
      "links": {
        "self": "/api/v2/tasks/task-7oD7doVTQdAFnMLV"
      }
  }
}
```

## List Run Tasks

`GET /organizations/:organization_name/tasks`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to list tasks for.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`)       | Request was successful
[404][] | [JSON API error object][]                     | Organization not found, or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`include`           | **Optional.** Allows including related resource data. Value must be a comma-separated list containing one or more of `workspace_tasks` or `workspace_tasks.workspace`.
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 policy sets per page.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/tasks
```

### Sample Response

```json
{
    "data": [
        {
            "id": "task-7oD7doVTQdAFnMLV",
            "type": "tasks",
            "attributes": {
                "category": "task",
                "name": "my-task",
                "url": "http://example.com",
                "hmac-key": null,
            },
            "relationships": {
                "organization": {
                    "data": {
                        "id": "hashicorp",
                        "type": "organizations"
                    }
                },
                "tasks": {
                    "data": []
                }
            },
            "links": {
                "self": "/api/v2/tasks/task-7oD7doVTQdAFnMLV"
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/organizations/hashicorp/tasks?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/organizations/hashicorp/tasks?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/organizations/hashicorp/tasks?page%5Bnumber%5D=1&page%5Bsize%5D=20"
    },
    "meta": {
        "pagination": {
            "current-page": 1,
            "page-size": 20,
            "prev-page": null,
            "next-page": null,
            "total-pages": 1,
            "total-count": 1
        }
    }
}
```

## Show a Run Task

`GET /tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the task to show. Use the ["List Run Tasks"](#list-run-tasks) endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`)       | The request was successful
[404][] | [JSON API error object][]                     | Run task not found or user unauthorized to perform action

Parameter | Description
----------|------------
`include` | **Optional.** Allows including related resource data. Value must be a comma-separated list containing one or more of `workspace_tasks` or `workspace_tasks.workspace`.

### Sample Request

```shell
curl --request GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/tasks/task-7oD7doVTQdAFnMLV
```

### Sample Response

```json
{
  "data": {
    "id": "task-7oD7doVTQdAFnMLV",
      "type": "tasks",
      "attributes": {
        "category": "task",
        "name": "my-task",
        "url": "http://example.com",
        "hmac-key": null,
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "hashicorp",
            "type": "organizations"
          }
        },
        "tasks": {
          "data": [
          {
            "id": "task-xjKZw9KaeXda61az",
            "type": "tasks"
          }
          ]
        }
      },
      "links": {
        "self": "/api/v2/tasks/task-7oD7doVTQdAFnMLV"
      }
  }
}
```

## Update a Run Task

`PATCH /tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the task to update. Use the ["List Run Tasks"](#list-run-tasks) endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`)       | The request was successful
[404][] | [JSON API error object][]                     | Run task not found or user unauthorized to perform action
[422][] | [JSON API error object][]                     | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required unless otherwise specified.

Key path                                      | Type    | Default          | Description
----------------------------------------------|-------- |------------------|------------
`data.type`                                   | string  |                  | Must be `"tasks"`.
`data.attributes.name`                        | string  | (previous value) | The name of the run task. Can include letters, numbers, `-`, and `_`.
`data.attributes.url`                         | string  | (previous value) | URL to send a run task payload.
`data.attributes.category`                    | string  | (previous value) | Must be `"task"`.
`data.attributes.hmac-key`                    | string  | (previous value) | (Optional) HMAC key to verify run task.

### Sample Payload

```json
{
  "data": {
    "type": "tasks",
      "attributes": {
        "name": "new-example",
        "url": "http://new-example.com",
        "hmac_key": "new-secret",
        "category": "task"
      }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/tasks/task-7oD7doVTQdAFnMLV
```

### Sample Response

```json
{
  "data": {
    "id": "task-7oD7doVTQdAFnMLV",
      "type": "tasks",
      "attributes": {
        "category": "task",
        "name": "new-example",
        "url": "http://new-example.com",
        "hmac-key": null,
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "hashicorp",
            "type": "organizations"
          }
        },
        "tasks": {
          "data": [
          {
            "id": "wstask-xjKZw9KaeXda61az",
            "type": "workspace-tasks"
          }
          ]
        }
      },
      "links": {
        "self": "/api/v2/tasks/task-7oD7doVTQdAFnMLV"
      }
  }
}
```

## Delete a Run Task

`DELETE /tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the run task to delete. Use the ["List Run Tasks"](#list-run-tasks) endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the run task
[404][] | [JSON API error object][] | Run task not found, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/tasks/task-7oD7doVTQdAFnMLV
```

## Attach a Run Task to a Workspace

`POST /workspaces/:workspace_id/tasks`

Parameter | Description
----------|------------
`:workspace_id` | The ID of the workspace.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | The request was successful
[404][] | [JSON API error object][] | Workspace or run task not found or user unauthorized to perform action
[422][] | [JSON API error object][] | Malformed request body

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path | Type            | Default | Description
---------|-----------------|---------|------------
`data.type`                                   | string |  | Must be `"workspace-tasks"`.
`data.attributes.enforcement-level`           | string |  | The enforcement level of the workspace task. Must be `"advisory"` or `"mandatory"`.
`data.relationships.task.data.id`       | string |  | The ID of the run task.
`data.relationships.task.data.type`     | string |  | Must be `"tasks"`.

### Sample Payload

```json
{
  "data": {
    "type": "workspace-tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "task": {
          "data": {
            "id": "task-7oD7doVTQdAFnMLV",
            "type": "tasks"
          }
        }
      }
  }
}
```

### Sample Request

```shell
curl \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-PphL7ix3yGasYGrq/tasks
```

### Sample Response
```json
{
  "data": {
    "id": "wstask-tBXYu8GVAFBpcmPm",
      "type": "workspace-tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "task": {
          "data": {
            "id": "task-7oD7doVTQdAFnMLV",
            "type": "tasks"
          }
        },
        "workspace": {
          "data": {
            "id": "ws-PphL7ix3yGasYGrq",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/workspaces/ws-PphL7ix3yGasYGrq/tasks/task-tBXYu8GVAFBpcmPm"
      }
  }
}
```

## List Workspace Run Tasks

`GET /workspaces/:workspace_id/tasks`

Parameter            | Description
---------------------|------------
`:workspace_id` | The workspace to list tasks for.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`)       | Request was successful
[404][] | [JSON API error object][]                     | Workspace not found, or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 policy sets per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks
```

### Sample Response

```json
{
  "data": [
  {
    "id": "wstask-tBXYu8GVAFBpcmPm",
      "type": "workspace-tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "task": {
          "data": {
            "id": "task-hu74ST39g566Q4m5",
            "type": "tasks"
          }
        },
        "workspace": {
          "data": {
            "id": "ws-kRsDRPtTmtcEme4t",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks/task-tBXYu8GVAFBpcmPm"
      }
  }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "page-size": 20,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 1
    }
  }
}
```

## Show Workspace Run Task

`GET /workspaces/:workspace_id/tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the workspace task to show. Use the ["List Workspace Run Tasks"](#list-workspace-run-tasks) endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`) | The request was successful
[404][] | [JSON API error object][]               | Workspace run task not found or user unauthorized to perform action

### Sample Request

```shell
curl --request GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks/wstask-tBXYu8GVAFBpcmPm
```

### Sample Response

```json
{
  "data": {
    "id": "wstask-tBXYu8GVAFBpcmPm",
      "type": "workspace-tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "task": {
          "data": {
            "id": "task-hu74ST39g566Q4m5",
            "type": "tasks"
          }
        },
        "workspace": {
          "data": {
            "id": "ws-kRsDRPtTmtcEme4t",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks/wstask-tBXYu8GVAFBpcmPm"
      }
  }
}
```

## Update Workspace Run Task

`PATCH /workspaces/:workspace_id/tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the task to update. Use the ["List Workspace Run Tasks"](#list-workspace-run-tasks) endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`) | The request was successful
[404][] | [JSON API error object][]               | Workspace run task not found or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                      | Type    | Default          | Description
----------------------------------------------|-------- |------------------|------------
`data.type`                                   | string  | (previous value) | Must be `"workspace-tasks"`.
`data.attributes.enforcement-level`           | string  | (previous value) | The enforcement level of the workspace run task. Must be `"advisory"` or `"mandatory"`.

### Sample Payload

```json
{
  "data": {
    "type": "workspace-tasks",
      "attributes": {
        "enforcement-level": "mandatory"
      }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks/wstask-tBXYu8GVAFBpcmPm
```

### Sample Response

```json
{
  "data": {
    "id": "wstask-tBXYu8GVAFBpcmPm",
      "type": "workspace-tasks",
      "attributes": {
        "enforcement-level": "mandatory"
      },
      "relationships": {
        "task": {
          "data": {
            "id": "task-hu74ST39g566Q4m5",
            "type": "tasks"
          }
        },
        "workspace": {
          "data": {
            "id": "ws-kRsDRPtTmtcEme4t",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks/task-tBXYu8GVAFBpcmPm"
      }
  }
}
```

## Delete Workspace Task

`DELETE /workspaces/:workspace_id/tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the Workspace run task to delete. Use the ["List Workspace Run Tasks"](#list-workspace-run-tasks) endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the workspace run task
[404][] | [JSON API error object][] | Workspace run task not found, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/workspaces/ws-kRsDRPtTmtcEme4t/tasks/wstask-tBXYu8GVAFBpcmPm
```
