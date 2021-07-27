---
layout: "cloud"
page_title: "Users - Admin - API Docs - Terraform Enterprise"
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
[JSON API error object]: https://jsonapi.org/format/#error-objects

# Admin Users API

-> **Terraform Enterprise feature:** The admin API is exclusive to Terraform Enterprise, and can only be used by the admins and operators who install and maintain their organization's Terraform Enterprise instance.

-> These API endpoints are available in Terraform Enterprise as of version 201807-1.

The Users Admin API contains endpoints to help site administrators manage user accounts.

## List all users

`GET /api/v2/admin/users`

This endpoint lists all user accounts in the Terraform Enterprise installation.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully listed users
[404][] | [JSON API error object][]               | Client is not an administrator.


### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`q`                 | **Optional.** A search query string. Users are searchable by username and email address.
`filter[admin]`     | **Optional.** Can be `"true"` or `"false"` to show only administrators or non-administrators.
`filter[suspended]` | **Optional.** Can be `"true"` or `"false"` to show only suspended users or users who are not suspended.
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 users per page.

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](../index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name      | Description
-------------------|------------
`organizations`    | A list of organizations that each user is a member of.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/users"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "user-ZL4MsEKnd6iTigTb",
      "type": "users",
      "attributes": {
        "username": "myuser",
        "email": "myuser@example.com",
        "avatar-url": "https://www.gravatar.com/avatar/3a23b75d5aa41029b88b73f47a0d90db?s=100&d=mm",
        "is-admin": true,
        "is-suspended": false,
        "is-service-account": false
      },
      "relationships": {
        "organizations": {
          "data": [
            {
              "id": "my-organization",
              "type": "organizations"
            }
          ]
        }
      },
      "links": {
        "self": "/api/v2/users/myuser"
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/admin/users?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/admin/users?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/admin/users?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 1
    },
    "status-counts": {
      "total": 1,
      "suspended": 0,
      "admin": 1
    }
  }
}
```

## Delete a user account

`DELETE /admin/users/:id`

This endpoint deletes a user's account from Terraform Enterprise. To prevent unowned organizations, a user cannot be deleted if they are the sole owner of any organizations. The organizations must be given a new owner or deleted first.

Parameter | Description
----------|------------
`:id`     | The ID of the user to delete.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully removed the user account.
[404][] | [JSON API error object][] | Client is not an administrator.
[422][] | [JSON API error object][] | The user cannot be deleted because they are the sole owner of one or more organizations.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb"
```

## Suspend a user

`POST /admin/users/:id/actions/suspend`

Parameter | Description
----------|------------
`:id`     | The ID of the user to suspend.

This endpoint suspends a user's account, preventing them from authenticating and accessing resources.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully suspended the user's account.
[400][] | [JSON API error object][]               | User is already suspended.
[404][] | [JSON API error object][]               | Client is not an administrator.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb/actions/suspend"
```

### Sample Response

```json
{
  "data": {
    "id": "user-ZL4MsEKnd6iTigTb",
    "type": "users",
    "attributes": {
      "username": "myuser",
      "email": "myuser@example.com",
      "avatar-url": "https://www.gravatar.com/avatar/3a23b75d5aa41029b88b73f47a0d90db?s=100&d=mm",
      "is-admin": false,
      "is-suspended": true,
      "is-service-account": false
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "my-organization",
            "type": "organizations"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/users/myuser"
    }
  }
}
```

## Re-activate a suspended user

`POST /admin/users/:id/actions/unsuspend`

Parameter | Description
----------|------------
`:id`     | The ID of the user to re-activate.

This endpoint re-activates a suspended user's account, allowing them to resume authenticating and accessing resources.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully re-activated the user's account.
[400][] | [JSON API error object][]               | User is not suspended.
[404][] | [JSON API error object][]               | User not found, or client is not an administrator.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb/actions/unsuspend"
```

### Sample Response

```json
{
  "data": {
    "id": "user-ZL4MsEKnd6iTigTb",
    "type": "users",
    "attributes": {
      "username": "myuser",
      "email": "myuser@example.com",
      "avatar-url": "https://www.gravatar.com/avatar/3a23b75d5aa41029b88b73f47a0d90db?s=100&d=mm",
      "is-admin": false,
      "is-suspended": false,
      "is-service-account": false
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "my-organization",
            "type": "organizations"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/users/myuser"
    }
  }
}
```

## Grant a user administrative privileges

`POST /admin/users/:id/actions/grant_admin`

Parameter | Description
----------|------------
`:id`     | The ID of the user to make an administrator.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully made the user an administrator.
[400][] | [JSON API error object][]               | User is already an administrator.
[404][] | [JSON API error object][]               | User not found, or client is not an administrator.
[422][] | [JSON API error object][]               | Validation errors


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb/actions/grant_admin"
```

### Sample Response

```json
{
  "data": {
    "id": "user-ZL4MsEKnd6iTigTb",
    "type": "users",
    "attributes": {
      "username": "myuser",
      "email": "myuser@example.com",
      "avatar-url": "https://www.gravatar.com/avatar/3a23b75d5aa41029b88b73f47a0d90db?s=100&d=mm",
      "is-admin": true,
      "is-suspended": false,
      "is-service-account": false
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "my-organization",
            "type": "organizations"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/users/myuser"
    }
  }
}
```

## Revoke an user's administrative privileges

`POST /admin/users/:id/actions/revoke_admin`

Parameter | Description
----------|------------
`:id`     | The ID of the administrator to demote.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully made the user an administrator.
[400][] | [JSON API error object][]               | User is not an administrator.
[404][] | [JSON API error object][]               | User not found, or client is not an administrator.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb/actions/revoke_admin"
```

### Sample Response

```json
{
  "data": {
    "id": "user-ZL4MsEKnd6iTigTb",
    "type": "users",
    "attributes": {
      "username": "myuser",
      "email": "myuser@example.com",
      "avatar-url": "https://www.gravatar.com/avatar/3a23b75d5aa41029b88b73f47a0d90db?s=100&d=mm",
      "is-admin": false,
      "is-suspended": false,
      "is-service-account": false
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "my-organization",
            "type": "organizations"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/users/myuser"
    }
  }
}
```

## Disable a user's two-factor authentication

`POST /admin/users/:id/actions/disable_two_factor`

Parameter | Description
----------|------------
`:id`     | The ID of the user to disable 2FA for.

This endpoint disables a user's two-factor authentication in the situation where they have lost access to their device and recovery codes. Before disabling a user's two-factor authentication, completing a security verification process is recommended to ensure the request is legitimate.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully disabled the user's two-factor authentication.
[400][] | [JSON API error object][]               | User does not have two-factor authentication enabled.
[404][] | [JSON API error object][]               | User not found, or client is not an administrator.


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb/actions/disable_two_factor"
```

### Sample Response

```json
{
  "data": {
    "id": "user-ZL4MsEKnd6iTigTb",
    "type": "users",
    "attributes": {
      "username": "myuser",
      "email": "myuser@example.com",
      "avatar-url": "https://www.gravatar.com/avatar/3a23b75d5aa41029b88b73f47a0d90db?s=100&d=mm",
      "is-admin": false,
      "is-suspended": false,
      "is-service-account": false
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "my-organization",
            "type": "organizations"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/users/myuser"
    }
  }
}
```

## Impersonate another user

`POST /admin/users/:id/actions/impersonate`

Parameter   | Description
------------|------------
`:id` | The ID of the user to impersonate. It is not possible to impersonate service accounts or your own account.

[impersonate-ui]: /docs/enterprise/admin/resources.html#impersonating-a-user

Impersonation allows an admin to begin a new session as another user in the system; for more information, see [Impersonating a User][impersonate-ui] in the Terraform Enterprise administration section.

-> **Note:** Impersonation is [intended as a UI feature][impersonate-ui], and this endpoint exists to support that UI.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully impersonated the user.
[400][] | [JSON API error object][] | A reason for impersonation is required.
[403][] | [JSON API error object][] | Client is already impersonating another user.
[403][] | [JSON API error object][] | User cannot be impersonated.
[404][] | [JSON API error object][] | User not found, or client is not an administrator.


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`reason`| string | | A reason for impersonation, which will be recorded in the Audit Log.

### Sample Payload

```json
{
  "reason": "Reason for impersonation"
}
```

### Sample Request

```shell
curl \
  --header "Cookie: $COOKIE" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb/actions/impersonate
```

## End an impersonation session

`POST /admin/users/actions/unimpersonate`

When an admin has used the above endpoint to begin an impersonation session, they can make a request to this endpoint, using the cookie provided originally, in order to end that session and log out as the impersonated user.

This endpoint does not respond with a body, but the response does include a `Set-Cookie` header to persist a new session as the original admin user. As such, this endpoint will have no effect unless the client is able to persist and use cookies.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully ended the impersonation session.
[400][] | [JSON API error object][] | Client is not in an impersonation session.
[404][] | [JSON API error object][] | Client is not an administrator.


### Sample Request

```shell
curl \
  --header "Cookie: $COOKIE" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/admin/users/actions/unimpersonate
```
