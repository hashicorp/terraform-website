---
layout: "cloud"
page_title: "Workspaces - API Docs - Terraform Cloud and Terraform Enterprise"
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

[speculative plans]: ../run/index.html#speculative-plans

# Workspaces API

Workspaces represent running infrastructure managed by Terraform.

Viewing a workspace (individually or in a list) requires permission to read runs. Changing settings and force-unlocking require admin access to the workspace. Locking and unlocking a workspace requires permission to lock and unlock the workspace. ([More about permissions.](../users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Create a Workspace

`POST /organizations/:organization_name/workspaces`

Parameter            | Description
-------------------- | ------------
`:organization_name` | The name of the organization to create the workspace in. The organization must already exist in the system, and the user must have permissions to create new workspaces.

-> **Note:** Workspace creation is restricted to the owners team, teams with the "Manage Workspaces" permission, and the [organization API token](../users-teams-organizations/api-tokens.html#organization-api-tokens).

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

By supplying the necessary attributes under a `vcs-repository` object, you can create a workspace that is configured against a VCS Repository.

Key path                                      | Type    | Default   | Description
----------------------------------------------|---------|-----------|------------
`data.type`                                   | string  |           | Must be `"workspaces"`.
`data.attributes.name`                        | string  |           | The name of the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.
`data.attributes.agent-pool-id`               | string  | (nothing) | Required when `execution-mode` is set to `agent`. The ID of the agent pool belonging to the workspace's organization. This value must not be specified if `execution-mode` is set to `remote` or `local` or if `operations` is set to `true`.
`data.attributes.allow-destroy-plan`          | boolean | `true`    | Whether destroy plans can be queued on the workspace.
`data.attributes.auto-apply`                  | boolean | `false`   | Whether to automatically apply changes when a Terraform plan is successful, [with some exceptions](../workspaces/settings.html#auto-apply-and-manual-apply).
`data.attributes.description`                 | string  | (nothing) | A description for the workspace.
`data.attributes.execution-mode`              | string  | `remote`  | Which [execution mode](/docs/cloud/workspaces/settings.html#execution-mode) to use. Valid values are `remote`, `local`, and `agent`. When set to `local`, the workspace will be used for state storage only. This value must not be specified if `operations` is specified.
`data.attributes.file-triggers-enabled`       | boolean | `true`    | Whether to filter runs based on the changed files in a VCS push. If enabled, the `working-directory` and `trigger-prefixes` describe a set of paths which must contain changes for a VCS push to trigger a run. If disabled, any push will trigger a run.
`data.attributes.global-remote-state`         | boolean | `false`   | Whether the workspace should allow all workspaces in the organization to [access its state data](/docs/cloud/workspaces/state.html) during runs. If `false`, then only specifically approved workspaces can access its state. Manage allowed workspaces using the [Remote State Consumers](/docs/cloud/api/workspaces.html#get-remote-state-consumers) endpoints, documented later on this page. **Note:** Terraform Enterprise admins can choose the default value for new workspaces if this attribute is omitted.
`data.attributes.operations`                  | boolean | `true`    | **DEPRECATED** Use `execution-mode` instead. Whether to use remote execution mode. When set to `false`, the workspace will be used for state storage only. This value must not be specified if `execution-mode` is specified.
`data.attributes.queue-all-runs`              | boolean | `false`   | Whether runs should be queued immediately after workspace creation. When set to false, runs triggered by a VCS change will not be queued until at least one run is manually queued.
`data.attributes.source-name` **(beta)**      | string  | (nothing) | A friendly name for the application or client creating this workspace. If set, this will be displayed on the workspace as "Created via `<SOURCE NAME>`".
`data.attributes.source-url` **(beta)**       | string  | (nothing) | A URL for the application or client creating this workspace. This can be the URL of a related resource in another app, or a link to documentation or other info about the client.
`data.attributes.speculative-enabled`         | boolean | true      | Whether this workspace allows automatic [speculative plans][]. Setting this to `false` prevents Terraform Cloud from running plans on pull requests, which can improve security if the VCS repository is public or includes untrusted contributors. It doesn't prevent manual speculative plans via the remote backend or the runs API.
`data.attributes.terraform-version`           | string  | (nothing) | The version of Terraform to use for this workspace. Upon creating a workspace, the latest version is selected unless otherwise specified (e.g. `"0.11.1"`).
`data.attributes.trigger-prefixes`            | array   | `[]`      | List of repository-root-relative paths which should be tracked for changes, in addition to the working directory.
`data.attributes.vcs-repo`                    | object  | (nothing) | Settings for the workspace's VCS repository. If omitted, the workspace is created without a VCS repo. If included, you must specify at least the `oauth-token-id` and `identifier` keys below.
`data.attributes.vcs-repo.oauth-token-id`     | string  |           | The VCS Connection (OAuth Connection + Token) to use. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
`data.attributes.vcs-repo.branch`             | string  | (nothing) | The repository branch that Terraform will execute from. If omitted or submitted as an empty string, this defaults to the repository's default branch (e.g. `master`) .
`data.attributes.vcs-repo.ingress-submodules` | boolean | `false`   | Whether submodules should be fetched when cloning the VCS repository.
`data.attributes.vcs-repo.identifier`         | string  |           | A reference to your VCS repository in the format :org/:repo where :org and :repo refer to the organization and repository in your VCS provider. The format for Azure DevOps is `:org/:project/_git/:repo`.
`data.attributes.working-directory`           | string  | (nothing) | A relative path that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.

### Sample Payload

_Without a VCS repository_

```json
{
  "data": {
    "attributes": {
      "name": "workspace-1",
      "resource-count": 0,
      "updated-at": "2017-11-29T19:18:09.976Z"
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
      "resource-count": 0,
      "terraform_version": "0.11.1",
      "working-directory": "",
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "branch": ""
      },
      "updated-at": "2017-11-29T19:18:09.976Z"
    },
    "type": "workspaces"
  }
}
```

_For a monorepo_

A run will be triggered in this workspace when changes are detected in any of the specified directories: `/networking`, `/modules`, or `/vendor`.

```json
{
  "data": {
    "attributes": {
      "name": "workspace-3",
      "resource-count": 0,
      "terraform_version": "0.12.1",
      "trigger-prefixes": ["/modules", "/vendor"],
      "working-directory": "/networking",
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj-monorepo",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "branch": ""
      },
      "updated-at": "2017-11-29T19:18:09.976Z"
    },
    "type": "workspaces"
  }
}
```

_Using Terraform Cloud Agents_

[Terraform Cloud Agents](/docs/cloud/api/agents.html) are a solution to allow Terraform Cloud to communicate with isolated, private, or on-premises infrastructure.

```json
{
  "data": {
    "attributes": {
      "name":"workspace-1",
      "execution-mode": "agent",
      "agent-pool-id": "apool-ZjT6A7mVFm5WHT5a",
      "resource-count": 0,
      "updated-at": "2017-11-29T19:18:09.976Z"
    }
  },
  "type": "workspaces"
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
      "auto-apply": false,
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-18T00:43:59.384Z",
      "environment": "default",
      "file-triggers-enabled": true,
      "locked": false,
      "name": "workspace-1",
      "permissions": {
        "can-update": true,
        "can-destroy": false,
        "can-queue-destroy": false,
        "can-queue-run": false,
        "can-update-variable": false,
        "can-lock": false,
        "can-read-settings": true
      },
      "queue-all-runs": false,
      "resource-count": 0,
      "terraform-version": "0.11.0",
      "trigger-prefixes": [],
      "vcs-repo": null,
      "working-directory": "",
      "global-remote-state": true,
      "execution-mode": "agent",
      "updated-at": "2017-11-29T19:18:09.976Z"
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
      },
      "agent-pool": {
        "data": {
          "id": "apool-ZjT6A7mVFm5WHT5a",
          "type": "agent-pools"
        }
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
      "auto-apply": false,
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": true,
      "created-at": "2017-11-02T23:55:16.142Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
      "locked": false,
      "name": "workspace-2",
      "permissions": {
        "can-update": true,
        "can-destroy": false,
        "can-queue-destroy": false,
        "can-queue-run": false,
        "can-update-variable": false,
        "can-lock": false,
        "can-read-settings": true
      },
      "queue-all-runs": false,
      "resource-count": 0,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "branch": "",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "ingress-submodules": false
      },
      "working-directory": null,
      "global-remote-state": true,
      "execution-mode": "agent",
      "updated-at": "2017-11-29T19:18:09.976Z"
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
      },
      "agent-pool": {
        "data": {
          "id": "apool-ZjT6A7mVFm5WHT5a",
          "type": "agent-pools"
        }
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
    }
  }
}
```

## Update a Workspace

A workspace can be updated via two endpoints, which behave identically. One refers to a workspace by its ID, and the other by its name and organization.

`PATCH /workspaces/:workspace_id`

Parameter            | Description                       |
-------------------- | ----------------------------------|
`:workspace_id`      | The ID of the workspace to update |

`PATCH /organizations/:organization_name/workspaces/:name`

Parameter            | Description
-------------------- | -----------
`:organization_name` | The name of the organization the workspace belongs to.
`:name`              | The name of the workspace to update, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization.

### Request Body

These PATCH endpoints require a JSON object with the following properties as a request payload.

Properties without a default value are required.

Note that workspaces without an associated VCS repository only use the `auto-apply`, `terraform-version`, and `working-directory`.

Key path                                      | Type           | Default          | Description
----------------------------------------------|----------------|------------------|------------
`data.type`                                   | string         |                  | Must be `"workspaces"`.
`data.attributes.name`                        | string         | (previous value) | A new name for the workspace, which can only include letters, numbers, `-`, and `_`. This will be used as an identifier and must be unique in the organization. **Warning:** Changing a workspace's name changes its URL in the API and UI.
`data.attributes.agent-pool-id`               | string         | (previous value) | Required when `execution-mode` is set to `agent`. The ID of the agent pool belonging to the workspace's organization. This value must not be specified if `execution-mode` is set to `remote` or `local` or if `operations` is set to `true`.
`data.attributes.allow-destroy-plan`          | boolean        | (previous value) | Whether destroy plans can be queued on the workspace.
`data.attributes.auto-apply`                  | boolean        | (previous value) | Whether to automatically apply changes when a Terraform plan is successful, [with some exceptions](../workspaces/settings.html#auto-apply-and-manual-apply).
`data.attributes.description`                 | string         | (previous value) | A description for the workspace.
`data.attributes.execution-mode`              | string         | (previous value) | Which [execution mode](/docs/cloud/workspaces/settings.html#execution-mode) to use. Valid values are `remote`, `local`, and `agent`. When set to `local`, the workspace will be used for state storage only. This value must not be specified if `operations` is specified.
`data.attributes.file-triggers-enabled`       | boolean        | (previous value) | Whether to filter runs based on the changed files in a VCS push. If enabled, the `working-directory` and `trigger-prefixes` describe a set of paths which must contain changes for a VCS push to trigger a run. If disabled, any push will trigger a run.
`data.attributes.global-remote-state`         | boolean        | (previous value) | Whether the workspace should allow all workspaces in the organization to [access its state data](/docs/cloud/workspaces/state.html) during runs. If `false`, then only specifically approved workspaces can access its state. Manage allowed workspaces using the [Remote State Consumers](/docs/cloud/api/workspaces.html#get-remote-state-consumers) endpoints, documented later on this page.
`data.attributes.operations`                  | boolean        | (previous value) | **DEPRECATED** Use `execution-mode` instead. Whether to use remote execution mode. When set to `false`, the workspace will be used for state storage only. This value must not be specified if `execution-mode` is specified.
`data.attributes.queue-all-runs`              | boolean        | (previous value) | Whether runs should be queued immediately after workspace creation. When set to false, runs triggered by a VCS change will not be queued until at least one run is manually queued.
`data.attributes.speculative-enabled`         | boolean        | (previous value) | Whether this workspace allows automatic [speculative plans][]. Setting this to `false` prevents Terraform Cloud from running plans on pull requests, which can improve security if the VCS repository is public or includes untrusted contributors. It doesn't prevent manual speculative plans via the remote backend or the runs API.
`data.attributes.terraform-version`           | string         | (previous value) | The version of Terraform to use for this workspace.
`data.attributes.trigger-prefixes`            | array          | (previous value) | List of repository-root-relative paths which should be tracked for changes, in addition to the working directory.
`data.attributes.vcs-repo`                    | object or null | (previous value) | To delete a workspace's existing VCS repo, specify `null` instead of an object. To modify a workspace's existing VCS repo, include whichever of the keys below you wish to modify. To add a new VCS repo to a workspace that didn't previously have one, include at least the `oauth-token-id` and `identifier` keys.
`data.attributes.vcs-repo.oauth-token-id`     | string         | (previous value) | The VCS Connection (OAuth Connection + Token) to use. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
`data.attributes.vcs-repo.branch`             | string         | (previous value) | The repository branch that Terraform will execute from.
`data.attributes.vcs-repo.ingress-submodules` | boolean        | (previous value) | Whether submodules should be fetched when cloning the VCS repository.
`data.attributes.vcs-repo.identifier`         | string         | (previous value) | A reference to your VCS repository in the format :org/:repo where :org and :repo refer to the organization and repository in your VCS provider. The format for Azure DevOps is `:org/:project/_git/:repo`.
`data.attributes.working-directory`           | string         | (previous value) | A relative path that Terraform will execute within. This defaults to the root of your repository and is typically set to a subdirectory matching the environment when multiple environments exist within the same repository.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name": "workspace-2",
      "resource-count": 0,
      "terraform_version": "0.11.1",
      "working-directory": "",
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "branch": "",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "updated-at": "2017-11-29T19:18:09.976Z"
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
      "auto-apply": false,
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:24:05.997Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
      "locked": false,
      "name": "workspace-2",
      "queue-all-runs": false,
      "resource-count": 0,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "identifier": "skierkowski/terraform-test-proj",
        "branch": "",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "working-directory": "",
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
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
| -------------------- | --------------------------------------------------------|
| `:organization_name` | The name of the organization to list the workspaces of. |

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 workspaces per page.

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
        "auto-apply": false,
        "allow-destroy-plan": false,
        "can-queue-destroy-plan": false,
        "created-at": "2017-11-02T23:24:05.997Z",
        "description": null,
        "environment": "default",
        "file-triggers-enabled": true,
        "locked": false,
        "name": "workspace-2",
        "queue-all-runs": false,
        "resource-count": 5,
        "source": "tfe-ui",
        "source-name": null,
        "source-url": null,
        "terraform-version": "0.10.8",
        "trigger-prefixes": [],
        "vcs-repo": {
          "branch": "",
          "ingress-submodules": false
        },
        "working-directory": "",
        "global-remote-state": true,
        "updated-at": "2017-11-29T19:18:09.976Z"
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
        "auto-apply": false,
        "allow-destroy-plan":false,
        "can-queue-destroy-plan": false,
        "created-at": "2017-11-02T23:23:53.765Z",
        "description": null,
        "environment": "default",
        "file-triggers-enabled": true,
        "locked": false,
        "name": "workspace-1",
        "queue-all-runs": false,
        "resource-count": 5,
        "source": "tfe-ui",
        "source-name": null,
        "source-url": null,
        "terraform-version": "0.10.8",
        "trigger-prefixes": [],
        "vcs-repo": {
          "branch": "",
          "ingress-submodules": false
        },
        "working-directory": "",
        "global-remote-state": true,
        "updated-at": "2017-11-29T19:18:09.976Z"
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

Details on a workspace can be retrieved from two endpoints, which behave identically.

One refers to a workspace by its ID:

`GET /workspaces/:workspace_id`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID |

The other refers to a workspace by its name and organization:

`GET /organizations/:organization_name/workspaces/:name`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `:organization_name` | The name of the organization the workspace belongs to.                                                |
| `:name`              | The name of the workspace to show details for, which can only include letters, numbers, `-`, and `_`. |

### Workspace performance attributes

The following attributes are helpful in determining the overall health and performance of your workspace configuration.  These metrics refer to the **past 30 runs that have either resulted in an error or successfully applied**.

| Parameter                                  | Type   | Description                                                                                                                                                              |
| ------------------------------------------ | ------ | --------------------------------------------------------------------------------------- |
| `data.attributes.apply-duration-average`   | number | This is the average time runs spend in the **apply** phase, represented in milliseconds |
| `data.attributes.plan-duration-average`    | number | This is the average time runs spend in the **plan** phase, represented in milliseconds  |
| `data.attributes.policy-check-failures`    | number | Reports the number of run failures resulting from a policy check failure                |
| `data.attributes.run-failures`             | number | Reports the number of failed runs                                                       |
| `data.attributes.workspace-kpis-run-count` | number | Total number of runs taken into account by these metrics                                |

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
      "actions": {
        "is-destroyable": true
      },
      "apply-duration-average": 600000,
      "auto-apply": false,
      "allow-destroy-plan": true,
      "created-at": "2018-03-08T22:30:00.404Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
      "locked": false,
      "name": "workspace-1",
      "permissions": {
        "can-update": true,
        "can-destroy": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-update-variable": true,
        "can-lock": true,
        "can-read-settings": true
      },
      "plan-duration-average": 600000,
      "policy-check-failures": 5,
      "queue-all-runs": false,
      "resource-count": 5,
      "run-failures": 2,
      "workspace-kpis-run-count": 10,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.11.3",
      "trigger-prefixes": [],
      "working-directory": null,
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "org-MxtxBC6ihhU6u8AG",
          "type": "organizations"
        }
      },
      "current-run": {
        "data": {
          "id": "run-ZbX5Lb4n8Kdu4roV",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-ZbX5Lb4n8Kdu4roV"
        }
      },
      "latest-run": {
        "data": {
          "id": "run-ZbX5Lb4n8Kdu4roV",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-ZbX5Lb4n8Kdu4roV"
        }
      },
      "outputs": {
        "data": [{
          "id": "wsout-tZ2bJSSeECSBkCiS",
          "type": "workspace-outputs"
        }]
      },
    },
    "included": [{
      "id": "wsout-tZ2bJSSeECSBkCiS",
      "type": "workspace-outputs",
      "attributes": {
        "name": "random",
        "sensitive": false,
        "output-type": "string",
        "workspace-attributes": {
          "id": "ws-sKRZA6LNRdViecHa",
          "name": "terraform-testing"
        },
        "organization-attributes": {
          "id": "org-MsM3mTFU49nX3Qbo",
          "name": "jondavidjohn"
        },
        "value": "evenly-rapidly-noticeably-model-horse"
      }
    }],
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    }
  }
}
```

## Delete a workspace

A workspace can be deleted via two endpoints, which behave identically. One refers to a workspace by its ID, and the other by its name and organization.

`DELETE /workspaces/:workspace_id`

Parameter            | Description                      |
-------------------- | ---------------------------------|
`:workspace_id`      | The ID of the workspace to delete|

`DELETE /organizations/:organization_name/workspaces/:name`

| Parameter            | Description                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `:organization_name` | The name of the organization the workspace belongs to.                                      |
| `:name`              | The name of the workspace to delete, which can only include letters, numbers, `-`, and `_`. |

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
| `:workspace_id` | The workspace ID to lock. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully locked the workspace
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[409][] | [JSON API error object][]                    | Workspace already locked


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path | Type   | Default | Description                                     |
| -------- | ------ | ------- | ----------------------------------------------- |
| `reason` | string | `""`    | The reason for locking the workspace. |

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
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:23:53.765Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
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
      "queue-all-runs": false,
      "resource-count": 5,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "branch": "",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "working-directory": null,
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
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
| `:workspace_id` | The workspace ID to unlock. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully unlocked the workspace
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[409][] | [JSON API error object][]                    | Workspace already unlocked, or locked by a different user


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
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:23:53.765Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
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
      "queue-all-runs": false,
      "resource-count": 5,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "branch": "",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "working-directory": null,
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
    },
    "id": "ws-SihZTyXKfNXUWuUa",
    "type": "workspaces"
  }
}
```

## Force Unlock a workspace

This endpoint force unlocks a workspace. Only users with admin access are authorized to force unlock a workspace.

`POST /workspaces/:workspace_id/actions/force-unlock`

| Parameter       | Description                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `:workspace_id` | The workspace ID to force unlock. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully force unlocked the workspace
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[409][] | [JSON API error object][]                    | Workspace already unlocked


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/workspaces/ws-SihZTyXKfNXUWuUa/actions/force-unlock
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "auto-apply": false,
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:23:53.765Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
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
      "queue-all-runs": false,
      "resource-count": 5,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "branch": "",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ"
      },
      "working-directory": null,
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
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
| `:workspace_id` | The workspace ID to assign the SSH key to. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path             | Type   | Default | Description                                                                                                |
| -------------------- | ------ | ------- | ---------------------------------------------------------------------------------------------------------- |
| `data.type`          | string |         | Must be `"workspaces"`.                                                                                    |
| `data.attributes.id` | string |         | The SSH key ID to assign. Obtain this from the [ssh-keys](./ssh-keys.html) endpoint. |

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
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:24:05.997Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
      "locked": false,
      "name": "workspace-2",
      "queue-all-runs": false,
      "resource-count": 5,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "branch": "",
        "ingress-submodules": false
      },
      "working-directory": "",
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
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
| `:workspace_id` | The workspace ID to assign the SSH key to. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

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
      "allow-destroy-plan": false,
      "can-queue-destroy-plan": false,
      "created-at": "2017-11-02T23:24:05.997Z",
      "description": null,
      "environment": "default",
      "file-triggers-enabled": true,
      "locked": false,
      "name": "workspace-2",
      "queue-all-runs": false,
      "resource-count": 5,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "terraform-version": "0.10.8",
      "trigger-prefixes": [],
      "vcs-repo": {
        "branch": "",
        "ingress-submodules": false
      },
      "working-directory": "",
      "global-remote-state": true,
      "updated-at": "2017-11-29T19:18:09.976Z"
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

## Get Remote State Consumers

`GET /workspaces/:workspace_id/relationships/remote_state_consumers`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to get remote state consumers for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

This endpoint retrieves the list of other workspaces that are allowed to access the given workspace's state during runs.

- If `global-remote-state` is set to false for the workspace, this will return the list of other workspaces that are specifically authorized to access the workspace's state.
- If `global-remote-state` is set to true, this will return a list of every workspace in the organization except for the subject workspace.

The list returned by this endpoint is subject to the caller's normal workspace permissions; it will not include workspaces that the provided API token is unable to read.

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 workspaces per page.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-SihZTyXKfNXUWuUa/relationships/remote-state-consumers
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ws-kGUhmUEb5ep55auL",
      "type": "workspaces",
      "attributes": {
        "allow-destroy-plan": true,
        "auto-apply": false,
        "auto-destroy-at": null,
        "created-at": "2021-04-16T14:02:30.116Z",
        "environment": "default",
        "locked": false,
        "name": "SlothSpace-a6959312-555c-4b98-83ba-a5bb4eb5ea58",
        "queue-all-runs": false,
        "speculative-enabled": true,
        "terraform-version": "0.13.4",
        "working-directory": "",
        "global-remote-state": false,
        "latest-change-at": "2021-04-16T14:02:30.116Z",
        "operations": true,
        "execution-mode": "remote",
        "vcs-repo": null,
        "vcs-repo-identifier": null,
        "permissions": {
          "can-update": true,
          "can-destroy": true,
          "can-queue-destroy": true,
          "can-queue-run": true,
          "can-queue-apply": true,
          "can-read-state-versions": true,
          "can-create-state-versions": true,
          "can-read-variable": true,
          "can-update-variable": true,
          "can-lock": true,
          "can-unlock": true,
          "can-force-unlock": true,
          "can-read-settings": true
        },
        "actions": {
          "is-destroyable": true
        },
        "description": "The workspace where we keep the sloths.",
        "file-triggers-enabled": true,
        "trigger-prefixes": [],
        "source": null,
        "source-name": null,
        "source-url": null
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "organization_1",
            "type": "organizations"
          }
        },
        "ssh-key": {
          "data": {
            "id": "sshkey-dVK2FiBVcbeKfcPy",
            "type": "ssh-keys"
          },
          "links": {
            "related": "/api/v2/ssh-keys/sshkey-dVK2FiBVcbeKfcPy"
          }
        },
        "current-run": {
          "data": null
        },
        "latest-run": {
          "data": null
        },
        "remote-state-consumers": {
          "links": {
            "related": "/api/v2/workspaces/ws-kGUhmUEb5ep55auL/relationships/remote-state-consumers"
          }
        },
        "current-state-version": {
          "data": null
        },
        "current-configuration-version": {
          "data": null
        },
        "agent-pool": {
          "data": null
        }
      },
      "links": {
        "self": "/api/v2/organizations/organization_1/workspaces/SlothSpace-a6959312-555c-4b98-83ba-a5bb4eb5ea58"
      }
    }
  ],
  "links": {
    "self": "http://test.host/api/v2/workspaces/ws-Jp5DW3dPpCLmR3um/relationships/remote-state-consumers?page%5Bnumber%5D=1&page%5Bsize%5D=20&show_only_configured=true",
    "first": "http://test.host/api/v2/workspaces/ws-Jp5DW3dPpCLmR3um/relationships/remote-state-consumers?page%5Bnumber%5D=1&page%5Bsize%5D=20&show_only_configured=true",
    "prev": null,
    "next": null,
    "last": "http://test.host/api/v2/workspaces/ws-Jp5DW3dPpCLmR3um/relationships/remote-state-consumers?page%5Bnumber%5D=1&page%5Bsize%5D=20&show_only_configured=true"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 1
    }
  }
}
```

## Replace Remote State Consumers

`PATCH /workspaces/:workspace_id/relationships/remote_state_consumers`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to replace remote state consumers for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

This endpoint updates the workspace's remote state consumers to be _exactly_ the list of workspaces specified in the payload. It can only be used for workspaces where `global-remote-state` is false.

This endpoint can only be used by teams with permission to manage workspaces for the entire organization — only those who can _view_ the entire list of consumers can _replace_ the entire list. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html)) Teams with admin permissions on specific workspaces can still modify remote state consumers for those workspaces, but must use the add (POST) and remove (DELETE) endpoints listed below instead of this PATCH endpoint.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully updated remote state consumers
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path                | Type   | Default | Description             |
| --------------------    | ------ | ------- | ----------------------- |
| `data[].type`           | string |         | Must be `"workspaces"`. |
| `data[].id`             | string |         | The ID of a workspace to be set as a remote state consumer. |

### Sample Payload

```json
{
  "data": [
    {
      "id": "ws-7aiqKYf6ejMFdtWS",
      "type": "workspaces"
    }
  ]
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-UYv6RYM8fVhzeGG5/relationships/remote-state-consumers
```

### Response

No response body.

Status code `204`.

## Add Remote State Consumers

`POST /workspaces/:workspace_id/relationships/remote_state_consumers`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to add remote state consumers for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

This endpoint adds one or more remote state consumers to the workspace. It can only be used for workspaces where `global-remote-state` is false.

- The workspaces specified as consumers must be readable to the API token that makes the request.
- A workspace cannot be added as a consumer of itself. (A workspace can always read its own state, regardless of access settings.)
- You can safely add a consumer workspace that is already present; it will be ignored, and the rest of the consumers in the request will be processed normally.

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully updated remote state consumers
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path                | Type   | Default | Description             |
| --------------------    | ------ | ------- | ----------------------- |
| `data[].type`           | string |         | Must be `"workspaces"`. |
| `data[].id`             | string |         | The ID of a workspace to be set as a remote state consumer. |

### Sample Payload

```json
{
  "data": [
    {
      "id": "ws-7aiqKYf6ejMFdtWS",
      "type": "workspaces"
    }
  ]
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-UYv6RYM8fVhzeGG5/relationships/remote-state-consumers
```

### Response

No response body.

Status code `204`.

## Delete Remote State Consumers

`DELETE /workspaces/:workspace_id/relationships/remote_state_consumers`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to remove remote state consumers for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

This endpoint removes one or more remote state consumers from a workspace, according to the contents of the payload. It can only be used for workspaces where `global-remote-state` is false.

- The workspaces specified as consumers must be readable to the API token that makes the request.
- You can safely remove a consumer workspace that is already absent; it will be ignored, and the rest of the consumers in the request will be processed normally.

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully updated remote state consumers
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Problem with payload or request; details provided in the error object

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path                | Type   | Default | Description             |
| --------------------    | ------ | ------- | ----------------------- |
| `data[].type`           | string |         | Must be `"workspaces"`. |
| `data[].id`             | string |         | The ID of a workspace to remove from the remote state consumers. |

### Sample Payload

```json
{
  "data": [
    {
      "id": "ws-7aiqKYf6ejMFdtWS",
      "type": "workspaces"
    }
  ]
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-UYv6RYM8fVhzeGG5/relationships/remote-state-consumers
```

### Response

No response body.

Status code `204`.


## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `organization` - The full organization record.
* `current_configuration_version` - The last configuration this workspace received, excluding plan-only configurations. If you start a run without providing a different configuration, it will use this one.
* `current_configuration_version.ingress_attributes` - The commit information for the current configuration version.
* `current_run` - Additional information about the current run.
* `current_run.plan` - The plan used in the current run.
* `current_run.configuration_version` - The configuration used in the current run.
* `current_run.configuration_version.ingress_attributes` - The commit information used in the current run.
* `readme` - The most recent workspace README.md
* `outputs` - The outputs for the most recently applied run.
