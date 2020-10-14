---
layout: "cloud"
page_title: "Azure AD - Singlge Sign-On - Terraform Cloud and Terraform Enterprise"
---

-> **Note:** Single sign-on is a paid feature, available as part of the **Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

# Single Sign-on: Azure AD

The Azure SSO integration currently supports the following SAML features:

- Service Provider (SP)-initiated SSO
- Identity Provider (IdP)-initiated SSO
- Just-in-Time Provisioning

For more information on the listed features, visit the [Azure SAML Protocol Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/single-sign-on-saml-protocol).

## Configuration (Azure AD)

-> **Note:** Azure is rolling out a new interface for setting up Enterprise Applications. The first 3 steps vary depending on your UI choice.

### Using the current Azure AD UI
1. In your desired Azure AD Directory, navigate to the Enterprise Applications page and create a "+ New Application".
2. Select the non-gallery application option.
3. Give your application a name and click "Add."

### Using the updated Azure AD UI
1. In your desired Azure AD Directory, navigate to the Enterprise Applications page and create a "+ New Application".
2. Locate and select the "+ Create your own appliction" option.
3. In the resulting sidebar, name your application, select the option to "Integrate any other application you don't find in the gallery," and click "Create" at the bottom of the page.

4. Under the "Getting Started" section, select "Set up single sign on."
5. Select the SAML option.
6. You should now see a 5-part set up list. Ignore step 1 for now, we will come back to that.
7. Edit step 2, "User Attributes & Claims".
8. Select the required Name ID claim. Ensure that its name identifier format is "Email address".
9. Select "Add a certificate", located in step 3 of the list.
    1. Import or create a certificate.
    1. If the certificate is not listed as active, use the meatball menu to its right to set it to active.
    1. Set Signing option to Sign SAML response and assertion.
    1. Set Signing Algorithm to `SHA-256`
    1. Save this.
10. After saving certificate settings you should now see a field in step 3 labeled "App Federation Metadata Url". Copy that. You're ready to head over to your organization in Terraform Cloud.

## Configuration (Terraform Cloud)

1. Visit your organization settings page and click "SSO".

2. Click "Setup SSO".

    ![sso-setup](../images/sso/setup.png)

3. Select "Azure" and click "Next".

    ![sso-wizard-choose-provider-azure](../images/sso/wizard-choose-provider-azure.png)

4. Provide your App Federation Metadata URL.

    ![sso-wizard-configure-settings-azure](../images/sso/wizard-configure-settings-azure.png)

5. Save, and you should see a completed Terraform Cloud SAML configuration.

6. Copy Entity ID and Assertion Consumer Service URL.

## Configuration (Azure)

Returning to the SAML configuration page for your custom enterprise application in Azure:

1. Edit step 1, "Basic SAML Configuration"
2. Provide the copied Entity ID and Asserion Consumer Service URL from Terraform Cloud.
3. Save.

4. [Verify](./testing.html) your settings and click "Enable".

5. Your Azure SSO configuration is complete and ready to [use](../single-sign-on.html#using-sso).

    ![sso-settings](../images/sso/settings-azure.png)

## Team and Username Attributes

To configure team management in your Azure AD application:
1. Navigate to the single sign-on page.
1. Edit step 2, "User Attributes & Claims."
1. We recomoned naming it "MemberOf", leaving the namespace blank, and potentially sourcing `user.assignedroles` as an easy starting point.

If you plan to make use of SAML to set usernames in your Azure AD application:
1. Navigate to the single sign-on page.
1. Edit step 2, "User Attributes & Claims"
1. We recomend naming the claim "Username", leaving the namespace blank, and sourcing something like `user.displayname` or `user.mailnickname`.


If you namespaced any of your claims, note that the attribute name passed by Azure AD will follow the form `<claim_namespace/claim_name>`. Consider this when setting Team and Username attribute names.
