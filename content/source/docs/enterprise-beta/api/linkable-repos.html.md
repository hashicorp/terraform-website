---
layout: enterprise2
page_title: "Linkable Repos - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-linkable-repos"
---

# Linkable Repos API

-> **Note**: These API endpoints are in beta and may be subject to change.

The linkable repos API is used to retrieve the list of available VCS repositories. This is used to identify the ID of a repository when configuring the ingress-trigger on a workspace. Your organization must already have a VCS OAuth connection configured.

## List Linkable Repos

This endpoint lists linkable repos to which you have access.

| Method | Path           |
| :----- | :------------- |
|  GET | /linkable-repos |

### Parameters

- `?filter[organization][username]` (`string: <required>`) - Specifies the username or organization name whose repositories you're requesting. This is specified as a query parameter.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://atlas.hashicorp.com/api/v2/linkable-repos?filter[organization][username]=my-organization
```



### Sample Response

```json
{
    "data": [
        {
            "attributes": {
                "name": "hashicorp/terraform-basic-demo-configuration",
                "provider": "github"
            },
            "id": "232804_hashicorp/terraform-basic-demo-configuration",
            "type": "linkable-repos"
        }
    ]
}

```

