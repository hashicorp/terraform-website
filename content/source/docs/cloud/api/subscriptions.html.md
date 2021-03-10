---
layout: "cloud"
page_title: "Subscriptions - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Subscriptions API

-> **Note:** The subscriptions API is only available in Terraform Cloud.

An organization can subscribe to different [feature sets](./feature-sets.html), which represent the [pricing plans](/docs/cloud/paid.html) available in Terraform Cloud. An organization's [entitlement set](./index.html#feature-entitlements) is calculated using its subscription and feature set.

To change the subscription for an organization, use the billing settings in the Terraform Cloud UI.

## Show Subscription For Organization

`GET /organizations/:organization_name/subscription`

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization.

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations/hashicorp/subscription
```

### Sample Response

```json
{
  "data": {
    "id": "sub-kyjptCZYXQ6amEVu",
    "type": "subscriptions",
    "attributes": {
      "end-at": null,
      "is-active": true,
      "start-at": "2021-01-20T07:03:53.492Z",
      "runs-ceiling": 1,
      "contract-start-at": null,
      "contract-user-limit": null,
      "contract-apply-limit": null,
      "agents-ceiling": 0,
      "is-public-free-tier": true,
      "is-self-serve-trial": false
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "hashicorp",
          "type": "organizations"
        }
      },
      "billing-account": {
        "data": null
      },
      "feature-set": {
        "data": {
          "id": "fs-EvCGYfpx9CVRzteA",
          "type": "feature-sets"
        }
      }
    },
    "links": {
      "self": "/api/v2/subscriptions/sub-kyjptCZYXQ6amEVu"
    }
  },
  "included": [
    {
      "id": "fs-EvCGYfpx9CVRzteA",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Essential collaboration features for practitioners and small teams.",
        "cost": 0,
        "description": "State storage, locking, run history, VCS integration, private module registry, and remote operations",
        "identifier": "free",
        "is-current": true,
        "is-free-tier": true,
        "name": "Free",
        "plan": null,
        "self-serve-billing": true,
        "cost-estimation": false,
        "sentinel": false,
        "teams": false,
        "user-limit": 5.0,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    }
  ]
}
```

## Show Subscription By ID

`GET /subscriptions/:id`

Parameter            | Description
---------------------|------------
`:id`                | The ID of the Subscription to show

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request GET \
  https://app.terraform.io/api/v2/organizations/hashicorp/subscription
```

### Sample Response

```json
{
  "data": {
    "id": "sub-kyjptCZYXQ6amEVu",
    "type": "subscriptions",
    "attributes": {
      "end-at": null,
      "is-active": true,
      "start-at": "2021-01-20T07:03:53.492Z",
      "runs-ceiling": 1,
      "contract-start-at": null,
      "contract-user-limit": null,
      "contract-apply-limit": null,
      "agents-ceiling": 0,
      "is-public-free-tier": true,
      "is-self-serve-trial": false
    },
    "relationships": {
      "organization": {
        "data": {
          "id": "hashicorp",
          "type": "organizations"
        }
      },
      "billing-account": {
        "data": null
      },
      "feature-set": {
        "data": {
          "id": "fs-EvCGYfpx9CVRzteA",
          "type": "feature-sets"
        }
      }
    },
    "links": {
      "self": "/api/v2/subscriptions/sub-kyjptCZYXQ6amEVu"
    }
  },
  "included": [
    {
      "id": "fs-EvCGYfpx9CVRzteA",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Essential collaboration features for practitioners and small teams.",
        "cost": 0,
        "description": "State storage, locking, run history, VCS integration, private module registry, and remote operations",
        "identifier": "free",
        "is-current": true,
        "is-free-tier": true,
        "name": "Free",
        "plan": null,
        "self-serve-billing": true,
        "cost-estimation": false,
        "sentinel": false,
        "teams": false,
        "user-limit": 5.0,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    }
  ]
}
```
