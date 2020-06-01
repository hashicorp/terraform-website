---
layout: "cloud"
page_title: "Organization Memberships - API Docs - Terraform Cloud"
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

# Organization Memberships API

Users are added to organizations by inviting them to join. Once accepted, they become members of the organization. The Organization Membership resource represents this membership.

You can invite users who already have an account, as well as new users. If the user has an existing account with the same email address used to invite them, they can reuse the same login.

-> **Note:** Once a user is a member of the organization, you can manage their team memberships using [the Team Membership API](./team-members.html).

## Invite a User to an Organization

`POST /organizations/:organization_name/organization-memberships`

Parameter            | Description
-------------------- | ------------
`:organization_name` | The name of the organization the user will be invited to join. The inviting user must have permission to manage organization memberships.

-> **Note:** Organization membership management is restricted to members of the owners team, the owners [team API token](../users-teams-organizations/api-tokens.html#team-api-tokens), and the [organization API token](../users-teams-organizations/api-tokens.html#organization-api-tokens).

Status  | Response                  | Reason
--------|---------------------------|-------
[201][] | [JSON API document][]     | Successfully invited the user
[400][] | [JSON API error object][] | Unable to invite user due to organization limits
[404][] | [JSON API error object][] | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][] | Unable to invite user due to validation errors

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                      | Type            | Default   | Description
----------------------------------------------|-----------------|-----------|------------
`data.type`                                   | string          |           | Must be `"organization-memberships"`.
`data.attributes.email`                       | string          |           | The email address of the user to be invited.
`data.relationships.teams.data[]`             | array\[object\] |           | A list of resource identifier objects that defines which teams the invited user will be a member of. These objects must contain `id` and `type` properties, and the `type` property must be `teams` (e.g. `{ "id": "team-GeLZkdnK6xAVjA5H", "type": "teams" }`). Obtain team IDs from the [List Teams](./teams.html#list-teams) endpoint. All users must be added to at least one team. 

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "email": "test@example.com"
    },
    "relationships": {
      "teams": {
        "data": [
          {
            "type": "teams",
            "id": "team-GeLZkdnK6xAVjA5H"
          }
        ]
      },
    },
    "type": "organization-memberships"
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
  https://app.terraform.io/api/v2/organizations/my-organization/organization-memberships
```

### Sample Response

```json
{
  "data": {
    "id": "ou-nX7inDHhmC3quYgy",
    "type": "organization-memberships",
    "attributes": {
      "status": "invited"
    },
    "relationships": {
      "teams": {
        "data": [
          {
            "id": "team-GeLZkdnK6xAVjA5H",
            "type": "teams"
          }
        ]
      },
      "user": {
        "data": {
          "id": "user-J8oxGmRk5eC2WLfX",
          "type": "users"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      }
    }
  },
  "included": [
    {
      "id": "user-J8oxGmRk5eC2WLfX",
      "type": "users",
      "attributes": {
        "username": null,
        "is-service-account": false,
        "avatar-url": "https://www.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=100&d=mm",
        "two-factor": {
          "enabled": false,
          "verified": false
        },
        "email": "test@example.com",
        "permissions": {
          "can-create-organizations": true,
          "can-change-email": true,
          "can-change-username": true,
          "can-manage-user-tokens": false
        }
      },
      "relationships": {
        "authentication-tokens": {
          "links": {
            "related": "/api/v2/users/user-J8oxGmRk5eC2WLfX/authentication-tokens"
          }
        }
      },
      "links": {
        "self": "/api/v2/users/user-J8oxGmRk5eC2WLfX"
      }
    }
  ]
}
```

## List Memberships for an Organization

`GET /organizations/:organization_name/organization-memberships`

Parameter            | Description
-------------------- | ------------
`:organization_name` | The name of the organization to list the memberships of.

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter        | Description
-----------------|------------
`q`              | **Optional.** A search query string. Organization memberships are searchable by user name and email.
`filter[status]` | **Optional.** If specified, restricts results to those with the matching status value. Valid values are `invited` and `active`.
`page[number]`   | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`     | **Optional.** If omitted, the endpoint will return 20 users per page.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/organization-memberships
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ou-tTJph1AQVK5ZmdND",
      "type": "organization-memberships",
      "attributes": {
        "status": "active"
      },
      "relationships": {
        "teams": {
          "data": [
            {
              "id": "team-yUrEehvfG4pdmSjc",
              "type": "teams"
            }
          ]
        },
        "user": {
          "data": {
            "id": "user-vaQqszES9JnuK4eB",
            "type": "users"
          }
        },
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    },
    {
      "id": "ou-D6HPYFt4GzeBt3gB",
      "type": "organization-memberships",
      "attributes": {
        "status": "active"
      },
      "relationships": {
        "teams": {
          "data": [
            {
              "id": "team-yUrEehvfG4pdmSjc",
              "type": "teams"
            }
          ]
        },
        "user": {
          "data": {
            "id": "user-oqCgH7NgTn95jTGc",
            "type": "users"
          }
        },
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    },
    {
      "id": "ou-x1E2eBwYwusLDC7h",
      "type": "organization-memberships",
      "attributes": {
        "status": "invited"
      },
      "relationships": {
        "teams": {
          "data": [
            {
              "id": "team-yUrEehvfG4pdmSjc",
              "type": "teams"
            }
          ]
        },
        "user": {
          "data": {
            "id": "user-UntUdBTHsVRQMzC8",
            "type": "users"
          }
        },
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/organizations/my-organization/organization-memberships?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/organizations/my-organization/organization-memberships?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/organizations/my-organization/organization-memberships?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "status-counts": {
      "total": 3,
      "active": 2,
      "invited": 1
    },
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 3
    }
  }
}
```

## List User's Own Memberships

`GET /organization-memberships`

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organization-memberships
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ou-VgJgfbDVN3APUm2F",
      "type": "organization-memberships",
      "attributes": {
        "status": "invited"
      },
      "relationships": {
        "teams": {
          "data": [
            {
              "id": "team-4QrJKzxB3J5N4cJc",
              "type": "teams"
            }
          ]
        },
        "user": {
          "data": {
            "id": "user-vaQqszES9JnuK4eB",
            "type": "users"
          }
        },
        "organization": {
          "data": {
            "id": "acme-corp",
            "type": "organizations"
          }
        }
      }
    },
    {
      "id": "ou-tTJph1AQVK5ZmdND",
      "type": "organization-memberships",
      "attributes": {
        "status": "active"
      },
      "relationships": {
        "teams": {
          "data": [
            {
              "id": "team-yUrEehvfG4pdmSjc",
              "type": "teams"
            }
          ]
        },
        "user": {
          "data": {
            "id": "user-vaQqszES9JnuK4eB",
            "type": "users"
          }
        },
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    }
  ]
}
```

## Show a Membership

`GET /organization-memberships/:organization_membership_id`

Parameter                     | Description
------------------------------|-------------
`:organization_membership_id` | The organization membership

Status  | Response                  | Reason
--------|---------------------------|-------
[200][] | [JSON API document][] (`type: "organization-memberships"`) | The request was successful
[404][] | [JSON API error object][] | Organization membership not found, or user unauthorized to perform action

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organization-memberships/ou-kit6GaMo3zPGCzWb
```

### Sample Response

```json
{
    "data": {
        "id": "ou-kit6GaMo3zPGCzWb",
        "type": "organization-memberships",
        "attributes": {
            "status": "active"
        },
        "relationships": {
            "teams": {
                "data": [
                    {
                        "id": "team-97LkM7QciNkwb2nh",
                        "type": "teams"
                    }
                ]
            },
            "user": {
                "data": {
                    "id": "user-hn6v2WK1naDpGadd",
                    "type": "users"
                }
            },
            "organization": {
                "data": {
                    "id": "hashicorp",
                    "type": "organizations"
                }
            }
        }
    }
}
```

## Remove User from Organization

`DELETE /organization-memberships/:organization_membership_id`

Parameter                     | Description
------------------------------|-------------
`:organization_membership_id` | The organization membership

Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Empty body                | Successfully removed the user from the organization
[403][] | [JSON API error object][] | Unable to remove the user: you cannot remove yourself from organizations which you own
[404][] | [JSON API error object][] | Organization membership not found, or user unauthorized to perform action

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organization-memberships/ou-tTJph1AQVK5ZmdND
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `user` - The user associated with the membership.
* `teams` - Teams the user is a member of.
