---
layout: enterprise2
page_title: "SAML OneLogin Identity Provider Configuration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-saml-identity-provider-configuration-onelogin"
---

# OneLogin Configuration

Follow these steps to configure OneLogin as the identity provider (IdP) for Terraform Enterprise.

1. Add a OneLogin app by going to Apps > Add Apps then searching for "SAML Test Connector (IdP)".
2. In the "Info" tab, enter "Terraform Enterprise" in the "Display Name" field.
  ![image](./images/sso-onelogin-info.png)
3. In the "Configuration" tab, configure the service provider audience and recipient URLs. These are shown in your Terraform Enterprise SAML settings at `https://<TFE HOSTNAME>/app/admin/saml`.
  ![image](./images/sso-onelogin-configuration.png)
4. In the "Parameters" tab, map the NameId and MemberOf parameters.
  ![image](./images/sso-onelogin-parameters.png)
  ![image](./images/sso-onelogin-parameters-memberof.png)
5. In the "SSO" tab, copy the endpoint URLs and certificate, then paste them into your Terraform Enterprise SAML settings at `https://<TFE HOSTNAME>/app/admin/saml`. (Use the certificate's "View Details" link to copy its PEM-encoded text representation.)
  ![image](./images/sso-onelogin-sso.png)
  ![image](./images/sso-onelogin-sso-certificate.png)
6. In the "Access" tab, enable access for specific roles.
  ![image](./images/sso-onelogin-access.png)
7. In the "Users" tab, add users and specify their roles.
  ![image](./images/sso-onelogin-users-fields.png)
  ![image](./images/sso-onelogin-users.png)

## Terraform Enterprise SAML SSO settings

Verify the endpoint URLs, certificate, and attribute mappings are correct in the SAML SSO settings.

![image](./images/sso-tfe-admin.png)
