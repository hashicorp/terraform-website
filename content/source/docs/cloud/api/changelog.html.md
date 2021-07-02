---
page_title: "API Changelog - API Docs - Terraform Cloud and Terraform Enterprise"
layout: "cloud"
page_id: "api-changelog"
---

[breaking]: /assets/images/api/changelog/breaking.png "Breaking"
[cloud]: /assets/images/api/changelog/cloud.png "Cloud"
[deprecation]: /assets/images/api/changelog/deprecation.png "Deprecation"
[enterprise]: /assets/images/api/changelog/enterprise.png "Enterprise"

# API Changelog

Keep track of changes to the API for Terraform Cloud and Terraform Enterprise.

### 2021-07-09

* [State versions](./state-versions.html): Fixed the ID format for the workspace relationship of a state version. Previously, the reported ID was unusable due to a bug.
* [Workspaces](./workspaces.html): Added `locked_by` as an includable related resource.

### 2021-06-8

* Updated [Registry Module APIs](./modules.html).
    * added `registry_name` scoped APIs.
    * added `organization_name` scoped APIs.
    * added [Module List API](./modules.html#list-registry-modules-for-an-organization).
    * updated [Module Delete APIs](./modules.html#delete-a-module).
    * ![cloud][] added public registry module related APIs.
* ![deprecation] [] The following [Registry Module APIs](./modules.html) have been replaced with newer apis and will be removed in the future.
    * The following endpoints to delete modules are replaced with [Module Delete APIs](./modules.html#delete-a-module)
        * `POST /registry-modules/actions/delete/:organization_name/:name/:provider/:version`
        * `POST /registry-modules/actions/delete/:organization_name/:name/:provider`
        * `POST /registry-modules/actions/delete/:organization_name/:name`
    * `POST /registry-modules` replaced with [Updated POST Endpoint](./modules.html#publish-a-private-module-from-a-vcs)
    * `POST /registry-modules/:organization_name/:name/:provider/versions` replaced with new [endpoint](./modules.html#create-a-module-version)
    * `GET /registry-modules/show/:organization_name/:name/:provider` replaced with new [GET Endpoint](./modules.html#get-a-module)

### 2021-05-27

* ![cloud][] [Agents](./agents.html): added [delete endpoint](./agents.html#delete-an-agent).

### 2021-05-19

* [Runs](./run.html): added `refresh`, `refresh-only`, and `replace-addrs` attributes.

### 2021-04-16

* Introduced [Controlled Remote State Access](https://www.hashicorp.com/blog/announcing-controlled-remote-state-access-for-terraform-cloud-and-enterprise).
    * [Admin Settings](./admin/settings.html): added `default-remote-state-access` attribute.
    * [Workspaces](./workspaces.html):
        * added `global-remote-state` attribute.
        * added [Remote State Consumers](./workspaces.html#get-remote-state-consumers) relationship.

### 2021-04-13

* [Teams](./teams.html): added `manage-policy-overrides` property to the `organization-access` attribute.

### 2021-03-23

* ![enterprise][] `v202103-1` Introduced [Share Modules Across Organizations with Terraform Enterprise](https://www.hashicorp.com/blog/share-modules-across-organizations-terraform-enterprise).
    * [Admin Organizations](./admin/organizations.html):
        * added new query parameters to [List all Organizations endpoint](./admin/organizations.html#query-parameters)
        * added module-consumers link in `relationships` response
        * added [update module consumers endpoint](./admin/organizations.html#update-an-organization-39-s-module-consumers)
        * added [list module consumers endpoint](./admin/organizations.html#list-module-consumers-for-an-organization)
    * [Organizations](./organizations.html): added [Module Producers](./organizations.html#show-module-producers)
    * ![deprecation][] [Admin Module Sharing](./admin/module-sharing.html): is replaced with a new JSON::Api compliant [endpoint](./admin/organizations.html#update-an-organization-39-s-module-consumers)

### 2021-03-18

* ![cloud][] Introduced [New Workspace Overview for Terraform Cloud](https://www.hashicorp.com/blog/new-workspace-overview-for-terraform-cloud).
    * [Workspaces](./workspaces.html):
        * added `resource-count` and `updated-at` attributes.
        * added [performance attributes](./workspaces.html#workspace-performance-attributes) (`apply-duration-average`, `plan-duration-average`, `policy-check-failures`, `run-failures`, `workspaces-kpis-run-count`).
        * added `readme` and `outputs` [related resources](./workspaces.html#available-related-resources).
    * [Team Access](./team-access.html): updated to support pagination.

### 2021-03-11

* Added [VCS Events](./vcs-events.html), limited to GitLab.com connections.

### 2021-03-08

* [Workspaces](./workspaces.html): added `current_configuration_version` and `current_configuration_version.ingress_attributes` as includable related resources.
