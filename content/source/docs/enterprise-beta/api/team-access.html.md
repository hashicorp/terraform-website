---
layout: enterprise2
page_title: "Team Acccess - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-team-access"
---

# Team access API

-> **Note**: These API endpoints are in beta and may be subject to change.

The team access APIs are used to associate a team to permissions on a workspace. A single `team-workspace` resource contains the relationship between the Team and Workspace, including the privileges the team has on the workspace.

## List Team Access to Workspaces

| Method | Path           |
| :----- | :------------- |
| GET | /team_workspaces |

### Parameters

- `?filter[organization][username]` (`string: <required>`) - The organization username
- `?filter[workspace][name]` (`string: <required>`) - The workspace name
- `?filter[team][id]` (`string: <required>`) - The team ID

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://atlas.hashicorp.com/api/v2/team_workspaces?filter[organization][username]=hashicorp&filter[workspace][name]=example&filter[team][id]=1
```

### Sample Response

```json
{}
```

## Add Team access to a Workspace

| Method | Path           |
| :----- | :------------- |
| POST | /team_workspaces |

### Parameters

- `filter[organization][username]` (`string: <required>`) - The organization username
- `filter[workspace][name]` (`string: <required>`) - The workspace name
- `filter[team][id]` (`string: <required>`) - The team ID
- `permission` (`string: <required>`) - `read`, `write`, or `admin`

### Sample Payload

```json
{
  "data": {
    "type": "team-workspaces",
    "attributes": { "permission": "read" }
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
  https://atlas.hashicorp.com/api/v2/team_workspaces?filter[organization][username]=hashicorp&filter[workspace][name]=example&filter[team][id]=1
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

## Show Team Access to a Workspace

| Method | Path           |
| :----- | :------------- |
| GET | /team_workspaces/:id |

### Parameters

- `id` (`string: <required>`) - The ID of the team/workspace relationship.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://atlas.hashicorp.com/api/v2/team_workspaces/257525
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

## Update Team Access to a Workspace

| Method | Path           |
| :----- | :------------- |
| PATCH | /team_workspaces/:id |

### Parameters

- `id` (`string: <required>`) - The ID of the team/workspace relationship.

### Sample Payload

```json
{
  "data": {
    "type": "team-workspaces",
    "id": "1",
    "attributes": { "permission": "read" }
  }
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/team_workspaces/257525
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
| DELETE | /team_workspaces/:id |

### Parameters

- `id` (`string: <required>`) - The ID of the team/workspace relationship.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/team_workspaces/257525
```

