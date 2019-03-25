---
layout: enterprise2
page_title: "Notification Configurations - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-notification-configurations"
---

# Notification Configurations API

-> **Note**: These API endpoints are in beta and are subject to change.

Terraform Enterprise can be configured to send notifications for run state transitions. The configuration allows you to specify a destination URL, request type, and what events will trigger the notification. Each workspace can have up to 20 notification configurations, and they apply to all runs for that workspace.

## Notification Triggers

Notifications are sent as the run progresses, and can be triggered on one or more types of state transition. These are specified in the `triggers` array attribute. Available triggers are:

Display Name    | Value                   | Description
----------------|-------------------------|---------------------------------
Created         | `"run:created"`         | When a run is created and enters the "Pending" state.
Planning        | `"run:planning"`        | When a run acquires the lock and starts to execute.
Needs Attention | `"run:needs_attention"` | Human decision required. When a plan has changes and is not auto-applied, or requires a policy override.
Applying        | `"run:applying"`        | When a run begins the apply stage, after a plan is confirmed or auto-applied.
Completed       | `"run:completed"`       | When the run has completed on a happy path and can't go any further.
Errored         | `"run:errored"`         | When the run has terminated early due to error or cancelation.

## Notification Payload

The notification is an HTTP POST request with a detailed payload describing the run. The payload depends on the type of notification configured.

For Slack notifications, the payload conforms to the Slack webhook API, and will result in a message posted with informational attachments. (For an example, see [the Slack section of the notifications docs](../workspaces/notifications.html#slack).) For Generic notifications, the payload has several fields:

Name                             | Type   | Description
---------------------------------|--------|-------------
`payload_version`                | number | Currently always "1".
`notification_configuration_id`  | string | ID of the configuration which defined this notification.
`run_url`                        | string | URL used to access the run UI page.
`run_id`                         | string | ID of the run which triggered this notification.
`run_message`                    | string | The reason the run was queued.
`run_created_at`                 | string | Timestamp of the run's creation.
`run_created_by`                 | string | Username of the user who created the run.
`workspace_id`                   | string | ID of the run's workspace.
`workspace_name`                 | string | Human-readable name of the run's workspace.
`organization_name`              | string | Human-readable name of the run's organization.
`notifications`                  | array  | List of events which caused this notification to be sent, with each event represented by an object. At present, this is always one event, but in the future TFE may roll up several notifications for a run into a single request.
`notifications[].message`        | string | Human-readable reason for the notification.
`notifications[].trigger`        | string | Value of the trigger which caused the notification to be sent.
`notifications[].run_status`     | string | Status of the run at the time of notification.
`notifications[].run_updated_at` | string | Timestamp of the run's update.
`notifications[].run_updated_by` | string | Username of the user who caused the run to update.

### Sample Payload

```json
{
  "payload_version": 1,
  "notification_configuration_id": "nc-AeUQ2zfKZzW9TiGZ",
  "run_url": "https://app.terraform.io/app/acme-org/my-workspace/runs/run-FwnENkvDnrpyFC7M",
  "run_id": "run-FwnENkvDnrpyFC7M",
  "run_message": "Add five new queue workers",
  "run_created_at": "2019-01-25T18:34:00.000Z",
  "run_created_by": "sample-user",
  "workspace_id": "ws-XdeUVMWShTesDMME",
  "workspace_name": "my-workspace",
  "organization_name": "acme-org",
  "notifications": [
    {
      "message": "Run Canceled",
      "trigger": "run:errored",
      "run_status": "canceled",
      "run_updated_at": "2019-01-25T18:37:04.000Z",
      "run_updated_by": "sample-user"
    }
  ]
}
```

## Notification Authenticity

If a `token` is configured, Terraform Enterprise provides an HMAC signature on all `"generic"` notification requests, using the `token` as the key. This is sent in the `X-TFE-Notification-Signature` header. The digest algorithm used is SHA-512. Notification target servers should verify the source of the HTTP request by computing the HMAC of the request body using the same shared secret, and dropping any requests with invalid signatures.

Sample Ruby code for verifying the HMAC:

```ruby
token = SecureRandom.hex
hmac = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("sha512"), token, @request.body)
fail "Invalid HMAC" if hmac != @request.headers["X-TFE-Notification-Signature"]
```

## Notification Verification and Delivery Responses

When saving a configuration with `enabled` set to `true`, or when using the [verify API][], Terraform Enterprise sends a verification request to the configured URL. The response to this request is stored and available in the `delivery-responses` array of the `notification-configuration` resource.

Configurations cannot be enabled if the verification request fails. Success is defined as an HTTP response with status code of `2xx`.

The most recent response is stored in the `delivery-responses` array.

Each delivery response has several fields:

Name         | Type   | Description
-------------|--------|-------------
`body`       | string | Response body (may be truncated).
`code`       | string | HTTP status code, e.g. `400`.
`headers`    | object | All HTTP headers received, represented as an object with keys for each header name (lowercased) and an array of string values (most arrays will be size one).
`sent-at`    | date   | The UTC timestamp when the notification was sent.
`successful` | bool   | Whether or not TFE considers this response to be successful.
`url`        | string | The URL to which the request was sent.

[verify API]: #verify-a-notification-configuration

## Create a Notification Configuration

`POST /workspaces/:workspace_id/notification-configurations`

Parameter       | Description
--------------- | ----------------------------------------------------
`:workspace_id` | The ID of the workspace to list configurations for. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.

Status  | Response                                                      | Reason
--------|---------------------------------------------------------------|----------
[201][] | [JSON API document][] (`type: "notification-configurations"`) | Successfully created a notification configuration
[400][] | [JSON API error object][]                                     | Unable to complete verification request to destination URL
[404][] | [JSON API error object][]                                     | Workspace not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                                     | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

If `enabled` is set to `true`, a verification request will be sent before saving the configuration. If this request receives no response or the response is not successful (HTTP 2xx), the configuration will not save.

Key path                            | Type           | Default | Description
------------------------------------|----------------|---------|------------
`data.type`                         | string         |         | Must be `"notification-configuration"`.
`data.attributes.destination-type`  | string         |         | Type of notification payload to send. Valid values are `"generic"` or `"slack"`.
`data.attributes.enabled`           | bool           | `false` | Disabled configurations will not send any notifications.
`data.attributes.name`              | string         |         | Human-readable name for the configuration.
`data.attributes.token`             | string or null | `null`  | Optional write-only secure token, which can be used at the receiving server to verify request authenticity. See [Notification Authenticity][notification-authenticity] for more details.
`data.attributes.triggers`          | array          | `[]`    | Array of triggers for which this configuration will send notifications. See [Notification Triggers][notification-triggers] for more details and a list of allowed values.
`data.attributes.url`               | string         |         | HTTP or HTTPS URL to which notification requests will be made.

[notification-authenticity]: #notification-authenticity
[notification-triggers]: #notification-triggers

### Sample Payload

```json
{
  "data": {
    "type": "notification-configurations",
    "attributes": {
      "destination-type": "generic",
      "enabled": true,
      "name": "Webhook server test",
      "url": "https://httpstat.us/200",
      "triggers": [
        "run:applying",
        "run:completed",
        "run:created",
        "run:errored",
        "run:needs_attention",
        "run:planning"
      ]
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
  https://app.terraform.io/api/v2/workspaces/ws-XdeUVMWShTesDMME/notification-configurations
```

### Sample Response

```json
{
  "data": {
    "id": "nc-AeUQ2zfKZzW9TiGZ",
    "type": "notification-configurations",
    "attributes": {
      "enabled": true,
      "name": "Webhook server test",
      "url": "https://httpstat.us/200",
      "destination-type": "generic",
      "token": null,
      "triggers": [
        "run:applying",
        "run:completed",
        "run:created",
        "run:errored",
        "run:needs_attention",
        "run:planning"
      ],
      "delivery-responses": [
        {
          "url": "https://httpstat.us/200",
          "body": "\"200 OK\"",
          "code": "200",
          "headers": {
            "cache-control": [
              "private"
            ],
            "content-length": [
              "129"
            ],
            "content-type": [
              "application/json; charset=utf-8"
            ],
            "content-encoding": [
              "gzip"
            ],
            "vary": [
              "Accept-Encoding"
            ],
            "server": [
              "Microsoft-IIS/10.0"
            ],
            "x-aspnetmvc-version": [
              "5.1"
            ],
            "access-control-allow-origin": [
              "*"
            ],
            "x-aspnet-version": [
              "4.0.30319"
            ],
            "x-powered-by": [
              "ASP.NET"
            ],
            "set-cookie": [
              "ARRAffinity=77c477e3e649643e5771873e1a13179fb00983bc73c71e196bf25967fd453df9;Path=/;HttpOnly;Domain=httpstat.us"
            ],
            "date": [
              "Tue, 08 Jan 2019 21:34:37 GMT"
            ]
          },
          "sent-at": "2019-01-08 21:34:37 UTC",
          "successful": "true"
        }
      ],
      "created-at": "2019-01-08T21:32:14.125Z",
      "updated-at": "2019-01-08T21:34:37.274Z"
    },
    "relationships": {
      "subscribable": {
        "data": {
          "id": "ws-XdeUVMWShTesDMME",
          "type": "workspaces"
        }
      }
    },
    "links": {
      "self": "/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ"
    }
  }
}
```

## List Notification Configurations

`GET /workspaces/:workspace_id/notification-configurations`

Parameter       | Description
--------------- | ----------------------------------------------------
`:workspace_id` | The ID of the workspace to list configurations from. Obtain this from the [workspace settings](../workspaces/settings.html) or the [Show Workspace](./workspaces.html#show-workspace) endpoint.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/workspaces/ws-XdeUVMWShTesDMME/notification-configurations
```

### Sample Response

```json
{
  "data": [
    {
      "id": "nc-W6VGEi8A7Cfoaf4K",
      "type": "notification-configurations",
      "attributes": {
        "enabled": false,
        "name": "Slack: #devops",
        "url": "https://hooks.slack.com/services/T00000000/BC012345/0PWCpQmYyD4bTTRYZ53q4w",
        "destination-type": "slack",
        "token": null,
        "triggers": [
          "run:errored",
          "run:needs_attention"
        ],
        "delivery-responses": [],
        "created-at": "2019-01-08T21:34:28.367Z",
        "updated-at": "2019-01-08T21:34:28.367Z"
      },
      "relationships": {
        "subscribable": {
          "data": {
            "id": "ws-XdeUVMWShTesDMME",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/notification-configurations/nc-W6VGEi8A7Cfoaf4K"
      }
    },
    {
      "id": "nc-AeUQ2zfKZzW9TiGZ",
      "type": "notification-configurations",
      "attributes": {
        "enabled": true,
        "name": "Webhook server test",
        "url": "https://httpstat.us/200",
        "destination-type": "generic",
        "token": null,
        "triggers": [
          "run:applying",
          "run:completed",
          "run:created",
          "run:errored",
          "run:needs_attention",
          "run:planning"
        ],
        "delivery-responses": [
          {
            "url": "https://httpstat.us/200",
            "body": "\"200 OK\"",
            "code": "200",
            "headers": {
              "cache-control": [
                "private"
              ],
              "content-length": [
                "129"
              ],
              "content-type": [
                "application/json; charset=utf-8"
              ],
              "content-encoding": [
                "gzip"
              ],
              "vary": [
                "Accept-Encoding"
              ],
              "server": [
                "Microsoft-IIS/10.0"
              ],
              "x-aspnetmvc-version": [
                "5.1"
              ],
              "access-control-allow-origin": [
                "*"
              ],
              "x-aspnet-version": [
                "4.0.30319"
              ],
              "x-powered-by": [
                "ASP.NET"
              ],
              "set-cookie": [
                "ARRAffinity=77c477e3e649643e5771873e1a13179fb00983bc73c71e196bf25967fd453df9;Path=/;HttpOnly;Domain=httpstat.us"
              ],
              "date": [
                "Tue, 08 Jan 2019 21:34:37 GMT"
              ]
            },
            "sent-at": "2019-01-08 21:34:37 UTC",
            "successful": "true"
          }
        ],
        "created-at": "2019-01-08T21:32:14.125Z",
        "updated-at": "2019-01-08T21:34:37.274Z"
      },
      "relationships": {
        "subscribable": {
          "data": {
            "id": "ws-XdeUVMWShTesDMME",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ"
      }
    }
  ]
}

```

## Show a Notification Configuration

`GET /notification-configurations/:notification-configuration-id`

Parameter                        | Description
-------------------------------- | -------------------------------------------------
`:notification-configuration-id` | The id of the notification configuration to show.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ
```

### Sample Response

```json
{
  "data": {
    "id": "nc-AeUQ2zfKZzW9TiGZ",
      "type": "notification-configurations",
      "attributes": {
        "enabled": true,
        "name": "Webhook server test",
        "url": "https://httpstat.us/200",
        "destination-type": "generic",
        "token": null,
        "triggers": [
          "run:applying",
          "run:completed",
          "run:created",
          "run:errored",
          "run:needs_attention",
          "run:planning"
        ],
        "delivery-responses": [
        {
          "url": "https://httpstat.us/200",
          "body": "\"200 OK\"",
          "code": "200",
          "headers": {
            "cache-control": [
              "private"
            ],
            "content-length": [
              "129"
            ],
            "content-type": [
              "application/json; charset=utf-8"
            ],
            "content-encoding": [
              "gzip"
            ],
            "vary": [
              "Accept-Encoding"
            ],
            "server": [
              "Microsoft-IIS/10.0"
            ],
            "x-aspnetmvc-version": [
              "5.1"
            ],
            "access-control-allow-origin": [
              "*"
            ],
            "x-aspnet-version": [
              "4.0.30319"
            ],
            "x-powered-by": [
              "ASP.NET"
            ],
            "set-cookie": [
              "ARRAffinity=77c477e3e649643e5771873e1a13179fb00983bc73c71e196bf25967fd453df9;Path=/;HttpOnly;Domain=httpstat.us"
            ],
            "date": [
              "Tue, 08 Jan 2019 21:34:37 GMT"
            ]
          },
          "sent-at": "2019-01-08 21:34:37 UTC",
          "successful": "true"
        }
        ],
        "created-at": "2019-01-08T21:32:14.125Z",
        "updated-at": "2019-01-08T21:34:37.274Z"
      },
      "relationships": {
        "subscribable": {
          "data": {
            "id": "ws-XdeUVMWShTesDMME",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ"
      }
  }
}
```

## Update a Notification Configuration

`PATCH /notification-configurations/:notification-configuration-id`

Parameter                        | Description
-------------------------------- | ---------------------------------------------------
`:notification-configuration-id` | The id of the notification configuration to update.

If the `enabled` attribute is true, updating the configuration will cause Terraform Enterprise to send a verification request. If a response is received, it will be stored and returned in the `delivery-responses` attribute. More details in the [Notification Verification and Delivery Responses][] section above.

[Notification Verification and Delivery Responses]: #notification-verification-and-delivery-responses

Status  | Response                                                      | Reason
--------|---------------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "notification-configurations"`) | Successfully updated the notification configuration
[400][] | [JSON API error object][]                                     | Unable to complete verification request to destination URL
[404][] | [JSON API error object][]                                     | Notification configuration not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                                     | Malformed request body (missing attributes, wrong types, etc.)


### Request Body

This PATCH endpoint requires a JSON object with the following properties as a request payload.

If `enabled` is set to `true`, a verification request will be sent before saving the configuration. If this request fails to send, or the response is not successful (HTTP 2xx), the configuration will not save.

Key path                            | Type   | Default | Description
------------------------------------|--------|---------|------------
`data.type`                         | string | (previous value) | Must be `"notification-configuration"`.
`data.attributes.enabled`           | bool   | (previous value) | Disabled configurations will not send any notifications.
`data.attributes.name`              | string | (previous value) | User-readable name for the configuration.
`data.attributes.token`             | string | (previous value) | Optional write-only secure token, which can be used at the receiving server to verify request authenticity. See [Notification Authenticity][notification-authenticity] for more details.
`data.attributes.triggers`          | array  | (previous value) | Array of triggers for sending notifications. See [Notification Triggers][notification-triggers] for more details.
`data.attributes.url`               | string | (previous value) | HTTP or HTTPS URL to which notification requests will be made.

[notification-authenticity]: #notification-authenticity
[notification-triggers]: #notification-triggers

### Sample Payload

```json
{
  "data": {
    "id": "nc-W6VGEi8A7Cfoaf4K",
    "type": "notification-configurations",
    "attributes": {
      "enabled": false,
      "name": "Slack: #devops",
      "url": "https://hooks.slack.com/services/T00000001/BC012345/0PWCpQmYyD4bTTRYZ53q4w",
      "destination-type": "slack",
      "token": null,
      "triggers": [
        "run:created",
        "run:errored",
        "run:needs_attention"
      ],
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
  https://app.terraform.io/api/v2/notification-configurations/nc-W6VGEi8A7Cfoaf4K
```

### Sample Response

```json
{
  "data": {
    "id": "nc-W6VGEi8A7Cfoaf4K",
    "type": "notification-configurations",
    "attributes": {
      "enabled": false,
      "name": "Slack: #devops",
      "url": "https://hooks.slack.com/services/T00000001/BC012345/0PWCpQmYyD4bTTRYZ53q4w",
      "destination-type": "slack",
      "token": null,
      "triggers": [
        "run:created",
        "run:errored",
        "run:needs_attention"
      ],
      "delivery-responses": [],
      "created-at": "2019-01-08T21:34:28.367Z",
      "updated-at": "2019-01-08T21:49:02.103Z"
    },
    "relationships": {
      "subscribable": {
        "data": {
          "id": "ws-XdeUVMWShTesDMME",
          "type": "workspaces"
        }
      }
    },
    "links": {
      "self": "/api/v2/notification-configurations/nc-W6VGEi8A7Cfoaf4K"
    }
  },
}
```

## Verify a Notification Configuration

`POST /notification-configurations/:notification-configuration-id/actions/verify`

Parameter                        | Description
-------------------------------- | ---------------------------------------------------
`:notification-configuration-id` | The id of the notification configuration to verify.

This will cause Terraform Enterprise to send a verification request for the specified configuration. If a response is received, it will be stored and returned in the `delivery-responses` attribute. More details in the [Notification Verification and Delivery Responses][] section above.

Status  | Response                                                      | Reason
--------|---------------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "notification-configurations"`) | Successfully verified the notification configuration
[400][] | [JSON API error object][]                                     | Unable to complete verification request to destination URL

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ/actions/verify
```

### Sample Response

```json
{
  "data": {
    "id": "nc-AeUQ2zfKZzW9TiGZ",
      "type": "notification-configurations",
      "attributes": {
        "enabled": true,
        "name": "Webhook server test",
        "url": "https://httpstat.us/200",
        "destination-type": "generic",
        "token": null,
        "triggers": [
          "run:applying",
          "run:completed",
          "run:created",
          "run:errored",
          "run:needs_attention",
          "run:planning"
        ],
        "delivery-responses": [
        {
          "url": "https://httpstat.us/200",
          "body": "\"200 OK\"",
          "code": "200",
          "headers": {
            "cache-control": [
              "private"
            ],
            "content-length": [
              "129"
            ],
            "content-type": [
              "application/json; charset=utf-8"
            ],
            "content-encoding": [
              "gzip"
            ],
            "vary": [
              "Accept-Encoding"
            ],
            "server": [
              "Microsoft-IIS/10.0"
            ],
            "x-aspnetmvc-version": [
              "5.1"
            ],
            "access-control-allow-origin": [
              "*"
            ],
            "x-aspnet-version": [
              "4.0.30319"
            ],
            "x-powered-by": [
              "ASP.NET"
            ],
            "set-cookie": [
              "ARRAffinity=77c477e3e649643e5771873e1a13179fb00983bc73c71e196bf25967fd453df9;Path=/;HttpOnly;Domain=httpstat.us"
            ],
            "date": [
              "Tue, 08 Jan 2019 21:34:37 GMT"
            ]
          },
          "sent-at": "2019-01-08 21:34:37 UTC",
          "successful": "true"
        }
        ],
        "created-at": "2019-01-08T21:32:14.125Z",
        "updated-at": "2019-01-08T21:34:37.274Z"
      },
      "relationships": {
        "subscribable": {
          "data": {
            "id": "ws-XdeUVMWShTesDMME",
            "type": "workspaces"
          }
        }
      },
      "links": {
        "self": "/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ"
      }
  }
}
```

## Delete a Notification Configuration

This endpoint deletes a notification configuration.

`DELETE /notification-configurations/:notification-configuration-id`

Parameter                        | Description
-------------------------------- | ---------------------------------------------------
`:notification-configuration-id` | The id of the notification configuration to delete.

Status  | Response                  | Reason
--------|---------------------------|--------
[204][] | None                      | Successfully deleted the notification configuration
[404][] | [JSON API error object][] | Notification configuration not found, or user unauthorized to perform action


### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/notification-configurations/nc-AeUQ2zfKZzW9TiGZ
```
