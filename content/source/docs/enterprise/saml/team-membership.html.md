---
layout: enterprise2
page_title: "SAML Team Membership - Terraform Enterprise"
sidebar_current: "docs-enterprise2-saml-team-membership"
---

# Team Membership

Terraform Enterprise (TFE) can automatically add users to teams based on their SAML assertion, so you can manage team membership in your directory service.

## Enabling and Disabling Team Membership Management

To manage team membership via SAML, specify the name of a SAML attribute in the [Team Attribute Name](./configuration.html) setting, and ensure that the value of that atribute in the SAML assertion is a comma-separated list of team names.

Once automatic team membership is enabled, users logging in via SAML are automatically added to the teams included in their assertion, and automatically removed from any teams that _aren't_ included in their assertion. Note that this overrides any manually set team memberships; whenever the user logs in, their team membership is adjusted to match their SAML assertion.

Any team names that don't match existing teams are ignored; TFE will not automatically create new teams.

To disable automatic team membership, set the Team Attribute Name setting to a SAML attribute that isn't present in user assertions. If the specified attribute is absent, TFE won't automatically manage team membership on login, and you can manually add users to teams via the organization settings page.

## Team Names

TFE expects the team names in the team membership SAML attribute to exactly match TFE's own team names. You cannot specify aliases for teams.

The one exception is the owners team. By default, TFE will not add anyone to (or remove anyone from) the owners team. You can enable automatic membership in the owners team by explicitly specifying a role ID for it. On your organization settings page, click "Teams" and then click the owners team. If SAML is enabled, there will be a "SAML Role ID" field. Enter a legal team name as an ID and click "Save." The ID can be "owners," but it cannot conflict with any other team name.

![Screenshot: The role ID field on the owners team page](./images/saml-owners.png)

Note that team names are unique across organizations but not necessarily unique across a whole TFE instance. If a user is a member of multiple TFE organizations, their SAML assertion might add them to similarly-named teams. Keep this in mind when naming your teams.

## Site Admins

Site admins can log in to Terraform Enterprise directly. If they are disabled on the identity provider but still enabled in Terraform Enterprise and bypass SSO, they will still be able to log in.
