---
layout: "cloud"
page_title: "OAuth Clients - API Docs - Terraform Cloud"
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

# OAuth Clients API

An OAuth Client represents the connection between an organization and a VCS provider.

## List OAuth Clients

`GET /organizations/:organization_name/oauth-clients`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization.

This endpoint allows you to list VCS connections between an organization and a VCS provider (GitHub, Bitbucket, or GitLab) for use when creating or setting up workspaces.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "oauth-clients"`) | Success
[404][] | [JSON API error object][]                    | Organization not found

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations/my-organization/oauth-clients
```

### Sample Response

```json
{
  "data": [
    {
      "id": "oc-XKFwG6ggfA9n7t1K",
      "type": "oauth-clients",
      "attributes": {
        "created-at": "2018-04-16T20:42:53.771Z",
        "callback-url": "https://app.terraform.io/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a/callback",
        "connect-path": "/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a?organization_id=1",
        "service-provider": "github",
        "service-provider-display-name": "GitHub",
        "name": null,
        "http-url": "https://github.com",
        "api-url": "https://api.github.com",
        "key": null,
        "rsa-public-key": null
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          },
          "links": {
            "related": "/api/v2/organizations/my-organization"
          }
        },
        "oauth-tokens": {
          "data": [],
          "links": {
            "related": "/api/v2/oauth-tokens/ot-KaeqH4cy72VPXFQT"
          }
        }
      }
    }
  ]
}
```

## Show an OAuth Client

`GET /oauth-clients/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the OAuth Client to show

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "oauth-clients"`) | Success
[404][] | [JSON API error object][]                    | OAuth Client not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/oauth-clients/oc-XKFwG6ggfA9n7t1K
```

### Sample Response

```json
{
  "data": {
    "id": "oc-XKFwG6ggfA9n7t1K",
    "type": "oauth-clients",
    "attributes": {
      "created-at": "2018-04-16T20:42:53.771Z",
      "callback-url": "https://app.terraform.io/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a/callback",
      "connect-path": "/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a?organization_id=1",
      "service-provider": "github",
      "service-provider-display-name": "GitHub",
      "name": null,
      "http-url": "https://github.com",
      "api-url": "https://api.github.com",
      "key": null,
      "rsa-public-key": null
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        },
        "links": {
          "related": "/api/v2/organizations/my-organization"
        }
      },
      "oauth-tokens": {
        "data": [],
        "links": {
          "related": "/api/v2/oauth-tokens/ot-KaeqH4cy72VPXFQT"
        }
      }
    }
  }
}
```

## Create an OAuth Client

`POST /organizations/:organization_name/oauth-clients`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization that will be connected to the VCS provider. The organization must already exist in the system, and the user must have permissions to initiate the connection.

This endpoint allows you to create a VCS connection between an organization and a VCS provider (GitHub or GitLab) for use when creating or setting up workspaces. By using this API endpoint, you can provide a pre-generated OAuth token string instead of going through the process of creating a GitHub or GitLab OAuth Application. To learn how to generate one of these token strings for your VCS provider, you can read the following documentation:

* [GitHub and GitHub Enterprise](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
* [GitLab, GitLab Community Edition, and GitLab Enterprise Edition](https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html#creating-a-personal-access-token)

~> **Note:** This endpoint does not currently support creation of a Bitbucket Cloud or Bitbucket Server OAuth Client.

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "oauth-clients"`) | OAuth Client successfully created
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                             | Type   | Default | Description
-------------------------------------|--------|---------|------------
`data.type`                          | string |         | Must be `"oauth-clients"`.
`data.attributes.service-provider`   | string |         | The VCS provider being connected with. Valid options are `"github"`, `"github_enterprise"`, `"bitbucket_hosted"`, `"gitlab_hosted"`, `"gitlab_community_edition"`, `"gitlab_enterprise_edition"`, or `"ado_services"`.
`data.attributes.name`               | string | `null`  | An optional display name for the OAuth Client. If left `null`, the UI will default to the display name of the VCS provider.
`data.attributes.http-url`           | string |         | The homepage of your VCS provider (e.g. `"https://github.com"` or `"https://ghe.example.com"`)
`data.attributes.api-url`            | string |         | The base URL of your VCS provider's API (e.g. `"https://api.github.com"` or `"https://ghe.example.com/api/v3"`)
`data.attributes.oauth-token-string` | string |         | The token string you were given by your VCS provider

### Sample Payload

```json
{
  "data": {
    "type": "oauth-clients",
    "attributes": {
      "service-provider": "github",
      "http-url": "https://github.com",
      "api-url": "https://api.github.com",
      "oauth-token-string": "4306823352f0009d0ed81f1b654ac17a"
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
  https://app.terraform.io/api/v2/organizations/my-organization/oauth-clients
```

### Sample Response

```json
{
  "data": {
    "id": "oc-XKFwG6ggfA9n7t1K",
    "type": "oauth-clients",
    "attributes": {
      "created-at": "2018-04-16T20:42:53.771Z",
      "callback-url": "https://app.terraform.io/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a/callback",
      "connect-path": "/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a?organization_id=1",
      "service-provider": "github",
      "service-provider-display-name": "GitHub",
      "name": null,
      "http-url": "https://github.com",
      "api-url": "https://api.github.com",
      "key": null,
      "rsa-public-key": null
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        },
        "links": {
          "related": "/api/v2/organizations/my-organization"
        }
      },
      "oauth-tokens": {
        "data": [],
        "links": {
          "related": "/api/v2/oauth-tokens/ot-KaeqH4cy72VPXFQT"
        }
      }
    }
  }
}
```

## Update an OAuth Client

`PATCH /oauth-clients/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the OAuth Client to update.

Use caution when changing attributes with this endpoint; editing an OAuth client that workspaces are currently using can have unexpected effects.

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "oauth-clients"`) | The request was successful
[404][] | [JSON API error object][]               | OAuth Client not found or user unauthorized to perform action
[422][] | [JSON API error object][]               | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                             | Type   | Default | Description
-------------------------------------|--------|---------|------------
`data.type`                          | string |         | Must be `"oauth-clients"`.
`data.attributes.name`               | string | (previous value)  | An optional display name for the OAuth Client. If set to `null`, the UI will default to the display name of the VCS provider.
`data.attributes.key`                | string | (previous value) | The OAuth client key.
`data.attributes.secret`             | string | (previous value) | The OAuth client secret.

### Sample Payload

```json
{
  "data": {
    "id": "oc-XKFwG6ggfA9n7t1K",
    "type": "oauth-clients",
    "attributes": {
      "key": "key",
      "secret": "secret"
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
  https://app.terraform.io/api/v2/oauth-clients/oc-XKFwG6ggfA9n7t1K
```

### Sample Response

```json
{
  "data": {
    "id": "oc-XKFwG6ggfA9n7t1K",
    "type": "oauth-clients",
    "attributes": {
      "created-at": "2018-04-16T20:42:53.771Z",
      "callback-url": "https://app.terraform.io/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a/callback",
      "connect-path": "/auth/35936d44-842c-4ddd-b4d4-7c741383dc3a?organization_id=1",
      "service-provider": "github",
      "service-provider-display-name": "GitHub",
      "name": null,
      "http-url": "https://github.com",
      "api-url": "https://api.github.com",
      "key": null,
      "rsa-public-key": null
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "my-organization",
          "type": "organizations"
        },
        "links": {
          "related": "/api/v2/organizations/my-organization"
        }
      },
      "oauth-tokens": {
        "data": [],
        "links": {
          "related": "/api/v2/oauth-tokens/ot-KaeqH4cy72VPXFQT"
        }
      }
    }
  }
}
```

## Destroy an OAuth Client

`DELETE /oauth-clients/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the OAuth Client to destroy

This endpoint allows you to remove an existing connection between an organization and a VCS provider (GitHub, Bitbucket, or GitLab).

**Note:** Removing the OAuth Client will unlink workspaces that use this connection from their repositories, and these workspaces will need to be manually linked to another repository.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty response            | The OAuth Client was successfully destroyed
[404][] | [JSON API error object][] | Organization or OAuth Client not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/oauth-clients/oc-XKFwG6ggfA9n7t1K
```

