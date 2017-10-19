---
page_title: "Part 3.3: From Infrastructure as Code to Collaborative Infrastructure as Code - Terraform Recommended Practices"
layout: "guides"
sidebar_current: "recommended-practices-3-3"
---

# Part 3.3: How to Move from Infrastructure as Code to Collaborative Infrastructure as Code

Using version-controlled Terraform configurations to manage key infrastructure eliminates a great deal of technical complexity and inconsistency. Now that you have the basics under control, you’re ready to focus on other problems.

Your next goals are to:

* Adopt consistent workflows for Terraform usage across teams
* Expand the benefits of Terraform beyond the core of engineers who directly edit Terraform code.
* Manage infrastructure provisioning permissions for users and teams.

[Terraform Enterprise (TFE)](https://www.hashicorp.com/products/terraform/) is the product we’ve built to help you address these next-level problems. The following section describes how to start using it most effectively.

Note: If you aren’t already using mature Terraform code to manage a significant portion of your infrastructure, make sure you follow the steps in the previous section first.

## 1. Install or Sign Up for TFE

You have two options for installing Terraform Enterprise: SaaS or private install. If you have chosen the SaaS version then you can skip this step; otherwise visit the [installation guide](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/INSTALLING.md) to get started. Terraform will display the URL to your TFE servers as an output.

## 2. Learn TFE's Run Environment

Get familiar with how Terraform runs work in TFE. With Terraform OSS, you generally use external VCS tools to get code onto the filesystem, then execute runs from the command line or from a general purpose CI system.

TFE does things differently: a workspace is associated directly with a VCS repo, and you use TFE’s UI or API to start and monitor runs. To get familiar with this operating model:

* Read the documentation on how to [perform and configureTerraform runs](https://www.terraform.io/docs/enterprise-beta/getting-started/runs.html) in Terraform Enterprise.
* Create a proof-of-concept workspace, associate it with Terraform code in a VCS repo, set variables as needed, and use Terraform Enterprise to perform some Terraform runs with that code.

## 3. Design Your Organization’s Workspace Structure

In TFE, each Terraform configuration should manage a speciic infrastructure component, and each environment of a given configuration should be a separate workspace — in other words, Terraform configurations * environments = workspaces. A workspace name should be something like “networking-dev,” so you can tell at a glance which infrastructure and environment it manages.

The definition of an “infrastructure component” depends on your organization’s structure. A given workspace might manage an application, a service, or a group of related services; it might provision infrastructure used by a single engineering team, or it might provision shared, foundational infrastructure used by the entire business.

You should structure your workspaces to match the divisions of responsibility in your infrastructure. You will probably end up with a mixture: some components, like networking, are foundational infrastructure controlled by central IT staff; others are application-specific and should be controlled by the engineering teams that rely on them.

Also, keep in mind:

* Some workspaces publish output data to be used by other workspaces.
* The workspaces that make up a configuration’s environments (app1-dev, app1-stage, app1-prod) should be run in order, to ensure code is properly verified.

The first relationship, a relationship between workspaces for different components but the same environment, creates a graph of dependencies between workspaces, and you should stay aware of it. The second relationship, a relationship between workspaces for the same component but different environments, creates a pipeline between workspaces. TFE doesn’t currently have the ability to act on these dependencies, but features like cascading updates and promotion are coming soon, and you’ll be able to use them more easily if you already understand how your workspaces relate.

## 4. Create Workspaces

Create workspaces in TFE, and map VCS repositories to them. Each workspace reads its Terraform code from your version control system. You’ll need to assign a repository and branch to each workspace.

We recommend using the same repository and branch for every environment of a given app or service — write your Terraform code such that you can differentiate the environments via variables, and set those variables appropriately per workspace. This might not be practical for your existing code yet, in which case you can use different branches per workspace and handle promotion through your merge strategy, but we believe a model of one canonical branch works best.

![Changes in VCS branches can be merged to master and then promoted between workspaces representing a staging environment, a UAT environment, and finally a production environment.](./images/image1.png)

## 5. Create Users and Teams

Your colleagues must create their own TFE user accounts and ask to join your organization, and you can then add them to the appropriate teams.

TFE’s teams are lists of users that can be granted per-workspace permissions, which means your TFE teams should match your understanding of who's responsible for which infrastructure. That isn't always an exact match for your org chart, so make sure you spend some time thinking about this and talking to people across the organization. Keep in mind:

* Some teams need to administer many workspaces, and others only need permissions on one or two.
* A team might not have the same permissions on every workspace they use; for example, application developers might have read/write access to their app’s dev and stage environments, but read-only access to prod.

Managing an accurate and complete map of how responsibilities are delegated is one of the most difficult parts of practicing collaborative infrastructure as code.

## 6. Assign Permissions

Assign workspace ownership and permissions to teams. Each workspace has three levels of permissions you can grant to any user or team: admin, read/write, and read-only. Admins effectively own the workspace, and can change the permissions of other users on it.

Most workspaces will give access to multiple teams with different permissions.

Workspace       | Team Permissions
----------------|-----------------
app1-dev        | Team-eng-app1: Read/write  <br> Team-owners-app1: Admin  <br> Team-central-IT: Admin
app1-prod       | Team-eng-app1: Read-only  <br> Team-owners-app1: Read/write  <br> Team-central-IT: Admin
networking-dev  | Team-eng-networking: Read/write  <br> Team-owners-networking: Admin  <br> Team-central-IT: Admin
networking-prod | Team-eng-networking: Read-only  <br> Team-owners-networking: Read/write  <br> Team-central-IT: Admin

## 7. Restrict Non-Terraform Access

Restrict access to cloud provider UIs and APIs. Since Terraform Enterprise is now your organization’s primary interface for infrastructure provisioning, you should restrict access to any alternate interface that bypasses TFE. For almost all users, it should be impossible to manually modify infrastructure without using the organization’s agreed-upon Terraform workflow.

As long as no one can bypass Terraform, your code review processes and your TFE workspace permissions are the definitive record of who can modify which infrastructure. This makes everything about your infrastructure more knowable and controllable. Terraform Enterprise is one workflow to learn, one workflow to secure, and one workflow to audit for provisioning any infrastructure in your organization.

## Next

At this point, you have successfully adopted a collaborative infrastructure as code workflow with Terraform Enterprise. You can provision infrastructure across multiple providers using a single workflow, and you have a shared interface that helps manage your organization’s standards around access control and code promotion.

Next, you can make additional improvements to your workflows and practices. Continue on to [Part 3.4: Advanced Improvements to Collaborative Infrastructure as Code](./part3.4.html).
