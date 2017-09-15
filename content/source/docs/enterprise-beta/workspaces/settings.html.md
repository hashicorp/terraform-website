---
layout: "enterprise2"
page_title: "Settings - Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces-settings"
---

# Workspace Settings

This page explains various settings to customize workspaces.

## Terraform Working Directory
The directory that Terraform will execute within. This defaults to the root of
your repository and is typically set to a subdirectory matching the environment
when multiple environments exist within the same repository.

## VCS Root Path
This path, if specified, will be used as the root of the Terraform execution
context and all files outside of this path will be thrown away. The Terraform
Working Directory is calculated relative to this subpath.

## VCS branch
The branch from which to import new versions. This defaults to the value your
version control provides as the default branch for this repository.
