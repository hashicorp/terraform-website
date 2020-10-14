---
layout: "cloud"
page_title: "Testing a SAML Configuration"
---

-> **NOTE:** In an effort to protect users from enabling faulty SAML configurations, Terraform Cloud requires a succesful test SSO attempt before enabling is possible.

To test a completed SAML configuration, click the test link in the settings/SSO page.
* This will attempt to initiate SSO sign-in with your IdP.
* You will be redirected briefly to your IdP. You may need to reauthenticate depending on your session context.
* Finally you should be redirected back to the Terraform Cloud settings SSO page with a message about a successful test and the "enable" action should now be accessible.

If a successfully tested SAML configuration is changed in ways that may impact its ability to work correctly, the configuration will revert to an untested state.
