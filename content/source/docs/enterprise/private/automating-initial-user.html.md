---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Automating Initial User"
sidebar_current: "docs-enterprise2-private-installer-automating-initial-user"
---

# Private Terraform Enterprise Automating Initial User

After Private Terraform Enterprise is installed, the initial admin user must then be created to begin using the product.
Normally this user is created via a web browser but one can use an API to create this initial user as well.
This allows users that wish to automate installation even more to do so, allowing them to begin using the Terraform Enterprise API directly after initial user creation.

## Initial Admin Creation Token (IACT)

### Via Command

To create the initial admin user, the IACT must be retrieved. It will be presented to creation API to protect the security of the installation.

Once the product is installed, simply run:

```shell
ptfe-admin retrieve-iact
```

The complete output is the IACT, which will be used in the next step. This is provided as a command to allow for simplicity with automating its invocation.

### Via API

The option `iact_subnet_list` can be set to a cidr mask that will allow clients in that address range to query the retrieval API directly. This allows installers the ability to create the installation and then immediately request the IACT token without running a command on the installation machine.

The API will relative to the installation, for example `https://ptfe.mycompany.com/admin/retrieve-iact`, with `/admin/retrieve-iact` being the path that returns the token.

When this feature is used, it is governed by another setting `iact_subnet_time_limit`. This is a time limit, measured from the installation starting, that controls external access to the IACT. By default this is set to 60 minutes, meaning that 60 minutes after the installation boots, the API can be used by a client within the subnet list. After that time, access is not allowed.

If a customer wishes to disable the time limit and allow access to the IACT forever, set the limit to `unlimited`.

## Initial Admin Creation API

With the IACT in hand, the initial admin creation API can now be used. This API is available under the path `/admin/initial-admin-user` of your primary hostname. For instance, if your PTFE instance was located at `ptfe.mycompany.com`, the initial admin creation API would be `https://ptfe.mycompany.com/admin/initial-admin-user`.

This API requires the IACT as well as a JSON document describing the username, email address, and password of the initial admin user.

Here is a simple sample for using the API:

```shell
$ export IACT=$(cat iact.txt)
$ curl https://ptfe.company.com/admin/inital-admin-user?token=$IACT -H "Content-Type: application/json" -d ‘{"username": "admin", "email": "admin@mycompany.com", "password": "this-is-a-bad-password"}’ | tee admin-token.txt
{"status": "created", "token": "xxyyzz"}
```

### API Schema

#### Request

*Path:* _/admin/initial-admin-user_
*Query Parameters:* _token_, the IACT previously retrieved
*HTTP Method:* POST
*HTTP Headers:*
- *Content-Type*: must be the literal _application/json_
*Request Body:* A JSON Document with the following keys set:
- *username:* the username to give the initial admin user
- *email:* email address of the user
- *password:* password for the user

#### Response

The response status code will be 200 if the request was successful. Otherwise it will be a 400 or a 500.

The response body will be a JSON document with the following schema:

- *status:* if successful, _created_. Otherwise _error_
- *error:* if status is _error_, this will be a string describing the error
- *token:* if the status is _created_, this will be a TFE token that can be used to access the TFE API

