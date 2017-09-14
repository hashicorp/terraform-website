---
layout: enterprise2
page_title: "Team Acccess - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-team-access"
---

# Team access API
The Team access APIs are used to map teams to workspaces with permissions. A single `team-workspace` object represents a mapping of a single team to a single workspace with a set of permissions (e.g. "read"). 

## List Team access to Workspaces

**method**: GET

**path**: /team_workspaces

### Parameters
- `filter[organization][username]` (string: \<required\>) - The organization username
- `filter[workspace][name]` (string: \<required\>) - The worksapce name
- `filter[team][id]` (string: \<required\>) - Team ID

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

**method**: POST

**path**: /team_workspaces

### Parameters
- `filter[organization][username]` (string: \<required\>) - The organization username
- `filter[workspace][name]` (string: \<required\>) - The worksapce name
- `filter[team][id]` (string: \<required\>) - Team ID
- `permission` (string: \<required\>) - ...

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

## Show Team access to a Workspace

**method**: GET

**path**: /team_workspaces/:id

### Parameters
- `id` (string: \<required\>) - ...

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

## Update Team access to a Workspace

**method**: PATCH

**path**: /team_workspaces/:id

### Parameters
- `id` (string: \<required\>) - ...

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

## Remove Team access to a Workspace

**method**: DELETE

**path**: /team_workspaces/:id

### Parameters
- `id` (string: \<required\>) - The ID of the Teams Access to a Workspace

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/team_workspaces/257525
```

