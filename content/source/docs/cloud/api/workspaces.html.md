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
`data.attributes.terraform-version`           | string  | (special) | The version of Terraform to use for this workspace. This can be either an exact version or a [version constraint](/docs/language/expressions/version-constraints.html) (like `~> 1.0.0`); if you specify a constraint, the workspace will always use the newest release that meets that constraint. If omitted when creating a workspace, this defaults to the latest released version.
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
    "attributes": {
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T21:22:49.566Z",
      "description": null,
      "environment": "default",
      "execution-mode": "agent",
      "file-triggers-enabled": true,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T21:22:49.566Z",
      "locked": false,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-api",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": true,
      "structured-run-output-enabled": true,
      "terraform-version": "1.0.4",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T21:22:49.566Z",
      "vcs-repo": null,
      "vcs-repo-identifier": null,
      "working-directory": null,
      "workspace-kpis-runs-count": null
    },
    "id": "ws-6jrRyVDv1J8zQMB5",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
      "agent-pool": {
        "data": {
          "id": "apool-QxGd2tRjympfMvQc",
          "type": "agent-pools"
        }
      },
      "current-configuration-version": {
        "data": null
      },
      "current-run": {
        "data": null
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": null
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": null
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-6jrRyVDv1J8zQMB5/relationships/remote-state-consumers"
        }
      }
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
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T21:50:58.726Z",
      "description": null,
      "environment": "default",
      "execution-mode": "remote",
      "file-triggers-enabled": true,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T21:50:58.726Z",
      "locked": false,
      "name": "workspace-2",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-api",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": true,
      "structured-run-output-enabled": true,
      "terraform-version": "0.11.1",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T21:50:58.726Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "skierkowski/terraform-test-proj",
        "identifier": "skierkowski/terraform-test-proj",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "repository-http-url": "https://github.com/skierkowski/terraform-test-proj",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "skierkowski/terraform-test-proj",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-KTuq99JSzgmDSvYj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
    },
    "relationships": {
      "agent-pool": {
        "data": null
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-9WgU5LYoTq3rrnG6",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-9WgU5LYoTq3rrnG6"
        }
      },
      "current-run": {
        "data": null
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": null
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": null
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-KTuq99JSzgmDSvYj/relationships/remote-state-consumers"
        }
      }
    },
    "type": "workspaces"
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
`data.attributes.terraform-version`           | string         | (previous value) | The version of Terraform to use for this workspace. This can be either an exact version or a [version constraint](/docs/language/expressions/version-constraints.html) (like `~> 1.0.0`); if you specify a constraint, the workspace will always use the newest release that meets that constraint.
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
    "attributes": {
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T21:50:58.726Z",
      "description": null,
      "environment": "default",
      "execution-mode": "remote",
      "file-triggers-enabled": true,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T21:50:58.726Z",
      "locked": false,
      "name": "workspace-2",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-api",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": true,
      "structured-run-output-enabled": true,
      "terraform-version": "0.11.1",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T21:50:58.726Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "skierkowski/terraform-test-proj",
        "identifier": "skierkowski/terraform-test-proj",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "repository-http-url": "https://github.com/skierkowski/terraform-test-proj",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "skierkowski/terraform-test-proj",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-KTuq99JSzgmDSvYj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
    },
    "relationships": {
      "agent-pool": {
        "data": null
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-9WgU5LYoTq3rrnG6",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-9WgU5LYoTq3rrnG6"
        }
      },
      "current-run": {
        "data": null
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": null
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227347",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-KTuq99JSzgmDSvYj/relationships/remote-state-consumers"
        }
      }
    },
    "type": "workspaces"
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
`search[name]` | **Optional.** Allows searching the organization's workspaces by name.

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
  "data": {
    "attributes": {
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T21:50:58.726Z",
      "description": null,
      "environment": "default",
      "execution-mode": "remote",
      "file-triggers-enabled": true,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T21:50:58.726Z",
      "locked": false,
      "name": "workspace-2",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-api",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": true,
      "structured-run-output-enabled": true,
      "terraform-version": "0.11.1",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T21:50:58.726Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "skierkowski/terraform-test-proj",
        "identifier": "skierkowski/terraform-test-proj",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "repository-http-url": "https://github.com/skierkowski/terraform-test-proj",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "skierkowski/terraform-test-proj",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-KTuq99JSzgmDSvYj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
    },
    "relationships": {
      "agent-pool": {
        "data": null
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-9WgU5LYoTq3rrnG6",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-9WgU5LYoTq3rrnG6"
        }
      },
      "current-run": {
        "data": null
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": null
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227347",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-KTuq99JSzgmDSvYj/relationships/remote-state-consumers"
        }
      }
    },
    "type": "workspaces"
  },
  {
    "data": {
      "attributes": {
        "actions": {
          "is-destroyable": true
        },
        "allow-destroy-plan": true,
        "apply-duration-average": null,
        "auto-apply": false,
        "auto-destroy-at": null,
        "created-at": "2021-08-16T21:22:49.566Z",
        "description": null,
        "environment": "default",
        "execution-mode": "agent",
        "file-triggers-enabled": true,
        "global-remote-state": false,
        "latest-change-at": "2021-08-16T21:22:49.566Z",
        "locked": false,
        "name": "workspace-1",
        "operations": true,
        "permissions": {
          "can-create-state-versions": true,
          "can-destroy": true,
          "can-force-unlock": true,
          "can-lock": true,
          "can-manage-tags": true,
          "can-queue-apply": true,
          "can-queue-destroy": true,
          "can-queue-run": true,
          "can-read-settings": true,
          "can-read-state-versions": true,
          "can-read-variable": true,
          "can-unlock": true,
          "can-update": true,
          "can-update-variable": true
        },
        "plan-duration-average": null,
        "policy-check-failures": null,
        "queue-all-runs": false,
        "resource-count": 0,
        "run-failures": null,
        "source": "tfe-api",
        "source-name": null,
        "source-url": null,
        "speculative-enabled": true,
        "structured-run-output-enabled": true,
        "terraform-version": "1.0.4",
        "trigger-prefixes": [],
        "updated-at": "2021-08-16T21:22:49.566Z",
        "vcs-repo": null,
        "vcs-repo-identifier": null,
        "working-directory": null,
        "workspace-kpis-runs-count": null
      },
      "id": "ws-6jrRyVDv1J8zQMB5",
      "links": {
        "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
      },
      "relationships": {
        "agent-pool": {
          "data": {
            "id": "apool-QxGd2tRjympfMvQc",
            "type": "agent-pools"
          }
        },
        "current-configuration-version": {
          "data": null
        },
        "current-run": {
          "data": null
        },
        "current-state-version": {
          "data": null
        },
        "latest-run": {
          "data": null
        },
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        },
        "outputs": {
          "data": []
        },
        "readme": {
          "data": null
        },
        "remote-state-consumers": {
          "links": {
            "related": "/api/v2/workspaces/ws-6jrRyVDv1J8zQMB5/relationships/remote-state-consumers"
          }
        }
      },
      "type": "workspaces"
    }
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
    "attributes": {
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": 158000,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-06-03T17:50:20.307Z",
      "description": "An example workspace for documentation.",
      "environment": "default",
      "execution-mode": "remote",
      "file-triggers-enabled": true,
      "global-remote-state": false,
      "latest-change-at": "2021-06-23T17:50:48.815Z",
      "locked": false,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": 20000,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": 6,
      "source": "terraform",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": true,
      "structured-run-output-enabled": false,
      "terraform-version": "0.15.3",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T18:54:06.874Z",
      "vcs-repo": null,
      "vcs-repo-identifier": null,
      "working-directory": null,
      "workspace-kpis-runs-count": 7
    },
    "id": "ws-qPhan8kDLymzv2uS",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
         "agent-pool": {
           "data": {
             "id": "apool-QxGd2tRjympfMvQc",
             "type": "agent-pools"
           }
         },
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-sixaaRuRwutYg5fH",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-sixaaRuRwutYg5fH"
        }
      },
      "current-run": {
        "data": {
          "id": "run-UyCw2TDCmxtfdjmy",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-UyCw2TDCmxtfdjmy"
        }
      },
      "current-state-version": {
        "data": {
          "id": "sv-TAjm2vFZqY396qY6",
          "type": "state-versions"
        },
        "links": {
          "related": "/api/v2/workspaces/ws-qPhan8kDLymzv2uS/current-state-version"
        }
      },
      "latest-run": {
        "data": {
          "id": "run-UyCw2TDCmxtfdjmy",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-UyCw2TDCmxtfdjmy"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
          "data": {
            "id": "227247",
            "type": "workspace-readme"
          }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-qPhan8kDLymzv2uS/relationships/remote-state-consumers"
        }
      }
    },
    "type": "workspaces"
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
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T19:44:45.241Z",
      "description": "Example workspace for documentation.",
      "environment": "default",
      "execution-mode": "agent",
      "file-triggers-enabled": false,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T19:44:45.241Z",
      "locked": true,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": false,
      "structured-run-output-enabled": true,
      "terraform-version": "1.0.4",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T22:39:15.912Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "my-organization/my-repository",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "repository-http-url": "https://github.com/my-organization/my-repository",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "my-organization/my-repository",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-FFP9JcN4m6czSRBj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
      "agent-pool": {
        "data": {
          "id": "apool-QxGd2tRjympfMvQc",
          "type": "agent-pools"
        }
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-EpThx8RZdxt8a2mK",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-EpThx8RZdxt8a2mK"
        }
      },
      "current-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "locked-by": {
        "data": {
          "id": "user-mGUNNJBeTrTYgxmv",
          "type": "users"
        },
        "links": {
          "related": "/api/v2/users/user-mGUNNJBeTrTYgxmv"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227247",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers"
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
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T19:44:45.241Z",
      "description": "Example workspace for documentation.",
      "environment": "default",
      "execution-mode": "agent",
      "file-triggers-enabled": false,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T19:44:45.241Z",
      "locked": false,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": false,
      "structured-run-output-enabled": true,
      "terraform-version": "1.0.4",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T22:36:43.666Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "my-organization/my-repository",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "repository-http-url": "https://github.com/my-organization/my-repository",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "my-organization/my-repository",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-FFP9JcN4m6czSRBj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
      "agent-pool": {
        "data": {
          "id": "apool-QxGd2tRjympfMvQc",
          "type": "agent-pools"
        }
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-EpThx8RZdxt8a2mK",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-EpThx8RZdxt8a2mK"
        }
      },
      "current-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227247",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers"
        }
      }
    },
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
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T19:44:45.241Z",
      "description": "Example workspace for documentation.",
      "environment": "default",
      "execution-mode": "agent",
      "file-triggers-enabled": false,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T19:44:45.241Z",
      "locked": false,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": false,
      "structured-run-output-enabled": true,
      "terraform-version": "1.0.4",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T22:42:06.143Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "my-organization/my-repository",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "repository-http-url": "https://github.com/my-organization/my-repository",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "my-organization/my-repository",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-FFP9JcN4m6czSRBj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
      "agent-pool": {
        "data": {
          "id": "apool-QxGd2tRjympfMvQc",
          "type": "agent-pools"
        }
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-EpThx8RZdxt8a2mK",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-EpThx8RZdxt8a2mK"
        }
      },
      "current-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227247",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers"
        }
      }
    },
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
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T19:44:45.241Z",
      "description": "Example workspace for documentation.",
      "environment": "default",
      "execution-mode": "agent",
      "file-triggers-enabled": false,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T19:44:45.241Z",
      "locked": false,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": false,
      "structured-run-output-enabled": true,
      "terraform-version": "1.0.4",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T22:59:56.631Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "my-organization/my-repository",
        "identifier": "my-organization/my-repository",
        "ingress-submodules": false,
        "oauth-token-id": "ot-4ecWLF8W8gfxxNXP",
        "repository-http-url": "https://github.com/my-organization/my-repository",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "my-organization/my-repository",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-FFP9JcN4m6czSRBj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
      "agent-pool": {
        "data": {
          "id": "apool-QxGd2tRjympfMvQc",
          "type": "agent-pools"
        }
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-EpThx8RZdxt8a2mK",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-EpThx8RZdxt8a2mK"
        }
      },
      "current-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227247",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers"
        }
      },
      "ssh-key": {
        "data": {
          "id": "sshkey-WfPdX2GKwGkK5rsB",
          "type": "ssh-keys"
        },
        "links": {
          "related": "/api/v2/ssh-keys/sshkey-WfPdX2GKwGkK5rsB"
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
      "actions": {
        "is-destroyable": true
      },
      "allow-destroy-plan": true,
      "apply-duration-average": null,
      "auto-apply": false,
      "auto-destroy-at": null,
      "created-at": "2021-08-16T19:44:45.241Z",
      "description": "Example workspace for documentation.",
      "environment": "default",
      "execution-mode": "agent",
      "file-triggers-enabled": false,
      "global-remote-state": false,
      "latest-change-at": "2021-08-16T19:44:45.241Z",
      "locked": false,
      "name": "workspace-1",
      "operations": true,
      "permissions": {
        "can-create-state-versions": true,
        "can-destroy": true,
        "can-force-unlock": true,
        "can-lock": true,
        "can-manage-tags": true,
        "can-queue-apply": true,
        "can-queue-destroy": true,
        "can-queue-run": true,
        "can-read-settings": true,
        "can-read-state-versions": true,
        "can-read-variable": true,
        "can-unlock": true,
        "can-update": true,
        "can-update-variable": true
      },
      "plan-duration-average": null,
      "policy-check-failures": null,
      "queue-all-runs": false,
      "resource-count": 0,
      "run-failures": null,
      "source": "tfe-ui",
      "source-name": null,
      "source-url": null,
      "speculative-enabled": false,
      "structured-run-output-enabled": true,
      "terraform-version": "1.0.4",
      "trigger-prefixes": [],
      "updated-at": "2021-08-16T23:06:08.609Z",
      "vcs-repo": {
        "branch": "",
        "display-identifier": "my-organization/my-workspace",
        "identifier": "my-organization/my-workspace",
        "ingress-submodules": false,
        "oauth-token-id": "ot-4ecWLF8W8gfxxNXP",
        "repository-http-url": "https://github.com/my-organization/my-workspace",
        "service-provider": "github",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
      },
      "vcs-repo-identifier": "my-organization/my-workspace",
      "working-directory": "",
      "workspace-kpis-runs-count": null
    },
    "id": "ws-FFP9JcN4m6czSRBj",
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/workspace-1"
    },
    "relationships": {
      "agent-pool": {
        "data": {
          "id": "apool-QxGd2tRjympfMvQc",
          "type": "agent-pools"
        }
      },
      "current-configuration-version": {
        "data": {
          "id": "cv-EpThx8RZdxt8a2mK",
          "type": "configuration-versions"
        },
        "links": {
          "related": "/api/v2/configuration-versions/cv-EpThx8RZdxt8a2mK"
        }
      },
      "current-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "current-state-version": {
        "data": null
      },
      "latest-run": {
        "data": {
          "id": "run-kWrpCVo79eTzmW7y",
          "type": "runs"
        },
        "links": {
          "related": "/api/v2/runs/run-kWrpCVo79eTzmW7y"
        }
      },
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "outputs": {
        "data": []
      },
      "readme": {
        "data": {
          "id": "227247",
          "type": "workspace-readme"
        }
      },
      "remote-state-consumers": {
        "links": {
          "related": "/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers"
        }
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
      "attributes": {
        "actions": {
          "is-destroyable": true
        },
        "allow-destroy-plan": true,
        "apply-duration-average": null,
        "auto-apply": false,
        "auto-destroy-at": null,
        "created-at": "2021-08-16T21:50:58.726Z",
        "description": null,
        "environment": "default",
        "execution-mode": "remote",
        "file-triggers-enabled": true,
        "global-remote-state": false,
        "latest-change-at": "2021-08-16T21:50:58.726Z",
        "locked": false,
        "name": "workspace-2",
        "operations": true,
        "permissions": {
          "can-create-state-versions": true,
          "can-destroy": true,
          "can-force-unlock": true,
          "can-lock": true,
          "can-manage-tags": true,
          "can-queue-apply": true,
          "can-queue-destroy": true,
          "can-queue-run": true,
          "can-read-settings": true,
          "can-read-state-versions": true,
          "can-read-variable": true,
          "can-unlock": true,
          "can-update": true,
          "can-update-variable": true
        },
        "plan-duration-average": null,
        "policy-check-failures": null,
        "queue-all-runs": false,
        "resource-count": 0,
        "run-failures": null,
        "source": "tfe-api",
        "source-name": null,
        "source-url": null,
        "speculative-enabled": true,
        "structured-run-output-enabled": true,
        "terraform-version": "0.11.1",
        "trigger-prefixes": [],
        "updated-at": "2021-08-16T22:57:28.163Z",
        "vcs-repo": {
          "branch": "",
          "display-identifier": "my-organization/my-workspace",
          "identifier": "my-organization/my-workspace",
          "ingress-submodules": false,
          "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
          "repository-http-url": "https://github.com/my-organization/my-workspace",
          "service-provider": "github",
          "webhook-url": "https://app.terraform.io/webhooks/vcs/704ac743-df64-4b8e-b9a3-a4c5fe1bec87"
        },
        "vcs-repo-identifier": "my-organization/my-workspace",
        "working-directory": "",
        "workspace-kpis-runs-count": null
      },
      "id": "ws-KTuq99JSzgmDSvYj",
      "links": {
        "self": "/api/v2/organizations/my-organization/workspaces/workspace-2"
      },
      "relationships": {
        "agent-pool": {
          "data": null
        },
        "current-configuration-version": {
          "data": {
            "id": "cv-9WgU5LYoTq3rrnG6",
            "type": "configuration-versions"
          },
          "links": {
            "related": "/api/v2/configuration-versions/cv-9WgU5LYoTq3rrnG6"
          }
        },
        "current-run": {
          "data": null
        },
        "current-state-version": {
          "data": null
        },
        "latest-run": {
          "data": null
        },
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        },
        "outputs": {
          "data": []
        },
        "readme": {
          "data": {
            "id": "227347",
            "type": "workspace-readme"
          }
        },
        "remote-state-consumers": {
          "links": {
            "related": "/api/v2/workspaces/ws-KTuq99JSzgmDSvYj/relationships/remote-state-consumers"
          }
        },
        "ssh-key": {
          "data": {
            "id": "sshkey-WfPdX2GKwGkK5rsB",
            "type": "ssh-keys"
          },
          "links": {
            "related": "/api/v2/ssh-keys/sshkey-WfPdX2GKwGkK5rsB"
          }
        }
      },
      "type": "workspaces"
    }
  ],
  "links": {
    "first": "https://app.terraform.io/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "last": "https://app.terraform.io/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "next": null,
    "prev": null,
    "self": "https://app.terraform.io/api/v2/workspaces/ws-FFP9JcN4m6czSRBj/relationships/remote-state-consumers?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "next-page": null,
      "page-size": 20,
      "prev-page": null,
      "total-count": 1,
      "total-pages": 1
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

## Get Tags

`GET /workspaces/:workspace_id/relationships/tags`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to fetch tags for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

This endpoint returns the tags that are currently associated to a workspace.

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
  https://app.terraform.io/api/v2/workspaces/workspace-2/relationships/tags
```

### Sample Response

```json
{
  "data": [
    {
      "id": "tag-1",
      "type": "tags",
      "attributes": {
        "name": "tag1",
        "instance_count": 1
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    },
    {
      "id": "tag-2",
      "type": "tags",
      "attributes": {
        "name": "tag2",
        "instance_count": 2
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    }
  ]
}
```

## Add tags to a workspace

This endpoints adds one or more tags to the workspace. The workspace must already exist, and any
tag element that supplies an `id` attribute must exist. If the `name` attribute is used, and no
matching organization tag exists with such name, a new one will be created.

`POST /workspaces/:workspace_id/relationships/tags`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to add tags to. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully added tags to workspace
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

It is important to note that `type`, as well as one of `id` *or* `attributes.name` is required.

| Key path                 | Type   | Default | Description                      |
| ------------------------ | ------ | ------- | -------------------------------- |
| `data[].type`            | string |         | Must be `"tags"`.                |
| `data[].id`              | string |         | The id of the tag to add.        |
| `data[].attributes.name` | string |         | The name of the tag to add.      |

### Sample Payload

```json
{
  "data": [
    {
      "type": "tags",
      "attributes": {
        "name": "foo"
      }
    },
    {
      "type": "tags",
      "attributes": {
        "name": "bar"
      }
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
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/workspace-2/relationships/tags
```

## Sample Response

No response body.

Status code `204`.

## Remove tags from workspace

This endpoint removes one or more tags from a workspace. The workspace must already exist, and tag
element that supplies an `id` attribute must exist. If the `name` attribute is used, and no matching
organization tag is found, no action will occur for that entry. Tags removed from all workspaces will be
removed from the organization-wide list.

`DELETE /workspaces/:workspace_id/relationships/tags`

| Parameter            | Description      |
| -------------------- | -----------------|
| `:workspace_id`      | The workspace ID to remove tags from. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](#show-workspace) endpoint. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully removed tags to workspace
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

It is important to note that `type`, as well as one of `id` *or* `attributes.name` is required.

| Key path                 | Type   | Default | Description                      |
| ------------------------ | ------ | ------- | -------------------------------- |
| `data[].type`            | string |         | Must be `"tags"`.                |
| `data[].id`              | string |         | The id of the tag to remove.     |
| `data[].attributes.name` | string |         | The name of the tag to remove.   |

### Sample Payload

```json
{
  "data": [
    {
      "type": "tags",
      "id": "tag-Yfha4YpPievQ8wJw"
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
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/workspace-2/relationships/tags
```

## Sample Response

No response body.

Status code `204`.

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `organization` - The full organization record.
* `current_configuration_version` - The last configuration this workspace received, excluding plan-only configurations. Terraform uses this configuration for new runs, unless you provide a different one.
* `current_configuration_version.ingress_attributes` - The commit information for the current configuration version.
* `current_run` - Additional information about the current run.
* `current_run.plan` - The plan used in the current run.
* `current_run.configuration_version` - The configuration used in the current run.
* `current_run.configuration_version.ingress_attributes` - The commit information used in the current run.
* `locked_by` - The user, team, or run responsible for locking the workspace, if the workspace is currently locked.
* `readme` - The most recent workspace README.md
* `outputs` - The outputs for the most recently applied run.
