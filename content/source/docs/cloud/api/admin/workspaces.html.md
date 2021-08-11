---
layout: "cloud"
page_title: "Workspaces - Admin - API Docs - Terraform Enterprise"
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

# Admin Workspaces API

-> **Terraform Enterprise feature:** The admin API is exclusive to Terraform Enterprise, and can only be used by the admins and operators who install and maintain their organization's Terraform Enterprise instance.

-> These API endpoints are available in Terraform Enterprise as of version 201807-1.

The Workspaces Admin API contains endpoints to help site administrators manage workspaces.

## List all workspaces

`GET /api/v2/admin/workspaces`

This endpoint lists all workspaces in the Terraform Enterprise installation.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully listed workspaces
[404][] | [JSON API error object][]                    | Client is not an administrator.


### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                     | Description
------------------------------|------------
`q`                           | **Optional.** A search query string. Workspaces are searchable by name and organization name.
`filter[current_run][status]` | **Optional.** A comma-separated list of Run statuses to restrict results to, which can include any of the following: `"pending"`, `"plan_queued"`, `"planning"`, `"planned"`, `"confirmed"`, `"apply_queued"`, `"applying"`, `"applied"`, `"discarded"`, `"errored"`, `"canceled"`, `"cost_estimating"`, `"cost_estimated"`, `"policy_checking"`, `"policy_override"`, `"policy_soft_failed"`, `"policy_checked"`, and `"planned_and_finished"`.
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

`GET /api/v2/admin/workspaces/:id`

This endpoint returns the workspace with the specified `workspace_id`.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "workspaces"`) | Successfully listed workspaces
[404][] | [JSON API error object][]                    | Client is not an administrator.


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
