---
layout: enterprise2
page_title: "SAML OneLogin Identity Provider Configuration - Terraform Enterprise"
---

# OneLogin Configuration

Follow these steps to configure OneLogin as the identity provider (IdP) for Terraform Enterprise (TFE).

1. Add a OneLogin app by going to Apps > Add Apps then searching for "SAML Test Connector (IdP)".
2. In the "Info" tab, enter an app name for Terraform Enterprise in the "Display Name" field.
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

## Additional Resources

The following pages in the OneLogin documentation are relevant to using SAML SSO with Terraform Enterprise:

* [Create Mappings to Automatically Assign Roles to Users](https://support.onelogin.com/hc/en-us/articles/211531266-User-Provisioning-An-End-to-End-Flow#create-mappings)
* [Using Regex to Provision Members of AD/LDAP Groups to New App Groups](https://support.onelogin.com/hc/en-us/articles/209887623-Using-Regex-to-Provision-Members-of-AD-LDAP-Groups-to-New-App-Groups)

## Example SAMLResponse

```xml
<samlp:Response xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="Rcfa2c10eeafd57496999c691655247bdf16b3549" Version="2.0" IssueInstant="2018-02-28T16:05:13Z" Destination="https://example.com/users/saml/auth" InResponseTo="_0ac000d0-ae00-0fe0-000c-0f00a000d000">
  <saml:Issuer>https://example.com/saml/metadata/1</saml:Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>
  <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="2.0" ID="pfx0000b000-0000-0000-00f0-0000bdb000ce" IssueInstant="2018-02-28T16:05:13Z">
    <saml:Issuer>https://app.onelogin.com/saml/metadata/1</saml:Issuer>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      <ds:SignedInfo>
        <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
        <ds:Reference URI="#pfx0000b000-0000-0000-00f0-0000bdb000ce">
          <ds:Transforms>
            <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          </ds:Transforms>
          <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
          <ds:DigestValue>000000000000000000000000000=</ds:DigestValue>
        </ds:Reference>
      </ds:SignedInfo>
      <ds:SignatureValue>000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000==</ds:SignatureValue>
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000==</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </ds:Signature>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">user@example.com</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData NotOnOrAfter="2018-02-28T16:08:13Z" Recipient="https://example.com/users/saml/auth" InResponseTo="_0ac000d0-ae00-0fe0-000c-0f00a000d000"/></saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="2018-02-28T16:02:13Z" NotOnOrAfter="2018-02-28T16:08:13Z">
      <saml:AudienceRestriction>
        <saml:Audience>https://example.com/users/saml/metadata</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>
    <saml:AuthnStatement AuthnInstant="2018-02-28T16:05:12Z" SessionNotOnOrAfter="2018-03-01T16:05:13Z" SessionIndex="_000000d0-fecf-0000-00c0-000f0ee000a0">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>
    <saml:AttributeStatement>
      <saml:Attribute Name="Username" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xsi:type="xs:string">new-username</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="MemberOf" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">devs</saml:AttributeValue>
        <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">reviewers</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>
```
