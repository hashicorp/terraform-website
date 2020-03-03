Follow this template to format each API method. There are usually multiple sections like this on a given API endpoint page.

<!-- Boilerplate link references: This entire list should be included at the top of every API page, so that the tables can use short links freely. This SHOULD be all of the status codes we use in Terraform Cloud's API; if we need to add more, update the list on every page. -->

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
[JSON API error object]: http://jsonapi.org/format/#error-objects


## Create a Something

<!-- Header: "Verb a Noun" or "Verb Nouns." -->

`POST /organizations/:organization_name/somethings`

<!-- ^ The method and path are styled as a single code span, with global prefix (`/api/v2`) omitted and the method capitalized. -->

Parameter            | Description
---------------------|------------
`:organization_name` | The name of the organization to create the something in. The organization must already exist in the system, and the user must have permissions to create new somethings.

<!-- ^ The list of URL path parameters goes directly below the method and path, without a header of its own. They're simpler than other parameters because they're always strings and they're always mandatory, so this table only has two columns. Prefix URL path parameter names with a colon.

If further explanation of this method is needed beyond its title, write it here, after the parameter list. -->

-> **Note:** This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens).

<!-- ^ Include a note like the above if the endpoint CANNOT be used with a given token type. Most endpoints don't need this. -->

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | [JSON API document][] (`type: "somethings"`) | Successfully created a team
[400][] | [JSON API error object][]                    | Invalid `include` parameter
[404][] | [JSON API error object][]                    | Organization not found, or user unauthorized to perform action
[422][] | [JSON API error object][]                    | Malformed request body (missing attributes, wrong types, etc.)
[500][] | [JSON API error object][]                    | Failure during team creation

<!-- ^ Include status codes even if they're plain 200/404.
If a JSON API document is returned, specify the `type`.
If the table includes links, use reference-style links to keep the table size small. The references should be included once per API page, at the very top.
 -->

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

<!-- ^ Query parameters get their own header and boilerplate. Omit the whole section if this method takes no query parameters; we only use them for certain GET requests. -->

Parameter               | Description
------------------------|------------
`filter[workspace][id]` | **Required.** The workspace ID where this action will happen.

<!-- ^ This table is flexible. If we somehow end up with a case where there's a long list of parameters, in a mix of optional and required, you could add a "Required?" or "Default" column or something; likewise if there are multiple data types in play. But in the usual minimal case, keep the table minimal and style important information as strong emphasis.

Do not prefix query parameter names with a question mark. -->

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

<!-- ^ Payload parameters go under this header and boilerplate. -->

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`data.type`                 | string |         | Must be `"somethings"`.
`data[].type`               | string |         | ... <!-- use data[].x when data is an array of objects. -->
`data.attributes.category`  | string |         | Whether this is a blue or red something. Valid values are `"blue"` or `"red"`.
`data.attributes.sensitive` | bool   | `false` | Whether the value is sensitive. If true then the something is written once and not visible thereafter.
`filter.workspace.name`     | string |         | The name of the workspace that owns the something.
`filter.organization.name`  | string |         | The name of the organization that owns the workspace.

<!--
- Name the paths to these object properties with dot notation, starting from the
  root of the JSON object. So, `data.attributes.category` instead of just
  `category`. Since our API format uses deeply nested structures and is finicky
  about the details, err on the side of being very explicit about where the user
  puts everything.
- Style key paths as code spans.
- Style data types as plain text.
- Style string values as code spans with interior double-quotes, to distinguish
them from unquoted values like booleans and nulls.
- If a limited number of values are valid, list them in the description.
- In the rare case where a parameter is optional but has no default, you can
  list something like "(nothing)" as the default and explain in the description.
- List the properties in the simplest order you can... but the concept of
  "simple" can be a little complex. ;) As a general guideline:
    - The first level of sorting is _importance._ This is open to interpretation,
      but at least put the type and name first.
    - The second level of sorting is _complexity._ If one of the properties is a
      huge object with a bunch of sub-properties, put it last — this lets the
      reader clear the simpler properties out of their head before dealing with
      it, without having to remember where they were in the list and without
      having to remember to pop back out of the "big sub-object" context when
      they hit the end of it.
    - The third order of sorting is _predictability,_ which basically means that
      within a group of properties of equal relative importance and complexity,
      you should probably list them alphabetically so it's easier to find a
      specific property.
-->

### Available Related Resources

<!-- Omit this subheader and section if it's not applicable. -->

This GET endpoint can optionally return related resources, if requested with [the `include` query parameter](./index.html#inclusion-of-related-resources). The following resource types are available:

Resource Name      | Description
-------------------|------------
`organization`     | The full organization record.
`current_run`      | Additional information about the current run.
`current_run.plan` | The plan used in the current run.


### Sample Payload

```json
{
  "data": {
    "type":"somethings",
    "attributes": {
      "category":"red",
      "sensitive":true
    }
  },
  "filter": {
    "organization": {
      "name":"my-organization"
    },
    "workspace": {
      "name":"my-workspace"
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/somethings
```

<!-- In curl examples, you can use the `$TOKEN` environment variable. If it's a GET request with query parameters, you can use double-quotes to have curl handle the URL encoding for you.

Make sure to test a query that's very nearly the same as the example, to avoid errors. -->

### Sample Response

```json
{
  "data": {
    "id":"som-EavQ1LztoRTQHSNT",
    "type":"somethings",
    "attributes": {
      "sensitive":true,
      "category":"red",
    },
    "relationships": {
      "configurable": {
        "data": {
          "id":"ws-4j8p6jX1w33MiDC7",
          "type":"workspaces"
        },
        "links": {
          "related":"/api/v2/organizations/my-organization/workspaces/my-workspace"
        }
      }
    },
    "links": {
      "self":"/api/v2/somethings/som-EavQ1LztoRTQHSNT"
    }
  }
}
```

<!-- Make sure to mangle any real IDs this might expose. -->
