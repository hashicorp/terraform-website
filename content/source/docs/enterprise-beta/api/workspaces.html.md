---
layout: enterprise2
page_title: "Workspaces - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-workspaces"
---

# Workspaces API

-> **Note**: These API endpoints are in beta and may be subject to change.

Workspaces represent running infrastructure managed by Terraform.




## Create a Workspace

The default `/workspaces` endpoint creates a workspace without configuring the VCS connection (`ingress-trigger`).

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization/compound-workspaces |



### Parameters

- `:organization` (`string: <required>`) - Specifies the username or organization name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This parameter is specified in the URL path.
- `default-branch` (`boolean: true`) - specifies if the default branch should be used.
- `ingress-submodules` (`boolean: false`) - Specifies whether submodules should be fetched when cloning the VCS repository.
- `linkable-repo-id` (`string: <required>`) - This is the ID of the repository to be used. The ID can be obtained from the `linkable-repos` endpoint.
- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `vcs-root-path` (`string:''`) - Specifies the root of the Terraform execution context; all files outside of this path will be thrown away.
- `working-directory` (`string:''`) - Specifies the directory that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.

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
        "default-branch":true,
        "ingress-submodules": false,
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

## Update a Workspace

Update the workspace settings

| Method | Path           |
| :----- | :------------- |
| PATCH | /organizations/:organization/compound-workspaces/:workspace_id |



### Parameters

- `:organization` (`string: <required>`) - Specifies the organization name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This parameter is specified in the URL path.
- `:workspace_id` (`string: <required>`) - Specifies the workspace ID to update.
- `default-branch` (`boolean: true`) - specifies if the default branch should be used.
- `ingress-submodules` (`boolean: false`) - Specifies whether submodules should be fetched when cloning the VCS repository.
- `linkable-repo-id` (`string: ''`) - This is the ID of the repository to be used. The ID can be obtained from the `linkable-repos` endpoint. If one is not specified it does not update this setting.
- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `vcs-root-path` (`string:''`) - Specifies the root of the Terraform execution context; all files outside of this path will be thrown away.
- `working-directory` (`string:''`) - Specifies the directory that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.

### Sample Payload

```json
{
  "data": {
    "id":"ws-5GfiHeb4B39c3Gu3",
    "attributes": {
      "name":"networking-dev-01",
      "working-directory":"test",
      "linkable-repo-id":null,
      "ingress-trigger-attributes": {
        "branch":"new-branch",
        "vcs-root-path":"",
        "ingress-submodules":false,
        "default-branch":false
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
  --request PATCH \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/workspaces/ws-5GfiHeb4B39c3Gu3
```

### Sample Response

```json
{
  "data": {
    "id":"ws-5GfiHeb4B39c3Gu3",
    "type":"workspaces",
    "attributes": {
      "name":"networking-dev-01",
      "environment":"default",
      "auto-apply":false,
      "locked":false,
      "created-at":"2017-09-19T22:22:04.305Z",
      "working-directory":"test",
      "terraform-version":"0.10.5",
      "can-queue-destroy-plan":false,
      "ingress-trigger-attributes": {
        "branch":"new-branch",
        "default-branch":false,
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
        "data": {
          "id":"run-Num7DfgmZt84JQqr",
          "type":"runs"
        },
        "links": {
          "related":"/api/v2/runs/run-Num7DfgmZt84JQqr"
        }
      }
    },
    "links": {
      "self":"/api/v2/organizations/my-organization/workspaces/ws-5GfiHeb4B39c3Gu3"
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

- `:organization` (`string: <required>`) - Specifies the username or organization name under which to list the workspaces. This is specified in the URL path.

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

