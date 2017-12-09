---
page_title: "API Docs - Terraform Enterprise Beta"
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

All V2 API endpoints use `/api/v2` as the subpath unless otherwise specified.

For example, if the API endpoint documentation defines the path `/runs` then the full path is `/api/v2/runs`.

## JSON API Formatting

The TFE beta endpoints use the [JSON API specification](http://jsonapi.org/) which specifies standards for [HTTP error codes](http://jsonapi.org/examples/#error-objects-error-codes), [error objects](http://jsonapi.org/examples/#error-objects-basics), [document structure](http://jsonapi.org/format/#document-structure), [HTTP Request/Response headers](http://jsonapi.org/format/#content-negotiation), and other key aspects of the API.

