---
layout: enterprise2
page_title: "Policies - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-policies"
---

# Policies API

-> **Note**: These API endpoints are in beta and are subject to change.

[Sentinel Policy as Code](../sentinel/index.html) is an embedded policy as code framework integrated with Terraform Enterprise.

Policies are configured on a per-organization level, and are enforced on all of an organization's workspaces during runs. Each plan's changes are validated against the policy prior to the apply step. (For details, see [Run States and Stages](../run/states.html).)

This page documents the API endpoints to create, read, update, and delete the Sentinel policies in an organization. To view and manage the results of a specific run's policy check, use the [Runs API](./run.html).


## Create a Policy

`POST /organizations/:organization_name/policies`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to create the policy in. The organization must already exist in the system, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

This creates a new policy object for the organization, but does not upload the actual policy code. After creation, you must use the [Upload a Policy endpoint (below)](#upload-a-policy) with the new policy's upload path. (This endpoint's response body includes the upload path in its `links.upload` property.)

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).


Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "policies"`)   | Successfully created a policy
[404][] | [JSON API error object][]                    | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Malformed request body (missing attributes, wrong types, etc.)

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                         | Type            | Default          | Description
---------------------------------|-----------------|------------------|------------
`data.type`                      | string          |                  | Must be `"policies"`.
`data.attributes.name`           | string          |                  | The name of the policy, which cannot be modified after creation. Can include letters, numbers, `-`, and `_`.
`data.attributes.enforce`        | array\[object\] |                  | Although `enforce` can only include one object, it is specified as an array.
`data.attributes.enforce[].path` | string          |                  | Must be `<NAME>.sentinel`, where `<NAME>` has the same value as `data.attributes.name`.
`data.attributes.enforce[].mode` | string          | `soft-mandatory` | The enforcement level of the policy. Valid values are `"hard-mandatory"`, `"soft-mandatory"`, and `"advisory"`. For more details, see [Managing Policies](../sentinel/manage-policies.html).


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "enforce": [
        {
          "path": "my-example-policy.sentinel",
          "mode": "hard-mandatory"
        }
      ],
      "name": "my-example-policy",
    },
    "type":"policies"
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
  https://app.terraform.io/api/v2/organizations/my-organization/policies
```

### Sample Response

```json
{
  "data": {
    "id":"pol-u3S5p2Uwk21keu1s",
    "type":"policies",
    "attributes": {
      "name":"my-example-policy",
      "enforce": [
        {
          "path":"my-example-policy.sentinel",
          "mode":"advisory"
        }
      ],
      "updated-at": null
    },
    "links": {
      "self":"/api/v2/policies/pol-u3S5p2Uwk21keu1s",
      "upload":"/api/v2/policies/pol-u3S5p2Uwk21keu1s/upload"
    }
  }
}
```

## Upload a Policy

`PUT /policies/:policy_id/upload`

Parameter            | Description
---------------------|------------
`:policy_id`         | The ID of the policy to upload code to. Use the "List Policies" endpoint (or the response to a "Create Policy" request) to find IDs.

This endpoint uploads code to an existing Sentinel policy.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

-> **Note**: This endpoint does not use JSON-API's conventions for HTTP headers and body serialization.

### Request Body

This PUT endpoint requires the text of a valid Sentinel policy, with a `Content-Type` of `application/octet-stream`.

See [Defining Policies](../sentinel/import/index.html) for details about writing Sentinel code.

### Sample Payload

```plain
main = rule { true }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @payload.sentinel \
  https://app.terraform.io/api/v2/policies/pol-u3S5p2Uwk21keu1s/upload
```


## Update a Policy

`PATCH /policies/:policy_id`

Parameter            | Description
---------------------|------------
`:policy_id`         | The ID of the policy to update. Use the "List Policies" endpoint to find IDs.

This endpoint can update the enforcement mode of an existing policy. To update the policy code itself, use the upload endpoint.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "policies"`)   | Successfully updated the policy
[404][] | [JSON API error object][]                    | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Malformed request body (missing attributes, wrong types, etc.)

### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                         | Type            | Default          | Description
---------------------------------|-----------------|------------------|------------
`data.type`                      | string          |                  | Must be `"policies"`.
`data.attributes.name`           | string          | (Current name)   | Ignored if present.
`data.attributes.enforce`        | array\[object\] |                  | Although `enforce` can only include one object, it is specified as an array.
`data.attributes.enforce[].path` | string          |                  | Must be `<NAME>.sentinel`, where `<NAME>` matches the original value of `data.attributes.name`.
`data.attributes.enforce[].mode` | string          | `soft-mandatory` | The enforcement level of the policy. Valid values are `"hard-mandatory"`, `"soft-mandatory"`, and `"advisory"`. For more details, see [Managing Policies](../sentinel/manage-policies.html).


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "enforce": [
        {
          "path": "my-example-policy.sentinel",
          "mode": "soft-mandatory"
        }
      ],
    },
    "type":"policies"
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
  https://app.terraform.io/api/v2/policies/pol-u3S5p2Uwk21keu1s
```

### Sample Response

```json
{
  "data": {
    "id":"pol-u3S5p2Uwk21keu1s",
    "type":"policies",
    "attributes": {
      "name":"my-example-policy",
      "enforce": [
        {
          "path":"my-example-policy.sentinel",
          "mode":"soft-mandatory"
        }
      ],
      "updated-at":"2017-10-10T20:58:04.621Z"
    },
    "links": {
      "self":"/api/v2/policies/pol-u3S5p2Uwk21keu1s",
      "upload":"/api/v2/policies/pol-u3S5p2Uwk21keu1s/upload",
      "download":"/api/v2/policies/pol-u3S5p2Uwk21keu1s/download"
    }
  }
}
```

## List Policies

`GET /organizations/:organization_name/policies`

Parameter            | Description
---------------------|------------
`:organization_name` | The organization to list policies for.

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[200][] | Array of [JSON API document][]s (`type: "policies"`) | Success
[404][] | [JSON API error object][]                            | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                            | Malformed request body (missing attributes, wrong types, etc.)

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/policies
```

### Sample Response

```json
{
    "data": [
        {
            "attributes": {
                "enforce": [
                    {
                        "mode": "advisory",
                        "path": "my-example-policy.sentinel"
                    }
                ],
                "name": "my-example-policy",
                "updated-at": "2017-10-10T20:52:13.898Z"
            },
            "id": "pol-u3S5p2Uwk21keu1s",
            "links": {
                "download": "/api/v2/policies/pol-u3S5p2Uwk21keu1s/download",
                "self": "/api/v2/policies/pol-u3S5p2Uwk21keu1s",
                "upload": "/api/v2/policies/pol-u3S5p2Uwk21keu1s/upload"
            },
            "type": "policies"
        }
    ]
}
```

## Delete a Policy

`DELETE /policies/:policy_id`

Parameter            | Description
---------------------|------------
`:policy_id`         | The ID of the policy to delete. Use the "List Policies" endpoint to find IDs.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).


Status  | Response                  | Reason
--------|---------------------------|-------
[204][] | Nothing                   | Successfully deleted the policy
[404][] | [JSON API error object][] | Organization not found, or user unauthorized to perform action

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request DELETE \
  https://app.terraform.io/api/v2/policies/pl-u3S5p2Uwk21keu1s
```

