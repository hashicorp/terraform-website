---
layout: "cloud"
page_title: "Organization Tags - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Organization Tags API

This API returns the list of tags used with all resources across the organization. Tags can be added to this pool directly or via those resources. Tags deleted here will be removed from all other resources. Tags can be added, applied, removed and deleted in bulk.

## Get Tags

`GET /organizations/:organization_name/tags`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization's module producers to view

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/hashicorp/tags
```

### Sample Response

```json
{
  "data": [
    {
      "id": "tag-1",
      "type": "tags",
      "attributes": {
        "name": "tag1",
        "instance_count": 1
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    },
    {
      "id": "tag-2",
      "type": "tags",
      "attributes": {
        "name": "tag2",
        "instance_count": 2
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          }
        }
      }
    }
  ]
}
```

## Delete tags

This endpoint deletes one or more tags from an organization. The organization and tags must already
exist. Tags deleted here will be removed from all other resources.

`DELETE /organizations/:organization_name/tags`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to delete tags from

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully removed tags from organization
[404][] | [JSON API error object][]                    | Organization not found, or user unauthorized to perform action

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

It is important to note that `type` and `id` are required.

| Key path      | Type   | Default | Description                      |
| ------------- | ------ | ------- | -------------------------------- |
| `data[].type` | string |         | Must be `"tags"`.                |
| `data[].id`   | string |         | The id of the tag to remove.     |

### Sample Payload

```json
{
  "data": [
    {
      "type": "tags",
      "id": "tag-Yfha4YpPievQ8wJw"
    }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/hashicorp/tags
```

## Sample Response

No response body.

Status code `204`.

## Add workspaces to a tag

`POST /tags/:tag_id/relationships/workspaces`

| Parameter            | Description                                          |
| -------------------- | -----------------------------------------------------|
| `:tag_id`            | The ID of the tag that workspaces should have added. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully added workspaces to tag
[404][] | [JSON API error object][]                    | Tag not found, or user unauthorized to perform action

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

| Key path      | Type   | Default | Description                      |
| ------------- | ------ | ------- | -------------------------------- |
| `data[].type` | string |         | Must be `"workspaces"`.          |
| `data[].id`   | string |         | The id of the workspace to add.  |

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/tags/tag-2/relationships/workspaces
```

### Sample Payload

```json
{
  "data": [
      {
          "type": "workspaces",
          "id": "ws-pmKTbUwH2VPiiTC4"
      }
  ]
}
```

### Sample Response

No response body.

Status code `204`.

## Remove workspaces from a tag

`DELETE /tags/:tag_id/relationships/workspaces`

| Parameter            | Description                                          |
| -------------------- | -----------------------------------------------------|
| `:tag_id`            | The ID of the tag that workspaces should have removed. |

Status  | Response                                     | Reason(s)
--------|----------------------------------------------|----------
[204][] | Nothing                                      | Successfully removed workspaces from tag
[404][] | [JSON API error object][]                    | Tag not found, or user unauthorized to perform action

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

| Key path      | Type   | Default | Description                         |
| ------------- | ------ | ------- | ----------------------------------- |
| `data[].type` | string |         | Must be `"workspaces"`.             |
| `data[].id`   | string |         | The id of the workspace to remove.  |

### Sample Payload

```json
{
  "data": [
      {
          "type": "workspaces",
          "id": "ws-pmKTbUwH2VPiiTC4"
      }
  ]
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  --data @payload.json \
  https://app.terraform.io/api/v2/tags/tag-2/relationships/workspaces
```

### Sample Response

No response body.

Status code `204`.
