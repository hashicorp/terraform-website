---
layout: enterprise2
page_title: "Runs - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-run"
---

# Runs API

-> **Note**: These API endpoints are in beta and are subject to change.

Performing a run on a new configuration is a multi step process.

1. [Create a configuration version on the workspace](./configuration-versions.html#create-a-configuration-version).
2. [Upload configuration files to the configuration version](./configuration-versions.html#upload-configuration-files).
3. [Create a Run on the workspace](#create-a-run); this is done automatically when a configuration file is uploaded.
4. [Create and queue an apply on the run](#apply); if auto-apply is not enabled.

Alternately, you can create a run with a pre-existing configuration version, even one from another workspace. This is useful for promoting known good code from one workspace to another.

## Create a Run

A run performs a plan and apply, using a configuration version and the workspace’s current variables. You can specify a configuration version when creating a run; if you don’t provide one, the run defaults to the workspace’s most recently used version. (A configuration version is “used” when it is created or used for a run in this workspace.)

| Method | Path           |
| :----- | :------------- |
| POST | /runs |

### Parameters

- `id` (`string: <required>`) - specifies the workspace ID to run
- `is-destroy` (`bool: false`) - specifies if this plan is a destroy plan, which will destroy all provisioned resources.
- `workspace_id` (`string: <required>`) - specifies the workspace ID where the run will be executed.
- `configuration-version-id` (`string: <optional>`) - specifies the configuration version to use for this run. If the `configuration-version` object is omitted, the run will be created using the workspace's latest configuration version.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "is-destroy":false
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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs
```

### Sample Response

```json
{
  "data": {
    "id": "run-CZcmD7eagjhyXavN",
    "type": "runs",
    "attributes": {
      "auto-apply": false,
      "error-text": null,
      "is-destroy": false,
      "message": "Queued manually in Terraform Enterprise",
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
      "self": "/api/v2/runs/run-CZcmD7eagjhyXavN"
    }
  }
}
```

## Apply

The `apply` endpoint represents an action as opposed to a resource. As such, the endpoint does not return any object in the response body. This endpoint queues the request to perform an apply; the apply might not happen immediately.

| Method | Path           |
| :----- | :------------- |
| POST | /runs/:run_id/actions/apply |

### Parameters

- `run_id` (`string: <required>`) - specifies the run ID to run
- `comment` (`string: <optional>`) - Optional comment to add on the apply

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/apply
```


## List Runs

This endpoint lists the runs in a workspace

| Method | Path           |
| :----- | :------------- |
| GET | /workspaces/:workspace_id/runs |

### Parameters

- `workspace_id` (`string: <required>`) - specifies the workspace ID for the runs to list.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
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
        },
        "permissions": {
          "can-apply": true,
          "can-cancel": true,
          "can-discard": true,
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
        "workspace-run-alerts": {...},
      "links": {
        "self": "/api/v2/runs/run-bWSq4YeYpfrW4mx7"
      }
    },
    ...
  ]
}
```

# Discard

The `discard` endpoint represents an action as opposed to a resource. As such, the endpoint does not return any object in the response body. This endpoint queues the request to perform a discard; the discard might not happen immediately.

| Method | Path           |
| :----- | :------------- |
| POST | /runs/:run_id/actions/discard |

### Parameters

- `run_id` (`string: <required>`) - specifies the run ID to run
- `comment` (`string: <optional>`) - Optional comment to add on the discard

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
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/discard
```