---
layout: enterprise2
page_title: "SAML Configuration - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-saml-configuration"
---

# Configuration

Go to `https://[your-terraform-domain]/admin/settings/saml/edit` and you’ll need to set the following values

1. **Single Sign On URL**: specifies the HTTP(S) endpoint on your IdP for single sign-on requests. This value is provided by your IdP configuration.
2. **Single Log Out URL**:  specifies the HTTP(s) endpoint on your IdP for single logout requests. This value is provided by your IdP configuration. Single Logut is not yet supported.
3. **Identity Provider Certificate**: Specifies the X.509 Certificate as provided by the IdP configuration.
4. **User email address**: (default: `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`) Specifies the attribute to be used to identify the email (username) of the user.
5. **Group Membership List**: (optional) Specifies the attributes used to identify team membership. This should be a comma-separated list.