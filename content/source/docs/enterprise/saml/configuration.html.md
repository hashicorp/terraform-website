---
layout: "enterprise"
page_title: "SAML Configuration - Terraform Enterprise"
---

# Configuration

SAML requires the configuration of two parties:

- The Identity Provider (IdP).
- The Service Provider (SP), which is also sometimes referred to as Relying Party (RP).

Terraform Enterprise is configured as the Service Provider.

-> **Note:** For instructions for specific IdPs, see [Identity Provider Configuration](./identity-provider-configuration.html).

-> **API:** See the [Admin Settings API](/docs/cloud/api/admin/settings.html).

## Terraform Enterprise (Service Provider)

~> **Important:** Only Terraform Enterprise users with the site-admin permission can modify SAML settings. For more information about site admins, see [Administering Terraform Enterprise][admin].

Prior to activating SAML, we recommend that you create a [non-SSO admin account for recovery](./troubleshooting.html#create-a-non-sso-admin-account-for-recovery).

In case of any issues during SAML configuration, this ensures that there will be an admin able to log in and make necessary adjustments.

[admin]: ../admin/index.html

Go to the SAML section of the site admin pages. You can use the "Site Admin" link in the upper-right user icon menu, or go directly to `https://<TFE HOSTNAME>/app/admin/saml`.

Once there, enter values for TFE's SAML settings and click the "Save SAML Settings" button at the bottom of the page.

The SAML settings are separated into sections:

### SAML Settings

- **Enable SAML single sign-on**: This checkbox must be enabled.

### Identity Provider Settings

- **Single Sign-On URL**: The HTTP(S) endpoint on your IdP for single sign-on requests. This value is provided by your IdP configuration.
- **Single Log-Out URL**: The HTTP(s) endpoint on your IdP for single logout requests. This value is provided by your IdP configuration. Single Logout is not yet supported.
- **IdP Certificate**: The PEM encoded X.509 Certificate as provided by the IdP configuration.

-> **Note:** When reconfiguring the IdP certificate, TFE will retain the old IdP certificate to allow for a rotation period. When you are sure that the new certificate is functioning correctly, you must explicitly remove the old IdP certificate. A button labeled "Revoke old IDP certificate" will appear below the IdP Certificate field if you are in a rotation period. You can also remove the old certificate via an [API endpoint](/docs/cloud/api/admin/settings.html#revoke-previous-saml-idp-certificate).

### Attributes

- **Username Attribute Name**: (default: `Username`) The name of the SAML attribute that determines the TFE username for a user logging in via SSO.
- **Site Admin Attribute Name**: (default: `SiteAdmin`) The name of the SAML attribute that determines whether a user has site-admin permissions. The value of this attribute in the SAML assertion must be a boolean. Site admins can manage settings and resources for the entire Terraform Enterprise instance; see [Administering Terraform Enterprise][admin] for details.
- **Team Attribute Name**: (default: `MemberOf`) The name of the SAML attribute that determines [team membership](./team-membership.html). The value of this attribute in the SAML assertion must be either a string containing a comma-separated list of team names or separate [AttributeValue items](./attributes.html#memberof). Team membership mapping is case-sensitive. 

### Team Membership Mapping

- **Site Admin Role**: (default: `site-admins`; make blank to disable) An alternate way of managing site-admin permissions; if a role with this name is present in the value of the Team Attribute Name attribute, the user is an admin.

    We recommend using the "site admin attribute name" setting instead. If you are using the site admin attribute, you can disable "site admin role" by deleting its value.

### User Session

- **API Token Session Timeout**: (default: `1209600` seconds, or 14 days) The duration of time (in seconds) for which TFE will accept [a user's API token](/docs/cloud/users-teams-organizations/users.html#api-tokens) before requiring the user to log in again. For more details about this behavior, see [API Token Expiration](./login.html#api-token-expiration).

## Identity Provider

Configure the following values in the SAML Identity Provider (IdP):

1. **Audience**: `https://<TFE HOSTNAME>/users/saml/metadata`
2. **Recipient**: `https://<TFE HOSTNAME>/users/saml/auth`
3. **ACS (Consumer) URL**: `https://<TFE HOSTNAME>/users/saml/auth`

The SAML Metadata document is available at: `https://<TFE HOSTNAME>/users/saml/metadata.xml`
