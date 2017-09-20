---
layout: enterprise2
page_title: "Workspaces - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-workspaces"
---

# Workspaces API

-> **Note**: These API endpoints are in Beta and may be subject to change.

Workspaces represent running infrastructure managed by Terraform.


## Create a workspace

This endpoint creates a new workspace in the organization.

| Method | Path           |
| :----- | :------------- |
| `POST`  | `/organizations/:organization/workspaces` |


### Parameters

- `:organization` (`string: <required>`) - Specififes the organization name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This is specified in the URL path.
- `name` (`string: <required>`) - Specifies the name of the workspace. This must be a alphanumeric and `-`or `_`. This will be used as an identifier and must be unique in the organization.


### Sample Payload

```json
{
  "data": {
    "type": "string",
    "attributes": {
      "name": "my-workspace",
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
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/workspaces
```

### Sample Response

```json
{
   "data":{
      "id":"ws-2Qhk7LHgbMrm3grF",
      "type":"workspaces",
      "attributes":{
         "name":"my-workspace",
         "environment":null,
         "created-at":"2017-08-28T19:36:46.207Z"
      },
      "relationships":{
         "organization":{
            "data":{
               "id":"my-organization",
               "type":"organizations"
            }
         },
         "latest-run":{
            "data":null
         }
      },
      "links":{
         "self":"/api/v2/organizations/my-organization/workspaces/ws-2Qhk7LHgbMrm3grF"
      }
   }
}
```



## Create a Workspace with a VCS Configuration

The default `/workspaces` endpoint creates a workspace without configuring the VCS connection (`ingress-trigger`).

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization/compound-workspaces |



### Parameters

- `:organization` (`string: <required>`) - Specififes the username or organization name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This is specified in the URL path.
- `name` (`string: <required>`) - Specifies the name of the workspace. This must be a alphanumeric and `-`or `_`. This will be used as an identifier and must be unique in the organization.
- `default-branch` (`boolean: true`) - specifies if the default branch should be used.
- `vcs-root-path` (`string:''`) - Specifies the root of the Terraform execution context and all files outside of this path will be thrown away.
- `working-directory` (`string:''`) - Specifies the directory that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.
- `linkable-repo-id` (`string: <required>`) - This is the ID of the repository to be used. The ID can be obtained from the `linkable-repos`endpoint.

### Sample Payload

```json
{
  "data": 
  {
    "attributes": {
      "name":"workspace-demo",
      "working-directory":"",
      "linkable-repo-id":"233127_skierkowski/terraform-test-proj",
      "ingress-trigger-attributes": {
        "branch":"",
        "vcs-root-path":"",
        "default-branch":true
      }
    },
    "type":"compound-workspaces"
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
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/workspaces
```

### Sample Response

```json
{
  "data": {
    "id":"ws-ScBEdDQkA2ydAj3q",
    "type":"workspaces",
    "attributes": {
      "name":"workspace-demo",
      "environment":"default",
      "auto-apply":false,
      "locked":false,
      "created-at":"2017-09-20T15:36:52.931Z",
      "working-directory":"",
      "terraform-version":"0.10.5",
      "can-queue-destroy-plan":false,
      "ingress-trigger-attributes": {
        "branch":"",
        "default-branch":true,
        "vcs-root-path":"",
        "ingress-submodules":false
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id":"my-organization",
          "type":"organizations"
        }
      },
      "latest-run": {
        "data":null
      }
    },
    "links": {
      "self":"/api/v2/organizations/my-organization/workspaces/ws-ScBEdDQkA2ydAj3q"
    }
  }
}
```

## List workspaces

This endpoint lists workspaces in the organization.

| Method | Path           |
| :----- | :------------- |
| GET | /organizations/:organization/workspaces |

### Parameters

- `:organization` (`string: <required>`) - Specififes the username or organization name under which to list the workspaces. This is specified in the URL path.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/workspaces
```

### Sample Response

```json
{
    "data": [
        {
            "attributes": {
                "created-at": "2017-08-28T19:39:25.247Z",
                "environment": null,
                "name": "my-workspace-02"
            },
            "id": "ws-4FjHHrm3m9Krieqy",
            "links": {
                "self": "/api/v2/organizations/my-organization/workspaces/ws-4FjHHrm3m9Krieqy"
            },
            "relationships": {
                "latest-run": {
                    "data": null
                },
                "organization": {
                    "data": {
                        "id": "my-organization",
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
                "name": "my-workspace"
            },
            "id": "ws-2Qhk7LHgbMrm3grF",
            "links": {
                "self": "/api/v2/organizations/my-organization/workspaces/ws-2Qhk7LHgbMrm3grF"
            },
            "relationships": {
                "latest-run": {
                    "data": null
                },
                "organization": {
                    "data": {
                        "id": "my-organization",
                        "type": "organizations"
                    }
                }
            },
            "type": "workspaces"
        }
    ]
}
```

