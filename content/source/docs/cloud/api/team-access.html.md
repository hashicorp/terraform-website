---
layout: enterprise2
page_title: "Team Acccess - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-team-access"
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

# Team access API

The team access APIs are used to associate a team to permissions on a workspace. A single `team-workspace` resource contains the relationship between the Team and Workspace, including the privileges the team has on the workspace.

-> **Note**: A `team-workspace` resource represents a team's _local_ permissions on a specific workspace. Teams can also have _organization-level_ permissions that grant access to workspaces, and TFE uses whichever access level is higher. (For example: a team with the "manage workspaces" permission has admin access on all workspaces, even if their `team-workspace` on a particular workspace only grants read access.) For more information, see [Managing Workspace Access](../users-teams-organizations/teams.html#managing-workspace-access).

## List Team Access to Workspaces

`GET /team-workspaces`

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
  "https://app.terraform.io/api/v2/team-workspaces?filter%5Bworkspace%5D%5Bid%5D=ws-5vBKrazjYR36gcYX"
```

### Sample Response

```json
{
  "data": [
    {
      "id":"131",
      "type":"team-workspaces",
      "attributes": {
        "access":"read"
      },
      "relationships": {
        "team": {
          "data": {
            "id":"team-BUHBEM97xboT8TVz",
            "type":"teams"
          },
          "links": {
            "related":"/api/v2/teams/devs"
          }
        },
        "workspace": {
          "data": {
            "id":"ws-5vBKrazjYR36gcYX",
            "type":"workspaces"
          },
          "links": {
            "related":"/api/v2/organizations/my-organization/workspaces/ws-5vBKrazjYR36gcYX"
          }
        }
      },
      "links": {
        "self":"/api/v2/team-workspaces/131"
      }
    }
  ]
}
```

## Add Team Access to a Workspace

`POST /team-workspaces`

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                 | Type   | Default | Description
-----------------------------------------|--------|---------|------------
`data.type`                              | string |         | Must be `"team-workspaces"`.
`data.attributes.access`                 | string |         | The type of access to grant. Valid values are `read`, `plan`, `write`, or `admin`.
`data.relationships.workspace.data.type` | string |         | Must be `workspaces`.
`data.relationships.workspace.data.id`   | string |         | The workspace ID to which the team is to be added.
`data.relationships.team.data.type`      | string |         | Must be `teams`.
`data.relationships.team.data.id`        | string |         | The ID of the team to add to the workspace.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "access":"read"
    },
    "relationships": {
      "workspace": {
        "data": {
          "type":"workspaces",
          "id":"ws-5vBKrazjYR36gcYX"
        }
      },
      "team": {
        "data": {
          "type":"teams",
          "id":"team-BUHBEM97xboT8TVz"
        }
      }
    },
    "type":"team-workspaces"
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
    "id":"131",
    "type":"team-workspaces",
    "attributes": {
      "access":"read"
    },
    "relationships": {
      "team": {
        "data": {
          "id":"team-BUHBEM97xboT8TVz",
          "type":"teams"
        },
        "links": {
          "related":"/api/v2/teams/devs"
        }
      },
      "workspace": {
        "data": {
          "id":"ws-5vBKrazjYR36gcYX",
          "type":"workspaces"
        },
        "links": {
          "related":"/api/v2/organizations/my-organization/workspaces/ws-5vBKrazjYR36gcYX"
        }
      }
    },
    "links": {
      "self":"/api/v2/team-workspaces/131"
    }
  }
}
```

## Show Team Access to a Workspace

`GET /team-workspaces/:id``

Parameter | Description
----------|------------
`:id`     | The ID of the team/workspace relationship. Obtain this from the [list team access action](#list-team-access-to-workspaces) described above.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/team-workspaces/257525
```

### Sample Response

```json
{
  "data": {
    "type": "team-workspaces",
    "id": "1",
    "attributes": { "permission": "read" }
  }
}
```

## Remove Team Access to a Workspace

`DELETE /team-workspaces/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the team/workspace relationship. Obtain this from the [list team access action](#list-team-access-to-workspaces) described above.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/team-workspaces/257525
```
