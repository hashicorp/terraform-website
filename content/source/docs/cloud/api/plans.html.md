---
layout: "cloud"
page_title: "Plans - API Docs - Terraform Cloud and Terraform Enterprise"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[202]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[307]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
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

# Plans API

A plan represents the execution plan of a Run in a Terraform workspace.

## Attributes

### Plan States

The plan state is found in `data.attributes.status`, and you can reference the following list of possible states.

State                     | Description
--------------------------|------------
`pending`                 | The initial status of a plan once it has been created.
`managed_queued`/`queued` | The plan has been queued, awaiting backend service capacity to run terraform.
`running`                 | The plan is running.
`errored`                 | The plan has errored. This is a final state.
`canceled`                | The plan has been canceled. This is a final state.
`finished`                | The plan has completed sucessfully. This is a final state.
`unreachable`             | The plan will not run. This is a final state.

## Show a plan

`GET /plans/:id`

Parameter | Description
----------|------------
`id`      | The ID of the plan to show.

There is no endpoint to list plans. You can find the ID for a plan in the
`relationships.plan` property of a run object.

Status  | Response                                | Reason
--------|-----------------------------------------|-------
[200][] | [JSON API document][] (`type: "plans"`) | The request was successful
[404][] | [JSON API error object][]               | Plan not found, or user unauthorized to perform action


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
      "resource-additions": 0,
      "resource-changes": 1,
      "resource-destructions": 0,
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
      "self": "/api/v2/plans/plan-8F5JFydVYAmtTjET",
      "json-output": "/api/v2/plans/plan-8F5JFydVYAmtTjET/json-output"
    }
  }
}
```

## Retrieve the JSON execution plan

`GET /plans/:id/json-output`

`GET /runs/:id/plan/json-output`

These endpoints generate a temporary authenticated URL to the location of the [JSON formatted execution plan](/docs/internals/json-format.html#format-summary).  When successful, this endpoint responds with a temporary redirect that should be followed.  If using a client that can follow redirects, you can use this endpoint to save the `.json` file locally without needing to save the temporary URL.

This temporary URL provided by the redirect has a life of **1 minute**, and should not be relied upon beyond the initial request.  If you need repeat access, you should use this endpoint to generate a new URL each time.

-> **Note:** This endpoint is available for plans using Terraform 0.12 and later.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens) that has admin level access to the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | No Content                | Plan JSON supported, but plan has not yet completed.
[307][] | Temporary Redirect        | Plan JSON found and temporary download URL generated
[422][] | [JSON API error object][] | Plan does not use a supported version of terraform (< 0.12.X)

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --location \
  https://app.terraform.io/api/v2/plans/plan-8F5JFydVYAmtTjET/json-output |
  > json-output.json
```
