---
layout: "cloud"
page_title: "Agent Tokens - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Agent Tokens API

-> **Note:** Terraform Cloud Agents are a paid feature, available as part of the **Terraform Cloud for Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

## List Agent Tokens

`GET /agent-pools/:agent_pool_id/authentication-tokens`

Parameter            | Description
---------------------|------------
`:agent_pool_id` | The ID of the Agent Pool.

The objects returned by this endpoint only contain metadata, and do not include the secret text of any authentication tokens. A token is only shown upon creation, and cannot be recovered later.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "authentication-tokens"`) | Success
[404][] | [JSON API error object][]                    | Agent Pool not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/authentication-tokens
```

### Sample Response

```json
{
    "data": [
        {
            "id": "at-bonpPzYqv2bGD7vr",
            "type": "authentication-tokens",
            "attributes": {
                "created-at": "2020-08-07T19:38:20.868Z",
                "last-used-at": "2020-08-07T19:40:55.139Z",
                "description": "asdfsdf",
                "token": null
            },
            "relationships": {
                "created-by": {
                    "data": {
                        "id": "user-Nxv6svuhVrTW7eb1",
                        "type": "users"
                    }
                }
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/authentication-tokens?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/authentication-tokens?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/authentication-tokens?page%5Bnumber%5D=1&page%5Bsize%5D=20"
    },
    "meta": {
        "pagination": {
            "current-page": 1,
            "prev-page": null,
            "next-page": null,
            "total-pages": 1,
            "total-count": 1
        }
    }
}
```

## Show an Agent Token

`GET /authentication-tokens/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the Agent Token to show

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "authentication-tokens"`) | Success
[404][] | [JSON API error object][]                    | Agent Token not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/authentication-tokens/at-bonpPzYqv2bGD7vr
```

### Sample Response

```json
{
    "data": {
        "id": "at-bonpPzYqv2bGD7vr",
        "type": "authentication-tokens",
        "attributes": {
            "created-at": "2020-08-07T19:38:20.868Z",
            "last-used-at": "2020-08-07T19:40:55.139Z",
            "description": "test token",
            "token": null
        },
        "relationships": {
            "created-by": {
                "data": {
                    "id": "user-Nxv6svuhVrTW7eb1",
                    "type": "users"
                }
            }
        }
    }
}
```

## Create an Agent Token

`POST /agent-pools/:agent_pool_id/authentication-tokens`

Parameter            | Description
---------------------|------------
`:agent_pool_id` | The ID of the Agent Pool

This endpoint returns the secret text of the created authentication token. A token is only shown upon creation, and cannot be recovered later.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[201][] | [JSON API document][] (`type: "authentication-tokens"`) | The request was successful
[404][] | [JSON API error object][]               | Agent Pool not found or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)
[500][] | [JSON API error object][]               | Failure during Agent Token creation

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path               | Type   | Default | Description
-----------------------|--------|---------|------------
`data.type`            | string |         | Must be `"authentication-tokens"`.
`data.attributes.description` | string |         | The description for the Agent Token.

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
  https://app.terraform.io/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/authentication-tokens
```

### Sample Response

```json
{
    "data": {
        "id": "at-2rG2oYU9JEvfaqji",
        "type": "authentication-tokens",
        "attributes": {
            "created-at": "2020-08-10T22:29:21.907Z",
            "last-used-at": null,
            "description": "api",
            "token": "eHub7TsW7fz7LQ.atlasv1.cHGFcvf2VxVfUH4PZ7UNdaGB6SjyKWs5phdZ371zkI2KniZs2qKgrAcazhlsiy02awk"
        },
        "relationships": {
            "created-by": {
                "data": {
                    "id": "user-Nxv6svuhVrTW7eb1",
                    "type": "users"
                }
            }
        }
    }
}
```

## Destroy an Agent Token

`DELETE /api/v2/authentication-tokens/:id`

Parameter   | Description
------------|------------
`:id`       | The ID of the Agent Token to destroy.

Status  | Response                                        | Reason
--------|---------------------------|----------
[204][] | Empty response            | The Agent Token was successfully destroyed
[404][] | [JSON API error object][] | Agent Token not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/authentication-tokens/at-6yEmxNAhaoQLH1Da
```

