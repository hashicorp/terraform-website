---
layout: "enterprise"
page_title: "Monitoring Private Terraform Enterprise"
---

# Monitoring a Private Terraform Enterprise Instance

This document outlines best practices for monitoring a Private Terraform Enterprise (PTFE) instance.

## Health Check 

PTFE provides a `/_health_check` endpoint on the instance. If PTFE is up, the health check will return a `200 OK`.

## Metrics & Telemetry

In addition to health-check monitoring, we recommend monitoring standard server metrics on the PTFE instance:

- I/O
- CPU
- Disk

## Internal Monitoring

Beginning in version 201811-1, PTFE includes internal monitoring of critical application metrics using a statsd collector. The resulting metrics are included with the [diagnostic bundles provided to HashiCorp Support](./diagnostics.html). If the PTFE instance is already running a collector on the same port, PTFE may not start up correctly due to the conflict, and logs will indicate:

```
Error starting userland proxy: listen udp 0.0.0.0:XXXXX: bind: address already in use
```

To prevent this conflict, disable metrics collection by PTFE:

1. Access the installer dashboard on port 8800 of your instance.
2. Locate **Advanced Configuration** on the configuration page under **Terraform Build Worker image**.
3. Uncheck "Enable metrics collection".
4. Restart the application from the dashboard if it does not restart automatically.

We recommend that internal monitoring only be disabled if it is causing issues, as it otherwise provides useful detail in diagnosing issues. From version 201812-1, the collector is configured on port 23010, and the 23000-23100 range should be [reserved for PTFE](./preflight-installer.html#network-requirements) to run any services of this nature.
