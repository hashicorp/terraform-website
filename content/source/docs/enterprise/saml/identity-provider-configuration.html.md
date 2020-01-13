---
layout: "enterprise"
page_title: "SAML Identity Provider Configuration - Terraform Enterprise"
---

# Identity Provider Configuration

Single sign-on setup instructions for specific identity providers (IdP).

## Identity Providers

* [ADFS](./identity-provider-configuration-adfs.html)
* [Azure Active Directory](./identity-provider-configuration-aad.html)
* [ForgeRock](./identity-provider-configuration-forgerock.html)
* [Okta](./identity-provider-configuration-okta.html)
* [OneLogin](./identity-provider-configuration-onelogin.html)

## Request and response

To help you with the configuration of your identity provider, here are example documents for the request from Terraform Enterprise before sign-on and the response from the identity provider after sign-on.

### Example AuthnRequest

```xml
<samlp:AuthnRequest AssertionConsumerServiceURL='https://app.terraform.io/users/saml/auth' Destination='https://example.onelogin.com/trust/saml2/http-post/sso/1' ID='_000eda0a-c0f0-00cf-b0a0-c00b000d000f' IssueInstant='2018-02-28T02:16:25Z' Version='2.0' xmlns:saml='urn:oasis:names:tc:SAML:2.0:assertion' xmlns:samlp='urn:oasis:names:tc:SAML:2.0:protocol'>
  <saml:Issuer>https://app.terraform.io/users/saml/metadata</saml:Issuer>
  <samlp:NameIDPolicy AllowCreate='true' Format='urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'/>
</samlp:AuthnRequest>
```

### Example SAMLResponse

```xml
<samlp:Response xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="Rcfa2c10eeafd57496999c691655247bdf16b3549" Version="2.0" IssueInstant="2018-02-28T16:05:13Z" Destination="https://app.terraform.io/users/saml/auth" InResponseTo="_0ac000d0-ae00-0fe0-000c-0f00a000d000">
  <saml:Issuer>https://app.terraform.io/saml/metadata/1</saml:Issuer>
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
          <ds:DigestValue>8xMTvqWoOpBMP990fzsoW2HWFVw=</ds:DigestValue>
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
        <saml:SubjectConfirmationData NotOnOrAfter="2018-02-28T16:08:13Z" Recipient="https://app.terraform.io/users/saml/auth" InResponseTo="_0ac000d0-ae00-0fe0-000c-0f00a000d000"/></saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="2018-02-28T16:02:13Z" NotOnOrAfter="2018-02-28T16:08:13Z">
      <saml:AudienceRestriction>
        <saml:Audience>https://app.terraform.io/users/saml/metadata</saml:Audience>
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
      <saml:Attribute Name="SiteAdmin">
        <saml:AttributeValue xsi:type="xs:boolean">false</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="MemberOf" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">devs</saml:AttributeValue>
        <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">reviewers</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>
```
