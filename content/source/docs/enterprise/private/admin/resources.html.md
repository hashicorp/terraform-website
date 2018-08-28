---
layout: "enterprise2"
page_title: "Accounts and Resources - Admin - Private Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-admin-resources"
---

# Administration: Managing Accounts and Resources

Site administrators have access to all organizations, users, runs, and workspaces. This visibility is intended to provide access to management actions such as adding administrators, updating Terraform versions or adding custom Terraform bundles, suspending or deleting users, and creating or deleting organizations. It also allows for "impersonation" to aid in assisting regular users with issues in Terraform Enterprise.

## Viewing, Searching, and Filtering Lists

Each type of account or resource is initally presented as a searchable list, accessed by clicking the name of the resource on the left. In addition to searching or filtering (typically by email, name, or other relevant attribute), there are pre-existing filters to show useful sets, such as site administrators (users) or "Needs Attention" (workspaces, runs).

## Managing Users

To access the list of all users in the Terraform Enterprise instance, click **Users** in the left menu.

![screenshot: the Users admin page](./images/admin-users.png)

Selecting a user from the list shows their detail page, which includes their status and any organizations they belong to. The detail page offers four actions: promoting to administrator, suspending, deleting, and impersonating.

![screenshot: a user detail admin page](./images/admin-user-details.png)

### Promoting a User to Administrator

This adds the user to the list of site administrators, which grants them access to this administrative area. Because admins have a very wide purview, if SMTP is configured, it will also send an email to the other site administrators notifying them that a user was added.

To promote a user, click **Promote to admin** at the top right of the user detail page.

### Suspending or Deleting a User

Suspending a user retains their account, but does not allow them to access any Terraform Enterprise resources. Deleting a user removes their account completely; they would have to create a new account in order to log in again.

Suspended users can be unsuspended at any time. Deleted users cannot be recovered.

To suspend a user, click **Suspend user** at the upper right. To delete them, click **Delete User** in the "Delete User" section.

### Impersonating a User

User impersonation allows Terraform Enterprise admins to access organization and workspace data and view runs. As an administrator, direct access to these resources only supports urgent interventions like deletion or force-canceling; to view and interact with resources, impersonation is required.

When impersonating a user, a reason is required and will be logged to the audit log. Any actions taken while impersonating will record both the impersonating admin and the impersonated user as the actor.

Impersonation can be performed from multiple places:

- From a user details admin page, by clicking the **Impersonate** button on the far right.
- From an organization, workspace, or run details admin page, all of which include a drop-down list of organization owners to impersonate.
- When a site admin encounters a 404 error for a resource that they do not have standard user access to.

![screenshot: the impersonation button on a 404 page, as viewed by an admin](./images/admin-404-impersonate.png)

## Managing Organizations

If your institution uses multiple organizations in Terraform Enterprise, you can view the details of each organization by clicking it in the admin list of organizations. From the details page, you can impersonate an owner or delete an organization (using the red **Delete this organization** button at the bottom of the details page).

Typically, in private installations, all organizations will be granted "Premium" plan status for the purpose of providing access to all available features. However, it's also possible to set other statuses. An organization whose trial period is expired will be unable to make use of features in Terraform Enterprise.

![screenshot: an organization details admin page](./images/admin-organization-details.png)

## Managing Workspaces and Runs

The administrative view of workspaces and runs provides limited detail (name, status, and IDs) to avoid exposing sensitive data when it isn't needed. Site administrators can view and investigate workspaces and runs more deeply by impersonating a user with full access to the desired resource. (See [Impersonating a User](#impersonating-a-user) above.)

### Deleting Workspaces

A workspace can be administratively deleted, using the **Delete this Workspace** button at the bottom of its details page, if it should not have been created, or is presenting issues for the application.

### Force-Canceling Runs

A run can be administratively force-canceled if it becomes stuck or is presenting issues to the application. Runs can be force-canceled from the run list or the run details page. The run details page also offers the option to impersonate an organization owner for additional details on the run.

We recommend impersonating a user (if necessary) to view run details prior to force-canceling a run, to ensure that graceful cancellation was attempted, and that the run is no longer progressing.

### Migration of Workspace History from Legacy Environments

The Migrations section, accessed by clicking **Migrations** on the left, shows the progress of migrating history from legacy Terraform Enterprise environments to Terraform Enterprise workspaces. While all workspaces are listed in this area, history migration is only relevant for those workspaces created by [setting up migration from older environments](../../upgrade/index.html).

During the initial setup, current data is migrated, and history data is migrated in the background, with the progress being visible in this admin area. This process is intended to have minimal impact on the running system, so if a large number of workspaces have been migrated, it may take some time before they're all complete.

![screenshot: the migrations admin page](./images/admin-migrations.png)

-> **Note:** Workspaces that weren't created by migrating a legacy environment have an empty "migration status" field on this page.

If history migration initially fails, the migration will be retried periodically. If you see a migration that continually errors, [contact HashiCorp Support](../faq.html#support-for-private-terraform-enterprise).

A future version of Terraform Enterprise will remove Legacy environment data and code completely. Be sure to review release notes and wait to upgrade to that version until migration of desired data is complete.

## Managing Terraform Versions

Private Terraform Enterprise ships with a default list of Terraform versions. However, the addition of new versions after installation is the responsibility of site administrators.

![screenshot: the Terraform Versions admin page](./images/admin-versions.png)

To add a new version of Terraform, click **Terraform Versions** in the left menu and **Add Terraform Version** in the upper right, then provide the version number, Linux 64-bit download URL, and SHA256 checksum of the binary. Set the status to Beta to make the version available to site administrators, or Enabled to add it for everyone.

![screenshot: the Add Terraform Version page](./images/admin-version-add.png)

The versions you add may be recent standard Terraform releases from HashiCorp, or custom Terraform versions. One common use for custom versions is to add a Terraform bundle that includes [pre-installed providers](../../run/index.html#custom-and-community-providers) commonly needed by the instance.

Versions of Terraform can also be modified by clicking them in the list. They can be set to disabled (unavailable for use) if no workspaces are currently using them. The list indicates how many workspaces are currently using a given version.
