---
layout: enterprise2
page_title: "Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin"
---

# Admin API

-> **Note**: These API endpoints are in beta and are subject to change.

The Admin API contains endpoints to help site administrators configure, monitor, and troubleshoot their Terraform Enterprise installation.

## Impersonate another user

`POST /admin/users/:username/actions/impersonate`

Parameter   | Description
------------|------------
`:username` | The name of the user to impersonate.

Impersonation allows an admin to begin a new session as another user in the system. This can be helpful in reproducing issues that a user is experiencing with their account that the admin cannot reproduce themselves. While an admin is impersonating a user, any actions that are logged to the audit log will reflect that an admin was acting on another user's behalf. The `"actor"` key will reference the impersonated user, but a new `"admin"` key will contain the username of the admin acting on the user's behalf. For more information about audit logging, see the [relevant documentation][audit logging].

This endpoint does not respond with a body, but the response does include a `Set-Cookie` header to persist a new session. As such, this endpoint will have no effect unless the client is able to persist and use cookies.

[audit logging]: /docs/enterprise/private/logging.html#audit-logs

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully impersonated the user
[403][] | [JSON API error object][] | Client is attempting to impersonate another admin, or is already impersonating another user.
[404][] | [JSON API error object][] | User not found, or client is not an administrator.

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[403]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Cookie: $ATLAS_COOKIE" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/admin/users/myusername/actions/impersonate
```

## End an impersonation session

`POST /admin/users/actions/unimpersonate`

When an admin has used the above endpoint to begin an impersonation session, they can make a request to this endpoint in order to end that session and log out as the impersonated user.

This endpoint does not respond with a body, but the response does include a `Set-Cookie` header to persist a new session. As such, this endpoint will have no effect unless the client is able to persist and use cookies.

Status  | Response                  | Reason
--------|---------------------------|----------
[204][] | Empty body                | Successfully ended the impersonation session.
[400][] | [JSON API error object][] | Client is not in an impersonation session.
[404][] | [JSON API error object][] | Client is not an administrator.

[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[JSON API error object]: http://jsonapi.org/format/#error-objects

### Sample Request

```shell
curl \
  --header "Cookie: $ATLAS_COOKIE" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  https://app.terraform.io/api/v2/admin/users/actions/unimpersonate
```
