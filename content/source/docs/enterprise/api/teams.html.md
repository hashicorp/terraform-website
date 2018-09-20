---
layout: enterprise2
page_title: "Teams - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-teams"
---

# Teams API

-> **Note**: These API endpoints are in beta and are subject to change.

The Teams API is used to create and destroy teams. The [Team Membership API](./team-members.html) is used to add or remove users from a team. To give a team access to a workspace use the [Team Access API](./team-access.html) to associate a team with privileges on a workspace.

## List teams

`GET organizations/:organization_name/teams`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to list teams from.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations/my-organization/teams
```

### Sample Response

```json
{
  "data": [
    {
      "id": "257529",
      "type": "teams",
      "attributes": {
        "name": "owners",
        "users-count": 1,
        "permissions": {
          "can-update-membership": false,
          "can-destroy": false
        }
      },
      "relationships": {
        "users": {
          "data": [
            {
              "id": "user-62goNpx1ThQf689e",
              "type": "users"
            }
          ]
        },
        "authentication-token": {
          "meta": {}
        }
      },
      "links": {
        "self": "/api/v2/teams/team-n8UQ6wfhyym25sMe"
      }
    }
  ]
}
```

## Create a Team

`POST /organizations/:organization_name/teams`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create the team in. The organization must already exist in the system, and the user must have permissions to create new teams.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "teams"`) | Successfully created a team
[400][] | [JSON API error object][]               | Invalid `include` parameter
[404][] | [JSON API error object][]               | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)
[500][] | [JSON API error object][]               | Failure during team creation

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[500]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

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
  --header "Authorization: Bearer $TOKEN" \
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

## Show Team Information

`GET /teams/:team_id`

Parameter   | Description
------------|------------
`:team_id`  | The team ID to be shown.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/teams/257529
```

### Sample Response
```json
{
  "data": {
    "id": "257529",
    "type": "teams",
    "attributes": {
      "name": "owners",
      "users-count": 1,
      "permissions": {
        "can-update-membership": false,
        "can-destroy": false
      }
    },
    "relationships": {
      "users": {
        "data": [
          {
            "id": "user-62goNpx1ThQf689e",
            "type": "users"
          }
        ]
      },
      "authentication-token": {
        "meta": {}
      }
    },
    "links": {
      "self": "/api/v2/teams/257529"
    }
  }
}
```

## Delete a Team

`DELETE /teams/:team_id`

Parameter   | Description
------------|------------
`:team_id`  | The team ID to be deleted.


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/teams/257529
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

- `users` (`string`) - Returns the full user record for every member of a team.
