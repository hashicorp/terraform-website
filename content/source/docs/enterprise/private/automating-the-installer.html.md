---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Automated Installation (Installer)"
sidebar_current: "docs-enterprise2-private-installer-automating"
---

# Private Terraform Enterprise Automated Installation (Installer)

The installation of Private Terraform Enterprise can be automated for both online and airgapped installs. There are two parts to automating the install: configuring [Replicated](https://help.replicated.com/) -- the platform which runs Terraform Enterprise -- and configuring Terraform Enterprise itself.

Before starting the install process, you must:

- prepare an [application settings](#application-settings) file, which defines the settings for the Terraform Enterprise application.
- prepare `/etc/replicated.conf`, which defines the settings for the Replicated installer.
- copy your license file to the instance.
- download the `.airgap` bundle to the instance (Airgapped mode only).

You may also need to provide additional flags (such as the instance's public and private IP addresses) in order to avoid being prompted for those values when running the installer (which may result in either a failure of the installer or a unbounded delay while waiting for input).

It's expected that the user is already familiar with how to do a [manual install](./install-installer.html#installation).

## Application settings

This file contains the values you would normally provide in the settings screen, which may be as simple as choosing the demo installation type or as complex as specifying the PostgreSQL connection string and S3 bucket credentials and parameters. You need to create this file first since it is referenced in the `ImportSettingsFrom` property in `/etc/replicated.conf`, which will be described below.

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

> Note: The JSON file must be valid JSON for the install to work, so it's best to validate it before using for an install.

The easiest way to check the application config is valid JSON would be with `python`, which will be present on most Linux installs:

```
$ python -m json.tool settings.json
Expecting property name enclosed in double quotes: line 8 column 5 (char 171)
```

After fixing the JSON file, the command will return the valid JSON:

```
$ python -m json.tool settings.json
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

### Discovery

One the easiest ways to get the settings is to [perform a manual install](./install-installer.html#installation) and configure all the settings the way you want them. Then you can SSH in, request the settings in JSON format and use that file in a future automated install.

-> **Note**: `replicatedctl` is located at `/usr/local/bin/replicatedctl`. On some operating systems, `/usr/local/bin` is not in the user's `$PATH`. In these cases, either add `/usr/local/bin` to the `$PATH` or refer to `replicatedctl` with the full path.

To extract the settings as JSON, access the instance via SSH, then run:

```
ptfe$ replicatedctl app-config export > settings.json
```

Here is an example `app-config export` output for an instance configured in demo mode:

```
ptfe$ replicatedctl app-config export > settings.json
ptfe$ cat settings.json
{
    "aws_access_key_id": {},
    "aws_instance_profile": {},
    "aws_secret_access_key": {},
    "azure_account_key": {},
    "azure_account_name": {},
    "azure_container": {},
    "azure_endpoint": {},
    "ca_certs": {},
    "capacity_concurrency": {},
    "capacity_memory": {},
    "disk_path": {},
    "extern_vault_addr": {},
    "extern_vault_enable": {},
    "extern_vault_path": {},
    "extern_vault_role_id": {},
    "extern_vault_secret_id": {},
    "extern_vault_token_renew": {},
    "extra_no_proxy": {},
    "gcs_bucket": {},
    "gcs_credentials": {},
    "gcs_project": {},
    "hostname": {
        "value": "tfe.mycompany.com"
    },
    "installation_type": {
        "value": "poc"
    },
    "pg_dbname": {},
    "pg_extra_params": {},
    "pg_netloc": {},
    "pg_password": {},
    "pg_user": {},
    "placement": {},
    "production_type": {},
    "s3_bucket": {},
    "s3_endpoint": {},
    "s3_region": {},
    "s3_sse": {},
    "s3_sse_kms_key_id": {},
    "vault_path": {},
    "vault_store_snapshot": {}
}
```

Note that when you build your own settings file, you do not need to include parameters that do not have `value` keys, such as `extra_no_proxy` in the output above.

### Available settings

The settings available to configure your installation are summarized below. It is expected the user will have completed a manual installation first and will already be familiar with the nature of these parameters from the settings screen.

The following settings apply to every installation:

- `hostname` — (Required) The hostname you will use to access your installation.
- `installation_type` — (Required) One of `poc` or `production`.
- `enc_password` — Set the [encryption password](/docs/enterprise/private/encryption-password.html) for the install
- `capacity_concurrency` — number of concurrent plans and applies; defaults to `10`.
- `capacity_memory` — The maximum amount of memory (in megabytes) that a Terraform plan or apply can use on the system; defaults to `256`.
- `enable_metrics_collection` — Whether PTFE's [internal metrics collection](./monitoring.html#internal-monitoring) should be enabled; defaults to `true`.
- `iact_subnet_list` - A comma-separated list of CIDR masks that configure the ability to retrieve the [IACT](./automating-initial-user.html) from outside the host. For example: 10.0.0.0/24. If not set, no subnets can retrieve the IACT.
- `iact_subnet_time_limit` - The time limit that requests from the subnets listed can request the [IACT](./automating-initial-user.html), as measured from the instance creation in minutes; defaults to 60.
- `extra_no_proxy` — (Optional) When configured to use a proxy, a `,` (comma) separated list of hosts to exclude from proxying. Please note that this list does not support whitespace characters. For example: `127.0.0.1,tfe.myapp.com,myco.github.com`.
- `ca_certs` — (Optional) Custom certificate authority (CA) bundle. JSON does not allow raw newline characters, so replace any newlines
  in the data with `\n`. For instance:

  ```
  --- X509 CERT ---
  aabbccddeeff
  --- X509 CERT ---
  ```

  would become

  ```
  --- X509 CERT ---\naabbccddeeff\n--- X509 CERT ---\n
  ```

- `extern_vault_enable` — (Optional) Indicate if an external Vault cluster is being used. Set to `1` if so.
  - These variables are only used if `extern_vault_enable` is set to `1`.
  - `extern_vault_addr` — (Required) URL of external Vault cluster.
  - `extern_vault_role_id` — (Required) AppRole RoleId to use to authenticate with the Vault cluster.
  - `extern_vault_secret_id` — (Required) AppRole SecretId to use to authenticate with the Vault cluster.
  - `extern_vault_path` — (Optional) Path on the Vault server for the AppRole auth. Defaults to `auth/approle`.
  - `extern_vault_token_renew` — (Optional) How often (in seconds) to renew the Vault token. Defaults to `3600`.
- `vault_path` — (Optional) Path on the host system to store the vault files. If `extern_vault_enable` is set, this has no effect.
- `vault_store_snapshot` — (Optional) Indicate if the vault files should be stored in snapshots. Set to `0` if not. Defaults to `1`.

#### `production_type` is required if you've chosen `production` for the `installation_type`:

- `production_type` — One of `external` or `disk`.

#### `disk_path` is required if you've chosen `disk` for `production_type`:

- `disk_path` — Path on instance to persistent storage.

#### The following settings apply if you've chosen `external` for `production_type`:

- `pg_user` — (Required) PostgreSQL user to connect as.
- `pg_password` — (Required) The password for the PostgreSQL user.
- `pg_netloc` — (Required) The hostname and port of the target PostgreSQL server, in the format `hostname:port`.
- `pg_dbname` — (Required) The database name.
- `pg_extra_params` — (Optional) Parameter keywords of the form `param1=value1&param2=value2` to support additional options that may be necessary for your specific PostgreSQL server.  Allowed values are [documented on the PostgreSQL site](https://www.postgresql.org/docs/9.4/static/libpq-connect.html#LIBPQ-PARAMKEYWORDS).  An additional restriction on the `sslmode` parameter is that only the `require`, `verify-full`, `verify-ca`, and `disable` values are allowed.

Select which placememt will be used for blob storage: S3, Azure, or GCS. Based on this value, you only need to provide one set of the following variables.

- `placement` — (Required) Set to `placement_s3` for S3, `placement_azure` for Azure, or `placement_gcs` for GCS

For S3 (or S3-compatible storage providers):

- `aws_instance_profile` (Optional) When set, use credentials from the AWS instance profile. Set to 1 to use the instance profile. Defaults to 0. If selected, `aws_access_key_id` and `aws_secret_access_key` are not required.
- `aws_access_key_id` — (Required unless `aws_instance_profile` is set) AWS access key ID for S3 bucket access. To use AWS instance profiles for this information, set it to `""`.
- `aws_secret_access_key` — (Required unless `aws_instance_profile` is set) AWS secret access key for S3 bucket access. To use AWS instance profiles for this information, set it to `""`.
- `s3_endpoint` — (Optional) Endpoint URL (hostname only or fully qualified URI). Usually only needed if using a VPC endpoint or an S3-compatible storage provider.
- `s3_bucket` — (Required) The S3 bucket where resources will be stored.
- `s3_region` — (Required) The region where the S3 bucket exists.
- `s3_sse` — (Optional)Eenables server-side encryption of objects in S3; if provided, must be set to `aws:kms`.
- `s3_sse_kms_key_id` — (Optional) An optional KMS key for use when S3 server-side encryption is enabled.

For Azure:

- `azure_account_name` — (Required) The account name for the Azure account to access the container.
- `azure_account_key` — (Required) The account key to access the account specified in `azure_account_name`.
- `azure_container` — (Required) The identifer for the Azure blob storage container.
- `azure_endpoint` — (Optional) The URL for the Azure cluster to use. By default this is the global cluster.

For GCS:

- `gcs_credentials` — (Required) JSON blob containing the GCP credentials document. **Note:** This is a string, so ensure values are properly escaped.
- `gcs_project` — (Required) The GCP project where the bucket resides.
- `gcs_bucket` — (Required) The storage bucket name.

## Installer settings

### Online

The following is an example `/etc/replicated.conf` suitable for an automated online install using a certificate trusted by a public or private CA. `ImportSettingsFrom` must be the full path to the application settings file. You also need to provide the full path to your license file in `LicenseFileLocation`.

See the full set of configuration parameters in the [Replicated documentation](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-replicated-automatically).

```json
{
    "DaemonAuthenticationType":     "password",
    "DaemonAuthenticationPassword": "your-password-here",
    "TlsBootstrapType":             "server-path",
    "TlsBootstrapHostname":         "server.company.com",
    "TlsBootstrapCert":             "/etc/server.crt",
    "TlsBootstrapKey":              "/etc/server.key",
    "BypassPreflightChecks":        true,
    "ImportSettingsFrom":           "/path/to/application-settings.json",
    "LicenseFileLocation":          "/path/to/license.rli"
}
```
#### Invoking the online installation script

Once `/etc/replicated.conf` has been created, you can retrieve and execute the install script as `root`:

```bash
curl -o install.sh https://install.terraform.io/ptfe/stable
bash ./install.sh \
    no-proxy \
    private-address=1.2.3.4 \
    public-address=5.6.7.8
```

Note the `private-address` and `public-address` flags provided to the installer.  These may be left out, but the installer will prompt for them if it is unable to determine appropriate values automatically. If the instance will not have a separate public address, you may provide the private address for both values.

### Airgapped

The following is an example `/etc/replicated.conf` suitable for an automated airgapped install, which builds on the online example above.  Note the addition of `LicenseBootstrapAirgapPackagePath`, which is a path to the `.airgap` bundle on the instance.

```json
{
    "DaemonAuthenticationType":          "password",
    "DaemonAuthenticationPassword":      "your-password-here",
    "TlsBootstrapType":                  "server-path",
    "TlsBootstrapHostname":              "server.company.com",
    "TlsBootstrapCert":                  "/etc/server.crt",
    "TlsBootstrapKey":                   "/etc/server.key",
    "BypassPreflightChecks":             true,
    "ImportSettingsFrom":                "/path/to/application-settings.json",
    "LicenseFileLocation":               "/path/to/license.rli",
    "LicenseBootstrapAirgapPackagePath": "/path/to/bundle.airgap"
}
```

#### Invoking the airgap installation script

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

## If the installation does not appear to be configured correctly

If the installation script (`install.sh`) exits successfully, but the Replicated web UI prompts for additional configuration rather than skipping that step, it's likely that the supplied configuration files were not applied during installation.

* Verify the locations and permissions of the files. The Replicated configuration file should be placed in `/etc/replicated.conf`, and the application settings file should be placed in the path specified in the Replicated configuration file. The permissions of both files should be `600` if owned by the `replicated` user, or `644`.
* Run a JSON validator on the files to check their validity.

After resolving any issues with file validity or permissions, run the following commands to reload your configuration:

~> **Important:** These commands are only for fixing a new installation. Do not run these commands on an existing installation, as they will destroy important data.

``` bash
sudo systemctl stop replicated replicated-ui replicated-operator
sudo rm -rf /var/lib/replicated
sudo systemctl start replicated replicated-ui replicated-operator
```


## References

- [Replicated installer flags](https://help.replicated.com/docs/distributing-an-application/installing-via-script/#flags)
- [`/etc/replicated.conf`](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-replicated-automatically)
- [application settings](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-app-settings-automatically)

