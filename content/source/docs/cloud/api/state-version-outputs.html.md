---
layout: "cloud"
page_title: "State Version Outputs - API Docs - Terraform Enterprise"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: /docs/cloud/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

# State Version Outputs API

State version outputs are the [output values](/docs/configuration/outputs.html) from a Terraform state file. They include
the name and value of the output, as well as a sensitive boolean if the value
should be hidden by default in UIs.

## Show a State Version Output

`GET /state-version-outputs/:state_version_output_id`

Parameter | Description
----------|---------
`:state_version_output_id` | The ID of the desired state version output.

State version output IDs must be obtained from a [state version object](./state-versions.html). When requesting a state version, you can optionally add `?include=outputs` to include full details for all of that state version's outputs.

Status  | Response                                                | Reason
--------|---------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "state-version-outputs"`) | Success
[404][] | [JSON API error object][]                               | State version output not found or user not authorized

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/state-version-outputs/wsout-J2zM24JPFbfc7bE5
```

### Sample Response

```json
{
  "data": {
    "id": "wsout-J2zM24JPFbfc7bE5",
    "type": "state-version-outputs",
    "attributes": {
      "name": "flavor",
      "sensitive": false,
      "type": "string",
      "value": "Peanut Butter"
    },
    "links": {
      "self": "/api/v2/state-version-outputs/wsout-J2zM24JPFbfc7bE5"
    }
  }
}
```
