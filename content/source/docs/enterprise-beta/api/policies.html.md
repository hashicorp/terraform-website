---
layout: enterprise2
page_title: "Policies - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-policy"
---

# Policies API

-> **Note**: These API endpoints are in beta and may be subject to change.

[Sentinel Policy as Code](/docs/enterprise-beta/sentinel/index.html) is an embedded policy as code framework integrated with Terraform Enterprise. Policies are defined in organizations and enforced on all workspace Runs between a plan and an apply. A plan's changes must be validated by the policy in order to proceed to the apply step. This doc covers operations to create, read, update, and delete the Sentinel Policies in an organization. The [Runs API](/docs/enterprise-beta/api/run.html) covers the steps for reading and overriding policy checks in a workspace run.


## Create a Policy

This endpoint enables you to create a policy and associate it with an organization.

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization/policies |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy will be defined
- `name` (`string: <required>`) - specifies the name of the policy. Accepts alphanumeric characters, as well as `-` and `_`. Cannot be modified after creation.
- `mode` (`string: "soft-mandatory"`) - specifies the enforcement level of the policy, it can be `hard-mandatory`, `soft-mandatory`, or `advisory`. Enforcement level details can be found in the [Managing Policies](/docs/enterprise-beta/sentinel/manage-policies.html) documentation.


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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/policies
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
      "updated-at":"2017-10-10T20:52:13.898Z"
    },
    "links": {
      "self":"/api/v2/policies/pol-u3S5p2Uwk21keu1s",
      "upload":"/api/v2/policies/pol-u3S5p2Uwk21keu1s/upload"
    }
  }
}
```

## Upload a Policy

-> **Note**: This endpoint is not JSON-API enabled therefore the serialization format of the body and the HTTP headers do not follow the JSON-API patterns of other endpoints.

This endpoint is used to upload the policy content to the policy.


| Method | Path           |
| :----- | :------------- |
| PUT | /policies/:policy_id/upload |

### Parameters

- `:policy_id` (`string: <required>`) - specifies the policy ID to which the file should be saved

### Sample Payload

```plain
main = rule { true }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @payload.sentinel \
  https://atlas.hashicorp.com/api/v2/policy/pol-u3S5p2Uwk21keu1s/upload
```


## Update a Policy

This endpoint enables you to update a Policy

| Method | Path           |
| :----- | :------------- |
| PATCH | /policies/:policy_id |

### Parameters

- `:policy_id` (`string: <required>`) - specifies the policy ID to be updated

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
      "name": "my-example-policy",
    },
    "type":"policies"
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/policy/pol-u3S5p2Uwk21keu1s
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

List all the policies for a given organization

| Method | Path           |
| :----- | :------------- |
| GET | /organizations/:organization/policies |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy is defined

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/policies
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

| Method | Path           |
| :----- | :------------- |
| DELETE | /policies/:policy_id |

### Parameters

- `:policy_id` (`string: <required>`) - specifies the policy ID to be deleted

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/policies/pl-u3S5p2Uwk21keu1s
```

