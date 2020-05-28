---
layout: "cloud"
page_title: "Permissions - Terraform Cloud"
---

# Permissions

-> **Note:** Team management is a paid feature, available as part of the **Team** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

Terraform Cloud's access model is team-based. In order to perform an action within a Terraform Cloud organization, users must belong to a team that has been granted the appropriate permissions.

The permissions model is split into organization-level and workspace-level permissions. Additionally, every organization has a special team named "owners", whose members have maximal permissions within the organization.

## Permissions Outside Terraform Cloud's Scope

This documentation only refers to permissions that are managed by Terraform Cloud itself.

Since Terraform Cloud integrates with other systems, the permissions models of those systems can also be relevant to the overall security model of your Terraform Cloud organization. For example:

- When a workspace is connected to a VCS repository, anyone who can merge changes to that repository's main branch can indirectly queue plans in that workspace, regardless of whether they have the queue plans permission or are even a member of your Terraform Cloud organization. (And when auto-apply is enabled, merging changes will indirectly apply runs.)
- If you use Terraform Cloud's API to create a Slack bot for provisioning infrastructure, anyone able to issue commands to that Slack bot can implicitly act with that bot's permissions, regardless of their own membership and permissions in the Terraform Cloud organization.

When integrating Terraform Cloud with other systems, you are responsible for understanding the effects on your organization's security. An integrated system is able to delegate any level of access that it has been granted, so carefully consider the conditions and events that will cause it to delegate that access.

## Organization Owners

Every organization has a special "owners" team. Members of this team are often referred to as "organization owners".

Organization owners have every available permission within the organization. This includes all organization-level permissions, and the highest level of workspace permissions on every workspace.

There are also some actions within an organization that are only ever available to owners. These are generally actions that affect the permissions and membership of other teams, or are otherwise fundamental to the organization's security and integrity.

Owners have the following permissions across the organization:

- Manage workspaces (equivalent to admin permissions on every workspace; see [Organization Permissions][] below)
- Manage policies (see [Organization Permissions][] below)
- Manage VCS settings (see [Organization Permissions][] below)
- Publish private modules (owners only)
- Invite users to organization and manage team membership (owners only)
- Manage organization permissions (owners only)
- Manage all organization settings (owners only)
- Delete organization (owners only)

[Organization Permissions]: #organization-permissions

## Workspace Permissions

[workspace]: ../workspaces/index.html

Most of Terraform Cloud's permissions system is focused on workspaces. In general, administrators want to delegate access to specific collections of infrastructure; Terraform Cloud implements this by granting permissions to teams on a per-workspace basis.

There are two ways to choose which permissions a given team has on a workspace: fixed permission sets, and custom permissions. Additionally, there is a special "admin" permission set that grants the highest level of permissions on a workspace.

### Implied Permissions

Some permissions imply other permissions; for example, the queue plans permission also includes all of the abilities of the read runs permission.

If documentation or UI text states that an action requires a specific permission, that action is also available for any permission that implies that permission. For example,

### All Workspace Permissions

[All Workspace Permissions]: #all-workspace-permissions

The following workspace permissions can be granted to teams, on a per-workspace basis. Throughout the Terraform Cloud documentation, these permissions are referenced by name.

Most of these permissions can be granted via either fixed permission sets or custom workspace permissions, but some of them are only available to workspace admins.

- **Runs:**
    - **Read runs:** — Allows users to view information about remote Terraform runs, including the run history, the status of runs, the log output of each stage of a run (plan, apply, cost estimation, policy check), and configuration versions associated with a run.
    - **Queue plans:** — _Implies the read runs permission._ Allows users to queue Terraform plans in a workspace, including both speculative plans and normal plans. Normal plans must be approved by a user with the apply runs permission.
    - **Apply runs:** — _Implies the queue plans permission._ Allows users to approve and apply Terraform plans, causing changes to real infrastructure.
- **Lock and unlock workspace:** — Allows users to manually lock the workspace to temporarily prevent runs. When a workspace's execution mode is set to "local", this permission is required for performing local CLI runs using this workspace's state.
- **Download Sentinel mocks:** — Allows users to download data from runs in the workspace in a format that can be used for developing Sentinel policies. This run data is very detailed, and often contains unredacted sensitive information.
- **Variables:**
    - **Read variables:** — Allows users to view the values of Terraform variables and environment variables for the workspace. Note that variables marked as sensitive are write-only, and can't be viewed by any user.
    - **Read and write variables:** — _Implies the read variables permission._ Allows users to edit the values of variables in the workspace.
- **State versions:**
    - **Read state outputs:** — Allows users to access values in the workspace's most recent Terraform state that have been explicitly marked as public outputs. Output values are often used as an interface between separate workspaces that manage loosely coupled collections of infrastructure, so their contents can be relevant to people who have no direct responsibility for the managed infrastructure but still indirectly use some of its functions. This permission is required for performing local Terraform runs that access a Terraform Cloud workspace's outputs via a remote state data source.
    - **Read state versions:** — _Implies the read state outputs permission._ Allows users to read complete state files from the workspace. State files are useful for identifying infrastructure changes over time, but often contain sensitive information.
    - **Read and write state versions:** — _Implies the read state versions permission._ Allows users to directly create new state versions in the workspace. Applying a remote Terraform run will create new state versions without this permission, but if the workspace's execution mode is set to "local", this permission is required for performing local runs. This permission is also required for using any of Terraform CLI's state manipulation and maintenance commands against this workspace, including `terraform import`, `terraform taint`, and the various `terraform state` subcommands.
- **Read and write workspace settings:** — Only available to workspace admins.
- **Set or remove workspace permissions:** — Only available to workspace admins.
- **Delete workspace:** — Only available to workspace admins.


### Workspace Admins

Much like the owners team has full control over an organization, each workspace has a special "admin" permissions level that grants full control over the workspace. Members of a team with admin permissions on a workspace are sometimes called "workspace admins" for that workspace.

Admin permissions include the highest level of normal permissions for the workspace. There are also some permissions that are only available to workspace admins, which generally involve changing the workspace's settings or setting access levels for other teams.

Workspace admins have the following permissions on their workspace:

- Apply runs
- Lock and unlock workspace
- Download Sentinel mocks
- Read and write variables
- Read and write state versions
- Read and write workspace settings (workspace admins only)
- Set or remove workspace permissions for any team (workspace admins only)
- Delete workspace (workspace admins only)

See [All Workspace Permissions][] above for details about specific permissions.

### Fixed Permission Sets

Fixed permission sets are bundles of specific permissions on a workspace, designed for the most common patterns of delegated access.

Each of these groups of permissions is designed around a target level of authority and responsibility for a given workspace's infrastructure. They aren't strictly task-based, and can sometimes grant permissions that their recipients do not need, but they try to strike a balance of simplicity and utility.

#### Read

The "read" permission set is for people who need to view information about the status and configuration of managed infrastructure in order to do their jobs, but who aren't responsible for maintaining that infrastructure. Read access grants the following workspace permissions:

- Read runs
- Read variables
- Read state versions

See [All Workspace Permissions][] above for details about specific permissions.

#### Plan

The "plan" permission set is for people who contribute to maintaining managed infrastructure, but are not ultimately responsible for it. Plan access grants the following workspace permissions:

- Queue plans
- Read variables
- Read state versions

See [All Workspace Permissions][] above for details about specific permissions.

#### Write

The "write" permission set is for people who do most of the day-to-day work of provisioning and modifying managed infrastructure. Write access grants the following workspace permissions:

- Apply runs
- Lock and unlock workspace
- Download Sentinel mocks
- Read and write variables
- Read and write state versions

See [All Workspace Permissions][] above for details about specific permissions.

### Custom Workspace Permissions

-> **Beta:** Custom permissions are currently in beta. The interface for assigning permissions and the specific permissions available for assignment might change at any time as we refine the feature.

Custom permissions let you assign specific, granular permissions to a team, without also assigning unrelated permissions. This enables more task-focused permission sets and tighter control of sensitive information, at the cost of increased complexity.

You can use custom permissions to assign any of the permissions listed above under [All Workspace Permissions](#all-workspace-permissions), with the exception of admin-only permissions.

The minimum custom permissions set for a workspace is the read runs permission; the only way to grant a team lower access is to not add them to the workspace at all.

For categories of permissions that function as ascending access levels (like runs permissions), you can assign one permission per category, since higher permissions include all of the capabilities of the lower ones.

## Organization Permissions

Separate from workspace permissions, teams can be granted permissions to manage certain resources or settings across an organization. The following organization permissions are available:

### Manage Policies

Allows members to create, edit, and delete the organization's Sentinel policies and override soft-mandatory policy checks. Note that this setting implicitly gives read access to all workspaces to set enforcement of [policy sets](../sentinel/manage-policies.html).

### Manage Workspaces

Allows members to create and administrate all workspaces within the organization. This grants the following abilities:

- Admin access to all workspaces. Any action that requires admin access is also available to teams with the manage workspaces permission.
- The ability to create new workspaces (otherwise only available to organization owners).

### Manage VCS Settings

Allows members to manage VCS providers and SSH keys in the organization's settings.
