---
layout: "cloud"
page_title: "Invoices - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Invoices API

-> **Note:** The invoices API is only available in Terraform Cloud.

Organizations on credit-card-billed plans may view their previous and upcoming invoices.

## List Invoices

This endpoint lists the previous invoices for an organization. 

It uses a pagination scheme that's somewhat different from [our standard pagination](/docs/cloud/api/index.html#pagination). The page size is always 10 items and is not configurable; if there are no more items, `meta.continuation` will be null. The current page is controlled by the `cursor` parameter, described below. 

`GET /organizations/:organization_name/invoices`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization you'd like to view invoices for
`:cursor`            | **Optional.** The ID of the invoice where the page should start. If omitted, the endpoint will return the first page.

### Pagination

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/hashicorp/invoices
```

### Sample Response

```json
{
  "data": [
    {
      "id": "in_1I4sraHcjZv6Wm0g7nC34mAi",
      "type": "billing-invoices",
      "attributes": {
        "created-at": "2021-01-01T19:00:38Z",
        "external-link": "https://pay.stripe.com/invoice/acct_1Eov7THcjZv6Wm0g/invst_IgFMMfdzAZzMQq8GXyUbrk9lFMqvp9SX/pdf",
        "number": "2F8CA1AE-0006",
        "paid": true,
        "status": "paid",
        "total": 21000
      }
    },
    {...}
    {
      "id": "in_1Hte5nHcjZv6Wm0g2Q8hFctH",
      "type": "billing-invoices",
      "attributes": {
        "created-at": "2020-06-01T19:00:51Z",
        "external-link": "https://pay.stripe.com/invoice/acct_1Eov7THcjZv6Wm0g/invst_IUdMM6wl0JfA95tgWGZxpBGXYtJwmBgY/pdf",
        "number": "2F8CA1AE-0005",
        "paid": true,
        "status": "paid",
        "total": 21000
      }
    }
  ],
  "meta": {
    "continuation": "in_1IBpkEHcjZv6Wm0gHcgc2uwN"
  }
}
```

## Get Next Invoice

This endpoint lists the next month's invoice for an organization.

`GET /organizations/:organization_name/invoices/next`

Parameter           | Description
--------------------|-----------------------------
`organization_name` | The name of the organization

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/hashicorp/invoices/next
```

### Sample Response

```json
{
  "data": {
    "id": "in_upcoming_510DEB1F-0002",
    "type": "billing-invoices",
    "attributes": {
      "created-at": "2021-02-01T20:00:00Z",
      "external-link": "",
      "number": "510DEB1F-0002",
      "paid": false,
      "status": "draft",
      "total": 21000
    }
  }
}
```
