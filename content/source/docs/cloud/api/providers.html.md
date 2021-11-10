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

- The public module registry discovery endpoints have the path prefix provided in the [discovery document](../../registry/api.html#service-discovery) which is currently `/api/registry/public/v1`.
- [Authentication](./index.html#authentication) is handled the same as all other Terraform Cloud endpoints.

### Sample Proxy Request (public provider)

List available versions for the `aws` provider on the namespace `hashicorp`:

```shell
$ curl https://registry.terraform.io/v2/providers/hashicorp/aws/versions
```

The same request for the same module and provider on the Terraform Cloud module registry:

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/registry/public/v2/providers/hashicorp/aws/versions
```

## List Registry Providers for an Organization

`GET /organizations/:organization_name/registry-providers`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to list available modules from.

Lists the modules that are available to a given organization. This includes the full list of publicly curated and private modules and is filterable.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-providers"`) | The request was successful
[404][] | [JSON API error object][]                          | Modules not found or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                           | Description
------------------------------------|---------------------
`q`                                 | **Optional.** A search query string.  Providers are searchable by name, namespace fields.
`filter[field name]`                | **Optional.** If specified, restricts results to those with the matching field name value.  Valid values are `registry_name`, and `organization_name`.
`page[number]`                      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                        | **Optional.** If omitted, the endpoint will return 20 registry modules per page.

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
      "id": "mod-kwt1cBiX2SdDz38w",
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
      "id": "mod-PopQnMtYDCcd3PRX",
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

#TODO Bethany stopped here
## Create a Provider

 `POST /organizations/:organization_name/registry-providers`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a module in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

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
`data.attributes.name`          | string |         | The name of this module. May contain alphanumeric characters, with dashes and underscores allowed in non-leading or trailing positions. Maximum length is 64 characters.
`data.attributes.provider`      | string |         | Specifies the Terraform provider that this module is used for. May contain lowercase alphanumeric characters. Maximum length is 64 characters.
`data.attributes.namespace`     | string |         | The namespace of this module. Cannot be set for private modules. May contain alphanumeric characters, with dashes and underscores allowed in non-leading or trailing positions. Maximum length is 64 characters.
`data.attributes.registry-name` | string |         | Indicates whether this is a publicly maintained module or private. Must be either `public` or `private`.


### Sample Payload (public provider)

```json
{
  "data": {
    "type": "registry-modules",
    "attributes": {
      "name": "vpc",
      "namespace": "terraform-aws-modules",
      "provider": "aws",
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


### Sample Response (public module)

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "vpc",
      "namespace": "terraform-aws-modules",
      "registry-name": "public",
      "provider": "aws",
      "status": "pending",
      "version-statuses": [],
      "created-at": "2020-07-09T19:36:56.288Z",
      "updated-at": "2020-07-09T19:36:56.288Z",
      "permissions": {
        "can-delete": true,
        "can-resync": true,
        "can-retry": true
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
      "self": "/api/v2/organizations/my-organization/registry-modules/public/terraform-aws-modules/vpc/aws"
    }
  }
}
```


## Get a Provider

`GET /organizations/:organization_name/registry-modules/:registry_name/:namespace/:name/:provider`


### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization the module belongs to.
`:namespace`         | The namespace of the module. For private modules this is the name of the organization that owns the module.
`:name`              | The module name.
`:provider`          | The module provider. Must be lowercase alphanumeric.
`:registry-name`     | Either `public` or `private`.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-modules"`) | The request was successful
[403][] | [JSON API error object][]                          | Forbidden - public module curation disabled
[404][] | [JSON API error object][]                          | Module not found or user unauthorized to perform action


### Sample Request (public module)

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules/public/terraform-aws-modules/vpc/aws
```


### Sample Response (public module)

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "vpc",
      "provider": "aws",
      "namespace": "terraform-aws-modules",
      "registry-name": "public",
      "status": "setup_complete",
      "version-statuses": [],
      "created-at": "2020-07-09T19:36:56.288Z",
      "updated-at": "2020-07-09T20:16:20.538Z",
      "permissions": {
        "can-delete": true,
        "can-resync": true,
        "can-retry": true
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
      "self": "/api/v2/organizations/my-organization/registry-modules/public/terraform-aws-modules/vpc/aws"
    }
  }
}
```

## Delete a Module

* `DELETE /organizations/:organization_name/registry-modules/:registry_name/:namespace/:name/:provider/:version`
* `DELETE /organizations/:organization_name/registry-modules/:registry_name/:namespace/:name/:provider`
* `DELETE /organizations/:organization_name/registry-modules/:registry_name/:namespace/:name`


### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to delete a module from. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.
`:namespace`         | The module namespace that the deletion will affect. For private modules this is the name of the organization that owns the module.
`:name`              | The module name that the deletion will affect.
`:provider`          | If specified, the provider for the module that the deletion will affect.
`:version`           | If specified, the version for the module and provider that will be deleted.
`:registry_name`     | Either `public` or `private`

[permissions-citation]: #intentionally-unused---keep-for-maintainers

When removing modules, there are three versions of the endpoint, depending on how many parameters are specified.

* If all parameters (module namespace, name, provider, and version) are specified, the specified version for the given provider of the module is deleted.
* If module namespace, name, and provider are specified, the specified provider for the given module is deleted along with all its versions.
* If only module namespace and name are specified, the entire module is deleted.

For public modules, only the the endpoint specifying the module namespace and name is valid. The other DELETE endpoints will 404.
For public modules, this only removes the record from the organization's Terraform Cloud Registry and does not remove the public module from registry.terraform.io.

If a version deletion would leave a provider with no versions, the provider will be deleted. If a provider deletion would leave a module with no providers, the module will be deleted.

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[204][] | Nothing                                              | Success
[403][] | [JSON API error object][]                            | Forbidden - public module curation disabled
[404][] | [JSON API error object][]                            | Module, provider, or version not found or user not authorized


### Sample Request (public module)

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules/public/terraform-aws-modules/vpc/aws
```
