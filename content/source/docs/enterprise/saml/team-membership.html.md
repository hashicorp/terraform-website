---
layout: enterprise2
page_title: "SAML Team Membership - Terraform Enterprise"
sidebar_current: "docs-enterprise2-saml-team-membership"
---

# Team Membership

Terraform Enterprise can automatically add users to a team if the assertions identified in the Team Attribute Name match existing teams. This feature must be enabled and an assertion identifier must be specified in the [Team Attribute Name](./configuration.html) setting.

Users will automatically be added to teams identified in the [Team Attribute Name](./configuration.html). The team must exist first in order for the user to be added to that team. If a team is removed from the Team Attribute Name in that user's SAML assertion, that user will automatically be removed from that team.

## Special Case for the Owners Team

Unlike the other teams in an organization, the role name for the owners team must be explicitely set. Without the mapping, users will not be added as organization owners.

## Site admins

Site admins may log in to Terraform Enterprise directly. If they are disabled on the identity provider but still enabled in Terraform Enterprise and bypass SSO, they will be able to log in.
