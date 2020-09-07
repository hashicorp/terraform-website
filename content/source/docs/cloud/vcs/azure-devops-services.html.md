---
layout: "cloud"
page_title: "Azure DevOps Services - VCS Providers - Terraform Cloud and Terraform Enterprise"
---

# Configuring Azure DevOps Services Access

These instructions are for using dev.azure.com for Terraform Cloud's VCS features. [Other supported VCS providers](./index.html) have separate instructions.

Configuring a new VCS provider requires permission to manage VCS settings for the organization. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Connecting Terraform Cloud to your Azure DevOps Services VCS involves four steps:

On your VCS | On Terraform Cloud
--|--
&nbsp; | Create a new connection in Terraform Cloud. Get callback URL.
Register your Terraform Cloud organization as a new app. Get ID and key and provide callback URL. | &nbsp;
&nbsp; | Provide Terraform Cloud with ID and key. Request VCS access.
Approve access request. | &nbsp;

The rest of the page explains these steps in more detail.

~> **Important:** Terraform Cloud only supports Azure DevOps connections which use the `dev.azure.com` domain. If your Azure DevOps project uses the older `visualstudio.com` domain, you will need to migrate using the [steps provided by Microsoft](https://docs.microsoft.com/en-us/azure/devops/release-notes/2018/sep-10-azure-devops-launch#switch-existing-organizations-to-use-the-new-domain-name-url).

## Step 1: On Terraform Cloud, Begin Adding a New VCS Provider

1. Open Terraform Cloud in your browser and navigate to the "VCS Providers" settings for your organization. Click the "Add VCS Provider" button.

    If you just created your organization, you might already be on this page. Otherwise:

    1. Make sure the upper-left organization menu currently shows your organization.
    1. Click the "Settings" link at the top of the page (or within the &#9776; menu)
    1. On the next page, click "VCS Providers" in the left sidebar
    1. Click the "Add a VCS Provider" button

1. The "Add VCS Provider" page is divided into multiple steps to guide you through adding a new VCS provider.

    For the first step, select "Azure DevOps" then select "Azure DevOps Services" from the dropdown. The page will move to the next step.

Leave the page open in a browser tab. In the next step you will copy values from this page, and in later steps you will continue configuring Terraform Cloud.

## Step 2: From your Azure DevOps Services Profile, Create a New Application

1. In a new browser tab, open your [Azure DevOps Services Profile](https://aex.dev.azure.com); log in to your Azure DevOps Services account if necessary.

    ~> **Important:** The Azure DevOps Services account you use for connecting Terraform Cloud must have Project Collection Administrator access to any projects containing repositories of Terraform configurations, since creating webhooks requires admin permissions. It is not possible to create custom access roles with lower levels of privilege, as Microsoft does not currently allow delegation of this capability. If you're unable to load the link above, you can create a new application for the next step at one of the following links: `https://aex.dev.azure.com/app/register?mkt=en-US` or `https://app.vsaex.visualstudio.com/app/register?mkt=en-US`.

1. Click the "Create new application" link at the bottom of the left column under the "Applications and services" header. The next page is a form asking for your company and application information.

    Fill out the fields and checkboxes with the corresponding values currently displayed in your Terraform Cloud browser tab. Terraform Cloud lists the values in the order they appear, and includes controls for copying values to your clipboard.

    Fill in the text fields as follows:

    Field name                               | Value
    -----------------------------------------|--------------------------------------------------
    Company name                             | HashiCorp
    Application Name                         | Terraform Cloud (`<YOUR ORGANIZATION NAME>`)
    Application website                      | `https://app.terraform.io` (or the URL of your Terraform Enterprise instance)
    Authorization callback URL               | `https://app.terraform.io/<YOUR CALLBACK URL>`

    ![Azure DevOps Services Screenshot: Creating a new application in your Azure DevOps Services Profile](./images/azure-devops-services-create-application.png)

    In the "Authorized scopes" section, select only "Code (read)" and "Code (status)" and then click "Create Application."

    ![Azure DevOps Services Screenshot: Required permissions when creating a new application in your Azure DevOps Services Profile](./images/azure-devops-services-application-permissions.png)

    ~> **Important:** Do not add any additional scopes beyond "Code (read)" and "Code (status)," as this can prevent Terraform Cloud from connecting. Note that these authorized scopes cannot be updated after the application is created; to fix incorrect scopes you must delete and re-create the application.

1. After creating the application, the next page displays its details. Leave this page open in a browser tab. In the next step, you will copy and paste the unique **App ID** and **Client Secret** from this page.

    If you accidentally close this details page and need to find it later, you can reach it from the "Applications and Services" links at the bottom left of your profile.

## Step 3: On Terraform Cloud, Set up Your Provider

1. (Optional) Enter a **Name** for this VCS connection.

1. Enter your Azure DevOps Services application's **App ID** and **Client Secret**. These can be found in the application's details, which should still be open in the browser tab from Step 2.

    ![Terraform Cloud screenshot: the ssh key screen](./images/azure-devops-services-tfe-secret.png)

3. Click "Connect and continue." This takes you to a page on Azure DevOps Services, asking whether you want to authorize the app. Click the "Accept" button and you'll be redirected back to Terraform Cloud.

    ![Azure DevOps Services Screenshot: Accepting the terms of use for connecting Terraform Cloud and Azure DevOps Services](./images/azure-devops-services-accept-terms.png)

    -> **Note:** If you receive a 404 error from Azure DevOps Services, it likely means your callback URL has not been configured correctly.

## Step 4: On Terraform Cloud, Set Up SSH Keypair (Optional)

Most organizations will not need to add an SSH private key. However, if the organization repositories include Git submodules that can only be accessed via SSH, an SSH key can be added along with the OAuth credentials. You can add or update the SSH private key at a later time.

### Important Notes

- SSH will only be used to clone Git submodules. All other Git operations will still use HTTPS.
- Do not use your personal SSH key to connect Terraform Cloud and Azure DevOps Services; generate a new one or use an existing key reserved for service access.
- In the following steps, you must provide Terraform Cloud with the private key. Although Terraform Cloud does not display the text of the key to users after it is entered, it retains it and will use it for authenticating to Azure DevOps Services.
- **Protect this private key carefully.** It can push code to the repositories you use to manage your infrastructure. Take note of your organization's policies for protecting important credentials and be sure to follow them.

### If You Don't Need an SSH Keypair:

1. Click the "Skip and Finish" button. This returns you to Terraform Cloud's VCS Providers page, which now includes your new Azure DevOps Services client.

### If You Do Need an SSH Keypair:

1. On a secure workstation, create an SSH keypair that Terraform Cloud can use to connect to Azure DevOps Services.com. The exact command depends on your OS, but is usually something like:
   `ssh-keygen -t rsa -m PEM -f "/Users/<NAME>/.ssh/service_terraform" -C "service_terraform_enterprise"`
   This creates a `service_terraform` file with the private key, and a `service_terraform.pub` file with the public key. This SSH key **must have an empty passphrase**. Terraform Cloud cannot use SSH keys that require a passphrase.

2. While logged into the Azure DevOps Services account you want Terraform Cloud to act as, navigate to the SSH Keys settings page, add a new SSH key and paste the value of the SSH public key you just created.

3. In Terraform Cloud's "Add VCS Provider" page, paste the text of the **SSH private key** you just created, and click the "Add SSH Key" button.

    ![Terraform Cloud screenshot: the ssh key screen](./images/azure-devops-services-ssh-key.png)

## Finished

At this point, Azure DevOps Services access for Terraform Cloud is fully configured, and you can create Terraform workspaces based on your organization's repositories.
