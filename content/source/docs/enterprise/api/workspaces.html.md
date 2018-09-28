---
layout: enterprise2
page_title: "Workspaces - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-workspaces"
---

# Workspaces API

-> **Note**: These API endpoints are in beta and are subject to change.

Workspaces represent running infrastructure managed by Terraform.

## Create a Workspace

`POST /organizations/:organization_name/workspaces`

Parameter            | Description
-------------------- | ------------
`:organization_name` | The name of the organization to create the workspace in. The organization must already exist in the system, and the user must have permissions to create new workspaces.

-> **Note:** Workspace creation is restricted to members of the owners team, the owners team [service account](../users-teams-organizations/service-accounts.html#team-service-accounts), and the [organization service account](../users-teams-organizations/service-accounts.html#organization-service-accounts).

-> **Note:** Migrating legacy workspaces (with the `migration-environment` attribute) can only be done with a [user token](../users-teams-organizations/users.html#api-tokens). The user must be a member of the owners team in both the legacy organization and the new organization.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

By supplying the necessary attributes under a `vcs-repository` object, you can create a workspace that is configured against a VCS Repository.

By supplying a `migration-environment` attribute, you can create a workspace which is migrated from a legacy environment. When you do this, the following will happen:

* Environment and Terraform variables will be copied to the workspace.
* Teams which are associated with the legacy environment will be created in the destination workspace's organization, if teams with those names don't already exist.
* Members of those teams will be added as members of the corresponding teams in the destination workspace's organization.
* Each team will be given the same access level on the workspace as it had on the legacy environment.
* The latest state of the legacy environment will be copied over into the workspace and set as the workspace's current state.
* VCS repo ingress settings (like branch and working directory) will be copied over into the workspace.

Key path                                      | Type    | Default   | Description
----------------------------------------------|---------|-----------|------------
`data.type`                                   | string  |           | Must be `"workspaces"`.
`data.attributes.name`                        | string  |           | The name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
`data.attributes.auto-apply`                  | boolean | false     | Whether to automatically apply changes when a Terraform plan is successful.
`data.attributes.terraform-version`           | string  | (nothing) | The version of Terraform to use for this workspace. Upon creating a workspace, the latest version is selected unless otherwise specified (e.g. `"0.11.1"`).
`data.attributes.migration-environment`       | string  | (nothing) | The legacy TFE environment to use as the source of the migration, in the form `organization/environment`. Omit this unless you are migrating a legacy environment.
`data.attributes.working-directory`           | string  | (nothing) | A relative path that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.
`data.attributes.vcs-repo`                    | object  | (nothing) | Settings for the workspace's VCS repository. If omitted, the workspace is created without a VCS repo. If included, you must specify at least the `oauth-token-id` and `identifier` keys below.
`data.attributes.vcs-repo.oauth-token-id`     | string  |           | The VCS Connection (OAuth Connection + Token) to use. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
`data.attributes.vcs-repo.branch`             | string  | (nothing) | The repository branch that Terraform will execute from. If omitted or submitted as an empty string, this defaults to the repository's default branch (e.g. `master`) .
`data.attributes.vcs-repo.ingress-submodules` | boolean | false     | Whether submodules should be fetched when cloning the VCS repository.
`data.attributes.vcs-repo.identifier`         | string  |           | A reference to your VCS repository in the format :org/:repo where :org and :repo refer to the organization and repository in your VCS provider.

### Sample Payload

_Without a VCS repository_

```json
{
  "data": {
    "attributes": {
      "name": "workspace-1"
    },
    "type": "workspaces"
  }
}
```

_With a VCS repository_

```json
{
  "data": {
    "attributes": {
      "name": "workspace-2",
      "terraform_version": "0.11.1",
      "working-directory": "",
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "branch": "",
        "default-branch": true
      }
    },
    "type": "workspaces"
  }
}
```

_Migrating a legacy environment_

```json
{
  "data": {
    "attributes": {
      "name": "workspace-2",
      "migration-environment":
        "legacy-hashicorp-organization/legacy-environment",
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      }
    },
    "type": "workspaces"
  }
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces
```

### Sample Response

_Without a VCS repository_

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
      },
      "vcs-repo": null
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

_With a VCS repository_

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

_Migrating a legacy environment_

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

`PATCH /organizations/:organization_name/workspaces/:name`

Parameter            | Description
-------------------- | -----------
`:organization_name` | The name of the organization to create the workspace in. The organization must already exist in the system, and the user must have permissions to create new workspaces.
`:name`              | Specifies the name of the workspace to update, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Note that workspaces without an associated VCS repository only use the `auto-apply`, `terraform-version`, and `working-directory`.

Key path                                      | Type           | Default          | Description
----------------------------------------------|----------------|------------------|------------
`data.type`                                   | string         |                  | Must be `"workspaces"`.
`data.attributes.name`                        | string         | (previous value) | A new name for the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization. **Warning:** Changing a workspace's name changes its URL in the API and UI.
`data.attributes.auto-apply`                  | boolean        | (previous value) | Whether to automatically apply changes when a Terraform plan is successful.
`data.attributes.terraform-version`           | string         | (previous value) | The version of Terraform to use for this workspace.
`data.attributes.working-directory`           | string         | (previous value) | A relative path that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.
`data.attributes.vcs-repo`                    | object or null | (previous value) | To delete a workspace's existing VCS repo, specify `null` instead of an object. To modify a workspace's existing VCS repo, include whichever of the keys below you wish to modify. To add a new VCS repo to a workspace that didn't previously have one, include at least the `oauth-token-id` and `identifier` keys.
`data.attributes.vcs-repo.oauth-token-id`     | string         | (previous value) | The VCS Connection (OAuth Conection + Token) to use. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
`data.attributes.vcs-repo.branch`             | string         | (previous value) | The repository branch that Terraform will execute from.
`data.attributes.vcs-repo.ingress-submodules` | boolean        | (previous value) | Whether submodules should be fetched when cloning the VCS repository.
`data.attributes.vcs-repo.identifier`         | string         | (previous value) | A reference to your VCS repository in the format :org/:repo where :org and :repo refer to the organization and repository in your VCS provider.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name": "workspace-2",
      "terraform_version": "0.11.1",
      "working-directory": "",
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "branch": "",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      }
    },
    "type": "workspaces"
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

`GET /organizations/:organization_name/workspaces`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `:organization_name` | The name of the organization to create the workspace in. The organization must already exist in the system, and the user must have permissions to create new workspaces. |

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 150 workspaces per page.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
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

`GET /organizations/:organization_name/workspaces/:name`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `:organization_name` | The name of the organization to create the workspace in. The organization must already exist in the system, and the user must have permissions to create new workspaces. |
| `:name`              | Specifies the name of the workspace to show details for, which can only include letters, numbers, `-`, and `_`.                                                          |

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
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

`DELETE /organizations/:organization_name/workspaces/:name`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `:organization_name` | The name of the organization to create the workspace in. The organization must already exist in the system, and the user must have permissions to create new workspaces. |
| `:name`              | Specifies the name of the workspace to delete, which can only include letters, numbers, `-`, and `_`.                                                                    |

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/workspaces/workspace-1
```

## Lock a workspace

This endpoint locks a workspace.

`POST /workspaces/:workspace_id/actions/lock`

| Parameter       | Description                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `:workspace_id` | Specifies the workspace ID to lock. This can be found using the [Show workspace](#show-workspace) endpoint. |

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path | Type   | Default | Description                                     |
| -------- | ------ | ------- | ----------------------------------------------- |
| `reason` | string | `""`    | Specifies the reason for locking the workspace. |

### Sample Payload

```json
{
  "reason": "Locking workspace-1"
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
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

`POST /workspaces/:workspace_id/actions/unlock`

| Parameter       | Description                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `:workspace_id` | Specifies the workspace ID to unlock. This can be found using the [Show workspace](#show-workspace) endpoint. |

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
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

`PATCH /workspaces/:workspace_id/relationships/ssh-key`

| Parameter       | Description                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `:workspace_id` | Specifies the workspace ID to assign the SSH key to. This can be found using the [Show workspace](#show-workspace) endpoint. |

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path             | Type   | Default | Description                                                                                                |
| -------------------- | ------ | ------- | ---------------------------------------------------------------------------------------------------------- |
| `data.type`          | string |         | Must be `"workspaces"`.                                                                                    |
| `data.attributes.id` | string |         | Specifies the SSH key ID to assign. This ID can be obtained from the [ssh-keys](./ssh-keys.html) endpoint. |

#### Sample Payload

```json
{
  "data": {
    "attributes": {
      "id": "sshkey-GxrePWre1Ezug7aM"
    },
    "type": "workspaces"
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

`PATCH /workspaces/:workspace_id/relationships/ssh-key`

| Parameter       | Description                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `:workspace_id` | Specifies the workspace ID to assign the SSH key to. This can be found using the [Show workspace](#show-workspace) endpoint. |

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path             | Type   | Default | Description             |
| -------------------- | ------ | ------- | ----------------------- |
| `data.type`          | string |         | Must be `"workspaces"`. |
| `data.attributes.id` | string |         | Must be `null`.         |

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "id": null
    },
    "type": "workspaces"
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

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `organization` - The full organization record.
* `latest_run` - Additional information about the last run.
* `latest_run.plan` - The plan used in the last run.
* `latest_run.configuration_version` - The configuration used in the last run.
* `latest_run.configuration_version.ingress_attributes` - The commit information used in the last run.
* `current_run` - Additional information about the current run.
* `current_run.plan` - The plan used in the current run.
* `current_run.configuration_version` - The configuration used in the current run.
* `current_run.configuration_version.ingress_attributes` - The commit information used in the current run.
