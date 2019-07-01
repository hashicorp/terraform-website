---
layout: enterprise2
page_title: "Policy Sets - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-policy-sets"
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
[JSON API document]: /docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Policy Sets API

[Sentinel Policy as Code](../sentinel/index.html) is an embedded policy as code framework integrated with Terraform Enterprise.

Policy sets are groups of policies that are applied together to related workspaces. By using policy sets, you can group your policies by attributes such as environment or region. Individual policies that are members of policy sets will only be checked for workspaces that the policy set is attached to. In order for a policy to be active and checked during runs, it must be a member of at least one policy set that is attached to workspaces.

This page documents the API endpoints to create, read, update, and delete policy sets in an organization. To view and manage policies, use the [Policies API](./policies.html).

## Create a Policy Set

`POST /organizations/:organization_name/policy-sets`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to create the policy set in. The organization must already exist in the system, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[201][] | [JSON API document][] (`type: "policy-sets"`) | Successfully created a policy set
[404][] | [JSON API error object][]                     | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                     | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                               | Type            | Default | Description
---------------------------------------|-----------------|---------|------------
`data.type`                            | string          |         | Must be `"policy-sets"`.
`data.attributes.name`                 | string          |         | The name of the policy set. Can include letters, numbers, `-`, and `_`.
`data.attributes.description`          | string          | `null`  | A description of the set's purpose. This field supports Markdown and will be rendered in the Terraform Enterprise UI.
`data.attributes.global`               | boolean         | `false` | Whether or not this policies in this set should be checked on all of the organization's workspaces, or only on workspaces the policy set is attached to.
`data.relationships.policies.data[]`   | array\[object\] | `[]`    | A list of resource identifier objects that defines which policies will be members of the new set. These objects must contain `id` and `type` properties, and the `type` property must be `policies` (e.g. `{ "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }`).
`data.relationships.workspaces.data[]` | array\[object\] | `[]`    | A list of resource identifier objects that defines which workspaces the new set will be attached to. These objects must contain `id` and `type` properties, and the `type` property must be `workspaces` (e.g. `{ "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }`). Obtain workspace IDs from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. Individual Workspaces cannot be attached to the policy set when `data.attributes.global` is `true`.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name": "production",
      "description": "This set contains policies that should be checked on all production infrastructure workspaces.",
      "global": false
    },
    "relationships": {
      "policies": {
        "data": [
          { "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }
        ]
      },
      "workspaces": {
        "data": [
          { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
        ]
      }
    },
    "type": "policy-sets"
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
  https://app.terraform.io/api/v2/organizations/my-organization/policy-sets
```

### Sample Response

```json
{
  "data": {
    "id":"polset-3yVQZvHzf5j3WRJ1",
    "type":"policy-sets",
    "attributes": {
      "name": "production",
      "description": "This set contains policies that should be checked on all production infrastructure workspaces.",
      "global": false,
      "policy-count": 1,
      "workspace-count": 1,
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z",
    },
    "relationships": {
      "organization": {
        "data": { "id": "my-organization", "type": "organizations" }
      },
      "policies": {
        "data": [
          { "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }
        ]
      },
      "workspaces": {
        "data": [
          { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
        ]
      }
    },
    "links": {
      "self":"/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1"
    }
  }
}
```

## List policy sets

`GET /organizations/:organization_name/policy-sets`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to list policy sets for.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "policy-sets"`) | Request was successful
[404][] | [JSON API error object][]                     | Organization not found, or user unauthorized to perform action


### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 policy sets per page.
`search[name]` | **Optional.** Allows searching the organization's policy sets by name.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/policy-sets
```

### Sample Response

```json
{
  "data": [
    {
      "id":"polset-3yVQZvHzf5j3WRJ1",
      "type":"policy-sets",
      "attributes": {
        "name": "production",
        "description": "This set contains policies that should be checked on all production infrastructure workspaces.",
        "global": false,
        "policy-count": 1,
        "workspace-count": 1,
        "created-at": "2018-09-11T18:21:21.784Z",
        "updated-at": "2018-09-11T18:21:21.784Z",
      },
      "relationships": {
        "organization": {
          "data": { "id": "my-organization", "type": "organizations" }
        },
        "policies": {
          "data": [
            { "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }
          ]
        },
        "workspaces": {
          "data": [
            { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
          ]
        }
      },
      "links": {
        "self":"/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1"
      }
    },
  ]
}
```

## Show a Policy Set

`GET /policy-sets/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to show. Use the "List Policy Sets" endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "policy-sets"`) | The request was successful
[404][] | [JSON API error object][]                     | Policy set not found or user unauthorized to perform action


### Sample Request

```shell
curl --request GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1
```

### Sample Response

```json
{
  "data": {
    "id":"polset-3yVQZvHzf5j3WRJ1",
    "type":"policy-sets",
    "attributes": {
      "name": "production",
      "description": "This set contains policies that should be checked on all production infrastructure workspaces.",
      "global": false,
      "policy-count": 1,
      "workspace-count": 1,
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z",
    },
    "relationships": {
      "organization": {
        "data": { "id": "my-organization", "type": "organizations" }
      },
      "policies": {
        "data": [
          { "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }
        ]
      },
      "workspaces": {
        "data": [
          { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
        ]
      }
    },
    "links": {
      "self":"/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1"
    }
  }
}
```

-> **Note:** The `data.relationships.workspaces` refers to workspaces directly attached to the policy set. This key is omitted for policy sets marked as global; in this case, global policy sets are implicitly related to all of the organization's workspaces.

## Update a Policy Set

`PATCH /policy-sets/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to update. Use the "List Policy Sets" endpoint to find IDs.

Status  | Response                                      | Reason
--------|-----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "policy-sets"`) | The request was successful
[404][] | [JSON API error object][]                     | Policy set not found or user unauthorized to perform action
[422][] | [JSON API error object][]                     | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                      | Type    | Default          | Description
------------------------------|-------- |------------------|------------
`data.type`                   | string  |                  | Must be `"policy-sets"`.
`data.attributes.name`        | string  | (previous value) | The name of the policy set. Can include letters, numbers, `-`, and `_`.
`data.attributes.description` | string  | (previous value) | A description of the set's purpose. This field supports Markdown and will be rendered in the Terraform Enterprise UI.
`data.attributes.global`      | boolean | (previous value) | Whether or not this policies in this set should be checked on all of the organization's workspaces, or only on workspaces directly attached to the set.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name": "a-global-set",
      "description": "**WARNING:** Any policies added to this set will be checked in _all_ workspaces!",
      "global": true
    },
    "type": "policy-sets"
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
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1
```

### Sample Response

```json
{
  "data": {
    "id":"polset-3yVQZvHzf5j3WRJ1",
    "type":"policy-sets",
    "attributes": {
      "name": "a-global-set",
      "description": "**WARNING:** Any policies added to this set will be checked in _all_ workspaces!",
      "global": true,
      "policy-count": 1,
      "workspace-count": 4,
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z",
    },
    "relationships": {
      "organization": {
        "data": { "id": "my-organization", "type": "organizations" }
      },
      "policies": {
        "data": [
          { "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }
        ]
      }
    },
    "links": {
      "self":"/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1"
    }
  }
}
```

## Add Policies to the Policy Set

`POST /policy-sets/:id/relationships/policies`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to add policies to. Use the "List Policy Sets" endpoint to find IDs.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | The request was successful
[404][] | [JSON API error object][] | Policy set not found or user unauthorized to perform action
[422][] | [JSON API error object][] | Malformed request body (one or more policies not found, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path | Type            | Default | Description
---------|-----------------|---------|------------
`data[]` | array\[object\] |         | A list of resource identifier objects that defines which policies will be added to the set. These objects must contain `id` and `type` properties, and the `type` property must be `policies` (e.g. `{ "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }`).

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
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1/relationships/policies
```

## Attach a Policy Set to workspaces

`POST /policy-sets/:id/relationships/workspaces`

Parameter | Description
----------|------------
`:id`     | The ID of the policy set to attach to workspaces. Use the "List Policy Sets" endpoint to find IDs.

-> **Note:** Policy sets marked as global cannot be attached to individual workspaces.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | The request was successful
[404][] | [JSON API error object][] | Policy set not found or user unauthorized to perform action
[422][] | [JSON API error object][] | Malformed request body (one or more workspaces not found, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path | Type            | Default | Description
---------|-----------------|---------|------------
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
  --request DELETE \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `policies` - Policies that are a member of this set.
* `workspaces` - Workspaces that this set are attached to.
