---
layout: "cloud"
page_title: "Policy Sets - API Docs - Terraform Cloud"
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
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Policy Sets API

[Sentinel Policy as Code](../sentinel/index.html) is an embedded policy as code framework integrated with Terraform Cloud.

Policy sets are groups of policies that are applied together to related workspaces. By using policy sets, you can group your policies by attributes such as environment or region. Individual policies within a policy set will only be checked for workspaces that the policy set is attached to. Policy sets can group indidual policies created via the [policies API](./policies.html), or act as versioned sets which are either sourced from a version control system (such as GitHub) or uploaded as a whole via the [policy set versions API](#create-a-policy-set-version).

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

Key path                                      | Type            | Default | Description
----------------------------------------------|-----------------|---------|------------
`data.type`                                   | string          |         | Must be `"policy-sets"`.
`data.attributes.name`                        | string          |         | The name of the policy set. Can include letters, numbers, `-`, and `_`.
`data.attributes.description`                 | string          | `null`  | A description of the set's purpose. This field supports Markdown and will be rendered in the Terraform Cloud UI.
`data.attributes.global`                      | boolean         | `false` | Whether or not this policies in this set should be checked on all of the organization's workspaces, or only on workspaces the policy set is attached to.
`data.attributes.vcs-repo`                    | object          | `null`  | VCS repository information. When present, the policies and configuration will be sourced from the specified VCS repository instead of being defined within Terraform Cloud. Note that this option and `policies` relationships are mutually exclusive and may not be used simultaneously.
`data.attributes.vcs-repo.branch`             | string          | `null`  | The branch of the VCS repo. If empty, the VCS provider's default branch value will be used.
`data.attributes.vcs-repo.identifier`         | string          |         | The identifier of the VCS repository in the format `<namespace>/<repo>`. For example, on GitHub, this would be something like `hashicorp/my-policy-set`. The format for Azure DevOps is `<org>/<project>/_git/<repo>`.
`data.attributes.vcs-repo.oauth-token-id`     | string          |         | The OAuth Token ID to use to connect to the VCS host.
`data.attributes.vcs-repo.ingress-submodules` | boolean         | `false` | Determines whether repository submodules will be instantiated during the clone operation.
`data.attributes.policies-path`               | string          | `null`  | The subdirectory of the attached VCS repository that contains the policies for this policy set. Files and directories outside of this sub-path will be ignored, and changes to those unrelated files won't cause the policy set to be updated. This option may only be specified when a VCS repo is present.
`data.relationships.workspaces.data[]`        | array\[object\] | `[]`    | A list of resource identifier objects that defines which workspaces the new set will be attached to. These objects must contain `id` and `type` properties, and the `type` property must be `workspaces` (e.g. `{ "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }`). Obtain workspace IDs from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. Individual workspaces cannot be attached to the policy set when `data.attributes.global` is `true`.
`data.relationships.policies.data[]`          | array\[object\] | `[]`    | **DEPRECATED.** A list of resource identifier objects that defines which policies will be members of the new set. These objects must contain `id` and `type` properties, and the `type` property must be `policies` (e.g. `{ "id": "pol-u3S5p2Uwk21keu1s", "type": "policies" }`). **Important:** This deprecated option will be removed in the future in favor of VCS policy sets.

### Sample Payload

```json
{
  "data": {
    "type": "policy-sets",
    "attributes": {
      "name": "production",
      "description": "This set contains policies that should be checked on all production infrastructure workspaces.",
      "global": false,
      "policies-path": "/policy-sets/foo",
      "vcs-repo": {
        "branch": "master",
        "identifier": "hashicorp/my-policy-sets",
        "ingress-submodules": false,
        "oauth-token-id": "ot-7Fr9d83jWsi8u23A"
      }
    },
    "relationships": {
      "workspaces": {
        "data": [
          { "id": "ws-2HRvNs49EWPjDqT1", "type": "workspaces" }
        ]
      }
    }
  }
}
```

### Sample payload with individual policy relationships (deprecated)

```json
{
  "data": {
    "type": "policy-sets",
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
      "workspace-count": 1,
      "policies-path": "/policy-sets/foo",
      "versioned": true,
      "vcs-repo": {
        "branch": "master",
        "identifier": "hashicorp/my-policy-sets",
        "ingress-submodules": false,
        "oauth-token-id": "ot-7Fr9d83jWsi8u23A"
      },
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z"
    },
    "relationships": {
      "organization": {
        "data": { "id": "my-organization", "type": "organizations" }
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

### Sample response with individual policy relationships (deprecated)

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
      "versioned": false,
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z"
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

## List Policy Sets

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

Parameter           | Description
--------------------|------------
`filter[versioned]` | **Optional.** Allows filtering policy sets based on whether they are versioned (VCS-managed or API-managed), or use individual policy relationships. Accepts a boolean true/false value. A `true` value returns versioned sets, and a `false` value returns sets with individual policy relationships. If omitted, all policy sets are returned.
`include`           | **Optional.** Allows including related resource data. Value must be a comma-separated list containing one or more of `workspaces`, `policies`, `newest_version`, or `current_version`. See the [relationships section](#relationships) for details.
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 policy sets per page.
`search[name]`      | **Optional.** Allows searching the organization's policy sets by name.

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
        "workspace-count": 1,
        "policies-path": "/policy-sets/foo",
        "versioned": true,
        "vcs-repo": {
          "branch": "master",
          "identifier": "hashicorp/my-policy-sets",
          "ingress-submodules": false,
          "oauth-token-id": "ot-7Fr9d83jWsi8u23A"
        },
        "created-at": "2018-09-11T18:21:21.784Z",
        "updated-at": "2018-09-11T18:21:21.784Z"
      },
      "relationships": {
        "organization": {
          "data": { "id": "my-organization", "type": "organizations" }
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
  ]
}
```

### Sample response with individual policy relationships (deprecated)

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
        "versioned": false,
        "created-at": "2018-09-11T18:21:21.784Z",
        "updated-at": "2018-09-11T18:21:21.784Z"
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

Parameter | Description
----------|------------
`include` | **Optional.** Allows including related resource data. Value must be a comma-separated list containing one or more of `workspaces`, `policies`, `newest_version`, or `current_version`. See the [relationships section](#relationships) for details.

### Sample Request

```shell
curl --request GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/policy-sets/polset-3yVQZvHzf5j3WRJ1?include=current_version
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
      "policy-count": 0,
      "workspace-count": 1,
      "policies-path": "/policy-sets/foo",
      "versioned": true,
      "vcs-repo": {
        "branch": "master",
        "identifier": "hashicorp/my-policy-sets",
        "ingress-submodules": false,
        "oauth-token-id": "ot-7Fr9d83jWsi8u23A"
      },
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z"
    },
    "relationships": {
      "organization": {
        "data": { "id": "my-organization", "type": "organizations" }
      },
      "current-version": {
        "data": {
          "id": "polsetver-m4yhbUBCgyDVpDL4",
          "type": "policy-set-versions"
        }
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
  "included": [
    {
      "id": "polsetver-m4yhbUBCgyDVpDL4",
      "type": "policy-set-versions",
      "attributes": {
        "source": "github",
        "status": "ready",
        "status-timestamps": {
          "ready-at": "2019-06-21T21:29:48+00:00",
          "ingressing-at": "2019-06-21T21:29:47+00:00"
        },
        "error": null,
        "ingress-attributes": {
          "commit-sha": "8766a423cb902887deb0f7da4d9beaed432984bb",
          "commit-url": "https://github.com/hashicorp/my-policy-sets/commit/8766a423cb902887deb0f7da4d9beaed432984bb",
          "identifier": "hashicorp/my-policy-sets"
        },
        "created-at": "2019-06-21T21:29:47.792Z",
        "updated-at": "2019-06-21T21:29:48.887Z"
      },
      "relationships": {
        "policy-set": {
          "data": {
            "id": "polset-a2mJwtmKygrA11dh",
            "type": "policy-sets"
          }
        }
      },
      "links": {
        "self": "/api/v2/policy-set-versions/polsetver-E4S7jz8HMjBienLS"
      }
    }
  ]
}
```

### Sample response with individual policy relationships (deprecated)

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
      "versioned": false,
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

-> **Note:** The `data.relationships.workspaces` object refers to workspaces directly attached to the policy set. This key is omitted for policy sets marked as global, which are implicitly related to all of the organization's workspaces.

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

Key path                                      | Type    | Default          | Description
----------------------------------------------|-------- |------------------|------------
`data.type`                                   | string  |                  | Must be `"policy-sets"`.
`data.attributes.name`                        | string  | (previous value) | The name of the policy set. Can include letters, numbers, `-`, and `_`.
`data.attributes.description`                 | string  | (previous value) | A description of the set's purpose. This field supports Markdown and will be rendered in the Terraform Cloud UI.
`data.attributes.global`                      | boolean | (previous value) | Whether or not this policies in this set should be checked on all of the organization's workspaces, or only on workspaces directly attached to the set.
`data.attributes.vcs-repo`                    | object  | (previous value) | VCS repository information. When present, the policies and configuration will be sourced from the specified VCS repository instead of being defined within Terraform Cloud. Note that this option and `policies` relationships are mutually exclusive and may not be used simultaneously.
`data.attributes.vcs-repo.branch`             | string  | (previous value) | The branch of the VCS repo. If empty, the VCS provider's default branch value will be used.
`data.attributes.vcs-repo.identifier`         | string  | (previous value) | The identifier of the VCS repository in the format `<namespace>/<repo>`. For example, on GitHub, this would be something like `hashicorp/my-policy-set`. The format for Azure DevOps is `<org>/<project>/_git/<repo>`.
`data.attributes.vcs-repo.oauth-token-id`     | string  | (previous value) | The OAuth Token ID to use to connect to the VCS host.
`data.attributes.vcs-repo.ingress-submodules` | boolean | (previous value) | Determines whether repository submodules will be instantiated during the clone operation.
`data.attributes.policies-path`               | boolean | (previous value) | The subdirectory of the attached VCS repository that contains the policies for this policy set. Files and directories outside of this sub-path will be ignored, and changes to those unrelated files won't cause the policy set to be updated. This option may only be specified when a VCS repo is present.

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
      "versioned": false,
      "created-at": "2018-09-11T18:21:21.784Z",
      "updated-at": "2018-09-11T18:21:21.784Z"
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

~> **Note:** This endpoint may only be used when there is no VCS repository associated with the policy set.

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
