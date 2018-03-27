---
layout: enterprise2
page_title: "Configuration Versions - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-configuration-versions"
---

# Configuration Versions API

-> **Note**: These API endpoints are in beta and are subject to change.

## List Configuration Versions

| Method | Path           |
| :----- | :------------- |
| GET | /workspaces/:workspace_id/configuration-versions |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/workspaces/ws-2Qhk7LHgbMrm3grF/configuration-versions
```

### Sample Response

```json
{
    "data": [
        {
            "id": "cv-ntv3HbhJqvFzamy7",
            "type": "configuration-versions",
            "attributes": {
                "error": null,
                "source": "gitlab",
                "status": "uploaded",
                "status-timestamps": {}
            },
            "relationships": {
                "ingress-attributes": {
                    "data": {
                        "id": "ia-i4MrTxmQXYxH2nYD",
                        "type": "ingress-attributes"
                    },
                    "links": {
                        "related": "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7/ingress-attributes"
                    }
                }
            },
            "links": {
                "self": "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7"
            }
        }
    ]
}
```

## Show a Configuration Version

| Method | Path           |
| :----- | :------------- |
| GET | /configuration-versions/:configuration-id |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7
```

### Sample Response

```json
{
    "data": {
        "id": "cv-ntv3HbhJqvFzamy7",
        "type": "configuration-versions",
        "attributes": {
            "error": null,
            "source": "gitlab",
            "status": "uploaded",
            "status-timestamps": {}
        },
        "relationships": {
            "ingress-attributes": {
                "data": {
                    "id": "ia-i4MrTxmQXYxH2nYD",
                    "type": "ingress-attributes"
                },
                "links": {
                    "related": "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7/ingress-attributes"
                }
            }
        },
        "links": {
            "self": "/api/v2/configuration-versions/cv-ntv3HbhJqvFzamy7"
        }
    }
}
```

## Create a Configuration Version

A configuration version (`configuration-version`) is a resource used to reference the uploaded configuration files. It is associated with the run to use the uploaded configuration files for performing the plan and apply.

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
  https://app.terraform.io/api/v2/workspaces/ws-2Qhk7LHgbMrm3grF/configuration-versions
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

-> **Note**: Uploading a configuration file automatically creates a run and associates it with this configuration-version. Therefore it is unnecessary to [create a run on the workspace](./run.html#create-a-run) if a new file is uploaded.

| Method | Path           |
| :----- | :------------- |
| POST | The upload URL is provided in the `upload-url` attribute in the `configuration-versions` resource |

### Parameters

- `data` (`file: <required>`) - A local .tar.gz file containing the folder of the terraform configuration files. This file can be created by running `tar -zcvf ./config.tar.gz .` from within the terraform configuration directory.

### Sample Request

```shell
$ curl \
    --request PUT \
    -F 'data=@config.tar.gz' \
    http://127.0.0.1:7675/v1/object/4c44d964-eba7-4dd5-ad29-1ece7b99e8da
```
