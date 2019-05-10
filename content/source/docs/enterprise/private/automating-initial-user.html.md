---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Automating Initial User"
sidebar_current: "docs-enterprise2-private-installer-automating-initial-user"
---

# Private Terraform Enterprise - Automating Initial User Creation

After Private Terraform Enterprise is installed, the initial admin user must then be created to begin using the product.
Normally this user is created by opening the application from the installer dashboard. However, if further automation is desired, an API is available to create this user.

## Initial Admin Creation Token (IACT)

To create the initial admin user via the API, the request must be authenticated with the Initial Admin Creation Token (IACT). This token
can only be used to create the admin user when there are no users configured in the system. The IACT can be retrieved in several different ways.

### Shell Command or Automated Deployment Script

After installation, run the following from a shell connected to your PTFE instance:

```shell
replicated admin --tty=0 retrieve-iact
```

If you want to create the initial user in an automated deployment script, run a command like the following instead so that you can capture the IACT:

```shell
initial_token=$(replicated admin --tty=0 retrieve-iact)
```

The command outputs only the complete IACT, which facilitates use in automation.

### Via API

The option `iact_subnet_list` can be set to a cidr mask that will allow clients in that address range to query the retrieval API directly. This allows installers the ability to create the installation and then immediately request the IACT token without running a command on the installation machine.

~> NOTE: `iact_subnet_list` has no default value, so if unset, this no clients will be able to request the IACT token via the API.

The API will be relative to the installation, for example `https://ptfe.mycompany.com/admin/retrieve-iact`, with `/admin/retrieve-iact` being the path that returns the token.

When this feature is used, it is governed by another setting: `iact_subnet_time_limit`. This is a time limit, measured from the installation starting, that controls external access to the IACT. By default this is set to 60 minutes, meaning that during the initial 60 minutes after the installation boots, the API can be used by a client within the subnet list. After that time, access is not allowed.

If a customer wishes to disable the time limit and allow access to the IACT forever, set the limit to `unlimited`.

## Initial Admin Creation API

With the IACT in hand, the initial admin creation API can now be used. This API is available under the path `/admin/initial-admin-user` of your primary hostname. For instance, if your PTFE instance was located at `ptfe.mycompany.com`, the initial admin creation API would be `https://ptfe.mycompany.com/admin/initial-admin-user`.

This API requires the IACT as well as a JSON document describing the username, email address, and password of the initial admin user.

## Creating the Initial Admin User API

`POST /admin/initial-admin-user`

Status  | Response                                     | Reason
--------|----------------------------------------------|----------
[200][] | JSON document                                | Successfully created the user
[404][] | JSON error document                          | Unauthorized to perform action
[422][] | JSON error document                          | Malformed request body (missing attributes, wrong types, etc.)
[500][] | JSON error document                         | Failure during user creation

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[500]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500

### Query Parameters

[These are standard URL query parameters](./index.html#query-parameters); remember to percent-encode `[` as `%5B` and `]` as `%5D` if your tooling doesn't automatically encode URLs.

Parameter               | Description
------------------------|------------
`token`                 | **Required.** The IACT token retrieved via API or command

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path                    | Type   | Default | Description
----------------------------|--------|---------|------------
`username`                  | string |         | The username to assign the new user.
`email`                     | string |         | The email address of the new user.
`password`                  | string |         | The password of the new user.

### Response Body

The POST endpoint will return a JSON object with the following properties.

Key path                    | Type   | Description
----------------------------|--------|------------
`status`                    | string | Either `"created"` or `"error"`.
`token`                     | string | If status is `"created"`, this contains a TFE user token for the new user.
`error`                     | string | If status is `"error"`, this contains the reason for the error.

### Sample Payload

```json
{
  "username": "admin",
  "email": "it@mycompany.com",
  "password": "thisisabadpassword"
}
```

### Sample Request

```shell
curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data @payload.json \
  https://ptfe.company.com/admin/initial-admin-user?token=$(cat iact.txt)
```

### Sample Response

```json
{
  "status": "created",
  "token": "aabbccdd.v1.atlas.ddeeffgghhiijjkkllmmnnooppqqrrssttuuvvxxyyzz"
}
```
