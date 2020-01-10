---
layout: "cloud"
page_title: "Terraform Cloud's Run Environment - Runs - Terraform Cloud"
---

# Terraform Cloud's Run Environment

Terraform Cloud is designed as an execution platform for Terraform, and most of its features are based around its ability to perform Terraform runs in a fleet of disposable worker VMs. This page describes some features of the run environment for Terraform runs managed by Terraform Cloud.

## The Terraform Worker VMs

Terraform Cloud performs Terraform runs in single-use Linux virtual machines, running on an x86_64 architecture.

The operating system and other software installed on the worker VMs is an internal implementation detail of Terraform Cloud. It is not part of a stable public interface, and is subject to change at any time.

Before Terraform is executed, the worker VM's shell environment is populated with environment variables from the workspace, the selected version of Terraform is installed, and the run's Terraform configuration version is made available.

Changes made to the worker during a run are not persisted to subsequent runs, since the VM is destroyed after the run is completed. Notably, this requires some additional care when installing additional software with a `local-exec` provisioner; see [Installing Additional Tools](install-software.html#installing-additional-tools) for more details.

## Network Access to VCS and Infrastructure Providers

In order to perform Terraform runs, Terraform Cloud needs network access to all of the resources being managed by Terraform.

If you are using the SaaS version of Terraform Cloud, this means your VCS provider and any private infrastructure providers you manage with Terraform (including VMware vSphere, OpenStack, other private clouds, and more) _must be internet accessible._

Terraform Enterprise instances must have network connectivity to any connected VCS providers or managed infrastructure providers.

## Concurrency and Run Queuing

Terraform Cloud uses multiple concurrent worker VMs, which take jobs from a global queue of runs that are ready for processing. (This includes confirmed applies, and plans that have just become the current run on their workspace.)

If the global queue has more runs than the workers can handle at once, some of them must wait until a worker becomes available. When the queue is backed up, Terraform Cloud gives different priorities to different kinds of runs:

- Applies that will make changes to infrastructure have the highest priority.
- Normal plans have the next highest priority.
- Speculative plans have the lowest priority.

Terraform Cloud can also delay some runs in order to make performance more consistent across organizations. If an organization requests a large number of runs at once, Terraform Cloud queues some of them immediately, and delays the rest until some of the initial batch have finished; this allows every organization to continue performing runs even during periods of especially heavy load.

## State Access and Authentication

[CLI config file]: /docs/commands/cli-config.html
[remote]: /docs/backends/types/remote.html

Terraform Cloud stores state for its workspaces. During a run, Terraform CLI uses a [backend](/docs/backends/index.html) to read from and write to Terraform Cloud's stored state.

When Terraform Cloud performs a Terraform run, it uses [the `remote` backend][remote], overriding any existing backend in the configuration.

Instead of using existing user credentials, Terraform Cloud generates a unique per-run API token and provides it to the Terraform worker in the [CLI config file][]. This per-run token can read and write state data for the workspace associated with the run, can read state data from any other workspace in the same organization, and can download modules from the [private module registry](../registry/index.html). It cannot make any other calls to the Terraform Cloud API. Per-run tokens are not considered to be user, team, or organization tokens, and become invalid after the run is completed.

-> **Note:** When performing a run with Terraform 0.11.12 or earlier, Terraform Cloud instead uses [the `atlas` backend](/docs/backends/types/terraform-enterprise.html) and provides the per-run token in the `$ATLAS_TOKEN` environment variable.

When running Terraform on the commmand line against a workspace configured for remote operations, the CLI user must have [the `remote` backend][remote] configured in the Terraform configuration, and must have a user or team API token with the appropriate permissions specified in their [CLI config file][]. However, the run itself still occurs within one of Terraform Cloud's worker VMs, and still uses the per-run token for state access.

When running Terraform on the command line against a workspace that is _not_ configured for remote operations, the CLI user's token is used for state access.
