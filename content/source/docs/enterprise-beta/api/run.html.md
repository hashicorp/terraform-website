---
layout: enterprise2
page_title: "Runs - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-run"
---

# Runs API

-> **Note**: These API endpoints are in beta and are subject to change.

Performing a run on a new configuration is a multi step process.

1. Create a configuration version on the workspace
2. Upload configuration files to the configuration version
3. Create a Run on the workspace
4. Create and queue a plan on the run; this is done automatically when the run is created
5. Create and queue an apply on the run


## Create a Configuration Version on the Workspace

A configuration version (`configuration-version`) is an resource used to reference the uploaded configuration files. It is associated with the run to use the uploaded configuration files for performing the plan and apply.

| Method | Path           |
| :----- | :------------- |
| POST | /workspaces/:workspace_id/configuration-versions |

### Parameters

- `:workspace_id` (`string: <required>`) - specifies the workspace ID to create the new configuration version

### Sample Payload

```json
{
  "data": {
    "type": "configuration-versions"
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
  https://atlas.hashicorp.com/api/v2/workspaces/ws-2Qhk7LHgbMrm3grF/configuration-vesions
```

### Sample Response

```json
{
  "data": {
    "id": "cv-ntv3HbhJqvFzamy7",
    "type": "configuration-versions",
    "attributes": {
      "upload-url": "http://127.0.0.1:7675/v1/object/4c44d964-eba7-4dd5-ad29-1ece7b99e8da"
      ...
    }
  }
}
```

## Upload Configuration Files

-> **Note**: Uploading a configuration file automatically creates a run and associates with this configuration-version. Therefore it is unnecessary to [create a run on the workspace](#create-a-run-on-the-workspace) if a new file is uploaded.

| Method | Path           |
| :----- | :------------- |
| POST | The upload URL is provided in the `upload-url` attribute in the `configuration-versions` resource |

### Parameters

- `data` (`file: <required>`) - A local .tar.gz file containing the folder of the terraform configuration files.

### Sample Request

```shell
$ curl \
    --request POST \
    -F 'data=@config.tar.gz` \
    http://127.0.0.1:7675/v1/object/4c44d964-eba7-4dd5-ad29-1ece7b99e8da
```


## Create a Run on the Workspace

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

## Create and Queue an Apply on the Run

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


