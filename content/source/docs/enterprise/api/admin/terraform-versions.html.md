---
layout: enterprise2
page_title: "Terraform Versions - Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin-terraform-versions"
---

# Admin Terraform Versions API

-> **Note**: These API endpoints are in beta and are subject to change.

-> **Pre-release:** These API endpoints are not yet available in the current Private Terraform Enterprise release.

The Terraform Versions Admin API contains endpoints to help site administrators manage known versions of Terraform.

## List all Terraform versions

`GET /admin/terraform-versions`

This endpoint lists all known versions of Terraform.

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "terraform-versions"`) | Successfully listed Terraform versions
[404][] | [JSON API error object][]                            | Client is not an administrator.

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 Terraform versions per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  "https://app.terraform.io/api/v2/admin/terraform-versions"
```

### Sample Response

```json
{
  "data": [
    {
      "id": "0.11.1",
      "type": "terraform-versions",
      "attributes": {
        "version": "0.11.1",
        "url": "https://releases.hashicorp.com/terraform/0.11.1/terraform_0.11.1_linux_amd64.zip",
        "sha": "4e3d5e4c6a267e31e9f95d4c1b00f5a7be5a319698f0370825b459cb786e2f35",
        "official": true,
        "enabled": true,
        "beta": false
      }
    },
    {
      "id": "0.11.0",
      "type": "terraform-versions",
      "attributes": {
        "version": "0.11.0",
        "url": "https://releases.hashicorp.com/terraform/0.11.0/terraform_0.11.0_linux_amd64.zip",
        "sha": "402b4333792967986383670134bb52a8948115f83ab6bda35f57fa2c3c9e9279",
        "official": true,
        "enabled": true,
        "beta": false
      }
    }
  ],
  "links": {
    "self": "http://localhost:3000/api/v2/admin/terraform_versions?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "http://localhost:3000/api/v2/admin/terraform_versions?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "http://localhost:3000/api/v2/admin/terraform_versions?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "usage-counts": {
      "0.11.1": 2,
      "0.11.0": 0,
    },
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 2
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

[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.type`                 | string |         | Must be `"terraform-versions"`
`data.attributes.version`   | string |         | A semantic version string (e.g. `"0.11.0"`)
`data.attributes.url`       | string |         | The URL where a compressed 64-bit linux binary (using ZIP compression) of this version can be downloaded
`data.attributes.sha`       | string |         | The SHA-256 checksum of the compressed Terraform binary
`data.attributes.official`  | bool   | `false` | Whether or not this is an official release of Terraform
`data.attributes.enabled`   | bool   | `true`  | Whether or not this version of Terraform is enabled for use in Terraform Enterprise
`data.attributes.beta`      | bool   | `false` | Whether or not this version of Terraform is a beta pre-release

### Sample Payload

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.0",
      "url": "https://releases.hashicorp.com/terraform/0.11.0/terraform_0.11.0_linux_amd64.zip",
      "sha": "402b4333792967986383670134bb52a8948115f83ab6bda35f57fa2c3c9e9279",
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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/admin/terraform-versions
```

### Sample Response

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.0",
      "url": "https://releases.hashicorp.com/terraform/0.11.0/terraform_0.11.0_linux_amd64.zip",
      "sha": "402b4333792967986383670134bb52a8948115f83ab6bda35f57fa2c3c9e9279",
      "official": true,
      "enabled": true,
      "beta": false
    }
  }
}
```

## Show a Terraform version

`GET /admin/terraform-versions/:version`

Parameter  | Description
-----------|------------
`:version` | The version string of the Terraform version to show

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "terraform-versions"`) | The request was successful
[404][] | [JSON API error object][]                            | Terraform version not found, or client is not an administrator

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/admin/terraform-versions/0.11.0
```

### Sample Response

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.0",
      "url": "https://releases.hashicorp.com/terraform/0.11.0/terraform_0.11.0_linux_amd64.zip",
      "sha": "402b4333792967986383670134bb52a8948115f83ab6bda35f57fa2c3c9e9279",
      "official": true,
      "enabled": true,
      "beta": false
    }
  }
}
```

## Update a Terraform version

`PATCH /admin/terraform-versions/:version`

Parameter  | Description
-----------|------------
`:version` | The version string of the Terraform version to update

Status  | Response                                             | Reason
--------|------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "terraform-versions"`) | The Terraform version was successfully updated
[404][] | [JSON API error object][]                            | Terraform version not found, or client is not an administrator
[422][] | [JSON API error object][]                            | Validation errors

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.type`                 | string |         | Must be `"terraform-versions"`
`data.attributes.url`       | string |         | The URL where a binary of this version can be downloaded
`data.attributes.sha`       | string |         | The shasum of the Terraform binary
`data.attributes.official`  | bool   | `false` | Whether or not this is an official release of Terraform
`data.attributes.enabled`   | bool   | `true`  | Whether or not this version of Terraform is enabled for use in Terraform Enterprise
`data.attributes.beta`      | bool   | `false` | Whether or not this version of Terraform is a beta pre-release

### Sample Payload

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "url": "https://releases.hashicorp.com/terraform/0.11.0/terraform_0.11.0_linux_amd64.zip",
      "sha": "402b4333792967986383670134bb52a8948115f83ab6bda35f57fa2c3c9e9279",
      "official": true,
      "enabled": false,
      "beta": false
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/admin/terraform-versions/0.11.0
```

### Sample Response

```json
{
  "data": {
    "type": "terraform-versions",
    "attributes": {
      "version": "0.11.0",
      "url": "https://releases.hashicorp.com/terraform/0.11.0/terraform_0.11.0_linux_amd64.zip",
      "sha": "402b4333792967986383670134bb52a8948115f83ab6bda35f57fa2c3c9e9279",
      "official": true,
      "enabled": false,
      "beta": false
    }
  }
}
```

## Delete a Terraform version

`DELETE /admin/terraform-versions/:version`

This endpoint removes a Terraform version from Terraform Enterprise. Versions cannot be removed if they are official versions of Terraform or if there are Workspaces using them.

Parameter  | Description
-----------|------------
`:version` | The version string of the Terraform version to delete

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty response            | The Terraform version was successfully deleted
[404][] | [JSON API error object][] | Terraform version not found, or client is not an administrator
[422][] | [JSON API error object][] | The Terraform version cannot be removed due to it being official or in use.

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/admin/terraform-versions/0.11.0
```
