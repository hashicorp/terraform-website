---
layout: "enterprise2"
page_title: "Settings - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-settings"
---

# Workspace Settings

In Terraform Enterprise, the workspace's associated repository can only be configured once; it can't be changed at a later date. The following settings are customizable at any point:

## Terraform Working Directory

The directory where Terraform will execute. This defaults to the root of
your repository.

If your repo contains multiple environments, you can set this to the subdirectory matching the workspace's environment.

## VCS Root Path

If specified, this directory is used as the root of the Terraform execution
context, and all files outside it are deleted before running. If a Terraform
Working Directory is also specified, it is calculated relative to this subpath.

Most users don't need external files to be deleted, and should use the Terraform Working Directory setting alone.

## VCS branch

The branch to import new versions from. This defaults to your
version control's default branch for the repository.
