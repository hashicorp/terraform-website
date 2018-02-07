---
layout: enterprise2
page_title: "SAML OneLogin Identity Provider Configuration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-saml-identity-provider-configuration-onelogin"
---

# OneLogin Configuration

Follow these steps to configure OneLogin as the identity provider (IdP) for Terraform Enterprise.

1. Add a OneLogin app by going to Apps > Add Apps then searching for "SAML Test Connector (IdP)".
2. Name the app.
  ![image](./images/sso-onelogin-info.png)
3. Configure the service provider URLs. These are shown in your Terraform Enterprise SAML settings at `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/admin/integrations/saml`.
  ![image](./images/sso-onelogin-configuration.png)
4. Map the NameId and MemberOf parameters.
  ![image](./images/sso-onelogin-parameters.png)
  ![image](./images/sso-onelogin-parameters-memberof.png)
5. Copy the endpoint URLs and certificate to your Terraform Enterprise SAML settings `https://<YOUR_TERRAFORM_ENTERPRISE_DOMAIN>/admin/integrations/saml`.
  ![image](./images/sso-onelogin-sso.png)
  ![image](./images/sso-onelogin-sso-certificate.png)
6. Enable access for specific roles.
  ![image](./images/sso-onelogin-access.png)
7. Add users and specify their roles.
  ![image](./images/sso-onelogin-users-fields.png)
  ![image](./images/sso-onelogin-users.png)

## Terraform Enterprise SAML SSO settings

Verify the endpoint URLs, certificate, and attribute mappings are correct in the SAML SSO settings.

![image](./images/sso-tfe-admin.png)
