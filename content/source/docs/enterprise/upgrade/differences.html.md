---
layout: enterprise2
page_title: "Current vs. Legacy - Upgrading - Terraform Enterprise"
sidebar_current: "docs-enterprise2-upgrading-differences"
---

# Differences Between Current and Legacy Terraform Enterprise

Terraform Enterprise began as part of the discontinued Atlas suite, and today's version is a ground-up redesign. If you've previously used the legacy version of Terraform Enterprise, we hope you enjoy the new version's improvements.

Several things are significantly different in the new Terraform Enterprise. This page is a brief summary of what to expect when upgrading from the legacy version.

## Renamed or Moved Features

### Workspaces Replace Environments

Environments are now called [workspaces](../workspaces/index.html). Our goal in this change was to make it easier to on-board new Terraform users in your organization by avoiding an overloaded and ambiguous term.

### Event Log is Now Audit Log (Private Installs Only)

[audit]: ../private/logging.html#audit-logs

Legacy Terraform Enterprise included an event log that logged details about run events. For the new Terraform Enterprise, we replaced it with a [comprehensive audit logging system][audit] that also logs all changes to organization and workspace settings.

The new audit log is available on [private installs](../private/index.html) of Terraform Enterprise.

### `ATLAS_CONFIRM_DESTROY` is now `CONFIRM_DESTROY`

In order to queue a destroy plan on an environment (legacy) or workspace (current), you have to confirm your intentions by setting a special environment variable. The name of that variable has changed to `CONFIRM_DESTROY`, as part of our move away from the Atlas brand name.

## Gone But Returning Soon

### Two-Factor Authentication

The new version of Terraform Enterprise doesn't yet support two-factor authentication in its integrated login system. We plan to add it in a future update.

Depending on your security infrastructure, our [SAML single sign-on support](../saml/index.html) (available on private installs) might also suit your needs.

### Notifications

The new Terraform Enterprise doesn't yet support arbitrary notifications at the end of runs. We plan to add a webhook-based notification system in a future update.

## Permanently Removed

We deliberately removed these features to streamline and improve Terraform Enterprise's core features. Some of these features worked against or distracted from what Terraform Enterprise does best, and some are good ideas that are handled better by external services.

### Packer Integration and Artifact Registry

Terraform Enterprise no longer includes an integrated Packer build system or an artifact registry for built images. Different organizations have such different requirements and expectations for image builds that we believe [running Packer out of your own CI/CD system](https://www.packer.io/guides/packer-on-cicd/index.html) will usually provide a better experience.

### Periodically Queued Plans

In legacy Terraform Enterprise, you could set an environment to periodically queue a plan regardless of whether the configuration had changed. This is gone, because [the run API](../api/run.html) makes it unnecessary.

If you used scheduled runs because Terraform needed to run after events that Terraform Enterprise didn't know about, you can use your CI system to start runs in response to any kind of trigger. If you still want runs to happen on a fixed schedule, you can use any kind of scheduler to make an API call, including a cron job or a Nomad job.

### Individual Collaborators on Environments

Legacy Terraform Enterprise could grant access permissions to individual users; the new Terraform Enterprise handles all workspace permissions via [teams of users](../users-teams-organizations/teams.html).

We removed individual access because it eventually makes your workspace settings a mess. Team-based access is easier to update and govern.

### Personal Environment and Organization Variables

Legacy Terraform Enterprise had a personal variables feature, where each user could set values that only applied to runs that they queued. In the new Terraform Enterprise, all variables are tied to a workspace, not a user.

We removed this feature because it worked against Terraform Enterprise's goal of collaborative and predictable infrastructure. Not only did it make runs inconsistent and less reliable, it also expected that users would be queueing most runs manually in the UI, when we've found that people want most runs to happen in response to changes in a VCS repo or other automatic triggers.

If you used personal variables to avoid sharing credentials, you can mark workspace variables as sensitive.

### Terraform Push

The new Terraform Enterprise does not support the `terraform push` command, which is now deprecated.

This does not mean we're dropping support for a push-based workflow — we want push to be better, and the integrated `push` command was holding us back because we built it on an outdated understanding of how Terraform Enterprise should work.

TFE's API supports uploading a configuration tarball and running it, and the [API-based run workflow page](../workspaces/run-api.html) explains how to integrate it into your automated systems. We also plan to release an external tool that mimics `terraform push`'s workflow soon.

