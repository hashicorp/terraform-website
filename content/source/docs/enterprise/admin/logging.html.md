---
layout: "enterprise"
page_title: "Logging - Infrastructure Administration - Terraform Enterprise"
---

# Terraform Enterprise Logs

This document contains information about interacting with Terraform Enterprise logs. There are two types of logs, application logs and audit logs. Application logs emit information about the services that comprise Terraform Enterprise. Audit logs emit information whenever any resource managed by Terraform Enterprise is changed.

## Application Logs

Terraform Enterprise runs in a set of Docker containers. As such, any tooling that can interact with Docker logs can read the logs. This includes the command `docker logs`, as well as access via the [Docker API](https://docs.docker.com/engine/api/v1.36/#operation/ContainerLogs).

An example of a tool that can automatically pull logs for all docker containers is [logspout](https://github.com/gliderlabs/logspout).
Logspout can be configured to take the Docker logs and send them to a syslog endpoint. Here's an example invocation:

```shell
$ docker run --name="logspout" \
  --volume=/var/run/docker.sock:/var/run/docker.sock \
  gliderlabs/logspout \
  syslog+tls://logs.mycompany.com:55555
```

The logspout container uses the Docker API internally to find other running containers and ingress their logs, then send them to `logs.mycompany.com` on port 55555 using syslog with TCP/TLS.

~> **NOTE:** While docker has support for daemon-wide log drivers that can send all logs for all containers to various services,
   Terraform Enterprise only supports having the Docker `log-driver` configured to either `json-file` or `journald`.
   All other log drivers prevent the support bundle functionality from gathering logs, making it
   impossible to provide product support. **DO NOT** change the log driver of an installation to anything other than `json-file` or `journald`.

## Audit Logs

The audit logs are emitted along with other logs by the `ptfe_atlas` container. To distinguish audit log entries from other log entries, the JSON is prefixed with `[Audit Log]`. For example:

```
2018-03-27 21:55:29 [INFO] [Audit Log] {"resource":"oauth_client","action":"create","resource_id":"oc-FErAhnuHHwcad3Kx","actor":"atlasint","timestamp":"2018-03-27T21:55:29Z","actor_ip":"11.22.33.44"}
```

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

Log entries are in JSON, just like other Terraform Enterprise logs. Most audit log entries are formatted like this:

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

