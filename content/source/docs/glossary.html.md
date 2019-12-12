---
layout: intro
page_title: "Terraform Glossary"
sidebar_current: "terraform-glossary"
description: |-
  Brief definitions of technical terms and jargon used in Terraform's
  documentation and throughout the Terraform community.
---

# Terraform Glossary

This page collects brief definitions of some of the technical terms used in the documentation for Terraform, as well as some terms that come up frequently in conversations throughout the Terraform community.

<div style="column-width: 14em;">

- [API](#api)
- [Apply (noun)](#apply-noun-)
- [Apply (verb)](#apply-verb-)
- [Argument](#argument)
- [Attribute](#attribute)
- [Backend](#backend)
- [Blob Storage](#blob-storage)
- [Block](#block)
- [Branch](#branch)
- [CLI](#cli)
- [Commit](#commit)
- [(Terraform) Configuration](#terraform-configuration)
- [Configuration Version](#configuration-version)
- [Cost Estimation](#cost-estimation)
- [Data Source](#data-source)
- [Deposed](#deposed)
- [Expression](#expression)
- [Fork](#fork)
- [Git](#git)
- [HCL](#hcl)
- [ID](#id)
- [Ingress](#ingress)
- [Input Variables](#input-variables)
- [Interpolation](#interpolation)
- [JSON](#json)
- [Locking](#locking)
- [Log](#log)
- [Module](#module)
- [OAuth](#oauth)
- [OAuth Client](#oauth-client)
- [OAuth Token](#oauth-token)
- [Organization](#organization)
- [Output Values](#output-values)
- [OSS](#oss)
- [Permissions](#permissions)
- [Plan (verb)](#plan-verb-)
- [Plan (noun, 1)](#plan-noun-1-)
- [Plan File](#plan-file)
- [Policy](#policy)
- [Policy Check](#policy-check)
- [Policy Set](#policy-set)
- [Private Module Registry](#private-module-registry)
- [Private Terraform Enterprise (PTFE)](#private-terraform-enterprise-ptfe-)
- [(Terraform) Provider](#terraform-provider)
- [Pull Request (PR)](#pull-request-pr-)
- [Queue](#queue)
- [(Terraform) Registry](#terraform-registry)
- [Remote Operations](#remote-operations)
- [Remote Backend](#remote-backend)
- [Repository](#repository)
- [Resource](#resource)
- [Root Module](#root-module)
- [Root Outputs](#root-outputs)
- [Run](#run)
- [S3](#s3)
- [SAML](#saml)
- [Sentinel](#sentinel)
- [Site Admin](#site-admin)
- [Speculative Plan](#speculative-plan)
- [SSH Key](#ssh-key)
- [State](#state)
- [State Version](#state-version)
- [Team](#team)
- [Terraform](#terraform)
- [Terraform Cloud](#terraform-cloud)
- [Terraform Enterprise](#terraform-enterprise)
- [Terraform Version](#terraform-version)
- [TFE](#tfe)
- [TFE Provider / Terraform Cloud Provider](#tfe-provider-terraform-cloud-provider)
- [(API) Token](#api-token)
- [Trigger](#trigger)
- [Variables](#variables)
- [VCS](#vcs)
- [VCS Provider](#vcs-provider)
- [Webhook](#webhook)
- [Working Directory](#working-directory)
- [Workspace](#workspace)

</div>

## API

[api]: glossary.html#api
[apis]: glossary.html#api

"Application Programming Interface". Any interface designed to allow programatic manipulation of some kind of software system. For most software developers today, the most common kinds of APIs are based on HTTP requests.

Terraform relies on cloud service provider APIs to manage resources; each service's Terraform provider is responsible for mapping Terraform's resource model to the series of actual API calls necessary to create, check, modify, or delete a real infrastructure resource in that cloud service.

Terraform Cloud also offers its own API, for managing resources like team membership, policies, and workspaces. That API, in turn, is used by the `tfe` Terraform provider, so you can use Terraform to manage the system that runs Terraform for you.

- [Terraform Cloud docs: API](/docs/cloud/api/index.html)
- [Terraform providers: `tfe`](/docs/providers/tfe/index.html)

## Apply (noun)

[apply]: glossary.html#apply-noun-
[applies]: glossary.html#apply-noun-

One of the stages of a [run][], in which changes are made to real infrastructure resources in order to make them match their desired state. The counterpart of a [plan][].

In Terraform's CLI, applies are performed with the `terraform apply` command. Terraform Cloud runs `terraform apply` using a [plan file][] as its input.

- [Terraform docs: The `terraform apply` command](/docs/commands/apply.html)
- [Terraform Cloud docs: About Runs](/docs/cloud/run/index.html)

## Apply (verb)

[apply-v]: glossary.html#apply-verb-

To make changes to real infrastructure in order to make it match the desired state (as specified by a Terraform [config][] and set of [variables][]).

In conversation, it's common to refer to "applying a [plan][]" (usually in the context of Terraform Cloud's workflow) or "applying a [configuration][]" (usually in the context of the Terraform CLI workflow).

- [Terraform docs: The `terraform apply` command](/docs/commands/apply.html)
- [Terraform Cloud docs: About Runs](/docs/cloud/run/index.html)

## Argument

[argument]: glossary.html#argument
[arguments]: glossary.html#argument

In Terraform's [configuration][] language: a syntax construct that assigns a value to a name. Arguments have the form `<IDENTIFIER> = <EXPRESSION>`, and they appear within blocks.

Most of a Terraform configuration consists of using arguments to configure Terraform [resources][]. Each resource type defines the arguments its resources can use, the allowed values for each argument, and which arguments are required or optional. Information about a given resource type can be found in the docs for that resource's [provider][].

- [Terraform docs: Config Language — Arguments, Blocks and Expressions](/docs/configuration/index.html#arguments-blocks-and-expressions)

## Attribute

[attribute]: glossary.html#attribute
[attributes]: glossary.html#attribute

In Terraform's [configuration][] language: a named piece of data that belongs to some kind of object. The value of an attribute can be referenced in [expressions][] using a dot-separated notation, like `aws_instance.example.id`.

Terraform [resources][] and [data sources][] make all of their [arguments][] available as readable attributes, and also typically export additional read-only attributes.

- [Terraform docs: Expressions — Indices and Attributes](/docs/configuration/expressions.html#indices-and-attributes)

## Backend

[backend]: glossary.html#backend
[backends]: glossary.html#backend

The part of Terraform's core that determines how Terraform stores [state][] and performs [operations][remote operations] (like [plan][], [apply][], import, etc.). Terraform has multiple backends to choose from, which can be configured in a variety of ways. Backends are not plugins, so it is not possible to install additional backends.

In a general computer science sense, a backend is any lower-level implementation that enables a higher-level feature. But in the context of Terraform, "backend" always means the built-in code that handles state and operations.

- [Terraform docs: Backends](/docs/backends/index.html)

## Blob Storage

[blob storage]: glossary.html#blob-storage

-> Terraform Cloud

An API service for storing and retrieving arbitrary chunks of data using opaque addresses, which are indexed by a directory of some kind. The most notable example is AWS's [S3][].

You do not need to be familiar with the properties and advantages of blob storage services in order to work with Terraform or Terraform Cloud. However, you might need to administer or configure a blob storage service if you are responsible for administering a [Terraform Enterprise][] instance.

## Block

[block]: glossary.html#block
[blocks]: glossary.html#block

In Terraform's [configuration][] language: a container for other content which usually represents the configuration of some kind of object, like a [resource][]. Blocks have a _block type,_ can have zero or more _labels,_ and have a _body_ that contains any number of [arguments][] and nested blocks. Most of Terraform's features are controlled by top-level blocks in a configuration file.

```hcl
resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block
}

<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION> # Argument
}
```

- [Terraform docs: Config Language — Arguments, Blocks and Expressions](/docs/configuration/index.html#arguments-blocks-and-expressions)

## Branch

[branch]: glossary.html#branch
[branches]: glossary.html#branch

In some [version control systems][vcs]: a semi-independent history of changes to content in a repository. A branch generally shares some history with other branches in the same repository, but eventually diverges to include changes that aren't yet present elsewhere.

A repository usually has a default branch (whose name, in [Git][], defaults to `master`), which successful changes are eventually merged into. Most modern development workflows also include topic branches (where a specific set of changes is explored, iterated on, and verified), and some workflows include long-lived branches other than the default branch.

## CLI

[cli]: glossary.html#cli

Command-line interface. The `terraform` command expects to be run in a CLI (a Unix shell or the Windows command prompt), which it uses to accept instructions and return text output.

We often use "Terraform CLI" to refer to the core open source Terraform binary when we need to distinguish it from other parts of the Terraform ecosystem (like Terraform Cloud or the Terraform GitHub Actions).

- [Wikipedia: Command-line Interface](https://en.wikipedia.org/wiki/Command-line_interface)
- [Terraform docs: Commands (CLI)](/docs/commands/index.html)

## Commit

[commit]: glossary.html#commit
[commits]: glossary.html#commit

In a [version control system][vcs]: A coherent set of changes saved to a repository's version history.

In Git, commits act like a complete snapshot of the contents of a repo, on a specific [branch][] (or group of branches with shared history) and at a specific moment in time. Each commit also records the identity of its parent(s), which enables viewing the entire history of the repo up to any specific moment. Additionally, comparing a commit to its parent(s) can reveal the exact changes introduced by that commit; if those changes are applied as a diff, they can be added to a different branch in the repo without merging in the entire history of the commit in question.

## (Terraform) Configuration

[configuration]: glossary.html#terraform-configuration
[configurations]: glossary.html#terraform-configuration
[config]: glossary.html#terraform-configuration
[configs]: glossary.html#terraform-configuration

Also "config".

Code written in [Terraform's configuration language][hcl] that declaratively describes the desired state of your infrastructure. A complete config consists of a [root module][], which can optionally call any number of child [modules][].

- [Terraform docs: Configuration Language](/docs/configuration/index.html)
- [Introduction to Terraform](/intro/index.html)

## Configuration Version

[configuration version]: glossary.html#configuration-version
[configuration versions]: glossary.html#configuration-version
[config version]: glossary.html#configuration-version
[config versions]: glossary.html#configuration-version

-> Terraform Cloud

Also "config version".

The contents of a Terraform [config][] at a specific moment in time. This concept only applies to Terraform Cloud, since the Terraform CLI doesn't have visibility into repeated runs for a specific configuration over a period of time.

Every stage of a given run uses one specific configuration version.

Config versions can be automatically imported when new commits are merged to a workspace's repo, uploaded via the API, or uploaded by running `terraform plan` or `terraform apply` as a [remote operation][]. Adding a new config version is sometimes called "[ingressing][ingress]."

## Cost Estimation

[cost estimation]: glossary.html#cost-estimation
[cost estimations]: glossary.html#cost-estimation

-> Terraform Cloud

Part of a [run][]. After gathering the [plan file][] for a run, Terraform Cloud uses plan data to estimate costs for each resource found in the [plan][]. Previous and proposed resources are given estimated costs, providing an estimated delta cost between the two. The results can be used in [Sentinel policies][].

- [Terraform Cloud docs: Run States and Stages](/docs/cloud/run/states.html)

## Data Source

[data source]: glossary.html#data-source
[data sources]: glossary.html#data-source

A [resource][]-like object that can be configured in Terraform's [configuration][] language.

Unlike resources, data sources do not create or manage infrastructure. Instead, they return information about some kind of external object in the form of readable [attributes][]. This allows a Terraform configuration to make use of information defined outside of Terraform, or defined by another separate Terraform configuration.

Data sources are implemented by [providers][].

- [Terraform docs: Data Sources](/docs/configuration/data-sources.html)

## Deposed

[deposed]: glossary.html#deposed
[deposed resource]: glossary.html#deposed
[deposed resources]: glossary.html#deposed

This status tracks a [resource][] that was marked for deletion, but still remains in the Terraform [state][] and infrastructure due an error from a previous [apply][]. Terraform expected to replace the existing resource by creating a new resource, then destroying the existing resource, but an error occurred in the apply before the destruction. Existing references to the resource refer to the new resource. Terraform will destroy the `deposed` resource on the next apply. This only can occur in resource [configurations][] that have the `lifecycle` configuration block `create_before_destroy` [argument][] set to `true`.

- [Terraform docs: Resources](/docs/configuration/resources.html)

## Expression

[expression]: glossary.html#expression
[expressions]: glossary.html#expression

In Terraform's [configuration][] language: a piece of syntax that represents a value, either literally or by referencing and combining other values. Expressions appear as values for [arguments][], or within other expressions.

Prior to Terraform 0.12, [interpolation][] was the only way to use non-literal expressions in Terraform configurations; in 0.12 and later, expressions can be used independently.

- [Terraform docs: Expressions](/docs/configuration/expressions.html)

## Fork

[fork]: glossary.html#fork
[forks]: glossary.html#fork
[forked]: glossary.html#fork

Also "forked repository" or "forked repo".

A [VCS][] [repository][] that was created by copying content and history from another repository.

Different VCS providers handle forks differently, but a fork is usually owned by a different person or organization than the original repo, and a fork usually does not inherit all of the original repo's access permissions.

Terraform Cloud makes extensive use of VCS repos, and assumes that forks of a trusted repo are not necessarily trusted. As such, Terraform Cloud avoids evaluating any code from external forks, which prevents Terraform Cloud from running [speculative plans][] for [pull requests][] from forks.

## Git

[git]: glossary.html#git

A distributed [version control system][vcs] for tracking changes in source code during software development. It is designed for coordinating work among programmers, but it can be used to track changes in any set of files.

- [Wikipedia: Git](https://en.wikipedia.org/wiki/Git)

## HCL

[hcl]: glossary.html#hcl

HashiCorp Configuration Language. The structured configuration syntax that serves as the basis for Terraform's [configuration][] language, as well as the configuration layer for several other HashiCorp products.

HCL establishes the syntax Terraform uses for things like [arguments][], [blocks][], literal values, and [expressions][]. But what most people think of as the Terraform language extends beyond just the syntax; the built-in functions, Terraform-specific block types (like `resource` and `variable`), and Terraform-specific named values available in expressions are all implementation details of Terraform itself.

- [GitHub: HCL](https://github.com/hashicorp/hcl)
- [Terraform docs: Configuration Language](/docs/configuration/index.html)

## ID

[id]: glossary.html#id
[ids]: glossary.html#id

An identifier; an opaque string permanently associated with a specific object, which doesn't contain any information about the object but which can be used to retrieve information about it or perform actions on it via an [API][].

In Terraform, many [resource][] types have an ID [attribute][] that helps link Terraform's [state][] to the real infrastructure resource being managed.

In Terraform Cloud, most internal application objects (like [workspaces][], users, [policies][], etc.) can be identified by both a name and by an opaque, permanent ID. Most API endpoints use IDs instead of names, since names sometimes change. IDs for Terraform Cloud's application objects are sometimes called "external IDs."

You can usually copy an external ID from the URL bar when viewing an object in Terraform Cloud's UI. Workspaces don't display an ID in the URL bar, but their general settings page includes a UI control for viewing and copying the ID.

## Ingress

[ingress]: glossary.html#ingress
[ingressing]: glossary.html#ingress

-> Terraform Cloud

The process of bringing content into Terraform Cloud. Usually that content is a [configuration version][], but it can also be a [private module][] version or some other kind of content.

This term comes from Terraform Cloud's internal subsystems. Most documentation and UI avoids using "ingress," but it can sometimes appear in API contexts or support conversations.

## Input Variables

See [Variables][].

## Interpolation

Using a special placeholder to insert a computed value into a string.

[Terraform's configuration language][hcl] supports interpolation in strings using `${<EXPRESSION>}` placeholders. For example:

```hcl
"Hello, ${var.name}!"
```

Prior to Terraform 0.12, interpolation was the only way to use non-literal [expressions][] in Terraform configurations; in 0.12 and later, expressions can be used independently.

Interpolation is a very common feature in programming languages; for example, Ruby uses `#{<EXPRESSION>}` placeholders in double-quoted strings, and JavaScript (ES6 and up) uses `${<EXPRESSION>}` placeholders in backtick-quoted strings.

- [Terraform docs: Expressions - String Templates](/docs/configuration/expressions.html#string-templates)

## JSON

[json]: glossary.html#json

"JavaScript Object Notation". A popular text-based data interchange format, which can represent strings, numbers, booleans, null, arrays, and objects/maps.

Terraform and Terraform Cloud often interact with JSON data in order to consume or provide APIs. Terraform also supports JSON as an alternate format for [configurations][].

- [Wikipedia: JSON](https://en.wikipedia.org/wiki/Json)
- [Terraform docs: JSON Configuration Syntax](/docs/configuration/syntax-json.html)

## Locking

[locking]: glossary.html#locking
[lock]: glossary.html#locking

-> Terraform Cloud

The ability to prevent new [runs][] from starting in a given [workspace][]. Workspaces are automatically locked while a run is in progress, and can also be manually locked.

The [`remote` backend][remote backend] respects the lock status in Terraform Cloud workspaces. Some other Terraform [backends][] can also lock state during runs.

## Log

[log]: glossary.html#log
[logs]: glossary.html#log

The text-based output of actions taken within a [run][]. For example, the output of running `terraform plan`.

## Module

[module]: glossary.html#module
[modules]: glossary.html#module

Also "Terraform module".

A self-contained collection of Terraform [configurations][] that manages a collection of related infrastructure resources.

Other Terraform configurations can _call_ a module, which tells Terraform to manage any resources described by that module.

Modules define [input variables][] (which the calling module can set values for) and [output values][] (which the calling module can reference in [expressions][]).

- [Terraform docs: Modules](/docs/modules/index.html)

## OAuth

[oauth]: glossary.html#oauth

An open standard for token-based authorization between applications on the internet.

Terraform Cloud uses OAuth to connect your organization to your [VCS provider][]. Generally takes an `id` and `secret` from your VCS provider to give access to Terraform Cloud and allow it to pull in configuration from the provider.

- [Terraform Cloud docs: VCS Integration](/docs/cloud/vcs/index.html)

## OAuth Client

[oauth client]: glossary.html#oauth-client
[oauth clients]: glossary.html#oauth-client

-> Terraform Cloud

An entity collecting the configuration information that a Terraform Cloud organization needs in order to connect to a specific [VCS provider][].

An OAuth client needs an [OAuth token][] in order to actually access data belonging to a user or organization in that VCS provider. The client can be created with an existing token for that VCS provider (API-only, and not supported for some VCS providers), or it can be created with the details Terraform Cloud needs in order to request a token. Requesting a token requires a user to click through and approve access with their VCS provider account.

- [Terraform Cloud docs: VCS Integration](/docs/cloud/vcs/index.html)
- [Terraform Cloud API docs: OAuth Clients](/docs/cloud/api/oauth-clients.html)

## OAuth Token

[oauth token]: glossary.html#oauth-token
[oauth tokens]: glossary.html#oauth-token

-> Terraform Cloud

**In general:** A secret string that allows an application to authenticate itself to another application. The token is generated ahead of time by the application being accessed (either during the OAuth authorization exchange or in response to a direct request by a user), and allows access with whatever permissions that application assigns to the token. The [VCS providers][] supported by Terraform Cloud allow access via OAuth tokens; that access is generally restricted to data belonging to a given user or organization within that provider.

**Within Terraform Cloud:** An entity in the Terraform Cloud application that associates an OAuth token (in the "secret string" sense) with a permanent ID and with metadata about which VCS provider it applies to and which VCS user approved the token. When documentation refers specifically to this kind of entity, the name is often styled as `oauth-token` to indicate that it's an entity you can interact with via the [API][].

An `oauth-token` has a one-to-one relationship with an [OAuth client][], but the client can outlive a specific token, to allow revoking and re-requesting VCS access.

[Workspaces][] that are linked to a VCS [repo][] have a relationship with one `oauth-token`.

- [Terraform Cloud docs: VCS Integration](/docs/cloud/vcs/index.html)
- [Terraform Cloud API docs: OAuth Tokens](/docs/cloud/api/oauth-tokens.html)

## Organization

[organization]: glossary.html#organization
[organizations]: glossary.html#organization

-> Terraform Cloud

Terraform Cloud's fundamental unit for controlling access and grouping things together; meant to represent a company or a business unit within a company. An organization contains a group of [workspaces][], a group of [teams][], a group of [Sentinel policies][], and a variety of settings. Adding users to an organization is done via teams.

- [Terraform Cloud docs: Organizations](/docs/cloud/users-teams-organizations/organizations.html)

## Output Values

[output value]: glossary.html#output-values
[output values]: glossary.html#output-values
[output]: glossary.html#output-values
[outputs]: glossary.html#output-values

Also "outputs".

Data exported by a Terraform [module][], which can be displayed to a user and/or programmatically used by other Terraform code.

## OSS

[oss]: glossary.html#oss

"Open-Source Software". Terraform and the publicly available Terraform providers are open-source. Terraform Cloud and Terraform Enterprise are closed-source commercial software, but they make use of Terraform and the available Terraform providers.

- [Wikipedia: Open-Source Software](https://en.wikipedia.org/wiki/Open-source_software)

## Permissions

[permission]: glossary.html#permissions
[permissions]: glossary.html#permissions

-> Terraform Cloud

Specific levels of access allowed within Terraform Cloud. Can be managed at the [workspace][] and/or [organization][] level. For example, a user with "read" permissions for a workspace can see a list of runs but cannot approve a run like a user with "write" permissions can.

- [Terraform Cloud docs: Permissions](/docs/cloud/users-teams-organizations/permissions.html)

## Plan (verb)

[plan-v]: glossary.html#plan-verb-

Also "queue plan".

To start a new [run][], which begins by running a Terraform [plan (noun)][plan].

- [Terraform Cloud docs: About Runs](/docs/cloud/run/index.html)

## Plan (noun, 1)

[plan]: glossary.html#plan-noun-1-
[plans]: glossary.html#plan-noun-1-

One of the stages of a [run][], in which Terraform compares the managed infrastructure's real state to the [configuration][] and [variables][], determines which changes are necessary to make the real state match the desired state, and presents a human-readable summary to the user. The counterpart of an [apply][].

In Terraform's CLI, plans are performed by all of the following commands:

- `terraform plan`, which only performs a plan. It can optionally output a [plan file][], which `terraform apply` can use to perform that exact set of planned changes.
- `terraform apply`, which performs a plan and then, if a user approves, immediately applies it.
- `terraform destroy`, which is similar to `terraform apply` but uses a desired state in which none of the managed resources exist; if the plan is approved, those resources are destroyed.

In Terraform Cloud, plans are performed by committing changes to a workspace's configuration, running `terraform plan` or `terraform apply` with the remote backend enabled, manually queueing a plan, or uploading a configuration via the API.

Terraform Cloud's workflow always creates a [plan file][], which can be auto-applied or can wait for a user's approval. Terraform Cloud also supports [speculative plans][], which are for informational purposes only and cannot be applied.

- [Terraform docs: The `terraform plan` command](/docs/commands/plan.html)
- [Terraform Cloud docs: About Runs](/docs/cloud/run/index.html)

## Plan File

[plan file]: glossary.html#plan-file
[plan files]: glossary.html#plan-file

Also "`.tfplan`", "saved plan", or simply "plan" in contexts where it's clearly referring to an artifact.

A binary artifact optionally produced by the `terraform plan` command, which `terraform apply` can use to carry out the exact changes that were decided at the time of the [plan][].

Terraform Cloud always uses a saved plan as the input to an [apply][], so that applies never make changes that weren't shown to the user after the plan (in cases where the config or the variables changed in the meantime).

## Policy

[policy]: glossary.html#policy
[policies]: glossary.html#policy
[sentinel policy]: glossary.html#policy
[sentinel policies]: glossary.html#policy

-> Terraform Cloud

[Sentinel][] code that can be enforced on runs. Combined into [policy sets][].

- [Terraform Cloud docs: Managing Sentinel Policies](/docs/cloud/sentinel/manage-policies.html)

## Policy Check

[policy check]: glossary.html#policy-check
[policy checks]: glossary.html#policy-check

-> Terraform Cloud

Part of a [run][]. After gathering the [configuration][], [state][], and [plan file][] for a run, Terraform Cloud runs [Sentinel][] to check that data against the active [policies][]. Policy checks end in success or failure. If a failure occurs in a required policy, this can prevent the run from proceeding to the [apply][] stage.

- [Terraform Cloud docs: Run States and Stages](/docs/cloud/run/states.html)

## Policy Set

[policy set]: glossary.html#policy-set
[policy sets]: glossary.html#policy-set

-> Terraform Cloud

A list of [Sentinel][] [policies][] to enforce globally or on specific workspaces.

- [Terraform Cloud docs: Managing Sentinel Policies](/docs/cloud/sentinel/manage-policies.html)

## Private Module Registry

[private terraform registry]: glossary.html#private-terraform-registry
[private module registry]: glossary.html#private-terraform-registry
[private registry]: glossary.html#private-terraform-registry
[private module]: glossary.html#private-terraform-registry
[private modules]: glossary.html#private-terraform-registry

-> Terraform Cloud

Also "private Terraform registry".

A version of the [Terraform Registry][] that is built-in to Terraform Cloud, to enable code sharing within an organization. It includes a configuration designer, which lets you combine and configure modules to generate a Terraform [configuration][] that uses them.

- [Terraform Cloud docs: Private Registry](/docs/cloud/registry/index.html)

## Private Terraform Enterprise (PTFE)

[private terraform enterprise]: glossary.html#private-terraform-enterprise-ptfe-
[private installs]: glossary.html#private-terraform-enterprise-ptfe-

[Terraform Enterprise][].

Prior to mid-2019, "Terraform Enterprise" (TFE) was the name of the Terraform Cloud application, and "Private Terraform Enterprise" (PTFE) was the name of the on-premises distribution.

- [Terraform Enterprise docs](/docs/enterprise/index.html)

## (Terraform) Provider

[provider]: glossary.html#terraform-provider
[providers]: glossary.html#terraform-provider

A plugin for Terraform that makes a collection of related resources available. A provider plugin is responsible for understanding [API][] interactions with some kind of service and exposing [resources][] based on that API.

Terraform providers are generally tied to a specific _infrastructure provider,_ which might be an infrastructure as a service (IaaS) provider (like AWS, GCP, Microsoft Azure, OpenStack), a platform as a service (PaaS) provider (like Heroku), or a software as a service (SaaS) provider (like Terraform Cloud, DNSimple, CloudFlare).

There are many existing providers available, but providers can also be custom-built to work with any API.

- [Terraform docs: Providers](/docs/providers/index.html)

## Pull Request (PR)

[pull request]: glossary.html#pull-request-pr-
[pull requests]: glossary.html#pull-request-pr-
[pr]: glossary.html#pull-request-pr-
[prs]: glossary.html#pull-request-pr-

A mechanism created by GitHub to review and discuss changes made to a [Git][] [repository][] [branch][] that a user wants to merge into another branch. Other collaborators can request changes, approve, or reject these changes.

Conversationally, people often say "pull request" to refer to this review-before-merging workflow even when working with a VCS provider that calls it something else. (For example, GitLab calls this a Merge Request.)

## Queue

[queue]: glossary.html#queue
[queues]: glossary.html#queue

-> Terraform Cloud

The list of [runs][] waiting to be processed. Terraform Cloud uses several queues of runs, including a per-workspace queue (since only one run at a time is allowed in a given [workspace][], to avoid conflicts and state corruption) and a global per-instance queue (since compute resources are finite and Terraform Cloud only has access to so many VMs).

## (Terraform) Registry

[terraform registry]: glossary.html#terraform-registry
[registry]: glossary.html#terraform-registry

A repository of [modules][] written by the Terraform community, which can be used as-is within a Terraform [configuration][] or [forked][] and modified. The registry can help you get started with Terraform more quickly, see examples of how Terraform is written, and find pre-made modules for infrastructure components you require.

- [Terraform docs: The Terraform Registry](/docs/registry/index.html)

## Remote Operations

[remote operation]: glossary.html#remote-operations
[remote operations]: glossary.html#remote-operations

-> Terraform Cloud

The ability to start a [run][] (or perform a few other tasks) from your local [CLI][] and view output inline, while still allowing Terraform Cloud to perform the actual operation.

Terraform Cloud performs Terraform runs in its own disposable VMs, where it can capture information, control access to secrets, etc., but many users are accustomed to running Terraform on their local machines. Remote operations exist to help split the difference.

- [Terraform docs: Remote Operations](/docs/backends/operations.html)

## Remote Backend

[remote backend]: glossary.html#remote-backend

A Terraform CLI feature that lets Terraform connect to Terraform Cloud, by specifying in the Terraform [configuration][] which organization and workspace(s) to use. Used for [remote operations][] in Terraform Cloud workspaces, and used for [state][] storage in Terraform Cloud's free tier.

See also [backend][]. Older documentation sometimes refers to backends like `s3` or `consul` as "remote backends," since they store Terraform's state in a remote service instead of the local filesystem, but today this term usually means the specific backend whose name is `remote`.

- [Terraform docs: The `remote` Backend](/docs/backends/types/remote.html)

## Repository

[repository]: glossary.html#repository
[repositories]: glossary.html#repository
[repo]: glossary.html#repository
[repos]: glossary.html#repository

Also "repo".

A collection of files and a history of the changes to them, managed by a [version control system][vcs]. In Terraform Cloud, a "repo" is generally a Git repository that contains a Terraform configuration, although [private modules][] are also based on Git repos.

- [Wikipedia: Repository (version control)](https://en.wikipedia.org/wiki/Repository_(version_control))

## Resource

[resource]: glossary.html#resource
[resources]: glossary.html#resource

Also "infrastructure resource".

In Terraform's [configuration][] language: A [block][] that describes one or more infrastructure objects. Resources can be things like virtual networks, compute instances, or higher-level components such as DNS records.

In other Terraform-related contexts: An infrastructure object of a type that _could_ be managed by Terraform.

A resource block in a configuration instructs Terraform to _manage_ the described resource — during a run, Terraform will create a matching real infrastructure object if one doesn't already exist, and will modify the existing object if it doesn't match the desired configuration. Terraform uses [state][] to keep track of which real infrastructure objects correspond to resources in a configuration.

Terraform uses cloud provider [APIs][] to create, edit, and destroy resources. Terraform [providers][] are responsible for defining resource types and mapping transitions in a resource's state to a specific series of API calls that will carry out the necessary changes.

- [Terraform docs: Resources](/docs/configuration/resources.html)

## Root Module

[root module]: glossary.html#root-module
[root modules]: glossary.html#root-module

The place where Terraform begins evaluating a [configuration][]. The root module consists of all of the configuration files in Terraform's [working directory][].

The root module's [variables][] and [outputs][] are handled directly by Terraform (unlike child [modules][], whose variables and outputs are handled by the calling module). Root variable values can be provided with Terraform Cloud, `.tfvars` files, CLI options, or environment variables. Root outputs are printed after a run and stored in the state.

## Root Outputs

[root output]: glossary.html#root-outputs
[root outputs]: glossary.html#root-outputs

Also "root-level outputs".

The [output values][] of a configuration's [root module][]. A [configuration][] can access the root outputs of another configuration with a `terraform_remote_state` data source.

## Run

[run]: glossary.html#run
[runs]: glossary.html#run

Also "Terraform Run".

The process of using Terraform to make real infrastructure match the desired state (as specified by the contents of the config and variables at a specific moment in time).

In Terraform Cloud, runs are performed in a series of stages ([plan][], [policy check][], and [apply][]), though not every stage occurs in every run. Terraform Cloud saves information about historical runs.

- [Learn Terraform: Getting Started](https://learn.hashicorp.com/terraform/getting-started/install)
- [Terraform Cloud docs: About Runs](/docs/cloud/run/index.html)

## S3

[s3]: glossary.html#s3

Amazon Web Services' "Simple Storage Service", a service for storing and retrieving arbitrary blobs of data.

Many other cloud or self-hosted services provide [APIs][] that are compatible with S3's API, which allows them to be used with software that was designed to work with S3.

Terraform's `aws` [provider][] can manage S3 resources.

Terraform Enterprise can use an S3-compatible [blob storage][] service when configured to use external services for storage.

- [AWS: S3](https://aws.amazon.com/s3/)

## SAML

[saml]: glossary.html#saml

-> Terraform Enterprise

SAML is an XML-based standard for authentication and authorization. Terraform Enterprise can act as a service provider (SP) (or Relying Party, RP) with your internal SAML identity provider (IdP). The SAML Single Sign On feature is only available on [Terraform Enterprise][]; the Terraform Cloud SaaS does not support it.

- [Terraform Enterprise docs: SAML Single Sign-On](/docs/enterprise/saml/index.html)

## Sentinel

[sentinel]: glossary.html#sentinel

-> Terraform Cloud

A language and runtime for managing policy as code. Allows you to define rules around operations in Terraform Cloud.

- [Terraform Cloud docs: Sentinel](/docs/cloud/sentinel/index.html)

## Site Admin

[site admin]: glossary.html#site-admin
[site admins]: glossary.html#site-admin

-> Terraform Enterprise

An administrator of a [Terraform Enterprise][] instance, who has access to application settings that affect all [organizations][] using the instance.

- [Terraform Enterprise docs: Administration](/docs/enterprise/admin/index.html)

## Speculative Plan

[speculative plan]: glossary.html#speculative-plan
[speculative plans]: glossary.html#speculative-plan

-> Terraform Cloud

A [run][] that is only intended to show possible changes to infrastructure, when using a given [config version][] and set of [variables][]. Speculative plans can never be [applied][apply-v], and are usually started as a result of [pull requests][] to a [workspace][]'s repo, or by running `terraform plan` on the command line with [remote operations][] configured.

## SSH Key

[ssh key]: glossary.html#ssh-key
[ssh keys]: glossary.html#ssh-key

A type of access credential based on public key cryptography, used to log into servers.

Terraform Cloud uses SSH private keys for two kinds of operations:

- Downloading private Terraform [modules][] with [Git][]-based sources during a Terraform run. Keys for downloading modules are assigned per-workspace.
- Bringing content from a connected [VCS provider][] into Terraform Cloud, usually when pulling in a Terraform [configuration][] for a [workspace][] or importing a module into the [private module registry][]. Only some VCS providers require an SSH key, but others can optionally use SSH if an SSH key is provided.

- [Wikipedia: SSH](https://en.wikipedia.org/wiki/Secure_Shell)
- [Terraform Cloud docs: SSH Keys for Cloning Modules](/docs/cloud/workspaces/ssh-keys.html)

## State

[state]: glossary.html#state

Terraform's cached information about your managed infrastructure and [configuration][]. This state is used to persistently map the same real world [resources][] to your configuration from run-to-run, keep track of metadata, and improve performance for large infrastructures.

Without state, Terraform has no way to identify the real resources it created during previous runs. Thus, when multiple people are collaborating on shared infrastructure, it's important to store state in a shared location, like a free Terraform Cloud organization.

- [Terraform docs: State](/docs/state/index.html)

## State Version

[state version]: glossary.html#state-version
[state versions]: glossary.html#state-version

-> Terraform Cloud

A snapshot of your infrastructure's [state][] at a point in time. Can be manually uploaded to Terraform Cloud or created as the result of an [apply][].

Terraform CLI doesn't have any concept of historical state data; it only interacts with the most recent state, and writes a snapshot of the new state to the configured [backend][] after making changes. Whatever system that backend writes to can choose to retain previous state; Terraform Cloud does this, and some other backends (like S3) can also be configured to keep historical snapshots. The `local` backend does not.

## Team

[team]: glossary.html#team
[teams]: glossary.html#team

-> Terraform Cloud

A group of Terraform Cloud users, which can be given permission to access and/or edit various objects ([workspaces][], [policies][], etc.) within an [organization][]. A team belongs to a single organization. Users can belong to any number of teams in any number of organizations.

- [Terraform Cloud docs: Teams](/docs/cloud/users-teams-organizations/teams.html)

## Terraform

[terraform]: glossary.html#terraform

A tool for building, changing, and versioning infrastructure safely and efficiently. Terraform can manage existing and popular service providers as well as custom in-house solutions.

- [Intro to Terraform](/intro/index.html)

## Terraform Cloud

[terraform cloud]: glossary.html#terraform-cloud

An application that helps teams use Terraform together. Terraform Cloud provides a consistent environment for Terraform runs, as well as hosting Terraform [state][] and other shared information.

Terraform Cloud is available as a hosted service at [https://app.terraform.io](https://app.terraform.io). It is also available in an on-premises distribution called [Terraform Enterprise][].

Prior to mid-2019, "Terraform Enterprise" (TFE) was the name of the Terraform Cloud application, and "Private Terraform Enterprise" (PTFE) was the name of the on-premises distribution.

- [Terraform Cloud docs](/docs/cloud/index.html)

## Terraform Enterprise

[terraform enterprise]: glossary.html#terraform-enterprise

An on-premises distribution of Terraform Cloud, which enables large enterprises to host their own private instance of the application.

Prior to mid-2019, "Terraform Enterprise" (TFE) was the name of the Terraform Cloud application, and "Private Terraform Enterprise" (PTFE) was the name of the on-premises distribution.

- [Terraform Enterprise docs](/docs/enterprise/index.html)

## Terraform Version

[terraform version]: glossary.html#tool-version
[terraform versions]: glossary.html#tool-version

-> Terraform Cloud

A particular version of the `terraform` binary available for use in Terraform Cloud workspaces. Specifies a URL, a SHA256 checksum and enabled/beta flags.

[Site admins][] can configure the available Terraform versions for a [Terraform Enterprise][] instance.

- [Terraform Enterprise docs: Managing Terraform Versions](/docs/enterprise/admin/resources.html#managing-terraform-versions)

## TFE

[tfe]: glossary.html#tfe

[Terraform Enterprise][].

- [Terraform Enterprise docs](/docs/enterprise/index.html)

## TFE Provider / Terraform Cloud Provider

[tfe provider]: glossary.html#tfe-provider-terraform-cloud-provider

A Terraform provider that manages Terraform Cloud. Allows you to manage Terraform Cloud using a Terraform [configuration][].

- [Provider docs: tfe](/docs/providers/tfe/index.html)

## (API) Token

[token]: glossary.html#api-token
[tokens]: glossary.html#api-token

-> Terraform Cloud

A revocable secret string that authenticates a user, to allow use of Terraform Cloud's [API][] or the [remote backend][].

Different kinds of tokens grant different permissions. Tokens can be granted by user, [team][], or [organization][].

Many applications other than Terraform Cloud use token-based authentication, but within Terraform Cloud's documentation and UI, "token" without any other qualification generally means a Terraform Cloud API token.

- [Terraform Cloud docs: User Tokens](/docs/cloud/users-teams-organizations/users.html#api-tokens)
- [Terraform Cloud docs: Team Tokens](/docs/cloud/users-teams-organizations/teams.html#api-tokens)
- [Terraform Cloud docs: Organization Tokens](/docs/cloud/users-teams-organizations/organizations.html#api-tokens)

## Trigger

[trigger]: glossary.html#trigger
[triggers]: glossary.html#trigger

-> Terraform Cloud

Something that causes a new [run][] to queue. Runs can be UI/VCS-driven (in which case the trigger is a new VCS commit or a UI action), API-driven (in which case the trigger is an API call) or CLI-driven (in which case the trigger is a CLI command).

- [Terraform Cloud docs: UI/VCS-based Run Workflow](/docs/cloud/run/ui.html)

## Variables

[variables]: glossary.html#variables
[input variables]: glossary.html#variables

Also "input variables".

In general-purpose programming, a variable is a symbolic name associated with a value.

In Terraform, "variables" almost always refers to _input variables,_ which are key/value pairs used in a [run][]. Terraform [modules][] can declare variables to allow customization. For child modules, the parent module provides a value when calling the module; for the [root module][], values are provided at run time.

Terraform Cloud lets you set values for root input variables in a [workspace][], so all collaborators can use the same values. Variable values marked as "sensitive" become unreadable in the UI and API, and all variable values are protected by Vault.

- [Terraform docs: Input Variables](/docs/configuration/variables.html)
- [Terraform Cloud docs: Variables](/docs/cloud/workspaces/variables.html)

## VCS

[vcs]: glossary.html#vcs

Version Control System, like [Git][]. Software that tracks changes over time to a collection of files, making it possible to keep track of changes, undo changes, and combine changes made in parallel by different users. Usually used for any non-trivial code effort, including infrastructure as code.

Different VCSes use different models for history; Git models changes as a directed acyclic graph of [commits][], and parallel changes that begin from the same parent commit become diverging [branches][] (which might later be merged together).

- [Wikipedia: Version Control](https://en.wikipedia.org/wiki/Version_control)

## VCS Provider

[vcs provider]: glossary.html#vcs-provider
[vcs providers]: glossary.html#vcs-provider

-> Terraform Cloud

A specific service that provides [VCS][] features, with the goal of enabling teams to collaborate on code. Terraform Cloud can integrate with VCS providers to access your Terraform [configurations][] and [modules][], and currently supports GitHub, GitHub Enterprise, GitLab.com, GitLab EE and CE, Bitbucket Cloud, Bitbucket Server, Azure DevOps Server, and Azure DevOps Services.

- [Terraform Cloud docs: Connecting VCS Providers](/docs/cloud/vcs/index.html)

## Webhook

[webhook]: glossary.html#webhook
[webhooks]: glossary.html#webhook

A server-to-server HTTP request, in which one system responds to a change in its internal state by sending information to another system.

The recipient of a webhook might return information to the requesting system, call other webhooks in response, perform its action silently, or ignore the request entirely.

Terraform Cloud uses webhooks in multiple ways. Most notably:

- Terraform Cloud creates webhook configurations on [VCS providers][], so that they send webhook requests to Terraform Cloud whenever linked [repositories][] receive [pull requests][] or new [commits][]. ([Terraform Cloud docs: UI/VCS-driven Runs](/docs/cloud/run/ui.html))
- Users can create webhook configurations on Terraform Cloud [workspaces][], so that Terraform Cloud will send run notification webhooks to Slack or other external services. ([Terraform Cloud docs: Run Notifications](/docs/cloud/workspaces/notifications.html))

## Working Directory

[working directory]: glossary.html#working-directory
[working directories]: glossary.html#working-directory

The directory where `terraform init` runs, creating a `.terraform` subdirectory. All subsequent commands for the same [configuration][] should then be run from the same working directory.

The [root module][] consists of all of the configuration files in the top level of Terraform's working directory. Subdirectories of the working directory can contain child [modules][].

## Workspace

[workspace]: glossary.html#workspace
[workspaces]: glossary.html#workspace

In Terraform CLI, a workspace is an isolated instance of [state][] data. Using multiple workspaces lets you manage multiple non-overlapping sets of infrastructure from a single [configuration][] in a single [working directory][].

In Terraform Cloud, a workspace is a complex object that represents everything needed to manage a specific collection of infrastructure resources over time. In particular, this includes:

- A Terraform [configuration][] (which has multiple versions over time, and which can come from a repo or from manual uploads)
- A set of [variables][]
- [State][] data that represents the current and historical condition of the infrastructure
- Historical information about [runs][].

All Terraform Cloud runs occur in the context of a workspace — they use that workspace's config data, use that workspace's state to identify the real infrastructure being managed, and edit that workspace's state to match any infrastructure changes during the run. A workspace belongs to an [organization][].

- [Terraform Cloud docs: Workspaces](/docs/cloud/workspaces/index.html)
- [Terraform docs: Workspaces](/docs/state/workspaces.html)
