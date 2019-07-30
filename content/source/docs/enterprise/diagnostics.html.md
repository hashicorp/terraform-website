---
layout: "enterprise"
page_title: "Diagnostics - Terraform Enterprise"
---

# Terraform Enterprise Diagnostics

This document contains information on how to provide HashiCorp with diagnostic information about a Terraform Enterprise installation that requires assistance from HashiCorp support.

## Downloading the Support Bundle

Diagnostic information is available via in the Installer dashboard on port 8800 of your installation.

On the dashboard, click on the Support tab:

![Terraform Enterprise Dashboard Top](./assets/ptfe-dashboard.png)

On the next page, click the _Download Support Bundle_ button which will download the support bundle directly to your web browser.

![Terraform Enterprise Support](./assets/ptfe-support.png)

Then, attach the bundle to your support ticket. If possible, use the SendSafely integration available in the support portal at support.hashicorp.com, as it allows for large file uploads.

If you are unable to use the integration in the portal, please upload directly to https://hashicorp.sendsafely.com/u/ptfe-support-bundles. This includes pre-sales customers.

## About the Bundle

The support bundle contains logging and telemetry data from various components
in Terraform Enterprise. It may also include log data from Terraform builds you have executed on your Terraform Enterprise installation.


## Pre-Sales Uploads

As noted above, customers in the pre-sales phase can upload support bundle files directly at https://hashicorp.sendsafely.com/u/ptfe-support-bundles.
