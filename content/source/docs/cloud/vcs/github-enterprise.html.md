---
layout: "cloud"
page_title: "GitHub Enterprise - VCS Providers - Terraform Cloud and Terraform Enterprise"
---

# Configuring GitHub Enterprise Access

These instructions are for using an on-premise installation of GitHub Enterprise for Terraform Cloud's VCS features. [GitHub.com has separate instructions,](./github-enterprise.html) as do the [other supported VCS providers.](./index.html)

Configuring a new VCS provider requires permission to manage VCS settings for the organization. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Connecting Terraform Cloud to your VCS involves four steps:

On your VCS | On Terraform Cloud
--|--
&nbsp; | Create a new connection in Terraform Cloud. Get callback URL.
Register your Terraform Cloud organization as a new app. Provide callback URL. Get ID and key. | &nbsp;
&nbsp; | Provide Terraform Cloud with ID and key. Request VCS access.
Approve access request. | &nbsp;

The rest of this page explains the GitHub Enterprise versions of these steps.

~> **Important:** Terraform Cloud needs to contact your GitHub Enterprise instance during setup and during normal operation. For the SaaS version of Terraform Cloud, this means GitHub Enterprise must be internet-accessible; for Terraform Enterprise, you must have network connectivity between your Terraform Enterprise and GitHub Enterprise instances.

-> **Note:** Alternately, you can skip the OAuth configuration process and authenticate with a personal access token. This requires using Terraform Cloud's API. For details, see [the OAuth Clients API page](../api/oauth-clients.html).

## Step 1: On Terraform Cloud, Begin Adding a New VCS Provider

1. Open Terraform Cloud in your browser and navigate to the "VCS Providers" settings for your organization. Click the "Add VCS Provider" button.

    If you just created your organization, you might already be on this page. Otherwise:

    1. Make sure the upper-left organization menu currently shows your organization.
    1. Click the "Settings" link at the top of the page (or within the &#9776; menu)
    1. On the next page, click "VCS Providers" in the left sidebar.
    1. Click the "Add VCS Provider" button.

1. The "Add VCS Provider" page is divided into multiple steps to guide you through adding a new VCS provider.

    For the first step, select "GitHub" then select "Github Enterprise" from the dropdown. The page will move to the next step.

1. In the "Set up provider" step, fill in the **HTTP URL** and **API URL** of your GitHub Enterprise instance, as well as an optional **Name** for this VCS connection.

    Field         | Value
    --------------|--------------------------------------------
    HTTP URL      | `https://<GITHUB INSTANCE HOSTNAME>`
    API URL       | `https://<GITHUB INSTANCE HOSTNAME>/api/v3`

    ![Terraform Cloud screenshot: add HTTP URL and API URL fields](./images/ghe-tfe-add-url-fields.png)

Leave the page open in a browser tab. In the next step you will copy values from this page, and in later steps you will continue configuring Terraform Cloud.

## Step 2: On GitHub, Create a New OAuth Application

1. In a new browser tab, open your GitHub Enterprise instance and log in as whichever account you want Terraform Cloud to act as. For most organizations this should be a dedicated service user, but a personal account will also work.

    ~> **Important:** The account you use for connecting Terraform Cloud **must have admin access** to any shared repositories of Terraform configurations, since creating webhooks requires admin permissions.

1. Navigate to GitHub's Register a New OAuth Application page.

    This page is located at `https://<GITHUB INSTANCE HOSTNAME>/settings/applications/new`. You can also reach it through GitHub's menus:
    - In the upper right corner, click your profile picture and choose "Settings."
    - In the navigation sidebar, click "OAuth Apps" (under the "Developer settings" section).
    - In the upper right corner, click the "Register a new application" button.

1. This page has a form with four text fields.

    Fill out the fields with the corresponding values currently displayed in your Terraform Cloud browser tab. Terraform Cloud lists the values in the order they appear, and includes controls for copying values to your clipboard.

    ![GitHub screenshot: New OAuth application fields](./images/gh-fields-empty.png)

    Fill out the text fields as follows:

    Field name                 | Value
    ---------------------------|--------------------------------------------------
    Application Name           | Terraform Cloud (`<YOUR ORGANIZATION NAME>`)
    Homepage URL               | `https://app.terraform.io` (or the URL of your Terraform Enterprise instance)
    Application Description    | Any description of your choice.
    Authorization callback URL | `https://app.terraform.io/<YOUR CALLBACK URL>`

1. Click the "Register application" button, which creates the application and takes you to its page.

1. <a href="./images/tfe_logo.png" download>Download this image of the Terraform logo</a>, upload it with the "Upload new logo" button or the drag-and-drop target, and set the badge background color to `#5C4EE5`. This optional step helps you identify Terraform Cloud's pull request checks at a glance.

1. Leave this page open in a browser tab. In the next step, you will copy and paste the unique **Client ID** and **Client Secret.**

    ![GitHub screenshot: the new application's client ID and client secret](./images/gh-secrets.png)

## Step 3: On Terraform Cloud, Set up Your Provider

1. Enter the **Client ID** and **Client Secret** from the previous step.

    ![Terraform Cloud screenshot: add client fields](./images/ghe-tfe-add-client-fields.png)

1. Click "Connect and continue." This takes you to a page on your GitHub Enterprise instance, asking whether you want to authorize the app.

1. The authorization page lists any GitHub organizations this account belongs to. If there is a "Request" button next to the organization that owns your Terraform code repositories, click it now. Note that you need to do this even if you are only connecting workspaces to private forks of repositories in those organizations since those forks are subject to the organization's access restrictions.  See [About OAuth App access restrictions](https://help.github.com/articles/about-oauth-app-access-restrictions).

    ![GitHub screenshot: the authorization screen](./images/gh-authorize.png)

    If it results in a 500 error, it usually means Terraform Cloud was unable to reach your GitHub Enterprise instance.

1. Click the green "Authorize `<GITHUB USER>`" button at the bottom of the authorization page. GitHub might request your password to confirm the operation.

## Step 4: On Terraform Cloud, Set Up SSH Keypair (Optional)

Most organizations will not need to add an SSH private key. However, if the organization repositories include Git submodules that can only be accessed via SSH, an SSH key can be added along with the OAuth credentials. You can add or update the SSH private key at a later time.

### Important Notes

- SSH will only be used to clone Git submodules. All other Git operations will still use HTTPS.
- Do not use your personal SSH key to connect Terraform Cloud and GitHub Enterprise; generate a new one or use an existing key reserved for service access.
- In the following steps, you must provide Terraform Cloud with the private key. Although Terraform Cloud does not display the text of the key to users after it is entered, it retains it and will use it for authenticating to GitHub Enterprise.
- **Protect this private key carefully.** It can push code to the repositories you use to manage your infrastructure. Take note of your organization's policies for protecting important credentials and be sure to follow them.

### If You Don't Need an SSH Keypair:

1. Click the "Skip and Finish" button. This returns you to Terraform Cloud's VCS Providers page, which now includes your new GitHub Enterprise client.

### If You Do Need an SSH Keypair:

1. On a secure workstation, create an SSH keypair that Terraform Cloud can use to connect to Bitbucket Cloud. The exact command depends on your OS, but is usually something like:
   `ssh-keygen -t rsa -m PEM -f "/Users/<NAME>/.ssh/service_terraform" -C "service_terraform_enterprise"`
   This creates a `service_terraform` file with the private key, and a `service_terraform.pub` file with the public key. This SSH key **must have an empty passphrase**. Terraform Cloud cannot use SSH keys that require a passphrase.

2. While logged into the GitHub Enterprise account you want Terraform Cloud to act as, navigate to the SSH Keys settings page, add a new SSH key and paste the value of the SSH public key you just created.

3. In Terraform Cloud's "Add VCS Provider" page, paste the text of the **SSH private key** you just created, and click the "Add SSH Key" button.

    ![Terraform Cloud screenshot: the ssh key screen](./images/ghe-ssh-key.png)

## Step 5: Contact Your GitHub Organization Admins

If your organization uses OAuth app access restrictions, you had to click a "Request" button when authorizing Terraform Cloud, which sent an automated email to the administrators of your GitHub organization. An administrator must approve the request before Terraform Cloud can access your organization's shared repositories.

If you're a GitHub administrator, check your email now and respond to the request; otherwise, contact whoever is responsible for GitHub accounts in your organization, and wait for confirmation that they've approved your request.

## Finished

At this point, GitHub access for Terraform Cloud is fully configured, and you can create Terraform workspaces based on your organization's shared GitHub Enterprise repositories.
