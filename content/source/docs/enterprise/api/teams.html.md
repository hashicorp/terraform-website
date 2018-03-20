---
layout: enterprise2
page_title: "Teams - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-teams"
---

# Teams API

-> **Note**: These API endpoints are in beta and are subject to change.

The Teams API is used to create and destroy teams. The [Team Membership API](./team-members.html) is used to add or remove users from a team. To give a team access to a workspace use the [Team Access API](./team-access.html) to associate a team with privileges on a workspace.

## Create a Team

`POST /organizations/:organization_name/teams`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create the team in. The organization must already exist in the system, and the user must have permissions to create new teams.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path               | Type   | Default | Description
-----------------------|--------|---------|------------
`data.type`            | string |         | Must be `"teams"`.
`data.attributes.name` | string |         | The name of the team, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.

### Sample Payload

```json
{
  "data": {
    "type": "teams",
    "attributes": {
      "name": "team-creation-test"
    }
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
  https://app.terraform.io/api/v2/organizations/my-organization/teams
```


### Sample Response

```json
{
  "id": "257528",
  "type": "teams",
  "attributes": {
    "name": "team-creation-test",
    "users-count": 0
  },
  "relationships": {
    "users": {
      "data": []
    }
  },
  "links": {
    "self": "/api/v2/teams/257528"
  }
}
```


# Delete a Team

`DELETE /teams/:team_id`

Parameter   | Description
------------|------------
`:team_id`  | The team ID to be deleted.


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/teams/257529
```
