---
layout: enterprise2
page_title: "Runs - Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin-runs"
---

# Admin Runs API

-> **Note**: These API endpoints are in beta and are subject to change.

-> These API endpoints are available in Private Terraform Enterprise as of version 201807-1.

The Runs Admin API contains endpoints to help site administrators manage runs.

## List all runs

`GET /admin/runs`

This endpoint lists all runs in the Terraform Enterprise installation.

Status  | Response                               | Reason
--------|----------------------------------------|----------
[200][] | [JSON API document][] (`type: "runs"`) | Successfully listed runs
[404][] | [JSON API error object][]              | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`q`                 | **Optional.** A search query string. Runs are searchable by ID, workspace name, organization name or email, and VCS repository identifier.
`filter[status]`    | **Optional.** A comma-separated list of Run statuses to restrict results to, including any of the following: `"pending"`, `"planning"`, `"planned"`, `"confirmed"`, `"applying"`, `"applied"`, `"discarded"`, `"errored"`, `"canceled"`, `"policy_checking"`, `"policy_override"`, and/or `"policy_checked"`.
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 runs per page.

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](../index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name            | Description
-------------------------|------------
`workspace`              | The workspace this run belongs in.
`workspace.organization` | The organization of the associated workspace.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/runs"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "run-VCsNJXa59eUza53R",
      "type": "runs",
      "attributes": {
        "status": "pending",
        "status-timestamps": {
          "planned-at": "2018-03-02T23:42:06+00:00",
          "discarded-at": "2018-03-02T23:42:06+00:00"
        },
        "has-changes": true,
        "created-at": "2018-03-02T23:42:06.651Z"
      },
      "relationships": {
        "workspace": {
          "data": {
            "id": "ws-mJtb6bXGybq5zbf3",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/runs/run-VCsNJXa59eUza53R"
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/admin/runs?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/admin/runs?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/admin/runs?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
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
      "total": 1
    }
  }
}
```

## Force a run into the "cancelled" state

`POST /admin/runs/:id/actions/cancel`

Parameter | Description
----------|------------
`:id`     | The ID of the run to cancel.

This endpoint forces a run (and its plan/apply, if applicable) into the `"errored"` state; this action should only be performed for runs which are stuck and are no longer progressing normally.

Status  | Response                               | Reason
--------|----------------------------------------|----------
[200][] | [JSON API document][] (`type: "runs"`) | Successfully canceled the run.
[404][] | [JSON API error object][]              | Run not found, or client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/runs/run-VCsNJXa59eUza53R/actions/cancel"
```

### Sample Response

```json
{
  "data": {
    "id": "run-VCsNJXa59eUza53R",
    "type": "runs",
    "attributes": {
      "status": "errored",
      "status-timestamps": {
        "planned-at": "2018-03-02T23:42:06Z"
      },
      "has-changes": true,
      "created-at": "2018-03-02T23:42:06.651Z"
    },
    "relationships": {
      "workspace": {
        "data": {
          "id": "ws-mJtb6bXGybq5zbf3",
          "type": "workspaces"
        }
      }
    },
    "links": {
      "self": "/api/v2/runs/run-VCsNJXa59eUza53R"
    }
  }
}
```
