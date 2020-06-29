---
layout: "cloud"
page_title: "Configuration Options - ServiceNow Service Catalog Integration - Terraform Cloud"
description: |-
  Configuration for the ServiceNow Service Catalog Integration
---

# Configuration Options

There are several configuration options available for the Terraform ServiceNow integration.

## Enable Polling Workers

The integration includes 2 ServiceNow Workflow Schedules to poll the Terraform Enterprise API using ServiceNow Outbound HTTP REST requests. By default, all workflow schedules are set to On-Demand. These can be customized inside the ServiceNow Server Studio:

1. Select the Worker Poll Run State (Workflow > Workflow Schedule).
1. Change the value for the Run field from "On-Demand" to "Periodically".
1. Set Repeat Intervals to 1-5 minutes.
1. Click "Update".

### Worker Poll Apply Run

This worker approves runs for any workspaces that have finished a Terraform plan and are ready to apply their changes. It also adds a comment on the request item for those workspaces notifying that a run has been triggered.

### Worker Poll Run State

The worker synchronizes ServiceNow with the current run state of Terraform workspaces by polling the Terraform Enterprise API. On state changes, the worker adds a comment to the ServiceNow request item with the updated run state and other metadata.

![screenshot: ServiceNow integration comments](./images/service-now-comments.png)

## Connecting to Terraform Enterprise

-> **Roles Required:** `admin` or `x_terraform.config_user`

1. Exit Service Now Studio and return to the ServiceNow Service Management Screen.
1. Using the left-hand navigation, open the configuration table for the integration to manage the Terraform Enterprise connection.
    - Terraform > Configs
1. Click on "New" to create a new Terraform Enterprise connection:
    - Set API Team Token to the Terraform Enterprise [Team Token](../../users-teams-organizations/api-tokens.html#team-api-tokens) you created earlier.
    - Set Hostname to the hostname of your Terraform Enterprise instance. (If you're using the SaaS version of Terraform Cloud, this is app.terraform.io.)
    - Set Org Name to the name of the Terraform Enterprise organization you wish to use for new workspaces created by ServiceNow.

## Next Steps

Once the ServiceNow integration has been configured, you can [create a Service
Catalog](./service-catalog.html).
