---
layout: enterprise2
page_title: "OAuth Tokens - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-o-auth-tokens"
---

# OAuth Tokens

-> **Note**: These API endpoints are in beta and may be subject to change.

The `o-auth-token` object represents a VCS configuration which includes the OAuth connection and the assocaited OAuth token. This object is used when creating a workspace to identify which VCS connection to use.

## List OAuth Tokens

List all the policies for a given organization

| Method | Path           |
| :----- | :------------- |
| GET | /organizations/:organization_username/o-auth-tokens |

### Parameters

- `:organization` (`string: <required>`) - specifies the organization name where the Policy is defined

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  https://atlas.hashicorp.com/api/v2/organizations/my-organization/o-auth-tokens
```

### Sample Response

```json
{
  "data": [
    {
      "id":"238560",
      "type":"o-auth-tokens",
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
        "self":"/api/v2/o-auth-tokens/238560"
      }
    }
  ]
}
```