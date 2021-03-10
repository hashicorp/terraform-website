---
layout: "cloud"
page_title: "Team Membership - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Team Membership API

-> **Note:** Team management is a paid feature, available as part of the **Team** upgrade package. Free organizations can also use this API, but can only manage membership of their owners team. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

The Team Membership API is used to add or remove users from teams. The [Team API](./teams.html) is used to create or destroy teams.

## Organization Membership

-> **Note:** To add users to a team, they must first be invited to join the organization by email, and accept the invitation. This ensures that you don't accidentally add the wrong person by mistyping a username. See [the Organization Memberships API documentation](./organization-memberships.html) for more information.

## Add a User to Team

This method adds multiple users to a team. Both users and teams must already exist.

`POST /teams/:team_id/relationships/users`

| Parameter  | Description         |
| ---------- | ------------------- |
| `:team_id` | The ID of the team. |

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path      | Type   | Default | Description                      |
| ------------- | ------ | ------- | -------------------------------- |
| `data[].type` | string |         | Must be `"users"`.               |
| `data[].id`   | string |         | The username of the user to add. |

### Sample Payload

```json
{
  "data": [
    {
      "type": "users",
      "id": "myuser1"
    },
    {
      "type": "users",
      "id": "myuser2"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/teams/257525/relationships/users
```

## Delete a User from Team

This method removes multiple users from a team. Both users and teams must already exist. This DOES NOT delete the user; it only removes them from this team.

`DELETE /teams/:team_id/relationships/users`

| Parameter  | Description         |
| ---------- | ------------------- |
| `:team_id` | The ID of the team. |

### Request Body

This DELETE endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path      | Type   | Default | Description                         |
| ------------- | ------ | ------- | ----------------------------------- |
| `data[].type` | string |         | Must be `"users"`.                  |
| `data[].id`   | string |         | The username of the user to remove. |

### Sample Payload

```json
{
  "data": [
    {
      "type": "users",
      "id": "myuser1"
    },
    {
      "type": "users",
      "id": "myuser2"
    }
  ]
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://app.terraform.io/api/v2/teams/257525/relationships/users
```
