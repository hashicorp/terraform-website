---
layout: "cloud"
page_title: "Plan Exports - API Docs - Terraform Cloud and Terraform Enterprise"
---

# Plan Exports API

Plan exports allow users to download data exported from the plan of a Run in a Terraform workspace. Currently, the only supported format for exporting plan data is to generate mock data for Sentinel.

## Create a plan export

`POST /plan-exports`

This endpoint exports data from a plan in the specified format. The export process is asynchronous, and the resulting data becomes downloadable when its status is `"finished"`. The data is then available for one hour before expiring. After the hour is up, a new export can be created.

Status  | Response                                       | Reason
--------|------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "plan-exports"`) | Successfully created a plan export
[404][] | [JSON API error object][]                      | Plan not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                      | Malformed request body (missing attributes, wrong types, etc.), or a plan export of the provided `data-type` is already pending or downloadable for this plan

[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/cloud/api/index.html#json-api-documents
[JSON API error object]: https://jsonapi.org/format/#error-objects

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                       | Type   | Default | Description
-------------------------------|--------|---------|------------
`data.type`                    | string |         | Must be `"plan-exports"`.
`data.attributes.data-type`    | string |         | The format for the export. Currently, the only supported format is `"sentinel-mock-bundle-v0"`.
`data.relationships.plan.data` | object |         | A JSON API relationship object that represents the plan being exported. This object must have a `type` of `plans`, and the `id` of a finished Terraform plan that does not already have a downloadable export of the specified `data-type` (e.g: `{"type": "plans", "id": "plan-8F5JFydVYAmtTjET"}`)

### Sample Payload

```json
{
  "data": {
    "type": "plan-exports",
    "attributes": {
      "data-type": "sentinel-mock-bundle-v0"
    },
    "relationships": {
      "plan": {
        "data": {
          "id": "plan-8F5JFydVYAmtTjET",
          "type": "plans"
        }
      }
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
  https://app.terraform.io/api/v2/plan-exports
```

### Sample Response

```json
{
  "data": {
    "id": "pe-3yVQZvHzf5j3WRJ1",
    "type": "plan-exports",
    "attributes": {
      "data-type": "sentinel-mock-bundle-v0",
      "status": "queued",
      "status-timestamps": {
        "queued-at": "2019-03-04T22:29:53+00:00",
      },
    },
    "relationships": {
      "plan": {
        "data": {
          "id": "plan-8F5JFydVYAmtTjET",
          "type": "plans"
        }
      }
    },
    "links": {
      "self": "/api/v2/plan-exports/pe-3yVQZvHzf5j3WRJ1",
    }
  }
}
```

## Show a plan export

`GET /plan-exports/:id`

Parameter | Description
----------|------------
`id`      | The ID of the plan export to show.

There is no endpoint to list plan exports. You can find IDs for plan exports in the
`relationships.exports` property of a plan object.

Status  | Response                                       | Reason
--------|------------------------------------------------|-------
[200][] | [JSON API document][] (`type: "plan-exports"`) | The request was successful
[404][] | [JSON API error object][]                      | Plan export not found, or user unauthorized to perform action

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/cloud/api/index.html#json-api-documents
[JSON API error object]: https://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/plan-exports/pe-3yVQZvHzf5j3WRJ1
```

### Sample Response

```json
{
  "data": {
    "id": "pe-3yVQZvHzf5j3WRJ1",
    "type": "plan-exports",
    "attributes": {
      "data-type": "sentinel-mock-bundle-v0",
      "status": "finished",
      "status-timestamps": {
        "queued-at": "2019-03-04T22:29:53+00:00",
        "finished-at": "2019-03-04T22:29:58+00:00",
        "expired-at": "2019-03-04T23:29:58+00:00"
      },
    },
    "relationships": {
      "plan": {
        "data": {
          "id": "plan-8F5JFydVYAmtTjET",
          "type": "plans"
        }
      }
    },
    "links": {
      "self": "/api/v2/plan-exports/pe-3yVQZvHzf5j3WRJ1",
      "download": "/api/v2/plan-exports/pe-3yVQZvHzf5j3WRJ1/download"
    }
  }
}
```

## Download exported plan data

`GET /plan-exports/:id/download`

This endpoint generates a temporary URL to the location of the exported plan data in a `.tar.gz` archive, and then redirects to that link. If using a client that can follow redirects, you can use this endpoint to save the `.tar.gz` archive locally without needing to save the temporary URL.

Status  | Response                  | Reason
--------|---------------------------|----------
[302][] | HTTP Redirect             | Plan export found and temporary download URL generated
[404][] | [JSON API error object][] | Plan export not found, or user unauthorized to perform action

[302]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: https://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --location \
  https://app.terraform.io/api/v2/plan-exports/pe-3yVQZvHzf5j3WRJ1/download \
  > export.tar.gz
```

## Delete exported plan data

`DELETE /plan-exports/:id`

Plan exports expire after being available for one hour, but they can be deleted manually as well.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | No content                | Plan export deleted successfully
[404][] | [JSON API error object][] | Plan export not found, or user unauthorized to perform action

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: https://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  -X DELETE \
  https://app.terraform.io/api/v2/plan-exports/pe-3yVQZvHzf5j3WRJ1
```
