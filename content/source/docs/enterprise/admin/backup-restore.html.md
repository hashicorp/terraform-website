---
layout: "enterprise"
page_title: "Backups and Restores - Infrastructure Administration - Terraform Enterprise"
---

# Terraform Enterprise Backups and Restores

Terraform Enterprise is able to backup and restore all of its data. Its backup and restore features work the same way in both clustered and standalone installations.

Backups and restores are initiated by API calls, which can be performed from a remote system. This API is separate from Terraform Enterprise's application-level APIs, and uses a different authorization token.

Backing up and restoring into a new installation of Terraform Enterprise is the only supported way to migrate between deployment types (standalone vs. clustered) and operational modes (external services vs. mounted disk, etc.).

## About Backups

Terraform Enterprise's backup utility backs up all of the data stored in a Terraform Enterprise installation, including both the blob storage and the PostgreSQL database. It does not back up the the installation configuration.

### API Authentication Token

Calls to the backup API must be authenticated with a special bearer token, which can be found on the install dashboard (`https://<TFE HOSTNAME>:8800`) near the bottom of the page:

![Screenshot: the TFE install dashboard, with the API token visible](./images/token.png)

~> **Important:** Since this token can access all of the data in a Terraform Enterprise installation, protect it very carefully.

The backup API is not part of Terraform Enterprise's normal admin or application APIs, and cannot be accessed with normal user/team/organization tokens.

Use the standard `Authorization: Bearer <TOKEN>` header to authenticate backup and restore calls.

### Security and Encryption

Much of Terraform Enterprise's data is encrypted with Vault before being stored at rest. Backups do not preserve the internal Vault keys; instead, the data is decrypted and then re-encrypted using a single password provided as part of the backup request. When restoring, this password must be provided; the data is then re-encrypted using the new installation's Vault keys.

~> **Important:** Since the backup password can be used to access all of the data that was backed up from a Terraform Enterprise installation, protect it very carefully.

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


## Creating a Backup

`POST /_backup/api/v1/backup`

To initiate a backup, make a POST request to the backup endpoint on a running Terraform Enterprise installation.

The response to this request will be a binary blob containing all of your Terraform Enterprise data. When using this endpoint, please:

- Remember to specify an output file for the backup blob.
- Be prepared to download and store many gigabytes of data to the filesystem of whichever machine the request is sent from. For best performance and to avoid disconnections, we recommend sending this request from a server colocated with the Terraform Enterprise installation rather than from a workstation.
- Treat this backup blob as sensitive data and ensure it is stored securely.

Status  | Response           | Reason
--------|--------------------|------------------------------
[200][] | Binary backup blob | Successfully created a backup
[400][] | (none)             | Invalid request
[500][] | (none)             | Internal server error

### Request Body

This POST endpoint requires a JSON object with a `password` property as a request payload.

When restoring the resulting backup, you will need to provide the same password.

### Sample Payload

```json
{ "password": "befit-brakeman-footstep-unclasp" }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request POST \
  --data @payload.json \
  --output backup.blob \
  https://<TFE HOSTNAME>/_backup/api/v1/backup
```

## Restoring a Backup in a New Terraform Enterprise Installation

`POST /_backup/api/v1/restore`

Before restoring, you must first create a new Terraform Enterprise installation. This can be a standalone server, or a cluster created with the Terraform modules.

Once the application is up and running, you can initiate a restore by making a POST request to the restore endpoint.

Be prepared to upload many gigabytes of data from the filesystem of whichever machine the request is sent from. For best performance and to avoid disconnections, we recommend sending this request from a server colocated with the Terraform Enterprise installation rather than from a workstation.

Once the restore is complete, you must **restart the application.** The application will not restart automatically. There are two ways to do this:

- Log into the install dashboard and stop, then start the application.
- From the CLI, run `replicatedctl app stop`, then run `replicatedctl app start`.

Status  | Response           | Reason
--------|--------------------|------------------------------
[200][] | (none)             | Successfully restored a backup
[400][] | (none)             | Invalid request
[500][] | (none)             | Internal server error

### Request Body

This POST endpoint requires a backup blob and its associated password, which must be provided as `multipart/form-data`.

Form field | Description
-----------|------------
`snapshot` | An encrypted backup blob downloaded from the Terraform Enterprise backup endpoint.
`config`   | A JSON file, containing a single object with a `password` property. The password must match the password used to create the backup.

### Sample Payload

The JSON file used in the `config` form field should resemble the following:

```json
{ "password": "befit-brakeman-footstep-unclasp" }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request POST \
  --form config=@request.json \
  --form snapshot=@backup.blob \
  https://<TFE HOSTNAME>/_backup/api/v1/restore
```
