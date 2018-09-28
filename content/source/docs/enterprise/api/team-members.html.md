---
layout: enterprise2
page_title: "Team Membership - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-team-members"
---

# Team Membership API

-> **Note**: These API endpoints are in beta and are subject to change.

The Team Membership API is used to add or remove users from teams. The [Team API](./teams.html) is used to create or destroy teams.

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
