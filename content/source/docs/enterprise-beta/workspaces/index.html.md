---
layout: "enterprise2"
page_title: "Workspaces - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-workspaces"
---

# Workspaces

Workspaces are the unit of organization in Terraform Enterprise. A workspace
encapsulates a Terraform configuration, Terraform state, variables, and run
history.

It is recommended that organizations break down large monolithic environments
into smaller workspaces, then delegate and access control those workspaces. For
example, a "Production" environment could be split into "networking-prod",
"app1-prod", "monitoring-prod" workspaces, each with separate teams managing
them. This is similar to the structure of splitting monolithic applications
into smaller microservices, which enables teams to make changes in parallel.
