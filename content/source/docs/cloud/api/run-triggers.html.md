---
layout: "cloud"
page_title: "Run Triggers - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Run Triggers API

## Create a Run Trigger

`POST /workspaces/:workspace_id/run-triggers`

Parameter            | Description
---------------------|------------
`:workspace_id`      | The ID of the workspace to create the run trigger in. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.


Status  | Response                                       | Reason
--------|------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "run-triggers"`) | Successfully created a run trigger
[404][] | [JSON API error object][]                      | Workspace or sourceable not found or user unauthorized to perform action
[422][] | [JSON API error object][]                      | Malformed request body (missing attributes, wrong types, etc.)

### Permissions

In order to create a run trigger, the user must have admin access to the specified workspace and permission to read runs for the sourceable workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                          | Type            | Default | Description
--------------------------------------------------|-----------------|---------|------------
`data.relationships.sourceable.data`              | object          |         | A JSON API relationship object that represents the source workspace for the run trigger. This object must have `id` and `type` properties, and the `type` property must be `workspaces` (e.g. `{ "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }`). Obtain workspace IDs from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.

### Sample Payload

```json
{
  "data": {
    "relationships": {
      "sourceable": {
        "data": {
          "id": "ws-2HRvNs49EWPjDqT1",
          "type": "workspaces"
        }
      }
    }
  }
}
```

### Sample Request

```shell
curl \
  --request POST \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-XdeUVMWShTesDMME/run-triggers
```

### Sample Response

```json
{
  "data": {
    "id": "rt-3yVQZvHzf5j3WRJ1",
    "type": "run-triggers",
     "attributes": {
       "workspace-name": "workspace-1",
       "sourceable-name": "workspace-2",
       "created-at": "2018-09-11T18:21:21.784Z"
    },
    "relationships": {
      "workspace": {
        "data": {
          "id": "ws-XdeUVMWShTesDMME",
          "type": "workspaces"
        }
      },
      "sourceable": {
        "data": {
          "id": "ws-2HRvNs49EWPjDqT1",
          "type": "workspaces"
        }
      }
    },
    "links": {
      "self": "/api/v2/run-triggers/rt-3yVQZvHzf5j3WRJ1"
    }
  }
}
```

## List Run Triggers

`GET /workspaces/:workspace_id/run-triggers`

Parameter            | Description
---------------------|------------
`:workspace_id` | The ID of the workspace to list run triggers for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.

Status  | Response                                       | Reason
--------|------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "run-triggers"`) | Request was successful
[400][] | [JSON API error object][]                      | Required parameter `filter[run-trigger][type]` is missing or has been given an invalid value
[404][] | [JSON API error object][]                      | Workspace not found or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                   | Description
----------------------------|------------
`filter[run-trigger][type]` | **Required** Which type of run triggers to list; valid values are `inbound` or `outbound`. `inbound` run triggers create runs in the specified workspace, and `outbound` run triggers create runs in other workspaces.
`page[size]`                | **Optional.** If omitted, the endpoint will return 20 run triggers per page.

### Permissions

In order to list run triggers, the user must have permission to read runs for the specified workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Sample Request

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-XdeUVMWShTesDMME/run-triggers?filter%5Brun-trigger%5D%5Btype%5D=inbound
```

### Sample Response

```json
{
  "data": [
    {
      "id": "rt-WygcwSBuYaQWrM39",
      "type": "run-triggers",
      "attributes": {
        "workspace-name": "workspace-1",
        "sourceable-name": "workspace-2",
        "created-at": "2018-09-11T18:21:21.784Z"
      },
      "relationships": {
        "workspace": {
          "data": {
            "id": "ws-XdeUVMWShTesDMME",
            "type": "workspaces"
          }
        },
        "sourceable": {
          "data": {
            "id": "ws-2HRvNs49EWPjDqT1",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/run-triggers/rt-WygcwSBuYaQWrM39"
      }
    },
    {
      "id": "rt-8F5JFydVYAmtTjET",
      "type": "run-triggers",
      "attributes": {
        "workspace-name": "workspace-1",
        "sourceable-name": "workspace-3",
        "created-at": "2018-09-11T18:21:21.784Z"
      },
      "relationships": {
        "workspace": {
          "data": {
            "id": "ws-XdeUVMWShTesDMME",
            "type": "workspaces"
          }
        },
        "sourceable": {
          "data": {
            "id": "ws-BUHBEM97xboT8TVz",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/run-triggers/rt-8F5JFydVYAmtTjET"
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/workspaces/ws-xdiJLyGpCugbFDE1/run-triggers?filter%5Brun-trigger%5D%5Btype%5D=inbound&page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/workspaces/ws-xdiJLyGpCugbFDE1/run-triggers?filter%5Brun-trigger%5D%5Btype%5D=inbound&page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/workspaces/ws-xdiJLyGpCugbFDE1/run-triggers?filter%5Brun-trigger%5D%5Btype%5D=inbound&page%5Bnumber%5D=1&page%5Bsize%5D=20"
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

## Show a Run Trigger

`GET /run-triggers/:run_trigger_id`

Parameter             | Description
----------------------|------------
`:run_trigger_id`     | The ID of the run trigger to show. Use the "List Run Triggers" endpoint to find IDs.

Status  | Response                                       | Reason
--------|------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "run-triggers"`) | The request was successful
[404][] | [JSON API error object][]                      | Run trigger not found or user unauthorized to perform action

### Permissions

In order to show a run trigger, the user must have permission to read runs for either the workspace or sourceable workspace of the specified run trigger. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Sample Request

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/run-triggers/rt-3yVQZvHzf5j3WRJ1
```

### Sample Response

```json
{
  "data": {
    "id": "rt-3yVQZvHzf5j3WRJ1",
    "type": "run-triggers",
     "attributes": {
       "workspace-name": "workspace-1",
       "sourceable-name": "workspace-2",
       "created-at": "2018-09-11T18:21:21.784Z"
    },
    "relationships": {
      "workspace": {
        "data": {
          "id": "ws-XdeUVMWShTesDMME",
          "type": "workspaces"
        }
      },
      "sourceable": {
        "data": {
          "id": "ws-2HRvNs49EWPjDqT1",
          "type": "workspaces"
        }
      }
    },
    "links": {
      "self": "/api/v2/run-triggers/rt-3yVQZvHzf5j3WRJ1"
    }
  }
}
```

## Delete a Run Trigger

`DELETE /run-triggers/:run_trigger_id`

Parameter             | Description
----------------------|------------
`:run_trigger_id`     | The ID of the run trigger to delete. Use the "List Run Triggers" endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the run trigger
[404][] | [JSON API error object][] | Run trigger not found or user unauthorized to perform action

### Permissions

In order to delete a run trigger, the user must have admin access to the specified workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Sample Request

```shell
curl \
  --request DELETE \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/run-triggers/rt-3yVQZvHzf5j3WRJ1
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

These includes respect read permissions. If you do not have access to read the related resource, it will not be returned.

* `workspace` - The full workspace object.
* `sourceable` - The full source workspace object.
