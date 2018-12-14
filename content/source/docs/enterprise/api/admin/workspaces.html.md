---
layout: enterprise2
page_title: "Workspaces - Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin-workspaces"
---

# Admin Workspaces API

-> **Note**: These API endpoints are in beta and are subject to change.

-> These API endpoints are available in Private Terraform Enterprise as of version 201807-1.

The Workspaces Admin API contains endpoints to help site administrators manage workspaces.

## List all workspaces

`GET /admin/workspaces`

This endpoint lists all workspaces in the Terraform Enterprise installation.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully listed workspaces
[404][] | [JSON API error object][]                    | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                     | Description
------------------------------|------------
`q`                           | **Optional.** A search query string. Workspaces are searchable by name and organization name.
`filter[current_run][status]` | **Optional.** A comma-separated list of Run statuses to restrict results to, including of any of the following: `"pending"`, `"planning"`, `"planned"`, `"confirmed"`, `"applying"`, `"applied"`, `"discarded"`, `"errored"`, `"canceled"`, `"policy_checking"`, `"policy_override"`, and/or `"policy_checked"`.
`sort`                        | **Optional.** Allows sorting the returned workspaces. Valid values are `"name"` (the default) and `"current-run.created-at"` (which sorts by the time of the current run). Prepending a hyphen to the sort parameter will reverse the order (e.g. `"-name"` to reverse the default order)
`page[number]`                | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                  | **Optional.** If omitted, the endpoint will return 20 workspaces per page.

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](../index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name         | Description
----------------------|------------
`organization`        | The organization for each returned workspace.
`organization.owners` | A list of owners for each workspace's associated organization.
`current_run`         | The current run for each returned workspace.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/workspaces"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ws-2HRvNs49EWPjDqT1",
      "type": "workspaces",
      "attributes": {
        "name": "my-workspace",
        "locked": false,
        "vcs-repo": {
          "identifier": "my-organization/my-repository"
        }
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        },
        "current-run": {
          "data": {
            "id": "run-jm8ekSaW3F52FACN",
            "type": "runs"
          }
        }
      },
      "links": {
        "self": "/api/v2/organizations/my-organization/workspaces/my-workspace"
      }
    }
  ],
  "links": {
    "self": "http://localhost:3000/api/v2/admin/workspaces?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "http://localhost:3000/api/v2/admin/workspaces?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "http://localhost:3000/api/v2/admin/workspaces?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 0,
      "total-count": 1
    },
    "status-counts": {
      "pending": 1,
      "planning": 0,
      "planned": 0,
      "confirmed": 0,
      "applying": 0,
      "applied": 0,
      "discarded": 0,
      "errored": 0,
      "canceled": 0,
      "policy-checking": 0,
      "policy-override": 0,
      "policy-checked": 0,
      "none": 0,
      "total": 1,
    }
  }
}
```

## Show a workspace

`GET /admin/workspaces/:id`

This endpoint lists all workspaces in the Terraform Enterprise installation.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully listed workspaces
[404][] | [JSON API error object][]                    | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

Parameter                     | Description
------------------------------|------------
`:workspace_id`               | The workspace ID

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](../index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name         | Description
----------------------|------------
`organization`        | The organization for each returned workspace.
`organization.owners` | A list of owners for each workspace's associated organization.
`current_run`         | The current run for each returned workspace.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/workspaces/ws-2HRvNs49EWPjDqT1"
```

### Sample Response

```json
{
  "data": {
    "id": "ws-2HRvNs49EWPjDqT1",
    "type": "workspaces",
    "attributes": {
      "name": "my-workspace",
      "locked": false,
      "vcs-repo": {
        "identifier": "my-organization/my-repository"
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      },
      "current-run": {
        "data": {
          "id": "run-jm8ekSaW3F52FACN",
          "type": "runs"
        }
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/workspaces/my-workspace"
    }
  }
}
```

## Destroy a workspace

`DELETE /admin/workspaces/:id`

Parameter                     | Description
------------------------------|------------
`:workspace_id`               | The workspace ID

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[204][] |                                                 | The workspace was successfully destroyed
[404][] | [JSON API error object][]                       | Workspace not found or user unauthorized to perform action

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/admin/workspaces/ws-2HRvNs49EWPjDqT1
```

### Sample Response

The response body will be empty if successful.
