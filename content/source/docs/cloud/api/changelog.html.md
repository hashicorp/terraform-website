---
page_title: "API Changelog - API Docs - Terraform Cloud and Terraform Enterprise"
layout: "cloud"
page_id: "api-changelog"
---

[breaking]: ./api/changelog/breaking.png "Breaking"
[cloud]: ./api/changelog/cloud.png "Cloud"
[enterprise]: ./api/changelog/enterprise.png "Enterprise"

# API Changelog

Keep track of changes to the API for Terraform Cloud and Terraform Enterprise.

### 2021-05-27

* ![cloud][] [Agents](https://www.terraform.io/docs/cloud/api/agents.html): added [delete endpoint](https://www.terraform.io/docs/cloud/api/agents.html#delete-an-agent).

### 2021-05-19

* [Runs](https://www.terraform.io/docs/cloud/api/runs.html): added `refresh`, `refresh-only`, and `replace-addrs` attributes.

### 2021-04-16

* Introduced [Controlled Remote State Access](https://www.hashicorp.com/blog/announcing-controlled-remote-state-access-for-terraform-cloud-and-enterprise).
    * [Admin Settings](https://www.terraform.io/docs/cloud/api/admin/settings.html): added `default-remote-state-access` attribute.
    * [Workspaces](https://www.terraform.io/docs/cloud/api/workspaces.html): added `global-remote-state` attribute.
    * [Workspaces](https://www.terraform.io/docs/cloud/api/workspaces.html): added [Remote State Consumers](https://www.terraform.io/docs/cloud/api/workspaces.html#get-remote-state-consumers) relationship.

### 2021-04-13

* [Teams](https://www.terraform.io/docs/cloud/api/teams.html): added `manage-policy-overrides` property to the `organization-access` attribute.

### 2021-03-23

* ![enterprise][] Introduced [Share Modules Across Organizations with Terraform Enterprise](https://www.hashicorp.com/blog/share-modules-across-organizations-terraform-enterprise).
  * [Admin Modules Sharing](https://www.terraform.io/docs/cloud/api/admin/module-sharing.html): ....
  * [Admin Organizations](https://www.terraform.io/docs/cloud/api/admin/organizations.html): ....
  * [Organizations](https://www.terraform.io/docs/cloud/api/organizations.html): ....

### 2021-03-18

* ![cloud][] Introduced [New Workspace Overview for Terraform Cloud](https://www.hashicorp.com/blog/new-workspace-overview-for-terraform-cloud).
  * [Workspaces](https://www.terraform.io/docs/cloud/api/workspaces.html): added `resource-count` and `updated-at` attributes.
  * [Workspaces](https://www.terraform.io/docs/cloud/api/workspaces.html): added [performance attributes](https://www.terraform.io/docs/cloud/api/workspaces.html#workspace-performance-attributes) (`apply-duration-average`, `plan-duration-average`, `policy-check-failures`, `run-failures`, `workspaces-kpis-run-count`).
  * [Workspaces](https://www.terraform.io/docs/cloud/api/workspaces.html): added `readme` and `outputs` [related resources](https://www.terraform.io/docs/cloud/api/workspaces.html#available-related-resources).
  * [Team Access](https://www.terraform.io/docs/cloud/api/team-access.html): updated to support pagination.

### 2021-03-11

* Added [VCS Events](https://www.terraform.io/docs/cloud/api/vcs-events.html), limited to GitLab.com connections.
