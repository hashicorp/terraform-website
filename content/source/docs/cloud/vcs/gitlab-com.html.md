---
layout: "cloud"
page_title: "GitLab.com - VCS Providers - Terraform Cloud"
---

# Configuring GitLab.com Access

These instructions are for using GitLab.com for Terraform Cloud's VCS features. [GitLab CE and GitLab EE have separate instructions,](./gitlab-eece.html) as do the [other supported VCS providers.](./index.html)

Connecting Terraform Cloud to your VCS involves five steps:

On your VCS                                                                    | On Terraform Cloud
--                                                                             |--
&nbsp;                                                                         | Create a new connection in Terraform Cloud. Get redirect URI.
Register your Terraform Cloud organization as a new app. Provide redirect URI. | &nbsp;
&nbsp;                                                                         | Provide Terraform Cloud with application ID and secret. Request VCS access.
Approve access request.                                                        | &nbsp;

The rest of this page explains the GitLab.com versions of these steps.

-> **Note:** Alternately, you can skip the OAuth configuration process and authenticate with a personal access token. This requires using Terraform Cloud's API. For details, see [the OAuth Clients API page](../api/oauth-clients.html).

## Step 1: On Terraform Cloud, Begin Adding a VCS Provider

1. Open Terraform Cloud in your browser and navigate to the Settings > VCS Providers page for your organization. Click the "Add VCS Provider" button.

    If you just created your organization, you might already be on this page. Otherwise:

    1. Click the upper-left organization menu, making sure it currently shows your organization.
    1. Click the "Settings" link at the top of the page (or within the &#9776; menu)
    1. On the next page, click "VCS Provider" in the left sidebar.
    1. Click the "Add VCS Provider" button.

2. The next page has several steps to guide you through adding a new VCS provider. Select "GitLab" then select "GitLab.com" from the dropdown.

4. Locate the "Redirect URI," and copy it to your clipboard; you'll paste it in the next step. Leave this page open in a browser tab.

    ![Terraform Cloud screenshot: redirect uri](./images/gitlab-com-tfe-callback-url.png)
    
## Step 2: On GitLab, Create a New Application

1. Open [gitlab.com](https://gitlab.com) in your browser and log in as whichever account you want Terraform Cloud to act as. For most organizations this should be a dedicated service user, but a personal account will also work.

    ~> **Important:** The account you use for connecting Terraform Cloud **must have admin (master) access** to any shared repositories of Terraform configurations, since creating webhooks requires admin permissions.

2. Navigate to GitLab's [User Settings > Applications](https://gitlab.com/profile/applications) page.

    This page is located at <https://gitlab.com/profile/applications>. You can also reach it through GitLab's menus:
    - In the upper right corner, click your profile picture and choose "Settings."
    - In the navigation sidebar, click "Applications."

3. This page has a list of applications and a form for adding new ones. The form has two text fields and some checkboxes.

    ![GitLab screenshot: new application fields](./images/gitlab-application-settings.png)

    Fill out the form as follows:

    Field                   | Value
    ------------------------|--------------------------------------------------
    Name                    | Terraform Cloud (`<YOUR ORGANIZATION NAME>`)
    Redirect URI            |`https://app.terraform.io/<YOUR CALLBACK URL>`, the redirect URI you copied from Terraform Cloud
    Confidential (checkbox) | ✔️ (enabled)
    Scopes (all checkboxes) | (empty)

4. Click the "Save application" button, which creates the application and takes you to its page.

5. Leave this page open in a browser tab. In the next step, you will copy and paste the unique **Application ID** and **Secret.**

    ![GitLab screenshot: the new application's application ID and secret](./images/gitlab-application-created.png)

## Step 3: On Terraform Cloud, Set up Your Provider

1. Enter the **Application ID** and **Secret** from the previous step, as well as an option **Name** for this VCS connection.

    ![Terraform Cloud screenshot: add client fields](./images/gitlab-com-tfe-add-client-fields.png)

2. Click "Connect and continue." This takes you to a page on GitLab.com, asking whether you want to authorize the app.
                                 
    ![GitLab screenshot: the authorization screen](./images/gitlab-authorize.png)
    
3. Click the green "Authorize" button at the bottom of the authorization page. This returns you to Terraform Cloud's VCS Provider page, which now includes your new GitLab client.

## Finished

At this point, GitLab.com access for Terraform Cloud is fully configured, and you can create Terraform workspaces based on your organization's shared repositories.

