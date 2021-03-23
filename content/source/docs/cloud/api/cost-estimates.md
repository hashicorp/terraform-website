---
layout: "cloud"
page_title: "Cost Estimates - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Cost Estimates API

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

## Show a cost estimate

-> **Note**: The hash in the `resources` attribute structure represents low-level Cost Estimation details. The keys or structure may change over time. Use the data in this hash at your own risk.

`GET /cost-estimates/:id`

Parameter | Description
----------|------------
`id`      | The ID of the cost estimate to show.

There is no endpoint to list cost estimates. You can find the ID for a cost estimate in the
`relationships.cost-estimate` property of a run object.

Status  | Response                                         | Reason
--------|--------------------------------------------------|-------
[200][] | [JSON API document][] (`type: "cost-estimates"`) | The request was successful
[404][] | [JSON API error object][]                        | Cost estimate not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/cost-estimates/ce-BPvFFrYCqRV6qVBK
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ce-BPvFFrYCqRV6qVBK",
      "type": "cost-estimates",
      "attributes": {
        "error-message": null,
        "status": "finished",
        "status-timestamps": {
          "queued-at": "2017-11-29T20:02:17+00:00",
          "finished-at": "2017-11-29T20:02:20+00:00"
        },
        "resources": {...},
        "resources-count": 4,
        "matched-resources-count": 3,
        "unmatched-resources-count": 1,
        "prior-monthly-cost": "0.0",
        "proposed-monthly-cost": "25.488",
        "delta-monthly-cost": "25.488",
      },
      "links": {
        "self": "/api/v2/cost-estimate/ce-9VYRc9bpfJEsnwum"
      }
    }
  ]
}
```
