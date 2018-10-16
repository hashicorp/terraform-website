---
layout: enterprise2
page_title: "SAML Configuration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-saml-configuration"
---

# Configuration

SAML requires the configuration of two parties:

- The Identity Provider (IdP).
- The Service Provider (SP), which is also sometimes referred to as Relying Party (RP).

Private Terraform Enterprise (PTFE) is configured as the Service Provider.

-> **Note:** For instructions for specific IdPs, see [Identity Provider Configuration](./identity-provider-configuration.html).

## Terraform Enterprise (Service Provider)

~> **Important:** Only PTFE users with the site-admin permission can modify SAML settings. For more information about site admins, see [Administering Private Terraform Enterprise][admin].

[admin]: ../private/admin/index.html

Go to the SAML section of the site admin pages. You can use the "Site Admin" link in the upper-right user icon menu, or go directly to `https://<TFE HOSTNAME>/app/admin/saml`.

Once there, enter values for TFE's SAML settings and click the "Save SAML Settings" button at the bottom of the page.

The SAML settings are separated into sections:

### SAML Settings

- **Enable SAML single sign-on**: This checkbox must be enabled.

### Identity Provider Settings

- **Single Sign-On URL**: The HTTP(S) endpoint on your IdP for single sign-on requests. This value is provided by your IdP configuration.
- **Single Log-Out URL**: The HTTP(s) endpoint on your IdP for single logout requests. This value is provided by your IdP configuration. Single Logout is not yet supported.
- **IdP Certificate**: The PEM encoded X.509 Certificate as provided by the IdP configuration.

### Attributes

- **Username Attribute Name**: (default: `Username`) The name of the SAML attribute that determines the TFE username for a user logging in via SSO.
- **Site Admin Attribute Name**: (default: `SiteAdmin`) The name of the SAML attribute that determines whether a user has site-admin permissions. The value of this attribute in the SAML assertion must be a boolean. Site admins can manage settings and resources for the entire PTFE instance; see [Administering Private Terraform Enterprise][admin] for details.
- **Team Attribute Name**: (default: `MemberOf`) The name of the SAML attribute that determines [team membership](./team-membership.html). The value of this attribute in the SAML assertion must be a string containing a comma-separated list of team names.

### Team Membership Mapping

- **Site Admin Role**: (default: `site-admins`; make blank to disable) An alternate way of managing site-admin permissions; if a role with this name is present in the value of the Team Attribute Name attribute, the user is an admin.

    We recommend using the "site admin attribute name" setting instead. If you are using the site admin attribute, you can disable "site admin role" by deleting its value.

### User Session

- **API Token Session Timeout**: (default: `1209600` seconds, or 14 days) The duration of time (in seconds) for which TFE will accept [a user's API token](../users-teams-organizations/users.html#api-tokens) before requiring the user to log in again. For more details about this behavior, see [API Token Expiration](./login.html#api-token-expiration).

## Identity Provider

Configure the following values in the SAML Identity Provider (IdP):

1. **Audience**: `https://<TFE HOSTNAME>/users/saml/metadata`
2. **Recipient**: `https://<TFE HOSTNAME>/users/saml/auth`
3. **ACS (Consumer) URL**: `https://<TFE HOSTNAME>/users/saml/auth`

The SAML Metadata document is available at: `https://<TFE HOSTNAME>/users/saml/metadata.xml`
