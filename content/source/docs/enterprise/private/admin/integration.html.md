---
layout: "enterprise2"
page_title: "Integrations - Admin - Private Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-admin-integration"
---

# Administration: Service Integrations

## SAML Integration

The SAML integration settings allow configuration of a SAML Single Sign-On integration for Terraform Enterprise. To access the SAML settings, click **SAML** in the left menu.

Before enabling SAML, see [SAML Single Sign On](../../saml/index.html) for detailed requirements and configuration instructions for both Terraform Enterprise and your IdP.

To enable SAML, click **Enable SAML single sign-on** under "SAML Settings". Configure the fields below, then click **Save SAML settings**. To update the settings, update the field values, and save.

The **Enable SAML debugging** option can be used if sign-on is failing to provide additional debugging information during login tests. It should not be left on during normal operations.

## SMTP Integration

SMTP integration allows Terraform Enterprise to send email-based notifications, such as new user invitations, password resets, and system errors. We strongly recommend configuring SMTP. 

To access the SMTP settings, click **SMTP** in the left menu. To enable SMTP, check the box on the settings page and configure the relevant settings.

The SMTP server used with Terraform Enterprise must support connection via SSL with a valid certificate.

## Twilio Integration

Twilio integration is used to send SMS messages for two-factor authentication. It is optional; application-based 2FA is also supported.

To access the Twilio settings, click **Twilio** in the left menu. To enable Twilio, check the box on the settings page and configure the relevant settings.