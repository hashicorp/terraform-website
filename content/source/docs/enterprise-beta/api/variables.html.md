---
layout: enterprise2
page_title: "Variables - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-variables"
---

# Variables API

This set of API covers creatue, update, list and delete operations of variables.


## Create a Variable

| Method | Path           |
| :----- | :------------- |
| POST | /vars |

### Parameters

- `key` (`string: <required>`) - specifies the name of the variable which will be passed into the plan/apply.
- `value` (`string: <required>`) - specifies the value of the variable which will be passed into the plan/apply.
- `category` (`string: "terraform"|"environment"`) - specifies whether this should be parsed as a terraform variable (with support for HCL) or as an enviornment variable. This governs how it is accessible in the terraform configuration.
- `hcl` (`bool: false`) - use HCL when setting the value of the string.
- `sensitive` (`bool: false`) - marks the variable as sensitive. If true then the variable is written once and not visible thereafter.
- `?filter[organization][username]` (`string: required`) - variables must be placed in a workspace which is contained in an organization; you must specify the organization of the workspace the `filter` query parameter
- `?filter[workspace][name]` (`string: required`) - variables must be placed in a workspace which requires that you set the name of the workspace using the `filter` query parameter.

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
    }
  },
  "filter": {
    "organization": {
      "username":"my-organization"
    },
    "workspace": {
      "name":"my-workspace"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/vars
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

| Method | Path           |
| :----- | :------------- |
| GET | /vars |

### Parameters

- `?filter[organization][username]` (`optional`) - Optionally filter the list to an organization given the organization name
- `?filter[workspace][name]` (`optional`) - Optionally fitler the list to a workspace given the workspace name

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
https://atlas.hashicorp.com/api/v2/vars?filter%5Borganization%5D%5Busername%5D=my-organization&filter%5Bworkspace%5D%5Bname%5D=my-workspace
# ?filter[organization][username]=my-organization&filter[workspace][name]=demo01
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

| Method | Path           |
| :----- | :------------- |
| PATCH | /vars/:variable_id |

### Parameters

- `:variable_id` (`string: <required>`) - specifies the ID of the variable to be updated. Specified in the request path.

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/vars/var-yRmifb4PJj7cLkMG
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

