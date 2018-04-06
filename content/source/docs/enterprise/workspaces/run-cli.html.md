---
layout: "enterprise2"
page_title: "CLI-driven Runs - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-run-cli"
---

# The CLI-driven Run Workflow

Terraform Enterprise (TFE) has three workflows for managing Terraform runs.

- The [UI/VCS-driven run workflow](./run-ui.html), which is TFE's primary mode of operation.
- The [API-driven run workflow](./run-api.html), which is more flexible but requires you to create some tooling.
- The CLI-driven run workflow described below, which is the API-driven workflow with a user-friendly command line tool.

## Summary

The CLI-driven workflow is largely the same as the API-driven workflow: workspaces are not associated with a VCS repo, and you must upload configurations to them. But if all you want to do is drive runs with content from a local workstation, you can use our optional [TFE CLI tool](https://github.com/hashicorp/tfe-cli/) without having to build your own tooling to call TFE's API.

If you previously used the deprecated `terraform push` command, the TFE CLI should fit your existing workflows.

[Download the TFE CLI tool here.](https://github.com/hashicorp/tfe-cli/) Documentation is available at the GitHub repository, and each of its commands have help available.
