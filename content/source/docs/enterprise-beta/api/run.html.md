---
layout: enterprise2
page_title: "Runs - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-run"
---

# Runs API

-> **Note**: These API endpoints are in beta and are subject to change.

Performing a run on a new configuration is a multi step process.

1. [Create a configuration version on the workspace](./configuration-versions.html#create-a-configuration-version)
2. [Upload configuration files to the configuration version](./configuration-versions.html#upload-configuration-files)
3. [Create a Run on the workspace](#create-a-run)
4. [Create and queue an apply on the run](#apply)

## Create a Run

A run performs a plan and apply on the last configuration version created and using the variables set in the workspace.

| Method | Path           |
| :----- | :------------- |
| POST | /runs |

### Parameters

- `id` (`string: <required>`) - specifies the workspace ID to run
- `is-destroy` (`bool: false`) - specifies if this plan is a destroy plan, which will destroy all provisioned resources.
- `workspace_id` (`string: <required>`) - specifies the workspace ID where the run will be executed.

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
  https://atlas.hashicorp.com/api/v2/runs
```

### Sample Response

```json
{
  "data": {
    "id":"run-DQGdmrWMX8z9yWQB",
    "type":"runs",
    "attributes": {
      "auto-apply":false,
      "error-text":null,
      "is-destroy":false,
      "message":"Run from QUEUE PLAN",
      "metadata": {},
      "source":"configuration_version",
      "status":"pending",
      "status-timestamps":{},
      "terraform-version":"0.10.3"
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
      "workspace-comments": {...},
      "workspace-run-alerts": {...}
      }
    },
    "links": {
      "self":"/api/v2/runs/run-DQGdmrWMX8z9yWQB"
    }
  }
}
```

## Apply
The `apply` endpoint represents an action as opposed to a resource. As such, the endpoint does not return any object in the response body. This endpoint queues the request to perform an apply, the apply may happen at a later time.

| Method | Path           |
| :----- | :------------- |
| POST | /runs/:run_id/actions/apply |

### Parameters

- `run_id` (`string: <required>`) - specifies the run ID to run
- `comment` (`string: <optional>`) - specifies the workspace ID

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
  https://atlas.hashicorp.com/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/apply
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
  https://atlas.hashicorp.com/api/v2/workspaces/ws-yF7z4gyEQRhaCNG9/runs
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
        "may-canceled": false,
        "may-confirm": true,
        "may-discarded": true,
        "has-changes": true,
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
        "workspace-comments": {...},
        "workspace-run-alerts": {...},
      "links": {
        "self": "/api/v2/runs/run-bWSq4YeYpfrW4mx7"
      }
    },
    ...
  ]
}
```