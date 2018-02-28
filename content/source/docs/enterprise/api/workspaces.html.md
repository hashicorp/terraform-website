---
layout: enterprise2
page_title: "Workspaces - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-workspaces"
---

# Workspaces API

-> **Note**: These API endpoints are in beta and are subject to change.

Workspaces represent running infrastructure managed by Terraform.

## Create a Workspace

This endpoint is used to create a new workspace either with or without a VCS configuration.

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization_name/workspaces |

### Parameters

- `:organization_name` (`string: <required>`) - Specifies the organization name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This parameter is specified in the URL path.
- `name`

### Create a Workspace Without a VCS Repository

If you supply nothing but a name, you can create a workspace without configuring it against a VCS repository.

#### Parameters

- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.

#### Sample Payload

```json
{
  "data":
  {
    "attributes": {
      "name":"workspace-demo"
    },
    "type":"workspaces"
  }
}
```

#### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces
```

#### Sample Response

```json
{
  "data": {
    "id": "ws-YnyXLq9fy38afEeb",
    "type": "workspaces",
    "attributes": {
      "name": "workspace-demo",
      "environment": "default",
      "auto-apply": false,
      "locked": false,
      "created-at": "2017-11-18T00:43:59.384Z",
      "working-directory": "",
      "terraform-version": "0.11.0",
      "can-queue-destroy-plan": false,
      "permissions": {
        "can-update": true,
        "can-destroy": false,
        "can-queue-destroy": false,
        "can-queue-run": false,
        "can-update-variable": false,
        "can-lock": false,
        "can-read-settings": true
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "ssh-key": {
        "data": null
      },
      "latest-run": {
        "data": null
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/ws-YnyXLq9fy38afEeb"
    }
  }
}
```

### Create a Workspace with a VCS Repository

By supplying the necessary attributes under a `vcs-repository` object, you can create a Workspace that is configured against a VCS Repository.

#### Parameters

- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `working-directory` (`string: ''`) - Specifies a relative path that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.
- `vcs-repo.oauth-token-id` (`string: <optional>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
- `vcs-repo.branch` (`string: ''`) - Specifies the repository branch that Terraform will execute from. If left null or submitted as an empty string, this defaults to the repository's default branch (e.g. `master`) .
- `vcs-repo.ingress-submodules` (`boolean: false`) - Specifies whether submodules should be fetched when cloning the VCS repository.
- `vcs-repo.identifier` (`string: <optional>`) - This is the reference to your VCS repository in the format :org/:repo where :org and :repo refer to the organization and repository in your VCS provider.

#### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name":"workspace-demo",
      "working-directory":"",
      "vcs-repo": {
        "identifier":"skierkowski/terraform-test-proj",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "branch":"",
        "default-branch":true
      }
    },
    "type":"workspaces"
  }
}
```

#### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces
```

#### Sample Response

```json
{
  "data": {
    "id": "ws-SihZTyXKfNXUWuUa",
    "type": "workspaces",
    "attributes": {
      "name": "workspace-demo",
      "environment": "default",
      "auto-apply": false,
      "locked": false,
      "created-at": "2017-11-02T23:55:16.142Z",
      "working-directory": null,
      "terraform-version": "0.10.8",
      "can-queue-destroy-plan": true,
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "branch": "",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "ingress-submodules": false
      },
      "permissions": {
        "can-update": true,
        "can-destroy": false,
        "can-queue-destroy": false,
        "can-queue-run": false,
        "can-update-variable": false,
        "can-lock": false,
        "can-read-settings": true
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "ssh-key": {
        "data": null
      },
      "latest-run": {
        "data": null
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/ws-SihZTyXKfNXUWuUa"
    }
  }
}
```

## Update a Workspace

Update the workspace settings

| Method | Path           |
| :----- | :------------- |
| PATCH | /organizations/:organization_name/workspaces/:workspace_id |


### Parameters

- `:organization_name` (`string: <required>`) - Specifies the organization name under which to create the workspace. The organization must already exist in the system, and the user must have permissions to create new workspaces. This parameter is specified in the URL path.
- `:workspace_id` (`string: <required>`) - Specifies the workspace ID to update.
- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `working-directory` (`string: ''`) - Specifies the directory that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.
- `vcs-repo.branch` (`string: ''`) - Specifies the repository branch that Terraform will execute from. If left null or as an empty string, this defaults to the repository's default branch (e.g. `master`) .
- `vcs-repo.oauth-token-id` (`string: <optional>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
- `vcs-repo.ingress-submodules` (`boolean: false`) - Specifies whether submodules should be fetched when cloning the VCS repository.
- `vcs-repo.identifier` (`string: <required>`) - This is the reference to your VCS repository in the format :org/:repo

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name":"my-workspace-2",
      "working-directory":"",
      "vcs-repo": {
        "identifier":"skierkowski/terraform-test-proj",
        "branch":"",
        "ingress-submodules":false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
      }
    },
    "type":"workspaces"
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
  https://app.terraform.io/api/v2/compound-workspaces/ws-erEAnPmgtm5mJr77
```

### Sample Response

```json
{
  "data": {
    "id": "ws-erEAnPmgtm5mJr77",
    "type": "workspaces",
    "attributes": {
      "name": "my-workspace-2",
      "environment": "default",
      "auto-apply": false,
      "locked": false,
      "created-at": "2017-11-02T23:24:05.997Z",
      "working-directory": "",
      "terraform-version": "0.10.8",
      "can-queue-destroy-plan": false,
      "ingress-trigger-attributes": {
        "branch": "",
        "default-branch": true,
        "ingress-submodules": false
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "ssh-key": {
        "data": null
      },
      "latest-run": {
        "data": null
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/ws-erEAnPmgtm5mJr77"
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

- `:organization` (`string: <required>`) - Specifies the organization name under which to list the workspaces. This is specified in the URL path.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ws-erEAnPmgtm5mJr77",
      "type": "workspaces",
      "attributes": {
        "name": "my-workspace-2",
        "environment": "default",
        "auto-apply": false,
        "locked": false,
        "created-at": "2017-11-02T23:24:05.997Z",
        "working-directory": "",
        "terraform-version": "0.10.8",
        "can-queue-destroy-plan": false,
        "ingress-trigger-attributes": {
          "branch": "",
          "default-branch": true,
          "ingress-submodules": false
        }
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        },
        "ssh-key": {
          "data": null
        },
        "latest-run": {
          "data": null
        }
      },
      "links": {
        "self": "/api/v2/organizations/my-organization/workspaces/ws-erEAnPmgtm5mJr77"
      }
    },
    {
      "id": "ws-XNjxRUBLi6n1xyVk",
      "type": "workspaces",
      "attributes": {
        "name": "my-workspace-1",
        "environment": "default",
        "auto-apply": false,
        "locked": false,
        "created-at": "2017-11-02T23:23:53.765Z",
        "working-directory": "",
        "terraform-version": "0.10.8",
        "can-queue-destroy-plan": false,
        "ingress-trigger-attributes": {
          "branch": "",
          "default-branch": true,
          "ingress-submodules": false
        }
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        },
        "ssh-key": {
          "data": null
        },
        "latest-run": {
          "data": null
        }
      },
      "links": {
        "self": "/api/v2/organizations/my-organization/workspaces/ws-XNjxRUBLi6n1xyVk"
      }
    }
  ]
}
```


## Delete a workspace

This endpoint deletes a workspace.

| Method | Path           |
| :----- | :------------- |
| DELETE | /organizations/:organization/workspaces/:workspace |

### Parameters

- `:workspace` (`string: <required>`) - Specifies the workspace ID to delete. This parameter is specified in the URL path.
- `:organization` (`string: <required>`) - Specifies the organization name where the workspace belongs. This parameter is specified in the URL path.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces/my-workspace
```


## Lock a workspace

This endpoint locks a workspace.

| Method | Path           |
| :----- | :------------- |
| POST | /workspaces/:workspace_id/actions/lock |

### Parameters

* `:workspace_id` (`string: <required>`) - Specifies the workspace ID to lock.
* `reason` (`string: <optional>`) - Specifies the reason for locking the workspace.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/workspaces/ws-YnyXLq9fy38afEeb/actions/lock
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "auto-apply": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:23:53.765Z",
      "environment": "default",
      "locked": true,
      "name": "my-workspace",
      "permissions": {
        "can-destroy": true,
        "can-lock": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-update": true,
        "can-update-variable": true
      },
      "terraform-version": "0.10.8",
      "vcs-repo": {
        "branch": "",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "working-directory": null
    },
    "id": "ws-YnyXLq9fy38afEeb",
    "relationships": {
      "locked-by": {
        "data": {
          "id": "my-user",
          "type": "users"
        },
        "links": {
          "related": "/api/v2/users/my-user"
        }
      }
    },
    "type": "workspaces"
  }
}
```


## Unlock a workspace

This endpoint unlocks a workspace.

| Method | Path           |
| :----- | :------------- |
| POST | /workspaces/:workspace_id/actions/unlock |

### Parameters

* `:workspace_id` (`string: <required>`) - Specifies the workspace ID to unlock.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/workspaces/ws-YnyXLq9fy38afEeb/actions/unlock
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "auto-apply": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:23:53.765Z",
      "environment": "default",
      "locked": false,
      "name": "my-workspace",
      "permissions": {
        "can-destroy": true,
        "can-lock": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-update": true,
        "can-update-variable": true
      },
      "terraform-version": "0.10.8",
      "vcs-repo": {
        "branch": "",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "working-directory": null
    },
    "id": "ws-YnyXLq9fy38afEeb",
    "type": "workspaces"
  }
}
```
