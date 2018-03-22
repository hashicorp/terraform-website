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
      "name":"workspace-1"
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
      "name": "workspace-1",
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
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    }
  }
}
```

### Create a Workspace with a VCS Repository

By supplying the necessary attributes under a `vcs-repository` object, you can create a Workspace that is configured against a VCS Repository.

#### Parameters

- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `terraform_version` (`string: <optional>`) - Specifices the version of Terraform to use for this workspace.
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
      "name":"workspace-2",
      "terraform_version":"0.11.1",
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
      "name": "workspace-2",
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
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
    }
  }
}
```

### Create a Workspace which is migrated from a legacy Environment

By supplying the necessary attributes, you can create a workspace which is migrated from a legacy Environment. When you do this, the following will happen:
* Environment and Terraform variables will be copied to the workspace.
* Teams which are associated with the legacy Environment will be created in the destination Workspace's Organization.
* Members of those teams will be added as members in the destination Workspace's Organization.
* The Team will be given the same access level on the Workspace as it had with the legacy Environment.
* The latest state of the legacy Environment will be copied over into the Workspace and set as the Workspace's current state.
* VCS repo ingress settings will be copied over into the environment.

#### Parameters

- `name` (`string: <required>`) - Specifies the name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `migration-environment` (`string: <required>`) - Specifies the legacy Environment to use as the source of the migration in the form `organization/environment`
- `vcs-repo.oauth-token-id` (`string: <required>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
- `vcs-repo.identifier` (`string: <required>`) - This is the reference to your VCS repository in the format :org/:repo where :org and :repo refer to the organization and repository in your VCS provider.

#### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name":"workspace-2",
      "migration-environment":"legacy-hashicorp-organization/legacy-environment",
      "vcs-repo": {
        "identifier":"skierkowski/terraform-test-proj",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
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
      "name": "workspace-2",
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
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
    }
  }
}
```

## Update a Workspace

Update the workspace settings

| Method | Path           |
| :----- | :------------- |
| PATCH | /organizations/:organization_name/workspaces/:name |


### Parameters

Note that workspaces without an associated VCS repository only use the organization name, workspace name, terraform version, and working directory.

- `:organization_name` (`string: <required>`) - Specifies the name of the organization the workspace should belong to. The organization must already exist in the system, and the user must have permissions to create new workspaces. This parameter is specified in the URL path.
- `name` (`string: <required>`) - Specifies the name of the workspace to update, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
- `terraform_version` (`string: <optional>`) - Specifices the version of Terraform to use for this workspace.
- `working-directory` (`string: ''`) - Specifies the directory that Terraform will execute within. This defaults to the root of your configuration and is typically set to a subdirectory matching the environment when multiple environments exist within the same configuration.
- `vcs-repo.branch` (`string: ''`) - Specifies the repository branch that Terraform will execute from. If left null or as an empty string, this defaults to the repository's default branch (e.g. `master`) .
- `vcs-repo.oauth-token-id` (`string: <optional>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
- `vcs-repo.ingress-submodules` (`boolean: false`) - Specifies whether submodules should be fetched when cloning the VCS repository.
- `vcs-repo.identifier` (`string: <required>`) - This is the reference to your VCS repository in the format :org/:repo

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name":"workspace-2",
      "terraform_version":"0.11.1",
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
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces/workspace-2
```

### Sample Response

```json
{
  "data": {
    "id": "ws-SihZTyXKfNXUWuUa",
    "type": "workspaces",
    "attributes": {
      "name": "workspace-2",
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
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
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
      "id": "ws-SihZTyXKfNXUWuUa",
      "type": "workspaces",
      "attributes": {
        "name": "workspace-2",
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
        "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
      }
    },
    {
      "id": "ws-YnyXLq9fy38afEeb",
      "type": "workspaces",
      "attributes": {
        "name": "workspace-1",
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
        "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
      }
    }
  ]
}
```

## Show workspace

This endpoint shows details for a workspace in the organization.

| Method | Path           |
| :----- | :------------- |
| GET | /organizations/:organization/workspaces/:name |

### Parameters

- `:organization` (`string: <required>`) - Specifies the organization name under which to list the workspaces. This is specified in the URL path.
- `:name` (`string: <required>`) - Specifies the name of the workspace to show details for. This is specified in the URL path.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces/workspace-1
```

### Sample Response

```json
{
  "data": {
    "id": "ws-mD5bmJ8ry3uTzuHi",
    "type": "workspaces",
    "attributes": {
      "name": "workspace-1",
      "environment": "default",
      "auto-apply": false,
      "locked": false,
      "created-at": "2018-03-08T22:30:00.404Z",
      "working-directory": null,
      "terraform-version": "0.11.3",
      "permissions": {
        "can-update": true,
        "can-destroy": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-update-variable": true,
        "can-lock": true,
        "can-read-settings": true
      },
      "actions": {
        "is-destroyable": true
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "latest-run": {
        "data": null
      },
      "current-run": {
        "data": null
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    }
  }
}

```


## Delete a workspace

This endpoint deletes a workspace.

| Method | Path           |
| :----- | :------------- |
| DELETE | /organizations/:organization/workspaces/:name |

### Parameters

- `:name` (`string: <required>`) - Specifies the name of the workspace to delete. This parameter is specified in the URL path.
- `:organization` (`string: <required>`) - Specifies the name of the organization the workspace belongs to. This parameter is specified in the URL path.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces/workspace-1
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
  https://app.terraform.io/api/v2/workspaces/ws-SihZTyXKfNXUWuUa/actions/lock
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
      "name": "workspace-2",
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
    "id": "ws-SihZTyXKfNXUWuUa",
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
  https://app.terraform.io/api/v2/workspaces/ws-SihZTyXKfNXUWuUa/actions/unlock
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
      "name": "workspace-2",
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
    "id": "ws-SihZTyXKfNXUWuUa",
    "type": "workspaces"
  }
}
```


## Assign an SSH key to a workspace

This endpoint assigns an SSH key to a workspace.

| Method | Path           |
| :----- | :------------- |
| PATCH | /workspaces/:workspace_id/relationships/ssh-key |

### Parameters

* `:workspace_id` (`string: <required>`) - Specifies the workspace ID to assign the SSH key to.
* `id` (`string: <required>`) - Specifies the SSH key ID to assign. This ID can be obtained from the [ssh-keys](./ssh-keys.html) endpoint.

#### Sample Payload

```json
{
  "data":
  {
    "attributes": {
      "id":"sshkey-GxrePWre1Ezug7aM"
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
  https://app.terraform.io/api/v2/workspaces/ws-SihZTyXKfNXUWuUa/relationships/ssh-key
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "auto-apply": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:24:05.997Z",
      "environment": "default",
      "ingress-trigger-attributes": {
        "branch": "",
        "default-branch": true,
        "ingress-submodules": false
      },
      "locked": false,
      "name": "workspace-2",
      "terraform-version": "0.10.8",
      "working-directory": ""
    },
    "id": "ws-SihZTyXKfNXUWuUa",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
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
      },
      "ssh-key": {
        "data": {
          "id": "sshkey-GxrePWre1Ezug7aM",
          "type": "ssh-keys"
        },
        "links": {
          "related": "/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM"
        }
      }
    },
    "type": "workspaces"
  }
}
```


## Unassign an SSH key from a workspace

This endpoint unassigns the currently assigned SSH key from a workspace.

| Method | Path           |
| :----- | :------------- |
| PATCH | /workspaces/:workspace_id/relationships/ssh-key |

### Parameters

* `:workspace_id` (`string: <required>`) - Specifies the workspace ID to unassign the currently assigned SSH key from.

#### Sample Payload

```json
{
  "data":
  {
    "attributes": {
      "id":null
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
  https://app.terraform.io/api/v2/workspaces/ws-SihZTyXKfNXUWuUa/relationships/ssh-key
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "auto-apply": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:24:05.997Z",
      "environment": "default",
      "ingress-trigger-attributes": {
        "branch": "",
        "default-branch": true,
        "ingress-submodules": false
      },
      "locked": false,
      "name": "workspace-2",
      "terraform-version": "0.10.8",
      "working-directory": ""
    },
    "id": "ws-erEAnPmgtm5mJr77",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
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
      },
      "ssh-key": {
        "data": null
      }
    },
    "type": "workspaces"
  }
}
```
