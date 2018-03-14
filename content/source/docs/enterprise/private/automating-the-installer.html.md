---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Automated Installation (Installer Beta)"
sidebar_current: "docs-enterprise2-private-installer-automating"
---

# Private Terraform Enterprise Automated Installation (Installer Beta)

The installation of Private Terraform Enterprise can be automated for both online and airgapped installs. There are two parts to automating the install: configuring [Replicated](https://help.replicated.com/) -- the platform which runs Terraform Enterprise -- and configuring Terraform Enterprise itself.

Before starting the install process, you must:

- prepare an [application settings](#application-settings) file, which defines the settings for the Terraform Enterprise application.
- prepare `/etc/replicated.conf`, which defines the settings for the Replicated installer.
- copy your license file to the instance.
- download the `.airgap` bundle to the instance (Airgapped mode only).

You may also need to provide additional flags (such as the instance's public and private IP addresses) in order to avoid being prompted for those values when running the installer (which may result in either a failure of the installer or a unbounded delay while waiting for input).

It's expected that the user is already familiar with how to do a [manual install](./install-installer.html#installation).

## Application settings

This file contains the values you would normally provide in the settings screen, which may be as simple as choosing the demo installation type or as complex as specifying the Postgresql connection string and S3 bucket credentials and parameters. You need to create this file first since it is referenced in the `ImportSettingsFrom` property in `/etc/replicated.conf`, which will be described below.

### Format

The settings file is JSON formatted. All values must be strings.  The example below is suitable for a demo installation:

```json
{
    "hostname": {
        "value": "terraform.example.com"
    },
    "installation_type": {
        "value": "poc"
    },
    "capacity_concurrency": {
        "value": "5"
    }
}
```

### Available settings

A number of settings are available to configure and tune your installation.  They are summarized below; it is expected the user will have completed a manual installation first and already be familiar with the nature of these parameters from the settings screen.

The following apply to every installation:

- `hostname` — (Required) this is the hostname you will use to access your installation
- `installation_type` — (Required) one of `poc` or `production`
- `capacity_concurrency` — number of concurrent plans and applies; defaults to `10`
- `letsencrypt_auto` - (Optional) Indicate if the system should request an SSL/TLS certificate automatically from [Let's Encrypt](https://letsencrypt.org). Set to `1` if so.
- `letsencrypt_email` - (Required with `letsencrypt_auto`) Sets the email to associate with the generate certificate.
- `letsencrypt_path` - (Optional) Path on the host to make `/.well-known` available in the product. This is used for certbot
  to be able to generate certificates.
- `extra_no_proxy` — (Optional) when configured to use a proxy, a `,` (comma) separated list of hosts to exclude from proxying
- `ca_certs` — (Optional) custom certificate authority (CA) bundle
- `cust_vault_enable` - (Optional) Indicate if an external Vault cluster is being used. Set to `1` if so.
  - `cust_vault_addr` - URL of external Vault cluster
  - `cust_vault_role_id` - AppRole RoleId to use to authenticate with the Vault cluster
  - `cust_vault_secret_id` - AppRole SecretId to use to authenticate with the Vault cluster
  - `cust_vault_path` - (Optional) Path on the Vault server for the AppRole auth. Defaults to `auth/approle`
  - `cust_vault_token_renew` - (Optional) How often (in seconds) to renew the Vault token. Defaults to `3600`
- `vault_path` - (Optional) Path on the host system to store the vault files. If `cust_vault_enable` is set, this has no effect.
- `vault_store_snapshot` - (Optional) Indicate if the vault files should be stored in snapshots. Set to `0` if not, Defaults to `1`.

#### `production_type` is required if you've chosen `production` for the `installation_type`:

- `production_type` — one of `external` or `disk`

#### `disk_path` is required if you've chosen `disk` for `production_type`:

- `disk_path` — path on instance to persistent storage

#### The following apply if you've chosen `external` for `production_type`:

- `postgres_url` — (Required) the database URL

The system can use either S3 or Azure, so you only need to provide one set of the following variables.

For S3:

- `aws_access_key_id` — (Required) AWS access key ID for S3 bucket access. To use AWS instance profiles for this information, set it to `""`.
- `aws_secret_access_key` — (Required) AWS secret access key for S3 bucket access. To use AWS instance profiles for this information, set it to `""`.
- `s3_bucket` — (Required) the S3 bucket where resources will be stored
- `s3_region` — (Required) the region where the S3 bucket exists
- `s3_sse` — (Optional) enables server-side encryption of objects in S3; if provided, must be set to `aws:kms`
- `s3_sse_kms_key_id` — (Optional) An optional KMS key for use when S3 server-side encryption is enabled

For Azure:

- `azure_account_name` - (Required) The account name for the Azure account to access the container
- `azure_account_key` - (Required) The account key to access the account specified in `azure_account_name`
- `azure_container` - (Required) The identifer for the Azure blob storage container
- `azure_endpoint` - (Optional) The URL for the Azure cluster to use. By default is the global one.

## Online

The following is an example `/etc/replicated.conf` suitable for an automated online install using a self-signed certificate.  `ImportSettingsFrom` must be the full path to the application settings file.  You also need to provide the full path to your license file in `LicenseFileLocation`.

See the full set of configuration parameters in the [Replicated documentation](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-replicated-automatically).

```json
{
    "DaemonAuthenticationType":     "password",
    "DaemonAuthenticationPassword": "your-password-here",
    "TlsBootstrapType":             "self-signed",
    "BypassPreflightChecks":        true,
    "ImportSettingsFrom":           "/path/to/application-settings.json",
    "LicenseFileLocation":          "/path/to/license.rli"
}
```
### Invoking the installation

Once `/etc/replicated.conf` has been created, you can retrieve and execute the install script as `root`:

```bash
curl -o install.sh https://install.terraform.io/ptfe/beta
bash ./install.sh \
    no-proxy \
    private-address=1.2.3.4 \
    public-address=5.6.7.8
```

Note the `private-address` and `public-address` flags provided to the installer.  These may be left out, but the installer will prompt for them if it is unable to determine appropriate values automatically.

## Airgapped

The following is an example `/etc/replicated.conf` suitable for an automated airgapped install, which builds on the online example above.  Note the addition of `LicenseBootstrapAirgapPackagePath`, which is a path to the `.airgap` bundle on the instance.  

```json
{
    "DaemonAuthenticationType":          "password",
    "DaemonAuthenticationPassword":      "your-password-here",
    "TlsBootstrapType":                  "self-signed",
    "BypassPreflightChecks":             true,
    "ImportSettingsFrom":                "/path/to/application-settings.json",
    "LicenseFileLocation":               "/path/to/license.rli",
    "LicenseBootstrapAirgapPackagePath": "/path/to/bundle.airgap"
}
```

### Invoking the installation

Following on from the [manual airgapped install](./install-installer.html#run-the-installer-airgapped) steps, you must also have the installer bootstrapper already on the instance.  For illustrative purposes, it is assumed the installer bootstrapper has been unarchived in `/tmp`.

Once `/etc/replicated.conf` has been created, you can now execute the install script as `root`:

```bash
cd /tmp
./install.sh \
    airgap \
    no-proxy \
    private-address=1.2.3.4 \
    public-address=5.6.7.8
```

## Waiting for Terraform Enterprise to become ready

Once the installer finishes, you may poll the `/_health_check` endpoint until a `200` is returned by the application, indicating that it is fully started:

```bash
while ! curl -ksfS --connect-timeout 5 https://tfe.example.com/_health_check; do
    sleep 5
done
```

## References

- [Replicated installer flags](https://help.replicated.com/docs/distributing-an-application/installing-via-script/#flags)
- [`/etc/replicated.conf`](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-replicated-automatically)
- [application settings](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-app-settings-automatically)

