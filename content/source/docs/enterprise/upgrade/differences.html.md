---
layout: enterprise2
page_title: "Current vs. Legacy - Upgrading - Terraform Enterprise"
sidebar_current: "docs-enterprise2-upgrading-differences"
---

# Differences Between Current and Legacy Terraform Enterprise

Terraform Enterprise began as part of the discontinued Atlas suite, and today's version is a redesign built for using Terraform in a team setting. Most notably, it focuses heavily on a [VCS-driven run workflow](../run/ui.html), while providing a rich API to support alternate workflows.

If you've previously used the legacy version of Terraform Enterprise, we hope you enjoy the new version's improvements. However, as part of this redesign, some features have been removed and others are not yet implemented.

Several things are significantly different in the new Terraform Enterprise. This page is a brief summary of what to expect when upgrading from the legacy version.

## Renamed or Moved Features

### Workspaces Replace Environments

Environments are now called [workspaces](../workspaces/index.html), to make Terraform Enterprise's terminology consistent with Terraform open source. Aside from the name change, workspaces function the same as environments did.

### Terraform Push

The new Terraform Enterprise does not support the `terraform push` command, which is now deprecated.

This does not mean we're dropping support for a CLI-based workflow — we want push to be better, and the integrated `push` command was holding us back because we built it on an outdated understanding of how Terraform Enterprise should work. Users of `terraform push` have a few options:

- Use [the add-on Terraform Enterprise command line tools](https://github.com/hashicorp/tfe-cli). These are designed as a one-to-one replacement for `terraform push`, with a modified syntax and some new features.
- Use the [API-based run workflow](../run/api.html) to upload a configuration tabrall and queue a run. This is a more powerful option for integration with automated systems.

We're also working on a more deeply integrated CLI workflow that combines the collaborative benefits of centrally managed Terraform runs with the interactive responsiveness of running Terraform on your laptop. This doesn't have a release date yet, but we hope our current replacements for `terraform push` offer a comfortable migration path in the meantime.

### Event Log is Now Audit Log (Private Installs Only)

[audit]: ../private/logging.html#audit-logs

Legacy Terraform Enterprise included an event log that logged details about run events. For the new Terraform Enterprise, we replaced it with a comprehensive audit logging system that also logs all changes to organization and workspace settings.

The new audit log is available on private installs of Terraform Enterprise. See [the audit log documentation][audit] for details.

### `ATLAS_CONFIRM_DESTROY` is now `CONFIRM_DESTROY`

In order to queue a destroy plan on an environment (legacy) or workspace (current), you have to confirm your intentions by setting a special environment variable. The name of that variable has changed to `CONFIRM_DESTROY`, as part of our move away from the Atlas brand name.

## Gone But Returning Soon


### Notifications

The new Terraform Enterprise doesn't yet support arbitrary notifications at the end of runs. We plan to add a webhook-based notification system in a future update.

### Shared Variables

Legacy Terraform Enterprise supported organization-level variables that could be shared across multiple environments, which made it easier to re-use common variable values.

Unfortunately, this feature was entangled with personal variables, which we permanently removed. We're planning a replacement feature to let you use shared sets of variables across multiple workspaces, but we're still in the process of designing it.

### Periodically Queued Plans

In legacy Terraform Enterprise, you could set an environment to periodically queue a plan regardless of whether the configuration had changed. The new Terraform Enterprise does not currently have this feature.

We haven't yet determined whether to bring periodic runs back. We think [the run API](../api/run.html) probably makes it unnecessary — your CI system can start runs in response to any kind of external trigger, and any kind of scheduler (including a cron job or a Nomad job) can start runs on a timer. If you used periodic runs heavily, please contact us and let us know whether the current feature set meets your needs.

## Permanently Removed

We deliberately removed these features to streamline and improve Terraform Enterprise's core workflow. Some of these features worked against or distracted from what Terraform Enterprise does best, and some are good ideas that are handled better by external services.

We understand that removing features can be painful and disappointing for those who have built processes around them. For each of these features, we ensured only a single-digit percentage of users would be affected, and have tried to mitigate the changes with guides to other systems when appropriate. If you're badly affected by these removals and our existing documentation isn't adequate, please contact us and we'll work with you to help you migrate.

### Packer Integration and Artifact Registry

Terraform Enterprise no longer includes an integrated Packer build system or an artifact registry for built images. Different organizations have such different requirements and expectations for image builds that we believe [running Packer out of your own CI/CD system](https://www.packer.io/guides/packer-on-cicd/index.html) will usually provide a better experience.

### Individual Collaborators on Environments

Legacy Terraform Enterprise could grant access permissions to individual users; the new Terraform Enterprise handles all workspace permissions via [teams of users](../users-teams-organizations/teams.html).

We removed individual access because it eventually makes workspace settings too complex. Team-based access is easier to update and govern — single-user teams offer the same granularity of permissions, but with faster updates as soon as they need to become five-user or zero-user teams.

### Personal Variables

Legacy Terraform Enterprise had a personal variables feature, where each user could set values that only applied to runs that they queued.

We removed this feature because it worked against Terraform Enterprise's goal of collaborative and predictable infrastructure. Not only did it make runs inconsistent and less reliable, it also expected that users would be queueing most runs manually in the UI, when we've found that people want most runs to happen in response to changes in a VCS repo or other automatic triggers.

If you used personal variables to avoid sharing credentials, you can [mark workspace variables as sensitive](../workspaces/variables.html#sensitive-values).

