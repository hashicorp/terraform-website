---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation (Installer) - Minio Setup Guide"
sidebar_current: "docs-enterprise2-private-installer-minio"
description: |-
  This document provides an overview for setting up minio for external object storage for HashiCop Private Terraform Enterprise (PTFE).
---

## Introduction

This document provides an overview for setting up minio for external object storage for HashiCop Private Terraform Enterprise (PTFE).

When configured to use external services, PTFE must be connected to a storage service to persist workspace state and other file-based data.  Native support exists for Azure Blob Storage, Amazon S3, and services that are API-compatible with Amazon S3.  If you are not using Azure or a cloud provider with an S3-compatible service, or you are running PTFE in an environment without a storage service, it may be possible to use [minio](https://minio.io) instead.  Minio is an Amazon S3-compatible object storage server that can use mounted filesystems or a variety of other cloud storage solutions to persist data.  HashiCorp may add support in the future for other cloud storage solutions to meet customer requests.

## Required Reading

- Ensure you are familiar with PTFE's operation and [installation requirements](./installer.html), and especially the Operational Mode Decision.
- Familiarize yourself with [minio](https://minio.io).

## Overview

This guide will walk through installing minio in a Docker container alongside PTFE on the same host, with PTFE configured in the "Production - External Services" [operational mode](.install-installer.html#operational-mode-decision).  This is not a production-ready configuration: it's intended to guide you to a working configuration that can later be automated and hardened.  Data will not be persisted outside of an ephemeral Docker volume, minio will not start on system boot, etc.  It is assumed your instance will have access to the Internet and that you will be performing an online install of PTFE.

## Installation

### System preparation

Ensure your Linux instance meets the [requirements](./install-installer.html#linux-instance).  You will need [jq](https://stedolan.github.io/jq/) and the [AWS cli](https://aws.amazon.com/cli/).

You also need a PostgreSQL database that meets the [requirements](.install-installer.html#postgresql-requirements), as this is part of the external services operational mode.

### PTFE installation

Begin with an [online installation](./install-installer.html#run-the-installer-online).  Once the installation script has finished and you're presented with the following text, move on to the next section:

```
To continue the installation, visit the following URL in your browser:

  https://<this_server_address>:8800
```

### Start minio

Now you'll start the minio container, mounting a volume so that you can gain access to the generated config:

    docker run \
      -d \
      --name minio \
      -v /run/minio/config:/root/.minio minio/minio:latest \
      -- \
      server /data

Ensure that minio has started by watching for `/var/run/minio/config/config.json` to be written:

    while [ ! -e /var/run/minio/config/config.json ]; do
      sleep 3
    done

You now need to collect several pieces of information about your running minio instance:

- the IP address of the running container: `docker inspect minio | jq -r .[0].NetworkSettings.IPAddress`
- the access key: `jq -r .credential.accessKey /var/run/minio/config/config.json`
- the secret key: `jq -r .credential.secretKey /var/run/minio/config/config.json`

### Create a bucket

Like S3, minio does not automatically create buckets.  Use the AWS cli to create a bucket named `ptfe` that will be used to store data:

```bash
export AWS_ACCESS_KEY_ID="<access key from above>"
export AWS_SECRET_ACCESS_KEY="<secret key from above>"

aws --region us-east-1 --endpoint-url http://<ip address from above>:9000 s3 mb s3://ptfe
```

### PTFE installation

You may now [continue the installation in the browser](./install-installer.html#continue-installation-in-browser).

1. provide a valid hostname
2. choose the "Production" installation type
3. choose the "External Services" production type
4. provide the required Database URL for the PostgreSQL configuration
5. choose "S3" for object storage
6. enter the access key and secret access key using the information retrieved from minio
7. provide the endpoint URL, like: `http://<ip address from above>:9000`
8. enter the name of the bucket you created above (`ptfe` in the example)
9. enter `us-east-1` for the region; this is arbitrary, but must be a valid AWS region
10. the "Test Authentication" button does not currently work for non-AWS endpoints
11. click "Save"

## Next Steps

- Familiarize yourself with the various storage backends provided by minio
- Make sure you know how to back up and restore the data written to minio
