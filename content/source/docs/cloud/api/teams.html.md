---
layout: "cloud"
page_title: "Teams - API Docs - Terraform Cloud"
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

# Teams API

The Teams API is used to create, edit, and destroy teams as well as manage a team's organization-level permissions. The [Team Membership API](./team-members.html) is used to add or remove users from a team. Use the [Team Access API](./team-access.html) to associate a team with privileges on an individual workspace.

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
      "id": "team-6p5jTwJQXwqZBncC",
      "type": "teams",
      "attributes": {
        "name": "team-creation-test",
        "users-count": 0,
        "visibility": "organization",
        "permissions": {
          "can-update-membership": true,
          "can-destroy": true,
          "can-update-organization-access": true,
          "can-update-api-token": true,
          "can-update-visibility": true
        },
        "organization-access": {
          "manage-policies": true,
          "manage-workspaces": false,
          "manage-vcs-settings": false
        }
      },
      "relationships": {
        "users": {
          "data": []
        },
        "authentication-token": {
          "meta": {}
        }
      },
      "links": {
        "self": "/api/v2/teams/team-6p5jTwJQXwqZBncC"
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


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                              | Type   | Default   | Description
-----------------------               |--------|-----------|------------
`data.type`                           | string |           | Must be `"teams"`.
`data.attributes.name`                | string |           | The name of the team, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
`data.attributes.organization-access` | object | (nothing) | Settings for the team's organization access. This object can include `manage-policies`, `manage-workspaces`, and `manage-vcs-settings` properties with boolean values. All properties default to `false`.
`data.attributes.visibility` **(beta)** | string | `"secret"`| The team's visibility. Must be "secret" or "organization" (visible).

### Sample Payload

```json
{
  "data": {
    "type": "teams",
    "attributes": {
      "name": "team-creation-test",
      "organization-access": {
        "manage-workspaces": true
      }
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
  "data": {
    "attributes": {
      "name": "team-creation-test",
      "organization-access": {
        "manage-policies": false,
        "manage-vcs-settings": false,
        "manage-workspaces": true
      },
      "permissions": {
        "can-update-membership": true,
        "can-destroy": true,
        "can-update-organization-access": true,
        "can-update-api-token": true,
        "can-update-visibility": true
      },
      "users-count": 0,
      "visibility": "secret",
    },
    "id": "team-6p5jTwJQXwqZBncC",
    "links": {
      "self": "/api/v2/teams/team-6p5jTwJQXwqZBncC"
    },
    "relationships": {
      "authentication-token": {
        "meta": {}
      },
      "users": {
        "data": []
      }
    },
    "type": "teams"
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
  https://app.terraform.io/api/v2/teams/team-6p5jTwJQXwqZBncC
```

### Sample Response
```json
{
  "data": {
    "id": "team-6p5jTwJQXwqZBncC",
    "type": "teams",
    "attributes": {
      "name": "team-creation-test",
      "users-count": 0,
      "visibility": "organization",
      "permissions": {
        "can-update-membership": true,
        "can-destroy": true,
        "can-update-organization-access": true,
        "can-update-api-token": true,
        "can-update-visibility": true
      },
      "organization-access": {
        "manage-policies": true,
        "manage-workspaces": false,
        "manage-vcs-settings": false
      }
    },
    "relationships": {
      "users": {
        "data": []
      },
      "authentication-token": {
        "meta": {}
      }
    },
    "links": {
      "self": "/api/v2/teams/team-6p5jTwJQXwqZBncC"
    }
  }
}
```

## Update a Team

`PATCH /teams/:team_id`

Parameter   | Description
------------|------------
`:team_id`  | The team ID to be updated.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "teams"`) | Successfully created a team
[400][] | [JSON API error object][]               | Invalid `include` parameter
[404][] | [JSON API error object][]               | Team not found, or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)
[500][] | [JSON API error object][]               | Failure during team creation


### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                              | Type   | Default   | Description
-----------------------               |--------|-----------|------------
`data.type`                           | string |           | Must be `"teams"`.
`data.attributes.name`                | string | (previous value) | The name of the team, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
`data.attributes.organization-access` | object | (previous value) | Settings for the team's organization access. This object can include `manage-policies`, `manage-workspaces`, and `manage-vcs-settings` properties with boolean values. All properties default to `false`.
`data.attributes.visibility` **(beta)** | string | (previous value) | The team's visibility. Must be "secret" or "organization" (visible).

### Sample Payload

```json
{
  "data": {
    "type": "teams",
    "attributes": {
      "visibilty": "organization",
      "organization-access": {
        "manage-vcs-settings": true
      }
    }
  }
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/teams/team-6p5jTwJQXwqZBncC
```


### Sample Response

```json
{
  "data": {
    "attributes": {
      "name": "team-creation-test",
      "organization-access": {
        "manage-policies": false,
        "manage-vcs-settings": true,
        "manage-workspaces": true
      },
      "visibility": "organization",
      "permissions": {
        "can-update-membership": true,
        "can-destroy": true,
        "can-update-organization-access": true,
        "can-update-api-token": true,
        "can-update-visibility": true
      },
      "users-count": 0
    },
    "id": "team-6p5jTwJQXwqZBncC",
    "links": {
      "self": "/api/v2/teams/team-6p5jTwJQXwqZBncC"
    },
    "relationships": {
      "authentication-token": {
        "meta": {}
      },
      "users": {
        "data": []
      }
    },
    "type": "teams"
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
  https://app.terraform.io/api/v2/teams/team-6p5jTwJQXwqZBncC
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

- `users` (`string`) - Returns the full user record for every member of a team.
