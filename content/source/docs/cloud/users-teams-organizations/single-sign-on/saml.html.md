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

The SAML SSO integration can be configured by providing a metadata URL or manually with the Single Sign-on URL, Entity ID, and X.509 Certificate.

## Configuration (Terraform Cloud)

1. Visit your organization settings page and click "SSO".

2. Click "Setup SSO".

    ![sso-setup](../images/sso/setup.png)

3. Select "SAML" and click "Next".

    ![sso-wizard-choose-provider-saml](../images/sso/wizard-choose-provider-saml.png)

4. Configure using the IdP's metadata URL or manually with the Single Sign-On URL, Entity ID, and X.509 Certificate.

    ![sso-wizard-configure-settings-metadata](../images/sso/wizard-configure-settings-metadata.png)

    ![sso-wizard-configure-settings-manually](../images/sso/wizard-configure-settings-manually.png)

5. Click "Save settings".

6. [Verify](./testing.html) your settings and click "Enable".

7. Your SAML SSO configuration is complete and ready to [use](../single-sign-on.html#signing-in-with-sso).

    ![sso-settings](../images/sso/settings-saml.png)
