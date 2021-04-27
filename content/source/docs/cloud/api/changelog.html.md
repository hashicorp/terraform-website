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

### 2021-01-21

* ![cloud] A new Invoices API is available.
* The terraform-version attribute in the Workspaces API is now deprecated. Please use terraform-requirement instead.
* ![enterprise] A new Module Sharing API is available for sharing Terraform modules across organizations.
* ![breaking] The X API will no longer return Y. To do Z, use this workaround. This is a breaking change necessary for the security of the platform, covered in our API stability policy.
