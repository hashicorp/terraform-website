---
layout: enterprise2
page_title: "SSH Keys - API Docs - Terraform Enterprise"
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
[JSON API document]: /docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

# SSH Keys

The `ssh-key` object represents an SSH key which includes a name and the SSH private key. An organization can have multiple SSH keys available.

SSH keys can be used in two places:

- They can be assigned to VCS provider integrations ([available in the API as `oauth-tokens`](./oauth-tokens.html)). Bitbucket Server requires an SSH key; other providers only need an SSH key if your repositories include submodules that are only accessible via SSH (instead of your VCS provider's API).
- They can be [assigned to workspaces](./workspaces.html#assign-an-ssh-key-to-a-workspace) and used when Terraform needs to clone modules from a Git server. This is only necessary when your configurations directly reference modules from a Git server; you do not need to do this if you use Terraform Enterprise's [private module registry](../registry/index.html).

~> **Important:** The list and read methods on this API only provide metadata about SSH keys. The actual private key text is write-only, and Terraform Enterprise never provides it to users via the API or UI.

## List SSH Keys

`GET /organizations/:organization_name/ssh-keys`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to list SSH keys for.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[200][] | Array of [JSON API document][]s (`type: "ssh-keys"`) | Success
[404][] | [JSON API error object][]                            | Organization not found or user not authorized


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/ssh-keys
```

### Sample Response

```json
{
  "data": [
    {
      "attributes": {
        "name": "SSH Key"
      },
      "id": "sshkey-GxrePWre1Ezug7aM",
      "links": {
        "self": "/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM"
      },
      "type": "ssh-keys"
    }
  ]
}
```


## Get an SSH Key

`GET /ssh-keys/:ssh_key_id`

Parameter     | Description
--------------|----------------------
`:ssh_key_id` | The SSH key ID to get.

This endpoint is for looking up the name associated with an SSH key ID. It does not retrieve the key text.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                   | Reason
--------|--------------------------------------------|-------
[200][] | [JSON API document][] (`type: "ssh-keys"`) | Success
[404][] | [JSON API error object][]                  | SSH key not found or user not authorized

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "name": "SSH Key"
    },
    "id": "sshkey-GxrePWre1Ezug7aM",
    "links": {
      "self": "/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM"
    },
    "type": "ssh-keys"
  }
}
```

## Create an SSH Key

`POST /organizations/:organization_name/ssh-keys`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create an SSH key in. The organization must already exist, and the token authenticating the API request must belong to the "owners" team or a member of the "owners" team.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                   | Reason
--------|--------------------------------------------|-------
[201][] | [JSON API document][] (`type: "ssh-keys"`) | Success
[422][] | [JSON API error object][]                  | Malformed request body (missing attributes, wrong types, etc.)
[404][] | [JSON API error object][]                  | User not authorized



### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.type`                 | string |         | Must be `"ssh-keys"`.
`data.attributes.name`      | string |         | A name to identify the SSH key.
`data.attributes.value`     | string |         | The text of the SSH private key.

### Sample Payload

```json
{
  "data": {
    "type": "ssh-keys",
    "attributes": {
      "name": "SSH Key",
      "value": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAm6+JVgl..."
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/my-organization/ssh-keys
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "name": "SSH Key"
    },
    "id": "sshkey-GxrePWre1Ezug7aM",
    "links": {
      "self": "/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM"
    },
    "type": "ssh-keys"
  }
}
```


## Update an SSH Key

`PATCH /ssh-keys/:ssh_key_id`

Parameter            | Description
---------------------|------------
`:ssh_key_id`        | The SSH key ID to update.

This endpoint replaces the name and/or key text of an existing SSH key. Existing workspaces that use the key will be updated with the new values.

Only members of the owners team (or the owners team service account) can edit SSH keys.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                   | Reason
--------|--------------------------------------------|-------
[200][] | [JSON API document][] (`type: "ssh-keys"`) | Success
[404][] | [JSON API error object][]                  | SSH key not found or user not authorized

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default   | Description
----------------------------|--------|-----------|------------
`data.type`                 | string |           | Must be `"ssh-keys"`.
`data.attributes.name`      | string | (nothing) | A name to identify the SSH key. If omitted, the existing name is preserved.
`data.attributes.value`     | string | (nothing) | The text of the SSH private key. If omitted, the existing value is preserved.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name": "SSH Key for GitHub"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "name": "SSH Key for GitHub"
    },
    "id": "sshkey-GxrePWre1Ezug7aM",
    "links": {
      "self": "/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM"
    },
    "type": "ssh-keys"
  }
}
```


## Delete an SSH Key

`DELETE /ssh-keys/:ssh_key_id`

Parameter            | Description
---------------------|------------
`:ssh_key_id`        | The SSH key ID to delete.

Only members of the owners team (or the owners team service account) can delete SSH keys.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[204][] | Nothing                                              | Success
[404][] | [JSON API error object][]                            | SSH key not found or user not authorized



### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request DELETE \
  https://app.terraform.io/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM
```
