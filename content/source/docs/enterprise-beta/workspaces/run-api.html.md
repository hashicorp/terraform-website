---
layout: "enterprise2"
page_title: "API-driven Runs - Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces-run-api"
---

# The API-driven Run Workflow

Terraform Enterprise (TFE) has two workflows for managing Terraform runs.

- [The simpler workflow](./run-ui.html) is driven by TFE's UI and by integration with a supported VCS provider.
- The more complex workflow, described below, is driven entirely by TFE's API, and lets you replace the UI and supported VCS providers with almost any kind of custom tooling.

## Summary

In the API-driven workflow, workspaces are not directly associated with a VCS repo, and runs are not driven by webhooks on your VCS provider.

Instead, one of your organization's other tools is in charge of deciding when configuration has changed and a run should occur. Usually this is something like a CI system, or something else capable of monitoring changes to your Terraform code and performing actions in response.

Once your other tooling has decided a run should occur, it must perform the following steps with calls to TFE's API endpoints:

1. [Create a configuration version on the workspace](../api/configuration-versions.html#create-a-configuration-version).
2. [Upload configuration files to the configuration version](../api/configuration-versions.html#upload-configuration-files).
3. [Create a Run on the workspace](../api/run.html#create-a-run); this is done automatically when a configuration file is uploaded.
4. [Create and queue an apply on the run](../api/run.html#apply); if auto-apply is not enabled.

The most significant difference in this workflow is that TFE _does not_ fetch configuration files from version control. Instead, your own tooling must upload the configurations as a `.tar.gz` file.

This allows you to work with configurations from unsupported version control systems, automatically generate Terraform configurations from some other source of data, or build a variety of other integrations.

In addition to uploading configurations and starting runs, you can use TFE's APIs to create and modify workspaces, edit variable values, and more. See the [API documentation](../api/index.html) for more details.
