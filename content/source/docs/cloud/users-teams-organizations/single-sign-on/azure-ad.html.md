---
layout: "cloud"
page_title: "Microsoft Azure AD - Single Sign-on - Terraform Cloud and Terraform Enterprise"
---

-> **Note:** Single sign-on is a paid feature, available as part of the **Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

# Single Sign-on: Microsoft Azure AD

The Microsoft Azure AD SSO integration currently supports the following SAML features:

- Service Provider (SP) initiated SSO
- Identity Provider (IdP) initiated SSO
- Just-in-Time Provisioning

For more information on the listed features, visit the [Microsoft Azure AD SAML Protocol Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/single-sign-on-saml-protocol).

## Configuration (Microsoft Azure AD)

1. Sign in to the Azure portal.
2. On the left navigation pane, select the **Azure Active Directory** service.
3. Navigate to **Enterprise Applications** and then select **All Applications**.
4. To add new application, select **New application**.
5. In the **Add from the gallery** section, type **Terraform Cloud** in the search box.
6. Select **Terraform Cloud** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
7. On the **Terraform Cloud** application integration page, find the **Manage** section and select **single sign-on**.
8. On the **Select a single sign-on method** page, select **SAML**.
9. In the **SAML Signing Certificate** section select **Add a certificate**.
    1. Select **New Certificate**.
    1. Select **Save**.
10. In the SAML Signing Certificate section (you may need to refresh the page) copy the **App Federation Metadata Url**.

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

## Configuration (Microsoft Azure AD)

1. In the Azure portal, on the **Terraform Cloud** application integration page, find the **Manage** section and select **single sign-on**.
2. On the **Select a single sign-on method** page, select **SAML**.
3. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.
    1. In the **Identifier** text box, paste the **Entity ID**.
    2. In the **Reply URL** text box, paste the **Assertion Consumer Service URL**.
    3. In the **Sign-on URL** text box, type the URL: `https://app.terraform.io/session`
    4. Select **Save**.
4. In the app's overview page, find the **Manage** section and select **Users and groups**.
5. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
6. In the **Users and groups** dialog, select your user from the Users list, then click the **Select** button at the bottom of the screen.
7. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
8. In the **Add Assignment** dialog, click the **Assign** button.

## Configuration (Terraform Cloud)

1. [Verify](./testing.html) your settings and click "Enable".

2. Your Azure SSO configuration is complete and ready to [use](../single-sign-on.html#signing-in-with-sso).

    ![sso-settings](../images/sso/settings-azure.png)

## Team and Username Attributes

To configure team management in your Microsoft Azure AD application:
1. Navigate to the single sign-on page.
1. Edit step 2, "User Attributes & Claims."
1. We recomoned naming it "MemberOf", leaving the namespace blank, and potentially sourcing `user.assignedroles` as an easy starting point.

If you plan to make use of SAML to set usernames in your Microsoft Azure AD application:
1. Navigate to the single sign-on page.
1. Edit step 2, "User Attributes & Claims"
1. We recomend naming the claim "Username", leaving the namespace blank, and sourcing something like `user.displayname` or `user.mailnickname`.


If you namespaced any of your claims, note that the attribute name passed by Microsoft Azure AD will follow the form `<claim_namespace/claim_name>`. Consider this when setting Team and Username attribute names.
