---
layout: enterprise2
page_title: "OAuth Tokens - API Docs - Terraform Enterprise Beta"
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
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/oauth-tokens
```

### Sample Response

```json
{
  "data": [
    {
      "id":"238560",
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
            "id":"423",
            "type":"oauth-clients"
          }
        }
      },
      "links": {
        "self":"/api/v2/oauth-tokens/238560"
      }
    }
  ]
}
```