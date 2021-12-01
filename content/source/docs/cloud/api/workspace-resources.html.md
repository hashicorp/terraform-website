---
layout: "cloud"
page_title: "Workspace Resources - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Workspace Resources API

## List Workspace Resources

`GET /workspaces/:workspace_id/resources`

Parameter            | Description
---------------------|------------
`:workspace_id`      | The ID of the workspace to retrieve resources from. Obtain this from the [workspace settings](../workspaces/settings.html) or the [show workspace](./workspaces.html#show-workspace) endpoint.

Status  | Response                                       | Reason
--------|------------------------------------------------|----------
[200][] | [JSON API document][] (`type: "resources"`)    | Request was successful
[404][] | [JSON API error object][]                      | Workspace not found or user unauthorized to perform action

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters). Remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter                   | Description
----------------------------|------------
`page[number]`              | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                | **Optional.** If omitted, the endpoint will return 20 workspace resources per page.

### Permissions

To list resources the user must have permission to read resources for the specified workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Sample Request

```shell
curl \
  --request GET \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/ws-DiTzUDRpjrArAfSS/resources
```

### Sample Response

```json
{
  "data": [
    {
      "id": "wsr-KNYb3Jj3JTBgoBFs",
      "type": "resources",
      "attributes": {
        "address": "random_pet.animal",
        "name": "animal",
        "created-at": "2021-10-27",
        "updated-at": "2021-10-27",
        "module": "root",
        "provider": "hashicorp/random",
        "provider-type": "random_pet",
        "modified-by-state-version-id": "sv-y4pjfGHkGUBAa9AX",
        "name-index": null
      }
    },
    {
      "id": "wsr-kYsf5A3hQ1y9zFWq",
      "type": "resources",
      "attributes": {
        "address": "random_pet.animal2",
        "name": "animal2",
        "created-at": "2021-10-27",
        "updated-at": "2021-10-27",
        "module": "root",
        "provider": "hashicorp/random",
        "provider-type": "random_pet",
        "modified-by-state-version-id": "sv-y4pjfGHkGUBAa9AX",
        "name-index": null
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/workspaces/ws-DiTzUDRpjrArAfSS/resources?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/workspaces/ws-DiTzUDRpjrArAfSS/resources?page%5Bnumber%5D=1&page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/workspaces/ws-DiTzUDRpjrArAfSS/resources?page%5Bnumber%5D=1&page%5Bsize%5D=20"
  },
  ...
}
```
