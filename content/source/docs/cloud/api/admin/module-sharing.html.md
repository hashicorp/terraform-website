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
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Admin Module Sharing API

-> **Terraform Enterprise feature:** The admin API is exclusive to Terraform Enterprise, and can only be used by the admins and operators who install and maintain their organization's Terraform Enterprise instance.

-> These API endpoints are available in Terraform Enterprise as of version 202012-1.

## Update an Organization's Module Consumers

`PATCH /admin/organizations/:name/module-consumers`

This endpoint sets the list of organizations that can use modules from the sharing organization's private registry. It also turns off global module sharing for the sharing organization when called.

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
  https://tfe.example.com/api/v2/organizations/my-organization
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
