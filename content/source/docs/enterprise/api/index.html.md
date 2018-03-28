---
page_title: "API Docs - Terraform Enterprise"
layout: "enterprise2"
sidebar_current: "docs-enterprise2-api"
---


# Terraform Enterprise API Documentation

-> **Note**: These API endpoints are in beta and are subject to change.

Terraform Enterprise provides an API for a subset of its features. If you have any questions or want to request new API features, please email support@hashicorp.com.

See the navigation sidebar for the list of available endpoints.

## Authentication

All requests must be authenticated with a bearer token. Use the HTTP Header `Authorization` with the value `Bearer <token>`. This token can be generated or revoked on the account tokens page. Your token has access to all resources your account has access to.

For organization-level resources, we recommend creating a separate user account that can be added to the organization with the specific privilege level required.

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
    }
  },
  "filter": {
    "organization": {
      "name":"my-organization"
    },
    "workspace": {
      "name":"my-workspace"
    }
  }
}
```

These objects always include a top-level `data` property, which:

- Must have a `type` property to indicate what type of API object you're interacting with.
- Often has an `attributes` property to specify attributes of the object you're creating or modifying.
- Sometimes has a `relationships` property to specify other objects that are linked to what you're working with.

A request payload sometimes has other top-level properties that are siblings of `data`, like `filter`.

In the documentation for each API method, we use dot notation to explain the structure of nested objects in the request. For example, the properties of the request object above are listed as follows:

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.type`                 | string |         | Must be `"vars"`.
`data.attributes.key`       | string |         | The name of the variable.
`data.attributes.value`     | string |         | The value of the variable.
`data.attributes.category`  | string |         | Whether this is a Terraform or environment variable. Valid values are `"terraform"` or `"env"`.
`data.attributes.hcl`       | bool   | `false` | Whether to evaluate the value of the variable as a string of HCL code. Has no effect for environment variables.
`data.attributes.sensitive` | bool   | `false` | Whether the value is sensitive. If true then the variable is written once and not visible thereafter.
`filter.workspace.name`     | string |         | The name of the workspace that owns the variable.
`filter.organization.name`  | string |         | The name of the organization that owns the workspace.

We also always include a sample payload object, to show the document structure more visually.

### Query Parameters

Although most of our API endpoints use the POST method and receive their parameters as a JSON object in the request payload, some of them use the GET method. These GET endpoints sometimes require URL query parameters, in the standard `...path?key1=value1&key2=value2` format.

Since these parameters were originally designed as part of a JSON object, they sometimes have characters that must be [percent-encoded](https://en.wikipedia.org/wiki/Percent-encoding) in a query parameter. For example, `[` becomes `%5B` and `]` becomes `%5D`.

For more about URI structure and query strings, see [the specification (RFC 3986)](https://tools.ietf.org/html/rfc3986) or [the Wikipedia page on URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier).

## Community client libraries and tools

The community client libraries and tools listed below have been built by the community of Terraform Enterprise users and vendors. These client libraries and tools are not tested nor officially maintained by HashiCorp, and are listed here in order to help users find them easily.

If you have built a client library and would like to add it to this community list, please [contribute](https://github.com/hashicorp/terraform-website#contributions-welcome) to [this page](https://github.com/hashicorp/terraform-website/blob/master/content/source/docs/enterprise/api/index.html.md).

- [tf_api_gateway](https://github.com/PlethoraOfHate/tf_api_gateway): Python API library and console app
- [terraform-enterprise-client](https://github.com/skierkowski/terraform-enterprise-client): Ruby API library and console app
