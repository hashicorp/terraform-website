---
layout: "cloud"
page_title: "Terraform Cloud for Splunk setup instructions"
description: |-
  HashiCorp Terraform Cloud customers can integrate with Splunk® using the official Terraform Cloud for Splunk app to understand Terraform Cloud operations
---

# Terraform Cloud for Splunk setup instructions

-> **Note:** Terraform Cloud for Splunk is a paid feature, available as part of the **Terraform Cloud for Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

## Overview

HashiCorp Terraform Cloud customers can integrate with Splunk® using the official [Terraform Cloud for Splunk](https://splunkbase.splunk.com/app/5141/) app to understand Terraform Cloud operations. Audit logs from Terraform Cloud are regularly pulled into Splunk, immediately giving visibility into key platform events within the predefined dashboards. Identify the most active policies, significant changes in resource operations, or filter actions by specific users within your organization. The app can be used with Splunk Cloud and Splunk Enterprise.


## Prerequisites

Access and support for the Terraform Cloud for Splunk app is limited to customers in the Terraform Cloud Business tier.

### Splunk Cloud

There are no special prerequisites for Splunk Cloud users.

### Splunk Enterprise

#### Networking Requirements

In order for the Terraform Cloud for Splunk app to function properly, it must be able to make outbound requests over HTTPS (TCP port 443) to the Terraform Cloud application APIs. This may require perimeter networking as well as container host networking changes, depending on your environment. The IP ranges are documented in the [Terraform Cloud IP Ranges documentation](/docs/cloud/architectural-details/ip-ranges.html). The services which run on these IP ranges are described in the table below.

Hostname | Port/Protocol | Directionality | Purpose
 --|--|--|--
 app.terraform.io | tcp/443, HTTPS | Outbound | Polling for new audit log events via the Terraform Cloud API

### Compatibility

The current release of the Terraform Cloud for Splunk app supports the following versions:

* Splunk Platform: 8.0 and later
* CIM: 4.3 and later

## Installation & Configuration

* Install the [Terraform Cloud for Splunk app via Splunkbase](https://splunkbase.splunk.com/app/5141/)
    * Splunk Cloud users should consult the latest instructions on how to [use IDM with cloud-based add-ons](https://docs.splunk.com/Documentation/SplunkCloud/8.0.2007/Admin/IntroGDI#Use_IDM_with_cloud-based_add-ons) within the Splunk documentation.
* Click "Configure the application"
* Generate an [Organization token](/docs/cloud/users-teams-organizations/api-tokens.html#organization-api-tokens) within Terraform Cloud
* Click "complete setup"

Once configured, you’ll be redirected to the Splunk search interface with the pre-configured Terraform Cloud dashboards. Splunk will begin importing and indexing the last 14 days of audit log information and populating the dashboards. This process may take a few minutes to complete.

## Upgrading

To upgrade to a new version of the Terraform Cloud for Splunk app, repeat the installation and configuration steps above.

## Troubleshooting

Terraform Cloud only retains 14 days of audit log information. If there are connectivity issues between your Splunk service and Terraform Cloud, Splunk will recover events from the last event received up to a maximum period of 14 days.
