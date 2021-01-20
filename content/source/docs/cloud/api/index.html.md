---
page_title: "API Docs - Terraform Cloud and Terraform Enterprise"
layout: "cloud"
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

# Terraform Cloud API Documentation

Terraform Cloud provides an API for a subset of its features. If you have any questions or want to request new API features, please email support@hashicorp.com.

See the navigation sidebar for the list of available endpoints.

-> **Note:** Before planning an API integration, consider whether [the `tfe` Terraform provider](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs) meets your needs. It can't create or approve runs in response to arbitrary events, but it's a useful tool for managing your organizations, teams, and workspaces as code.

HashiCorp provides a [stability policy](./stability-policy.html) for the Terraform Cloud API, ensuring backwards compatibility for stable endpoints.

## Authentication

All requests must be authenticated with a bearer token. Use the HTTP header `Authorization` with the value `Bearer <token>`. If the token is absent or invalid, Terraform Cloud responds with [HTTP status 401][401] and a [JSON API error object][]. The 401 status code is reserved for problems with the authentication token; forbidden requests with a valid token result in a 404.

There are three kinds of token available:

- [User tokens](../users-teams-organizations/users.html#api-tokens) — each Terraform Cloud user can have any number of API tokens, which can make requests on their behalf.
- [Team tokens](../users-teams-organizations/api-tokens.html#team-api-tokens) — each team can have one API token at a time. This is intended for performing plans and applies via a CI/CD pipeline.
- [Organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens) — each organization can have one API token at a time. This is intended for automating the management of teams, team membership, and workspaces. The organization token cannot perform plans and applies.

### Blob Storage Authentication

Terraform Cloud relies on a HashiCorp-developed blob storage service for storing statefiles and multiple other pieces of customer data, all of which are documented on our [data security page](../architectural-details/data-security.html).

Unlike the Terraform Cloud API, this service does not require that a bearer token be submitted with each request. Instead, each URL includes a securely generated secret and is only valid for 25 hours.

For example, the [state versions api](./state-versions.html) returns a field named `hosted-state-download`, which is a URL of this form:
`https://archivist.terraform.io/v1/object/<secret value>`

This is a broadly accepted pattern for secure access. It is important to treat these URLs themselves as secrets. They should not be logged, nor shared with untrusted parties.

## Feature Entitlements

Terraform Cloud is available at multiple pricing tiers (including free), which offer different feature sets.

Each organization has a set of _entitlements_ that corresponds to its pricing tier. These entitlements determine which Terraform Cloud features the organization can use.

If an organization doesn't have the necessary entitlement to use a given feature, Terraform Cloud returns a 404 error for API requests to any endpoints devoted to that feature.

The [show entitlement set](./organizations.html#show-the-entitlement-set) endpoint can return information about an organization's current entitlements, which is useful if your client needs to change its interface when a given feature isn't available.

The following entitlements are available:

- `agents` — Allows isolated, private or on-premises infrastructure to communicate with an organization in Terraform Cloud. Affects the [agent pools][], [agents][], and [agent tokens][] endpoints.
- `audit-logging` — Allows an organization to access [audit trails][].
- `configuration-designer` — Allows an organization to use the [Configuration Designer][].
- `cost-estimation` — Allows an organization to access [cost estimation][].
- `operations` — Allows an organization to perform runs within Terraform Cloud. Affects the [runs][], [plans][], and [applies][] endpoints.
- `private-module-registry` — Allows an organization to publish and use modules with the [private module registry][]. Affects the [registry modules][] endpoints.
- `self-serve-billing` — Allows an organization to pay via credit card using the in-app billing UI.
- `state-storage` — Allows an organization to store state versions in its workspaces, which enables local Terraform runs with the remote backend. Affects the [state versions][] endpoints.
- `sentinel` — Allows an organization to use [Sentinel][]. Affects the [policies][], [policy sets][], and [policy checks][] endpoints.
- `sso` — Allows an organization to manage and authenticate users via [single sign on][].
- `teams` — Allows an organization to manage access to its workspaces with [teams](../users-teams-organizations/teams.html). Without this entitlement, an organization only has an owners team. Affects the [teams][], [team members][], [team access][], and [team tokens][] endpoints.
- `user-limit` — An integer value representing the maximum number of users allowed for the organization. If blank, there is no limit.  
- `vcs-integrations` — Allows an organization to [connect with a VCS provider][vcs integrations] and link VCS repositories to workspaces. Affects the [OAuth Clients][o-clients], and [OAuth Tokens][o-tokens] endpoints, and determines whether the `data.attributes.vcs-repo` property can be set for [workspaces][].

[agents]: ./agents.html
[agent pools]: ./agents.html
[agent tokens]: ./agent-tokens.html
[applies]: ./applies.html
[audit trails]: ./audit-trails.html
[Configuration Designer]: ../registry/design.html
[cost estimation]: ../cost-estimation/index.html
[o-clients]: ./oauth-clients.html
[o-tokens]: ./oauth-tokens.html
[plans]: ./plans.html
[policies]: ./policies.html
[policy checks]: ./policy-checks.html
[policy sets]: ./policy-sets.html
[private module registry]: ../registry/index.html
[registry modules]: ./modules.html
[runs]: ./run.html
[Sentinel]: ../sentinel/index.html
[single sign on]: ../users-teams-organizations/single-sign-on.html
[state versions]: ./state-versions.html
[teams]: ./teams.html
[team access]: ./team-access.html
[team members]: ./team-members.html
[team tokens]: ./team-tokens.html
[vcs integrations]: ../vcs/index.html
[workspaces]: ./workspaces.html

## Response Codes

This API returns standard HTTP response codes.

We return 404 Not Found codes for resources that a user doesn't have access to, as well as for resources that don't exist. This is to avoid telling a potential attacker that a given resource exists.

## Versioning

The API documented in these pages is the second version of Terraform Cloud's API, and resides under the `/v2` prefix.

Future APIs will increment this version, leaving the `/v1` API intact, though in the future we might deprecate certain features. In that case, we'll provide ample notice to migrate to the new API.

## Paths

All V2 API endpoints use `/api/v2` as a prefix unless otherwise specified.

For example, if the API endpoint documentation defines the path `/runs` then the full path is `/api/v2/runs`.

## JSON API Formatting

The Terraform Cloud endpoints use the [JSON API specification](https://jsonapi.org/), which specifies key aspects of the API. Most notably:

- [HTTP error codes](https://jsonapi.org/examples/#error-objects-error-codes)
- [Error objects](https://jsonapi.org/examples/#error-objects-basics)
- [Document structure][document]
- [HTTP request/response headers](https://jsonapi.org/format/#content-negotiation)

[document]: https://jsonapi.org/format/#document-structure

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
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 items per page. The maximum page size is 100.

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
              "id": "user-62goNpx1ThQf689e",
              "type": "users"
          }
        ]
      } ...
    }
    ...
  },
  "included": [
    {
      "id": "user-62goNpx1ThQf689e",
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

## Client libraries and tools

HashiCorp maintains [go-tfe](https://github.com/hashicorp/go-tfe), a Go client for Terraform Cloud's API.

Additionally, the community of Terraform Cloud users and vendors have built client libraries in other languages. These client libraries and tools are not tested nor officially maintained by HashiCorp, but are listed below in order to help users find them easily.

If you have built a client library and would like to add it to this community list, please [contribute](https://github.com/hashicorp/terraform-website) to [this page](https://github.com/hashicorp/terraform-website/blob/master/content/source/docs/cloud/api/index.html.md).

- [tfh](https://github.com/hashicorp-community/tf-helper): UNIX shell console app
- [tf_api_gateway](https://github.com/PlethoraOfHate/tf_api_gateway): Python API library and console app
- [terrasnek](https://github.com/dahlke/terrasnek): Python API library
- [tfc-client](https://github.com/adeo/iwc-tfc-client): Object oriented Python API library.
- [terraform-enterprise-client](https://github.com/skierkowski/terraform-enterprise-client): Ruby API library and console app
- [pyterprise](https://github.com/JFryy/terraform-enterprise-api-python-client): A simple Python API client library.
- [Tfe.NetClient](https://github.com/everis-technology/Tfe.NetClient): .NET Client Library
