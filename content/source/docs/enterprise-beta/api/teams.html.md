---
layout: enterprise2
page_title: "Teams - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-teams"
---

# Teams API

## Create a Team

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization_id/teams |

### Parameters
- `name` (string: \<required\>) - Specifies the name of the teams. This must be a alphanumeric and `-`or `_`. This will be used as an identifier and must be unique in the organization.
- `organization` (string: \<required\>) - Specififes the username or organizaiton name under which to create the team. The organization must already exist in the system, and the user must have permissions to create new team. This is specified in the URL path.

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
  https://atlas.hashicorp.com/api/v2/organizations/skierkowski/teams
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

| Method | Path           |
| :----- | :------------- |
| DELETE | /teams/:team_id |

### Parameters
- `team_id` (string: \<required\>) - The Team ID to be deleted. This paremeter is specified in the URL.


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/teams/257529
```