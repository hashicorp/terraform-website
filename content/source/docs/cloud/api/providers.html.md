---
layout: "cloud"
page_title: "Providers - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Registry Providers API

## Terraform Cloud Registry Implementation

For publicly curated providers, the Terraform Cloud Registry acts as a proxy to the [Terraform Registry](https://registry.terraform.io) for the following:

- List available versions for a specific provider
- Get a specific provider
- Get the latest version for a specific provider

- The public registry discovery endpoints have the path prefix provided in the [discovery document](../../registry/api.html#service-discovery) which is currently `/api/registry/public/v1`.
- [Authentication](./index.html#authentication) is handled the same as all other Terraform Cloud endpoints.

### Sample Proxy Request (public provider)

List available versions for the `aws` provider on the namespace `hashicorp`:

```shell
$ curl https://registry.terraform.io/v2/providers/hashicorp/aws/versions
```

The same request for the same provider on the Terraform Cloud private registry:

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/registry/public/v2/providers/hashicorp/aws/versions
```

## List Registry Providers for an Organization

`GET /organizations/:organization_name/registry-providers`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to list available providers from.

Lists the providers that are available to a given organization.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-providers"`) | The request was successful
[404][] | [JSON API error object][]                          | Providers not found or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                           | Description
------------------------------------|---------------------
`q`                                 | **Optional.** A search query string.  Providers are searchable by name, namespace fields.
`filter[field name]`                | **Optional.** If specified, restricts results to those with the matching field name value.  Valid values are `registry_name`, and `organization_name`.
`page[number]`                      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                        | **Optional.** If omitted, the endpoint will return 20 registry providers per page.

### Sample Request

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-providers
```

### Sample Response

```json
{
  "data": [
    {
      "id": "prov-kwt1cBiX2SdDz38w",
      "type": "registry-providers",
      "attributes": {
        "name": "aws",
        "namespace": "my-organization",
        "created-at": "2021-04-07T19:01:18.528Z",
        "updated-at": "2021-04-07T19:01:19.863Z",
        "registry-name": "public",
        "permissions": {
          "can-delete": true
        }
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      },
      "links": {
        "self": "/api/v2/organizations/my-organization/registry-providers/public/my-organization/aws"
      }
    },
    {
      "id": "prov-PopQnMtYDCcd3PRX",
      "type": "registry-providers",
      "attributes": {
        "name": "aurora",
        "namespace": "my-organization",
        "created-at": "2021-04-07T19:04:41.375Z",
        "updated-at": "2021-04-07T19:04:42.828Z",
        "registry-name": "public",
        "permissions": {
          "can-delete": true
        }
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      },
      "links": {
        "self": "/api/v2/organizations/my-organization/registry-providers/public/my-organization/aurora"
      }
    },
    ...,
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/organizations/my-organization/registry-providers?page%5Bnumber%5D=1&page%5Bsize%5D=6",
    "first": "https://app.terraform.io/api/v2/organizations/my-organization/registry-providers?page%5Bnumber%5D=1&page%5Bsize%5D=6",
    "prev": null,
    "next": "https://app.terraform.io/api/v2/organizations/my-organization/registry-providers?page%5Bnumber%5D=2&page%5Bsize%5D=6",
    "last": "https://app.terraform.io/api/v2/organizations/my-organization/registry-providers?page%5Bnumber%5D=29&page%5Bsize%5D=6"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "page-size": 6,
      "prev-page": null,
      "next-page": 2,
      "total-pages": 29,
      "total-count": 169
    }
  }
}
```

## Create a Provider

 `POST /organizations/:organization_name/registry-providers`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a provider in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

#### Public providers
When created, the public provider record will be available in the organization's registry provider list. You cannot create versions for public providers as they are maintained in the public registry.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "registry-providers"`) | Successfully published provider
[422][] | [JSON API error object][]                          | Malformed request body (missing attributes, wrong types, etc.)
[403][] | [JSON API error object][]                          | Forbidden - public provider curation disabled
[404][] | [JSON API error object][]                          | User not authorized



### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                        | Type   | Default | Description
--------------------------------|--------|---------|------------
`data.type`                     | string |         | Must be `"registry-providers"`.
`data.attributes.name`          | string |         | The name of the provider.
`data.attributes.namespace`     | string |         | The namespace of the provider.
`data.attributes.registry-name` | string |         | Must be `public`.


### Sample Payload (public provider)

```json
{
  "data": {
    "type": "registry-providers",
    "attributes": {
      "name": "aws",
      "namespace": "hashicorp",
      "registry-name": "public"
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
  https://app.terraform.io/api/v2/organizations/my-organization/registry-providers
```


### Sample Response (public provider)

```json
{
  "data": {
    "id": "prov-fZn7uHu99ZCpAKZJ",
    "type": "registry-providers",
    "attributes": {
      "name": "aws",
      "namespace": "hashicorp",
      "registry-name": "public",
      "created-at": "2020-07-09T19:36:56.288Z",
      "updated-at": "2020-07-09T19:36:56.288Z",
      "permissions": {
        "can-delete": true
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/registry-providers/public/hashicorp/aws"
    }
  }
}
```


## Get a Provider

`GET /organizations/:organization_name/registry-providers/:registry_name/:namespace/:name`


### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization the provider belongs to.
`:namespace`         | The namespace of the provider.
`:name`              | The provider name.
`:registry-name`     | `public`.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-providers"`) | The request was successful
[403][] | [JSON API error object][]                          | Forbidden - public provider curation disabled
[404][] | [JSON API error object][]                          | Provider not found or user unauthorized to perform action


### Sample Request (public provider)

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-providers/public/hashicorp/aws
```


### Sample Response (public provider)

```json
{
  "data": {
    "id": "prov-fZn7uHu99ZCpAKZJ",
    "type": "registry-providers",
    "attributes": {
      "name": "aws",
      "namespace": "hashicorp",
      "registry-name": "public",
      "created-at": "2020-07-09T19:36:56.288Z",
      "updated-at": "2020-07-09T20:16:20.538Z",
      "permissions": {
        "can-delete": true
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        }
      }
    },
    "links": {
      "self": "/api/v2/organizations/my-organization/registry-providers/public/hashicorp/aws"
    }
  }
}
```

## Delete a Provider
* `DELETE /organizations/:organization_name/registry-providers/:registry_name/:namespace/:name`


### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to delete a provider from. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.
`:namespace`         | The provider namespace that the deletion will affect.
`:name`              | The provider name that the deletion will affect.
`:registry_name`     | `public`

[permissions-citation]: #intentionally-unused---keep-for-maintainers


Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[204][] | Nothing                                              | Success
[403][] | [JSON API error object][]                            | Forbidden - public provider curation disabled
[404][] | [JSON API error object][]                            | Provider not found or user not authorized


### Sample Request (public provider)

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-providers/public/hashicorp/aws
```
