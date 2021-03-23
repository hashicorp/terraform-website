---
layout: "cloud"
page_title: "Feature Sets - API Docs - Terraform Cloud and Terraform Enterprise"
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

# Feature Sets API

-> **Note:** The feature sets API is only available in Terraform Cloud.

Feature sets represent the different [pricing plans](/docs/cloud/paid.html) available to Terraform Cloud organizations. An organization's [entitlement set](./index.html#feature-entitlements) is calculated using its [subscription](./subscriptions.html) and feature set.

## List Feature Sets

This endpoint lists the feature sets available in Terraform Cloud.

`GET /feature-sets`

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/feature-sets
```

### Sample Response

```json
{
  "data": [
    {
      "id": "fs-g5jeyzSkqsK5p3CT",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Additional oversight and control for organizations.",
        "cost": 2000,
        "description": "Multiple teams with role-based access control",
        "identifier": "team",
        "is-current": true,
        "is-free-tier": false,
        "name": "Team",
        "plan": "plan_G13GVoKwS5xDEW",
        "self-serve-billing": true,
        "cost-estimation": false,
        "sentinel": false,
        "teams": true,
        "user-limit": null,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    },
    {
      "id": "fs-EP5Niczf2xKUFDXt",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Policy management and cost insights for runs and workspaces.",
        "cost": 7000,
        "description": "Team plan features plus Sentinel policy as code framework",
        "identifier": "governance",
        "is-current": true,
        "is-free-tier": false,
        "name": "Team & Governance",
        "plan": "plan_G13T64ifEk3z92",
        "self-serve-billing": true,
        "cost-estimation": true,
        "sentinel": true,
        "teams": true,
        "user-limit": null,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    },
    {
      "id": "fs-4ec3b3RVJWsBkst3",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Gain additional features built for larger teams and enterprise environments.",
        "cost": 0,
        "description": "Full access to Terraform Cloud's enterprise features",
        "identifier": "business",
        "is-current": true,
        "is-free-tier": true,
        "name": "Business",
        "plan": null,
        "self-serve-billing": false,
        "cost-estimation": true,
        "sentinel": true,
        "teams": true,
        "user-limit": null,
        "audit-logging": true,
        "sso": true,
        "private-networking": true
      }
    },
    {
      "id": "fs-T9BCyZi3KJyWHebk",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Try out the Team & Governance plan features for 30 days. No credit card required.",
        "cost": 0,
        "description": "Try out the Team & Governance plan features for 30 days",
        "identifier": "trial",
        "is-current": true,
        "is-free-tier": true,
        "name": "Trial",
        "plan": null,
        "self-serve-billing": true,
        "cost-estimation": true,
        "sentinel": true,
        "teams": true,
        "user-limit": null,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    },
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

## List Feature Sets for Organization

This endpoint lists the feature sets a particular organization is eligible to access. The results may differ from the previous global endpoint - for instance, if the organization has already had a free trial, the trial feature set will not appear in this list.

`GET /organizations/:organization_name/feature-sets`

Parameter           | Description
--------------------|-----------------------------
`organization_name` | The name of the organization

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/hashicorp/feature-sets
```

### Sample Response

```json
{
  "data": [
    {
      "id": "fs-g5jeyzSkqsK5p3CT",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Additional oversight and control for organizations.",
        "cost": 2000,
        "description": "Multiple teams with role-based access control",
        "identifier": "team",
        "is-current": true,
        "is-free-tier": false,
        "name": "Team",
        "plan": "plan_G13GVoKwS5xDEW",
        "self-serve-billing": true,
        "cost-estimation": false,
        "sentinel": false,
        "teams": true,
        "user-limit": null,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    },
    {
      "id": "fs-EP5Niczf2xKUFDXt",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Policy management and cost insights for runs and workspaces.",
        "cost": 7000,
        "description": "Team plan features plus Sentinel policy as code framework",
        "identifier": "governance",
        "is-current": true,
        "is-free-tier": false,
        "name": "Team & Governance",
        "plan": "plan_G13T64ifEk3z92",
        "self-serve-billing": true,
        "cost-estimation": true,
        "sentinel": true,
        "teams": true,
        "user-limit": null,
        "audit-logging": false,
        "sso": false,
        "private-networking": false
      }
    },
    {
      "id": "fs-4ec3b3RVJWsBkst3",
      "type": "feature-sets",
      "attributes": {
        "comparison-description": "Gain additional features built for larger teams and enterprise environments.",
        "cost": 0,
        "description": "Full access to Terraform Cloud's enterprise features",
        "identifier": "business",
        "is-current": true,
        "is-free-tier": true,
        "name": "Business",
        "plan": null,
        "self-serve-billing": false,
        "cost-estimation": true,
        "sentinel": true,
        "teams": true,
        "user-limit": null,
        "audit-logging": true,
        "sso": true,
        "private-networking": true
      }
    },
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
