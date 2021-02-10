---
layout: "cloud"
page_title: "Module Sharing - Admin - API Docs - Terraform Enterprise"
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

# Admin Module Sharing API

-> **Terraform Enterprise feature:** The admin API is exclusive to Terraform Enterprise, and can only be used by the admins and operators who install and maintain their organization's Terraform Enterprise instance.

-> These API endpoints are available in Terraform Enterprise as of version 202012-1.

There are two ways to configure module sharing via the admin API:

- This endpoint, which allows an organization to share modules with a specific list of other organizations.
- The [update an organization endpoint](./organizations.html#update-an-organization), whose `data.attributes.global-module-sharing` property allows an organization to share modules with every organization in the instance.

Enabling either option will disable the other. For more information, see [Administration: Module Sharing](/docs/enterprise/admin/module-sharing.html).

~> **Important**: The `PATCH /admin/organizations/:name/module-consumers` endpoint is **deprecated** and will be removed in a future release. All existing integrations with this API should transition to the [new endpoint](./module-sharing.html#update-an-organization-39-s-module-consumers
).

## (**deprecated**) Update an Organization's Module Consumers via module-partnerships

`PATCH /admin/organizations/:name/module-consumers`

This endpoint sets the list of organizations that can use modules from the sharing organization's private registry. Sharing with specific organizations will automatically turn off global module sharing, which is configured with the [update an organization endpoint](./organizations.html#update-an-organization) (via the `data.attributes.global-module-sharing` property).

Parameter  | Description
-----------|------------
`:name`    | The name of the organization whose registry is being shared

Status  | Response                                              | Reason
--------|-------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "module-partnerships"`) | The list of module consumers was successfully updated
[404][] | [JSON API error object][]                             | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                             | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                                               | Type          | Default   | Description
-------------------------------------------------------|---------------|-----------|------------
`data.type`                                            | string        |           | Must be `"module-partnerships"`
`data.attributes.module-consuming-organization-ids`    | array[string] |           | A list of external ids for organizations that will be able to access modules in the producing organization's registry. These should have an `org-` prefix.

### Sample Payload

```json
{
  "data": {
    "type": "module-partnerships",
    "attributes": {
      "module-consuming-organization-ids": [
        "org-939hp5K7kecppVmd"
      ]
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://tfe.example.com/api/v2/admin/organizations/my-organization/module-consumers
```

### Sample Response

```json
{
  "data": [
    {
      "id": "mp-tQATArr4gyYDBvkF",
      "type": "module-partnerships",
      "attributes": {
        "consuming-organization-id": "org-939hp5K7kecppVmd",
        "consuming-organization-name": "other-organization",
        "producing-organization-id": "org-etdex8r9VLnyHFct",
        "producing-organization-name": "my-organization"
      }
    }
  ]
}
```

-> These API endpoints are available in Terraform Enterprise as of version 202103-1.

This endpoint supports Cross Org Module sharing. There are two ways to configure module sharing via the admin API:

- This endpoint, which allows an organization to share modules with a specific list of other organizations.
- The [update an organization endpoint](./organizations.html#update-an-organization), whose `data.attributes.global-module-sharing` property allows an organization to share modules with every organization in the instance.

Enabling either option will disable the other. For more information, see [Administration: Module Sharing](/docs/enterprise/admin/module-sharing.html).

## Update an Organization's Module Consumers

`PATCH /admin/organizations/:name/relationships/module-consumers`

This endpoint sets the list of organizations that can use modules from the sharing organization's private registry. Sharing with specific organizations will automatically turn off global module sharing, which is configured with the [update an organization endpoint](./organizations.html#update-an-organization) (via the `data.attributes.global-module-sharing` property).

Parameter  | Description
-----------|------------
`:name`    | The name of the organization whose registry is being shared

Status  | Response                                              | Reason
--------|-------------------------------------------------------|----------
[204][] | No content | The list of module consumers was successfully updated
[404][] | [JSON API error object][]                             | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                             | Malformed request body (missing attributes, wrong types, module consumer not found, etc..)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                                               | Type          | Default   | Description
-------------------------------------------------------|---------------|-----------|------------
`data[]` | array\[object\] |         | A list of resource identifier objects that defines which organizations will consume modules. These objects must contain `id` and `type` properties, and the `type` property must be `organizations` (e.g. `{ "id": "an-org", "type": "organizations" }`).

### Sample Payload

```json
{
  "data": [
    {
      "id": "an-org",
      "type": "organizations"

    },
    {
      "id": "another-org",
      "type": "organizations"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://tfe.example.com/api/v2/admin/organizations/my-organization/module-consumers
```

### Sample Response

The response body will be empty if successful.

## List all Module Consumers for an organization

`GET /admin/organizations/:name/relationships/module-consumers`

This endpoint lists all organizations in the Terraform Enterprise installation.

Parameter  | Description
-----------|------------
`:name`    | The name of the organization whose registry is being shared

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | The request was successful
[404][] | [JSON API error object][]                       | Organization not found, or client is not an administrator


### Query Parameters

[These are standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter           | Description
--------------------|------------
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 20 organizations per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://tfe.example.com/api/v2/admin/organizations/my-organization/relationships/module-consumers
```

### Sample Response

```json
{
  "data": [
    {
      "id": "my-organization",
      "type": "organizations",
      "attributes": {
        "access-beta-tools": false,
        "external-id": "org-XBiRp755dav5p3P2",
        "is-disabled": false,
        "name": "my-organization",
        "terraform-build-worker-apply-timeout": null,
        "terraform-build-worker-plan-timeout": null,
        "terraform-worker-sudo-enabled": false,
        "notification-email": "my-organization@example.com",
        "global-module-sharing": false,
        "sso-enabled": false
      },
      "relationships": {
        "module-consumers": {
          "links": {
            "related": "/api/v2/admin/organizations/my-organization/relationships/module-consumers"
          }
        },
        "owners": {
          "data": [
            {
              "id": "user-hxTQDETqnJsi5VYP",
              "type": "users"
            }
          ]
        },
        "subscription": {
          "data": null
        },
        "feature-set": {
          "data": null
        }
      },
      "links": {
        "self": "https://app.terraform.io/api/v2/admin/organizations/my-organization/relationships/module-consumers?page%5Bnumber%5D=1\u0026page%5Bsize%5D=20",
        "first": "https://app.terraform.io/api/v2/admin/organizations/my-organization/relationships/module-consumers?page%5Bnumber%5D=1\u0026page%5Bsize%5D=20",
        "prev": null,
        "next": null,
        "last": "https://app.terraform.io/api/v2/admin/organizations/my-organization/relationships/module-consumers?page%5Bnumber%5D=1\u0026page%5Bsize%5D=20"
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
  ]
}
```
