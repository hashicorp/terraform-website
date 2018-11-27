---
layout: enterprise2
page_title: "OAuth Clients - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-oauth-clients"
---

# OAuth Clients API

-> **Note:** These API endpoints are in beta and are subject to change.

An OAuth Client represents the connection between an organization and a VCS provider.

## Create an OAuth Client

`POST /organizations/:organization_name/oauth-clients`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization that will be connected to the VCS provider. The organization must already exist in the system, and the user must have permissions to initiate the connection.

This endpoint allows you to create a VCS connection between an organization and a VCS provider (GitHub, Bitbucket, or GitLab) for use when creating or setting up workspaces. By using this API endpoint, you can provide a pre-generated OAuth token string instead of going through the process of creating a GitHub/GitLab OAuth Application or Bitbucket App Link. To learn how to generate one of these token strings for your VCS provider, you can read the following documentation:

* [GitHub and GitHub Enterprise](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
* [Bitbucket Cloud](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html)
* [GitLab, GitLab Community Edition, and GitLab Enterprise Edition](https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html#creating-a-personal-access-token)

~> **Note:** This endpoint does not currently support creation of a Bitbucket Server OAuth Client.

Result  | Status and response
--------|------------------------
Success | HTTP 201 and a JSON API document (`type: "oauth-clients"`).
Failure | HTTP 4XX and a JSON API list of error messages.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                             | Type   | Default | Description
-------------------------------------|--------|---------|------------
`data.type`                          | string |         | Must be `"oauth-clients"`.
`data.attributes.service-provider`   | string |         | The VCS provider being connected with. Valid options are `"github"`, `"github_enterprise"`, `"bitbucket_hosted"`, `"gitlab_hosted"`, `"gitlab_community_edition"`, or `"gitlab_enterprise_edition"`.
`data.attributes.http-url`           | string |         | The homepage of your VCS provider (e.g. `"https://github.com"` or `"https://ghe.example.com"`)
`data.attributes.api-url`            | string |         | The base URL of your VCS provider's API (e.g. `https://api.github.com` or `"https://ghe.example.com/api/v3"`)
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
          "related": "/api/v2/oauth-tokens/oc-XKFwG6ggfA9n7t1K"
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

Result  | Status and response
--------|------------------------
Success | HTTP 200 and a JSON API document (`type: "oauth-clients"`).
Failure | HTTP 4XX and a JSON API list of error messages.

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                             | Type   | Default | Description
-------------------------------------|--------|---------|------------
`data.type`                          | string |         | Must be `"oauth-clients"`.
`data.attributes.service-provider`   | string |         | The VCS provider being connected with. Valid options are `"github"`, `"github_enterprise"`, `"bitbucket_hosted"`, `"gitlab_hosted"`, `"gitlab_community_edition"`, or `"gitlab_enterprise_edition"`.
`data.attributes.http-url`           | string |         | The homepage of your VCS provider (e.g. `"https://github.com"` or `"https://ghe.example.com"`)
`data.attributes.api-url`            | string |         | The base URL of your VCS provider's API (e.g. `https://api.github.com` or `"https://ghe.example.com/api/v3"`)
`data.attributes.key`                | string |         | The OAuth client key.
`data.attributes.secret`             | string |         | The OAuth client secret.

### Sample Payload

```json
{
  "data": {
    "id": "oc-XKFwG6ggfA9n7t1K",
    "type": "oauth-clients",
    "attributes": {
      "service-provider": "github",
      "http-url": "https://github.com",
      "api-url": "https://api.github.com",
      "key": "key"
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
          "related": "/api/v2/oauth-tokens/oc-XKFwG6ggfA9n7t1K"
        }
      }
    }
  }
}
```

## Destroy an OAuth Client

`DELETE /organizations/:organization_name/oauth-clients/:id`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization that owns the OAuth connection.
`:id`                | The ID of the OAuth client to destroy.

This endpoint allows you to remove an existing connection between an organization and a VCS provider (GitHub, Bitbucket, or GitLab).

**Note:** Removing the OAuth Client will unlink workspaces that use this connection from their repositories, and these workspaces will need to be manually linked to another repository.

Status  | Response                                        | Reason
--------|---------------------------|----------
[204][] | Empty response            | The OAuth Client was successfully destroyed
[404][] | [JSON API error object][] | Organization or OAuth Client not found, or user unauthorized to perform action

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/oauth-clients/oc-XKFwG6ggfA9n7t1K
```
