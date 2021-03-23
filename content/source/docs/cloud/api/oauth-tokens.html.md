---
layout: "cloud"
page_title: "OAuth Tokens - API Docs - Terraform Cloud and Terraform Enterprise"
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

# OAuth Tokens

The `oauth-token` object represents a VCS configuration which includes the OAuth connection and the associated OAuth token. This object is used when creating a workspace to identify which VCS connection to use.

## List OAuth Tokens

List all the OAuth Tokens for a given OAuth Client

`GET /oauth-clients/:oauth_client_id/oauth-tokens`

Parameter            | Description
---------------------|------------
`:oauth_client_id`   | The ID of the OAuth Client

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "oauth-tokens"`) | Success
[404][] | [JSON API error object][]                    | OAuth Client not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/oauth-clients/oc-GhHqb5rkeK19mLB8/oauth-tokens
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ot-hmAyP66qk2AMVdbJ",
      "type": "oauth-tokens",
      "attributes": {
        "created-at":"2017-11-02T06:37:49.284Z",
        "service-provider-user":"skierkowski",
        "has-ssh-key": false
      },
      "relationships": {
        "oauth-client": {
          "data": {
            "id": "oc-GhHqb5rkeK19mLB8",
            "type": "oauth-clients"
          },
          "links": {
            "related": "/api/v2/oauth-clients/oc-GhHqb5rkeK19mLB8"
          }
        }
      },
      "links": {
        "self": "/api/v2/oauth-tokens/ot-hmAyP66qk2AMVdbJ"
      }
    }
  ]
}
```

## Show an OAuth Token

`GET /oauth-tokens/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the OAuth token to show

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "oauth-tokens"`) | Success
[404][] | [JSON API error object][]                    | OAuth Token not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/oauth-tokens/ot-29t7xkUKiNC2XasL
```

### Sample Response

```json
{
  "data": {
    "id": "ot-29t7xkUKiNC2XasL",
    "type": "oauth-tokens",
    "attributes": {
      "created-at": "2018-08-29T14:07:22.144Z",
      "service-provider-user": "EM26Jj0ikRsIFFh3fE5C",
      "has-ssh-key": false
    },
    "relationships": {
      "oauth-client": {
        "data": {
          "id": "oc-WMipGbuW8q7xCRmJ",
          "type": "oauth-clients"
        },
        "links": {
          "related": "/api/v2/oauth-clients/oc-WMipGbuW8q7xCRmJ"
        }
      }
    },
    "links": {
      "self": "/api/v2/oauth-tokens/ot-29t7xkUKiNC2XasL"
    }
  }
}
```

## Update an OAuth Token

`PATCH /oauth-tokens/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the OAuth token to update

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "oauth-tokens"`)  | OAuth Token successfully updated
[404][] | [JSON API error object][]                       | OAuth Token not found or user unauthorized to perform action
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                             | Type   | Default | Description
-------------------------------------|--------|---------|------------
`data.type`                          | string |         | Must be `"oauth-tokens"`.
`data.attributes.ssh-key`            | string |         | **Optional.** The SSH key

### Sample Payload

```json
{
  "data": {
    "id": "ot-29t7xkUKiNC2XasL",
    "type": "oauth-tokens",
    "attributes": {
      "ssh-key": "..."
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
  https://app.terraform.io/api/v2/oauth-tokens/ot-29t7xkUKiNC2XasL
```

### Sample Response

```json
{
  "data": {
    "id": "ot-29t7xkUKiNC2XasL",
    "type": "oauth-tokens",
    "attributes": {
      "created-at": "2018-08-29T14:07:22.144Z",
      "service-provider-user": "EM26Jj0ikRsIFFh3fE5C",
      "has-ssh-key": false
    },
    "relationships": {
      "oauth-client": {
        "data": {
          "id": "oc-WMipGbuW8q7xCRmJ",
          "type": "oauth-clients"
        },
        "links": {
          "related": "/api/v2/oauth-clients/oc-WMipGbuW8q7xCRmJ"
        }
      }
    },
    "links": {
      "self": "/api/v2/oauth-tokens/ot-29t7xkUKiNC2XasL"
    }
  }
}
```

## Destroy an OAuth Token

`DELETE /oauth-tokens/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the OAuth Token to destroy

Status  | Response                                        | Reason
--------|---------------------------|----------
[204][] | Empty response            | The OAuth Token was successfully destroyed
[404][] | [JSON API error object][] | OAuth Token not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/oauth-tokens/ot-29t7xkUKiNC2XasL
```

