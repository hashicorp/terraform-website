---
layout: "cloud"
page_title: "Applies - API Docs - Terraform Cloud and Terraform Enterprise"
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
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Applies API

An apply represents the results of applying a Terraform Run's execution plan.

## Attributes

### Apply States

You'll find the apply state in `data.attributes.status`, as one of the following values.

State                     | Description
--------------------------|------------
`pending`                 | The initial status of a apply once it has been created.
`managed_queued`/`queued` | The apply has been queued, awaiting backend service capacity to run terraform.
`running`                 | The apply is running.
`errored`                 | The apply has errored. This is a final state.
`canceled`                | The apply has been canceled. This is a final state.
`finished`                | The apply has completed sucessfully. This is a final state.
`unreachable`             | The apply will not run. This is a final state.

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
