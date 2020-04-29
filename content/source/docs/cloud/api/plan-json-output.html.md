---
layout: "cloud"
page_title: "Plan JSON Output - API Docs - Terraform Cloud"
---

-> **Note:** This endpoint is only supported when using terraform version 0.12.X or greater.

## Download the JSON execution plan for a run or plan

`GET /api/v2/plans/:id/json-output`
`GET /api/v2/runs/:id/plan/json-output`

These endpoints generate a temporary authenticated URL to the location of the [JSON formatted execution plan](https://www.terraform.io/docs/internals/json-format.html#format-summary).  When successful, this endpoint responds with a temporarily redirect that should be followed.  If using a client that can follow redirects, you can use this endpoint to save the `.json` file locally without needing to save the temporary URL.

This temporary URL provided by the redirect has a life of **1 minute**, and should not be relied upon beyond the initial request.  If you need repeat access, you should use this endpoint to generate a new URL each time.

### Permission requirements

This endpoint cannot be accessed with [organization tokens](../users-teams-organizations/api-tokens.html#organization-api-tokens). You must access it with a [user token](../users-teams-organizations/users.html#api-tokens) or [team token](../users-teams-organizations/api-tokens.html#team-api-tokens) that has [**admin** level permission](../users-teams-organizations/permissions.html#admin) to access the workspace.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | No Content                | Plan JSON supported, but plan has not yet completed.
[307][] | HTTP Redirect             | Plan JSON found and temporary download URL generated
[422][] | [JSON API error object][] | Plan does not use a supported version of terraform (< 0.12.X)

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[307]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --location \
  https://app.terraform.io/api/v2/plans/plan-8F5JFydVYAmtTjET/json-output |
  > json-output.json
```
