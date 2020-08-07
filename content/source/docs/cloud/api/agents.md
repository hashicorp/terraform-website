---
layout: "cloud"
page_title: "Agent Pools and Agents - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Agent Pools and Agents API

An Agent Pool represents a group of Agents.

-> **Note:** Terraform Cloud Agents are a paid feature, available as part of the **Terraform Cloud for Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

## List Agent Pools

`GET /organizations/:organization_name/agent-pools`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization.

This endpoint allows you to list agent pools, their agents, and their tokens for an organization.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "agent-pools"`) | Success
[404][] | [JSON API error object][]                    | Organization not found

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations/my-organization/agent-pools
```

### Sample Response

```json
{
    "data": [
        {
            "id": "apool-MCf6kkxu5FyHbqhd",
            "type": "agent-pools",
            "attributes": {
                "name": "Default"
            },
            "relationships": {
                "agents": {
                    "data": [
                        {
                            "id": "agent-73PJNzbZB5idR7AQ",
                            "type": "agents"
                        }
                    ],
                    "links": {
                        "related": "/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/agents"
                    }
                },
                "authentication-tokens": {
                    "links": {
                        "related": "/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/authentication-tokens"
                    }
                }
            },
            "links": {
                "self": "/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd"
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/organizations/my-organization/agent-pools?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/organizations/my-organization/agent-pools?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/organizations/my-organization/agent-pools?page%5Bnumber%5D=1&page%5Bsize%5D=20"
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

## List Agents

`GET /agent-pools/:agent_pool_id/agents`

Parameter            | Description
---------------------|------------
`:agent_pool_id` | The name of the organization.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "agents"`) | Success
[404][] | [JSON API error object][]                    | Agent Pool not found, or user unauthorized to perform action

### Query Parameters

Parameter                   | Description
----------------------------|------------
`filter[last-ping-since]` | **Optional.** Accepts a date in ISO8601 format (ex. `2020-08-11T10:41:23Z`).

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/agents
```

### Sample Response

```json
{
    "data": [
        {
            "id": "agent-gcQ4JQgWzb3dVWGJ",
            "type": "agents",
            "attributes": {
                "name": "token1",
                "status": "idle",
                "ip-address": "173.91.35.112",
                "last-ping-at": "2020-08-11T13:11:42.728Z"
            },
            "links": {
                "self": "/api/v2/agents/agent-gcQ4JQgWzb3dVWGJ"
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/agents?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/agents?page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/agents?page%5Bnumber%5D=1&page%5Bsize%5D=20"
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

## Show an Agent Pool

`GET /agent-pools/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the Agent Pool to show

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "agent-pools"`) | Success
[404][] | [JSON API error object][]                    | Agent Pool not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd
```

### Sample Response

```json
{
  "data": {
      "id": "apool-MCf6kkxu5FyHbqhd",
      "type": "agent-pools",
      "attributes": {
          "name": "Default"
      },
      "relationships": {
          "agents": {
              "data": [
                  {
                      "id": "agent-73PJNzbZB5idR7AQ",
                      "type": "agents"
                  }
              ],
              "links": {
                  "related": "/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/agents"
              }
          },
          "authentication-tokens": {
              "links": {
                  "related": "/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd/authentication-tokens"
              }
          }
      },
      "links": {
          "self": "/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd"
      }
  }
}
```

## Show an Agent

`GET /agents/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the agent to show

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "agents"`) | Success
[404][] | [JSON API error object][]                    | Agent not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/agents/agent-73PJNzbZB5idR7AQ
```

### Sample Response

```json
{
    "data": {
        "id": "agent-73PJNzbZB5idR7AQ",
        "type": "agents",
        "attributes": {
            "name": "testing",
            "status": "exited",
            "ip-address": "173.91.35.112",
            "last-ping-at": "2020-08-07T19:40:55.149Z"
        },
        "links": {
            "self": "/api/v2/agents/agent-73PJNzbZB5idR7AQ"
        }
    }
}
```

## Create an Agent Pool

`POST /organizations/:organization_name/agent-pool`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization.

This endpoint allows you to create an Agent Pool for an organization. Only one Agent Pool may exist for an organization.

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "agent-pools"`) | Agent Pool successfully created
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

### Sample Payload

```json
{
    "data": {
        "type": "agent-pools"
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
  https://app.terraform.io/api/v2/organizations/my-organization/agent-pools
```

### Sample Response

```json
{
  "data": {
      "id": "apool-xkuMi7x4LsEnBUdY",
      "type": "agent-pools",
      "attributes": {
          "name": "Default"
      },
      "relationships": {
          "agents": {
              "data": [],
              "links": {
                  "related": "/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/agents"
              }
          },
          "authentication-tokens": {
              "links": {
                  "related": "/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY/authentication-tokens"
              }
          }
      },
      "links": {
          "self": "/api/v2/agent-pools/apool-xkuMi7x4LsEnBUdY"
      }
  }
}
```
