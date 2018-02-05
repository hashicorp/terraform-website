---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation (Installer Beta)"
sidebar_current: "docs-enterprise2-private-install-installer"
---

# Private Terraform Enterprise Automated Installation (Installer Beta)

The installation of Private Terraform Enterprise can be completely automated, for both online and airgapped modes.  Before invoking the installer you must:
- prepare `/etc/replicated.conf`
- prepare an [application settings](#application-settings) file
- copy your license file to the instance
- download the `.airgap` bundle to the instance (Airgapped mode only)

You may also need to provide additional flags (such as the instance's public and private IP addresses) in order to not be prompted for those values when running the installer.

It's expected that the user is already familiar with how to do a [manual install](./install-installer.html#installation).

## Application settings

This file contains the values you would normally provide in the settings screen, which may be as simple as choosing the demo installation type or as complex as specifying the Postgresql connection string and S3 bucket credentials and parameters.  You will need to reference it via the `ImportSettingsFrom` property in `/etc/replicated.conf`, which will be described below.

### Format

The settings file is JSON formatted.  The example below is suitable for a demo installation:

```json
{
  "hostname": {
    "value": "terraform.example.com"
  },
  "installation_type": {
    "value": "poc"
  },
  "capacity_concurrency": {
    "value": 5
  }
}
```

### Available settings

A number of settings are available to configure and tune your installation.  They are summarized below; it is expected the user will have completed a manual installation first and already be familiar with the nature of these parameters from the settings screen.

The following apply to every installation:

- `hostname` — (required) this is the hostname you will use to access your installation
- `installation_type` — (required) one of `poc` or `production`
- `capacity_concurrency` — number of concurrent plans and applies; defaults to `10`


`production_type` is required if you've chosen `production` for the `installation_type`:

- `production_type` — one of `external` or `disk`


`disk_path` is required if you've chosen `disk` for `production_type`:

- `disk_path` — path on instance to persistent storage


The following are required if you've chosen `external` for `production_type`:

- `postgres_url` — the database URL
- `aws_access_key_id` — AWS access key ID for S3 bucket access
- `aws_secret_access_key` — AWS secret access key for S3 bucket access
- `s3_bucket` — the S3 bucket where resources will be stored
- `s3_region` — the region where the S3 bucket exists


## Online

The following is an example `/etc/replicated.conf` suitable for an automated online install using a self-signed certificated.  `TlsBootstrapHostname` should match the `hostname` value in the application settings file (referenced by `ImportSettingsFrom`).  You also need to provide the full path to your license file in `LicenseFileLocation`.

See the full set of configuration parameters in the [Replicated documentation](https://help.replicated.com/docs/kb/developer-resources/automate-install/#configure-replicated-automatically).

```json
{
	"DaemonAuthenticationType":     "password",
    "DaemonAuthenticationPassword": "your-password-here",
    "TlsBootstrapType":             "self-signed",
    "TlsBootstrapHostname":         "tfe.example.com",
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

The following is an example `/etc/replicated.conf` suitable for an automated airgapped install, building on the online example above.  Note the addition of `LicenseBootstrapAirgapPackagePath`, which is a path to the `.airgap` bundle on the instance.  

```json
{
	"DaemonAuthenticationType":          "password",
    "DaemonAuthenticationPassword":      "your-password-here",
    "TlsBootstrapType":                  "self-signed",
    "TlsBootstrapHostname":              "tfe.example.com",
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
