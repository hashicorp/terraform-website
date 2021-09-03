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

-> Note: As of September 2021, Run Tasks are available only as a beta feature, and not all customers will see this functionality in their Terraform Cloud organization.

[Run tasks](../workspaces/run-tasks.html) allow Terraform Cloud to execute tasks in external systems at specific points in the Terraform Cloud run lifecycle. Event hooks are reusable configurations that you can attach to any workspace in an organization as a run task. This page lists the API endpoints for event hooks in an organization and explains how to attach event hooks as run tasks to workspaces.

Interacting with event hooks requires the organization owner permission.  Connecting event hooks to workspaces as run tasks requires the workspace administrator permission. ([More about permissions](../users-teams-organizations/permissions.html).)

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Create an Event Hook

`POST /organizations/:organization_name/event-hooks`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to create event hook in. The organization must already exist in the system, and the token authenticating the API request must have owner permission. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[201][] | [JSON API document][] (`type: "event-hooks"`) | Successfully created an event hook
[404][] | [JSON API error object][]                     | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                     | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                      | Type            | Default | Description
----------------------------------------------|-----------------|---------|------------
`data.type`                                   | string          |         | Must be `"event-hooks"`.
`data.attributes.name`                        | string          |         | The name of the event hook. Can include letters, numbers, `-`, and `_`.
`data.attributes.url`                         | string          |         | URL to send a run task payload.
`data.attributes.category`                    | string          |         | Must be `"task"`.
`data.attributes.hmac-key`                    | string          |         | Optional HMAC key to verify event hook.

### Sample Payload

```json
{
  "data": {
    "type": "event-hooks",
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
  https://app.terraform.io/api/v2/organizations/my-organization/event-hooks
```

### Sample Response

```json
{
  "data": {
    "id": "evhook-7oD7doVTQdAFnMLV",
      "type": "event-hooks",
      "attributes": {
        "category": "task",
        "name": "my-event-hook",
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
        "self": "/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV"
      }
  }
}
```

## List Event Hooks

`GET /organizations/:organization_name/event-hooks`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to list event hooks for.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "event-hooks"`) | Request was successful
[404][] | [JSON API error object][]                     | Organization not found, or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`include`           | **Optional.** Allows including related resource data. Value must be a comma-separated list containing one or more of `tasks` or `tasks.workspace`. See the [relationships section](#relationships) for details.
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 policy sets per page.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/event-hooks
```

### Sample Response

```json
{
    "data": [
        {
            "id": "evhook-7oD7doVTQdAFnMLV",
            "type": "event-hooks",
            "attributes": {
                "category": "task",
                "name": "my-event-hook",
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
                "self": "/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV"
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/organizations/hashicorp/event-hooks?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/organizations/hashicorp/event-hooks?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/organizations/hashicorp/event-hooks?page%5Bnumber%5D=1&page%5Bsize%5D=20"
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

## Show an Event Hook

`GET /event-hooks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the event hook to show. Use the "List Event Hooks" endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "event-hooks"`) | The request was successful
[404][] | [JSON API error object][]                     | Event hook not found or user unauthorized to perform action

Parameter | Description
----------|------------
`include` | **Optional.** Allows including related resource data. Value must be a comma-separated list containing one or more of `tasks` or `tasks.workspace`. See the [relationships section](#relationships) for details.

### Sample Request

```shell
curl --request GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV
```

### Sample Response

```json
{
  "data": {
    "id": "evhook-7oD7doVTQdAFnMLV",
      "type": "event-hooks",
      "attributes": {
        "category": "task",
        "name": "my-event-hook",
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
        "self": "/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV"
      }
  }
}
```

## Update an Event Hook

`PATCH /event-hooks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the event hook to update. Use the "List Event Hooks" endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "event-hooks"`) | The request was successful
[404][] | [JSON API error object][]                     | Event Hook not found or user unauthorized to perform action
[422][] | [JSON API error object][]                     | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                      | Type    | Default          | Description
----------------------------------------------|-------- |------------------|------------
`data.type`                                   | string  |                  | Must be `"event-hooks"`.
`data.attributes.name`                        | string  | (previous value) | The name of the event hook. Can include letters, numbers, `-`, and `_`.
`data.attributes.url`                         | string  | (previous value) | URL to send a run task payload.
`data.attributes.category`                    | string  | (previous value) | Must be `"task"`.
`data.attributes.hmac-key`                    | string  | (previous value) | Optional HMAC key to verify event hook.

### Sample Payload

```json
{
  "data": {
    "type": "event-hooks",
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
  https://app.terraform.io/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV
```

### Sample Response

```json
{
  "data": {
    "id": "evhook-7oD7doVTQdAFnMLV",
      "type": "event-hooks",
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
            "id": "task-xjKZw9KaeXda61az",
            "type": "tasks"
          }
          ]
        }
      },
      "links": {
        "self": "/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV"
      }
  }
}
```

## Delete an Event Hook

`DELETE /event-hooks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the event hook to delete. Use the "List Event Hooks" endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the event hook
[404][] | [JSON API error object][] | Event hook not found, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/event-hooks/evhook-7oD7doVTQdAFnMLV
```

## Attach an Event Hook to a Workspace as a Task

`POST /workspaces/:workspace_id/tasks

Parameter | Description
----------|------------
`:workspace_id` | The ID of the workspaces.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | The request was successful
[404][] | [JSON API error object][] | Workspace or event hook not found or user unauthorized to perform action
[422][] | [JSON API error object][] | Malformed request body

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path | Type            | Default | Description
---------|-----------------|---------|------------
`data.type`                                   | string |  | Must be `"tasks"`.
`data.attributes.enforcement-level`           | string |  | The enforcement level of the task. Must be `"advisory"` or `"mandatory"`.
`data.relationships.event-hook.data.id`       | string |  | The ID of the event hook.
`data.relationships.event-hook.data.type`     | string |  | Must be `"event-hooks"`.

### Sample Payload

```json
{
  "data": {
    "type": "tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "event-hook": {
          "data": {
            "id": "evhook-7oD7doVTQdAFnMLV",
            "type": "event-hooks"
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
    "id": "task-tBXYu8GVAFBpcmPm",
      "type": "tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "event-hook": {
          "data": {
            "id": "evhook-7oD7doVTQdAFnMLV",
            "type": "event-hooks"
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
        "self": "/api/v2/tasks/task-tBXYu8GVAFBpcmPm"
      }
  }
}
```

## List Tasks

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
    "id": "task-tBXYu8GVAFBpcmPm",
      "type": "tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "event-hook": {
          "data": {
            "id": "evhook-hu74ST39g566Q4m5",
            "type": "event-hooks"
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
        "self": "/api/v2/tasks/task-tBXYu8GVAFBpcmPm"
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

## Show a Task

`GET /tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the task to show. Use the "List Tasks" endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`) | The request was successful
[404][] | [JSON API error object][]               | Task not found or user unauthorized to perform action

### Sample Request

```shell
curl --request GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/tasks/task-tBXYu8GVAFBpcmPm
```

### Sample Response

```json
{
  "data": {
    "id": "task-tBXYu8GVAFBpcmPm",
      "type": "tasks",
      "attributes": {
        "enforcement-level": "advisory"
      },
      "relationships": {
        "event-hook": {
          "data": {
            "id": "evhook-hu74ST39g566Q4m5",
            "type": "event-hooks"
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
        "self": "/api/v2/tasks/task-tBXYu8GVAFBpcmPm"
      }
  }
}
```

## Update a Task

`PATCH /tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the task to update. Use the "List Tasks" endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "tasks"`) | The request was successful
[404][] | [JSON API error object][]               | Task not found or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                      | Type    | Default          | Description
----------------------------------------------|-------- |------------------|------------
`data.type`                                   | string  | (previous value) | Must be `"tasks"`.
`data.attributes.enforcement-level`           | string  | (previous value) | The enforcement level of the task. Must be `"advisory"` or `"mandatory"`.

### Sample Payload

```json
{
  "data": {
    "type": "tasks",
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
  https://app.terraform.io/api/v2/tasks/task-tBXYu8GVAFBpcmPm
```

### Sample Response

```json
{
  "data": {
    "id": "task-tBXYu8GVAFBpcmPm",
      "type": "tasks",
      "attributes": {
        "enforcement-level": "mandatory"
      },
      "relationships": {
        "event-hook": {
          "data": {
            "id": "evhook-hu74ST39g566Q4m5",
            "type": "event-hooks"
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
        "self": "/api/v2/tasks/task-tBXYu8GVAFBpcmPm"
      }
  }
}
```

## Delete a Task

`DELETE /tasks/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the Task to delete. Use the "List Tasks" endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the event hook
[404][] | [JSON API error object][] | Task not found, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/tasks/task-tBXYu8GVAFBpcmPm
```
