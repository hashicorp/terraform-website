---
layout: "enterprise"
page_title: "Backups and Restores - Infrastructure Administration - Terraform Enterprise"
---

# Terraform Enterprise Backups and Restores

Terraform Enterprise provides an API to backup and restore all of its application data.

The backup and restore API is separate from the Terraform Enterprise application-level APIs. As such, a separate authorization token is required to use the backup and restore API. See [Authentication](#authentication) below for more details.

Using the backup and restore API is the only supported way to migrate between operational modes (mounted disk, external services).

## About Backups and Restores

The backup and restore API backs up all of the data stored in a Terraform Enterprise installation, including both the blob storage and the PostgreSQL database. It does not back up the installation configuration. This backup can then be restored to a new installation of Terraform Enterprise.

Please note the following when using the backup and restore API:

- The version of Terraform Enterprise cannot be changed between a backup and restore. That is, a backup taken from one version of Terraform Enterprise cannot be restored to an installation running a different version of Terraform Enterprise.
- The version of PostgreSQL being used cannot be changed between a backup and restore. That is, a backup taken from a Terraform Enterprise installation using one version of PostgreSQL cannot be restored to an installation using a different version of PostgreSQL.
- The Terraform Enterprise installation that will be restored to must be a new, running installation with no existing application data.
- Once a restore is completed, the Terraform Enterprise application will need to be restarted before it can use the restored data.

See also:

- [Data Security](../../cloud/architectural-details/data-security.html) for details about the contents of Terraform Enterprise's blob storage and PostgreSQL database.

### Authentication

The backup and restore API uses a separate authorization token which can be found on the settings dashboard (`https://<TFE HOSTNAME>:8800/settings`) near the bottom of the page:

![Screenshot: the TFE install dashboard, with the API token visible](./images/token.png)

-> **Note:** This authorization token is specific to the Terraform Enterprise installation. As a result, the authorization token used to create a backup may be different than the authorization token used to perform a restore. Please ensure you are using the correct authorization token when performing a backup or restore operation.

The backup and restore API is separate from the Terraform Enterprise application-level APIs and cannot be accessed with Terraform Enterprise user, team, or organization API tokens.

To use this authorization token with the backup and restore API, pass the `Authorization: Bearer <TOKEN>` header in your API requests.

~> **Important:** Since this authorization token can access all of the data in a Terraform Enterprise installation, protect it very carefully.

### Security and Encryption

Terraform Enterprise uses HashiCorp Vault to encrypt and decrypt its data. The Vault encryption keys that are used to encrypt and decrypt this data are not preserved during a backup or restore. Instead, during a backup, the data is decrypted by Vault and then re-encrypted using a password provided by you, resulting in an encrypted backup blob. During a restore, the same password that you provided during the backup must be used to decrypt the data before it is re-encrypted with the new Terraform Enterprise installation's Vault encryption keys.

The backup and restore API expect this password to be provided as a JSON object with a `password` property within the request payload. The value for the `password` property can be any valid string. Here's what an example JSON object looks like.

```json
{
   "password": "befit-brakeman-footstep-unclasp"
}
```

~> **Important:** The same password that was provided during backup must be provided during restore. This password can be used to access all of the data that was backed up. Please protect it very carefully.

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

The response to this request will be an encrypted binary blob containing all of your Terraform Enterprise data. When using this endpoint, please:

- Remember to specify an output file for the encrypted backup blob.
- Be prepared to download and store many gigabytes of data to the filesystem of whichever machine the request is sent from. For best performance and to avoid disconnections, we recommend sending this request from a server colocated with the Terraform Enterprise installation rather than from a workstation.
- Treat this encrypted backup blob as sensitive data and ensure it is stored securely.
- Remember the password that was used to encrypt this backup blob.

Status  | Response           | Reason
--------|--------------------|------------------------------
[200][] | Binary backup blob | Successfully created a backup
[400][] | (none)             | Invalid request
[500][] | (none)             | Internal server error

~> **Important:** A successful backup **must** return `200`. If `200` is not returned and the call silently closes, the backup blob may be incomplete, resulting in data loss.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

| Key path   | Type   | Default | Description                                   |
|------------|--------|---------|-----------------------------------------------|
| `password` | string |         | The password used to encrypt the backup blob. |

### Sample Payload

```json
{
   "password": "befit-brakeman-footstep-unclasp"
}
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

## Restoring a Backup

`POST /_backup/api/v1/restore`

Before restoring, you must first create a new Terraform Enterprise installation.

-> **Note:** The authorization token used to restore the backup is specific to the Terraform Enterprise installation. If restoring to a separate Terraform Enterprise installation, the authorization token will be different for the restore than it was for the backup. See [Authentication](#authentication) above for more details.

Once the Terraform Enterprise application is up and running, you can initiate a restore by making a POST request to the restore endpoint.

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

This POST endpoint requires the following form fields which must be provided as `multipart/form-data`.

| Form field | Description                                                                        |
|------------|------------------------------------------------------------------------------------|
| `snapshot` | An encrypted backup blob downloaded from the Terraform Enterprise backup endpoint. |
| `config`   | A JSON file containing a JSON object. See the table below.                         |

The JSON file used in the `config` form field above must contain a JSON object with the following properties.

Properties without a default value are required.

| Key path   | Type   | Default | Description                                   |
|------------|--------|---------|-----------------------------------------------|
| `password` | string |         | The password used to decrypt the backup blob. |

### Sample Payload

```json
{
   "password": "befit-brakeman-footstep-unclasp"
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --request POST \
  --form config=@payload.json \
  --form snapshot=@backup.blob \
  https://<TFE HOSTNAME>/_backup/api/v1/restore
```
