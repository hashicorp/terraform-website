---
layout: "enterprise2"
page_title: "Monitoring Private Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-installer-monitoring"
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

Beginning in version 201811-1, PTFE includes internal monitoring of critical application metrics using a statsd collector on port 8125. The resulting metrics are included with the [diagnostic bundles provided to HashiCorp Support](./diagnostics.html). If the PTFE instance is already running a collector on this port, PTFE may not start up correctly due to the conflict, and logs will indicate:

```
Error starting userland proxy: listen udp 0.0.0.0:8125: bind: address already in use
```

To prevent this conflict, disable metrics collection by PTFE. Access the installer dashboard on port 8800 of your instance and locate **Advanced Configuration** on the configuration page under **Terraform Build Worker image**, and uncheck "Enable metrics collection". Then, restart the application from the dashboard if it does not restart automatically.

We recommend that internal monitoring only be disabled if it is causing issues, as it otherwise provides useful detail in diagnosing issues.
