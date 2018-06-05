---
layout: enterprise2
page_title: "Team Tokens - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-team-tokens"
---

# Team Token API

-> **Note**: These API endpoints are in beta and are subject to change.

## Generate a new team token

Generates a new team token and overrides existing token if one exists.

| Method | Path           |
| :----- | :------------- |
| POST | /teams/:team_id/authentication-token |

### Parameters

- `:team_id` (`string: <required>`) - specifies the team ID for generating the team token

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/teams/team-BUHBEM97xboT8TVz/authentication-token
```

### Sample Response

```json
{
  "data": {
    "id": "4111797",
    "type": "authentication-tokens",
    "attributes": {
      "created-at": "2017-11-29T19:18:09.976Z",
      "last-used-at": null,
      "description": null,
      "token": "QnbSxjjhVMHJgw.atlasv1.gxZnWIjI5j752DGqdwEUVLOFf0mtyaQ00H9bA1j90qWb254lEkQyOdfqqcq9zZL7Sm0"
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

## Delete the team token

| Method | Path           |
| :----- | :------------- |
| DELETE | /teams/:team_id/authentication-token |

### Parameters

- `:team_id` (`string: <required>`) - specifies the team_id from which to delete the token

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/teams/team-BUHBEM97xboT8TVz/authentication-token
```
