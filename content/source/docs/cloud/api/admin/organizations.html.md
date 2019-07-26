---
layout: "cloud"
page_title: "Organizations - Admin - API Docs - Terraform Enterprise"
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

# Admin Organizations API

-> These API endpoints are available in Private Terraform Enterprise as of version 201807-1.

The Organizations Admin API contains endpoints to help site administrators manage organizations.

## List all organizations

`GET /admin/organizations`

This endpoint lists all organizations in the Terraform Enterprise installation.

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | Successfully listed organizations
[404][] | [JSON API error object][]                       | Client is not an administrator.


### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`q`                 | **Optional.** A search query string. Organizations are searchable by name and notification email.
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 organizations per page.

### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](../index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name | Description
--------------|------------
`owners`      | A list of owners for each organization.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/organizations"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "my-organization",
      "type": "organizations",
      "attributes": {
        "name": "my-organization",
        "enterprise-plan": "pro",
        "trial-expires-at": "2018-05-22T00:00:00.000Z",
        "notification-email": "my-organization@example.com"
      },
      "relationships": {
        "owners": {
          "data": [
            {
              "id": "user-mVPjPn2hRJFtHMF5",
              "type": "users"
            }
          ]
        }
      },
      "links": {
        "self": "/api/v2/organizations/my-organization"
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/admin/organizations?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/admin/organizations?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/admin/organizations?page%5Bnumber%5D=1&page%5Bsize%5D=20"
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
      "total": 1,
      "active-trial": 0,
      "expired-trial": 0,
      "pro": 1,
      "premium": 0,
      "disabled": 0
    }
  }
}
```

## Show an organization

`GET /admin/organizations/:name`

Parameter  | Description
-----------|------------
`:name`    | The name of the organization to show

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | The request was successful
[404][] | [JSON API error object][]                       | Organization not found, or client is not an administrator


### Available Related Resources

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](../index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name | Description
--------------|------------
`owners`      | A list of owners for the organization.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/admin/organizations/my-organization
```

### Sample Response

```json
{
  "data": {
    "id": "my-organization",
    "type": "organizations",
    "attributes": {
      "name": "my-organization",
      "notification-email": "my-organization@example.com"
    },
    "relationships": {
      "owners": {
        "data": [
          {
            "id": "user-mVPjPn2hRJFtHMF5",
            "type": "users"
          }
        ]
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization"
    }
  }
}
```

## Delete an organization

`DELETE /admin/organizations/:name`

Parameter  | Description
-----------|------------
`:name`    | The name of the organization to delete

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty response            | The organization was successfully deleted
[404][] | [JSON API error object][] | Organization not found, or client is not an administrator


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/admin/organizations/my-organization
```
