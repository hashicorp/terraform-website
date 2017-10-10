---
layout: enterprise2
page_title: "Policies - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-policy"
---

# Policies API

-> **Note**: These API endpoints are in beta and may be subject to change.

[Sentinel Policy as Code](/docs/enterprise-beta/sentinel/index.html) is an embedded policy as code framework integrated with Terraform Enterprise. Policies are defined in organizations and enforced on all workspace Runs between a plan and an apply. This doc covers operations to create, read, update, and delete the Sentinel Policies in an organization. The [Runs API](/docs/enterprise-beta/api/run.html) covers the steps for reading and overriding policy checks in a workspace run.


## Create a Policy

This endpoint enables you to create a policy and associate it with an organization.

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization/policies |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy will be defined
- `name` (`string: <required>`) - specifies the name of the policy. Accepts alphanumeric characters, as well as `-` and `_`. Cannot be modified after creation.
- `mode` (`string: "soft"`) - specifies the enforcement level of the policy, it can be `hard`, `soft`, or `advisory`.


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "enforce": [
        {
          "path": "my-example-policy.sentinel",
          "mode": "hard"
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
      "name":"basic",
      "enforce": [
        {
          "path":"basic.sentinel",
          "mode":"advisory"
        }
      ],
      "updated-at":"2017-10-10T20:52:13.898Z"
    },
    "links": {
      "self":"/api/v2/policies/pol-u3S5p2Uwk21keu1s",
      "upload":"/api/v2/policies/pol-u3S5p2Uwk21keu1s/upload",
      "download":"/api/v2/policies/pol-u3S5p2Uwk21keu1s/download"
    }
  }
}
```

## Upload a Policy

-> **Note**: This endpoint is not JSON-API enabled therefore the serialization format of the body and the HTTP headers do not follow the JSON-API patterns of other endpoints.

This endpoint is used to upload the policy file to the policy.


| Method | Path           |
| :----- | :------------- |
| PUT | /organizations/:organization/policies/:policy_id/upload |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy will be defined
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
  --header "Accept: text/plain" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/policy/pol-u3S5p2Uwk21keu1s/upload
```


## Update a Policy

This endpoint enables you to update a Policy

| Method | Path           |
| :----- | :------------- |
| PATCH | /organizations/:organization/policies/:policy_id |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy is defined

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "enforce": [
        {
          "path": "my-example-policy.sentinel",
          "mode": "soft"
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
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/policy/pol-u3S5p2Uwk21keu1s
```

### Sample Response

```json
{
  "data": {
    "id":"pol-u3S5p2Uwk21keu1s",
    "type":"policies",
    "attributes": {
      "name":"basic",
      "enforce": [
        {
          "path":"basic.sentinel",
          "mode":"soft"
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
  --header "Content-Type: application/vnd.api+json" \
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
                        "path": "basic.sentinel"
                    }
                ],
                "name": "basic",
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
| DELETE | /organizations/:organization/policies/:policy_id |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy is defined

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/policies/pl-u3S5p2Uwk21keu1s
```

