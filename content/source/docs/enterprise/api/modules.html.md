---
layout: enterprise2
page_title: "Modules - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-modules"
---

# Registry Modules API

-> **Note**: These API endpoints are in beta and are subject to change.

## Listing and reading modules, providers and versions

The Terraform Enterprise Module Registry implemenets the [Registry standard API](../../registry/api.html) for consuming the modules. Refer to the [Module Registry HTTP API](../../registry/api.html) to perform the following:

- Browse available modules
- Search modules by keyword
- List available versions for a specific module
- Download source code for a specific module version
- List latest version of a module for all providers
- Get the latest version for a specific module provider
- Get a specific module
- Download the latest version of a module

The TFE Module Registry endpoints differs from the Module Registry endpoints in the following ways:

- The `:namespace` parameter should be replaced with the organization name.
- The module registry discovery endpoints have the path prefix provided in the [discovery document](../../registry/api.html#service-discovery) which is currently `/api/registry/v1`.
- [Authentication](./index.html#authentication) is handled the same as all other TFE endpoints.

### Sample Request

List available versions for the `consul` module for the `aws` provider on the module registry published from the Github organization `my-gh-repo-org`:

```shell
$ curl https://registry.terraform.io/v1/modules/my-gh-repo-org/consul/aws/versions
```

The same request for the same module and provider on the TFE module registry for `my-tfe-org` TFE organization:

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/registry/v1/modules/my-tfe-org/consul/aws/versions
```


## Publish a Module from a VCS

This endpoint can be used to publish a new module to the registry. The publishing process will fetch all tags in the source repository that look like SemVer versions with optional 'v' prefix. For each version, the tag is cloned and the config parsed to populate module details (input and output variables, readme, submodules, etc.). The [Module Registry Requirements](../../registry/modules/publish.html#requirements) define additional requirements on naming, standard module structure and tags for releases.

| Method | Path           |
| :----- | :------------- |
| POST | /registry-modules |

### Parameters

- `vcs-repo.identifier` (`string: <required>`) - Specifies the repository from which to ingress the configuration. For most VCS providers, the format is `<ORGANIZATION>/<REPO>`; for Bitbucket Server, the format is `<PROJECT_KEY>/<REPO>`.
- `vcs-repo.oauth-token-id` (`string: <required>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "vcs-repo": {
        "identifier":"SKI/terraform-aws-instance",
        "oauth-token-id":"ot-hmAyP66qk2AMVdbJ"
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
    "id": "mod-1JqHG3j71bwoukuX",
    "type": "registry-modules",
    "attributes": {
      "name": "instance",
      "provider": "aws",
      "status": "pending",
      "version-statuses": [],
      "created-at": "2017-11-30T00:00:52.386Z",
      "updated-at": "2017-11-30T00:00:52.386Z",
      "permissions": {
        "can-delete": true,
        "can-resync": true,
        "can-retry": true
      }
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "org-QpXoEnULx3r2r1CA",
          "type": "organizations"
        }
      }
    },
    "links": {
      "self": "/api/v2/registry-modules/show/skierkowski-v2/instance/aws"
    }
  }
}
```

## Create a Module

Creates a new registry module. After creating a module, a version must be created and uploaded in order to be usable.

| Method | Path |
| :-- | :-- |
| POST | /organizations/:organization_name/registry-modules |

### Parameters

- `name` (`string: <required>`) - The name of this provider. Maybe contain alphanumeric characters and dashes.
- `provider` (`string: <required>`) - Specifies the Terraform provider that this module primarily is used for. For example, `aws` is a provider.


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
    "attributes": {
      "created-at": "2018-09-24T20:45:13.614Z",
      "name": "my-module",
      "permissions": {
        "can-delete": true,
        "can-resync": true,
        "can-retry": true
      },
      "provider": "aws",
      "status": "pending",
      "updated-at": "2018-09-24T20:45:13.614Z",
      "version-statuses": []
    },
    "id": "mod-kno8GMqyUFAdbExr",
    "links": {
      "self": "/api/v2/registry-modules/show/my-organization/my-module/aws"
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "org-qScjTapEAMHut5ky",
          "type": "organizations"
        }
      }
    },
    "type": "registry-modules"
  }
}
```

## Create a Module Version

Creates a new registry module version. After creating the version, the module should be uploaded to the returned upload link.

| Method | Path |
| :-- | :-- |
| POST | /registry-modules/:organization_name/:name/:provider/:versions |

### Parameters

- `version` (`string: <required>`) - A valid semver version string.


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

| Method | Path |
| :-- | :-- |
| PUT | https://archivist.terraform.io/v1/object/:object_id |

**The URL is provided in the `upload` links attribute in the `registry-module-versions` resource.**

### Expected Archive Format

Terraform Enterprise expects the module version uploaded to be a tarball with the module in the root (not in a subdirectory).

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

This can be package in an archive format by running `tar zcvf module.tar.gz *` in the module's directory.

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

After the registry module version is successfully parsed by TFE, its status will become `"ok"`.

## Delete a Module

These endpoints can delete a single version for a provider, a single provider (and all its versions) for a module, or a whole module. If the requested deletion would leave a provider with no versions or a module with no providers, the empty items will be automatically deleted as well.

| Method | Path           |
| :----- | :------------- |
| POST | /registry-modules/actions/delete/:organization/:module/:provider/:version |
| POST | /registry-modules/actions/delete/:organization/:module/:provider |
| POST | /registry-modules/actions/delete/:organization/:module |

### Parameters

- `:organization` (`string: <required>`) - Specifies the organization for the module registry.
- `:module` (`string: <required>`) - Specifies the module name from which to delete all versions from all providers.
- `:provider` (`string: <optional>`) - Specifies the provider for the given module from which to delete all versions.
- `:version` (`string: <optional>`) - Specifies the version for the given module and provider to be deleted.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/registry-modules/actions/delete/skierkowski-v2/instance
```
