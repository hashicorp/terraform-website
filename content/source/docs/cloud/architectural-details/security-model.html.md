---
layout: "cloud"
page_title: "Security Model - Terraform Cloud"
---
# Terraform Cloud Security Model

## Purpose of This Document

This document explains the security model of Terraform Cloud and the security controls available to end users. Additionally, it provides best practices for securely managing your infrastructure with Terraform Cloud.

## Important Concepts

### Workspaces and Teams

Terraform Cloud organizes infrastructure with workspaces. Workspaces represent a logical security boundary within the organization. Variables, state, SSH keys, and log output are local to a workspace. You can grant teams [read, plan, write, admin, or a customized set of permissions](../users-teams-organizations/permissions.html) within a workspace. 

### Terraform Runs - Plans and Applies

Terraform Cloud will provision infrastructure according to your Terraform configuration which you can upload through the VCS-driven, API-driven, or CLI-driven workflows. You can read more about the different workflows [here](../run/index.html#starting-runs). It’s important to note that Terraform Cloud performs all Terraform operations within the same privilege context. Both the plan and apply operations have access to the full workspace variables, state versions, and Terraform configuration.

### Terraform State File

Terraform Cloud retains the current and all historical [state](../../language/state/index.html) versions for each workspace. Depending on the resources that are used in your Terraform configuration, these state versions may contain sensitive data such as database passwords, resource IDs, etc.

## Personas

### Organization Owners

Members of the [owners team](..//users-teams-organizations/teams.html#the-owners-team) have administrator-level privileges within an organization. Members of this team will have access to all workspaces and all settings within the organization. This role is intended for users who will perform administrative tasks in your organization.

### Workspace Team Members

Teams allow you to group users within an organization. You can grant teams [read, plan, write, admin, or a customized set of permissions](../users-teams-organizations/permissions.html), each of which allow them to perform various functions within the workspace. You can also grant Teams any [organization-level privileges](../users-teams-organizations/permissions.html#organization-permissions), which apply to workspaces across the organization.

### Contributors to Connected VCS repositories

Terraform Cloud executes Terraform configuration from connected VCS repositories. Depending on the configuration, Terraform Cloud may automatically trigger Terraform operations when the connected repositories receive new contributions.

## Authorization Model

[![Terraform Cloud authorization model diagram](../../../assets/images/docs/terraform-cloud-authorization.png)](../../../assets/images/docs/terraform-cloud-authorization.png)
_Click on the diagram for a larger view._

~> **Note:** This diagram displays a useful subset of TFC’s authorization model, but is not comprehensive. Some details were omitted for the sake of clarity. More information is available in our [Permissions documentation](../users-teams-organizations/permissions.html).

Workspaces provide a logical security boundary within the organization. Environment variables and Terraform configurations are isolated within a workspace, and access to a workspace is granted on a per-team basis.

All organizations in Terraform Cloud contain an “owners” team, which grants admin-level access to the organization and all its workspaces.

~> **Note:** Teams not available to free-tier users on Terraform Cloud. Organizations at the free-level will only have an owners team.

You can grant teams [read, plan, write, admin, or a customized set of permissions](../users-teams-organizations/permissions.html#workspace-permissions) within a workspace. It’s important to note that, from a security perspective, the plan permission is equivalent to the write permission. The plan permission is provided to protect against accidental Terraform runs but is not intended to stop malicious actors from accessing sensitive data within a workspace.  Terraform `plan` and `apply` operations can execute arbitrary code within the ephemeral build environment. Both of these operations happen in the same security context with access to the full set of workspace variables, Terraform configuration, and Terraform state.

By default, Teams with read privileges within a workspace can view the workspace's state. You can remove this access by using [customized workspace permissions](../users-teams-organizations/permissions.html#custom-workspace-permissions); however, this will only apply to state file access through the API or UI. Terraform must access the state file in order to perform plan and apply operations, so any user with the ability to upload Terraform configurations and initiate runs will transitively have access to the workspaces' state.

State may be shared across workspaces via the [remote state access workspace setting](../workspaces/state.html#accessing-state-from-other-workspaces).
 
Terraform configuration files in connected VCS repositories are inherently trusted. Commits to connected repositories will automatically queue a plan within the corresponding workspace. Pull requests to connected repositories will initiate a speculative plan, though this behavior may be disabled via the [speculative plan setting](../workspaces/vcs.html#automatic-speculative-plans) on the workspace settings page. Terraform Cloud has no knowledge of your VCS's authorization controls and does not associate Terraform Cloud user accounts with VCS user accounts — the two should be considered separate identities.

## Threat Model

Terraform Cloud is designed to execute Terraform operations and manage the state file to ensure that infrastructure is reliably created, updated, and destroyed by multiple users of an organization.

The following are part of the Terraform Cloud threat model:

### Confidentiality and Integrity of Communication Between Terraform Clients and Terraform Cloud

All communication between clients and Terraform Cloud is encrypted end-to-end using TLS. Terraform Cloud currently supports TLS version 1.2. Terraform Cloud communicates with linked VCS repositories using the Oauth2 authorization protocol. Terraform Cloud can also be configured to fetch Terraform modules from private repositories using the SSH protocol with a customer-provided private key.

### Confidentiality of State Versions, Terraform Configurations, and Stored Variables.

As a user, you will entrust Terraform Cloud with information that is very sensitive to your organization such as API tokens, your Terraform configurations, and your Terraform state file. Terraform Cloud is designed to ensure the confidentiality of this information, it relies on [Vault Transit](https://www.vaultproject.io/docs/secrets/transit/index.html) for encrypting workspace variables. Terraform configurations and state are encrypted at rest with uniquely derived encryption keys backed by Vault. You can view how all customer data is encrypted and stored on our [data security page](../architectural-details/data-security.html).

### Enforcement of Authentication and Authorization Policies for Data Access and Actions Taken Through the UI or API.

Terraform Cloud enforces authorization checks for all actions taken within the API or through the UI. More information about Terraform Cloud workspace-level and organization level permission are available [here](../users-teams-organizations/permissions.html).

### Isolation of Terraform Executions

Each Terraform operation (plan and apply) happens in an ephemeral environment that is created immediately before the run and destroyed after it is completed. The build environment is designed to provide isolation between Terraform executions and between Terraform Cloud tenants.

### Reliability and Availability of Terraform Cloud

Terraform Cloud is spread across multiple availability zones for reliability, we perform regular backups of our production data stores and have a process for recovering in case of a major outage.

## What Isn’t Part of the Threat Model

### Malicious Contributions to Terraform Configuration in VCS repositories

Commits and pull requests to connected VCS repositories will trigger a plan operation within the workspace. Terraform Cloud does not perform any authentication or authorization checks against commits in linked VCS repositories, and cannot prevent malicious Terraform configuration from exfiltrating sensitive data during plan operations. For this reason, it is important to restrict access to connected VCS repositories. Speculative plans for pull requests may be disabled on the [workspace settings page](../workspaces/vcs.html#automatic-speculative-plans).

-> **Note:** Terraform Cloud will not automatically trigger plans for pull requests from forked repositories.

### Malicious Terraform Providers or Modules

Terraform providers and modules used in your Terraform configuration will have full access to the variables and Terraform state within a workspace. Terraform Cloud cannot prevent malicious providers and modules from exfiltrating this sensitive data. We recommend only using trusted modules and providers within your Terraform configuration.

### Malicious Bypasses of Sentinel Policies

[Sentinel](https://www.hashicorp.com/sentinel) is an embedded policy-as-code framework integrated with the HashiCorp Enterprise products. You can create Sentinel policies to ensure the infrastructure provisioned by Terraform is compliant with a set of policies defined by your organization. 

Sentinel aims to prevent well-intentioned operators from writing configurations that violate organizational policies or best practices. It is not intended to be used as a security boundary that prevents malicious actors from executing malicious Terraform configuration, or modifying Terraform-provisioned infrastructure. Think of Sentinel as guard rails, not a locked door.

### Access to Sensitive Variables or State from Terraform Operations

Marking a variable as “sensitive” will prevent it from being displayed in the UI, but will not prevent it from being read by Terraform during plan or apply operations. Similarly, customized workspace permissions allow you to restrict access to workspace state via the UI and API, but will not prevent it from being read during Terraform operations.

### Redaction of sensitive variables in Terraform logs

The logs from a Terraform plan or apply operation are visible to any user with at least “read” level access in the associated workspace. While Terraform tries to avoid writing sensitive information to logs, redactions are best-effort. This feature should not be treated as a security boundary, but instead as a mechanism to mitigate accidental exposure. Additionally, Terraform Cloud is unable to protect against malicious users who attempt to use Terraform logs to exfiltrate sensitive data.

### Cross-Workspace Data Access via Cloud Agents

[Terraform Cloud Agents](../agents/index.html) should be regarded as a global resource within an organization. Once enabled, any workspace will be able to target any agent pool. A malicious actor can create a workspace that exfiltrates the agent’s API token, accesses private resources from the perspective of the agent, or modifies the agent’s environment. It’s important to consider these risks when using cloud agents.

## Recommendations for Securely Using Terraform Cloud

### Enforce Strong Authentication

Terraform Cloud supports [two factor authentication](../users-teams-organizations/2fa.html) via SMS or TOTP. Organizations can configure mandatory 2FA for all members in the [organization settings](../users-teams-organizations/organizations.html#authentication). Organizations at the business tier may choose to configure [SSO for their organization](../users-teams-organizations/single-sign-on.html).

### Minimize the Number of Users in the Owners Team

Users of the [owners team](../users-teams-organizations/teams.html#the-owners-team) will have full access to all workspaces within the organization. If SSO is enabled, members of the “Owners” team will still be able to authenticate with their username and password. This group should be reserved for only a small number of administrators, and membership should be audited periodically.

### Apply the Principle of Least Privilege to Workspace Membership

[Teams](../users-teams-organizations/teams.html) allow you to group users and assign them various privileges within workspaces. We recommend applying the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when creating teams and assigning permissions so that each user within your organization has the minimum required privileges.

### Protect API Keys

Terraform Cloud allows you to create [user, team, and organization API tokens](../api/index.html#authentication). You should take care to store these tokens securely, and rotate them periodically.
Vault users can leverage the [Terraform Cloud Secret backend](https://www.vaultproject.io/docs/secrets/terraform), which allows you to generate ephemeral tokens.

### Control Access to Source Code

By default, commits and pull requests to connected VCS repositories will automatically trigger a plan operation in a Terraform Cloud workspace. Terraform Cloud cannot protect against malicious code in linked repositories, so you should take care to only grant trusted operators access to these repositories.
Workspaces may be configured to [enable or disable speculative plans for pull requests](../workspaces/vcs.html#automatic-speculative-plans) to linked repositories. You should disable this setting if you allow untrusted users to open pull requests in connected VCS repositories. 

-> **Note:** Terraform Cloud will not automatically trigger plans for pull requests from forked repositories.

### Restrict Access to Workspace State

Workspaces may be configured to share their state with other workspaces within the organization or globally with the entire organization via the [remote state setting](../workspaces/state.html#accessing-state-from-other-workspaces). Because workspace state may contain sensitive information, we recommend that you follow the principle of least privilege and only enable state access between workspaces that specifically need information from each other.

### Treat Archivist URLs as Secrets

Terraform Cloud uses a blob storage service called Archivist for storing various pieces of customer data. Archivist URLs (which have the origin https://archivist.terraform.io) are returned by various Terraform Cloud APIs, such as the [state versions API](../api/state-versions.html#fetch-the-current-state-version-for-a-workspace). Unlike the rest of Terraform Cloud’s API, Archivist’s API does not require the user to submit a Bearer Token with each request. Instead, Archivist URLs contain a signed short term authorization token that is used to perform authorization checks. For this reason, Archivist URLs must be treated as secrets and should not be logged or shared.
