---
layout: "enterprise2"
page_title: "Settings - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-settings"
---

# Workspace Settings

In Terraform Enterprise, the workspace's associated repository can only be configured once; it can't be changed at a later date. The following settings are customizable at any point:

## Terraform Working Directory

The directory where Terraform will execute. This defaults to the root of the repository.

If the repo contains multiple environments, set this to the subdirectory matching the workspace's environment. More at [Repo Structure](./repo-structure.html).

## VCS branch

The branch to import new versions from. This defaults to the version control system's default branch for the repository.

## SSH Key

Set an SSH key here if the configuration sources Terraform modules from other repos. The SSH key must have read access to the module repos. See also [Assigning Keys to Workspaces](./ssh-keys.html#assigning-keys-to-workspaces). If no SSH keys are listed here, visit "Manage SSH Keys" in the Organization settings or review [Adding and Deleting Keys](./ssh-keys.html#adding-and-deleting-keys).

## Include submodules on clone

Check this if the repo uses Git submodules that need to be cloned along with the main repo contents. The [SSH key for cloning Git submodules](../vcs/index.html#ssh-keys) is set in the OAuth settings for the Organization, and is not necessarily related to the SSH key set in the workspace's settings.
