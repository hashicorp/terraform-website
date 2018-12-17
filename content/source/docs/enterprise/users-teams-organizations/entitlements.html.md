---
layout: enterprise2
page_title: "entitlements - Terraform Enterprise"
sidebar_current: "docs-enterprise2-users-teams-organizations-entitlements"
---

# Entitlements

Organizations have access to a set of features within TFE, called **entitlements**, based on their enterprise plan. An organization's entitlements are available with the [entitlement-set API endpoint].

## State Storage

This entitlement indicates whether or not an organization can store [state versions] in TFE for their workspaces.

## Operations

This entitlement indicates whether or not an organization can use remote operations. This includes the ability to create and manipulate [runs] within TFE.

## VCS Integrations

This entitlement indicates whether or not an organization can use [vcs integrations] for their workspaces.

## Sentinel

This entitlement indicates whether or not an organization has access to [Sentinel].

## Private Module Registry

This entitlement indicates whether or not an organization has access to the [private module registry].

## Teams

This entitlement indicates whether or not an organization can create [teams](./teams.html) (other than the owners team), manage access to workspaces for those teams, and manage membership of those [teams](./teams.html) (except the owners team).

[entitlement-set API endpoint]: ../api/organizations.html#show-the-entitlement-set
[state versions]: ../api/state-versions.html
[runs]: ../run/index.html
[vcs integrations]: ../vcs/index.html
[Sentinel]: ../sentinel/index.html
[private module registry]: ../registry/index.html
