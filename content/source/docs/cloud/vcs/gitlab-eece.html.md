---
layout: "cloud"
page_title: "GitLab EE and CE - VCS Providers - Terraform Cloud and Terraform Enterprise"
---

# Configuring GitLab EE and CE Access

These instructions are for using an on-premise installation of GitLab Enterprise Edition (EE) or GitLab Community Edition (CE) for Terraform Cloud's VCS features. [GitLab.com has separate instructions,](./gitlab-com.html) as do the [other supported VCS providers.](./index.html)

Configuring a new VCS provider requires permission to manage VCS settings for the organization. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Connecting Terraform Cloud to your VCS involves four steps:

On your VCS | On Terraform Cloud
--|--
&nbsp; | Create a new connection in Terraform Cloud. Get redirect URI.
Register your Terraform Cloud organization as a new app. Provide redirect URI. Get ID and key. | &nbsp;
&nbsp;  | Provide Terraform Cloud with application ID and secret. Request VCS access.
Approve access request. | &nbsp;

The rest of this page explains the on-premise GitLab versions of these steps.

~> **Important:** Terraform Cloud needs to contact your GitLab instance during setup and during normal operation. For the SaaS version of Terraform Cloud, this means GitLab must be internet-accessible; for Terraform Enterprise, you must have network connectivity between your Terraform Enterprise and GitLab instances.

-> **Note:** Alternately, you can skip the OAuth configuration process and authenticate with a personal access token. This requires using Terraform Cloud's API. For details, see [the OAuth Clients API page](../api/oauth-clients.html).

-> **Version Note:** Terraform Cloud supports GitLab versions 9.0 and newer. HashiCorp does not test older versions of GitLab with Terraform Cloud, and they might not work as expected. Also note that, although we do not deliberately remove support for versions that have reached end of life (per the [GitLab Support End of Life Policy](https://docs.gitlab.com/ee/policy/maintenance.html#patch-releases)), our ability to resolve customer issues with end of life versions might be limited.

## Step 1: On Terraform Cloud, Begin Adding a New VCS Provider

1. Open Terraform Cloud in your browser and navigate to the "VCS Providers" settings for your organization. Click the "Add VCS Provider" button.

    If you just created your organization, you might already be on this page. Otherwise:

    1. Make sure the upper-left organization menu currently shows your organization.
    1. Click the "Settings" link at the top of the page (or within the &#9776; menu)
    1. On the next page, click "VCS Providers" in the left sidebar.
    1. Click the "Add VCS Provider" button.

1. The "Add VCS Provider" page is divided into multiple steps to guide you through adding a new VCS provider.

    For the first step, select "GitLab" then select "GitLab Enterprise Edition" or "GitLab Community Edition" from the dropdown. The page will move to the next step.

1. In the "Set up provider" step, fill in the **HTTP URL** and **API URL** of your GitLab Enterprise Edition or GitLab Community Edition instance, as well as an optional **Name** for this VCS connection. Click "Continue."

    Field          | Value
    ---------------|--------------------------------------------
    HTTP URL       | `https://<GITLAB INSTANCE HOSTNAME>`
    API URL        | `https://<GITLAB INSTANCE HOSTNAME>/api/v4`

    ![Terraform Cloud screenshot: add HTTP URL and API URL fields](./images/gitlab-eece-tfe-add-url-fields.png)

    Note that Terraform Cloud uses GitLab's v4 API.

Leave the page open in a browser tab. In the next step you will copy values from this page, and in later steps you will continue configuring Terraform Cloud.

## Step 2: On GitLab, Create a New Application

1. In a new browser tab, open your GitLab instance and log in as whichever account you want Terraform Cloud to act as. For most organizations this should be a dedicated service user, but a personal account will also work.

    ~> **Important:** The account you use for connecting Terraform Cloud **must have admin (master) access** to any shared repositories of Terraform configurations, since creating webhooks requires admin permissions. Do not create the application as an administrative application not owned by a user; Terraform Cloud needs user access to repositories to create webhooks and ingress configurations.

    ~> **Important**: In GitLab CE or EE 10.6 and up, you may also need to enable **Allow requests to the local network from hooks and services** on the "Outbound requests" section inside the Admin area under Settings (`/admin/application_settings`). Refer to [the GitLab documentation](https://docs.gitlab.com/ee/security/webhooks.html) for details.

1. Navigate to GitLab's "User Settings > Applications" page.

    This page is located at `https://<GITLAB INSTANCE HOSTNAME>/profile/applications`. You can also reach it through GitLab's menus:
    - In the upper right corner, click your profile picture and choose "Settings."
    - In the navigation sidebar, click "Applications."

1. This page has a list of applications and a form for adding new ones. The form has two text fields and some checkboxes.

    Fill out the fields and checkboxes with the corresponding values currently displayed in your Terraform Cloud browser tab. Terraform Cloud lists the values in the order they appear, and includes controls for copying values to your clipboard.

    ![GitLab screenshot: new application fields](./images/gitlab-application-settings.png)

    Fill out the form as follows:

    Field                   | Value
    ------------------------|--------------------------------------------------
    Name                    | Terraform Cloud (`<YOUR ORGANIZATION NAME>`)
    Redirect URI            |`https://app.terraform.io/<YOUR CALLBACK URL>`
    Confidential (checkbox) | ✔️ (enabled)
    Scopes (all checkboxes) | (empty)

1. Click the "Save application" button, which creates the application and takes you to its page.

1. Leave this page open in a browser tab. In the next step, you will copy and paste the unique **Application ID** and **Secret.**

    ![GitLab screenshot: the new application's application ID and secret](./images/gitlab-application-created.png)

## Step 3: On Terraform Cloud, Set up Your Provider

1. On the "Configure settings" step on Terraform Cloud, enter the **Application ID** and **Secret** from the previous step.

    ![Terraform Cloud screenshot: add Application ID and Secret fields](./images/gitlab-eece-tfe-add-client-fields.png)

1. Click "Connect and continue." This takes you to a page on GitLab asking whether you want to authorize the app.

    ![GitLab screenshot: the authorization screen](./images/gitlab-authorize.png)

    If this results in a 500 error, it usually means Terraform Cloud was unable to reach your GitLab instance.

1. Click the green "Authorize" button at the bottom of the authorization page.

## Step 4: On Terraform Cloud, Set Up a PEM formatted SSH Keypair (Optional)

Most organizations will not need to add an SSH private key. However, if the organization repositories include Git submodules that can only be accessed via SSH, an SSH key can be added along with the OAuth credentials. You can add or update the SSH private key at a later time.

### Important Notes

- SSH will only be used to clone Git submodules. All other Git operations will still use HTTPS.
- Do not use your personal SSH key to connect Terraform Cloud and GitLab; generate a new one or use an existing key reserved for service access.
- In the following steps, you must provide Terraform Cloud with the private key. Although Terraform Cloud does not display the text of the key to users after it is entered, it retains it and will use it for authenticating to GitLab.
- **Protect this private key carefully.** It can push code to the repositories you use to manage your infrastructure. Take note of your organization's policies for protecting important credentials and be sure to follow them.

### If You Don't Need a PEM formatted SSH Keypair:

1. Click the "Skip and Finish" button. This returns you to Terraform Cloud's VCS Providers page, which now includes your new GitLab client.

### If You Do Need aa PEM formatted SSH Keypair:

1. On a secure workstation, create a PEM formatted SSH keypair that Terraform Cloud can use to connect to GitLab. The exact command depends on your OS, but is usually something like:
   `ssh-keygen -t rsa -m PEM -f "/Users/<NAME>/.ssh/service_terraform" -C "service_terraform_enterprise"`
   This creates a `service_terraform` file with the private key, and a `service_terraform.pub` file with the public key. This SSH key **must have an empty passphrase**. Terraform Cloud cannot use SSH keys that require a passphrase.

2. While logged into the GitLab account you want Terraform Cloud to act as, navigate to the SSH Keys settings page, add a new SSH key and paste the value of the SSH public key you just created.

3. In Terraform Cloud's "Add VCS Provider" page, paste the text of the **SSH private key** you just created, and click the "Add SSH Key" button. This returns you to Terraform Cloud's VCS Provider page, which now includes your new GitLab client.

    ![Terraform Cloud screenshot: the ssh key screen](./images/gitlab-eece-ssh-key.png)

## Finished

At this point, GitLab access for Terraform Cloud is fully configured, and you can create Terraform workspaces based on your organization's shared repositories.

