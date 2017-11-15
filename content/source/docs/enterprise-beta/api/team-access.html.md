---
layout: enterprise2
page_title: "Team Acccess - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-team-access"
---

# Team access API

-> **Note**: These API endpoints are in beta and are subject to change.

The team access APIs are used to associate a team to permissions on a workspace. A single `team-workspace` resource contains the relationship between the Team and Workspace, including the privileges the team has on the workspace.

## List Team Access to Workspaces

| Method | Path           |
| :----- | :------------- |
| GET | /team-workspaces |

### Parameters

- `?filter[workspace][id]` (`string: <required>`) - The workspace ID for which to list the teams with access

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://atlas.hashicorp.com/api/v2/team-workspaces?filter%5Bworkspace%5D%5Bid%5D=ws-5vBKrazjYR36gcYX
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

## Add Team access to a Workspace

| Method | Path           |
| :----- | :------------- |
| POST | /team-workspaces |

### Parameters

- `access` (`string: <required>`) - `read`, `write`, or `admin`
- `team` (`string: <required>`) - The ID of the team to add to the workspace.
- `workspace` (`string: <required>`) - The workspace ID to which the team is to be added.

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/team-workspaces
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

| Method | Path           |
| :----- | :------------- |
| GET | /team-workspaces/:id |

### Parameters

- `id` (`string: <required>`) - The ID of the team/workspace relationship.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://atlas.hashicorp.com/api/v2/team-workspaces/257525
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

| Method | Path           |
| :----- | :------------- |
| DELETE | /team-workspaces/:id |

### Parameters

- `id` (`string: <required>`) - The ID of the team/workspace relationship.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/team-workspaces/257525
```

