---
layout: "enterprise"
page_title: "Minio Setup Guide - Installation (Installer) - Terraform Enterprise"
description: |-
  This document provides an overview for setting up Minio for external object storage for HashiCorp Private Terraform Enterprise (PTFE).
---

# Private Terraform Enterprise Installation (Installer) - Minio Setup Guide

This document provides an overview for setting up [Minio](https://minio.io) for external object storage for HashiCorp Private Terraform Enterprise (PTFE).

## Required Reading

- Ensure you are familiar with PTFE's operation and [installation requirements](./installer.html), and especially the [Operational Mode Decision](./preflight-installer.html#operational-mode-decision).
- Familiarize yourself with [Minio](https://minio.io).

## Overview

When configured to use external services, PTFE must be connected to a storage service to persist workspace state and other file-based data. Native support exists for Azure Blob Storage, Amazon S3, and services that are API-compatible with Amazon S3. If you are not using Azure or a cloud provider with an S3-compatible service, or you are running PTFE in an environment without a storage service, it may be possible to use [Minio](https://minio.io) instead.

## Installation

~> **Note:** This is not a production-ready configuration: it's intended to guide you to a working configuration that can later be automated and hardened.

This guide will walk through installing Minio in a Docker container alongside PTFE on the same host, with PTFE configured in the "Production - External Services" [operational mode](./preflight-installer.html#operational-mode-decision). Data will not be persisted outside of an ephemeral Docker volume, Minio will not start on system boot, etc. The guide assumes your instance will have access to the Internet and that you will be performing an online install of PTFE.

### System preparation

Ensure your Linux instance meets the [requirements](./preflight-installer.html#linux-instance). You will need [jq](https://stedolan.github.io/jq/) (a command-line JSON processor), and the [AWS CLI](https://aws.amazon.com/cli/).

You also need a PostgreSQL database that meets the [requirements](./preflight-installer.html#postgresql-requirements), as this is part of the external services operational mode.

### PTFE installation

Begin with an [online installation](./install-installer.html#run-the-installer-online). Once the installation script has finished and you're presented with the following text, move on to the next section:

```
To continue the installation, visit the following URL in your browser:

  https://<TFE HOSTNAME>:8800
```

### Start Minio

Now you'll start the Minio container, mounting a volume so that you can gain access to the generated config:

    docker run \
      -d \
      --name minio \
      -v /run/minio/config:/root/.minio \
      minio/minio:latest \
      -- \
      server /data

Ensure that Minio has started by watching for `/var/run/minio/config/config.json` to be written:

    while [ ! -e /var/run/minio/config/config.json ]; do
      sleep 3
    done

You now need to collect several pieces of information about your running Minio instance:

- IP address of the running container: `docker inspect minio | jq -r .[0].NetworkSettings.IPAddress`
- Access key: `jq -r .credential.accessKey /var/run/minio/config/config.json`
- Secret key: `jq -r .credential.secretKey /var/run/minio/config/config.json`

### Create a bucket

Like S3, Minio does not automatically create buckets. Use the AWS CLI to create a bucket named `ptfe` that will be used to store data:

```bash
export AWS_ACCESS_KEY_ID="<access key from above>"
export AWS_SECRET_ACCESS_KEY="<secret key from above>"

aws --region us-east-1 --endpoint-url http://<ip address from above>:9000 s3 mb s3://ptfe
```

### PTFE installation

You may now [continue the installation in the browser](./install-installer.html#continue-installation-in-browser). When you arrive at the Operational Mode choice in the installer, follow these steps:

1. Choose the "Production" installation type
2. Choose the "External Services" production type
3. Provide the required Database URL for the PostgreSQL configuration
4. Choose "S3" for object storage
5. Enter the access key and secret access key using the information retrieved from Minio
6. Provide the endpoint URL, like: `http://<ip address from above>:9000`
7. Enter the name of the bucket you created above (`ptfe` in the example)
8. Enter `us-east-1` for the region; this is arbitrary, but must be a valid AWS region
   **Note:** The "Test Authentication" button does not currently work for non-AWS endpoints
9. Click "Save"

## Next Steps

- Familiarize yourself with the various storage backends provided by Minio
- Make sure you know how to back up and restore the data written to Minio
