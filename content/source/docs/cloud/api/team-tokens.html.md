---
layout: "cloud"
page_title: "Team Tokens - API Docs - Terraform Cloud and Terraform Enterprise"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[202]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[401]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
[403]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[409]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
[412]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[429]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
[500]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
[504]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
[JSON API document]: /docs/cloud/api/index.html#json-api-documents
[JSON API error object]: https://jsonapi.org/format/#error-objects

# Team Token API

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
          "id": "user-62goNpx1ThQf689e",
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
