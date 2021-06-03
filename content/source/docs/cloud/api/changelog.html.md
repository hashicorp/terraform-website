---
page_title: "API changelog - API Docs - Terraform Cloud and Terraform Enterprise"
layout: "cloud"
page_id: "api-changelog"
---

[breaking]: ./api/changelog/breaking.png "Breaking"
[cloud]: ./api/changelog/cloud.png "Cloud"
[enterprise]: ./api/changelog/enterprise.png "Enterprise"

# API Changelog

Keep track of changes to the Terraform Cloud and Terraform Enterprise APIs.

### 2021-05-27

* Added the [delete endpoint](https://www.terraform.io/docs/cloud/api/agents.html#delete-an-agent) to the [Agents API](https://www.terraform.io/docs/cloud/api/agents.html).

### 2021-05-19

* Added the `refresh`, `refresh-only`, and `replace-addrs` attributes to the [Runs API](https://www.terraform.io/docs/cloud/api/runs.html).

### 2021-04-16

* Introduced [Controlled Remote State Access](https://www.hashicorp.com/blog/announcing-controlled-remote-state-access-for-terraform-cloud-and-enterprise).
    * [Admin Settings API](https://www.terraform.io/docs/cloud/api/admin/settings.html): added `default-remote-state-access` attribute.
    * [Workspaces API](https://www.terraform.io/docs/cloud/api/workspaces.html): added `global-remote-state` attribute.
    * Added [Remote State Consumers](https://www.terraform.io/docs/cloud/api/workspaces.html#get-remote-state-consumers) relationship for workspaces.

### 2021-04-13

* Added a `manage-policy-overrides` property to the `organization-access` attribute in the [Teams API](https://www.terraform.io/docs/cloud/api/teams.html).

### 2021-03-23

* ![enterprise][] Introduce [Share Modules Across Organizations with Terraform Enterprise](https://www.hashicorp.com/blog/share-modules-across-organizations-terraform-enterprise).
  * Updated [Admin Modules Sharing API](https://www.terraform.io/docs/cloud/api/admin/module-sharing.html).
  * Updated [Admin Organizations API](https://www.terraform.io/docs/cloud/api/admin/organizations.html).
  * Updated [Organizations API](https://www.terraform.io/docs/cloud/api/organizations.html).

### 2021-03-18

* ![cloud][] Introduce [New Workspace Overview for Terraform Cloud](https://www.hashicorp.com/blog/new-workspace-overview-for-terraform-cloud).
  * Added the `resource-count` and `updated-at` attributes to the [Workspaces API](https://www.terraform.io/docs/cloud/api/workspaces.html).
  * Added the [performance attributes](https://www.terraform.io/docs/cloud/api/workspaces.html#workspace-performance-attributes) (`apply-duration-average`, `plan-duration-average`, `policy-check-failures`, `run-failures`, `workspaces-kpis-run-count`) to the [Workspaces API](https://www.terraform.io/docs/cloud/api/workspaces.html).
  * Added `readme` and `outputs` as [related resources](https://www.terraform.io/docs/cloud/api/workspaces.html#available-related-resources) to the [Workspaces API](https://www.terraform.io/docs/cloud/api/workspaces.html).
  * Updated the [Team Access API](https://www.terraform.io/docs/cloud/api/team-access.html) to support pagination.

### 2021-03-11

* Added the [VCS Events API](https://www.terraform.io/docs/cloud/api/vcs-events.html).
