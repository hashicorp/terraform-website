---
layout: "cloud"
page_title: "Workspace Variables - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Workspace Variables API

This set of APIs covers create, update, list and delete operations on workspace variables.

Viewing variables requires permission to read variables for their workspace. Creating, updating, and deleting variables requires permission to read and write variables for their workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Create a Variable

`POST /workspaces/:workspace_id/vars`

Parameter       | Description
----------------|------------
`:workspace_id` | The ID of the workspace to create the variable in.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                                 | Type   | Default | Description
-----------------------------------------|--------|---------|------------
`data.type`                              | string |         | Must be `"vars"`.
`data.attributes.key`                    | string |         | The name of the variable.
`data.attributes.value`                  | string | `""`    | The value of the variable.
`data.attributes.description`            | string |         | The description of the variable.
`data.attributes.category`               | string |         | Whether this is a Terraform or environment variable. Valid values are `"terraform"` or `"env"`.
`data.attributes.hcl`                    | bool   | `false` | Whether to evaluate the value of the variable as a string of HCL code. Has no effect for environment variables.
`data.attributes.sensitive`              | bool   | `false` | Whether the value is sensitive. If true then the variable is written once and not visible thereafter.

**Deprecation warning**: The custom `filter` properties are replaced by JSON API `relationships` and will be removed from future versions of the API!

Key path                                 | Type   | Default | Description
-----------------------------------------|--------|---------|------------
`filter.workspace.name`                  | string |         | The name of the workspace that owns the variable.
`filter.organization.name`               | string |         | The name of the organization that owns the workspace.


### Sample Payload

```json
{
  "data": {
    "type":"vars",
    "attributes": {
      "key":"some_key",
      "value":"some_value",
      "description":"some description",
      "category":"terraform",
      "hcl":false,
      "sensitive":false
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
  https://app.terraform.io/api/v2/workspaces/ws-4j8p6jX1w33MiDC7/vars
```

### Sample Response

```json
{
  "data": {
    "id":"var-EavQ1LztoRTQHSNT",
    "type":"vars",
    "attributes": {
      "key":"some_key",
      "value":"some_value",
      "description":"some description",
      "sensitive":false,
      "category":"terraform",
      "hcl":false
    },
    "relationships": {
      "configurable": {
        "data": {
          "id":"ws-4j8p6jX1w33MiDC7",
          "type":"workspaces"
        },
        "links": {
          "related":"/api/v2/organizations/my-organization/workspaces/my-workspace"
        }
      }
    },
    "links": {
      "self":"/api/v2/workspaces/ws-4j8p6jX1w33MiDC7/vars/var-EavQ1LztoRTQHSNT"
    }
  }
}
```

## List Variables

`GET /workspaces/:workspace_id/vars`

Parameter       | Description
----------------|------------
`:workspace_id` | The ID of the workspace to list variables for.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
"https://app.terraform.io/api/v2/workspaces/ws-cZE9LERN3rGPRAmH/vars"
```

### Sample Response

```json
{
  "data": [
    {
      "id":"var-AD4pibb9nxo1468E",
      "type":"vars","attributes": {
        "key":"name",
        "value":"hello",
        "description":"some description",
        "sensitive":false,
        "category":"terraform",
        "hcl":false
      },
      "relationships": {
        "configurable": {
          "data": {
            "id":"ws-cZE9LERN3rGPRAmH",
            "type":"workspaces"
          },
          "links": {
            "related":"/api/v2/organizations/my-organization/workspaces/my-workspace"
          }
        }
      },
      "links": {
        "self":"/api/v2/workspaces/ws-cZE9LERN3rGPRAmH/vars/var-AD4pibb9nxo1468E"
      }
    }
  ]
}
```

## Update Variables

`PATCH /workspaces/:workspace_id/vars/:variable_id`

Parameter       | Description
----------------|------------
`:workspace_id` | The ID of the workspace that owns the variable.
`:variable_id`  | The ID of the variable to be updated.

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path          | Type   | Default | Description
------------------|--------|---------|------------
`data.type`       | string |         | Must be `"vars"`.
`data.id`         | string |         | The ID of the variable to update.
`data.attributes` | object |         | New attributes for the variable. This object can include `key`, `value`, `description`, `category`, `hcl`, and `sensitive` properties, which are described above under [create a variable](#create-a-variable). All of these properties are optional; if omitted, a property will be left unchanged.

### Sample Payload

```json
{
  "data": {
    "id":"var-yRmifb4PJj7cLkMG",
    "attributes": {
      "key":"name",
      "value":"mars",
      "description":"some description",
      "category":"terraform",
      "hcl": false,
      "sensitive": false
    },
    "type":"vars"
  }
}
```

### Sample Request

```bash
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-4j8p6jX1w33MiDC7/vars/var-yRmifb4PJj7cLkMG
```

### Sample Response

```json
{
  "data": {
    "id":"var-yRmifb4PJj7cLkMG",
    "type":"vars",
    "attributes": {
      "key":"name",
      "value":"mars",
      "description":"some description",
      "sensitive":false,
      "category":"terraform",
      "hcl":false
    },
    "relationships": {
      "configurable": {
        "data": {
          "id":"ws-4j8p6jX1w33MiDC7",
          "type":"workspaces"
        },
        "links": {
          "related":"/api/v2/organizations/workspace-v2-06/workspaces/workspace-v2-06"
        }
      }
    },
    "links": {
      "self":"/api/v2/workspaces/ws-4j8p6jX1w33MiDC7/vars/var-yRmifb4PJj7cLkMG"
    }
  }
}
```

## Delete Variables

`DELETE /workspaces/:workspace_id/vars/:variable_id`

Parameter       | Description
----------------|------------
`:workspace_id` | The ID of the workspace that owns the variable.
`:variable_id`  | The ID of the variable to be deleted.

### Sample Request

```bash
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/workspaces/ws-4j8p6jX1w33MiDC7/vars/var-yRmifb4PJj7cLkMG
```
