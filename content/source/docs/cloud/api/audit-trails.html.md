---
layout: "cloud"
page_title: "Audit Trails - API Docs - Terraform Cloud"
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

# Audit Trails API

-> **Note:** Audit trails are a paid feature, available as part of the **Terraform Cloud for Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

-> **Note:** Unlike other APIs, the Audit Trails API does not use the [JSON API specification](./index.html#json-api-formatting).

-> **Note:** Terraform Cloud retains 14 days of audit log information.

The audit trails API exposes a stream of audit events, which describe changes to the application entities (workspaces, runs, etc.) that belong to a Terraform Cloud organization.

## List an organization's audit events

`GET /organization/audit-trail`

-> **Note:** This endpoint cannot be accessed with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens). You must access it with an [organization token](../users-teams-organizations/api-tokens.html#organization-api-tokens).

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

| Parameter | Description                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `since`   | **Optional.** Returns only audit trails created after this date (UTC and in [ISO8601 Format](https://www.iso.org/iso-8601-date-and-time-format.html) - YYYY-MM-DDTHH:MM:SS.SSSZ) |
`page[number]`      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`        | **Optional.** If omitted, the endpoint will return 1000 audit events per page.                                                                                                             |

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --request GET \
  "https://app.terraform.io/api/v2/organization/audit-trail?page[number]=1&since=2020-05-30T17:52:46.000Z"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ae66e491-db59-457c-8445-9c908ee726ae",
      "version": "0",
      "type": "Resource",
      "timestamp": "2020-06-30T17:52:46.000Z",
      "auth": {
        "accessor_id": "user-MaPuLxAXvtq2PWTH",
        "description": "pveverka",
        "type": "Client",
        "impersonator_id": null,
        "organization_id": "org-AGLwRmx1snv34Yts"
      },
      "request": {
        "id": "4df584d4-7e2a-01e6-6cc0-4adbefa020e6"
      },
      "resource": {
        "id": "at-sjt83qTw3GZatuPm",
        "type": "authentication_token",
        "action": "create",
        "meta": null
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "prev_page": null,
    "next_page": 2,
    "total_pages": 8,
    "total_count": 778
  }
}
```

### Response Schema

Each JSON object in the response data array will include the following details, if available:

| Key                    | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `id`                   | The ID of this audit trail (UUID format)                    |
| `version`              | The audit trail schema version                              |
| `type`                 | The type of audit trail (defaults to `Resource`)            |
| `timestamp`            | UTC ISO8601 DateTime (e.g. `2020-06-16T20:26:58.000Z`)      |
| `auth.accessor_id`     | The ID of audited actor (e.g. `user-V3R563qtJNcExAkN`)      |
| `auth.description`     | Username of audited actor                                   |
| `auth.type`            | Authentication Type (one of Client, Impersonated or System) |
| `auth.impersonator_id` | The ID of impersonating actor (if available)                |
| `auth.organization_id` | The ID of organization (e.g. `org-QpXoEnULx3r2r1CA`)        |
| `request.id`           | The ID for request (if available) (UUID format)             |
| `resource.id`          | The ID of resource (e.g. `run-FwnENkvDnrpyFC7M`)            |
| `resource.type`        | Type of resource (e.g. `run`)                               |
| `resource.action`      | Action audited (e.g. `applied`)                             |
| `resource.meta`        | Key-value metadata about this audited event                 |
