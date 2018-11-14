---
layout: enterprise2
page_title: "Configuration Versions - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-configuration-versions"
---

# Configuration Versions API

-> **Note**: These API endpoints are in beta and are subject to change.

-> **Note:** Before working with the runs or configuration versions APIs, read the [API-driven run workflow](../run/api.html) page, which includes both a full overview of this workflow and a walkthrough of a simple implementation of it.

A configuration version (`configuration-version`) is a resource used to reference the uploaded configuration files. It is associated with the run to use the uploaded configuration files for performing the plan and apply.

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

## Create a Configuration Version

`POST /workspaces/:workspace_id/configuration-versions`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The ID of the workspace to create the new configuration version in. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint. |

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

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

### Configuration Version Status

A configuration version will be in the `pending` status when initially created. It will remain pending until configuration files are supplied via [upload](#upload-configuration-files), and while they are processed.

If upload and processing succeed, the configuration version status will then be `uploaded`. An `uploaded` configuration version is ready for use.

If upload and processing fail, the status will be `errored`, indicating that something went wrong.

Runs cannot be created using `pending` or `errored` configuration versions.

## Upload Configuration Files

-> **Note**: If `auto-queue-runs` was either not provided or set to `true` during creation of the configuration version, a run using this configuration version will be automatically queued on the workspace. If `auto-queue-runs` was set to `false` explicitly, then it is necessary to [create a run on the workspace](./run.html#create-a-run) manually after the configuration version is uploaded.

`PUT https://archivist.terraform.io/v1/object/<UNIQUE OBJECT ID>`

**The URL is provided in the `upload-url` attribute in the `configuration-versions` resource.**

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
