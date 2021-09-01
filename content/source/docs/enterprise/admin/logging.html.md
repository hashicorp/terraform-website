---
layout: "enterprise"
page_title: "Log Forwarding - Infrastructure Administration - Terraform Enterprise"
---

# Terraform Enterprise Log Forwarding

Terraform Enterprise supports forwarding its logs to one or more external
destinations; aptly referred to as log forwarding. This page details how to
configure log forwarding in Terraform Enterprise.

## Requirements

Log forwarding requires:

- Terraform Enterprise running on an instance with the `systemd-journald`
service started and enabled. Execute `systemctl status systemd-journald` to
check if the `systemd-journald` service is started and enabled.
- A version of Docker that supports the `journald` logging driver. Execute
`docker info --format '{{.Plugins.Log}}'` to check if the `journald` plugin is
listed.
- Network connectivity between Terraform Enterprise and the desired external
destination(s) where logs should be forwarded to.

## Configuration

In order to use log forwarding, it must be enabled and configured. Once that is
done, the Terraform Enterprise application will need to be restarted for the log
forwarding configuration to take effect.

### Enable Log Forwarding

To enable log forwarding, the `log_forwarding_enabled` Terraform Enterprise
application setting must be set to the value `1`.

Enable log forwarding for a standalone installation of Terraform Enterprise:

```
replicatedctl app-config set log_forwarding_enabled --value 1
```

Enable log forwarding for an active/active installation of Terraform Enterprise:

```
tfe-admin app-config -k log_forwarding_enabled -v 1
```

When enabled, the Terraform Enterprise application settings should show the
following for the `log_forwarding_enabled` setting:

```
    ...
    "log_forwarding_enabled": {
        "value": "1"
    },
    ...
```

Log forwarding is disabled by default.

### Configure External Destinations

Once log forwarding is enabled, it must be configured to forward logs to one or
more external destinations. To configure log forwarding, the
`log_forwarding_config` Terraform Enterprise application setting must contain
valid [Fluent Bit `[OUTPUT]` configuration](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit)
specifying which external destination(s) to forward logs to. Since the Terraform
Enterprise application settings are stored as JSON strings, it is recommended to
create a `fluent-bit.conf` file with the valid Fluent Bit `[OUTPUT]`
configuration and then configure the `log_forwarding_config` Terraform
Enterprise application setting with the contents of that `fluent-bit.conf` file.
That way, the configuration is stored in the Terraform Enterprise application
settings exactly how it appears in the `fluent-bit.conf` file.

Configure log forwarding for a standalone installation of Terraform Enterprise:

```
replicatedctl app-config set log_forwarding_config --value "$(cat fluent-bit.conf)"
```

Configure log forwarding for an active/active installation of Terraform
Enterprise:

```
tfe-admin app-config -k log_forwarding_config -v "$(cat fluent-bit.conf)"
```

Once configured, the Terraform Enterprise application settings should show the
`log_forwarding_config` setting in escaped JSON string format:

```
    ...
    "log_forwarding_config": {
        "value": "# Match all logs and do not forward them anywhere.\n[OUTPUT]\n    Name null\n    Match *\n"
    },
    ...
```

The default configuration does not forward any logs.

```
# Match all logs and do not forward them anywhere.
[OUTPUT]
    Name null
    Match *
```

To forward logs to multiple external destinations, use multiple `[OUTPUT]`
directives.

```
# Forward all logs to Datadog.
[OUTPUT]
    Name datadog
    Match *
    ...

# Forward all logs to Fluent Bit or Fluentd.
[OUTPUT]
    Name forward
    Match *
    ...
```

~> **NOTE:** Do not use an `[OUTPUT]` directive with the
[`stdout` Fluent Bit output plugin](https://docs.fluentbit.io/manual/pipeline/outputs/standard-output).
Doing so will result in a loop that will continuously emit logs!

## Supported External Destinations

These are the supported external destinations one can forward logs to. Each
supported external destination contains example configuration for convenience.

### Amazon CloudWatch

This example configuration forwards all logs to Amazon CloudWatch. Refer to the
[`cloudwatch_logs` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)
for more information.

```
[OUTPUT]
    Name               cloudwatch_logs
    Match              *
    region             us-east-1
    log_group_name     example-log-group
    log_stream_name    example-log-stream
    auto_create_group  On
```

~> **NOTE:** Sending to Amazon CloudWatch is only supported when Terraform
Enterprise is located within AWS due to how Fluent Bit reads AWS credentials.

~> **NOTE:** In Terraform Enterprise installations using AWS external services,
Fluent Bit will have access to the same `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` environment variables that are used for object storage.

### Amazon S3

This example configuration forwards all logs to Amazon S3. Refer to the
[`s3` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/s3)
for more information.

```
[OUTPUT]
    Name                          s3
    Match                         *
    bucket                        example-bucket
    region                        us-east-1
    total_file_size               250M
    s3_key_format                 /$TAG/%Y/%m/%d/%H/%M/%S/$UUID.gz
    s3_key_format_tag_delimiters  .-
```

~> **NOTE:** Sending to Amazon S3 is only supported when Terraform Enterprise is
located within AWS due to how Fluent Bit reads AWS credentials.

~> **NOTE:** In Terraform Enterprise installations using AWS external services,
Fluent Bit will have access to the same `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` environment variables that are used for object storage.

### Azure Blob Storage

This example configuration forwards all logs to Azure Blob Storage. Refer to the
[`azure_blob` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/azure_blob)
for more information.

```
[OUTPUT]
    name                   azure_blob
    match                  *
    account_name           example-account-name
    shared_key             example-access-key
    path                   logs
    container_name         example-container-name
    auto_create_container  on
    tls                    on
```

### Azure Log Analytics

This example configuration forwards all logs to Azure Log Analytics. Refer to
the [`azure` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/azure)
for more information.

```
[OUTPUT]
    name         azure
    match        *
    Customer_ID  example-log-analytics-workspace-id
    Shared_Key   example-access-key
```

### Datadog

This example configuration forwards all logs to Datadog. Refer to the
[`datadog` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/datadog)
for more information.

```
[OUTPUT]
    Name        datadog
    Match       *
    Host        http-intake.logs.datadoghq.com
    TLS         on
    compress    gzip
    apikey      example-api-key
    dd_service  terraform_enterprise
    dd_source   docker
    dd_tags     environment:development,owner:engineering
```

### Forward

This example configuration forwards all logs to a listening Fluent Bit or
Fluentd instance. Refer to the
[`forward` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/forward)
for more information.

```
[OUTPUT]
    Name   forward
    Match  *
    Host   fluent.example.com
    Port   24224
```

### Google Cloud Platform Cloud Logging

This example configuration forwards all logs to Google Cloud Platform Cloud
Logging (formerly known as Stackdriver). Refer to the
[`stackdriver` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/stackdriver)
for more information.

```
[OUTPUT]
    Name       stackdriver
    Match      *
    location   us-east1
    namespace  terraform_enterprise
    node_id    example-hostname
    resource   generic_node
```

~> **NOTE:** Sending to Google Cloud Platform Cloud Logging is only supported
when Terraform Enterprise is located within GCP due to how Fluent Bit reads GCP
credentials.

~> **NOTE:** In Terraform Enterprise installations using GCP external services,
Fluent Bit will have access to the `GOOGLE_SERVICE_CREDENTIALS` environment
variable that points to a file containing the same GCP Service Account JSON
credentials that are used for object storage.

### Splunk Enterprise HTTP Event Collector (HEC)

This example configuration forwards all logs to Splunk Enterprise via the HTTP
Event Collector (HEC) interface. Refer to the
[`splunk` Fluent Bit output plugin documentation](https://docs.fluentbit.io/manual/pipeline/outputs/splunk)
for more information.

```
[OUTPUT]
    Name          splunk
    Match         *
    Host          example-splunk-hec-endpoint
    Port          8088
    Splunk_Token  example-splunk-token
```

## Audit Logs

Terraform Enterprise emits its audit logs along with its application logs.
Currently, log forwarding can forward either all Terraform Enterprise logs or no
logs at all. To distinguish audit logs from application logs, audit log entries
contain the string `[Audit Log]`. For example:

```
2021-08-31 04:58:30 [INFO] [7a233ad1-c50c-4737-a925-3be901e55fcb] [Audit Log] {"resource":"run","action":"create","resource_id":"run-nL77p69bsesoF3RK","organization":"example-org","organization_id":"org-pveSPvxocni226Fn","actor":"example-user","timestamp":"2021-08-31T04:58:30Z","actor_ip":"19.115.231.192"}
```

If you have a requirement to split audit logs from application logs, it is
recommended to forward all Terraform Enterprise logs to a log aggregation
system, filter the audit logs based on the `[Audit Log]` string, and forward
just the audit logs to the desired destination.
