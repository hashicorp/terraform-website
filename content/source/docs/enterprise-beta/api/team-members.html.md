---
layout: enterprise2
page_title: "Team Membership - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-team-members"
---

# Team Membership API

-> **Note**: These API endpoints are in beta and may be subject to change.

The Team Membership API is used to add or remove users from teams. The [Team API](/docs/enterprise-beta/api/teams.html) is used to create or destroy teams.

## Add a User to Team

This method adds multiple users to a team. Both users and teams must already exist.

| Method | Path           |
| :----- | :------------- |
| POST | /teams/:team_id/relationships/users |

### Parameters

- `team_id` (`string: <required>`) - The team ID of the team to add the users to. Team must already exit.
- `user_id` (`string: <required>`) - The user ID of all the team members to add.

### Sample Payload

```json
{
  "data": [
    { "type": "users", "id": "myusername" },
  ]
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/teams/257525/relationships/users
```


# Delete a User from Team

This method removes multiple users from a team. Both users and teams must already exist. This DOES NOT delete the user; it only removes them from this team.

| Method | Path           |
| :----- | :------------- |
| DELETE | /teams/:team_id |

### Parameters

- `team_id` (`string: <required>`) - The team ID of the team to remove users from. Team must already exist.
- `user_id` (`string: <required>`) - The user IDs of all the team members to remove.

### Sample Payload

```json
{
  "data": [
    { "type": "users", "id": "myusername" },
  ]
}
```

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/teams/257525/relationships/users
```
