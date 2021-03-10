---
layout: "cloud"
page_title: "Users - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Users API

Terraform Cloud's user objects do not contain any identifying information about a user, other than their Terraform Cloud username and avatar image; they are intended for displaying names and avatars in contexts that refer to a user by ID, like lists of team members or the details of a run. Most of these contexts can already include user objects via an `?include` parameter, so you shouldn't usually need to make a separate call to this endpoint.

## Show a User

Shows details for a given user.

`GET /users/:user_id`

Parameter   | Description
------------|------------
`:user_id`  | The ID of the desired user.

To find the ID that corresponds to a given username, you can request a [team object](./teams.html) for a team that user belongs to, specify `?include=users` in the request, and look for the user's name in the included list of user objects.

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

