---
layout: enterprise2
page_title: "SSH Keys - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-ssh-keys"
---

# SSH Keys

-> **Note**: These API endpoints are in beta and are subject to change.

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

-> **Note:** This endpoint is disabled for [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[200][] | Array of [JSON API document][]s (`type: "ssh-keys"`) | Success
[404][] | [JSON API error object][]                            | Organization not found

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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

-> **Note:** This endpoint is disabled for [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                   | Reason
--------|--------------------------------------------|-------
[200][] | [JSON API document][] (`type: "ssh-keys"`) | Success
[404][] | [JSON API error object][]                  | SSH key not found or user not authorized

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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

-> **Note:** This endpoint is disabled for [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                   | Reason
--------|--------------------------------------------|-------
[201][] | [JSON API document][] (`type: "ssh-keys"`) | Success
[422][] | [JSON API error object][]                  | Validation errors

[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422


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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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

This endpoint lets you replace the name or value of an existing SSH key. Existing workspaces that use the key will be updated with the new name and/or key text.

Only members of the owners team (or the owners team's service account) can edit SSH keys.

-> **Note:** This endpoint is disabled for [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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

Only members of the owners team (or the owners team's service account) can delete SSH keys.

-> **Note:** This endpoint is disabled for [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[204][] | Nothing                                              | Success
[404][] | [JSON API error object][]                            | SSH key not found or user not authorized

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --request DELETE \
  https://app.terraform.io/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM
```
