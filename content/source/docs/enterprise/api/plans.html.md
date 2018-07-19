---
layout: enterprise2
page_title: "Plans - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-plans"
---

# Plans API

-> **Note**: These API endpoints are in beta and are subject to change.

A plan represents the execution plan of a Run in a Terraform workspace.

## Show a plan

`GET /plans/:id`

Parameter | Description
----------|------------
`id`      | The ID of the plan to show.

As there is no endpoint to list plans, you can find the ID for a plan in the
`relationships.plan` property of a run object.

Status  | Response                                | Reason
--------|-----------------------------------------|-------
[200][] | [JSON API document][] (`type: "plans"`) | The request was successful
[404][] | [JSON API error object][]               | Plan not found, or user unauthorized to perform action

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/plans/plan-8F5JFydVYAmtTjET
```

### Sample Response

```json
{
  "data": {
    "id": "plan-8F5JFydVYAmtTjET",
    "type": "plans",
    "attributes": {
      "has-changes": true,
      "resources-to-add": 0,
      "resources-to-change": 1,
      "resources-to-destroy": 0,
      "status": "finished",
      "status-timestamps": {
        "queued-at": "2018-07-02T22:29:53+00:00",
        "pending-at": "2018-07-02T22:29:53+00:00",
        "started-at": "2018-07-02T22:29:54+00:00",
        "finished-at": "2018-07-02T22:29:58+00:00"
      },
      "log-read-url": "https://archivist.terraform.io/v1/object/dmF1bHQ6djE6OFA1eEdlSFVHRSs4YUcwaW83a1dRRDA0U2E3T3FiWk1HM2NyQlNtcS9JS1hHN3dmTXJmaFhEYTlHdTF1ZlgxZ2wzVC9kVTlNcjRPOEJkK050VFI3U3dvS2ZuaUhFSGpVenJVUFYzSFVZQ1VZYno3T3UyYjdDRVRPRE5pbWJDVTIrNllQTENyTndYd1Y0ak1DL1dPVlN1VlNxKzYzbWlIcnJPa2dRRkJZZGtFeTNiaU84YlZ4QWs2QzlLY3VJb3lmWlIrajF4a1hYZTlsWnFYemRkL2pNOG9Zc0ZDakdVMCtURUE3dDNMODRsRnY4cWl1dUN5dUVuUzdnZzFwL3BNeHlwbXNXZWRrUDhXdzhGNnF4c3dqaXlZS29oL3FKakI5dm9uYU5ZKzAybnloREdnQ3J2Rk5WMlBJemZQTg"
    },
    "relationships": {
      "state-versions": {
        "data": []
      }
    },
    "links": {
      "self": "/api/v2/plans/plan-8F5JFydVYAmtTjET"
    }
  }
}
```
