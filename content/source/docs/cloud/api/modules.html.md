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
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Registry Modules API

-> **Note**: These API endpoints are in beta and are subject to change.

## Listing and reading modules, providers and versions

The Terraform Cloud Module Registry implements the [Registry standard API](../../registry/api.html) for consuming the modules. Refer to the [Module Registry HTTP API](../../registry/api.html) to perform the following:

- Browse available modules
- Search modules by keyword
- List available versions for a specific module
- Download source code for a specific module version
- List latest version of a module for all providers
- Get the latest version for a specific module provider
- Get a specific module
- Download the latest version of a module

The Terraform Cloud Module Registry endpoints differs from the Module Registry endpoints in the following ways:

- The `:namespace` parameter should be replaced with the organization name.
- The module registry discovery endpoints have the path prefix provided in the [discovery document](../../registry/api.html#service-discovery) which is currently `/api/registry/v1`.
- [Authentication](./index.html#authentication) is handled the same as all other Terraform Cloud endpoints.

### Sample Request

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

## Publish a Module from a VCS

`POST /registry-modules`

Publishes a new registry module from a VCS repository, with module versions managed automatically by the repository's tags. The publishing process will fetch all tags in the source repository that look like [SemVer](https://semver.org/) versions with optional 'v' prefix. For each version, the tag is cloned and the config parsed to populate module details (input and output variables, readme, submodules, etc.). The [Module Registry Requirements](../../registry/modules/publish.html#requirements) define additional requirements on naming, standard module structure and tags for releases.

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
  https://app.terraform.io/api/v2/registry-modules
```

### Sample Response

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
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
      "self": "/api/v2/registry-modules/show/my-organization/my-module/aws"
    }
  }
}
```

## Create a Module

 `POST /organizations/:organization_name/registry-modules`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a module in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Creates a new registry module without a backing VCS repository. After creating a module, a version must be created and uploaded in order to be usable. Modules created this way do not automatically update with new versions; instead, you must explicitly create and upload each new version with the [Create a Module Version](#create-a-module-version) endpoint.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "registry-modules"`) | Successfully published module
[422][] | [JSON API error object][]                          | Malformed request body (missing attributes, wrong types, etc.)
[404][] | [JSON API error object][]                          | User not authorized



### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                   | Type   | Default | Description
---------------------------|--------|---------|------------
`data.type`                | string |         | Must be `"registry-modules"`.
`data.attributes.name`     | string |         | The name of this module. May contain alphanumeric characters and dashes.
`data.attributes.provider` | string |         | Specifies the Terraform provider that this module is used for.

For example, `aws` is a provider.

### Sample Payload

```json
{
  "data": {
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
      "provider": "aws"
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

### Sample Response

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
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
      "self": "/api/v2/registry-modules/show/my-organization/my-module/aws"
    }
  }
}
```

## Create a Module Version

`POST /registry-modules/:organization_name/:name/:provider/versions`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create a module in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.
`:name`              | The name of the module for which the version is being created.
`:provider`          | The name of the provider for which the version is being created.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Creates a new registry module version. This endpoint only applies to modules without a VCS repository; VCS-linked modules automatically create new versions for new tags. After creating the version, the module should be uploaded to the returned upload link.

Status  | Response                                                   | Reason
--------|------------------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "registry-module-versions"`) | Successfully published module version
[422][] | [JSON API error object][]                                  | Malformed request body (missing attributes, wrong types, etc.)
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
  https://app.terraform.io/api/v2/registry-modules/my-organization/my-module/aws/versions
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

## Upload a Module Version

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

## Show a Module

`GET /registry-modules/show/:organization_name/:name/:provider`

### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization the  module belongs to.
`:name`              | The module name.
`:provider`          | The module provider.

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "registry-modules"`) | The request was successful
[404][] | [JSON API error object][]                          | Module not found or user unauthorized to perform action

### Sample Request

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/registry-modules/show/my-organization/my-module/aws
```

### Sample Response

```json
{
  "data": {
    "id": "mod-fZn7uHu99ZCpAKZJ",
    "type": "registry-modules",
    "attributes": {
      "name": "my-module",
      "provider": "aws",
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
      "self": "/api/v2/registry-modules/show/my-organization/my-module/aws"
    }
  }
}
```

## Delete a Module

* `POST /registry-modules/actions/delete/:organization_name/:name/:provider/:version`
* `POST /registry-modules/actions/delete/:organization_name/:name/:provider`
* `POST /registry-modules/actions/delete/:organization_name/:name`

### Parameters

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to delete a module from. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.
`:name`              | The module name that the deletion will affect.
`:provider`          | If specified, the provider for the module that the deletion will affect.
`:version`           | If specified, the version for the module and provider that will be deleted.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

When removing modules, there are three versions of the endpoint, depending on how many parameters are specified.

* If all parameters (module, provider, and version) are specified, the specified version for the given provider of the module is deleted.
* If module and provider are specified, the specified provider for the given module is deleted along with all its versions.
* If only module is specified, the entire module is deleted.

If a version deletion would leave a provider with no versions, the provider will be deleted. If a provider deletion would leave a module with no providers, the module will be deleted.

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[204][] | Nothing                                              | Success
[404][] | [JSON API error object][]                            | Module, provider, or version not found or user not authorized


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/registry-modules/actions/delete/my-organization/my-module
```
