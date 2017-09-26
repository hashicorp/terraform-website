---
layout: enterprise2
page_title: "Teams - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-teams"
---

# Teams API

-> **Note**: These API endpoints are in beta and may be subject to change.

The Teams API is used to create and destroy teams. The [Team Membership API](/docs/enterprise-beta/api/team-members.html) is used to add or remove users from a team. To give a team access to a workspace use the [Team Access API](/docs/enterprise-beta/api/team-access.html) to associate a team with privileges on a workspace.

## Create a Team

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization_id/teams |

### Parameters

- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `:organization_id` (`string: <required>`) - Specifies the username or organization name under which to create the team. The organization must already exist in the system, and the user must have permissions to create new teams. This parameter is specified in the URL path.

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
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/teams
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

- `:team_id` (`string: <required>`) - The team ID to be deleted. This parameter is specified in the URL.


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/teams/257529
```
