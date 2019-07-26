---
layout: "enterprise"
page_title: "SAML User Attributes - Terraform Enterprise"
---

# Attributes

The following SAML attributes correspond to properties of a Terraform Enterprise user account. When a new or existing user logs in, their account info will be updated with data from these attributes.

## Username

If Username is specified, TFE will assign that username to the user instead of using an automatic name [based on their email address](./login.html). When the username is already taken or is invalid, login will still complete, and the existing or default value will be used instead.

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="Username" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
    <saml:AttributeValue xsi:type="xs:string">new-username</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

## SiteAdmin

If the SiteAdmin attribute is present, the system will grant or revoke [site admin access](../admin/index.html) for the user. Site admin access can be also be granted or revoked in the [MemberOf attribute](#memberof); however the SiteAdmin attribute is the recommended method of managing access and will override the other value.

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="SiteAdmin">
    <saml:AttributeValue xsi:type="xs:boolean">false</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

## MemberOf

Team membership is specified in the MemberOf attribute. (If desired, you can [configure a different name](./team-membership.html) for the team membership attribute.)

Teams can be specified in separate AttributeValue items:

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="MemberOf" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
    <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">devs</saml:AttributeValue>
    <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">reviewers</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

or in one AttributeValue as a comma-separated list:

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="MemberOf" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
    <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">list,of,roles</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

There is a special-case role `site-admins` that will add a user as a site admin to your private Terraform Enterprise instance.

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="MemberOf" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
    <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">site-admins</saml:AttributeValue>
    <saml:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">devs</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```
