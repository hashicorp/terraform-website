---
layout: "enterprise"
page_title: "Monitoring - Infrastructure Administration - Terraform Enterprise"
---

# Monitoring a Terraform Enterprise Instance

This document outlines best practices for monitoring a Terraform Enterprise instance.

## Health Check

Terraform Enterprise provides a `/_health_check` endpoint on the instance. If Terraform Enterprise is up, the health check will return a `200 OK`.

The `/_health_check` endpoint operates in 2 modes

- Full check
- Minimal check

With full check, the service will attempt to verify status of internal component  and PostgreSQL, in contrast to minimal check in which only returns `200 OK`.

In normal circumstance, full check will be performed during start up of the instance, once Terraform Enterprise started up in active running state, any subsequent checks will be performed in minimal check mode.

-> **Note:** If you wish to perform full check forcefully, additional query parameter is required with `/_health_check?full=1` and extra caution as every single call will make contact to internal component and PostgreSQL.

## Metrics & Telemetry

In addition to health-check monitoring, we recommend monitoring standard server metrics on the Terraform Enterprise instance:

- I/O
- CPU
- Disk

## Internal Monitoring

Beginning in version 201811-1, Terraform Enterprise includes internal monitoring of critical application metrics using a statsd collector. The resulting metrics are included with the [diagnostic bundles provided to HashiCorp Support](../support/index.html). If the Terraform Enterprise instance is already running a collector on the same port, Terraform Enterprise may not start up correctly due to the conflict, and logs will indicate:

```
Error starting userland proxy: listen udp 0.0.0.0:XXXXX: bind: address already in use
```

To prevent this conflict, disable metrics collection by Terraform Enterprise:

1. Access the installer dashboard on port 8800 of your instance.
2. Locate **Advanced Configuration** on the configuration page under **Terraform Build Worker image**.
3. Uncheck "Enable metrics collection".
4. Restart the application from the dashboard if it does not restart automatically.

We recommend that internal monitoring only be disabled if it is causing issues, as it otherwise provides useful detail in diagnosing issues. From version 201812-1, the collector is configured on port 23010, and the 23000-23100 range should be [reserved for Terraform Enterprise](../before-installing/network-requirements.html) to run any services of this nature.
