---
layout: "cloud"
page_title: "VCS Events - API Docs - Terraform Cloud and Terraform Enterprise"
---

# VCS Events API

-> **Note**: The VCS Events API is still in beta as support is being added for additional VCS providers. Currently only GitLab.com connections established after December 2020 are supported.

VCS (version control system) events describe changes within your organization for VCS-related actions. Events are only stored for 10 days. If information about the [OAuth Client](./oauth-clients.html) or [OAuth Token](./oauth-tokens.html) are available at the time of the event, it will be logged with the event.

## List VCS events

This endpoint lists VCS events for an organization

`GET /organizations/:organization_name/vcs-events`

Parameter            | Description
-------------------- | ------------
`:organization_name` | The name of the organization to list VCS events from. The organization must already exist in the system and the user must have permissions to manage VCS settings.

-> **Note:** Viewing VCS events is restricted to the owners team, teams with the "Manage VCS Settings", and the [organization API token](../users-teams-organizations/api-tokens.html#organization-api-tokens). ([More about permissions](../users-teams-organizations/permissions.html).)

### Query Parameters

This endpoint supports pagination [with standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter      | Description
---------------|------------
`page[number]`                      | **Optional.** If omitted, the endpoint will return the first page.
`page[size]`                        | **Optional.** If omitted, the endpoint will return 20 workspaces per page.
`filter[from]`                      | **Optional.** Must be RFC3339 formatted and in UTC. If omitted, the endpoint will default to 10 days ago.
`filter[to]`                        | **Optional.** Must be RFC3339 formatted and in UTC. If omitted, the endpoint will default to now.
`filter[oauth_client_external_ids]` | **Optional.** Format as a comma-separated string. If omitted, the endpoint will return all events.
`filter[levels]`                    | **Optional.** `info` and `error` are the only accepted values. If omitted, the endpoint will return both info and error events.
`include`                           | **Optional.** Allows including related resource data. This endpoint only supports `oauth_client` as a value. Only the `name`, `service-provider`, and `id` will be returned on the OAuth Client object in the `included` block.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/my-organization/vcs-events?filter%5Bfrom%5D=2021-02-02T14%3A09%3A00Z&filter%5Bto%5D=2021-02-12T14%3A09%3A59Z&filter%5Boauth_client_external_ids%5D=oc-hhTM7WNUUgbXJpkW&filter%5Blevels%5D=info&include=oauth_client
```

### Sample Response

```json
{
  "data": [
    {
      "id": "ve-DJpbEwZc98ZedHZG",
      "type": "vcs-events",
      "attributes": {
        "created-at": "2021-02-09 20:07:49.686182 +0000 UTC",
        "level": "info",
        "message": "Loaded 11 repositories",
        "organization-id": "org-SBVreZxVessAmCZG"
      },
      "relationships": {
        "oauth-client": {
          "data": {
            "id": "oc-LePsVhHXhCM6jWf3",
            "type": "oauth-clients"
          },
          "links": {
            "related": "/api/v2/oauth-clients/oc-LePsVhHXhCM6jWf3"
          }
        },
        "oauth-token": {
          "data": {
            "id": "ot-Ma2cs8tzjv3LYZHw",
            "type": "oauth-tokens"
          },
          "links": {
            "related": "/api/v2/oauth-tokens/ot-Ma2cs8tzjv3LYZHw"
          }
        }
      }
    }
  ],
  "included": [
    {
      "id": "oc-LePsVhHXhCM6jWf3",
      "type": "oauth-clients",
      "attributes": {
        "name": "working",
        "service-provider": "gitlab_hosted"
      },
      "relationships": {
        "organization": {
          "data": {
            "id": "my-organization",
            "type": "organizations"
          },
          "links": {
            "related": "/api/v2/organizations/my-organization"
          }
        },
        "oauth-tokens": {
          "data": [
            {
              "id": "ot-Ma2cs8tzjv3LYZHw",
              "type": "oauth-tokens"
            }
          ]
        }
      }
    }
  ],
  "links": {
    "self": "https://app.terraform.io/api/v2/organizations/my-organization/vcs-events?filter%5Bfrom%5D=2021-02-02T14%3A09%3A00Z\u0026filter%5Blevels%5D=info\u0026filter%5Boauth_client_external_ids%5D=oc-LePsVhHXhCM6jWf3\u0026filter%5Bto%5D=2021-02-12T14%3A09%3A59Z\u0026include=oauth_client\u0026organization_name=my-organization\u0026page%5Bnumber%5D=1\u0026page%5Bsize%5D=20",
    "first": "https://app.terraform.io/api/v2/organizations/my-organization/vcs-events?filter%5Bfrom%5D=2021-02-02T14%3A09%3A00Z\u0026filter%5Blevels%5D=info\u0026filter%5Boauth_client_external_ids%5D=oc-LePsVhHXhCM6jWf3\u0026filter%5Bto%5D=2021-02-12T14%3A09%3A59Z\u0026include=oauth_client\u0026organization_name=my-organization\u0026page%5Bnumber%5D=1\u0026page%5Bsize%5D=20",
    "prev": null,
    "next": null,
    "last": "https://app.terraform.io/api/v2/organizations/my-organization/vcs-events?filter%5Bfrom%5D=2021-02-02T14%3A09%3A00Z\u0026filter%5Blevels%5D=info\u0026filter%5Boauth_client_external_ids%5D=oc-LePsVhHXhCM6jWf3\u0026filter%5Bto%5D=2021-02-12T14%3A09%3A59Z\u0026include=oauth_client\u0026organization_name=my-organization\u0026page%5Bnumber%5D=1\u0026page%5Bsize%5D=20"
  },
  "meta": {
    "pagination": {
      "current-page": 1,
      "prev-page": null,
      "next-page": null,
      "total-pages": 1,
      "total-count": 8
    }
  }
}
```
