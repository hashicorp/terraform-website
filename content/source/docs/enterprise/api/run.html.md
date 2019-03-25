---
layout: enterprise2
page_title: "Runs - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-run"
---

# Runs API

-> **Note**: These API endpoints are in beta and are subject to change.

-> **Note:** Before working with the runs or configuration versions APIs, read the [API-driven run workflow](../run/api.html) page, which includes both a full overview of this workflow and a walkthrough of a simple implementation of it.

Performing a run on a new configuration is a multi-step process.

1. [Create a configuration version on the workspace](./configuration-versions.html#create-a-configuration-version).
2. [Upload configuration files to the configuration version](./configuration-versions.html#upload-configuration-files).
3. [Create a run on the workspace](#create-a-run); this is done automatically when a configuration file is uploaded.
4. [Create and queue an apply on the run](#apply-a-run); if the run can't be auto-applied.

Alternatively, you can create a run with a pre-existing configuration version, even one from another workspace. This is useful for promoting known good code from one workspace to another.

## Create a Run

`POST /runs`

A run performs a plan and apply, using a configuration version and the workspace’s current variables. You can specify a configuration version when creating a run; if you don’t provide one, the run defaults to the workspace’s most recently used version. (A configuration version is “used” when it is created or used for a run in this workspace.)

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.attributes.is-destroy` | bool | false | Specifies if this plan is a destroy plan, which will destroy all provisioned resources.
`data.attributes.message` | string | "Queued manually via the Terraform Enterprise API" | Specifies the message to be associated with this run.
`data.relationships.workspace.data.id` | string | | Specifies the workspace ID where the run will be executed.
`data.relationships.configuration-version.data.id` | string | (nothing) | Specifies the configuration version to use for this run. If the `configuration-version` object is omitted, the run will be created using the workspace's latest configuration version.

Status  | Response                               | Reason
--------|----------------------------------------|-------
[201][] | [JSON API document][] (`type: "runs"`) | Successfully created a run
[404][] | [JSON API error object][]              | Organization or workspace not found, or user unauthorized to perform action
[422][] | [JSON API error object][]              | Malformed request body (missing attributes, wrong types, etc.)

[JSON API document]: /docs/enterprise/api/index.html#json-api-documents
[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422


### Sample Payload

```json
{
  "data": {
    "attributes": {
      "is-destroy":false,
      "message": "Custom message"
    },
    "type":"runs",
    "relationships": {
      "workspace": {
        "data": {
          "type": "workspaces",
          "id": "ws-LLGHCr4SWy28wyGN"
        }
      },
      "configuration-version": {
        "data": {
          "type": "configuration-versions",
          "id": "cv-n4XQPBa2QnecZJ4G"
        }
      }
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
  https://app.terraform.io/api/v2/runs
```

### Sample Response

```json
{
  "data": {
    "id": "run-CZcmD7eagjhyX0vN",
    "type": "runs",
    "attributes": {
      "auto-apply": false,
      "error-text": null,
      "is-destroy": false,
      "message": "Custom Message",
      "metadata": {},
      "source": "tfe-ui",
      "status": "pending",
      "status-timestamps": {},
      "terraform-version": "0.10.8",
      "created-at": "2017-11-29T19:56:15.205Z",
      "has-changes": false,
      "actions": {
        "is-cancelable": true,
        "is-confirmable": false,
        "is-discardable": false,
      },
      "permissions": {
        "can-apply": true,
        "can-cancel": true,
        "can-discard": true,
        "can-force-execute": true
      }
    },
    "relationships": {
      "apply": {...},
      "canceled-by": { ... },
      "configuration-version": {...},
      "confirmed-by": {...},
      "created-by": {...},
      "input-state-version": {...},
      "plan": {...},
      "run-events": {...},
      "policy-checks": {...},
      "workspace": {...},
      "comments": {...},
      "workspace-run-alerts": {...}
      }
    },
    "links": {
      "self": "/api/v2/runs/run-CZcmD7eagjhyX0vN"
    }
  }
}
```

## Apply a Run

`POST /runs/:run_id/actions/apply`

Parameter | Description
----------|------------
`run_id`  | The run ID to apply

Applies a run that is paused waiting for confirmation after a plan. This includes runs in the "needs confirmation" and "policy checked" states. This action is only required for runs that can't be auto-applied. (Plans can be auto-applied if the auto-apply setting is enabled on the workspace, the plan is not a destroy plan, and the plan was not queued by a user without write permissions.)

This endpoint queues the request to perform an apply; the apply might not happen immediately.

This endpoint represents an action as opposed to a resource. As such, the endpoint does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).


Status  | Response                  | Reason(s)
--------|---------------------------|----------
[202][] | none                      | Successfully queued an apply request.
[409][] | [JSON API error object][] | Run was not paused for confirmation; apply not allowed.

[202]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
[409]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
[JSON API error object]: http://jsonapi.org/format/#error-objects


### Request Body

This POST endpoint allows an optional JSON object with the following properties as a request payload.

Key path  | Type   | Default | Description
----------|--------|---------|------------
`comment` | string | `null`  | An optional comment about the run.

### Sample Payload

This payload is optional, so the `curl` command will work without the `--data @payload.json` option too.

```json
{
  "comment":"Looks good to me"
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/apply
```


## List Runs in a Workspace

`GET /workspaces/:workspace_id/runs`

Parameter      | Description
---------------|------------
`workspace_id` | The workspace ID to list runs for.

Status  | Response                                         | Reason
--------|--------------------------------------------------|-------
[200][] | Array of [JSON API document][]s (`type: "runs"`) | Successfully listed runs

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200 

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]` | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`   | **Optional.** If omitted, the endpoint will return 20 runs per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-yF7z4gyEQRhaCNG9/runs
```

### Sample Response

```json
{
  "data": [
    {
      "id": "run-bWSq4YeYpfrW4mx7",
      "type": "runs",
      "attributes": {
        "auto-apply": false,
        "error-text": null,
        "is-destroy": false,
        "message": "",
        "metadata": {},
        "source": "tfe-configuration-version",
        "status": "planned",
        "status-timestamps": {
          "planned-at": "2017-11-28T22:52:51+00:00"
        },
        "terraform-version": "0.11.0",
        "created-at": "2017-11-28T22:52:46.711Z",
        "has-changes": true,
        "actions": {
          "is-cancelable": false,
          "is-confirmable": true,
          "is-discardable": true,
          "is-force-cancelable": false
        },
        "permissions": {
          "can-apply": true,
          "can-cancel": true,
          "can-discard": true,
          "can-force-cancel": false,
          "can-force-execute": true
        }
      },
      "relationships": {
        "workspace": {...},
        "apply": {...},
        "canceled-by": {...},
        "configuration-version": {...},
        "confirmed-by": {...},
        "created-by": {...},
        "input-state-version": {...},
        "plan": {...},
        "run-events": {...},
        "policy-checks": {...},
        "comments": {...},
        "workspace-run-alerts": {...}
      },
      "links": {
        "self": "/api/v2/runs/run-bWSq4YeYpfrW4mx7"
      }
    },
    {...}
  ]
}
```

## Get run details

`GET /runs/:run_id`

Parameter     | Description
--------------|----------------------
`:run_id`     | The run ID to get.

This endpoint is used for showing details of a specific run.

Status  | Response                               | Reason
--------|----------------------------------------|-------
[200][] | [JSON API document][] (`type: "runs"`) | Success
[404][] | [JSON API error object][]              | Run not found or user not authorized

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/runs/run-bWSq4YeYpfrW4mx7
```

### Sample Response

```json
{
  "data": {
    "id": "run-bWSq4YeYpfrW4mx7",
    "type": "runs",
    "attributes": {
      "auto-apply": false,
      "error-text": null,
      "is-destroy": false,
      "message": "",
      "metadata": {},
      "source": "tfe-configuration-version",
      "status": "planned",
      "status-timestamps": {
        "planned-at": "2017-11-28T22:52:51+00:00"
      },
      "terraform-version": "0.11.0",
      "created-at": "2017-11-28T22:52:46.711Z",
      "has-changes": true,
      "actions": {
        "is-cancelable": false,
        "is-confirmable": true,
        "is-discardable": true,
        "is-force-cancelable": false
      },
      "permissions": {
        "can-apply": true,
        "can-cancel": true,
        "can-discard": true,
        "can-force-cancel": false,
        "can-force-execute": true
      }
    },
    "relationships": {
      "workspace": {...},
      "apply": {...},
      "canceled-by": {...},
      "configuration-version": {...},
      "confirmed-by": {...},
      "created-by": {...},
      "input-state-version": {...},
      "plan": {...},
      "run-events": {...},
      "policy-checks": {...},
      "comments": {...},
      "workspace-run-alerts": {...}
    },
    "links": {
      "self": "/api/v2/runs/run-bWSq4YeYpfrW4mx7"
    }
  }
}
```

## Discard a Run

`POST /runs/:run_id/actions/discard`

Parameter | Description
----------|------------
`run_id`  | The run ID to discard

The `discard` action can be used to skip any remaining work on runs that are paused waiting for confirmation or priority. This includes runs in the "pending," "needs confirmation," "policy checked," and "policy override" states.

This endpoint queues the request to perform a discard; the discard might not happen immediately. After discarding, the run is completed and later runs can proceed.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                  | Reason(s)
--------|---------------------------|----------
[202][] | none                      | Successfully queued a discard request.
[409][] | [JSON API error object][] | Run was not paused for confirmation or priority; discard not allowed.

### Request Body

This POST endpoint allows an optional JSON object with the following properties as a request payload.

Key path  | Type   | Default | Description
----------|--------|---------|------------
`comment` | string | `null`  | An optional explanation for why the run was discarded.


### Sample Payload

This payload is optional, so the `curl` command will work without the `--data @payload.json` option too.

```json
{
  "comment": "This run was discarded"
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/discard
```

## Cancel a Run

`POST /runs/:run_id/actions/cancel`

Parameter | Description
----------|------------
`run_id`  | The run ID to cancel

The `cancel` action can be used to interrupt a run that is currently planning or applying. Performing a cancel is roughly equivalent to hitting ctrl+c during a Terraform plan or apply on the CLI. The running Terraform process is sent an `INT` signal, which instructs Terraform to end its work and wrap up in the safest way possible.

This endpoint queues the request to perform a cancel; the cancel might not happen immediately. After canceling, the run is completed and later runs can proceed.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                  | Reason(s)
--------|---------------------------|----------
[202][] | none                      | Successfully queued a cancel request.
[409][] | [JSON API error object][] | Run was not planning or applying; cancel not allowed.
[404][] | [JSON API error object][] | Run was not found or user not authorized.

### Request Body

This POST endpoint allows an optional JSON object with the following properties as a request payload.

Key path  | Type   | Default | Description
----------|--------|---------|------------
`comment` | string | `null`  | An optional explanation for why the run was canceled.

### Sample Payload

This payload is optional, so the `curl` command will work without the `--data @payload.json` option too.

```json
{
  "comment": "This run was stuck and would never finish."
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/cancel
```

## Forcefully cancel a run

`POST /runs/:run_id/actions/force-cancel`

Parameter | Description
----------|------------
`run_id`  | The run ID to cancel

The `force-cancel` action is like [cancel](#cancel-a-run), but ends the run immediately. Once invoked, the run is placed into a `canceled` state, and the running Terraform process is terminated. The workspace is immediately unlocked, allowing further runs to be queued. The `force-cancel` operation requires workspace admin privileges.

This endpoint enforces a prerequisite that a [non-forceful cancel](#cancel-a-run) is performed first, and a cool-off period has elapsed. To determine if this criteria is met, it is useful to check the `data.attributes.is-force-cancelable` value of the [run details endpoint](#get-run-details). The time at which the force-cancel action will become available can be found using the [run details endpoint](#get-run-details), in the key `data.attributes.force_cancel_available_at`. Note that this key is only present in the payload after the initial cancel has been initiated.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

~> **Warning:** This endpoint has potentially dangerous side-effects, including loss of any in-flight state in the running Terraform process. Use this operation with extreme caution.

Status  | Response                  | Reason(s)
--------|---------------------------|----------
[202][] | none                      | Successfully queued a cancel request.
[409][] | [JSON API error object][] | Run was not planning or applying, has not been canceled non-forcefully, or the cool-off period has not yet passed.
[404][] | [JSON API error object][] | Run was not found or user not authorized.

### Request Body

This POST endpoint allows an optional JSON object with the following properties as a request payload.

Key path  | Type   | Default | Description
----------|--------|---------|------------
`comment` | string | `null`  | An optional explanation for why the run was canceled.

### Sample Payload

This payload is optional, so the `curl` command will work without the `--data @payload.json` option too.

```json
{
  "comment": "This run was stuck and would never finish."
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/force-cancel
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

- `plan` - Additional information about plans.
- `apply` - Additional information about applies.
- `created_by` - Full user records of the users responsible for creating the runs.
- `configuration_version` - The configuration record used in the run.
- `configuration_version.ingress_attributes` - The commit information used in the run.
