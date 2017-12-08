---
layout: "enterprise2"
page_title: "Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces"
---

# Workspaces

Workspaces are the unit of organization in Terraform Enterprise. A workspace
encapsulates a Terraform configuration, Terraform state, variables, and run
history.

We recommend that organizations break down large monolithic environments
into smaller workspaces, then delegate permissions and responsibilities for those workspaces. For
example, a "Production" environment could be split into "networking-prod",
"app1-prod", "monitoring-prod" workspaces, each with separate teams managing
each. Much like splitting monolithic applications
into smaller microservices, this enables teams to make changes in parallel.
