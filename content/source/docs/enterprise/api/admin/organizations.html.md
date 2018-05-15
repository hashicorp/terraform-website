---
layout: enterprise2
page_title: "Organizations - Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin-organizations"
---

# Admin Organizations API

-> **Note**: These API endpoints are in beta and are subject to change.

The Organization Admin API contains endpoints to help site administrators manage organizations.

## List all organizations

`GET /admin/organizations`

This endpoint will list all organizations in the Terraform Enterprise installation.

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | Successfully listed organizations
[404][] | [JSON API error object][]                       | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`q`                 | **Optional.** A search query string. Organizations are searchable by name and notification email.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/organizations"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "myorganization",
      "type": "organizations",
      "attributes": {
        "name": "myorganization",
        "notification-email": "myorganization@example.com"
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
        "self": "/api/v2/organizations/myorganization"
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
    }
  }
}
```
