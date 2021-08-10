---
layout: "cloud"
page_title: "Modules - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Registry Modules API

-> **Note:** Public Module Curation is only available in Terraform Cloud. Where applicable, the `registry_name` parameter must be `private` for Terraform Enterprise.

## Terraform Cloud Registry Implementation

The Terraform Cloud Module Registry implements the [Registry standard API](../../registry/api.html) for consuming/exposing private modules. Refer to the [Module Registry HTTP API](../../registry/api.html) to perform the following:

- Browse available modules
- Search modules by keyword
- List available versions for a specific module
- Download source code for a specific module version
- List latest version of a module for all providers
- Get the latest version for a specific module provider
- Get a specific module
- Download the latest version of a module

For publicly curated modules, the Terraform Cloud Module Registry acts as a proxy to the [Terraform Registry](https://registry.terraform.io) for the following:

- List available versions for a specific module
- Get a specific module
- Get the latest version for a specific module provider

The Terraform Cloud Module Registry endpoints differs from the Module Registry endpoints in the following ways:

- The `:namespace` parameter should be replaced with the organization name for private modules.
- The private module registry discovery endpoints have the path prefix provided in the [discovery document](../../registry/api.html#service-discovery) which is currently `/api/registry/v1`.
- The public module registry discovery endpoints have the path prefix provided in the [discovery document](../../registry/api.html#service-discovery) which is currently `/api/registry/public/v1`.
- [Authentication](./index.html#authentication) is handled the same as all other Terraform Cloud endpoints.

### Sample Registry Request (private module)

List available versions for the `consul` module for the `aws` provider on the module registry published from the Github organization `my-gh-repo-org`:

```shell
$ curl https://registry.terraform.io/v1/modules/my-gh-repo-org/consul/aws/versions
```

The same request for the same module and provider on the Terraform Cloud module registry for the `my-cloud-org` organization:

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/registry/v1/modules/my-cloud-org/consul/aws/versions
```

### Sample Proxy Request (public module)

List available versions for the `consul` module for the `aws` provider on the module registry published from the Github organization `my-gh-repo-org`:

```shell
$ curl https://registry.terraform.io/v1/modules/my-gh-repo-org/consul/aws/versions
```

The same request for the same module and provider on the Terraform Cloud module registry:

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/registry/public/v1/modules/my-gh-repo-org/consul/aws/versions
```

## List Registry Modules for an organization

`GET /organizations/:organization_name/registry-modules`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to list available modules from.

Lists the modules that are available to a given organization. This includes the full list of publicly curated and private modules and is filterable.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-modules"`) | The request was successful
[404][] | [JSON API error object][]                          | Modules not found or user unauthorized to perform action

### Filtering / Pagination

This endpoint supports Filtering and Pagination via the following attributes:

Query Parameter                     | Description
------------------------------------|---------------------
`q=<wild card filter>`              | a wild card filter that will match full words for the name, namespace, provider fields for modules
`filter[<field name>]=<field name>` | an exact filter that will match a given field. The available fields to filter on are `registry_name`, `provider`, and `organization_name`.
`page[number]=<page>`               | which page to return from the paginated results
`page[size]=<size>`                 | size of pages to return with the paginated results. The default is `20` with a max of `100`

### Sample Request

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules
```

### Sample Response

```json
{
  "data": [
    {
      "id": "mod-kwt1cBiX2SdDz38w",
      "type": "registry-modules",
      "attributes": {
        "name": "api-gateway",
        "namespace": "my-organization",
        "provider": "alicloud",
        "status": "setup_complete",
        "version-statuses": [
          {
            "version": "1.1.0",
            "status": "ok"
          }
        ],
        "created-at": "2021-04-07T19:01:18.528Z",
        "updated-at": "2021-04-07T19:01:19.863Z",
        "registry-name": "private",
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
        "self": "/api/v2/organizations/my-organization/registry-modules/private/my-organization/api-gateway/alicloud"
      }
    },
    {
      "id": "mod-PopQnMtYDCcd3PRX",
      "type": "registry-modules",
      "attributes": {
        "name": "aurora",
        "namespace": "my-organization",
        "provider": "aws",
        "status": "setup_complete",
        "version-statuses": [
          {
            "version": "4.1.0",
            "status": "ok"
          }
        ],
        "created-at": "2021-04-07T19:04:41.375Z",
        "updated-at": "2021-04-07T19:04:42.828Z",
        "registry-name": "private",
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
        "self": "/api/v2/organizations/my-organization/registry-modules/private/my-organization/aurora/aws"
      }
    },
    ...,
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/organizations/my-organization/registry-modules?page%5Bnumber%5D=1&page%5Bsize%5D=6",
    "first": "https://app.terraform.io/api/v2/organizations/my-organization/registry-modules?page%5Bnumber%5D=1&page%5Bsize%5D=6",
    "prev": null,
    "next": "https://app.terraform.io/api/v2/organizations/my-organization/registry-modules?page%5Bnumber%5D=2&page%5Bsize%5D=6",
    "last": "https://app.terraform.io/api/v2/organizations/my-organization/registry-modules?page%5Bnumber%5D=29&page%5Bsize%5D=6"
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

## Publish a Private Module from a VCS

~> **Deprecation warning**: the following endpoint `POST /registry-modules` is replaced by the below endpoint and will be removed from future versions of the API!

`POST /organizations/:organization_name/registry-modules/vcs`


Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a module in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

Publishes a new registry private module from a VCS repository, with module versions managed automatically by the repository's tags. The publishing process will fetch all tags in the source repository that look like [SemVer](https://semver.org/) versions with optional 'v' prefix. For each version, the tag is cloned and the config parsed to populate module details (input and output variables, readme, submodules, etc.). The [Module Registry Requirements](../../registry/modules/publish.html#requirements) define additional requirements on naming, standard module structure and tags for releases.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "registry-modules"`) | Successfully published module
[422][] | [JSON API error object][]                          | Malformed request body (missing attributes, wrong types, etc.)
[404][] | [JSON API error object][]                          | User not authorized


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                      | Type   | Default | Description
----------------------------------------------|--------|---------|------------
`data.type`                                   | string |         | Must be `"registry-modules"`.
`data.attributes.vcs-repo.identifier`         | string |         | The repository from which to ingress the configuration.
`data.attributes.vcs-repo.oauth-token-id`     | string |         | The VCS Connection (OAuth Connection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.
`data.attributes.vcs-repo.display_identifier` | string |         | The display identifier for the repository. For most VCS providers outside of BitBucket Cloud, this will match the `data.attributes.vcs-repo.identifier` string.

A VCS repository identifier is a reference to a VCS repository in the format `:org/:repo`, where `:org` and `:repo` refer to the organization (or project key, for Bitbucket Server) and repository in your VCS provider. The format for Azure DevOps is `:org/:project/_git/:repo`.

The OAuth Token ID identifies the VCS connection, and therefore the organization, that the module will be created in.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "vcs-repo": {
        "identifier":"lafentres/terraform-aws-my-module",
        "oauth-token-id":"ot-hmAyP66qk2AMVdbJ",
        "display_identifier":"lafentres/terraform-aws-my-module"
      }
    },
    "type":"registry-modules"
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
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules/vcs
```

### Sample Response

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
      "namespace": "my-organization",
      "registry-name": "private",
      "provider": "aws",
      "status": "pending",
      "version-statuses": [],
      "created-at": "2020-07-09T19:36:56.288Z",
      "updated-at": "2020-07-09T19:36:56.288Z",
      "vcs-repo": {
        "branch": "",
        "ingress-submodules": true,
        "identifier": "lafentres/terraform-aws-my-module",
        "display-identifier": "lafentres/terraform-aws-my-module",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/a12b3456..."
      },
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
      "self": "/api/v2/organizations/my-organization/registry-modules/private/my-organization/my-module/aws"
    }
  }
}
```

## Create a Module (with no VCS connection)

 `POST /organizations/:organization_name/registry-modules`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a module in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Creates a new registry module without a backing VCS repository.
#### Private modules
After creating a module, a version must be created and uploaded in order to be usable. Modules created this way do not automatically update with new versions; instead, you must explicitly create and upload each new version with the [Create a Module Version](#create-a-module-version) endpoint.

#### Public modules
When created, the public module record will be available in the organization's registry module list. You cannot create versions for public modules as they are maintained in the public registry.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "registry-modules"`) | Successfully published module
[422][] | [JSON API error object][]                          | Malformed request body (missing attributes, wrong types, etc.)
[403][] | [JSON API error object][]                          | Forbidden - public module curation disabled
[404][] | [JSON API error object][]                          | User not authorized



### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                        | Type   | Default | Description
--------------------------------|--------|---------|------------
`data.type`                     | string |         | Must be `"registry-modules"`.
`data.attributes.name`          | string |         | The name of this module. May contain alphanumeric characters, with dashes and underscores allowed in non-leading or trailing positions. Maximum length is 64 characters.
`data.attributes.provider`      | string |         | Specifies the Terraform provider that this module is used for. May contain alphanumeric characters. Maximum length is 64 characters.
`data.attributes.namespace`     | string |         | The namespace of this module. The organization name for private modules. The namespace for public modules. May contain alphanumeric characters, with dashes and underscores allowed in non-leading or trailing positions. Maximum length is 64 characters.
`data.attributes.registry-name` | string |         | Indicates whether this is a publicly maintained module or private. Must be either `public` or `private`.

### Sample Payload (private module)

```json
{
  "data": {
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
      "namespace": "my-organization",
      "provider": "aws",
      "registry-name": "private"
    }
  }
}
```

### Sample Payload (public module)

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
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules
```

### Sample Response (private module)

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
      "namespace": "my-organization",
      "registry-name": "private",
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
      "self": "/api/v2/organizations/my-organization/registry-modules/private/my-organization/my-module/aws"
    }
  }
}
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

## Create a Module Version

~> **Deprecation warning**: the following endpoint `POST /registry-modules/:organization_name/:name/:provider/versions` is replaced by the below endpoint and will be removed from future versions of the API!

`POST /organizations/:organization_name/registry-modules/:registry_name/:namespace/:name/:provider/versions`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a module in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.
`:namespace`         | The namespace of the module for which the version is being created. For private modules this is the same as the `:organization_name` parameter
`:name`              | The name of the module for which the version is being created.
`:provider`          | The name of the provider for which the version is being created.
`:registry-name`     | Must be `private`.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Creates a new registry module version. This endpoint only applies to private modules without a VCS repository; VCS-linked modules automatically create new versions for new tags. After creating the version, the module should be uploaded to the returned upload link.

Status  | Response                                                   | Reason
--------|------------------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "registry-module-versions"`) | Successfully published module version
[422][] | [JSON API error object][]                                  | Malformed request body (missing attributes, wrong types, etc.)
[403][] | [JSON API error object][]                                  | Forbidden - not available for public modules
[404][] | [JSON API error object][]                                  | User not authorized



### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                   | Type   | Default | Description
---------------------------|--------|---------|------------
`data.type`                | string |         | Must be `"registry-module-versions"`.
`data.attributes.version`  | string |         | A valid semver version string.

### Sample Payload

```json
{
  "data": {
    "type": "registry-module-versions",
    "attributes": {
      "version": "1.2.3"
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
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules/private/my-organization/my-module/aws/versions
```

### Sample Response

```json
{
  "data": {
    "id": "modver-qjjF7ArLXJSWU3WU",
    "type": "registry-module-versions",
    "attributes": {
      "source": "tfe-api",
      "status": "pending",
      "version": "1.2.3",
      "created-at": "2018-09-24T20:47:20.931Z",
      "updated-at": "2018-09-24T20:47:20.931Z"
    },
    "relationships": {
      "registry-module": {
        "data": {
          "id": "1881",
          "type": "registry-modules"
        }
      }
    },
    "links": {
      "upload": "https://archivist.terraform.io/v1/object/dmF1bHQ6djE6NWJPbHQ4QjV4R1ox..."
    }
  }
}
```

## Upload a Module Version (private module)

`PUT https://archivist.terraform.io/v1/object/<UNIQUE OBJECT ID>`

**The URL is provided in the `upload` links attribute in the `registry-module-versions` resource.**

### Expected Archive Format

Terraform Cloud expects the module version uploaded to be a tarball with the module in the root (not in a subdirectory).

Given the following folder structure:

```
terraform-null-test
├── README.md
├── examples
│   └── default
│       ├── README.md
│       └── main.tf
└── main.tf
```

Package the files in an archive format by running `tar zcvf module.tar.gz *` in the module's directory.

```
~$ cd terraform-null-test
terraform-null-test$ tar zcvf module.tar.gz *
a README.md
a examples
a examples/default
a examples/default/main.tf
a examples/default/README.md
a main.tf
```

### Sample Request

```shell
curl \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @module.tar.gz \
  https://archivist.terraform.io/v1/object/dmF1bHQ6djE6NWJPbHQ4QjV4R1ox...
```

After the registry module version is successfully parsed, its status will become `"ok"`.

## GET a Module

~> **Deprecation warning**: the following endpoint `GET /registry-modules/show/:organization_name/:name/:provider` is replaced by the below endpoint and will be removed from future versions of the API!

`GET /organizations/:organization_name/registry-modules/:registry_name/:namespace/:name/:provider`


### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization the module belongs to.
`:namespace`         | The namespace of the module. For private modules this is the name of the organization that owns the module.
`:name`              | The module name.
`:provider`          | The module provider.
`:registry-name`     | Either `public` or `private`.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-modules"`) | The request was successful
[403][] | [JSON API error object][]                          | Forbidden - public module curation disabled
[404][] | [JSON API error object][]                          | Module not found or user unauthorized to perform action

### Sample Request (private module)

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules/private/my-organization/my-module/aws
```

### Sample Request (public module)

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/registry-modules/public/terraform-aws-modules/vpc/aws
```

### Sample Response (private module)

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
      "provider": "aws",
      "namespace": "my-organization",
      "registry-name": "private",
      "status": "setup_complete",
      "version-statuses": [
        {
          "version": "1.0.0",
          "status": "ok"
        }
      ],
      "created-at": "2020-07-09T19:36:56.288Z",
      "updated-at": "2020-07-09T20:16:20.538Z",
      "vcs-repo": {
        "branch": "",
        "ingress-submodules": true,
        "identifier": "lafentres/terraform-aws-my-module",
        "display-identifier": "lafentres/terraform-aws-my-module",
        "oauth-token-id": "ot-hmAyP66qk2AMVdbJ",
        "webhook-url": "https://app.terraform.io/webhooks/vcs/a12b3456..."
      },
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
      "self": "/api/v2/organizations/my-organization/registry-modules/private/my-organization/my-module/aws"
    }
  }
}
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

<div class="alert alert-warning" role="alert">
  **Deprecation warning**: the following endpoints:

  * `POST /registry-modules/actions/delete/:organization_name/:name/:provider/:version`
  * `POST /registry-modules/actions/delete/:organization_name/:name/:provider`
  * `POST /registry-modules/actions/delete/:organization_name/:name`

  are replaced by the below endpoints and will be removed from future versions of the API!
</div>

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
  https://app.terraform.io/api/v2/organization/my-organization/registry-modules/public/terraform-aws-modules/vpc/aws
```

### Sample Request (private module)

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organization/my-organization/registry-modules/private/my-organization/my-module/aws/2.0.0
```
