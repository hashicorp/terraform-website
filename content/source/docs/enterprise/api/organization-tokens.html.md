---
layout: enterprise2
page_title: "Organization Tokens - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-organization-tokens"
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
[JSON API document]: /docs/enterprise/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Organization Token API

-> **Note**: These API endpoints are in beta and are subject to change.

## Generate a new organization token

`POST /organizations/:organization_name/authentication-token`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to generate a token for.

Generates a new organization token, replacing any existing token. This token can be used to act as [the organization service account](../users-teams-organizations/service-accounts.html).

Only members of the owners team, the owners [team service account](../users-teams-organizations/service-accounts.html#team-service-accounts), and the [organization service account](../users-teams-organizations/service-accounts.html#organization-service-accounts) can use this endpoint.

Status  | Response                                                | Reason
--------|---------------------------------------------------------|-------
[201][] | [JSON API document][] (`type: "authentication-tokens"`) | Success
[404][] | [JSON API error object][]                               | User not authorized


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/organizations/my-organization/authentication-token
```

### Sample Response

```json
{
  "data": {
    "id": "4111756",
    "type": "authentication-tokens",
    "attributes": {
      "created-at": "2017-11-29T19:11:28.075Z",
      "last-used-at": null,
      "description": null,
      "token": "ZgqYdzuvlv8Iyg.atlasv1.6nV7t1OyFls341jo1xdZTP72fN0uu9VL55ozqzekfmToGFbhoFvvygIRy2mwVAXomOE"
    },
    "relationships": {
      "created-by": {
        "data": {
          "id": "user-62goNpx1ThQf689e",
          "type": "users"
        }
      }
    }
  }
}
```

## Delete the organization token

`DELETE /organizations/:organization/authentication-token`

Parameter            | Description
---------------------|------------
`:organization_name` | Which organization's token should be deleted.

Only members of the owners team, the owners team service account, and the organization service account can use this endpoint.

Status  | Response                                             | Reason
--------|------------------------------------------------------|-------
[204][] | Nothing                                              | Success
[404][] | [JSON API error object][]                            | User not authorized


### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/organizations/my-organization/authentication-token
```
