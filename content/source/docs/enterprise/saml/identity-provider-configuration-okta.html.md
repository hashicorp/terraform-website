---
layout: "enterprise"
page_title: "SAML Okta Identity Provider Configuration - Terraform Enterprise"
---

# Okta Configuration

> **Hands-on:** Try the [Enable Single Sign On (SSO) in Terraform Enterprise](https://learn.hashicorp.com/tutorials/terraform/enable-sso-saml-tfe-okta?in=terraform/enterprise) tutorial on HashiCorp Learn.

Follow these steps to configure Okta as the identity provider (IdP) for Terraform Enterprise.

## Configure a New Okta SAML Application

1. In Okta's web interface, go to the **Applications** tab and click **Create App Integration**.
1. Select **SAML 2.0** as the sign on method, then click **Next**.
1. In the **General Settings** page, enter `Terraform Enterprise`, optionally add an app logo, then click **Next**.
1. In the **SAML Settings** section, configure the following settings with the specified values:

    | Okta Field                      | Terraform Enterprise SAML Field        | Value                                        |
    | ------------------------------- | -------------------------------------- | -------------------------------------------- |
    | **Single sign on URL**          | ACS Consumer (Recipient) URL           | `https://<TFE HOSTNAME>/users/saml/auth`     |
    | **Use the SSO URL for Recipient URL and Destination URL**  (checkbox)  | | `enabled`                                    |
    | **Audience URI (SP Entity ID)** | Metadata (Audience) URL                | `https://<TFE HOSTNAME>/users/saml/metadata` |
    | **Name ID format** (drop-down)  |                                        | EmailAddress                                 |
    | **Application username**        |                                        | Email                                        |

    ~> **Note:** The SSO URL is used by the identity provider software during authentication. It is different from the [Login URL][login_url], which users visit in order to sign in to Terraform Enterprise.

    The full name for the **Name ID format** in the SAML specification is `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`.

    If you are using Terraform Enterprise version v201912-1 or later, you can also choose Email Prefix for the application username (this was unreliable in older versions due to a bug that required usernames to be at least 3 characters).

1. Still in the **SAML Settings** section, optionally configure a site admin permissions attribute statement. This statement determines which users can administer the entire Terraform Enterprise instance (see [Administering Terraform Enterprise](../admin/index.html) for more information about site admin permissions). Under the **Attribute Statements (Optional)** header, configure a statement as follows:

    | Field                       | Value      | Description    |
    | --------------------------- | ---------- | -------------- |
    | **Name**                    | `SiteAdmin` | This is the default name for TFE's site admin [attribute][]; the name of this attribute can be changed in [TFE's SAML settings](./configuration.html) if necessary. |
    | **Name Format** (drop-down) | Basic      |                |
    | **Value**                   |            | An [Okta expression](https://developer.okta.com/reference/okta_expression_language/) that will evaluate to a boolean: `true` for every user who should have site admin permissions, but `false` for any users who should **not** have site admin permissions. The exact expression depends on the user properties you use to manage admin permissions. |


1. Still in the **Configure SAML** page, configure a group attribute statement to report which teams a user belongs to. Under the **Group Attribute Statements (Optional)** header, configure the statement as follows:

    | Field                       | Value      | Description    |
    | --------------------------- | ---------- | -------------- |
    | **Name**                    | `MemberOf` | This is the default name for TFE's group [attribute][]; the name of this attribute can be changed in [TFE's SAML settings](./configuration.html) if necessary. |
    | **Name Format** (drop-down) | Basic      | |
    | **Filter**                  |            | A filter type and filter value that will match all of the relevant groups that each user belongs to. The exact filter expression depends on how your Okta groups are configured, and which subset of groups you want to expose to TFE. Note that TFE ignores group names that do not correspond to existing TFE teams; see [Team Membership Mapping](./team-membership.html) for more details. |

1. Click **Preview the SAML Assertion** and make sure it matches your expectations. Click **Next**.
1. Select **I'm an Okta customer adding an internal app**, then click **Finish**.
1. Finish configuring the SAML app in Okta, then copy the provided endpoint URLs and certificate to your Terraform Enterprise SAML settings at `https://<TFE_HOSTNAME>/app/admin/saml` (example below). TFE requires a single sign-on URL, a single log-out URL, and a PEM (base64) encoded X.509 certificate.

[attribute]: ./attributes.html
[login_url]: ./login.html

## Example SAMLResponse

```xml
<?xml version="1.0" encoding="UTF-8"?>
<saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" Destination="https://example.com/users/saml/auth" ID="id1" InResponseTo="_a6d4052d-4dca-4816-b811-a81834681d40" IssueInstant="2018-05-30T15:27:58.831Z" Version="2.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">http://www.okta.com/1</saml2:Issuer>
  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <ds:Reference URI="#id1">
        <ds:Transforms>
          <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
            <ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/>
          </ds:Transform>
        </ds:Transforms>
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
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
  <saml2p:Status xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol">
    <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </saml2p:Status>
  <saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" ID="id2" IssueInstant="2018-05-30T15:27:58.831Z" Version="2.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">http://www.okta.com/1</saml2:Issuer>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      <ds:SignedInfo>
        <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
        <ds:Reference URI="#id2">
          <ds:Transforms>
            <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
              <ec:InclusiveNamespaces xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#" PrefixList="xs"/>
            </ds:Transform>
          </ds:Transforms>
          <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
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
    <saml2:Subject xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
      <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">user@example.com</saml2:NameID>
      <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml2:SubjectConfirmationData InResponseTo="_a6d4052d-4dca-4816-b811-a81834681d40" NotOnOrAfter="2018-05-30T15:32:58.831Z" Recipient="https://example.com/users/saml/auth"/>
      </saml2:SubjectConfirmation>
    </saml2:Subject>
    <saml2:Conditions NotBefore="2018-05-30T15:22:58.831Z" NotOnOrAfter="2018-05-30T15:32:58.831Z" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
      <saml2:AudienceRestriction>
        <saml2:Audience>https://example.com/users/saml/metadata</saml2:Audience>
      </saml2:AudienceRestriction>
    </saml2:Conditions>
    <saml2:AuthnStatement AuthnInstant="2018-05-30T15:11:50.514Z" SessionIndex="_a6d4052d-4dca-4816-b811-a81834681d40" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
      <saml2:AuthnContext>
        <saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml2:AuthnContextClassRef>
      </saml2:AuthnContext>
    </saml2:AuthnStatement>
    <saml2:AttributeStatement xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
      <saml2:Attribute Name="Username" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">new_username</saml2:AttributeValue>
      </saml2:Attribute>
      <saml2:Attribute Name="MemberOf" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">devs</saml2:AttributeValue>
        <saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">reviewers</saml2:AttributeValue>
      </saml2:Attribute>
    </saml2:AttributeStatement>
  </saml2:Assertion>
</saml2p:Response>
```
