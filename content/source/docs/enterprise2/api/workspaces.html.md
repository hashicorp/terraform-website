---
layout: enterprise2
page_title: "Workspaces - API Docs - Terraform Enterprise Beta"
---

# Workspaces API



## Create a workspace

This endpoint creates a new workspace in the organization.

**Method**: POST
**Path**: /organizations/:organization/workspaces

### Parameters

- `name` (string: \<required\>) - Specifies the name of the workspace. This must be a alphanumeric and `-`or `_`. This will be used as an identifier and must be unique in the organization.
- `environment`(string: "default") - Specifies the environment attribute on the workspace.
- `organization` (string: \<required\>) - Specififes the username or organizaiton name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This is specified in the URL path.

### Sample Payload

```json
{
  "data": {
    "type": "string",
    "attributes": {
      "name": "workspace-demo",
      "environment": "default"
    }
  }
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/organizations/skierkowski/workspaces
```

### Sample Response

```json
{
   "data":{
      "id":"ws-2Qhk7LHgbMrm3grF",
      "type":"workspaces",
      "attributes":{
         "name":"workspace-demo",
         "environment":"default",
         "created-at":"2017-08-28T19:36:46.207Z"
      },
      "relationships":{
         "organization":{
            "data":{
               "id":"skierkowski",
               "type":"organizations"
            }
         },
         "latest-run":{
            "data":null
         }
      },
      "links":{
         "self":"/api/v2/organizations/skierkowski/workspaces/ws-2Qhk7LHgbMrm3grF"
      }
   }
}
```



## Create a Workspace with VCS Configuration

The default `/workspaces` endpoint creates a workspace without configuring the VCS connection (`ingress-trigger`). In Beta there is no dedicated endpoint for managing the `ingress-trigger`so it must be configured at the time of workspace creation.

**Method**: POST
**Path**: /organizations/:organization/compound-workspaces

### Parameters

- `name` (string: \<required\>) - Specifies the name of the workspace. This must be a alphanumeric and `-`or `_`. This will be used as an identifier and must be unique in the organization.
- `environment`(string: "default") - Specifies the environment attribute on the workspace.
- `organization` (string: \<required\>) - Specififes the username or organizaiton name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This is specified in the URL path.
- `default-branch`(boolean: true) - specifies if the default branch should be used. In the beta release this is set to `true` by default and it is not configurable. Providing a branch will result in an error.
- `path`(string:'/') - Specifies the directory of the repo to be used for the workspaces. Only this directory is cloned and the root path and other directories are not cloned.
- `linkable-repo-id`(string: \<required\>) - This is the ID of the repository to be used. The ID can be obtained from the `linkable-repos`endpoint.

### Sample Payload

```json
{
  "data": {
    "type": "compound-workspaces",
    "attributes": {
      "ingress-trigger-attributes": {
        "default-branch": true,
        "path":"/"
      }
      "linkable-repo-id": "4_skierkowski/terraform-test-proj",
      "name": "workspace-demo"
    }
  }
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/organizations/skierkowski/workspaces
```

### Sample Response

```json
{
  "data": {
    "id":"ws-bBdse6NaNz3fs9yd",
    "type":"workspaces",
    "attributes": {
      "name":"skierkowski-v2",
      "environment":null,
      "created-at":"2017-08-29T15:18:28.794Z"
    },
    "relationships": {
      "organization": {
        "data": {
          "id":"skierkowski-v2",
          "type":"organizations"
        }
      },
      "latest-run": {
        "data":null
      }
    },
    "links": {
      "self":"/api/v2/organizations/skierkowski-v2/workspaces/ws-bBdse6NaNz3fs9yd"
    }
  }
}
```

## List workspaces

This endpoint lists workspaces in the organization.

**Method**: GET
**Path**: /organizations/:organization/workspaces

### Parameters

- `organization` (string: \<required\>) - Specififes the username or organization name under which to list the workspaces.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://atlas.hashicorp.com/api/v2/organizations/skierkowski/workspaces
```

###

```json
{
    "data": [
        {
            "attributes": {
                "created-at": "2017-08-28T19:39:25.247Z",
                "environment": "default",
                "name": "workspace-demo-02"
            },
            "id": "ws-4FjHHrm3m9Krieqy",
            "links": {
                "self": "/api/v2/organizations/skierkowski/workspaces/ws-4FjHHrm3m9Krieqy"
            },
            "relationships": {
                "latest-run": {
                    "data": null
                },
                "organization": {
                    "data": {
                        "id": "skierkowski",
                        "type": "organizations"
                    }
                }
            },
            "type": "workspaces"
        },
        {
            "attributes": {
                "created-at": "2017-08-28T19:36:46.207Z",
                "environment": null,
                "name": "workspace-demo"
            },
            "id": "ws-2Qhk7LHgbMrm3grF",
            "links": {
                "self": "/api/v2/organizations/skierkowski/workspaces/ws-2Qhk7LHgbMrm3grF"
            },
            "relationships": {
                "latest-run": {
                    "data": null
                },
                "organization": {
                    "data": {
                        "id": "skierkowski",
                        "type": "organizations"
                    }
                }
            },
            "type": "workspaces"
        }
    ]
}
```

