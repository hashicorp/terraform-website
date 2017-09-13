---
layout: enterprise2
page_title: "Linkable Repos - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-linkable-repos"
---

# Linkable Repos API

The Linkable Repos API is used to retreive the list of available repositories. This is used to identify the ID of a repository when configuring the ingress-trigger on a workspace.

## List Linkable Repos

This endpoint lists linkable repos to which you have access.

**Method**: GET

**Path**: /linkable-repos

### Parameters

- `organization` (string: \<required\>) - Specifies the username or organization name under which to list the workspaces. This uses the [JSON API Filtering](http://jsonapi.org/recommendations/#filtering) recommendation to specify the organization.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
https://atlas.hashicorp.com/api/v2/linkable-repos?filter[organization][username]=:organization
```



### Sample Response

```json
{
    "data": [
        {
            "attributes": {
                "name": "skierkowski/terraform-test-proj",
                "provider": "github"
            },
            "id": "232804_skierkowski/terraform-test-proj",
            "type": "linkable-repos"
        }
    ]
}

```

