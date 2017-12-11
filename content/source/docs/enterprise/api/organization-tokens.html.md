---
layout: enterprise2
page_title: "Organization Tokens - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-organization-tokens"
---

# Organization Token API

-> **Note**: These API endpoints are in beta and are subject to change.

## Generate a new organization token

Generates a new organization token and overrides existing token if one exists.

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization/authentication-token |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization for the organization token

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/authentication-token
```

### Sample Response

```json
{
  "data": {
    "id": "4111756",
    "type": "authentication-tokens",
    "attributes": {
      "created-at": "2017-11-29T19:11:28.075Z",
      "last-used-at": null,
      "description": null,
      "token": "ZgqYdzuvlv8Iyg.atlasv1.6nV7t1OyFls341jo1xdZTP72fN0uu9VL55ozqzekfmToGFbhoFvvygIRy2mwVAXomOE"
    },
    "relationships": {
      "created-by": {
        "data": {
          "id": "skierkowski",
          "type": "users"
        }
      }
    }
  }
}
```

## Delete the organization token

| Method | Path           |
| :----- | :------------- |
| DELETE | /organizations/:organization/authentication-token |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization for the organization token

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/authentication-token
```
