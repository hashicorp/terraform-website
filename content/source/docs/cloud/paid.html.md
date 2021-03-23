---
layout: "cloud"
page_title: "Free and Paid Plans - Terraform Cloud and Terraform Enterprise"
---

[owners]: ./users-teams-organizations/teams.html#the-owners-team

# Free and Paid Plans

Terraform Cloud is a commercial SaaS product developed by HashiCorp. Many of its features are free for small teams, including remote state storage, remote runs, and VCS connections. We also offer paid plans for larger teams that include additional collaboration and governance features.

## Plans and Billing are Per-Organization

Terraform Cloud manages plans and billing at the organization level.

Each Terraform Cloud user can belong to multiple organizations, which might subscribe to different billing plans. The set of features available at any given time depends on which organization you are currently working in.

For more information about the differences between user accounts and organizations, see [Users, Teams, and Organizations](./users-teams-organizations/index.html).

## Free Organizations

Small teams can use most of Terraform Cloud's features for free, including remote Terraform execution, VCS integration, the private module registry, and more.

Free organizations are limited to five active members.

## Paid Features

Some of Terraform Cloud's features are limited to particular paid upgrade plans. In the documentation, pages that document a paid feature are marked with callout boxes, like the one below:

-> **Note:** Sentinel policies are a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing).

Each higher paid upgrade plan is a strict superset of any lower plans — for example, the "Team & Governance" plan includes all of the features of the "Team" plan. Paid feature callouts in the documentation indicate the _lowest_ tier at which the feature is available, but any higher plans also include that feature.

Terraform Enterprise generally includes all of Terraform Cloud's paid features, plus additional features geared toward large enterprises. However, some features are implemented differently due to the differences between self-hosted and SaaS environments, and some features might be absent due to being impractical or irrelevant in the types of organizations that need Terraform Enterprise. Cloud-only or Enterprise-only features are clearly indicated in documentation.

## Changing Your Payment Plan

The [owners][] of an organization can manage its billing plan in the "Plan & Billing" section of the organization settings. To view the current organization's settings, use the "Settings" link in the top navigation bar.

The plan and billing settings include an integrated storefront, and you can subscribe to paid plans with a credit card.

## Available Plans

For up-to-date information about the currently available billing plans, as well as details about each plan's features, see [the Terraform pricing page on HashiCorp.com](https://www.hashicorp.com/products/terraform/pricing) or the purchase interface in your plan and billing settings.
