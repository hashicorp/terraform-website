---
layout: enterprise2
page_title: "SAML Configuration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-saml-configuration"
---

# Configuration

SAML requires the configuration of both parties, the Identity Provider (IdP) and the Service Provider (SP) also sometimes referred to as Relying Party (RP). Terraform Enterprise is configured as the Service Provider.

## Terraform Enterprise (Service Provider)
Go to `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/admin/settings/saml` and set the following:

1. **Single Sign On URL**: specifies the HTTP(S) endpoint on your IdP for single sign-on requests. This value is provided by your IdP configuration.
2. **Single Log Out URL**:  specifies the HTTP(s) endpoint on your IdP for single logout requests. This value is provided by your IdP configuration. Single Logout is not yet supported.
3. **Identity Provider Certificate**: Specifies the PEM encoded X.509 Certificate as provided by the IdP configuration.
4. **User email address**: (default: `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`) Specifies the attribute to be used to identify the email (username) of the user.
5. **Group Membership List**: (optional) Specifies the name of the SAML attribute. The value of this attribute must be a string containing a comma separated list of teams. The value is used to assign [team membership](./team-membership.html).

## Identity Provider

Configure the following values in the SAML Identity Provider (IdP):

1. **Audience**: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/metadata`
2. **Recipient**: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/auth`
3. **ACS (Consumer) URL**: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/auth`

The SAML Metdata document is available at: `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/users/saml/metadata`