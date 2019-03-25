---
layout: enterprise2
page_title: "Applies - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-applies"
---

# Applies API

-> **Note**: These API endpoints are in beta and are subject to change.

An apply represents the results of applying a Terraform Run's execution plan.

## Show an apply

`GET /applies/:id`

Parameter | Description
----------|------------
`id`      | The ID of the apply to show.

There is no endpoint to list applies. You can find the ID for an apply in the
`relationships.apply` property of a run object.

Status  | Response                                  | Reason
--------|-------------------------------------------|-------
[200][] | [JSON API document][] (`type: "applies"`) | The request was successful
[404][] | [JSON API error object][]                 | Apply not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/applies/apply-47MBvjwzBG8YKc2v
```

### Sample Response

```json
{
  "data": {
    "id": "apply-47MBvjwzBG8YKc2v",
    "type": "applies",
    "attributes": {
      "status": "finished",
      "status-timestamps": {
        "queued-at": "2018-10-17T18:58:27+00:00",
        "started-at": "2018-10-17T18:58:29+00:00",
        "finished-at": "2018-10-17T18:58:37+00:00"
      },
      "log-read-url": "https://archivist.terraform.io/v1/object/dmF1bHQ6djE6OFA1eEdlSFVHRSs4YUcwaW83a1dRRDA0U2E3T3FiWk1HM2NyQlNtcS9JS1hHN3dmTXJmaFhEYTlHdTF1ZlgxZ2wzVC9kVTlNcjRPOEJkK050VFI3U3dvS2ZuaUhFSGpVenJVUFYzSFVZQ1VZYno3T3UyYjdDRVRPRE5pbWJDVTIrNllQTENyTndYd1Y0ak1DL1dPVlN1VlNxKzYzbWlIcnJPa2dRRkJZZGtFeTNiaU84YlZ4QWs2QzlLY3VJb3lmWlIrajF4a1hYZTlsWnFYemRkL2pNOG9Zc0ZDakdVMCtURUE3dDNMODRsRnY4cWl1dUN5dUVuUzdnZzFwL3BNeHlwbXNXZWRrUDhXdzhGNnF4c3dqaXlZS29oL3FKakI5dm9uYU5ZKzAybnloREdnQ3J2Rk5WMlBJemZQTg",
      "resource-additions": 1,
      "resource-changes": 0,
      "resource-destructions": 0
    },
    "relationships": {
      "state-versions": {
        "data": [
          {
            "id": "sv-TpnsuD3iewwsfeRD",
            "type": "state-versions"
          },
          {
            "id": "sv-Fu1n6a3TgJ1Typq9",
            "type": "state-versions"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/applies/apply-47MBvjwzBG8YKc2v"
    }
  }
}
```

