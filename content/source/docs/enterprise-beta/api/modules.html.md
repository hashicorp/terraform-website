---
layout: enterprise2
page_title: "Modules - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-modules"
---

# Registry Modules API

-> **Note**: These API endpoints are in beta and are subject to change.

## List modules

Lists all the modules for a given organization. **Note** that all other endpoints have the subpath `/api/v2`, this endpoint does not use that subpath.

| Method | Path           |
| :----- | :------------- |
| POST | /api/registry/v1/modules/:organization |


### Parameters
- `:organization` (`string: <required>`) - Specifies the organization for which to list the modules

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  https://atlas.hashicorp.com/api/registry/v1/modules/skierkowski-v2
```

### Sample Response

```json
{
  "meta": {
    "limit": 15,
    "current_offset": 0
  },
  "modules": [
    {
      "id": "skierkowski-v2/instance/aws/0.0.08",
      "owner": "",
      "namespace": "skierkowski-v2",
      "name": "instance",
      "version": "0.0.08",
      "provider": "aws",
      "description": "",
      "source": "https://bitbucket-server.hashicorp.engineering/projects/SKI/repos/terraform-aws-instance/browse",
      "published_at": "2017-11-30T07:00:40.664036Z",
      "downloads": 0,
      "verified": false
    },
    {
      "id": "skierkowski-v2/vpc/aws/0.0.1",
      "owner": "",
      "namespace": "skierkowski-v2",
      "name": "vpc",
      "version": "0.0.1",
      "provider": "aws",
      "description": "",
      "source": "https://bitbucket-server.hashicorp.engineering/projects/SKI/repos/terraform-aws-vpc/browse",
      "published_at": "2017-11-30T00:53:06.966753Z",
      "downloads": 0,
      "verified": false
    },
    {
      "id": "skierkowski-v2/subnet/aws/0.0.1",
      "owner": "",
      "namespace": "skierkowski-v2",
      "name": "subnet",
      "version": "0.0.1",
      "provider": "aws",
      "description": "",
      "source": "https://bitbucket-server.hashicorp.engineering/projects/SKI/repos/terraform-aws-subnet/browse",
      "published_at": "2017-11-30T17:38:01.600527Z",
      "downloads": 0,
      "verified": false
    }
  ]
}
```

## Publish a Module

This endpoint can be used to publish a new module to the registry. The publishing process will ingress the configuration from the repository and parse the various fields (e.g. input variables, output variables, readme) from the repository.

| Method | Path           |
| :----- | :------------- |
| POST | /registry-modules |

### Parameters

- `linkable-repo-id` (`string: <required>`) - Specifies the repository to be used to ingress the configuration, this is in the format `<PROJECT_KEY>/<REPO>`
- `o-auth-token-id` (`string: <requires>`) - Specifies the VCS Connection (OAuth Conection + Token) to use as identified. This ID can be obtained from the [o-auth-tokens](./o-auth-tokens.html) endpoint.


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "linkable-repo-id":"SKI/terraform-aws-instance",
      "o-auth-token-id":"1"
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

