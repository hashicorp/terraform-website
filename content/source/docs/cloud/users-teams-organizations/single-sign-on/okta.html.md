---
layout: "cloud"
page_title: "Okta - Single Sign-on - Terraform Cloud and Terraform Enterprise"
---

-> **Note:** Single sign-on is a paid feature, available as part of the **Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

# Single Sign-on: Okta

The Okta SSO integration currently supports the following SAML features:

- Service Provider (SP)-initiated SSO
- Identity Provider (IdP)-initiaited SSO
- Just-in-Time Provisioning

For more information on the listed features, visit the [Okta Glossary](https://help.okta.com/en/prod/Content/Topics/Reference/glossary.htm).

## Configuration (Okta)

1. From your Okta Admin Dashboard, click the "Add Applications" shortcut.
2. Search for "Terraform Cloud" and select it.
3. Click "Add" on the application's page.
4. Choose a label for your application or keep the default, "Terraform Cloud".
5. Click "Done".
6. Visit the "Sign On" tab in the application.
7. Copy the "Identity Provider Metadata" URL.

For information on configuring automated Team Mapping using Okta Group Membership, please see the 'Configuration - Team Mapping (Okta)' section below. 

## Configuration (Terraform Cloud)

Be sure to copy the metadata URL (from the final step of configuring Okta) before proceeding with the following steps.

1. Visit your organization settings page and click "SSO".

2. Click "Setup SSO".

    ![sso-setup](../images/sso/setup.png)

3. Select "Okta" and click "Next".

    ![sso-wizard-choose-provider-okta](../images/sso/wizard-choose-provider-okta.png)

4. Provide your Okta metadata URL and click the "Save settings" button.

    ![sso-wizard-configure-settings-okta](../images/sso/wizard-configure-settings-okta.png)

5. [Verify](./testing.html) your settings and click "Enable".

6. Your Okta SSO configuration is complete and ready to [use](../single-sign-on.html#using-sso).

    ![sso-settings](../images/sso/settings-okta.png)

## Configuration - Team Mapping (Okta)
1. Complete all steps outlined in the [Configuration (Okta)](okta.html#configuration-okta-) section above, and take note of the default team mapping behavior as described [here](../single-sign-on.html#managing-team-membership-through-sso).

2. Edit your Terraform Cloud Okta Application and complete the following steps:
* Expand the `Attributes` section of the Application configuration (under the `Sign On` tab):

* Set the `Group Attribute` Statements to the following:
** Name: MemberOf
** Name format: Basic
** Filter: Matches regex
** Filter value: .*

Once these configure steps have been completed, ALL Okta groups to which a given User belongs will be passed in the SAML assertion upon login to Terraform Cloud, which means that User will get added automatically to any Teams within Terraform Cloud for which there’s an **exact** name match.  

Using the above SAML assertion as an example, the User in question would get added to the `Everyone`, `ops`, and `test` Teams in Terraform Cloud if those Teams exist in the target Organization, but those values will simply be ignored if no matching Team name is found.
