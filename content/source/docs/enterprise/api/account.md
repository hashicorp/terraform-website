---
layout: enterprise2
page_title: "Account - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-account"
---

# Account API

-> **Note**: These API endpoints are in beta and are subject to change.

Account represents the current user interacting with Terraform.

## Enable Two Factor Authentication

`POST /account/actions/two-factor-enable`

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path                     | Type   | Default | Description                                                                 |
| ---------------------------- | ------ | ------- | --------------------------------------------------------------------------- |
| `data.type`                  | string |         | Must be `"users"`.                                                          |
| `data.attributes.delivery`   | string |         | The preferred delivery method for 2FA. Valid values are `"app"` or `"sms"`. |
| `data.attributes.sms-number` | string | `null`  | An SMS number for the SMS delivery method.                                  |

### Sample Payload

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "delivery": "sms",
      "sms-number": "+1555555555"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/account/actions/two-factor-enable
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "avatar-url": "https://www.gravatar.com/avatar/...?s=100\u0026d=mm",
      "is-service-account": false,
      "two-factor": {
        "delivery": "sms",
        "enabled": true,
        "sms-number": "+15555555555",
        "verified": false
      },
      "username": "user-2fa",
      "v2-only": false
    },
    "id": "user_d3cab177",
    "links": { "self": "/api/v2/users/user-2fa" },
    "relationships": {
      "authentication-tokens": {
        "links": { "related": "/api/v2/users/user-2fa/authentication-tokens" }
      }
    },
    "type": "users"
  }
}
```

## Disable Two Factor Authentication

`POST /account/actions/two-factor-disable`

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/account/actions/two-factor-disable
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "avatar-url": "https://www.gravatar.com/avatar/...?s=100\u0026d=mm",
      "is-service-account": false,
      "two-factor": {
        "delivery": null,
        "enabled": false,
        "sms-number": null,
        "verified": false
      },
      "username": "user-2fa",
      "v2-only": false
    },
    "id": "user_d3cab177",
    "links": { "self": "/api/v2/users/user-2fa" },
    "relationships": {
      "authentication-tokens": {
        "links": { "related": "/api/v2/users/user-2fa/authentication-tokens" }
      }
    },
    "type": "users"
  }
}
```

## Verify Two Factor Authentication

`POST /account/actions/two-factor-verify`

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path               | Type   | Default | Description                                                      |
| ---------------------- | ------ | ------- | ---------------------------------------------------------------- |
| `data.type`            | string |         | Must be `"users"`.                                               |
| `data.attributes.code` | string |         | The verification code received by SMS or through an application. |

### Sample Payload

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "code": "123456"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/account/actions/two-factor-verify
```

### Sample Response

```json
{
  "data": {
    "attributes": {
      "avatar-url": "https://www.gravatar.com/avatar/...?s=100\u0026d=mm",
      "is-service-account": false,
      "two-factor": {
        "delivery": "sms",
        "enabled": true,
        "recovery-codes": [
          "123456",
          "654321",
          "098765",
          "567890",
          "135791",
          "246802"
        ],
        "sms-number": "+15555555555",
        "used-recovery-codes": [],
        "verified": true
      },
      "username": "user-2fa",
      "v2-only": false
    },
    "id": "user_d3cab177",
    "links": { "self": "/api/v2/users/user-2fa" },
    "relationships": {
      "authentication-tokens": {
        "links": { "related": "/api/v2/users/user-2fa/authentication-tokens" }
      }
    },
    "type": "users"
  }
}
```

## Resend Two Factor Authentication Verification Code

`POST /account/actions/two-factor-resend-verification-code`

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/account/actions/two-factor-resend-verification-code
```

### Sample Response

```json
null
```
