---
layout: enterprise2
page_title: "Runs - API Docs - Terraform Enterprise Beta"
---

# Runs API

Performing a run requires creation of a run which also creates a plan. Once a plan is executed the workspace may automatically trigger an apply if the workspace is configured to automatically perform the apply. If it is not configured to automatically perform an apply, you can perform the Apply vai the API.

## Create a Run on the Workspace

**Method**: POST
**Path**: /runs

### Parameters

- `id` (string: \<required\>) - specifies the workspace ID to run
- `is-destroy` (bool: false) - specifies if this plan is a destory plan, which will destroy all provisioned resources.

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

## Applying a plan in a Run

**Method**: POST
**Path**: /runs/:run_id/actions/apply

### Parameters

- `run_id` (string: \<required\>) - specifies the run ID to run
- `id` (string: \<required\>) - specifies the workspace ID

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

##