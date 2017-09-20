---
layout: enterprise2
page_title: "Team Membership - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-team-members"
---

# Team Membership API
The Team Membership API is used to add or remove users from a teams. The [Team API](/docs/enterprise-beta/api/teams.html) is used to create or destroy teams.

-> **Note**: These API Endpoints are not yet available on `https://atlas.hashicorp.com/api/v2/` and may be subject to change before they are made available.

## Add a User to Team
This method adds multiple users to a Team. Both Users and Teams must already exist.

| Method | Path           |
| :----- | :------------- |
| POST | /teams/:team_id/relationships/users |

### Parameters
- `team_id` (`string: <required>`) - The Team ID of the team to add the users to. Team must already exit.
- `user_id` (`string: <required>`) - The User ID of all the team memers to add.

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
This method removes multiple users from a Team. Both Users and Teams must already exist. This DOES NOT delete the User, it only remoes them from this team.

| Method | Path           |
| :----- | :------------- |
| DELETE | /teams/:team_id |

### Parameters
- `team_id` (`string: <required>`) - The Team ID of the team to remove users from. Team must already exit.
- `user_id` (`string: <required>`) - The User IDs of all the team memers to remove.

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