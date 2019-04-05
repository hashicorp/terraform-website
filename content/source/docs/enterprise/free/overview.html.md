---
layout: "free"
page_title: "Overview - Free Tier - Terraform Enterprise"
sidebar_current: "docs-free-overview"
description: |-
  Terraform Enterprise's free accounts, now in closed beta, offer unlimited Terraform state storage for you and your colleagues.
---


# How the Terraform Enterprise Free Tier Works

Terraform Enterprise is a service that makes it easy for small teams to manage shared infrastructure with Terraform. This page provides a brief overview of the components of the Free Tier and of the changes it makes to your existing Terraform workflow.

For practical instructions on using the Terraform Enterprise Free Tier, see [Getting Started](./index.html).

## The Application

The Terraform Enterprise application, located at [`https://app.terraform.io`](https://app.terraform.io), provides a UI and API for storing, viewing, and controlling access to Terraform state. The application manages state in terms of organizations and workspaces:

- A **workspace** is a named container for a single timeline of Terraform state, used to manage a collection of infrastructure resources over time.

    Each workspace belongs to an organization, and only members of that organization can access it.
- An **organization** is a group of users who can collaborate on a shared set of workspaces. An organization is created by an initial user, who can then add other members.

The application manages access in two ways:

- UI access is managed with usernames and passwords, with optional two-factor authentication.
- API and CLI access is managed with API tokens, which can be generated in the UI. Each user can generate any number of personal API tokens, which allow access with their own identity and permissions. There is also an optional owners team token, which has similar abilities but is not tied to an individual user's account.

## The Backend

The `remote` backend, built into Terraform 0.11.12 and later, allows the Terraform CLI to seamlessly work with state in the Terraform Free State Storage application.

The backend requires an API token, which is created by an application user and then stored in Terraform's [CLI config file](/docs/commands/cli-config.html). Once a token is configured, Terraform can work with any workspace accessible to the user who created the token.

Terraform still defaults to storing state locally, but any Terraform configuration can enable remote state with [a backend configuration](/docs/backends/config.html) that specifies which remote workspace to use.

-> **Note:** Several earlier versions of Terraform included preview versions of the `remote` backend. The Terraform Enterprise Free Tier relies on enhancements added in 0.11.12, and does not work with these earlier versions.

-> **Note:** For Free Tier organizations, TFE always retains at least the last 100 states (across all workspaces) and at least the most recent state for every workspace. Additional states beyond the last 100 are retained for six months, and are then deleted. 

## The Workflow

The Terraform Enterprise Free Tier uses the standard Terraform CLI workflow, with some enhancements:

- Users continue to run Terraform on their local machines, but state is stored remotely instead of in the local working directory.
- Remote workspaces are automatically created when you need them. To create a new workspace, specify a new workspace name in a Terraform configuration's `backend` block.
- Terraform protects state from conflicts by locking the remote state during plans and applies; other users can't begin new plans or applies until the current one ends.

Access management tasks outside the scope of Terraform's CLI workflow are available in the Terraform Enterprise UI and API. These tasks include:

- Adding and removing organization members
- Deleting workspaces
- Locking workspaces out-of-band, to prevent plans and applies for an arbitrary period
- Viewing historical state, either raw or as a diff against the previous state
- Creating or disabling API tokens

