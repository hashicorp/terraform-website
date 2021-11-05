---
layout: "cloud"
page_title: "Variable Sets - API Docs - Terraform Cloud and Terraform Enterprise"
---

# Variable Sets API

This set of APIs covers create, update, list, delete, and some specialized operations.

Viewing Variable Sets requires access to the owning organization. Destructive actions require organization admin status or workspace management permissions.


## Create a Variable Set

`POST organizations/:organization_name/varsets`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `:organization_name` | The name of the organization the workspace belongs to.                                                |

### Request Body

Properties without a default value are required.

| Key path                               | Type           | Default | Description
-----------------------------------------|----------------|---------|------------
`data.name`                              | string         |         | The name of the Variable set
`data.description`                       | string         | `""`      | A helpful blurb to contextualize the variable set
`data.is_global`                         | boolean        | `false` | When true, the variable set applies to all workspaces in the organization.
`data.relationships.workspaces`          | array          | []      | Array of references to workspaces that the variable set should be assigned to. Sending an empty array clears all workspace assignments.
`data.relationships.vars`                | array          | []      | Array of complete variable definitions that comprise the variable set.

### Sample Payload

```json
{
  "data": {
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse",
      "is-global": false
    },
    "relationships": {
      "workspaces": {
        "data": [
          {
            "id": "ws-z6YvbWEYoE168kpq",
            "type": "workspaces"
          }
        ]
      },
      "vars": {
        "data": [
          {
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
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
  https://app.terraform.io/api/v2/organziations/my-organization/varsets
```

### Sample Response

```json
{
  "data": {
    "id": "varset-kjkN545LH2Sfercv"
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse",
      "is-global": false
    },
    "relationships": {
      "workspaces": {
        "data": [
          {
            "id": "ws-z6YvbWEYoE168kpq",
            "type": "workspaces"
          }
        ]
      },
      "vars": {
        "data": [
          {
            "id": "var-Nh0doz0hzj9hrm34qq"
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

## Update a Variable Set

`PUT/PATCH varsets/:varset_id`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Payload

```json
{
  "data": {
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse. Now global!",
      "is-global": true
    },
    "relationships": {
      "vars": {
        "data": [
          {
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
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
  --request PATCH \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv
```

### Sample Response

```json
{
  "data": {
    "id": "varset-kjkN545LH2Sfercv"
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse. Now global!",
      "is-global": true
    },
    "relationships": {
      "vars": {
        "data": [
          {
            "id": "var-Nh0doz0hzj9hrm34qq"
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

## Delete a Variable Set
`DELETE varsets/:varset_id`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv
```

on success, responds with no content

## Show Variable Set

Fetches details on a specific variable set

`GET varsets/:varset_id` #same response sans pagination and listing

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv
```

### Sample Response

```json
{
  "data": {
    "id": "varset-kjkN545LH2Sfercv"
    "type": "varsets",
    "attributes": {
      "name": "MyVarset",
      "description": "Full of vars and such for mass reuse",
      "is-global": false
    },
    "relationships": {
      "workspaces": {
        "data": [
          {
            "id": "ws-z6YvbWEYoE168kpq",
            "type": "workspaces"
          }
        ]
      },
      "vars": {
        "data": [
          {
            "id": "var-Nh0doz0hzj9hrm34qq"
            "type": "vars",
            "attributes": {
              "key": "c2e4612d993c18e42ef30405ea7d0e9ae",
              "value": "8676328808c5bf56ac5c8c0def3b7071",
              "category": "terraform"
            }
          }
        ]
      }
    }
  }
}
```

## List Variable Set

List all variable sets for an organization.

`GET organizations/:organization_name/varsets`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `:organization_name` | The name of the organization the workspace belongs to.                                                |

List all variable sets for a workspace.

`GET workspaces/:workspace_id/varsets`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID |


### Sample Response

```json
{
  "data": [
    {
      "id": "varset-mio9UUFyFMjU33S4",
      "type": "varsets",
      "attributes":  {
         "name": "varset-b7af6a77",
         "description": "Full of vars and such for mass reuse",
         "is-global": false,
         "updated-at": "2021-10-29T17:15:56.722Z",
         "var-count":  5,
         "workspace-count": 2
      },
      "relationships": {
        "organization": {
          "data: {"id": "organization_1", "type": "organizations"}
        },
        "vars": {
          "data": [
           {"id": "var-abcd12345", "type": "vars"},
           {"id": "var-abcd12346", "type": "vars"},
           {"id": "var-abcd12347", "type": "vars"},
           {"id": "var-abcd12348", "type": "vars"},
           {"id": "var-abcd12349", "type": "vars"}
          ]
        },
        "workspaces": {
          "data": [
           {"id": "ws-abcd12345", "type": "workspaces"},
           {"id": "ws-abcd12346", "type": "workspaces"}
          ]
        }
      }
    },
    ...
  ],
  "links": {
    "self": "<page URL>",
    "first": "<page URL>",
    "prev": nil,
    "next": nil,
    "last": "<page URL>"
  }
}
```

## Relationships

### Variables

## Add Variable

`POST varsets/:varset_external_id/relationships/vars`

| Parameter            | Description                      |
| -------------------- | ---------------------------------|
| `:varset_id`         | The variable set ID              |

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

### Sample Payload

```json
{
  "data": {
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
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
  https://app.terraform.io/api/v2/varsets/varset-4q8f7H0NHG733bBH/relationships/vars
```

### Sample Respone

```json
{
  "data": {
    "id":"var-EavQ1LztoRTQHSNT"
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
    }
  }
}
```

## Update a Variable in a Variable Set

`PATCH varsets/:varset_id/relationships/vars/:var_id`

| Parameter            | Description                      |
| -------------------- | ---------------------------------|
| `:varset_id`         | The variable set ID              |
| `:var_id`            | The ID of the variable to delete |

### Sample Payload

```json
{
  "data": {
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "new cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
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
  https://app.terraform.io/api/v2/varsets/varset-4q8f7H0NHG733bBH/relationships/vars/var-EavQ1LztoRTQHSNT
```

### Sample Respone

```json
{
  "data": {
    "id":"var-EavQ1LztoRTQHSNT"
    "type": "vars",
    "attributes": {
      "key": "g6e45ae7564a17e81ef62fd1c7fa86138",
      "value": "61e400d5ccffb3782f215344481e6c82",
      "description": "new cheeeese",
      "sensitive": false,
      "category": "terraform",
      "hcl": false
    }
  }
}
```

## Delete a Variable in a Variable Set

`DELETEvarsets/:varset_id/relationships/vars/:var_id`

| Parameter            | Description                      |
| -------------------- | ---------------------------------|
| `:varset_id`         | The variable set ID              |
| `:var_id`            | The ID of the variable to delete |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE\
  --data @payload.json \
  https://app.terraform.io/api/v2/varsets/varset-4q8f7H0NHG733bBH/relationships/vars/var-EavQ1LztoRTQHSNT
```

on success, responds with no content

## List Variables in a Variable Set

`GET varsets/:varset_id/relationships/vars`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Response

```json
{
  "data": [
    {
      "id": "var-134r1k34nj5kjn",
      "type": "vars",
      "attributes": {
        "key": "F115037558b045dd82da40b089e5db745",
        "value": "1754288480dfd3060e2c37890422905f",
        "sensitive": false,
        "category": "terraform",
        "hcl": false,
        "created-at": "2021-10-29T18:54:29.379Z",
        "description": nil
      },
      "relationships": {
        "varset": {
          "data": {
            "id": "varset-992UMULdeDuebi1x",
            "type": "varsets"
          },
          "links": { "related": "/api/v2/varsets/1" }
        }
      },
      "links": { "self": "/api/v2/vars/var-BEPU9NjPVCiCfrXj" }
    },
  ],
  "links": {
    "self": "<page URL>",
    "first": "<page URL>",
    "prev": nil,
    "next": nil,
    "last": "<page URL>"
  }
}
```

### Workspaces

## Assign Variable Set to Workspaces

`POST varsets/:varset_id/relationships/workspaces`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Payload

```json
{
  "data": [
    {
      "type": "workspaces",
      "id": "ws-YwfuBJZkdai4xj9w"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv/relationships/workspaces
```

on success, responds with no content

## Unassign Variable Set from Workspaces

`DELETE varsets/:varset_id/relationships/workspaces`

| Parameter            | Description         |
| -------------------- | --------------------|
| `:varset_id`         | The variable set ID |

### Sample Payload

```json
{
  "data": [
    {
      "type": "workspaces",
      "id": "ws-YwfuBJZkdai4xj9w"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/varsets/varset-kjkN545LH2Sfercv/relationships/workspaces
```

on success, responds with no content
