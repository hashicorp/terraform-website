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