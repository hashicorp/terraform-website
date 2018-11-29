---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Diagnostics"
sidebar_current: "docs-enterprise2-private-diagnostics"
---

# Private Terraform Enterprise Diagnostics

This document contains information on how to provide HashiCorp with diagnostic information about a Private Terraform Enterprise (PTFE) installation that requires assistance from HashiCorp support.

## Support Bundle

Diagnostic information is available via the installer dashboard on port 8800 of your installation.

On the dashboard, click on the Support tab:

![PTFE Dashboard Top](./assets/ptfe-dashboard.png)

On the next page, click the _Download Support Bundle_ button which will download the support bundle directly to your web browser.

![PTFE Support](./assets/ptfe-support.png)

Then, attach the bundle to your support ticket. If possible, use the SendSafely integration (as it allows for large file uploads).


## About the Bundle

The support bundle contains logging and telemetry data from various components
in Private Terraform Enterprise. It may also include log data from Terraform builds you have executed on your Private Terraform Enterprise installation.


## Pre-Sales Uploads

Customers in the pre-sales phase can upload support bundle files directly at https://hashicorp.sendsafely.com/u/ptfe-support-bundles.
