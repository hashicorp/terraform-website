---
layout: "cloud"
page_title: "Configuration Versions - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Configuration Versions API

-> **Note:** Before working with the runs or configuration versions APIs, read the [API-driven run workflow](../run/api.html) page, which includes both a full overview of this workflow and a walkthrough of a simple implementation of it.

A configuration version (`configuration-version`) is a resource used to reference the uploaded configuration files. It is associated with the run to use the uploaded configuration files for performing the plan and apply.

Listing and viewing configuration versions for a workspace requires permission to read runs; creating new configuration versions requires permission to queue plans. ([More about permissions.](../users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## List Configuration Versions

`GET /workspaces/:workspace_id/configuration-versions`

| Parameter       | Description                                          |
| --------------- | ---------------------------------------------------- |
| `:workspace_id` | The ID of the workspace to list configurations from. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. |

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 configuration versions per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/workspaces/ws-2Qhk7LHgbMrm3grF/configuration-versions
```

### Sample Response

```json
{
  "data": [
    {
      "id": "cv-ntv3HbhJqvFzamy7",
      "type": "configuration-versions",
      "attributes": {
        "error": null,
        "error-message": null,
        "source": "gitlab",
        "status": "uploaded",
        "status-timestamps": {}
      },
      "relationships": {
        "ingress-attributes": {
          "data": {
            "id": "ia-i4MrTxmQXYxH2nYD",
            "type": "ingress-attributes"
          },
          "links": {
            "related":
              "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7/ingress-attributes"
          }
        }
      },
      "links": {
        "self": "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7"
      }
    }
  ]
}
```

## Show a Configuration Version

`GET /configuration-versions/:configuration-id`

| Parameter           | Description                          |
| ------------------- | ------------------------------------ |
| `:configuration-id` | The id of the configuration to show. |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7
```

### Sample Response

```json
{
  "data": {
    "id": "cv-ntv3HbhJqvFzamy7",
    "type": "configuration-versions",
    "attributes": {
      "error": null,
      "error-message": null,
      "source": "gitlab",
      "status": "uploaded",
      "status-timestamps": {}
    },
    "relationships": {
      "ingress-attributes": {
        "data": {
          "id": "ia-i4MrTxmQXYxH2nYD",
          "type": "ingress-attributes"
        },
        "links": {
          "related":
            "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7/ingress-attributes"
        }
      }
    },
    "links": {
      "self": "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7"
    }
  }
}
```

## Show a Configuration Version's Commit Information

An ingress attributes resource (`ingress-attributes`) is used to reference commit information for configuration versions created in a workspace with a VCS repository.

`GET /configuration-versions/:configuration-id/ingress-attributes`

| Parameter           | Description                          |
| ------------------- | ------------------------------------ |
| `:configuration-id` | The id of the configuration to show. |

Ingress attributes can also be fetched as part of a query to a particular configuration version via `include`:

`GET /configuration-versions/:configuration-id?include=ingress-attributes`

| Parameter           | Description                          |
| ------------------- | ------------------------------------ |
| `:configuration-id` | The id of the configuration to show. |

<!-- Note: /ingress-attributes/:ingress-attributes-id is purposely not documented here, as its
usefulness is questionable given the routes above; IAs are inherently a part of a CV and their
separate resource is a vestige of the original Terraform Enterprise -->

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/configuration-versions/cv-TrHjxIzad9Ae9i8x/ingress-attributes
```

### Sample Response

```json
{
  "data": {
    "id": "ia-zqHjxJzaB9Ae6i9t",
    "type": "ingress-attributes",
    "attributes": {
      "branch": "add-cool-stuff",
      "clone-url": "https://github.com/hashicorp/foobar.git",
      "commit-message": "Adding really cool infrastructure",
      "commit-sha": "1e1c1018d1bbc0b8517d072718e0d87c1a0eda95",
      "commit-url": "https://github.com/hashicorp/foobar/commit/1e1c1018d1bbc0b8517d072718e0d87c1a0eda95",
      "compare-url": "https://github.com/hashicorp/foobar/pull/163",
      "identifier": "hashicorp/foobar",
      "is-pull-request": true,
      "on-default-branch": false,
      "pull-request-number": 163,
      "pull-request-url": "https://github.com/hashicorp/foobar/pull/163",
      "pull-request-title": "Adding really cool infrastructure",
      "pull-request-body": "These are changes to add really cool stuff. We should absolutely merge this.",
      "tag": null,
      "sender-username": "chrisarcand",
      "sender-avatar-url": "https://avatars.githubusercontent.com/u/2430490?v=4",
      "sender-html-url": "https://github.com/chrisarcand"
    },
    "relationships": {
      "created-by": {
        "data": {
          "id": "user-PQk2Z3dfXAax18P6s",
          "type": "users"
        },
        "links": {
          "related": "/api/v2/ingress-attributes/ia-zqHjxJzaB9Ae6i9t/created-by"
        }
      }
    },
    "links": {
      "self": "/api/v2/ingress-attributes/ia-zqHjxJzaB9Ae6i9t"
    }
  }
}
```

## Create a Configuration Version

`POST /workspaces/:workspace_id/configuration-versions`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The ID of the workspace to create the new configuration version in. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. |

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                          | Type    | Default | Description
--------------------------------- | ------- | ------- | -----------
`data.attributes.auto-queue-runs` | boolean | true    | When true, runs are queued automatically when the configuration version is uploaded.
`data.attributes.speculative`     | boolean | false   | When true, this configuration version may only be used to create runs which are speculative, that is, can neither be confirmed nor applied.

### Sample Payload

```json
{
  "data": {
    "type": "configuration-versions",
    "attributes": {
      "auto-queue-runs": true
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
  https://app.terraform.io/api/v2/workspaces/ws-2Qhk7LHgbMrm3grF/configuration-versions
```

### Sample Response

```json
{
  "data": {
    "id": "cv-UYwHEakurukz85nW",
    "type": "configuration-versions",
    "attributes": {
      "auto-queue-runs": true,
      "error": null,
      "error-message": null,
      "source": "tfe-api",
      "status": "pending",
      "status-timestamps": {},
      "upload-url":
        "https://archivist.terraform.io/v1/object/9224c6b3-2e14-4cd7-adff-ed484d7294c2"
    },
    "relationships": {
      "ingress-attributes": {
        "data": null,
        "links": {
          "related":
            "/api/v2/configuration-versions/cv-UYwHEakurukz85nW/ingress-attributes"
        }
      }
    },
    "links": { "self": "/api/v2/configuration-versions/cv-UYwHEakurukz85nW" }
  }
}
```

### Configuration Files Upload URL

Once a configuration version is created, use the `upload-url` attribute to [upload configuration files](#upload-configuration-files) associated with that version. The `upload-url` attribute is only provided in the response when creating configuration versions.

### Configuration Version Status

A configuration version will be in the `pending` status when initially created. It will remain pending until configuration files are supplied via [upload](#upload-configuration-files), and while they are processed.

If upload and processing succeed, the configuration version status will then be `uploaded`. An `uploaded` configuration version is ready for use.

If upload and processing fail, the status will be `errored`, indicating that something went wrong.

Runs cannot be created using `pending` or `errored` configuration versions.

## Upload Configuration Files

-> **Note**: If `auto-queue-runs` was either not provided or set to `true` during creation of the configuration version, a run using this configuration version will be automatically queued on the workspace. If `auto-queue-runs` was set to `false` explicitly, then it is necessary to [create a run on the workspace](./run.html#create-a-run) manually after the configuration version is uploaded.

`PUT https://archivist.terraform.io/v1/object/<UNIQUE OBJECT ID>`

**The URL is provided in the `upload-url` attribute when creating a `configuration-versions` resource. After creation, the URL is hidden on the resource and no longer available.**

### Sample Request

**@filename is the name of configuration file you wish to upload.**

```shell
curl \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @filename \
  https://archivist.terraform.io/v1/object/4c44d964-eba7-4dd5-ad29-1ece7b99e8da
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

* `ingress_attributes` - The commit information used in the configuration
