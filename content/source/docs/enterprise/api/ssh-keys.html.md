---
layout: enterprise2
page_title: "SSH Keys - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-ssh-keys"
---

# SSH Keys

-> **Note**: These API endpoints are in beta and are subject to change.

The `ssh-key` object represents an SSH key which includes a name and the SSH private key. This object is used to clone Terraform modules at the organization level, and allows multiple keys to be added for the organization. You can also easily use them in any [workspace](./workspaces.html#assign-an-ssh-key-to-a-workspace) that clones modules from a Git server.

## List SSH Keys

List all the SSH Keys for a given organization

| Method | Path           |
| :----- | :------------- |
| GET | /organizations/:organization_name/ssh-keys |

### Parameters

- `:organization_name` (`string: <required>`) - specifies the organization name where the SSH Keys are defined

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

Get an SSH Key

| Method | Path           |
| :----- | :------------- |
| GET | /ssh-keys/:ssh_key_id |

### Parameters

- `:ssh_key_id` (`string: <required>`) - specifies the SSH key ID to get

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

Create an SSH Key

| Method | Path           |
| :----- | :------------- |
| POST | /organizations/:organization_name/ssh-keys |

### Parameters

- `:organization_name` (`string: <required>`) - specifies the organization name where the SSH keys are defined
- `name` (`string: <required>`) - specifies the name of the SSH key
- `value` (`string: <required>`) - specifies the text of the SSH private key

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "name": "SSH Key",
      "value": "..."
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

Update an SSH Key

| Method | Path           |
| :----- | :------------- |
| PATCH | /ssh-keys/:ssh_key_id |

### Parameters

- `:ssh_key_id` (`string: <required>`) - specifies the SSH key ID to update
- `name` (`string: <required>`) - specifies the name of the SSH key

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

Delete an SSH Key

| Method | Path           |
| :----- | :------------- |
| DELETE | /ssh-keys/:ssh_key_id |

### Parameters

- `:ssh_key_id` (`string: <required>`) - specifies the SSH key ID to delete

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --request DELETE \
  https://app.terraform.io/api/v2/ssh-keys/sshkey-GxrePWre1Ezug7aM
```
