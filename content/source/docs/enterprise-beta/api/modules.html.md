---
layout: enterprise2
page_title: "Modules - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-modules"
---

# Registry Modules API

-> **Note**: These API endpoints are in beta and are subject to change.

## Listing and reading modules, providers and versions

The Terraform Enterprise Module Registry implemenets the [Registry standard API](../../registry/api.html) for consuming the modules. Refer to the [Module Registry HTTP API](../../registry/api.html) to perform the following:

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  https://atlas.hashicorp.com/api/registry/v1/modules/my-tfe-org/consul/aws/versions
```


## Publish a Module

This endpoint can be used to publish a new module to the registry. The publishing process will fetch all tags in the source repository that look like SemVer versions with optional 'v' prefix. For each version, the tag is cloned and the config parsed to populate module details (input and output variables, readme, submodules, etc.). The [Module Registry Requirements](../../registry/modules/publish.html#requirements) define additional requirements on naming, standard module structure and tags for releases.

| Method | Path           |
| :----- | :------------- |
| POST | /registry-modules |

### Parameters

- `linkable-repo-id` (`string: <required>`) - Specifies the repository to be used to ingress the configuration. For Bitbucket server, the format is `<PROJECT_KEY>/<REPO>`. Bitbucket Server is currently the only supported VCS service.
- `oauth-token-id` (`string: <requires>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [oauth-tokens](./oauth-tokens.html) endpoint.


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "linkable-repo-id":"SKI/terraform-aws-instance",
      "oauth-token-id":"1"
    },
    "type":"registry-modules"
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
  https://atlas.hashicorp.com/api/v2/registry-modules
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

## Delete a module

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://atlas.hashicorp.com/api/v2/registry-modules/actions/delete/skierkowski-v2/instance
```

