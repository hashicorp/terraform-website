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

-> **Terraform Enterprise feature:** The admin API is exclusive to Terraform Enterprise, and can only be used by the admins and operators who install and maintain their organization's Terraform Enterprise instance.

-> These API endpoints are available in Terraform Enterprise as of version 201807-1.

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
  "https://tfe.example.com/api/v2/admin/organizations"
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
        "self": "/api/v2/admin/organizations/my-organization"
      }
    }
  ],
  "links": {
    "self": "https://tfe.example.com/api/v2/admin/organizations?page%5Bnumber%5D=1\u0026page%5Bsize%5D=20",
    "first": "https://tfe.example.com/api/v2/admin/organizations?page%5Bnumber%5D=1\u0026page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://tfe.example.com/api/v2/admin/organizations?page%5Bnumber%5D=1\u0026page%5Bsize%5D=20"
  },
  "meta": {
    "status-counts": {
      "total": 1,
      "active": 1,
      "disabled": 0
    },
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
  https://tfe.example.com/api/v2/admin/organizations/my-organization
```

### Sample Response

```json
{
  "data": {
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
      "self": "/api/v2/admin/organizations/my-organization"
    }
  }
}
```

## Update an Organization

`PATCH /admin/organizations/:organization_name`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to update

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | The organization was successfully updated
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload. Note that the Admin Organizations API may offer a different set of attributes than the [Organizations API](/docs/cloud/api/organizations.html#request-body-1).

Key path                                               | Type    | Default   | Description
-------------------------------------------------------|---------|-----------|------------
`data.type`                                            | string  |           | Must be `"organizations"`
`data.attributes.access-beta-tools`                    | boolean | false     | Whether or not workspaces in the organization can be configured to use beta versions of Terraform.
`data.attributes.global-module-sharing`                | boolean | false     | If true, modules in the organization's private module repository will be available to all other organizations in this TFE instance. Enabling this will disable any previously configured [module consumers](./module-sharing.html).
`data.attributes.is-disabled`                          | boolean | false     | Disabling the organization will remove all permissions and no longer be accessible to users.
`data.attributes.terraform-build-worker-apply-timeout` | string  | 24h       | Maximum run time for Terraform applies for this organization. Will use the configured global defaults if left unset. Specify a duration with a decimal number and a unit suffix.
`data.attributes.terraform-build-worker-plan-timeout`  | string  | 2h        | Maximum run time for Terraform plans for this organization. Will use the configured global defaults if left unset. Specify a duration with a decimal number and a unit suffix.

### Sample Payload

```json
{
  "data": {
    "type": "organizations",
    "attributes": {
      "global-module-sharing": true
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
  https://tfe.example.com/api/v2/admin/organizations/my-organization
```

### Sample Response

```json
{
  "data": {
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
      "global-module-sharing": true,
      "sso-enabled": false
    },
    "relationships": {
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
      "self": "/api/v2/admin/organizations/my-organization"
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
  https://tfe.example.com/api/v2/admin/organizations/my-organization
```
