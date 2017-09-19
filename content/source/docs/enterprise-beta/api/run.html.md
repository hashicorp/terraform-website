---
layout: enterprise2
page_title: "Runs - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-run"
---

# Runs API

-> **Note**: These API Endpoints are not yet available on `https://atlas.hashicorp.com/api/v2/` and may be subject to change before they are made available.

Performing a run on a new configuration is a multi step process.

1. Create a Configuration Version on the Workspace
2. Upload configuration files to the Configuration Version
3. Create a Run on the Workspace
4. Create and queue a Plan on the Run; this is done automatically when the Run is created
5. Create and queue an Apply on the Run


## Create a Configuration Version on the Workspace

A Configuration Version (`configuration-version`) is an resource used to reference the uploaded configuration files. It is associated with the Run to use the uploaded configuration files for performing the Plan and Apply.

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

## Upload Configuration files

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

A Run performs a Plan and Apply on the last configuration version created and using the variables set in the workspace.

| Method | Path           |
| :----- | :------------- |
| POST | /runs |

### Parameters

- `id` (`string: <required>`) - specifies the workspace ID to run
- `is-destroy` (`bool: false`) - specifies if this plan is a destory plan, which will destroy all provisioned resources.

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "is-destroy":false
    },
    "relationships": {
      "workspace": {
        "data": {
          "type":"workspaces",
          "id":"ws-4j8p6jX1w33MiDC7"
        }
      }
    },
    "type":"runs"
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

## Create and queue an Apply on the Run

| Method | Path           |
| :----- | :------------- |
| POST | /runs/:run_id/actions/apply |

### Parameters

- `run_id` (`string: <required>`) - specifies the run ID to run
- `id` (`string: <required>`) - specifies the workspace ID

### Sample Payload

```json
{
  "data": {
    "attributes": {
      "is-destroy":false
    },
    "relationships": {
      "workspace": {
        "data": {
          "type":"workspaces",
          "id":"ws-4j8p6jX1w33MiDC7"
        }
      }
    },
    "type":"runs"
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
  https://atlas.hashicorp.com/api/v2/runs/run-DQGdmrWMX8z9yWQB/actions/apply
```

### Sample Response

```json
{
  "data": {
    "id":"apply-asdRRMYRZS2o4Qhn",
    "type":"applies",
    "attributes": {
      "status":"pending",
      "status-timestamps": {},
      "log-read-url":"https://archivist.hashicorp.com/v1/object/dmF1bHQ6djE6em1wNGpRczhGR2ZTY2RURWcxNDN4RjkvMWNveVdmQU9XRXVIdWQ5ZE9WYjhhd2lFb0dqQ0VOUk1FWlBCNmVNRXVBYWUrY1UvSGNKWkEzeUp6c0FxaHd0VzhZakxBQ1VJMEFHN2NRaCtaMEZOb2hFQTA4VmZoRTBUSFdBd01iVWo3bk5YMUM3THVXQ1VpdVhKNnBWM1c0Nm1iZCtoZnNUVkc1VEViWlFHK1E9PQ=="
    },
    "links": {
      "self":"/api/v2/applies/apply-asdRRMYRZS2o4Qhn"
    }
  }
}
```

