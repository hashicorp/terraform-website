---
page_title: "API Docs - Terraform Enterprise Beta"
layout: "enterprise2"
sidebar_current: "docs-enterprise2-api"
---


# Terraform Enterprise API Documentation

-> **Note**: These API endpoints are in Beta and may be subject to change.

Terraform Enterprise provides an API for a subset of its features. If you have any questions or want to request new API features, please email support@hashicorp.com.

See the navigation sidebar for the list of available endpoints.

## Authentication

All requests must be authenticated with a bearer token. Use the HTTP Header `Authorization` with the value `Bearer <token>`. This token can be generated or revoked on the account tokens page. Your token has access to all resources your account has access to.

For organization-level resources, we recommend creating a separate user account that can be added to the organization with the specific privilege level required.

## Response Codes

This API returns standard HTTP response codes.

We return 404 Not Found codes for resources that a user doesn't have access to, as well as for resources that don't exist. This is to avoid telling a potential attacker that a given resource exists.

## Versioning

The API documented in these pages is the second version of TFE's API, and resides under the `/v2` prefix. For documentation of the `/v1` endpoints, see [the TFE (classic) API docs.](/docs/enterprise/api/index.html)

Future APIs will increment this version, leaving the` /v1` API intact, though in the future we might deprecate certain features. In that case, we'll provide ample notice to migrate to the new API.

## JSON API Formatting

The TFE beta endpoints use the [JSON API specification](http://jsonapi.org/) which specifies standards for [HTTP error codes](http://jsonapi.org/examples/#error-objects-error-codes), [error objects](http://jsonapi.org/examples/#error-objects-basics), [document structure](http://jsonapi.org/format/#document-structure), [HTTP Request/Response headers](http://jsonapi.org/format/#content-negotiation), and other key aspects of the API.

## Example

This is a Ruby example which creates a new workspace called `my-workspace` with no other settings in the `my-organization` organization and lists all workspaces using the `v2` API.

```ruby
require 'rest-client'
require 'json'

base         = 'https://atlas.hashicorp.com/api/v2'
organization = 'my-organization'
headers      = {
  'Authorization' => "Bearer #{ENV['ATLAS_TOKEN']}",
  'Content-Type'  => 'application/vnd.api+json'
}

orgs_url       = "#{base}/organizations/#{organization}"
workspaces_url = "#{orgs_url}/workspaces"

# Create a new workspace
new_workspace  = {
  data: {
    type: "workspace",
    attributes: {
      name: "my-workspace"
    }
  }
}
create_workspace_response     = RestClient.post(workspaces_url, new_workspace.to_json, headers)
create_workspace_response_obj = JSON.parse(create_workspace_response)
puts create_workspace_response_obj

# List all workspaces
list_workspaces_response      = RestClient.get(workspaces_url, headers)
list_workspaces_response_obj  = JSON.parse(list_workspaces_response)
puts list_workspaces_response_obj
```

