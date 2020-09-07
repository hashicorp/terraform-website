---
layout: "cloud"
page_title: "Administrator Guide - ServiceNow Service Catalog Integration -
Terraform Cloud and Terraform Enterprise"
description: |-
  Administrator guide for the ServiceNow Service Catalog Integration.
---

# Terraform ServiceNow Service Catalog Integration Administrator Guide

ServiceNow administrators have several options with configuring the Terraform
integration.

If you haven't yet installed the integration, see the [installation
documentation](./index.html).

Once the integration has been installed, you can add and customize a service
catalog and VCS repositories using the [service catalog
documentation](./service-catalog.html).

You can also configure how frequently ServiceNow will poll Terraform Cloud using
the documentation below.

## Configure Polling Workers

The integration includes 3 ServiceNow Scheduled Flows to poll the Terraform
Cloud API using ServiceNow Outbound HTTP REST requests. By default, all flows
schedules are set to 5 minutes. These can be customized inside the ServiceNow
Server Studio:

1. Select the Worker Poll Run State Flow.
1. Adjust Repeat Intervals
1. Click "Done"
1. Click "Save"
1. Click "Activate"

### Worker Poll Apply Run

This worker approves runs for any workspaces that have finished a Terraform plan
and are ready to apply their changes. It also adds a comment on the request item
for those workspaces notifying that a run has been triggered.

### Worker Poll Destroy Workspace

This worker looks for any records in the Terraform ServiceNow table that are
marked for deletion with the value `is_destroyable` set to true. It then checks
the status of the workspace to ensure it is ready to be deleted. Once the
destroy run has been completed, this work will send the delete request for the
workspace to Terraform.

### Worker Poll Run State

The worker synchronizes ServiceNow with the current run state of Terraform
workspaces by polling the Terraform Cloud API. On state changes, the worker adds
a comment to the ServiceNow request item with the updated run state and other
metadata.

![screenshot: ServiceNow integration comments](./images/service-now-comments.png)
