---
layout: "cloud"
page_title: "Two-factor Authentication - Terraform Cloud"
---

# Two-factor Authentication

User accounts can be additionally protected with two-factor authentication (2FA), and an organization owner can make this a requirement for all users.

-> **API:** See the [Update an Organization endpoint](../api/organizations.html#update-an-organization) — the request body's `data.attributes.collaborator-auth-policy` property manages this setting.

## Setting up Two-factor Authentication

To reach your user security settings page, click the user icon in the upper right corner and choose "User Settings" from the menu.

![The two-factor authentication page in user settings](./images/2fa-user-settings.png)

Once on this page you can set-up authentication with either a TOTP-compliant application and/or an SMS-enabled phone number. Choose your preferred authentication method and enter a phone number (optional if using an application), then follow the instructions to finish the configuration. If you are using an application, you must scan a QR code to enable it; for either method, you must enter valid authentication codes to verify a successful set-up.

After you finish, the two-factor authentication settings will change to show your currently configured authentication method. You can click the "Reveal codes" link to view backup codes, or use the "Disable 2FA" button to disable two-factor authentication.

![The two-factor authentication page after successful set-up](./images/2fa-backup-codes.png)

## Logging in with Two-factor Authentication

After two-factor authentication has been successfully set-up you will need to enter the code from your TOTP-compliant application or from an SMS sent to your approved SMS-enabled phone number on login.

If necessary you can also use a backup code by clicking "Use a recovery code". Please remember that each backup code can only be used to log in once.

![The two-factor authentication login page](./images/2fa-user-login.png)

## Requiring Two-factor Authentication for All Users

If you are an organization owner you can require all users within your organization to use two-factor authentication.

To reach your organization settings page, click the name of your organization in the upper left corner and choose "Organization Settings" from the menu. On this page click "Authentication" on the left navigation menu.

![The two-factor authentication organization settings](./images/2fa-org-settings.png)

Click the button "Require two-factor". Please remember that all organization owners must have two-factor authentication on before this can be set.

![The two-factor authentication button for organization 2fa enforcement](./images/2fa-org-button.png)
