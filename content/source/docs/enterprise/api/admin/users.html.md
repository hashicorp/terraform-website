---
layout: enterprise2
page_title: "Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin"
---

# Admin API

-> **Note**: These API endpoints are in beta and are subject to change.

The User Admin API contains endpoints to help site administrators manage user accounts.

## List all users

`GET /admin/users`

This endpoint will list all user accounts in the Terraform Enterprise installation.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully listed users
[404][] | [JSON API error object][]               | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`q`                 | A search query string. Users are searchable by username and email address.
`filter[admin]`     | If supplied, can be `"true"` or `"false"` to show only administrators or non-administrators.
`filter[suspended]` | If supplied, can be `"true"` or `"false"` to show only suspended users or users who are not suspended.

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name      | Description
-------------------|------------
`organizations`    | A list of full organization records for each returned user.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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
        "two-factor": {
          "delivery": null,
          "sms-number": null,
          "enabled": false,
          "verified": false
        }
      },
      "relationships": {
        "organizations": {
          "data": [
            {
              "id": "myorganization",
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
  "meta": {
    "total-count": 1,
    "suspended-count": 0,
    "admin-count": 1
  }
}
```

## Delete a user account

`DELETE /admin/users/:id`

Parameter | Description
----------|------------
`:id`     | The ID of the user to delete.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully destroyed the user account.
[404][] | [JSON API error object][] | Client is not an administrator.
[422][] | [JSON API error object][] | Validation errors

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  "https://app.terraform.io/api/v2/admin/users/user-ZL4MsEKnd6iTigTb"
```

## Suspend a user

`POST /admin/users/:id/actions/suspend`

Parameter | Description
----------|------------
`:id`     | The ID of the user to suspend.

This endpoint will suspend a user's account, preventing them from logging in and accessing resources.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully suspended the user's account.
[400][] | [JSON API error object][]               | User is already suspended.
[404][] | [JSON API error object][]               | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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
      "two-factor": {
        "delivery": null,
        "sms-number": null,
        "enabled": false,
        "verified": false
      }
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "myorganization",
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

This endpoint will re-active a suspended user's account, allowing them to continue logging in and accessing resources.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully re-activated the user's account.
[400][] | [JSON API error object][]               | User is not suspended.
[404][] | [JSON API error object][]               | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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
      "two-factor": {
        "delivery": null,
        "sms-number": null,
        "enabled": false,
        "verified": false
      }
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "myorganization",
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
[404][] | [JSON API error object][]               | Client is not an administrator.
[422][] | [JSON API error object][]               | Validation errors

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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
      "two-factor": {
        "delivery": null,
        "sms-number": null,
        "enabled": false,
        "verified": false
      }
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "myorganization",
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
`:id`     | The ID of the administratot to demote.

This endpoint will suspend a user's account, preventing them from logging in and accessing resources.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | Successfully made the user an administrator.
[400][] | [JSON API error object][]               | User is not an administrator.
[404][] | [JSON API error object][]               | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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
      "two-factor": {
        "delivery": null,
        "sms-number": null,
        "enabled": false,
        "verified": false
      }
    },
    "relationships": {
      "organizations": {
        "data": [
          {
            "id": "myorganization",
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

`POST /admin/users/:username/actions/impersonate`

Parameter   | Description
------------|------------
`:username` | The name of the user to impersonate.

Impersonation allows an admin to begin a new session as another user in the system. This can be helpful in reproducing issues that a user is experiencing with their account that the admin cannot reproduce themselves. While an admin is impersonating a user, any actions that are logged to the audit log will reflect that an admin was acting on another user's behalf. The `"actor"` key will reference the impersonated user, but a new `"admin"` key will contain the username of the admin acting on the user's behalf. For more information about audit logging, see the [relevant documentation][audit logging].

This endpoint does not respond with a body, but the response does include a `Set-Cookie` header to persist a new session. As such, this endpoint will have no effect unless the client is able to persist and use cookies.

[audit logging]: /docs/enterprise/private/logging.html#audit-logs

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully impersonated the user
[403][] | [JSON API error object][] | Client is attempting to impersonate another admin, or is already impersonating another user.
[404][] | [JSON API error object][] | User not found, or client is not an administrator.

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[403]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Cookie: $ATLAS_COOKIE" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/admin/users/myusername/actions/impersonate
```

## End an impersonation session

`POST /admin/users/actions/unimpersonate`

When an admin has used the above endpoint to begin an impersonation session, they can make a request to this endpoint in order to end that session and log out as the impersonated user.

This endpoint does not respond with a body, but the response does include a `Set-Cookie` header to persist a new session. As such, this endpoint will have no effect unless the client is able to persist and use cookies.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully ended the impersonation session.
[400][] | [JSON API error object][] | Client is not in an impersonation session.
[404][] | [JSON API error object][] | Client is not an administrator.

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Cookie: $ATLAS_COOKIE" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/admin/users/actions/unimpersonate
```
