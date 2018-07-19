---
layout: enterprise2
page_title: "Account - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-account"
---

# Account API

-> **Note**: These API endpoints are in beta and are subject to change.

Account represents the current user interacting with Terraform.

## Update your account info

Your username and email address can be updated with this endpoint.

`PATCH /account/update`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`)         | Your info was successfully updated
[401][] | [JSON API error object][]                       | Unauthorized
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[401]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

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
      "email": "admin@example.com"
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
      "avatar-url": "https://www.gravatar.com/avatar/9babb00091b97b9ce9538c45807fd35f?s=100&d=mm"
    },
    "relationships": {
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/users/admin/authentication-tokens"
        }
      }
    },
    "links": {
      "self": "/api/v2/users/admin"
    }
  }
}
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "avatar-url": "https://www.gravatar.com/avatar/...?s=100\u0026d=mm",
      "is-service-account": false,
      "two-factor": {
        "enabled": true,
        "verified": false
      },
      "username": "user-2fa",
      "v2-only": false
    },
    "id": "user_d3cab177",
    "links": { "self": "/api/v2/users/user-2fa" },
    "relationships": {
      "authentication-tokens": {
        "links": { "related": "/api/v2/users/user-2fa/authentication-tokens" }
      }
    },
    "type": "users"
  }
}
```
