---
layout: "enterprise"
page_title: "Monitoring - Infrastructure Administration - Terraform Enterprise"
---

# Monitoring a Terraform Enterprise Instance

This document outlines best practices for monitoring a Terraform Enterprise instance.

## Health Check

Terraform Enterprise provides a `/_health_check` endpoint on the instance. If Terraform Enterprise is up, the health check will return a `200 OK`.

The `/_health_check` endpoint operates in 2 modes:

- Full check
- Minimal check

With a full check, the service will attempt to verify the status of internal components and PostgreSQL, in contrast to a minimal check which returns `200 OK` automatically after a successful full check.

The endpoint's default behavior is to perform a full check during startup of the instance, and minimal checks after Terraform Enterprise is active and running.

-> **Note:** If you wish to force a full check, an additional query parameter is required: `/_health_check?full=1`. Take extra caution as every call will make requests to internal components and PostgreSQL, increasing system load and latency.

## Metrics & Telemetry

In addition to health-check monitoring, we recommend monitoring standard server metrics on the Terraform Enterprise instance:

- I/O
- RAM
- CPU
- Disk

As of the `v202108-1` release, TFE will attach additional labels to the Docker containers used to execute Terraform runs. These labels include:

* `run_type`: The job’s run type (either "plan" or "apply")
* `run_id`: The job’s run ID (taking the form of "run-&lt;random string&gt;")
* `workspace_name`: The name of the workspace under which the job is executing
* `organization_name`: The name of the organization under which the job is executing

Environments with Docker-aware observability tooling (such as `cAdvisor`) can leverage these labels to associate individual containers (and the resources they consume) with specific TFE runs.

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
