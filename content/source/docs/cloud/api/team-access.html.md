---
layout: "cloud"
page_title: "Team Acccess - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Team Access API

-> **Note:** Team management is a paid feature, available as part of the **Team** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

The team access APIs are used to associate a team to permissions on a workspace. A single `team-workspace` resource contains the relationship between the Team and Workspace, including the privileges the team has on the workspace.

-> **Note**: A `team-workspace` resource represents a team's _local_ permissions on a specific workspace. Teams can also have _organization-level_ permissions that grant access to workspaces, and Terraform Cloud uses whichever access level is higher. (For example: a team with the "manage workspaces" permission has admin access on all workspaces, even if their `team-workspace` on a particular workspace only grants read access.) For more information, see [Managing Workspace Access](../users-teams-organizations/teams.html#managing-workspace-access).

## List Team Access to a Workspace

`GET /team-workspaces`

Status  | Response                                          | Reason
--------|---------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "team-workspaces"`) | The request was successful
[404][] | [JSON API error object][]                         | Workspace not found or user unauthorized to perform action

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter               | Description
------------------------|------------
`filter[workspace][id]` | **Required.** The workspace ID to list team access for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  "https://app.terraform.io/api/v2/team-workspaces?filter%5Bworkspace%5D%5Bid%5D=ws-XGA52YVykdTgryTN"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "tws-19iugLwoNgtWZbKP",
      "type": "team-workspaces",
      "attributes": {
        "access": "custom",
        "runs": "apply",
        "variables": "none",
        "state-versions": "none",
        "sentinel-mocks": "none",
        "workspace-locking": false
      },
      "relationships": {
        "team": {
          "data": {
            "id": "team-DBycxkdQrGFf5zEM",
            "type": "teams"
          },
          "links": {
            "related": "/api/v2/teams/team-DBycxkdQrGFf5zEM"
          }
        },
        "workspace": {
          "data": {
            "id": "ws-XGA52YVykdTgryTN",
            "type": "workspaces"
          },
          "links": {
            "related": "/api/v2/organizations/my-organization/workspaces/my-workspace"
          }
        }
      },
      "links": {
        "self": "/api/v2/team-workspaces/tws-19iugLwoNgtWZbKP"
      }
    }
  ]
}
```

## Show a Team Access relationship

`GET /team-workspaces/:id`

Status  | Response                                          | Reason
--------|---------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "team-workspaces"`) | The request was successful
[404][] | [JSON API error object][]                         | Team access not found or user unauthorized to perform action

Parameter | Description
----------|------------
`:id`     | The ID of the team/workspace relationship. Obtain this from the [list team access action](#list-team-access-to-a-workspace) described above.

-> **Note:** As mentioned in [Add Team Access to a Workspace](#add-team-access-to-a-workspace) and [Update Team Access
to a Workspace](#update-team-access-to-a-workspace), several permission attributes are not editable unless `access` is
set to `custom`. When access is `read`, `plan`, `write`, or `admin`, these attributes are read-only and reflect the
implicit permissions granted to the current access level.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/team-workspaces/tws-s68jV4FWCDwWvQq8
```

### Sample Response

```json
{
  "data": {
    "id": "tws-s68jV4FWCDwWvQq8",
    "type": "team-workspaces",
    "attributes": {
      "access": "write",
      "runs": "apply",
      "variables": "write",
      "state-versions": "write",
      "sentinel-mocks": "read",
      "workspace-locking": true
    },
    "relationships": {
      "team": {
        "data": {
          "id": "team-DBycxkdQrGFf5zEM",
          "type": "teams"
        },
        "links": {
          "related": "/api/v2/teams/team-DBycxkdQrGFf5zEM"
        }
      },
      "workspace": {
        "data": {
          "id": "ws-XGA52YVykdTgryTN",
          "type": "workspaces"
        },
        "links": {
          "related": "/api/v2/organizations/my-organization/workspaces/my-workspace"
        }
      }
    },
    "links": {
      "self": "/api/v2/team-workspaces/tws-s68jV4FWCDwWvQq8"
    }
  }
}
```

## Add Team Access to a Workspace

`POST /team-workspaces`

Status  | Response                                          | Reason
--------|---------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "team-workspaces"`) | The request was successful
[404][] | [JSON API error object][]                         | Workspace or Team not found or user unauthorized to perform action
[422][] | [JSON API error object][]                         | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                 | Type    | Default | Description
-----------------------------------------|-------- |---------|------------
`data.type`                              | string  |         | Must be `"team-workspaces"`.
`data.attributes.access`                 | string  |         | The type of access to grant. Valid values are `read`, `plan`, `write`, `admin`, or `custom`.
`data.attributes.runs`                   | string  | "read"  | If `access` is `custom`, the permission to grant for the workspace's runs. Can only be used when `access` is `custom`. Valid values include `read`, `plan`, or `apply`.
`data.attributes.variables`              | string  | "none"  | If `access` is `custom`, the permission to grant for the workspace's variables. Can only be used when `access` is `custom`. Valid values include `none`, `read`, or `write`.
`data.attributes.state-versions`         | string  | "none"  | If `access` is `custom`, the permission to grant for the workspace's state versions. Can only be used when `access` is `custom`. Valid values include `none`, `read-outputs`, `read`, or `write`.
`data.attributes.sentinel-mocks`         | string  | "none"  | If `access` is `custom`, the permission to grant for the workspace's Sentinel mocks. Can only be used when `access` is `custom`. Valid values include `none`, or `read`.
`data.attributes.workspace-locking`      | boolean | false   | If `access` is `custom`, the permission granting the ability to manually lock or unlock the workspace. Can only be used when `access` is `custom`.
`data.relationships.workspace.data.type` | string  |         | Must be `workspaces`.
`data.relationships.workspace.data.id`   | string  |         | The workspace ID to which the team is to be added.
`data.relationships.team.data.type`      | string  |         | Must be `teams`.
`data.relationships.team.data.id`        | string  |         | The ID of the team to add to the workspace.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "access": "custom",
      "runs": "apply",
      "variables": "none",
      "state-versions": "read-outputs",
      "plan-outputs": "none",
      "sentinel-mocks": "read",
      "workspace-locking": false
    },
    "relationships": {
      "workspace": {
        "data": {
          "type": "workspaces",
          "id": "ws-XGA52YVykdTgryTN"
        }
      },
      "team": {
        "data": {
          "type": "teams",
          "id": "team-DBycxkdQrGFf5zEM"
        }
      }
    },
    "type": "team-workspaces"
  }
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/team-workspaces
```

### Sample Response

```json
{
  "data": {
    "id": "tws-sezDAcCYWLnd3xz2",
    "type": "team-workspaces",
    "attributes": {
      "access": "custom",
      "runs": "apply",
      "variables": "none",
      "state-versions": "read-outputs",
      "sentinel-mocks": "read",
      "workspace-locking": false
    },
    "relationships": {
      "team": {
        "data": {
          "id": "team-DBycxkdQrGFf5zEM",
          "type": "teams"
        },
        "links": {
          "related": "/api/v2/teams/team-DBycxkdQrGFf5zEM"
        }
      },
      "workspace": {
        "data": {
          "id": "ws-XGA52YVykdTgryTN",
          "type": "workspaces"
        },
        "links": {
          "related": "/api/v2/organizations/my-organization/workspaces/my-workspace"
        }
      }
    },
    "links": {
      "self": "/api/v2/team-workspaces/tws-sezDAcCYWLnd3xz2"
    }
  }
}
```

## Update Team Access to a Workspace

`PATCH /team-workspaces/:id`

Status  | Response                                          | Reason
--------|---------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "team-workspaces"`) | The request was successful
[404][] | [JSON API error object][]                         | Team Access not found or user unauthorized to perform action
[422][] | [JSON API error object][]                         | Malformed request body (missing attributes, wrong types, etc.)

Parameter                                |         |         | Description
-----------------------------------------|---------|---------| --------------
`:id`                                    |         |         | The ID of the team/workspace relationship. Obtain this from the [list team access action](#list-team-access-to-workspaces) described above.
`data.attributes.access`                 | string  |         | The type of access to grant. Valid values are `read`, `plan`, `write`, `admin`, or `custom`.
`data.attributes.runs`                   | string  | "read"  | If `access` is `custom`, the permission to grant for the workspace's runs. Can only be used when `access` is `custom`.
`data.attributes.variables`              | string  | "none"  | If `access` is `custom`, the permission to grant for the workspace's variables. Can only be used when `access` is `custom`.
`data.attributes.state-versions`         | string  | "none"  | If `access` is `custom`, the permission to grant for the workspace's state versions. Can only be used when `access` is `custom`.
`data.attributes.sentinel-mocks`         | string  | "none"  | If `access` is `custom`, the permission to grant for the workspace's Sentinel mocks. Can only be used when `access` is `custom`.
`data.attributes.workspace-locking`      | boolean | false   | If `access` is `custom`, the permission granting the ability to manually lock or unlock the workspace. Can only be used when `access` is `custom`.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/team-workspaces/tws-s68jV4FWCDwWvQq8
```

### Sample Payload
```json
{
  "data": {
    "attributes": {
      "access": "custom",
      "state-versions": "none"
    }
  }
}
```

### Sample Response

```json
{
  "data": {
    "id": "tws-s68jV4FWCDwWvQq8",
    "type": "team-workspaces",
    "attributes": {
      "access": "custom",
      "runs": "apply",
      "variables": "write",
      "state-versions": "none",
      "sentinel-mocks": "read",
      "workspace-locking": true
    },
    "relationships": {
      "team": {
        "data": {
          "id": "team-DBycxkdQrGFf5zEM",
          "type": "teams"
        },
        "links": {
          "related": "/api/v2/teams/team-DBycxkdQrGFf5zEM"
        }
      },
      "workspace": {
        "data": {
          "id": "ws-XGA52YVykdTgryTN",
          "type": "workspaces"
        },
        "links": {
          "related": "/api/v2/organizations/my-organization/workspaces/my-workspace"
        }
      }
    },
    "links": {
      "self": "/api/v2/team-workspaces/tws-s68jV4FWCDwWvQq8"
    }
  }
}
```

## Remove Team Access to a Workspace

`DELETE /team-workspaces/:id`

Status  | Response                                          | Reason
--------|---------------------------------------------------|----------
[204][] |                                                   | The Team Access was successfully destroyed
[404][] | [JSON API error object][]                         | Team Access not found or user unauthorized to perform action

Parameter | Description
----------|------------
`:id`     | The ID of the team/workspace relationship. Obtain this from the [list team access action](#list-team-access-to-workspaces) described above.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/team-workspaces/tws-sezDAcCYWLnd3xz2
```
