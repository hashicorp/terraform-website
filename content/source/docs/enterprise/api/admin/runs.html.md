---
layout: enterprise2
page_title: "Runs - Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin-runs"
---

# Admin Runs API

-> **Note**: These API endpoints are in beta and are subject to change.

The Runs Admin API contains endpoints to help site administrators manage runs.

## List all runs

`GET /admin/runs`

This endpoint will list all runs in the Terraform Enterprise installation.

Status  | Response                               | Reason
--------|----------------------------------------|----------
[200][] | [JSON API document][] (`type: "runs"`) | Successfully listed runs
[404][] | [JSON API error object][]              | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`q`                 | A search query string. Runs are searchable by ID, workspace name, organization name or email, and VCS repository identifier.
`filter[status]`    | An optional comma-separated list of Run statuses to restrict results to. Can be a list of any of the following: `"pending"`, `"planning"`, `"planned"`, `"confirmed"`, `"applying"`, `"applied"`, `"discarded"`, `"errored"`, `"canceled"`, `"policy_checking"`, `"policy_override"`, and/or `"policy_checked"`.

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name            | Description
-------------------------|------------
`workspace`              | The full workspace this run belongs in.
`workspace.organization` | The full organization of the associated workspace.

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
    "pending-count": 1,
    "planning-count": 0,
    "planned-count": 0,
    "confirmed-count": 0,
    "applying-count": 0,
    "applied-count": 0,
    "discarded-count": 0,
    "errored-count": 0,
    "canceled-count": 0,
    "policy-checking-count": 0,
    "policy-override-count": 0,
    "policy-checked-count": 0,
    "total-count": 1,
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

## Force a run to cancel

`POST /admin/runs/:id/actions/cancel`

Parameter | Description
----------|------------
`:id`     | The ID of the run to cancel.

This endpoint will force a run (and its plan/apply, if applicable) into the `"errored"` state; this should only be performed for runs which are stuck and no longer progressing normally.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty response            | Successfully suspended the user's account.
[404][] | [JSON API error object][] | Run not found, or client is not an administrator.

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  "https://app.terraform.io/api/v2/admin/runs/run-VCsNJXa59eUza53R/actions/cancel"
```
