---
layout: "cloud"
page_title: "Terraform Versions - Admin - API Docs - Terraform Enterprise"
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

# Admin Terraform Versions API

-> **Terraform Enterprise feature:** The admin API is exclusive to Terraform Enterprise, and can only be used by the admins and operators who install and maintain their organization's Terraform Enterprise instance.

-> These API endpoints are available in Terraform Enterprise as of version 201807-1.

The Terraform Versions Admin API lets site administrators manage which versions of Terraform are available to the Terraform Cloud users within their enterprise.

## List all Terraform versions

`GET /api/v2/admin/terraform-versions`

This endpoint lists all known versions of Terraform.

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "terraform-versions"`) | Successfully listed Terraform versions
[404][] | [JSON API error object][]                            | Client is not an administrator.


### Query Parameters

This endpoint supports pagination [with standard URL query parameters](../index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 Terraform versions per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/terraform-versions"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "tool-L4oe7rNwn7J4E5Yr",
      "type": "terraform-versions",
      "attributes": {
        "version": "0.11.8",
        "url": "https://releases.hashicorp.com/terraform/0.11.8/terraform_0.11.8_linux_amd64.zip",
        "sha": "84ccfb8e13b5fce63051294f787885b76a1fedef6bdbecf51c5e586c9e20c9b7",
        "official": true,
        "enabled": true,
        "beta": false,
        "usage": 0,
        "created-at": "2018-08-15T22:34:24.561Z"
      }
    },
    {
      "id": "tool-qcbYn12vuRKPgPpy",
      "type": "terraform-versions",
      "attributes": {
        "version": "0.11.7",
        "url": "https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_linux_amd64.zip",
        "sha": "6b8ce67647a59b2a3f70199c304abca0ddec0e49fd060944c26f666298e23418",
        "official": true,
        "enabled": true,
        "beta": false,
        "usage": 2,
        "created-at": null
      }
    }
  ],
  "links": {
    "self": "https://tfe.example.com/api/v2/admin/terraform-versions?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://tfe.example.com/api/v2/admin/terraform-versions?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": "https://tfe.example.com/api/v2/admin/terraform-versions?page%5Bnumber%5D=2&page%5Bsize%5D=20",
    "last": "https://tfe.example.com/api/v2/admin/terraform-versions?page%5Bnumber%5D=4&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": 2,
      "total-pages": 4,
      "total-count": 70
    }
  }
}
```

## Create a Terraform version

`POST /admin/terraform-versions`

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "terraform-versions"`) | The Terraform version was successfully created
[404][] | [JSON API error object][]                            | Client is not an administrator
[422][] | [JSON API error object][]                            | Validation errors


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.type`                 | string |         | Must be `"terraform-versions"`
`data.attributes.version`   | string |         | A semantic version string in N.N.N or N.N.N-bundleName format (e.g. `"0.11.0"`, `"0.12.20-beta1"`.)
`data.attributes.url`       | string |         | The URL where a ZIP-compressed 64-bit Linux binary of this version can be downloaded
`data.attributes.sha`       | string |         | The SHA-256 checksum of the compressed Terraform binary
`data.attributes.official`  | bool   | `false` | Whether or not this is an official release of Terraform
`data.attributes.enabled`   | bool   | `true`  | Whether or not this version of Terraform is enabled for use in Terraform Cloud
`data.attributes.beta`      | bool   | `false` | Whether or not this version of Terraform is a beta pre-release

### Sample Payload

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.8",
      "url": "https://releases.hashicorp.com/terraform/0.11.8/terraform_0.11.8_linux_amd64.zip",
      "sha": "84ccfb8e13b5fce63051294f787885b76a1fedef6bdbecf51c5e586c9e20c9b7",
      "official": true,
      "enabled": true,
      "beta": false
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
  https://app.terraform.io/api/v2/admin/terraform-versions
```

### Sample Response

```json
{
  "data": {
    "id": "tool-L4oe7rNwn7J4E5Yr",
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.8",
      "url": "https://releases.hashicorp.com/terraform/0.11.8/terraform_0.11.8_linux_amd64.zip",
      "sha": "84ccfb8e13b5fce63051294f787885b76a1fedef6bdbecf51c5e586c9e20c9b7",
      "official": true,
      "enabled": true,
      "beta": false,
      "usage": 0,
      "created-at": "2018-08-15T22:34:24.561Z"
    }
  }
}
```

## Show a Terraform version

`GET /api/v2/admin/terraform-versions/:id`

Parameter  | Description
-----------|------------
`:id`      | The ID of the Terraform version to show

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "terraform-versions"`) | The request was successful
[404][] | [JSON API error object][]                            | Terraform version not found, or client is not an administrator


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/admin/terraform-versions/tool-L4oe7rNwn7J4E5Yr
```

### Sample Response

```json
{
  "data": {
    "id": "tool-L4oe7rNwn7J4E5Yr",
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.8",
      "url": "https://releases.hashicorp.com/terraform/0.11.8/terraform_0.11.8_linux_amd64.zip",
      "sha": "84ccfb8e13b5fce63051294f787885b76a1fedef6bdbecf51c5e586c9e20c9b7",
      "official": true,
      "enabled": true,
      "beta": false,
      "usage": 0,
      "created-at": "2018-08-15T22:34:24.561Z"
    }
  }
}
```

## Update a Terraform version

`PATCH /admin/terraform-versions/:id`

Parameter  | Description
-----------|------------
`:id`      | The ID of the Terraform version to update

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "terraform-versions"`) | The Terraform version was successfully updated
[404][] | [JSON API error object][]                            | Terraform version not found, or client is not an administrator
[422][] | [JSON API error object][]                            | Validation errors


### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                   | Type   | Default          | Description
---------------------------|--------|------------------|------------
`data.type`                | string |                  | Must be `"terraform-versions"`
`data.attributes.version`  | string | (previous value) | A semantic version string in N.N.N or N.N.N-bundleName format (e.g. `"0.11.0"`, `"0.12.20-beta1"`.)
`data.attributes.url`      | string | (previous value) | The URL where a ZIP-compressed 64-bit Linux binary of this version can be downloaded
`data.attributes.sha`      | string | (previous value) | The SHA-256 checksum of the compressed Terraform binary
`data.attributes.official` | bool   | (previous value) | Whether or not this is an official release of Terraform
`data.attributes.enabled`  | bool   | (previous value) | Whether or not this version of Terraform is enabled for use in Terraform Cloud
`data.attributes.beta`     | bool   | (previous value) | Whether or not this version of Terraform is a beta pre-release

### Sample Payload

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "official": true,
      "beta": false
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
  https://app.terraform.io/api/v2/admin/terraform-versions/tool-L4oe7rNwn7J4E5Yr
```

### Sample Response

```json
{
  "data": {
    "id": "tool-L4oe7rNwn7J4E5Yr",
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.8",
      "url": "https://releases.hashicorp.com/terraform/0.11.8/terraform_0.11.8_linux_amd64.zip",
      "sha": "84ccfb8e13b5fce63051294f787885b76a1fedef6bdbecf51c5e586c9e20c9b7",
      "official": true,
      "enabled": true,
      "beta": false,
      "usage": 0,
      "created-at": "2018-08-15T22:34:24.561Z"
    }
  }
}
```

## Delete a Terraform version

`DELETE /admin/terraform-versions/:id`

This endpoint removes a Terraform version from Terraform Cloud. Versions cannot be removed if they are labeled as official versions of Terraform or if there are workspaces using them.

Parameter  | Description
-----------|------------
`:id`      | The ID of the Terraform version to delete

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty response            | The Terraform version was successfully deleted
[404][] | [JSON API error object][] | Terraform version not found, or client is not an administrator
[422][] | [JSON API error object][] | The Terraform version cannot be removed (it is official or is in use)


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/admin/terraform-versions/tool-L4oe7rNwn7J4E5Yr
```
