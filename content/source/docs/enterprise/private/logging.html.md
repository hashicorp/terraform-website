---
layout: "enterprise2"
page_title: "Terraform Enterprise Logging"
sidebar_current: "docs-enterprise2-private-logging"
---

# Terraform Enterprise Logs

This document contains information about interacting with Private Terraform Enterprise logs. There are two types of logs, application logs and audit logs. Application logs emit information about the services that comprise Terraform Enterprise. Audit logs emit information whenever any resource managed by Terraform Enterprise is changed.

## Application Logs 

### Installer

The installer-based version runs the application in a set of docker containers. As such, any tooling that can interact with docker logs
can read the logs. This includes running the command `docker logs`, as well as access the [Docker API](https://docs.docker.com/engine/api/v1.36/#operation/ContainerLogs).

An example of a tool that can automatically pull logs for all docker containers is [logspout](https://github.com/gliderlabs/logspout).
It can easily be configured to take the docker logs and send them to a syslog endpoint. Here is an example invocation to do so:

```shell
$ docker run --name="logspout" \
  --volume=/var/run/docker.sock:/var/run/docker.sock \
  gliderlabs/logspout \
  syslog+tls://logs.mycompany.com:55555
```

The container uses the docker API internally to find the containers and ingress the logs, at which point it then sends
them to `logs.mycompany.com` over TCP on port 55555 using syslog over TLS.

~> **NOTE:** While docker has support for daemon wide log drivers that can send all logs for all containers to various services,
   Private Terraform Enterprise installations only supports docker `log-driver` configured to either `json-file` or `journald`.
   All other log drivers prevent the support bundle functionality from gathering logs, making it
   impossible to provide product support. **DO NOT** change the log driver of an installation to anything other than `json-file` or `journald`.

### AMI based installs

Private Terraform Enterprise's application-level services all log to CloudWatch logs, with one stream per service. The stream names take the format:

```
{hostname}-{servicename}
```

Where `hostname` is the fqdn you provided when setting up Private Terraform Enterprise, and `servicename` is the name of the service whose logs can be found in the stream. More information about each service can be found in [`tfe-architecture`](#private-terraform-enterprise-architecture).

For example, if your Private Terraform Enterprise installation is available at `tfe.mycompany.io`, you'll find CloudWatch Log streams like the following:

```
tfe.mycompany.io-atlas-frontend
tfe.mycompany.io-atlas-worker
tfe.mycompany.io-binstore
tfe.mycompany.io-logstream
tfe.mycompany.io-packer-build-manager
tfe.mycompany.io-packer-build-worker
tfe.mycompany.io-slug-extract
tfe.mycompany.io-slug-ingress
tfe.mycompany.io-slug-merge
tfe.mycompany.io-storagelocker
tfe.mycompany.io-terraform-build-manager
tfe.mycompany.io-terraform-build-worker
tfe.mycompany.io-terraform-state-parser
```

CloudWatch logs can be searched, filtered, and read from either from the AWS Web Console or (recommended) the command line [`awslogs`](https://github.com/jorgebastida/awslogs) tool.

**NOTE:** All other system-level logs can be found in the standard locations for an Ubuntu 16.04 system.

## Audit Logs

Audit log entries are written to the application logs. To distinguish audit Log entries from other log entries, the JSON is prefixed with `[Audit Log]`.

### Installer

The audit logs have been available in the installer since beta4. They are emitted along with other logs by the `ptfe_atlas` container.

### AMI based installs

As of Private Terraform Enterprise release v201802-1, audit logging is available in Private Terraform Enterprise. These are written out to CloudWatch logs just like all other application-level logs.


### Log Contents

The audit log will be updated when any resource managed by Terraform Enterprise is changed. Read requests will be logged for resources deemed sensitive. These include:

  * Authentication Tokens
  * Configuration Versions
  * Policy Versions
  * OAuth Tokens
  * SSH Keys
  * State Versions
  * Users
  * Variables

When requests occur, these pieces of information will be logged:

  1. The actor
    * Users (including IP address)
    * Version Control System users (identified in webhooks)
    * Service accounts
    * Terraform Enterprise
  2. The action
    * Reading sensitive resources
    * Creation of new resources
    * Updating existing resources
    * Deletion of existing resources
    * Additional actions as defined in /actions/* namespaces
    * Webhook API calls
  3. The target of the action (any resource exposed by the V2 API)
  4. The time that the action occurred
  5. Where the action was taken (web/API request, background job, etc.)

### Log Format

Log entries are in JSON, just like other Terraform logs. Most audit log entries are formatted like this:

``` json
{
  "timestamp": "2017-12-19T15:23:45.148Z",
  "resource": "workspace",
  "action": "destroy",
  "resource_id": "ws-9a3hrbYfFsTzg2FZ",
  "actor": "jsmith",
  "actor_ip": "94.122.17.37"
}
```

Certain entries will contain additional information in the payload, but all audit log entries will contain the above keys.

### Log Location

Audit log entries are written to the application logs. To distinguish audit log entries from other log entries, the JSON is prefixed with `[Audit Log]`. These are written out to CloudWatch logs just like all other application-level logs. For example:

```
2018-03-27 21:55:29 [INFO] [Audit Log] {"resource":"oauth_client","action":"create","resource_id":"oc-FErAhnuHHwcad3Kx","actor":"atlasint","timestamp":"2018-03-27T21:55:29Z","actor_ip":"11.22.33.44"}
```

---
