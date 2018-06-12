---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Automated Recovery (Installer)"
sidebar_current: "docs-enterprise2-private-installer-automated-recovery"
---

# Private Terraform Enterprise Automated Recovery (Installer)

This guide explains how to configure automated recovery for a Private Terraform
Enterprise installation. The goal is to provide a short Mean-Time-To-Recovery (MTTR)
in the event of an outage. There are two steps in the automated recovery process:

1. Configure snapshots on your current install to backup data
1. Provision a new PTFE instance using the latest snapshot

This guide will walk through both of these steps.

## 1. Configure snapshots

Snapshots are taken on the Private TFE instance. That instance can
have two types of data on it:

- Terraform Enterprise application data: The core product data such as
run history, configuration history, state history. This data
changes frequently.
- Terraform Enterprise installer data: The data used
to configure Private TFE itself such as installation type, database
connection settings, hostname. This data rarely changes.

In demo mode, both application data and installer data are
stored on the PTFE instance. In mounted disk and external services mode, only
installer data is stored on the instance. Application data
is stored in the mounted disk or in an external Postgres.

Automated snapshots are more effective when using mounted disk or
external services as the amount of backed up data is smaller and
less risky.

Snapshots are configured in the dashboard under `Console Settings`,
in the `Snapshot & Restore` section. We suggest you also select
`Enable Automatic Scheduled Snapshots`. For the interval, it depends
on the mode of operation you're using. If you're in Demo mode,
one hour is recommended as that will minimize the data loss to one
hour only. For Mounted Disk or External Services, Daily is recommended
as the snapshots contain only configuration data, not application data.

## 2. Restore a snapshot in a new PTFE instance

## Version Checking

Using the restore mechanism requires Replicated version 2.17.0 or greater.
You can check the version using `replicatedctl version`.

## Script
Below are examples of restore scripts that are run on machine boot.
There are many mechanisms that can run a script on boot (cloud-init, systemd, /etc/init.d),
which one is used is up to the user

This script is presented as an example. Anyone using it needs to understand
what it's doing and is free to modify it to meet any additional needs they have.

### S3

This example uses S3 as the mechanism to store snapshots on a debian-based system.


```
#!/bin/bash

set -e -u -o pipefail

bucket=your_bucket_to_store_snapshots
region=region_of_the_bucket
access_key=aws_access_key_id
secret_key=aws_secret_access_key

access="--store s3 --s3-bucket $bucket --s3-region $region --s3-key-id $access_key --s3-secret-key $secret_key"

# jq is used by this script, so install it. For other Linux distros, either preinstall jq
# and remove these lines, or change to the mechanism your distro uses to install jq.

apt-get update
apt-get install -y jq

# Run the installer.

curl https://install.terraform.io/ptfe/stable | bash -s fast-timeouts

# This retrieves a list of all the snapshots currently available.
replicatedctl snapshot ls $access -o json > /tmp/snapshots.json

# Pull just the snapshot id out of the list of snapshots
id=$(jq -r 'sort_by(.finished) | .[-1].id // ""' /tmp/snapshots.json)

# If there are no snapshots available, exit out
if test "$id" = ""; then
  echo "No snapshots found"
  exit 1
fi

echo "Restoring snapshot: $id"

# Restore the detected snapshot. This ignores preflight checks to be sure the application
# is booted.
replicatedctl snapshot restore $access --dismiss-preflight-checks "$id"

# Wait until the application reports itself as running. This step can be removed if
# something upstream is prepared to wait for the application to finish booting.
until curl -f -s --connect-timeout 1 http://localhost/_health_check; do
  sleep 1
done

echo
echo "Application booted!"
```

### SFTP

This example uses sftp to store the snapshots.

```
#!/bin/bash

set -e -u -o pipefail

key_file=path_to_your_ssh_key
key="$(base64 -w0 "$key_file")"
host=sftp_server_hostname_or_ip
user=user_to_sftp_on_the_remote_server

access="--store sftp --sftp-host $host --sftp-user $user --sftp-key $key"

# jq is used by this script, so install it. For other Linux distros, either preinstall jq
# and remove these lines, or change to the mechanism your distro uses to install jq.

apt-get update
apt-get install -y jq

# Run the installer.

curl https://install.terraform.io/ptfe/stable | bash -s fast-timeouts

# This retrieves a list of all the snapshots currently available.
replicatedctl snapshot ls $access -o json > /tmp/snapshots.json

# Pull just the snapshot id out of the list of snapshots
id=$(jq -r 'sort_by(.finished) | .[-1].id // ""' /tmp/snapshots.json)

# If there are no snapshots available, exit out
if test "$id" = ""; then
  echo "No snapshots found"
  exit 1
fi

echo "Restoring snapshot: $id"

# Restore the detected snapshot. This ignores preflight checks to be sure the application
# is booted.
replicatedctl snapshot restore $access --dismiss-preflight-checks "$id"

# Wait until the application reports itself as running. This step can be removed if
# something upstream is prepared to wait for the application to finish booting.
until curl -f -s --connect-timeout 1 http://localhost/_health_check; do
  sleep 1
done

echo
echo "Application booted!"
```

### Local directory

This example uses a local directory to store the snapshots. If this is intended to be run
on a brand new system, the local directory would be either mounted block device or a
network filesystem like NFS or CIFS.

```
#!/bin/bash

set -e -u -o pipefail

path=absolute_path_to_directory_of_snapshots

access="--store local --path '$path'"

# jq is used by this script, so install it. For other Linux distros, either preinstall jq
# and remove these lines, or change to the mechanism your distro uses to install jq.

apt-get update
apt-get install -y jq

# Run the installer.

curl https://install.terraform.io/ptfe/stable | bash -s fast-timeouts

# This retrieves a list of all the snapshots currently available.
replicatedctl snapshot ls $access -o json > /tmp/snapshots.json

# Pull just the snapshot id out of the list of snapshots
id=$(jq -r 'sort_by(.finished) | .[-1].id // ""' /tmp/snapshots.json)

# If there are no snapshots available, exit out
if test "$id" = ""; then
  echo "No snapshots found"
  exit 1
fi

echo "Restoring snapshot: $id"

# Restore the detected snapshot. This ignores preflight checks to be sure the application
# is booted.
replicatedctl snapshot restore $access --dismiss-preflight-checks "$id"

# Wait until the application reports itself as running. This step can be removed if
# something upstream is prepared to wait for the application to finish booting.
until curl -f -s --connect-timeout 1 http://localhost/_health_check; do
  sleep 1
done

echo
echo "Application booted!"
```
