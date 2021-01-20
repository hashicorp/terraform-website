---
layout: "cloud"
page_title: "Organizations - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Organizations API

The Organizations API is used to list, show, create, update, and destroy organizations.

## List Organizations

`GET /organizations`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | The request was successful
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations
```

### Sample Response

```json
{
  "data": [
    {
      "id": "hashicorp",
      "type": "organizations",
      "attributes": {
        "name": "hashicorp",
        "cost-estimation-enabled": true,
        "created-at": "2017-09-07T14:34:40.492Z",
        "email": "user@example.com",
        "session-timeout": null,
        "session-remember": null,
        "collaborator-auth-policy": "password",
        "plan-expired": false,
        "plan-expires-at": null,
        "plan-is-trial": false,
        "plan-is-enterprise": false,
        "permissions": {
          "can-update": true,
          "can-destroy": true,
          "can-access-via-teams": true,
          "can-create-module": true,
          "can-create-team": true,
          "can-create-workspace": true,
          "can-manage-users": true,
          "can-manage-subscription": true,
          "can-manage-sso": false,
          "can-update-oauth": true,
          "can-update-sentinel": true,
          "can-update-ssh-keys": true,
          "can-update-api-token": true,
          "can-traverse": true,
          "can-start-trial": false,
          "can-update-agent-pools": false
        },
        "fair-run-queuing-enabled": true,
        "saml-enabled": false,
        "owners-team-saml-role-id": null,
        "two-factor-conformant": true
      },
      "relationships": {
        "oauth-tokens": {
          "links": {
            "related": "/api/v2/organizations/hashicorp/oauth-tokens"
          }
        },
        "authentication-token": {
          "links": {
            "related": "/api/v2/organizations/hashicorp/authentication-token"
          }
        },
        "entitlement-set": {
          "data": {
            "id": "org-MxtxBC6ihhU6u8AG",
            "type": "entitlement-sets"
          },
          "links": {
            "related": "/api/v2/organizations/hashicorp/entitlement-set"
          }
        },
        "subscription": {
          "links": {
            "related": "/api/v2/organizations/hashicorp/subscription"
          }
        }
      },
      "links": {
        "self": "/api/v2/organizations/hashicorp"
      }
    }
  ]
}
```

## Show an Organization

`GET /organizations/:organization_name`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to show

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | The request was successful
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations/hashicorp
```

### Sample Response

```json
{
  "id": "hashicorp",
  "type": "organizations",
  "attributes": {
    "name": "hashicorp",
    "cost-estimation-enabled": true,
    "created-at": "2017-09-07T14:34:40.492Z",
    "email": "user@example.com",
    "session-timeout": null,
    "session-remember": null,
    "collaborator-auth-policy": "password",
    "plan-expired": false,
    "plan-expires-at": null,
    "plan-is-trial": false,
    "plan-is-enterprise": false,
    "permissions": {
      "can-update": true,
      "can-destroy": true,
      "can-access-via-teams": true,
      "can-create-module": true,
      "can-create-team": true,
      "can-create-workspace": true,
      "can-manage-users": true,
      "can-manage-subscription": true,
      "can-manage-sso": false,
      "can-update-oauth": true,
      "can-update-sentinel": true,
      "can-update-ssh-keys": true,
      "can-update-api-token": true,
      "can-traverse": true,
      "can-start-trial": false,
      "can-update-agent-pools": false
    },
    "fair-run-queuing-enabled": true,
    "saml-enabled": false,
    "owners-team-saml-role-id": null,
    "two-factor-conformant": true
  },
  "relationships": {
    "oauth-tokens": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/oauth-tokens"
      }
    },
    "authentication-token": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/authentication-token"
      }
    },
    "entitlement-set": {
      "data": {
        "id": "org-MxtxBC6ihhU6u8AG",
        "type": "entitlement-sets"
      },
      "links": {
        "related": "/api/v2/organizations/hashicorp/entitlement-set"
      }
    },
    "subscription": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/subscription"
      }
    }
  },
  "links": {
    "self": "/api/v2/organizations/hashicorp"
  }
}
```

## Create an Organization

`POST /organizations`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "organizations"`) | The organization was successfully created
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                                   | Type    | Default   | Description
-------------------------------------------|---------|-----------|------------
`data.type`                                | string  |           | Must be `"organizations"`
`data.attributes.name`                     | string  |           | Name of the organization
`data.attributes.email`                    | string  |           | Admin email address
`data.attributes.session-timeout`          | integer |    20160  | Session timeout after inactivity (minutes)
`data.attributes.session-remember`         | integer |    20160  | Session expiration (minutes)
`data.attributes.collaborator-auth-policy` | string  | password  | Authentication policy (`password` or `two_factor_mandatory`)
`data.attributes.cost-estimation-enabled`  | boolean | true      | Whether or not the cost estimation feature is enabled for all workspaces in the organization. Defaults to true. In a Terraform Cloud organization which does not have Teams & Governance features, this value is always false and cannot be changed. In Terraform Enterprise, Cost Estimation must also be enabled in Site Administration.
`data.attributes.owners-team-saml-role-id` | string  | (nothing) | **Optional.** **SAML only** The name of the ["owners" team](/docs/enterprise/saml/team-membership.html#managing-membership-of-the-owners-team)

### Sample Payload

```json
{
  "data": {
    "type": "organizations",
    "attributes": {
      "name": "hashicorp",
      "email": "user@example.com"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations
```

### Sample Response

```json
{
  "id": "hashicorp",
  "type": "organizations",
  "attributes": {
    "name": "hashicorp",
    "cost-estimation-enabled": true,
    "created-at": "2017-09-07T14:34:40.492Z",
    "email": "user@example.com",
    "session-timeout": null,
    "session-remember": null,
    "collaborator-auth-policy": "password",
    "plan-expired": false,
    "plan-expires-at": null,
    "plan-is-trial": false,
    "plan-is-enterprise": false,
    "permissions": {
      "can-update": true,
      "can-destroy": true,
      "can-access-via-teams": true,
      "can-create-module": true,
      "can-create-team": true,
      "can-create-workspace": true,
      "can-manage-users": true,
      "can-manage-subscription": true,
      "can-manage-sso": false,
      "can-update-oauth": true,
      "can-update-sentinel": true,
      "can-update-ssh-keys": true,
      "can-update-api-token": true,
      "can-traverse": true,
      "can-start-trial": false,
      "can-update-agent-pools": false
    },
    "fair-run-queuing-enabled": true,
    "saml-enabled": false,
    "owners-team-saml-role-id": null,
    "two-factor-conformant": true
  },
  "relationships": {
    "oauth-tokens": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/oauth-tokens"
      }
    },
    "authentication-token": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/authentication-token"
      }
    },
    "entitlement-set": {
      "data": {
        "id": "org-MxtxBC6ihhU6u8AG",
        "type": "entitlement-sets"
      },
      "links": {
        "related": "/api/v2/organizations/hashicorp/entitlement-set"
      }
    },
    "subscription": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/subscription"
      }
    }
  },
  "links": {
    "self": "/api/v2/organizations/hashicorp"
  }
}
```

## Update an Organization

`PATCH /organizations/:organization_name`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to update

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "organizations"`) | The organization was successfully updated
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action
[422][] | [JSON API error object][]                       | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

Key path                                   | Type    | Default   | Description
-------------------------------------------|---------|-----------|------------
`data.type`                                | string  |           | Must be `"organizations"`
`data.attributes.name`                     | string  |           | Name of the organization
`data.attributes.email`                    | string  |           | Admin email address
`data.attributes.session-timeout`          | integer |    20160  | Session timeout after inactivity (minutes)
`data.attributes.session-remember`         | integer |    20160  | Session expiration (minutes)
`data.attributes.collaborator-auth-policy` | string  | password  | Authentication policy (`password` or `two_factor_mandatory`)
`data.attributes.cost-estimation-enabled`  | boolean | true      | Whether or not the cost estimation feature is enabled for all workspaces in the organization. Defaults to true. In a Terraform Cloud organization which does not have Teams & Governance features, this value is always false and cannot be changed. In Terraform Enterprise, Cost Estimation must also be enabled in Site Administration.
`data.attributes.owners-team-saml-role-id` | string  | (nothing) | **Optional.** **SAML only** The name of the ["owners" team](/docs/enterprise/saml/team-membership.html#managing-membership-of-the-owners-team)

### Sample Payload

```json
{
  "data": {
    "type": "organizations",
    "attributes": {
      "email": "admin@example.com"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/hashicorp
```

### Sample Response

```json
{
  "id": "hashicorp",
  "type": "organizations",
  "attributes": {
    "name": "hashicorp",
    "cost-estimation-enabled": true,
    "created-at": "2017-09-07T14:34:40.492Z",
    "email": "admin@example.com",
    "session-timeout": null,
    "session-remember": null,
    "collaborator-auth-policy": "password",
    "plan-expired": false,
    "plan-expires-at": null,
    "plan-is-trial": false,
    "plan-is-enterprise": false,
    "permissions": {
      "can-update": true,
      "can-destroy": true,
      "can-access-via-teams": true,
      "can-create-module": true,
      "can-create-team": true,
      "can-create-workspace": true,
      "can-manage-users": true,
      "can-manage-subscription": true,
      "can-manage-sso": false,
      "can-update-oauth": true,
      "can-update-sentinel": true,
      "can-update-ssh-keys": true,
      "can-update-api-token": true,
      "can-traverse": true,
      "can-start-trial": false,
      "can-update-agent-pools": false
    },
    "fair-run-queuing-enabled": true,
    "saml-enabled": false,
    "owners-team-saml-role-id": null,
    "two-factor-conformant": true
  },
  "relationships": {
    "oauth-tokens": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/oauth-tokens"
      }
    },
    "authentication-token": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/authentication-token"
      }
    },
    "entitlement-set": {
      "data": {
        "id": "org-MxtxBC6ihhU6u8AG",
        "type": "entitlement-sets"
      },
      "links": {
        "related": "/api/v2/organizations/hashicorp/entitlement-set"
      }
    },
    "subscription": {
      "links": {
        "related": "/api/v2/organizations/hashicorp/subscription"
      }
    }
  },
  "links": {
    "self": "/api/v2/organizations/hashicorp"
  }
}
```

## Destroy an Organization

`DELETE /organizations/:organization_name`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to destroy

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[204][] |                                                 | The organization was successfully destroyed
[404][] | [JSON API error object][]                       | Organization not found or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/hashicorp
```

### Sample Response

The response body will be empty if successful.

## Show the Entitlement Set

This endpoint shows the [entitlements](./index.html#feature-entitlements) for an organization.

`GET /organizations/:organization_name/entitlement-set`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization's entitlement set to view

Status  | Response                                           | Reason
--------|----------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "entitlement-sets"`) | The request was successful
[404][] | [JSON API error object][]                          | Organization not found or user unauthorized to perform action


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/hashicorp/entitlement-set
```

### Sample Response

```json
{
  "data": {
    "id": "hashicorp",
    "type": "entitlement-sets",
    "attributes": {
      "cost-estimation": true,
      "configuration-designer": true,
      "operations": true,
      "private-module-registry": true,
      "sentinel": true,
      "state-storage": true,
      "teams": true,
      "vcs-integrations": true,
      "usage-reporting": false,
      "user-limit": null,
      "self-serve-billing": true,
      "audit-logging": false,
      "agents": false,
      "sso": false
    },
    "links":{
      "self": "api/v2/entitlement-sets/hashicorp"
    }
  }
}
```
