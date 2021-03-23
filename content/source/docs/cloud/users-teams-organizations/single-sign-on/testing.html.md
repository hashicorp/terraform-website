---
layout: "cloud"
page_title: "Testing - Single Sign-on - Terraform Cloud and Terraform Enterprise"
---

# Single Sign-on: Testing

-> **NOTE:** In an effort to protect users from enabling faulty SAML configurations, Terraform Cloud requires a successful test attempt before enabling is possible.

To test a completed SSO configuration, click "Test" on the SSO settings page.

- This will attempt to initiate SSO sign-in with your IdP.
- You will be redirected briefly to your IdP. You may need to reauthenticate depending on your session context.
- Finally you should be redirected back to the Terraform Cloud settings SSO page with a message about a successful test and the "Enable" action should now be accessible.

If a successfully tested SSO configuration is changed in ways that may impact its ability to work correctly, the configuration will revert to an untested state.
