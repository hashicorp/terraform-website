---
layout: "cloud"
page_title: "Account - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Account API

Account represents the current user interacting with Terraform. It returns the same type of object as the [Users](./users.html) API, but also includes an email address, which is hidden when viewing info about other users.

## Get your account details

`GET /account/details`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`)         | The request was successful

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/account/details
```

### Sample Response

```json
{
  "data": {
    "id": "user-V3R563qtJNcExAkN",
    "type": "users",
    "attributes": {
      "username": "admin",
      "is-service-account": false,
      "avatar-url": "https://www.gravatar.com/avatar/9babb00091b97b9ce9538c45807fd35f?s=100&d=mm",
      "v2-only": false,
      "is-site-admin": true,
      "is-sso-login": false,
      "email": "admin@hashicorp.com",
      "unconfirmed-email": null,
      "permissions": {
        "can-create-organizations": true,
        "can-change-email": true,
        "can-change-username": true
      }
    },
    "relationships": {
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/users/user-V3R563qtJNcExAkN/authentication-tokens"
        }
      }
    },
    "links": {
      "self": "/api/v2/users/user-V3R563qtJNcExAkN"
    }
  }
}
```

## Update your account info

Your username and email address can be updated with this endpoint.

`PATCH /account/update`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`)         | Your info was successfully updated
[401][] | [JSON API error object][]                       | Unauthorized
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                                   | Type    | Default  | Description
-------------------------------------------|---------|----------|------------
`data.type`                                | string  |          | Must be `"users"`
`data.attributes.username`                 | string  |          | New username
`data.attributes.email`                    | string  |          | New email address (must be confirmed afterwards to take effect)

### Sample Payload

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "admin@example.com",
      "username": "admin"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/account/update
```

### Sample Response

```json
{
  "data": {
    "id": "user-V3R563qtJNcExAkN",
    "type": "users",
    "attributes": {
      "username": "admin",
      "is-service-account": false,
      "avatar-url": "https://www.gravatar.com/avatar/9babb00091b97b9ce9538c45807fd35f?s=100&d=mm",
      "v2-only": false,
      "is-site-admin": true,
      "is-sso-login": false,
      "email": "admin@hashicorp.com",
      "unconfirmed-email": null,
      "permissions": {
        "can-create-organizations": true,
        "can-change-email": true,
        "can-change-username": true
      }
    },
    "relationships": {
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/users/user-V3R563qtJNcExAkN/authentication-tokens"
        }
      }
    },
    "links": {
      "self": "/api/v2/users/user-V3R563qtJNcExAkN"
    }
  }
}
```

## Change your password

`PATCH /account/password`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`)         | Your password was successfully changed
[401][] | [JSON API error object][]                       | Unauthorized
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                                   | Type    | Default  | Description
-------------------------------------------|---------|----------|------------
`data.type`                                | string  |          | Must be `"users"`
`data.attributes.current_password`         | string  |          | Current password
`data.attributes.password`                 | string  |          | New password
`data.attributes.password_confirmation`    | string  |          | New password (confirmation)

### Sample Payload

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "current_password": "current password e.g. 2:C)e'G4{D\n06:[d1~y",
      "password": "new password e.g. 34rk492+jgLL0@xhfyisj",
      "password_confirmation": "new password e.g. 34rk492+jLL0@xhfyisj"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/account/password
```

### Sample Response

```json
{
  "data": {
    "id": "user-V3R563qtJNcExAkN",
    "type": "users",
    "attributes": {
      "username": "admin",
      "is-service-account": false,
      "avatar-url": "https://www.gravatar.com/avatar/9babb00091b97b9ce9538c45807fd35f?s=100&d=mm",
      "v2-only": false,
      "is-site-admin": true,
      "is-sso-login": false,
      "email": "admin@hashicorp.com",
      "unconfirmed-email": null,
      "permissions": {
        "can-create-organizations": true,
        "can-change-email": true,
        "can-change-username": true
      }
    },
    "relationships": {
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/users/user-V3R563qtJNcExAkN/authentication-tokens"
        }
      }
    },
    "links": {
      "self": "/api/v2/users/user-V3R563qtJNcExAkN"
    }
  }
}
```

