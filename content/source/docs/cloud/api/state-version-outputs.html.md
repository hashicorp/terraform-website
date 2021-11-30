---
layout: "cloud"
page_title: "State Version Outputs - API Docs - Terraform Cloud and Terraform Enterprise"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API document]: /docs/cloud/api/index.html#json-api-documents
[JSON API error object]: https://jsonapi.org/format/#error-objects

# State Version Outputs API

State version outputs are the [output values](/docs/language/values/outputs.html) from a Terraform state file. They include
the name and value of the output, as well as a sensitive boolean if the value
should be hidden by default in UIs.

## List State Version Outputs

`GET /state-versions/:state_version_id/outputs`

Listing state version outputs requires permission to read state outputs for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

Parameter | Description
----------|---------
`:state_version_id` | The ID of the desired state version.

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][]                        | Successfully returned a list of outputs for the given state version.
[404][] | [JSON API error object][]                    | State version not found, or user unauthorized to perform action.

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters). Remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                   | Description
----------------------------|------------
`page[number]`              | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                | **Optional.** If omitted, the endpoint will return 20 state version outputs per page.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/state-versions/sv-SDboVZC8TCxXEneJ/outputs
```

### Sample Response

```json
{
  "data": [
    {
      "id": "wsout-xFAmCR3VkBGepcee",
      "type": "state-version-outputs",
      "attributes": {
        "name": "fruits",
        "sensitive": false,
        "type": "array",
        "value": [
          "apple",
          "strawberry",
          "blueberry",
          "rasberry"
        ]
      },
      "links": {
        "self": "/api/v2/state-version-outputs/wsout-xFAmCR3VkBGepcee"
      }
    },
    {
      "id": "wsout-vspuB754AUNkfxwo",
      "type": "state-version-outputs",
      "attributes": {
        "name": "vegetables",
        "sensitive": false,
        "type": "array",
        "value": [
          "carrots",
          "potato",
          "tomato",
          "onions"
        ]
      },
      "links": {
        "self": "/api/v2/state-version-outputs/wsout-vspuB754AUNkfxwo"
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/state-versions/sv-SVB5wMrDL1XUgJ4G/outputs?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/state-versions/sv-SVB5wMrDL1XUgJ4G/outputs?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/state-versions/sv-SVB5wMrDL1XUgJ4G/outputs?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "page-size": 20,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 2
    }
  }
}
```

## Show a State Version Output

`GET /state-version-outputs/:state_version_output_id`

Parameter | Description
----------|---------
`:state_version_output_id` | The ID of the desired state version output.

State version output IDs must be obtained from a [state version object](./state-versions.html). When requesting a state version, you can optionally add `?include=outputs` to include full details for all of that state version's outputs.

Status  | Response                                                | Reason
--------|---------------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "state-version-outputs"`) | Success.
[404][] | [JSON API error object][]                               | State version output not found or user not authorized.

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
