---
layout: enterprise2
page_title: "Variables - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-variables"
---

# Variables API

-> **Note**: These API endpoints are in beta and are subject to change.

This set of APIs covers create, update, list and delete operations on variables.


## Create a Variable

`POST /vars`

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                                    | Type   | Default | Description
--------------------------------------------|--------|---------|------------
`data.type`                                 | string |         | Must be `"vars"`.
`data.attributes.key`                       | string |         | The name of the variable.
`data.attributes.value`                     | string |         | The value of the variable.
`data.attributes.category`                  | string |         | Whether this is a Terraform or environment variable. Valid values are `"terraform"` or `"env"`.
`data.attributes.hcl`                       | bool   | `false` | Whether to evaluate the value of the variable as a string of HCL code. Has no effect for environment variables.
`data.attributes.sensitive`                 | bool   | `false` | Whether the value is sensitive. If true then the variable is written once and not visible thereafter.
`data.relationships.workspace.data.type`    | string |         | Must be `"workspaces"`.
`data.relationships.workspace.data.id`      | string |         | The ID of the workspace that owns the variable.
`data.relationships.organization.data.type` | string |         | Must be `"organizations"`.
`data.relationships.organization.data.id`   | string |         | The ID (which is the name) of the organization that owns the workspace.

**Deprecation warning**: The custom `filter` properties are replaced by JSON API `relationships` and will be removed from future versions of the API!

Key path                                    | Type   | Default | Description
--------------------------------------------|--------|---------|------------
`filter.workspace.name`                     | string |         | The name of the workspace that owns the variable.
`filter.organization.name`                  | string |         | The name of the organization that owns the workspace.


### Sample Payload

```json
{
  "data": {
    "type":"vars",
    "attributes": {
      "key":"some_key",
      "value":"some_value",
      "category":"terraform",
      "hcl":false,
      "sensitive":false
    },
    "relationships": {
      "organization": {
        "data": {
          "id":"my-organization",
          "type":"organizations"
          }
        }
      },
      "workspace": {
        "data": {
          "id":"ws-4j8p6jX1w33MiDC7",
          "type":"workspaces"
        }
      }
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
  https://app.terraform.io/api/v2/vars
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
      "self":"/api/v2/vars/var-EavQ1LztoRTQHSNT"
    }
  }
}
```

## List Variables

`GET /vars`

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                    | Description
-----------------------------|------------
`filter[workspace][name]`    | **Optional.** The name of one workspace to list variables for. If included, you must also include the organization name filter.
`filter[organization][name]` | The name of the organization that owns the desired workspace. Must be combined with the workspace name filter.

These two parameters are optional but linked; if you include one, you must include both. Without a filter, this method lists variables for all workspaces you can access.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
"https://app.terraform.io/api/v2/vars?filter%5Borganization%5D%5Bname%5D=my-organization&filter%5Bworkspace%5D%5Bname%5D=my-workspace"
# ?filter[organization][name]=my-organization&filter[workspace][name]=demo01
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
        "self":"/api/v2/vars/var-AD4pibb9nxo1468E"
      }
    }
  ]
}
```

## Update Variables

`PATCH /vars/:variable_id`

Parameter      | Description
---------------|------------
`:variable_id` | The ID of the variable to be updated.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path          | Type   | Default | Description
------------------|--------|---------|------------
`data.type`       | string |         | Must be `"vars"`.
`data.id`         | string |         | The ID of the variable to update.
`data.attributes` | object |         | New attributes for the variable. This object can include `key`, `value`, `category`, `hcl`, and `sensitive` properties, which are described above under [create a variable](#create-a-variable). All of these properties are optional; if omitted, a property will be left unchanged.

### Sample Payload

```json
{
  "data": {
    "id":"var-yRmifb4PJj7cLkMG",
    "attributes": {
      "key":"name",
      "value":"mars",
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
  https://app.terraform.io/api/v2/vars/var-yRmifb4PJj7cLkMG
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
      "self":"/api/v2/vars/var-yRmifb4PJj7cLkMG"
    }
  }
}
```

## Delete Variables

`DELETE /vars/:variable_id`

Parameter      | Description
---------------|------------
`:variable_id` | The ID of the variable to be deleted.

### Sample Request

```bash
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/vars/var-yRmifb4PJj7cLkMG
```
