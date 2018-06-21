---
page_title: "API Docs - Terraform Enterprise"
layout: "enterprise2"
sidebar_current: "docs-enterprise2-api"
---


# Terraform Enterprise API Documentation

-> **Note**: These API endpoints are in beta and are subject to change.

Terraform Enterprise (TFE) provides an API for a subset of its features. If you have any questions or want to request new API features, please email support@hashicorp.com.

See the navigation sidebar for the list of available endpoints.

## Authentication

All requests must be authenticated with a bearer token. Use the HTTP header `Authorization` with the value `Bearer <token>`. If the token is absent or invalid, TFE responds with [HTTP status 401][401] and a [JSON API error object][]. The 401 status code is reserved for problems with the authentication token; forbidden requests with a valid token result in a 404.

[JSON API error object]: http://jsonapi.org/format/#error-objects
[401]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401

There are three kinds of token available:

- [User tokens](../users-teams-organizations/users.html#api-tokens) — each TFE user can have any number of API tokens, which can make requests on their behalf.
- [Team tokens](../users-teams-organizations/service-accounts.html#team-service-accounts) — each team has an associated service account, which can have one API token at a time. This is intended for performing plans and applies via a CI/CD pipeline.
- [Organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts) — each organization also has a service account, which can have one API token at a time. This is intended for automating the management of teams, team membership, and workspaces. The organization token cannot perform plans and applies.

## Response Codes

This API returns standard HTTP response codes.

We return 404 Not Found codes for resources that a user doesn't have access to, as well as for resources that don't exist. This is to avoid telling a potential attacker that a given resource exists.

## Versioning

The API documented in these pages is the second version of TFE's API, and resides under the `/v2` prefix. For documentation of the `/v1` endpoints, see [the Terraform Enterprise (legacy) API docs.](/docs/enterprise-legacy/api/index.html)

Future APIs will increment this version, leaving the `/v1` API intact, though in the future we might deprecate certain features. In that case, we'll provide ample notice to migrate to the new API.

## Paths

All V2 API endpoints use `/api/v2` as a prefix unless otherwise specified.

For example, if the API endpoint documentation defines the path `/runs` then the full path is `/api/v2/runs`.

## JSON API Formatting

The TFE endpoints use the [JSON API specification](http://jsonapi.org/), which specifies key aspects of the API. Most notably:

- [HTTP error codes](http://jsonapi.org/examples/#error-objects-error-codes)
- [Error objects](http://jsonapi.org/examples/#error-objects-basics)
- [Document structure][document]
- [HTTP request/response headers](http://jsonapi.org/format/#content-negotiation)

[document]: http://jsonapi.org/format/#document-structure

### JSON API Documents

Since our API endpoints use the JSON API spec, most of them return [JSON API documents][document].

Endpoints that use the POST method also require a JSON API document as the request payload. A request object usually looks something like this:

```json
{
  "data": {
    "type":"vars",
    "attributes": {
      "key":"some_key",
      "value":"some_value",
      "category":"terraform",
      "hcl":false,
      "sensitive":false
    },
    "relationships": {
      "workspace": {
        "data": {
          "id":"ws-4j8p6jX1w33MiDC7",
          "type":"workspaces"
        }
      }
    }
  }
}
```

These objects always include a top-level `data` property, which:

- Must have a `type` property to indicate what type of API object you're interacting with.
- Often has an `attributes` property to specify attributes of the object you're creating or modifying.
- Sometimes has a `relationships` property to specify other objects that are linked to what you're working with.

In the documentation for each API method, we use dot notation to explain the structure of nested objects in the request. For example, the properties of the request object above are listed as follows:

Key path                                 | Type   | Default | Description
-----------------------------------------|--------|---------|------------
`data.type`                              | string |         | Must be `"vars"`.
`data.attributes.key`                    | string |         | The name of the variable.
`data.attributes.value`                  | string |         | The value of the variable.
`data.attributes.category`               | string |         | Whether this is a Terraform or environment variable. Valid values are `"terraform"` or `"env"`.
`data.attributes.hcl`                    | bool   | `false` | Whether to evaluate the value of the variable as a string of HCL code. Has no effect for environment variables.
`data.attributes.sensitive`              | bool   | `false` | Whether the value is sensitive. If true then the variable is written once and not visible thereafter.
`data.relationships.workspace.data.type` | string |         | Must be `"workspaces"`.
`data.relationships.workspace.data.id`   | string |         | The ID of the workspace that owns the variable.

We also always include a sample payload object, to show the document structure more visually.

### Query Parameters

Although most of our API endpoints use the POST method and receive their parameters as a JSON object in the request payload, some of them use the GET method. These GET endpoints sometimes require URL query parameters, in the standard `...path?key1=value1&key2=value2` format.

Since these parameters were originally designed as part of a JSON object, they sometimes have characters that must be [percent-encoded](https://en.wikipedia.org/wiki/Percent-encoding) in a query parameter. For example, `[` becomes `%5B` and `]` becomes `%5D`.

For more about URI structure and query strings, see [the specification (RFC 3986)](https://tools.ietf.org/html/rfc3986) or [the Wikipedia page on URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier).

### Pagination

Most of the endpoints that return lists of objects support pagination. A client may pass the following query parameters to control pagination on supported endpoints:

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 items per page.

Additional data is returned in the `links` and `meta` top level attributes of the response.

```json
{
  "data": [...],
  "links": {
    "self": "https://app.terraform.io/api/v2/organizations/hashicorp/workspaces?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/organizations/hashicorp/workspaces?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": "https://app.terraform.io/api/v2/organizations/hashicorp/workspaces?page%5Bnumber%5D=2&page%5Bsize%5D=20",
    "last": "https://app.terraform.io/api/v2/organizations/hashicorp/workspaces?page%5Bnumber%5D=2&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": 2,
      "total-pages": 2,
      "total-count": 21
    }
  }
}
```

### Inclusion of Related Resources

Some of the API's GET endpoints can return additional information about nested resources by adding an `include` query parameter, whose value is a comma-separated list of resource types.

The related resource options are listed in each endpoint's documentation where available.

The related resources will appear in an `included` section of the response.

Example:

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/teams/team-n8UQ6wfhyym25sMe?include=users
```

```json
{
  "data": {
    "id": "team-n8UQ6wfhyym25sMe",
    "type": "teams",
    "attributes": {
      "name": "owners",
      "users-count": 1
      ...
    },
    "relationships": {
      "users": {
        "data": [
          {
              "id": "hashibot",
              "type": "users"
          }
        ]
      } ...
    }
    ...
  },
  "included": [
    {
      "id": "hashibot",
      "type": "users",
      "attributes": {
        "username": "hashibot"
        ...
      } ...
    }
  ]
}
```

## Rate Limiting

You can make up to 30 requests per second to the API as an authenticated or unauthenticated request. If you reach the rate limit then your access will be throttled and an error response will be returned.

Authenticated requests are allocated to the user associated with the authentication token. This means that a user with multiple tokens will still be limited to 30 requests per second, additional tokens will not allow you to increase the requests per second permitted.

Unauthenticated requests are associated with the requesting IP address.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[429][] | [JSON API error object][]                    | Rate limit has been reached.

[429]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
[JSON API error object]: http://jsonapi.org/format/#error-objects

```json
{
  "errors": [
    {
      "detail": "You have exceeded the API's rate limit of 30 requests per second.",
      "status": 429,
      "title": "Too many requests"
    }
  ]
}
```

## Community client libraries and tools

The community client libraries and tools listed below have been built by the community of Terraform Enterprise users and vendors. These client libraries and tools are not tested nor officially maintained by HashiCorp, and are listed here in order to help users find them easily.

If you have built a client library and would like to add it to this community list, please [contribute](https://github.com/hashicorp/terraform-website#contributions-welcome) to [this page](https://github.com/hashicorp/terraform-website/blob/master/content/source/docs/enterprise/api/index.html.md).

- [tf_api_gateway](https://github.com/PlethoraOfHate/tf_api_gateway): Python API library and console app
- [terraform-enterprise-client](https://github.com/skierkowski/terraform-enterprise-client): Ruby API library and console app
