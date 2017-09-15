---
layout: "enterprise2"
page_title: "Naming - Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces-naming"
---

# Workspace Naming

Workspace naming strategy is important as it is the structure for organizing
workspaces at scale. Since workspace names must be unique, the recommended
approach for naming uses workspace attributes. An attribute is a defining
characteristic of a workspace — such as the component being managed, the
environment it runs it, and the region it is provisioned into.

For example, if workspaces have attributes for environment, component, and
region, each of those attributes should be reflected in the workspace name:

- networking-prod-us-east
- networking-staging-us-east
- networking-prod-us-eu-central
- networking-staging-eu-central
- monitoring-prod-us-east
- monitoring-staging-us-east
- monitoring-prod-us-eu-central
- monitoring-staging-eu-central

This should ensure that the workspace name is both unique and informative. If
for some reason including all the attributes in the name does not create a
unique name, it is recommended to add an additional attribute. Other common
attributes are provider (AWS, GCP, Azure), datacenter, and line of business.
