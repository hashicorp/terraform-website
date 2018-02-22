---
layout: enterprise2
page_title: "OAuth Tokens - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-oauth-tokens"
---

# OAuth Tokens

-> **Note**: These API endpoints are in beta and are subject to change.

The `oauth-token` object represents a VCS configuration which includes the OAuth connection and the assocaited OAuth token. This object is used when creating a workspace to identify which VCS connection to use.

## List OAuth Tokens

List all the OAuth Tokens for a given organization

| Method | Path           |
| :----- | :------------- |
| GET | /organizations/:organization_username/oauth-tokens |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the OAuth Token is defined

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/oauth-tokens
```

### Sample Response

```json
{
  "data": [
    {
      "id":"ot-hmAyP66qk2AMVdbJ",
      "type":"oauth-tokens",
      "attributes": {
        "uid":"885724",
        "created-at":"2017-11-02T06:37:49.284Z",
        "service-provider-user":"skierkowski",
        "has-ssh-key":false
      },
      "relationships": {
        "oauth-client": {
          "data": {
            "id":"oc-GhHqb5rkeK19mLB8",
            "type":"oauth-clients"
          }
        }
      },
      "links": {
        "self":"/api/v2/oauth-tokens/ot-hmAyP66qk2AMVdbJ"
      }
    }
  ]
}
```
