---
layout: enterprise2
page_title: "SAML - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-saml"
---

# SAML Single Sign On

-> **Note**: The SAML Single Sign On feature is only available with the Premium tier on private installs.

SAML is an XML-based standard for authentication and authorization. Terraform Enterprise can act as a service provider (SP) (or Relying Party) with your internal SAML identity provider (IdP).

Terraform Enterprise supports the SAML 2.0 standard. It has been tested with a variety of identity providers.

- Google G Suite - verified
- OneLogin - verified

These providers are planned to be verified for the General Availability launch but have not been tested in Beta.

- PingFederate
- Azure Active Directory (Azure AD)