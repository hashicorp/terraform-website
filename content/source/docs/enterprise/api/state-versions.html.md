---
layout: enterprise2
page_title: "State Versions - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-state-versions"
---

# State Versions API

-> **Note**: These API endpoints are in beta and are subject to change.

## Create a State Version

`POST /workspaces/:workspace_id/state-versions`

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `:workspace_id` | The workspace ID to create the new state version. |

Creates a state version and sets it as the head state version for the given
workspace.

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/service-accounts.html#organization-service-accounts). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/service-accounts.html#team-service-accounts).

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[201][] | [JSON API document][]                        | Successfully created a state version
[404][] | [JSON API error object][]                    | Workspace not found, or user unauthorized to perform action
[409][] | [JSON API error object][]                    |
[412][] | [JSON API error object][]                    |
[422][] | [JSON API error object][]                    | Malformed request body (missing attributes, wrong types, etc.)

[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[409]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
[412]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API document]: https://www.terraform.io/docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                    | Type    | Default   | Description
----------------------------|---------|-----------|------------
`data.type`                 | string  |           | Must be `"state-versions"`.
`data.attributes.serial`    | integer |           | The serial of the state version
`data.attributes.md5`       | string  |           | An MD5 hash of the raw state version
`data.attributes.lineage`   | string  | (nothing) | Lineage of the state version
`data.attributes.state`     | string  |           | Base64 encoded raw state file

### Sample Payload

```json
{
  "data": {
    "type":"state-versions",
    "attributes": {
      "serial": 1,
      "md5": "871d1b4a-e579-fb7c-ffdb-f0c858a647a7",
      "lineage": "871d1b4a-e579-fb7c-ffdb-f0c858a647a7",
      "state": "ewogICAgInZlcnNpb24iOiAzLAogICAgInRlcnJhZm9ybV92ZXJzaW9uIjog\nIjAuMTEuNyIsCiAgICAic2VyaWFsIjogMSwKICAgICJsaW5lYWdlIjogIjg3\nMWQxYjRhLWU1NzktZmI3Yy1mZmRiLWYwYzg1OGE2NDdhNyIsCiAgICAibW9k\ndWxlcyI6IFsKICAgICAgICB7CiAgICAgICAgICAgICJwYXRoIjogWwogICAg\nICAgICAgICAgICAgInJvb3QiCiAgICAgICAgICAgIF0sCiAgICAgICAgICAg\nICJvdXRwdXRzIjogewogICAgICAgICAgICAgICAgInJhbmRvbSI6IHsKICAg\nICAgICAgICAgICAgICAgICAic2Vuc2l0aXZlIjogZmFsc2UsCiAgICAgICAg\nICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIiwKICAgICAgICAgICAgICAg\nICAgICAidmFsdWUiOiAiNDI2ZmNjZTQyYTNiMTM0MCIKICAgICAgICAgICAg\nICAgIH0KICAgICAgICAgICAgfSwKICAgICAgICAgICAgInJlc291cmNlcyI6\nIHsKICAgICAgICAgICAgICAgICJyYW5kb21faWQucmFuZG9tIjogewogICAg\nICAgICAgICAgICAgICAgICJ0eXBlIjogInJhbmRvbV9pZCIsCiAgICAgICAg\nICAgICAgICAgICAgImRlcGVuZHNfb24iOiBbXSwKICAgICAgICAgICAgICAg\nICAgICAicHJpbWFyeSI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgImlk\nIjogIlFtX001Q283RTBBIiwKICAgICAgICAgICAgICAgICAgICAgICAgImF0\ndHJpYnV0ZXMiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiYjY0\nIjogIlFtX001Q283RTBBIiwKICAgICAgICAgICAgICAgICAgICAgICAgICAg\nICJiNjRfc3RkIjogIlFtL001Q283RTBBPSIsCiAgICAgICAgICAgICAgICAg\nICAgICAgICAgICAiYjY0X3VybCI6ICJRbV9NNUNvN0UwQSIsCiAgICAgICAg\nICAgICAgICAgICAgICAgICAgICAiYnl0ZV9sZW5ndGgiOiAiOCIsCiAgICAg\nICAgICAgICAgICAgICAgICAgICAgICAiZGVjIjogIjQ3ODcyNzAyMDkyNTEy\nNTEwMDgiLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgImhleCI6ICI0\nMjZmY2NlNDJhM2IxMzQwIiwKICAgICAgICAgICAgICAgICAgICAgICAgICAg\nICJpZCI6ICJRbV9NNUNvN0UwQSIsCiAgICAgICAgICAgICAgICAgICAgICAg\nICAgICAia2VlcGVycy4lIjogIjEiLAogICAgICAgICAgICAgICAgICAgICAg\nICAgICAgImtlZXBlcnMudXVpZCI6ICI0OGIwOGExOS02ODA1LTIxOTctYzMw\nYS04ZmM4ZjVmOWM2MTEiCiAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAg\nICAgICAgICAgICAgICAgICAgICAgICJtZXRhIjoge30sCiAgICAgICAgICAg\nICAgICAgICAgICAgICJ0YWludGVkIjogZmFsc2UKICAgICAgICAgICAgICAg\nICAgICB9LAogICAgICAgICAgICAgICAgICAgICJkZXBvc2VkIjogW10sCiAg\nICAgICAgICAgICAgICAgICAgInByb3ZpZGVyIjogInByb3ZpZGVyLnJhbmRv\nbSIKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfSwKICAgICAgICAg\nICAgImRlcGVuZHNfb24iOiBbXQogICAgICAgIH0KICAgIF0KfQo=\n"
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
  https://app.terraform.io/api/v2/workspaces/ws-6fHMCom98SDXSQUv/state-versions
```

<!-- In curl examples, you can use the `$TOKEN` environment variable. If it's a GET request with query parameters, you can use double-quotes to have curl handle the URL encoding for you.

Make sure to test a query that's very nearly the same as the example, to avoid errors. -->

### Sample Response

```json
{
    "data": {
        "id": "sv-DmoXecHePnNznaA4",
        "type": "state-versions",
        "attributes": {
            "vcs-commit-sha": null,
            "vcs-commit-url": null,
            "created-at": "2018-07-12T20:32:01.490Z",
            "hosted-state-download-url": "https://terraform.io/v1/object/f55b739b-ff03-4716-b436-726466b96dc4",
            "serial": 1
        },
        "links": {
            "self": "/api/v2/state-versions/sv-DmoXecHePnNznaA4"
        }
    }
}
```
