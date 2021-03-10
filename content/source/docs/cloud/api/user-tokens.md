---
layout: "cloud"
page_title: "User Tokens - API Docs - Terraform Cloud and Terraform Enterprise"
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

# User Tokens API

## List User Tokens

`GET /api/v2/users/:user_id/authentication-tokens`

Parameter   | Description
------------|------------
`:user_id`  | The ID of the User.

Use the [Account API](./account.html) to find your own user ID.

The objects returned by this endpoint only contain metadata, and do not include the secret text of any authentication tokens. A token is only shown upon creation, and cannot be recovered later.

-> **Note:** You must access this endpoint with a [user token](../users-teams-organizations/users.html#api-tokens), and it will only return useful data for that token's user account.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "authentication-tokens"`) | The request was successful
[200][] | Empty [JSON API document][] (no type)    | User has no authentication tokens, or request was made by someone other than the user
[404][] | [JSON API error object][]               | User not found

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/users/user-MA4GL63FmYRpSFxa/authentication-tokens
```

### Sample Response

```json
{
  "data": [
    {
      "id": "at-QmATJea6aWj1xR2t",
      "type": "authentication-tokens",
      "attributes": {
        "created-at": "2018-11-06T22:56:10.203Z",
        "last-used-at": null,
        "description": null,
        "token": null
      },
      "relationships": {
        "created-by": {
          "data": null
        }
      }
    },
    {
      "id": "at-6yEmxNAhaoQLH1Da",
      "type": "authentication-tokens",
      "attributes": {
        "created-at": "2018-11-25T22:31:30.624Z",
        "last-used-at": "2018-11-26T20:27:54.931Z",
        "description": "api",
        "token": null
      },
      "relationships": {
        "created-by": {
          "data": {
            "id": "user-MA4GL63FmYRpSFxa",
            "type": "users"
          }
        }
      }
    }
  ]
}
```

## Show a User Token

`GET /api/v2/authentication-tokens/:id`

Parameter   | Description
------------|------------
`:id`       | The ID of the User Token.

The objects returned by this endpoint only contain metadata, and do not include the secret text of any authentication tokens. A token is only shown upon creation, and cannot be recovered later.

-> **Note:** You must access this endpoint with a [user token](../users-teams-organizations/users.html#api-tokens), and it will only return useful data for that token's user account.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "authentication-tokens"`) | The request was successful
[404][] | [JSON API error object][]               | User Token not found, or unauthorized to view the User Token

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/authentication-tokens/at-6yEmxNAhaoQLH1Da
```

### Sample Response

```json
{
  "data": {
    "id": "at-6yEmxNAhaoQLH1Da",
    "type": "authentication-tokens",
    "attributes": {
      "created-at": "2018-11-25T22:31:30.624Z",
      "last-used-at": "2018-11-26T20:34:59.487Z",
      "description": "api",
      "token": null
    },
    "relationships": {
      "created-by": {
        "data": {
          "id": "user-MA4GL63FmYRpSFxa",
          "type": "users"
        }
      }
    }
  }
}
```

## Create a User Token

`POST /api/v2/users/:user_id/authentication-tokens`

Parameter   | Description
------------|------------
`:user_id`  | The ID of the User.

Use the [Account API](./account.html) to find your own user ID.

This endpoint returns the secret text of the created authentication token. A token is only shown upon creation, and cannot be recovered later.

-> **Note:** You must access this endpoint with a [user token](../users-teams-organizations/users.html#api-tokens), and it will only create new tokens for that token's user account.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[201][] | [JSON API document][] (`type: "authentication-tokens"`) | The request was successful
[404][] | [JSON API error object][]               | User not found or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)
[500][] | [JSON API error object][]               | Failure during User Token creation

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path               | Type   | Default | Description
-----------------------|--------|---------|------------
`data.type`            | string |         | Must be `"authentication-tokens"`.
`data.attributes.description` | string |         | The description for the User Token.

### Sample Payload

```json
{
  "data": {
    "type": "authentication-tokens",
    "attributes": {
      "description":"api"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/users/user-MA4GL63FmYRpSFxa/authentication-tokens
```

### Sample Response

```json
{
  "data": {
    "id": "at-MKD1X3i4HS3AuD41",
    "type": "authentication-tokens",
    "attributes": {
      "created-at": "2018-11-26T20:48:35.054Z",
      "last-used-at": null,
      "description": "api",
      "token": "6tL24nM38M7XWQ.atlasv1.KmWckRfzeNmUVFNvpvwUEChKaLGznCSD6fPf3VPzqMMVzmSxFU0p2Ibzpo2h5eTGwPU"
    },
    "relationships": {
      "created-by": {
        "data": {
          "id": "user-MA4GL63FmYRpSFxa",
          "type": "users"
        }
      }
    }
  }
}
```

## Destroy a User Token

`DELETE /api/v2/authentication-tokens/:id`

Parameter   | Description
------------|------------
`:id`       | The ID of the User Token to destroy.

-> **Note:** You must access this endpoint with a [user token](../users-teams-organizations/users.html#api-tokens), and it will only delete tokens for that token's user account.

Status  | Response                                        | Reason
--------|---------------------------|----------
[204][] | Empty response            | The User Token was successfully destroyed
[404][] | [JSON API error object][] | User Token not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/authentication-tokens/at-6yEmxNAhaoQLH1Da
```

