---
layout: enterprise2
page_title: "Linkable Repos - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-linkable-repos"
---

# Linkable Repos API

-> **Note**: These API endpoints are in Beta and may be subject to change.

The Linkable Repos API is used to retreive the list of available VCS repositories. This is used to identify the ID of a repository when configuring the ingress-trigger on a workspace. Your organization must already have the VCS OAuth Connection configured.

## List Linkable Repos

This endpoint lists linkable repos to which you have access.

| Method | Path           |
| :----- | :------------- |
|  GET | /linkable-repos |

### Parameters

- `?filter[organization][username]` (`string: <required>`) - Specifies the username or organization name under which to list the workspaces. This is specified as a query parameter.

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

