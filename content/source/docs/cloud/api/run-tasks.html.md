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

[Run Tasks](../workspaces/run-tasks.html) allow Terraform Cloud to execute tasks in external systems at specific points in the Terraform Cloud run lifecycle. Event Hooks are reusable configurations which can be attached to any workspace in an organization as a run task.

This page documents the API endpoints to create, read, update, and delete task event hooks in an organization, as well as how to attach them as run tasks to workspaces.

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

-------FIX ME BELOW THIS LINE-------
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
`data.type`                                   | string  |                  | Must be `"event-hooks"`.
`data.attributes.name`                        | string  | (previous value) | The name of the event hook. Can include letters, numbers, `-`, and `_ `.
`data.attributes.url`                         | string  | (previous value) | URL to send a run task payload.
`data.attributes.category`                    | string  | (previous value) | Must be `"task"`.
`data.attributes.hmac-key`                    | string  | (previous value) | Optional HMAC key to verify event hook.
`data[]` | array\[object\] |         | A list of resource identifier objects that defines the workspaces the policy set will be attached to. These objects must contain `id` and `type` properties, and the `type` property must be `workspaces` (e.g. `{ "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }`).

### Sample Payload

```json
{
  "data": [
    { "id": "ws-u3S5p2Uwk21keu1s", "type": "workspaces" },
    { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
  ]
}
```

### Sample Request

```shell
curl \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1/relationships/workspaces
```

## Remove Policies from the Policy Set

`DELETE /policy-sets/:id/relationships/policies`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to remove policies from. Use the "List Policy Sets" endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | The request was successful
[404][] | [JSON API error object][] | Policy set not found or user unauthorized to perform action
[422][] | [JSON API error object][] | Malformed request body (wrong types, etc.)

~> **Note:** This endpoint may only be used when there is no VCS repository associated with the policy set.

### Request Body

This DELETE endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path | Type            | Default | Description
---------|-----------------|---------|------------
`data[]` | array\[object\] |         | A list of resource identifier objects that defines which policies will be removed from the set. These objects must contain `id` and `type` properties, and the `type` property must be `policies` (e.g. `{ "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }`).

### Sample Payload

```json
{
  "data": [
    { "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" },
    { "id": "pol-2HRvNs49EWPjDqT1", "type": "policies" }
  ]
}
```

### Sample Request

```shell
curl \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1/relationships/policies
```

## Detach the Policy Set from workspaces

`DELETE /policy-sets/:id/relationships/workspaces`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to detach from workspaces. Use the "List Policy Sets" endpoint to find IDs.

-> **Note:** Policy sets marked as global cannot be detached from individual workspaces.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | The request was successful
[404][] | [JSON API error object][] | Policy set not found or user unauthorized to perform action
[422][] | [JSON API error object][] | Malformed request body (wrong types, etc.)


### Request Body

This DELETE endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path | Type            | Default | Description
---------|-----------------|---------|------------
`data[]` | array\[object\] |         | A list of resource identifier objects that defines which workspaces the policy set will be detached from. These objects must contain `id` and `type` properties, and the `type` property must be `workspaces` (e.g. `{ "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }`). Obtain workspace IDs from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.

### Sample Payload

```json
{
  "data": [
    { "id": "ws-u3S5p2Uwk21keu1s", "type": "workspaces" },
    { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
  ]
}
```

### Sample Request

```shell
curl \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1/relationships/workspaces
```

## Delete a Policy Set

`DELETE /policy-sets/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to delete. Use the "List Policy Sets" endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the policy set
[404][] | [JSON API error object][] | Policy set not found, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1
```

## Create a Policy Set Version

For versioned policy sets which have no VCS repository attached, versions of policy code may be uploaded directly to the API by creating a new policy set version and, in a subsequent request, uploading a tarball (tar.gz) of data to it.

`POST /policy-sets/:id/versions`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to create a new version for.

Status  | Response                                              | Reason
--------|-------------------------------------------------------|-------
[201][] | [JSON API document][] (`type: "policy-set-versions"`) | The request was successful.
[404][] | [JSON API error object][]                             | Policy set not found or user unauthorized to perform action
[422][] | [JSON API error object][]                             | The policy set does not support uploading versions.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1/versions
```

### Sample Response

```json
{
  "data": {
    "id": "polsetver-cXciu9nQwmk9Cfrn",
    "type": "policy-set-versions",
    "attributes": {
      "source": "tfe-api",
      "status": "pending",
      "status-timestamps": {},
      "error": null,
      "created-at": "2019-06-28T23:53:15.875Z",
      "updated-at": "2019-06-28T23:53:15.875Z"
    },
    "relationships": {
      "policy-set": {
        "data": {
          "id": "polset-ws1CZBzm2h5K6ZT5",
          "type": "policy-sets"
        }
      }
    },
    "links": {
      "self": "/api/v2/policy-set-versions/polsetver-cXciu9nQwmk9Cfrn",
      "upload": "https://archivist.terraform.io/v1/object/dmF1bHQ6djE6NWJPbHQ4QjV4R1ox..."
    }
  }
}
```

The `upload` link URL in the above response is valid for one hour after creation. Make a `PUT` request to this URL directly, sending the policy set contents in `tar.gz` format as the request body. Once uploaded successfully, you can request the [Show Policy Set](#show-a-policy-set) endpoint again to verify that the status has changed from `pending` to `ready`.

## Upload Policy Set Versions

`PUT https://archivist.terraform.io/v1/object/<UNIQUE OBJECT ID>`

The URL is provided in the `upload` attribute in the `policy-set-versions` resource.

### Sample Request

In the example below, `policy-set.tar.gz` is the local filename of the policy set version file to upload.

```shell
curl \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @policy-set.tar.gz \
  https://archivist.terraform.io/v1/object/dmF1bHQ6djE6NWJPbHQ4QjV4R1ox...
```

## Show a Policy Set Version

`GET /policy-set-versions/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set version to show.

Status  | Response                                              | Reason
--------|-------------------------------------------------------|-------
[200][] | [JSON API document][] (`type: "policy-set-versions"`) | The request was successful.
[404][] | [JSON API error object][]                             | Policy set version not found or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request GET \
  https://app.terraform.io/api/v2/policy-set-versions/polsetver-cXciu9nQwmk9Cfrn
```

### Sample Response

```json
{
  "data": {
    "id": "polsetver-cXciu9nQwmk9Cfrn",
    "type": "policy-set-versions",
    "attributes": {
      "source": "tfe-api",
      "status": "pending",
      "status-timestamps": {},
      "error": null,
      "created-at": "2019-06-28T23:53:15.875Z",
      "updated-at": "2019-06-28T23:53:15.875Z"
    },
    "relationships": {
      "policy-set": {
        "data": {
          "id": "polset-ws1CZBzm2h5K6ZT5",
          "type": "policy-sets"
        }
      }
    },
    "links": {
      "self": "/api/v2/policy-set-versions/polsetver-cXciu9nQwmk9Cfrn",
      "upload": "https://archivist.terraform.io/v1/object/dmF1bHQ6djE6NWJPbHQ4QjV4R1ox..."
    }
  }
}
```

The `upload` link URL in the above response is valid for one hour after the `created_at` timestamp of the policy set version. Make a `PUT` request to this URL directly, sending the policy set contents in `tar.gz` format as the request body. Once uploaded successfully, you can request the [Show Policy Set Version](#show-a-policy-set-version) endpoint again to verify that the status has changed from `pending` to `ready`.

## Relationships

The following relationships may be present in various responses:

* `workspaces`: The workspaces to which the policy set applies.
* `policies`: Individually managed policies which are associated with the policy set.
* `newest-version`: The most recently created policy set version, regardless of status. Note that this relationship may include an errored and unusable version, and is intended to allow checking for VCS errors.
* `current-version`: The most recent **successful** policy set version.
