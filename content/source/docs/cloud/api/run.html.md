---
layout: "cloud"
page_title: "Runs - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Runs API

-> **Note:** Before working with the runs or configuration versions APIs, read the [API-driven run workflow](../run/api.html) page, which includes both a full overview of this workflow and a walkthrough of a simple implementation of it.

Performing a run on a new configuration is a multi-step process.

1. [Create a configuration version on the workspace](./configuration-versions.html#create-a-configuration-version).
2. [Upload configuration files to the configuration version](./configuration-versions.html#upload-configuration-files).
3. [Create a run on the workspace](#create-a-run); this is done automatically when a configuration file is uploaded.
4. [Create and queue an apply on the run](#apply-a-run); if the run can't be auto-applied.

Alternatively, you can create a run with a pre-existing configuration version, even one from another workspace. This is useful for promoting known good code from one workspace to another.

## Attributes

### Run States

The run state is found in `data.attributes.status`, and you can reference the following list of possible states.

State                  | Description
-----------------------|------------
`pending`              | The initial status of a run once it has been created.
`plan_queued`          | Once a workspace has the availability to start a new run, the next run will transition to `plan_queued`. This status indicates that the it should start as soon as the backend services that run terraform have available capacity.  In Terraform Cloud, you should seldom see this status, as our aim is to always have capacity. However, in Terraform Enterprise this status will be more common due to the self-hosted nature.
`planning`             | The planning phase of a run is in progress.
`planned`              | The planning phase of a run has completed.
`cost_estimating`      | The cost estimation phase of a run is in progress.
`cost_estimated`       | The cost estimation phase of a run has completed.
`policy_checking`      | The sentinel policy checking phase of a run is in progress.
`policy_override`      | A sentinel policy has soft failed, and can be overridden.
`policy_soft_failed`   | A sentinel policy has soft failed for a plan-only run.  This is a final state.
`policy_checked`       | The sentinel policy checking phase of a run has completed.
`confirmed`            | The plan produced by the run has been confirmed.
`planned_and_finished` | The completion of a run containing a plan only, or a run the produces a plan with no changes to apply.  This is a final state.
`apply_queued`         | Once the changes in the plan have been confirmed, the run run will transition to `apply_queued`. This status indicates that the run should start as soon as the backend services that run terraform have available capacity. In Terraform Cloud, you should seldom see this status, as our aim is to always have capacity. However, in Terraform Enterprise this status will be more common due to the self-hosted nature.
`applying`             | The applying phase of a run is in progress.
`applied`              | The applying phase of a run has completed.
`discarded`            | The run has been discarded. This is a final state.
`errored`              | The run has errored. This is a final state.
`canceled`             | The run has been canceled.
`force_canceled`       | The run has been canceled forcefully.

## Create a Run

`POST /runs`

A run performs a plan and apply, using a configuration version and the workspace’s current variables. You can specify a configuration version when creating a run; if you don’t provide one, the run defaults to the workspace’s most recently used version. (A configuration version is “used” when it is created or used for a run in this workspace.)

Creating a run requires permission to queue plans for the specified workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.attributes.is-destroy` | bool | false | Specifies if this plan is a destroy plan, which will destroy all provisioned resources. Mutually exclusive with `refresh-only`.
`data.attributes.message` | string | "Queued manually via the Terraform Enterprise API" | Specifies the message to be associated with this run.
`data.attributes.refresh` | bool | true | Specifies whether or not to refresh the state before a plan.
`data.attributes.refresh-only` | bool | false | Whether this run should use the refresh-only plan mode, which will refresh the state without modifying any resources. Mutually exclusive with `is-destroy`.
`data.attributes.replace-addrs` | array[string] | (nothing) | Specifies an optional list of resource addresses to be passed to the `-replace` flag.
`data.attributes.target-addrs` | array[string] | (nothing) | Specifies an optional list of resource addresses to be passed to the `-target` flag.
`data.relationships.workspace.data.id` | string | (nothing) | Specifies the workspace ID where the run will be executed.
`data.relationships.configuration-version.data.id` | string | (nothing) | Specifies the configuration version to use for this run. If the `configuration-version` object is omitted, the run will be created using the workspace's latest configuration version.

Status  | Response                               | Reason
--------|----------------------------------------|-------
[201][] | [JSON API document][] (`type: "runs"`) | Successfully created a run
[404][] | [JSON API error object][]              | Organization or workspace not found, or user unauthorized to perform action
[422][] | [JSON API error object][]              | Malformed request body (missing attributes, wrong types, etc.)



### Sample Payload

```json
{
  "data": {
    "attributes": {
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
      "actions": {
        "is-cancelable": true,
        "is-confirmable": false,
        "is-discardable": false,
        "is-force-cancelable": false
      },
      "canceled-at": null,
      "created-at": "2021-05-24T07:38:04.171Z",
      "has-changes": false,
      "is-destroy": false,
      "message": "Custom message",
      "plan-only": false,
      "source": "tfe-api",
      "status-timestamps": {
        "plan-queueable-at": "2021-05-24T07:38:04+00:00"
      },
      "status": "pending",
      "trigger-reason": "manual",
      "target-addrs": null,
      "permissions": {
        "can-apply": true,
        "can-cancel": true,
        "can-comment": true,
        "can-discard": true,
        "can-force-execute": true,
        "can-force-cancel": true,
        "can-override-policy-check": true
      },
      "refresh": false,
      "refresh-only": false,
      "replace-addrs": null
    },
    "relationships": {
      "apply": {...},
      "comments": {...},
      "configuration-version": {...},
      "cost-estimate": {...},
      "created-by": {...},
      "input-state-version": {...},
      "plan": {...},
      "run-events": {...},
      "policy-checks": {...},
      "workspace": {...},
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

Applies a run that is paused waiting for confirmation after a plan. This includes runs in the "needs confirmation" and "policy checked" states. This action is only required for runs that can't be auto-applied. Plans can be auto-applied if the auto-apply setting is enabled on the workspace and the plan was queued by a new VCS commit or by a user with permission to apply runs for the workspace.

-> **Note:** If the run has a soft failed sentinel policy, you will need to [override the policy check](./policy-checks.html#override-policy) before Terraform can apply the run. You can find policy check details in the `relationships` section of the [run details endpoint](#get-run-details) response.

Applying a run requires permission to apply runs for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

This endpoint queues the request to perform an apply; the apply might not happen immediately.

Since this endpoint represents an action (not a resource), it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).


Status  | Response                  | Reason(s)
--------|---------------------------|----------
[202][] | none                      | Successfully queued an apply request.
[409][] | [JSON API error object][] | Run was not paused for confirmation; apply not allowed.



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
      "id": "run-CZcmD7eagjhyX0vN",
      "type": "runs",
      "attributes": {
        "actions": {
          "is-cancelable": true,
          "is-confirmable": false,
          "is-discardable": false,
          "is-force-cancelable": false
        },
        "canceled-at": null,
        "created-at": "2021-05-24T07:38:04.171Z",
        "has-changes": false,
        "is-destroy": false,
        "message": "Custom message",
        "plan-only": false,
        "source": "tfe-api",
        "status-timestamps": {
          "plan-queueable-at": "2021-05-24T07:38:04+00:00"
        },
        "status": "pending",
        "trigger-reason": "manual",
        "target-addrs": null,
        "permissions": {
          "can-apply": true,
          "can-cancel": true,
          "can-comment": true,
          "can-discard": true,
          "can-force-execute": true,
          "can-force-cancel": true,
          "can-override-policy-check": true
        },
        "refresh": false,
        "refresh-only": false,
        "replace-addrs": null
      },
      "relationships": {
        "apply": {...},
        "comments": {...},
        "configuration-version": {...},
        "cost-estimate": {...},
        "created-by": {...},
        "input-state-version": {...},
        "plan": {...},
        "run-events": {...},
        "policy-checks": {...},
        "workspace": {...},
        "workspace-run-alerts": {...}
        }
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
    "id": "run-CZcmD7eagjhyX0vN",
    "type": "runs",
    "attributes": {
      "actions": {
        "is-cancelable": true,
        "is-confirmable": false,
        "is-discardable": false,
        "is-force-cancelable": false
      },
      "canceled-at": null,
      "created-at": "2021-05-24T07:38:04.171Z",
      "has-changes": false,
      "is-destroy": false,
      "message": "Custom message",
      "plan-only": false,
      "source": "tfe-api",
      "status-timestamps": {
        "plan-queueable-at": "2021-05-24T07:38:04+00:00"
      },
      "status": "pending",
      "trigger-reason": "manual",
      "target-addrs": null,
      "permissions": {
        "can-apply": true,
        "can-cancel": true,
        "can-comment": true,
        "can-discard": true,
        "can-force-execute": true,
        "can-force-cancel": true,
        "can-override-policy-check": true
      },
      "refresh": false,
      "refresh-only": false,
      "replace-addrs": null
    },
    "relationships": {
      "apply": {...},
      "comments": {...},
      "configuration-version": {...},
      "cost-estimate": {...},
      "created-by": {...},
      "input-state-version": {...},
      "plan": {...},
      "run-events": {...},
      "policy-checks": {...},
      "workspace": {...},
      "workspace-run-alerts": {...}
      }
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

Discarding a run requires permission to apply runs for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

This endpoint queues the request to perform a discard; the discard might not happen immediately. After discarding, the run is completed and later runs can proceed.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

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

Canceling a run requires permission to apply runs for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

This endpoint queues the request to perform a cancel; the cancel might not happen immediately. After canceling, the run is completed and later runs can proceed.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

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

The `force-cancel` action is like [cancel](#cancel-a-run), but ends the run immediately. Once invoked, the run is placed into a `canceled` state, and the running Terraform process is terminated. The workspace is immediately unlocked, allowing further runs to be queued. The `force-cancel` operation requires admin access to the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

This endpoint enforces a prerequisite that a [non-forceful cancel](#cancel-a-run) is performed first, and a cool-off period has elapsed. To determine if this criteria is met, it is useful to check the `data.attributes.is-force-cancelable` value of the [run details endpoint](#get-run-details). The time at which the force-cancel action will become available can be found using the [run details endpoint](#get-run-details), in the key `data.attributes.force_cancel_available_at`. Note that this key is only present in the payload after the initial cancel has been initiated.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

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

## Forcefully execute a run

`POST /runs/:run_id/actions/force-execute`

Parameter | Description
----------|------------
`run_id`  | The run ID to execute

The force-execute action cancels all prior runs that are not already complete, unlocking the run's workspace and allowing the run to be executed. (It initiates the same actions as the "Run this plan now" button at the top of the view of a pending run.)

Force-executing a run requires permission to apply runs for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

This endpoint enforces the following prerequisites:

* The target run is in the "pending" state.
* The workspace is locked by another run.
* The run locking the workspace can be discarded.

This endpoint represents an action as opposed to a resource. As such, it does not return any object in the response body.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

~> **Note:** While useful at times, force-executing a run circumvents the typical workflow of applying runs using Terraform Cloud. It is not intended for regular use. If you find yourself using it frequently, please reach out to HashiCorp Support for help in developing an alternative approach.

Status  | Response                  | Reason(s)
--------|---------------------------|----------
[202][] | none                      | Successfully initiated the force-execution process.
[403][] | [JSON API error object][] | Run is not pending, its workspace was not locked, or its workspace association was not found.
[409][] | [JSON API error object][] | The run locking the workspace was not in a discardable state.
[404][] | [JSON API error object][] | Run was not found or user not authorized.

### Request Body

This POST endpoint does not take a request body.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/force-execute
```

## Available Related Resources

The GET endpoints above can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

- `plan` - Additional information about plans.
- `apply` - Additional information about applies.
- `created_by` - Full user records of the users responsible for creating the runs.
- `cost_estimate` - Additional information about cost estimates.
- `configuration_version` - The configuration record used in the run.
- `configuration_version.ingress_attributes` - The commit information used in the run.
