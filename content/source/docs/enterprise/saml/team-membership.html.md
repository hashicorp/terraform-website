---
layout: enterprise2
page_title: "SAML Team Membership - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-saml-team-membership"
---

# Team Membership

Terraform Enterprise supports the ability to automatically add users to a team if the assertions identified in the Group Membership List match existing teams. This feature must be enabled and an assertion identifier must be specified in the [Group Membership List](./configuration.html) setting.

Users will automatically be added to teams identified in the [Group Membership List](./configuration.html). The team must exist first in order for the user to be added to that team. If a team is removed from the Group Membership List in that user's SAML assertion, that user will automatically be removed from that team.
