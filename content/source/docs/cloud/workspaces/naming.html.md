---
layout: "cloud"
page_title: "Naming - Workspaces - Terraform Cloud"
---

# Workspace Naming

Terraform Enterprise organizes workspaces by name, so it's important to use a consistent and informative naming strategy. And although future releases of TFE will add more organizational tools, the name will always be the most important piece of information about a workspace.

Note that workspace names can only include letters, numbers, -, and _.

The best way to make names that are both unique and useful is to combine the workspace's most distinguishing _attributes_ in a consistent order. Attributes can be any defining
characteristic of a workspace — such as the component being managed, the
environment it runs in, and the region it is provisioned into.

A good strategy to start with is `<COMPONENT>-<ENVIRONMENT>-<REGION>`. For example:

- networking-prod-us-east
- networking-staging-us-east
- networking-prod-us-eu-central
- networking-staging-eu-central
- monitoring-prod-us-east
- monitoring-staging-us-east
- monitoring-prod-us-eu-central
- monitoring-staging-eu-central

If those three attributes can't uniquely distinguish all of your workspaces, you might need to add another attribute; for example, the infrastructure provider (AWS, GCP, Azure), datacenter, or line of business.
