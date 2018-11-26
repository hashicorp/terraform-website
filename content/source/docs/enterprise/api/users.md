---
layout: enterprise2
page_title: "Users - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-users"
---

# Users API

-> **Note**: These API endpoints are in beta and are subject to change.

## Show a User

Shows details for a user. The ID for a user can be obtained from the [Team Membership](/docs/enterprise/api/team-members.html) endpoints.

`GET /users/:user_id`

Status  | Response                                | Reason
--------|-----------------------------------------|----------
[200][] | [JSON API document][] (`type: "users"`) | The request was successful
[401][] | [JSON API error object][]               | Unauthorized
[404][] | [JSON API error object][]               | User not found, or unauthorized to view the user

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/users/user-MA4GL63FmYRpSFxa
```

### Sample Response

```json
{
  "data": {
    "id": "user-MA4GL63FmYRpSFxa",
    "type": "users",
    "attributes": {
      "username": "admin",
      "is-service-account": false,
      "avatar-url": "https://www.gravatar.com/avatar/fa1f0c9364253d351bf1c7f5c534cd40?s=100&d=mm",
      "v2-only": true,
      "permissions": {
        "can-create-organizations": false,
        "can-change-email": true,
        "can-change-username": true
      }
    },
    "relationships": {
      "authentication-tokens": {
        "links": {
          "related": "/api/v2/users/user-MA4GL63FmYRpSFxa/authentication-tokens"
        }
      }
    },
    "links": {
      "self": "/api/v2/users/user-MA4GL63FmYRpSFxa"
    }
  }
}
```

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[401]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects
