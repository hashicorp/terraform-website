---
layout: "enterprise2"
page_title: "Accounts and Resources - Admin - Private Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-resources"
---

# Administration: Managing Accounts and Resources

(summary: admins have access to all organizations, users, runs, and workspaces; this is intended for [etc].)

## Viewing, Searching, and Filtering Lists

## Managing User and Organization Accounts

### Promoting Users to Administrators

- w/ great power comes etc. etc.

### Impersonating Users

- only way to edit org/user profiles, manipulate workspaces/runs with full view of their data, etc.
- can impersonate from user page, or, as a convenience, can impersonate an owner from an org page.
- audit stuff
- interface/workflow (a couple screenshots)

### Deleting and Suspending Accounts

- only users can be suspended, but, can orgs be "suspended" through billing?

### Setting Organization Billing

This is primarily useful for the SaaS version of Terraform Enterprise, but your organization might have an internal use for it. [etc]

## Managing Workspaces and Runs

- Admins default to a more limited view (just name, status, and run IDs), to avoid exposing sensitive data when it isn't needed
- can manage workspaces and runs more deeply via user impersonation.

### Deleting Workspaces

### Force-Canceling Runs

### Migration of Workspace History from Legacy Environments

- link to user docs about migration.
- can view progress, but there's nothing to really do.
- in a future version, legacy data will be destroyed; read your release notes, and if you still need legacy data, wait to upgrade to that version until migration is complete.


## Managing Terraform Versions

- context about tf versions within TFE
- default behavior: does the app bring along new official versions on updates? or do you have to add new versions yourself?
- custom terraform versions
- tf bundle for pre-installing providers

