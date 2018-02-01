---
layout: "enterprise2"
page_title: "Terraform Enterprise Logging"
sidebar_current: "docs-enterprise2-home"
---

## Terraform Enterprise Logs

This document contains information about interacting with Private Terraform Enterprise logs.

### Audit Logs

As of Private Terraform Enterprise release v201802-1, audit logging is available in Private Terraform Enterprise. 

#### What will be logged?

The audit log will be updated when any resource managed by Terraform Enterprise is changed. Read requests will be logged for resources deemed sensitive. These include:

  * Authentication Tokens
  * Configuration Versions
  * Policy Versions
  * OAuth Tokens
  * SSH Keys
  * State Versions
  * Users
  * Vars


When requests occur, these are the pieces of information that will be logged:

  1. The actor
		* Users (including IP address and token used)
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
	3. The target of the action (any resource exposed by APIv2)
	4. The time that the action occurred
	5. Where the action was taken (web/API request, background job, etc.)

#### How will log entries be written?

Log entries are in JSON, just like other terraform logs. Log formatting will look like this: 

```
{"time":"2017-12-19T15:54:33.792Z","action":"plan","resource":"run","resource_id":"run-RgPD6h3tdpj9GaHG","actor":"gh-webhooks-tfe-dev-v2"}
{“time":"2017-12-19T16:56:18.623Z","resource":"run",action":"apply","resource_id":"run-RgPD6h3tdpj9GaHG","actor":"johnsmith"}
{
		“time": "2017-12-19T15:23:45.148Z",
		"resource": "var",
		"action": "destroy",
		"resource_id": "var-9a3hrbYfFsTzg2FZ",
		"actor": "jsmith",
		"category": "env",
		"key": "ATLAS_CONFIRM_DESTROY"
}
```

#### Where will log entries be written?

Audit logs are written using the `Rails.logger`, which is already setup to use log rotation, which will prevent logs from going too large in size. To distinguish Audit Log entries from other log entries, the JSON is prefixed with `[Audit Log]`. These are written out to CloudWatch logs just like application-level logs.

---

### Application-level Logs

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

### System-level Logs

All other system-level logs can be found in the standard locations for an Ubuntu 16.04 system.
