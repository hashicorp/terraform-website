---
layout: "cloud"
page_title: "SAML - Single Sign-on - Terraform Cloud and Terraform Enterprise"
---

-> **Note:** Single sign-on is a paid feature, available as part of the **Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

# Single Sign-on: SAML

The SAML SSO integration currently supports the following features of SAML 2.0:

- Service Provider (SP)-initiated SSO
- Identity Provider (IdP)-initiaited SSO
- Just-in-Time Provisioning

The SAML SSO integration can be configured by providing a metadata URL or manually with the Single Sign-on URL (ACS URL), Entity ID or Issuer URL, and X.509 Certificate.

## Configuration (Terraform Cloud)

1. Visit your organization settings page and click "SSO".

2. Click "Setup SSO".

   ![sso-setup](../images/sso/setup.png)

3. Select "SAML" and click "Next".

   ![sso-wizard-choose-provider-saml](../images/sso/wizard-choose-provider-saml.png)

4. Proceed with configuring using the metadata URL or manually providing the IdP configuration.

   **Metadata URL**

   1. Provide your metadata URL and click the "Save settings" button.

      ![sso-wizard-configure-settings-metadata](../images/sso/wizard-configure-settings-metadata.png)

   **Manually**

   1. Toggle the identity provider configuration.

      ![sso-wizard-configure-settings-toggle](../images/sso/wizard-configure-settings-toggle.png)

   2. Provide your Single Sign-on URL, Entity ID or Issuer URL, and X.509 Certificate.

      ![sso-wizard-configure-settings-manually](../images/sso/wizard-configure-settings-manually.png)

5. Click "Save settings".

6. Verify your settings and click "Enable".

7. Your SAML SSO configuration is complete and ready to [use](../single-sign-on.html#using-sso).

   ![sso-settings](../images/sso/settings-saml.png)
