---
layout: enterprise2
page_title: "ADFS Configuration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-private-saml-configuration"
---

This guide will explain how to configure Active Directory Federated Services (ADFS) in order to use them as an Identity Provider (IdP) for PTFE's SAML authentication feature. The screenshots below were taken on Windows Server 2016 so you may not look the same on previous Windows versions.

This doc assumes that you have already installed and configured ADFS and that you are using PTFE version v201807-1 or later.



## Step 1 - Information gathering and PTFE configuration

#### On the ADFS server

1. Start the Server Manager.
  ![saml_0](./images/saml_0.png)

2. Click on Tools -> AD FS Management
  .![saml_1](./images/saml_1.png)

3. Expand the `Service`object and click on `Endpoints`.
  ![saml_2](./images/saml_2.png)

4. Make a note of the `URL Path` for Type `SAML 2.0/WS-Federation`. If you are using the default settings, this should be `/adfs/ls/`.

5. Next click on Certificates and choose the one under `Token-signing`.
  ![saml_3](./images/saml_3.png)

6. Right click -> `View Certificate` .
  ![saml_5](./images/saml_5.png)

7. On the Certificate form select `Details` and click on `Copy to File`.
  ![saml_6](./images/saml_6.png)

8. On the new screen, click `Next, `select `Base-64 encoded X.509 (.CER)` and click `Next` again.
  ![saml_8](./images/saml_8.png)

9. Pick a location to save the file and click `Next`,
  ![saml_9](./images/saml_9.png)
10. Review the settings and click on `Finish`.
  ![saml_10](./images/saml_10.png)

####On PTFE

For the next steps we will need the following items:

* The ADFS server hostname.
* The `URL Path`configured in step 4 above.
* The contents of the certificate we saved in step 8 above.



1. Visit https://<your ptfe hostname>/app/admin/saml .
2. Set `Single Sign-on URL` to https://<ADFS hostname>/<URL Path> .
3. Set `Single log-out URL`to https://<ADFS hostname>/<URL Path>?wa=wsignout1.0 .
4. Paste the contents of the certificate in `IDP Certificate`.
5. Scroll to the bottom of the screen and click `Save SAML Settings`.



## Step 2 - ADFS Configuration

#### On the ADFS server

##### Configure the Relaying Party (RP) Trust

1. Start the Server Manager.
   ![saml_0](./images/saml_0.png)

2. Click on Tools -> AD FS Management
   .![saml_1](./images/saml_1.png)

   

3. Right click on `Relying Party Trusts`and then click on `Add Relying Party Trust`.

    ![saml_11](./images/saml_11.png)

4. In the next dialog select `Claims aware` and click on `Start`.
   ![saml_12](./images/saml_12.png)

5. Next select `Import data about the relying party published online or on a local network` and in the textbox type `https://<PTFE hostname>/users/saml/metadata`.

   ![saml_13](./images/saml_13.png)

6. Click `Next`, type a display name used to identify the RP trust and click on `Next` again.
   ![saml_14](./images/saml_14.png)

7. In the next dialog you choose the access control policy. Choose one that matches your security policy and then click `Next`.
   ![saml_15](./images/saml_15.png)

8. Review the settings and click `Next`.
   ![saml_16](./images/saml_16.png)

9. Finally, make sure the checkbox next to `Configure claims issuance policy for this application` is checked and click on `Close`. This will open the `Claim Issuance Policy editor` for the RP trust we just configured.
   ![saml_17](./images/saml_17.png)

##### Claims Configuration

1. Click on `Add Rule`and in the new screen select `Send LDAP Attributes as Claims` from the `Claim rule template`dropdown. Click  `Next`.

2. Set a name used to identify the claim rule, set the attribute store to `Active Directory`and then:
   - From the `LDAP Attribute` column, select `E-Mail Addresses`.
   - From the `Outgoing Claim Type`, select `E-Mail Address`. 

   ![saml_19](./images/saml_19.png)

3. Click on `Finish`.

4. Click on `Add Rule`and in the new screen select `Transform an Incoming Claim` from the `Claim rule template`dropdown. Click `Next`.
   ![saml_22](./images/saml_22.png)

5. Set a name used to identify the claim rule and then:
   * Select `E-mail Address` as the `Incoming Claim Type`.

   * For `Outgoing Claim Type`, select `Name ID`.

   * For `Outgoing Name ID Format`, select `Email`. 

     ![saml_23](./images/saml_23.png)

6. Click on `Finish`.

7. Click on `Add Rule`and in the new screen select `Send Group Membership as a Claim` from the `Claim rule template`dropdown. Click `Next`.

8. Click on `Browse` and locate the AD User group that contains all the PTFE admins.
   ![saml_26](./images/saml_26.png)
9. Set `Outgoing claim type` to `Group,` `Outgoing claim value` to `MemberOf`, and click `Finish`.
   ![saml_27](./images/saml_27.png)

## Step 3 - Login

At this point SAML is configured and you should follow [these instructions](docs/enterprise/saml/login.html) in order to login to Terraform Enterprise.
