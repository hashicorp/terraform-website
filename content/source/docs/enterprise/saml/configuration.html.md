---
layout: enterprise2
page_title: "SAML Configuration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-saml-configuration"
---

# Configuration

SAML requires the configuration of two parties:

- The Identity Provider (IdP).
- The Service Provider (SP), which is also sometimes referred to as Relying Party (RP).

Terraform Enterprise is configured as the Service Provider.

~> For instructions for specific IdPs, see [Identity Provider Configuration](./identity-provider-configuration.html)

## Terraform Enterprise (Service Provider)

Go to `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/admin/settings/saml` and set the following:

1. **Single Sign On URL**: specifies the HTTP(S) endpoint on your IdP for single sign-on requests. This value is provided by your IdP configuration.
2. **Single Log Out URL**:  specifies the HTTP(s) endpoint on your IdP for single logout requests. This value is provided by your IdP configuration. Single Logout is not yet supported.
3. **Identity Provider Certificate**: Specifies the PEM encoded X.509 Certificate as provided by the IdP configuration.
4. **Team Attribute Name**: (default: `MemberOf`) Specifies the name of the SAML attribute that determines [team membership](./team-membership.html). The value of this attribute in the SAML assertion must be a string containing a comma-separated list of team names.
5. **Site Admin Role**: (default: `site-admins`) Specifies the role for site admin access, provided in the list of roles sent in the Team Attribute Name attribute.

## Identity Provider

Configure the following values in the SAML Identity Provider (IdP):

1. **Audience**: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/metadata`
2. **Recipient**: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/auth`
3. **ACS (Consumer) URL**: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/auth`

The SAML Metadata document is available at: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/metadata`
