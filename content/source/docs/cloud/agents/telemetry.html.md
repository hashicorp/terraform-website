---
layout: "cloud"
page_title: "Telemetry - Terraform Cloud Agents - Terraform Cloud and Terraform Enterprise"
---

# Telemetry

Terraform Cloud Agents emit telemetry data using the [OpenTelemetry](https://opentelemetry.io/) protocol.

## Configuration

To configure your agent to emit telemetry data, you must include the `-otlp-address` flag or `TFC_AGENT_OTLP_ADDRESS` environment variable. This should be set to the host:port address of an [OpenTelemetry collector](https://opentelemetry.io/docs/concepts/data-collection/). Optionally, you can pass the `-otlp-cert-file` or `TFC_AGENT_OTLP_CERT_FILE`. The agent will use a certificate at the path supplied to encrypt the client connection to the OpenTelemetry collector. When omitted, client connections are not secured.

## TODO

What else should we include?
