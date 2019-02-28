Terraform Enterprise (TFE) Glossary

## Apply (noun)

Part of a run. TFE runs `terraform apply` using a plan (2) as its input. This makes changes to real infrastructure resources.

https://www.terraform.io/docs/commands/apply.html

## Apply (verb)

To make changes to real infrastructure in order to make it match the desired state (as specified by a Terraform config and set of variables).

To initiate an apply in Terraform Enterprise.

https://www.terraform.io/docs/commands/apply.html

## CLI

Command-line Interface. The `terraform` tool uses a CLI to accept instructions and return text output.

https://en.wikipedia.org/wiki/Command-line_interface

## (Terraform) Configuration (or Config)

Terraform HCL code that declaratively describes your infrastructure. A complete config consists of a root module, which can optionally call any number of child modules.

https://www.terraform.io/docs/configuration/index.html

## Configuration Version

The contents of a Terraform config at a specific moment in time. Every stage of a given run uses one specific configuration version. Config versions can be automatically imported when new commits are merged to a workspace’s repo, uploaded via the API, or uploaded by running `terraform plan` or `terraform apply` as a remote operation. Adding a new config version is sometimes called “ingressing.”

## Cost Estimation

The second stage in a run. Shows the estimated total value and the difference in cost from before and after a plan.

## Git

A distributed version control system for tracking changes in source code during software development. It is designed for coordinating work among programmers, but it can be used to track changes in any set of files.

https://en.wikipedia.org/wiki/Git

## HCL

HashiCorp Configuration Language. The declarative programming language used for Terraform configuration.

https://github.com/hashicorp/hcl

## Ingress

See Configuration Version.

## Locking

The ability to prevent new runs from starting in a given workspace. Workspaces are automatically locked when a run is in progress, and can also be manually locked.

## Log

The text-based artifact of actions taken within a run. For example, the output of running `terraform plan`.

## (Terraform) Modules

A separate set of abstracted Terraform configurations with defined variables and outputs that can be used within other Terraform configurations.

https://www.terraform.io/docs/modules/index.html

## OAuth

OAuth (Open Authorization) is an open standard for token-based authentication and authorization on the Internet. Terraform Enterprise uses OAuth to connect your organization to your VCS provider. Generally takes an `id` and `secret` from your VCS provider to give access to TFE and allow it to download configuration from the provider.

https://www.terraform.io/docs/enterprise/vcs/index.html

## OAuth Client

The record of an association between an organization and a VCS provider. After creation, the client must be connected to get an OAuth token.

https://www.terraform.io/docs/enterprise/vcs/index.html

## OAuth Token

The connection between an organization and a VCS provider. The token includes the permissions given by the VCS provider. Workspaces use an OAuth token to download configuration from the VCS provider.

https://www.terraform.io/docs/enterprise/vcs/index.html

## Organization

TFE’s fundamental unit for controlling access and grouping things together; meant to represent a company or a business unit within a company. An organization contains a group of workspaces, a group of teams, a group of Sentinel policies, and a variety of settings. Adding users to an organization is done via teams.

https://www.terraform.io/docs/enterprise/users-teams-organizations/organizations.html

## Permissions

Specific levels of access allowed within TFE. Can be managed at the workspace and/or organization level. For example, a “read” user role has “permission” to see a list of runs but cannot approve a run like a “write” user can.

https://www.terraform.io/docs/enterprise/users-teams-organizations/permissions.html

## Plan (verb), or Queue Plan

To start a new run.

## Plan (noun, 1)

Part of a run. TFE runs `terraform plan` on the workspace’s config, resulting in a plan (2) object and a readable summary of the expected changes to real infrastructure.

https://www.terraform.io/docs/commands/plan.html

## Plan (noun, 2)

A binary artifact produced by the `terraform plan` command, which `terraform apply` can use to carry out the exact changes that were decided at the time of the plan. TFE always uses a saved plan as the input to an apply, so that applies never make changes that weren’t shown to the user after the plan (in cases where the config or the variables changed in the meantime).

## Policy Check

Part of a run. After gathering the configuration, state, and plan (2) for a run, TFE runs Sentinel to check that data against the active policies. Policy checks end in success or failure. If a failure occurs in a required item, this can prevent the run from proceeding to the apply stage.

## Policy

Sentinel code that can be applied to a run. Combined into policy sets.

https://www.terraform.io/docs/enterprise/sentinel/manage-policies.html

## Policy Set

A list of policies to apply globally or to specific workspaces.

https://www.terraform.io/docs/enterprise/sentinel/manage-policies.html

## Private Terraform Enterprise

Private Terraform Enterprise is software provided to customers that allows full use of Terraform Enterprise in a private, isolated environment.

https://www.terraform.io/docs/enterprise/private/index.html

## Private Terraform Registry

This is a version of the Terraform Registry that is built-in to TFE. It includes a Configuration Designer, which lets you combine and configure modules to generate Terraform configuration for them.

https://www.terraform.io/docs/enterprise/registry/index.html

## (Terraform) Provider

A provider is responsible for understanding API interactions and

exposing resources. Providers generally are IaaS providers (e.g. AWS, GCP, Microsoft Azure, OpenStack), PaaS (e.g. Heroku), or SaaS services (e.g. Terraform Enterprise, DNSimple, CloudFlare). There are many providers available but they can also be custom-built to work with any API.

https://www.terraform.io/docs/providers/index.html

## TFE Provider

A Terraform provider that manages Terraform Enterprise. Allows you to manage TFE using Terraform configuration.

https://www.terraform.io/docs/providers/tfe/index.html

## Pull Request (PR)

A mechanism created by GitHub to review and discuss changes made to a git repository branch that wish to be merged into another branch. Other collaborators can request changes, approve, or reject these changes. GitLab calls this a Merge Request.

## Queue

The list of runs waiting to be processed. TFE uses several queues of runs: a per-workspace queue (since only one run at a time is allowed in a given workspace, to avoid conflicts and state corruption), a global per-instance queue (since compute resources are finite and TFE only has access to so many VMs), and a per-organization queue (to prevent one organization from swamping the global queue and preventing other organizations from doing runs). The per-organization queue is part of a feature called “fair run queueing,” which is somewhat complex and is not yet globally enabled on the SaaS.

## Terraform Registry

The Terraform Registry is a repository of modules written by the Terraform community. The registry can help you get started with Terraform more quickly, see examples of how Terraform is written, and find pre-made modules for infrastructure components you require.

https://www.terraform.io/docs/registry/index.html

## Remote Operations

The ability to start a run (or perform a few other tasks) from your local CLI and view output inline, while still allowing TFE to perform the actual operation. (TFE performs Terraform runs in its own disposable VMs, where it can capture information, control access to secrets, etc., but many users are accustomed to running Terraform on their local machines. Remote operations exist to help split the difference.)

https://www.terraform.io/docs/backends/operations.html

## Remote Backend

A Terraform CLI feature that lets Terraform connect to TFE. Used for remote operations in TFE workspaces, or used for just state storage in the (still upcoming) free tiers.

https://www.terraform.io/docs/backends/types/remote.html

## Repository (repo)

A collection of files and a history of the changes to them. In Terraform Enterprise, a “repo” is a git repository that contains a Terraform configuration.

https://en.wikipedia.org/wiki/Repository_(version_control)

## Run (or Terraform Run)

The process of making real infrastructure match the desired state (as specified by the contents of the config and variables at a specific moment in time). Performed in a series of stages: plan, cost estimation, policy check, and apply. Not every stage occurs in every run. Information about historical runs is saved.

https://www.terraform.io/docs/enterprise/run/index.html

## SAML

SAML is an XML-based standard for authentication and authorization. Terraform Enterprise can act as a service provider (SP) (or Relying Party, RP) with your internal SAML identity provider (IdP). The SAML Single Sign On feature is only available with the Premium tier on private installs.

https://www.terraform.io/docs/enterprise/saml/index.html

## Service Account

An account (with API token) that doesn’t belong to a human user but to an entity in TFE. Terraform Enterprise provides two types of service accounts: team and organization. These accounts can access Terraform Enterprise APIs, but cannot be used interactively. The service accounts are designed to support server-to-server API calls using the service identity as opposed to individual user identities.

https://www.terraform.io/docs/enterprise/users-teams-organizations/service-accounts.html

## Sentinel

A language (and runtime) for managing policy as code. Allows you to define rules around operations in TFE.

https://www.terraform.io/docs/enterprise/sentinel/index.html

## Speculative Plan

A run that is only intended to show possible changes to infrastructure, when using a given config version and set of variables. Speculative plans can never be applied, and are usually started as a result of pull requests to a workspaces’ repo, or by running `terraform plan` on the command line  with remote operations configured.

## SSH Key

TFE allows you to upload private SSH keys to be used during a run. The key can be used for things like allowing a Terraform provider access to external servers. Separately, a key can also be used with a VCS Provider’s OAuth token to enable git clones using SSH.

https://www.terraform.io/docs/enterprise/workspaces/ssh-keys.html

## State

Terraform must store state about your managed infrastructure and configuration. This state is used by Terraform to map real world resources to your configuration, keep track of metadata, and to improve performance for large infrastructures.

https://www.terraform.io/docs/state/index.html

## State Version

A snapshot of your infrastructure’s state at a point in time. Can be manually uploaded or the result of an apply.

## Team

A group of TFE users, which can be given permission to access and/or edit various objects (workspaces, policies, etc.) within an organization. A team belongs to a single organization. Users can belong to any number of teams in any number of organizations.

https://www.terraform.io/docs/enterprise/users-teams-organizations/teams.html

## Terraform

A tool for building, changing, and versioning infrastructure safely and efficiently. Terraform can manage existing and popular service providers as well as custom in-house solutions.

https://www.terraform.io/intro/index.html

## TFE

Terraform Enterprise.

https://www.terraform.io/docs/enterprise/index.html

## Trigger

Something that causes a new run to queue. Can be UI/VCS-, API- or CLI-driven.

https://www.terraform.io/docs/enterprise/run/ui.html

## (API) Tokens

Revocable alphanumeric strings that allow a user to authenticate itself in order to use the API. Different kinds of tokens grant different permissions. Can be granted by User, Team and/or Organization.

https://www.terraform.io/docs/enterprise/users-teams-organizations/users.html#api-tokens

https://www.terraform.io/docs/enterprise/users-teams-organizations/teams.html#api-tokens

https://www.terraform.io/docs/enterprise/users-teams-organizations/organizations.html#api-tokens

## Tool Version

A particular version of the `terraform` binary, aka “Terraform Version”. Specifies a URL, a SHA256 checksum and enabled/beta flags.

## Variables

Key/values used in a run. Values can be “sensitive” and protected by Vault.

https://www.terraform.io/docs/enterprise/workspaces/variables.html

## VCS

Version Control System, like Git.

https://en.wikipedia.org/wiki/Version_control

## VCS Provider

Can be one of GitHub, GitHub Enterprise, GitLab.com, GitLab EE and CE, Bitbucket Cloud, or Bitbucket Server.

https://www.terraform.io/docs/enterprise/vcs/index.html

## Working Directory

The directory where `terraform init` runs, creating a `.terraform` subdirectory. All subsequent commands for the same configuration should then be run from the same working directory.

## Workspace

A complex object that represents everything needed to manage a specific collection of infrastructure resources over time. In particular, this includes a Terraform configuration (which has multiple versions over time, and which can come from a repo or from manual uploads), a set of variables, state data that represents the current and historical condition of the infrastructure, and historical information about runs. All runs occur in the context of a workspace — they use that workspace’s config data, use that workspaces’ state to identify the real infrastructure being managed, and edit that workspaces’ state to match any infrastructure changes during the run. A workspace belongs to an organization.

https://www.terraform.io/docs/enterprise/workspaces/index.html



## Additional term definitions requested

These terms are found in TFE and could use definitions added above:

1. Branch

2. Commit

3. Broad User Adoption

4. Forked repo

5. Webhook

6. API

7. JSON

8. Archivist

9. OSS

10. S3

11. IDs: Run ID, Workspace ID, etc

12. TFE V1 vs V2

