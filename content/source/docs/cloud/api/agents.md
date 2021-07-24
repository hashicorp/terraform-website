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
[JSON API error object]: https://jsonapi.org/format/#error-objects

# Agent Pools and Agents API

An Agent Pool represents a group of Agents, often related to one another by sharing a common network segment or purpose.
A workspace may be configured to use one of the organization's agent pools to run remote operations with isolated,
private, or on-premises infrastructure.

-> **Note:** Terraform Cloud Agents are a paid feature, available as part of the **Terraform Cloud for Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

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

### Query Parameters

Parameter                   | Description
----------------------------|------------
`sort`                        | **Optional.** Allows sorting the returned agents pools. Valid values are `"name"` and `"created-at"`. Prepending a hyphen to the sort parameter will reverse the order (e.g. `"-name"`).


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
      "id": "apool-yoGUFz5zcRMMz53i",
      "type": "agent-pools",
      "attributes": {
        "name": "example-pool",
        "created-at": "2020-08-05T18:10:26.964Z"
      },
      "relationships": {
        "agents": {
          "links": {
            "related": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/agents"
          }
        },
        "authentication-tokens": {
          "links": {
            "related": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/authentication-tokens"
          }
        },
        "workspaces": {
          "data": [
            {
              "id": "ws-9EEkcEQSA3XgWyGe",
              "type": "workspaces"
            }
          ]
        }
      },
      "links": {
        "self": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i"
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

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

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
      "id": "agent-A726QeosTCpCumAs",
      "type": "agents",
      "attributes": {
        "name": "my-cool-agent",
        "status": "idle",
        "ip-address": "123.123.123.123",
        "last-ping-at": "2020-10-09T18:52:25.246Z"
      },
      "links": {
        "self": "/api/v2/agents/agent-A726QeosTCpCumAs"
      }
    },
    {
      "id": "agent-4cQzjbr1cnM6Pcxr",
      "type": "agents",
      "attributes": {
        "name": "my-other-cool-agent",
        "status": "exited",
        "ip-address": "123.123.123.123",
        "last-ping-at": "2020-08-12T15:25:09.726Z"
      },
      "links": {
        "self": "/api/v2/agents/agent-4cQzjbr1cnM6Pcxr"
      }
    },
    {
      "id": "agent-yEJjXQCucpNxtxd2",
      "type": "agents",
      "attributes": {
        "name": null,
        "status": "errored",
        "ip-address": "123.123.123.123",
        "last-ping-at": "2020-08-11T06:22:20.300Z"
      },
      "links": {
        "self": "/api/v2/agents/agent-yEJjXQCucpNxtxd2"
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/agents?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/agents?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/agents?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
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
    "id": "apool-yoGUFz5zcRMMz53i",
    "type": "agent-pools",
    "attributes": {
      "name": "example-pool",
      "created-at": "2020-08-05T18:10:26.964Z"
    },
    "relationships": {
      "agents": {
        "links": {
          "related": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/agents"
        }
      },
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/authentication-tokens"
        }
      },
      "workspaces": {
        "data": [
          {
            "id": "ws-9EEkcEQSA3XgWyGe",
            "type": "workspaces"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i"
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
    "id": "agent-Zz9PTEcUgBtYzht8",
    "type": "agents",
    "attributes": {
      "name": "my-agent",
      "status": "busy",
      "ip-address": "123.123.123.123",
      "last-ping-at": "2020-09-08T18:47:35.361Z"
    },
    "links": {
      "self": "/api/v2/agents/agent-Zz9PTEcUgBtYzht8"
    }
  }
}
```

## Delete an Agent

`DELETE /agents/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the agent to delete

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Nothing                   | Success
[412][] | [JSON API error object][] | Agent is not deletable. Agents must have a status of `unknown`, `errored`, or `exited` before being deleted.
[404][] | [JSON API error object][] | Agent not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request DELETE \
  https://app.terraform.io/api/v2/agents/agent-73PJNzbZB5idR7AQ
```

## Create an Agent Pool

`POST /organizations/:organization_name/agent-pools`

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

Properties without a default value are required.

Key path                                      | Type    | Default   | Description
----------------------------------------------|---------|-----------|------------
`data.type`                                   | string  |           | Must be `"agent-pools"`.
`data.attributes.name`                        | string  |           | The name of the agent-pool, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.

### Sample Payload

```json
{
    "data": {
        "type": "agent-pools",
        "attributes": {
            "name": "my-pool"
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
  https://app.terraform.io/api/v2/organizations/my-organization/agent-pools
```

### Sample Response

```json
{
  "data": {
    "id": "apool-55jZekR57npjHHYQ",
    "type": "agent-pools",
    "attributes": {
      "name": "my-pool",
      "created-at": "2020-10-13T16:32:45.165Z"
    },
    "relationships": {
      "agents": {
        "links": {
          "related": "/api/v2/agent-pools/apool-55jZekR57npjHHYQ/agents"
        }
      },
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/agent-pools/apool-55jZekR57npjHHYQ/authentication-tokens"
        }
      },
      "workspaces": {
        "data": []
      }
    },
    "links": {
      "self": "/api/v2/agent-pools/apool-55jZekR57npjHHYQ"
    }
  }
}
```

## Update an Agent Pool

`PATCH /agent-pools/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the Agent Pool to update

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "agent-pools"`) | Success
[404][] | [JSON API error object][]                    | Agent Pool not found, or user unauthorized to perform action
[422][] | JSON error document                          | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                              | Type   | Default   | Description
-----------------------               |--------|-----------|------------
`data.type`                           | string |           | Must be `"agent-pools"`.
`data.attributes.name`                | string | (previous value) | The name of the agent pool, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.

### Sample Payload

```json
{
  "data": {
    "type": "agent-pools",
    "attributes": {
      "name": "example-pool"
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
  https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd
```

### Sample Response

```json
{
  "data": {
    "id": "apool-yoGUFz5zcRMMz53i",
    "type": "agent-pools",
    "attributes": {
      "name": "example-pool",
      "created-at": "2020-08-05T18:10:26.964Z"
    },
    "relationships": {
      "agents": {
        "links": {
          "related": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/agents"
        }
      },
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i/authentication-tokens"
        }
      },
      "workspaces": {
        "data": [
          {
            "id": "ws-9EEkcEQSA3XgWyGe",
            "type": "workspaces"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/agent-pools/apool-yoGUFz5zcRMMz53i"
    }
  }
}
```

## Delete an Agent Pool

`DELETE /agent-pools/:agent_pool_id`

Parameter   | Description
------------|------------
`:agent_pool_id`  | The ID of the agent pool ID to delete


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/agent-pools/apool-MCf6kkxu5FyHbqhd
```

