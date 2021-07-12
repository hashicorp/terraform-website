---
layout: "cloud"
page_title: "State Versions - API Docs - Terraform Cloud and Terraform Enterprise"
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

# State Versions API

## Create a State Version

> **Hands-on:** Try the [Version Remote State with the Terraform Cloud API](https://learn.hashicorp.com/tutorials/terraform/cloud-state-api?in=terraform/cloud&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

`POST /workspaces/:workspace_id/state-versions`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The workspace ID to create the new state version in. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. |

Creates a state version and sets it as the current state version for the given workspace. The workspace must be locked by the user creating a state version. The workspace may be locked [with the API](./workspaces.html#lock-a-workspace) or [with the UI](../workspaces/settings.html#locking). This is most useful for migrating existing state from open source Terraform into a new Terraform Cloud workspace.

Creating state versions requires permission to read and write state versions for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

!> **Warning:** Use caution when uploading state to workspaces that have already performed Terraform runs. Replacing state improperly can result in orphaned or duplicated infrastructure resources.

-> **Note:** For Free Tier organizations, Terraform Cloud always retains at least the last 100 states (across all workspaces) and at least the most recent state for every workspace. Additional states beyond the last 100 are retained for six months, and are then deleted.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[201][] | [JSON API document][]                        | Successfully created a state version
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[409][] | [JSON API error object][]                    | Conflict; check the error object for more information
[412][] | [JSON API error object][]                    | Precondition failed; check the error object for more information
[422][] | [JSON API error object][]                    | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                    | Type    | Default   | Description
----------------------------|---------|-----------|------------
`data.type`                 | string  |           | Must be `"state-versions"`.
`data.attributes.serial`    | integer |           | The serial of the state version. Must match the serial value extracted from the raw state file.
`data.attributes.md5`       | string  |           | An MD5 hash of the raw state version
`data.attributes.lineage`   | string  | (nothing) | **Optional** Lineage of the state version. Should match the lineage extracted from the raw state file. Early versions of terraform did not have the concept of lineage, so this is an optional attribute.
`data.attributes.state`     | string  |           | Base64 encoded raw state file
`data.relationships.run.data.id` | string  | (nothing) | **Optional** The ID of the run to associate with the state version.

### Sample Payload

```json
{
  "data": {
    "type":"state-versions",
    "attributes": {
      "serial": 1,
      "md5": "d41d8cd98f00b204e9800998ecf8427e",
      "lineage": "871d1b4a-e579-fb7c-ffdb-f0c858a647a7",
      "state": "..."
    },
    "relationships": {
      "run": {
        "data": {
          "type": "runs",
          "id": "run-bWSq4YeYpfrW4mx7"
        }
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
  https://app.terraform.io/api/v2/workspaces/ws-6fHMCom98SDXSQUv/state-versions
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": {
        "id": "sv-DmoXecHePnNznaA4",
        "type": "state-versions",
        "attributes": {
            "vcs-commit-sha": null,
            "vcs-commit-url": null,
            "created-at": "2018-07-12T20:32:01.490Z",
            "hosted-state-download-url": "https://archivist.terraform.io/v1/object/f55b739b-ff03-4716-b436-726466b96dc4",
            "serial": 1
        },
        "links": {
            "self": "/api/v2/state-versions/sv-DmoXecHePnNznaA4"
        }
    }
}
```

## List State Versions for a Workspace

`GET /state-versions`

Listing state versions requires permission to read state versions for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                    | Description
-----------------------------|------------
`filter[workspace][name]`    | **Required** The name of one workspace to list versions for.
`filter[organization][name]` | **Required** The name of the organization that owns the desired workspace.
`page[number]`               | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                 | **Optional.** If omitted, the endpoint will return 20 state versions per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/state-versions?filter%5Bworkspace%5D%5Bname%5D=my-workspace&filter%5Borganization%5D%5Bname%5D=my-organization"
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": [
        {
            "id": "sv-g4rqST72reoHMM5a",
            "type": "state-versions",
            "attributes": {
                "created-at": "2021-06-08T01:22:03.794Z",
                "size": 940,
                "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
                "modules": {
                    "root": {
                        "null-resource": 1,
                        "data.terraform-remote-state": 1
                    }
                },
                "providers": {
                    "provider[\"terraform.io/builtin/terraform\"]": {
                        "data.terraform-remote-state": 1
                    },
                    "provider[\"registry.terraform.io/hashicorp/null\"]": {
                        "null-resource": 1
                    }
                },
                "resources": [
                    {
                        "name": "other_username",
                        "type": "data.terraform_remote_state",
                        "count": 1,
                        "module": "root",
                        "provider": "provider[\"terraform.io/builtin/terraform\"]"
                    },
                    {
                        "name": "random",
                        "type": "null_resource",
                        "count": 1,
                        "module": "root",
                        "provider": "provider[\"registry.terraform.io/hashicorp/null\"]"
                    }
                ],
                "resources-processed": false,
                "serial": 9,
                "state-version": 4,
                "terraform-version": "0.15.4",
                "vcs-commit-url": "https://gitlab.com/my-organization/terraform-test/-/commit/abcdef12345",
                "vcs-commit-sha": "abcdef12345"
            },
            "relationships": {
                "run": {
                    "data": {
                        "id": "run-YfmFLWpgTv31VZsP",
                        "type": "runs"
                    }
                },
                "created-by": {
                    "data": {
                        "id": "user-onZs69ThPZjBK2wo",
                        "type": "users"
                    },
                    "links": {
                        "related": "/api/v2/runs/sv-g4rqST72reoHMM5a/created-by"
                    }
                },
                "workspace": {
                    "data": {
                        "id": "ws-noZcaGXsac6aZSJR",
                        "type": "workspaces"
                    }
                },
                "outputs": {
                    "data": [
                        {
                            "id": "wsout-V22qbeM92xb5mw9n",
                            "type": "state-version-outputs"
                        },
                        {
                            "id": "wsout-ymkuRnrNFeU5wGpV",
                            "type": "state-version-outputs"
                        },
                        {
                            "id": "wsout-v82BjkZnFEcscipg",
                            "type": "state-version-outputs"
                        }
                    ]
                }
            },
            "links": {
                "self": "/api/v2/state-versions/sv-g4rqST72reoHMM5a"
            }
        },
        {
            "id": "sv-QYKf6GvNv75ZPTBr",
            "type": "state-versions",
            "attributes": {
                "created-at": "2021-06-01T21:40:25.941Z",
                "size": 819,
                "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
                "modules": {
                    "root": {
                        "data.terraform-remote-state": 1
                    }
                },
                "providers": {
                    "provider[\"terraform.io/builtin/terraform\"]": {
                        "data.terraform-remote-state": 1
                    }
                },
                "resources": [
                    {
                        "name": "other_username",
                        "type": "data.terraform_remote_state",
                        "count": 1,
                        "module": "root",
                        "provider": "provider[\"terraform.io/builtin/terraform\"]"
                    }
                ],
                "resources-processed": false,
                "serial": 8,
                "state-version": 4,
                "terraform-version": "0.15.4",
                "vcs-commit-url": "https://gitlab.com/my-organization/terraform-test/-/commit/12345abcdef",
                "vcs-commit-sha": "12345abcdef"
            },
            "relationships": {
                "run": {
                    "data": {
                        "id": "run-cVtxks6R8wsjCZMD",
                        "type": "runs"
                    }
                },
                "created-by": {
                    "data": {
                        "id": "user-onZs69ThPZjBK2wo",
                        "type": "users"
                    },
                    "links": {
                        "related": "/api/v2/runs/sv-QYKf6GvNv75ZPTBr/created-by"
                    }
                },
                "workspace": {
                    "data": {
                        "id": "ws-noZcaGXsac6aZSJR",
                        "type": "workspaces"
                    }
                },
                "outputs": {
                    "data": [
                        {
                            "id": "wsout-MmqMhmht6jFmLRvh",
                            "type": "state-version-outputs"
                        },
                        {
                            "id": "wsout-Kuo9TCHg3oDLDQqa",
                            "type": "state-version-outputs"
                        }
                    ]
                }
            },
            "links": {
                "self": "/api/v2/state-versions/sv-QYKf6GvNv75ZPTBr"
            }
        }
    ],
    "links": {
        "self": "https://app.terraform.io/api/v2/state-versions?filter%5Borganization%5D%5Bname%5D=hashicorp&filter%5Bworkspace%5D%5Bname%5D=my-workspace&page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/state-versions?filter%5Borganization%5D%5Bname%5D=hashicorp&filter%5Bworkspace%5D%5Bname%5D=my-workspace&page%5Bnumber%5D=1&page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io.io/api/v2/state-versions?filter%5Borganization%5D%5Bname%5D=hashicorp&filter%5Bworkspace%5D%5Bname%5D=my-workspace&page%5Bnumber%5D=1&page%5Bsize%5D=20"
    },
    "meta": {
        "pagination": {
            "current-page": 1,
            "page-size": 20,
            "prev-page": null,
            "next-page": null,
            "total-pages": 1,
            "total-count": 10
        }
    }
}
```

## Fetch the Current State Version for a Workspace

`GET /workspaces/:workspace_id/current-state-version`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The ID for the workspace whose current state version you want to fetch. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. |

Fetches the current state version for the given workspace. This state version
will be the input state when running terraform operations.

Viewing state versions requires permission to read state versions for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully returned current state version for the given workspace
[404][] | [JSON API error object][]                    | Workspace not found, workspace does not have a current state version, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-6fHMCom98SDXSQUv/current-state-version
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": {
        "id": "sv-g4rqST72reoHMM5a",
        "type": "state-versions",
        "attributes": {
            "created-at": "2021-06-08T01:22:03.794Z",
            "size": 940,
            "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
            "modules": {
                "root": {
                    "null-resource": 1,
                    "data.terraform-remote-state": 1
                }
            },
            "providers": {
                "provider[\"terraform.io/builtin/terraform\"]": {
                    "data.terraform-remote-state": 1
                },
                "provider[\"registry.terraform.io/hashicorp/null\"]": {
                    "null-resource": 1
                }
            },
            "resources": [
                {
                    "name": "other_username",
                    "type": "data.terraform_remote_state",
                    "count": 1,
                    "module": "root",
                    "provider": "provider[\"terraform.io/builtin/terraform\"]"
                },
                {
                    "name": "random",
                    "type": "null_resource",
                    "count": 1,
                    "module": "root",
                    "provider": "provider[\"registry.terraform.io/hashicorp/null\"]"
                }
            ],
            "resources-processed": false,
            "serial": 9,
            "state-version": 4,
            "terraform-version": "0.15.4",
            "vcs-commit-url": "https://gitlab.com/my-organization/terraform-test/-/commit/abcdef12345",
            "vcs-commit-sha": "abcdef12345"
        },
        "relationships": {
            "run": {
                "data": {
                    "id": "run-YfmFLWpgTv31VZsP",
                    "type": "runs"
                }
            },
            "created-by": {
                "data": {
                    "id": "user-onZs69ThPZjBK2wo",
                    "type": "users"
                },
                "links": {
                    "related": "/api/v2/runs/sv-g4rqST72reoHMM5a/created-by"
                }
            },
            "workspace": {
                "data": {
                    "id": "ws-noZcaGXsac6aZSJR",
                    "type": "workspaces"
                }
            },
            "outputs": {
                "data": [
                    {
                        "id": "wsout-V22qbeM92xb5mw9n",
                        "type": "state-version-outputs"
                    },
                    {
                        "id": "wsout-ymkuRnrNFeU5wGpV",
                        "type": "state-version-outputs"
                    },
                    {
                        "id": "wsout-v82BjkZnFEcscipg",
                        "type": "state-version-outputs"
                    }
                ]
            }
        },
        "links": {
            "self": "/api/v2/state-versions/sv-g4rqST72reoHMM5a"
        }
    }
}
```

## Show a State Version

`GET /state-versions/:state_version_id`

Viewing state versions requires permission to read state versions for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Parameter | Description
----------|---------
`:state_version_id` | The ID of the desired state version.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully returned current state version for the given workspace
[404][] | [JSON API error object][]                    | Workspace not found, workspace does not have a current state version, or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/state-versions/sv-SDboVZC8TCxXEneJ
```

### Sample Response

-> **Note**: The `hosted-state-download-url` attribute provides a url from which you can download the raw state.

```json
{
    "data": {
        "id": "sv-g4rqST72reoHMM5a",
        "type": "state-versions",
        "attributes": {
            "created-at": "2021-06-08T01:22:03.794Z",
            "size": 940,
            "hosted-state-download-url": "https://archivist.terraform.io/v1/object/...",
            "modules": {
                "root": {
                    "null-resource": 1,
                    "data.terraform-remote-state": 1
                }
            },
            "providers": {
                "provider[\"terraform.io/builtin/terraform\"]": {
                    "data.terraform-remote-state": 1
                },
                "provider[\"registry.terraform.io/hashicorp/null\"]": {
                    "null-resource": 1
                }
            },
            "resources": [
                {
                    "name": "other_username",
                    "type": "data.terraform_remote_state",
                    "count": 1,
                    "module": "root",
                    "provider": "provider[\"terraform.io/builtin/terraform\"]"
                },
                {
                    "name": "random",
                    "type": "null_resource",
                    "count": 1,
                    "module": "root",
                    "provider": "provider[\"registry.terraform.io/hashicorp/null\"]"
                }
            ],
            "resources-processed": false,
            "serial": 9,
            "state-version": 4,
            "terraform-version": "0.15.4",
            "vcs-commit-url": "https://gitlab.com/my-organization/terraform-test/-/commit/abcdef12345",
            "vcs-commit-sha": "abcdef12345"
        },
        "relationships": {
            "run": {
                "data": {
                    "id": "run-YfmFLWpgTv31VZsP",
                    "type": "runs"
                }
            },
            "created-by": {
                "data": {
                    "id": "user-onZs69ThPZjBK2wo",
                    "type": "users"
                },
                "links": {
                    "related": "/api/v2/runs/sv-g4rqST72reoHMM5a/created-by"
                }
            },
            "workspace": {
                "data": {
                    "id": "ws-noZcaGXsac6aZSJR",
                    "type": "workspaces"
                }
            },
            "outputs": {
                "data": [
                    {
                        "id": "wsout-V22qbeM92xb5mw9n",
                        "type": "state-version-outputs"
                    },
                    {
                        "id": "wsout-ymkuRnrNFeU5wGpV",
                        "type": "state-version-outputs"
                    },
                    {
                        "id": "wsout-v82BjkZnFEcscipg",
                        "type": "state-version-outputs"
                    }
                ]
            }
        },
        "links": {
            "self": "/api/v2/state-versions/sv-g4rqST72reoHMM5a"
        }
    }
}
```

### Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `created_by` - The user that created the state version. For state versions created via a run executed by Terraform Cloud, this is an internal user account.
* `run` - The run that created the state version, if applicable.
* `run.created_by` - The user that manually triggered the run, if applicable.
* `run.configuration_version` - The configuration version used in the run.
* `outputs` - The parsed outputs for this state version.
