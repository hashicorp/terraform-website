---
page_title: "Index - API Docs - Terraform Enterprise Beta"
layout: "enterprise2"
---


# Terraform Enterprise API Documentation

Terraform Enterprise provides an API for a subset of features available. For questions or requests for new API features please email support@hashicorp.com.

The list of available endpoints are on the navigation.

## Authentication

All requests must be authenticated with a bearer token. Use the HTTP Header `Authorization` with the value `Bearer <token>`. This token can be generated or revoked on the account tokens page. Your token will have access to all resources your account has access to.

For organization level resources, we recommend creating a separate user account that can be added to the organization with the specific privilege level required.

## Response Codes

Standard HTTP response codes are returned. 404 Not Found codes are returned for all resources that a user does not have access to, as well as for resources that don't exist. This is done to avoid a potential attacker discovering the existence of a resource.

## Versioning

The API currently resides under the `/v1` prefix. The August Beta Release is a V2 API and resides under `/v2` prefix. Future APIs will increment this version leaving the` /v1` API intact, though in the future certain features may be deprecated. In that case, ample notice to migrate to the new API will be provided.

## JSON API Formatting

The August Release endpoints use the [JSON API specification](http://jsonapi.org/) which specifies standards for [HTTP error codes](http://jsonapi.org/examples/#error-objects-error-codes), [error objects](http://jsonapi.org/examples/#error-objects-basics), [document structure](http://jsonapi.org/format/#document-structure), [HTTP Request/Response headers](http://jsonapi.org/format/#content-negotiation), and other key aspects of the API.

## Example

This is a Ruby example which creates a new workspace called `workspace-demo` with no other settings in the `skierkowski` organization and lists all workspaces using the `v2` API.

```ruby
require 'rest-client'
require 'json'

base         = 'https://atlas.hashicorp.com/api/v2'
organization = 'skierkowski'
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
      name: "workspace-demo"
    }
  }
}
create_workspace_response     = post(workspaces_url, new_workspace.to_json, headers)
create_workspace_response_obj = JSON.parse(create_workspace_response)
puts create_workspace_response_obj

# List all workspaces
list_workspaces_response      = RestClient.get(workspaces_url, headers)
list_workspaces_response_obj  = JSON.parse(list_workspaces_response)
puts list_workspaces_response_obj
```

