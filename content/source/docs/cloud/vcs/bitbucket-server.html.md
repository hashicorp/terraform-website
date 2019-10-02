---
layout: "cloud"
page_title: "Bitbucket Server and Data Center - VCS Providers - Terraform Cloud"
---


# Configuring Bitbucket Server/Data Center Access

These instructions are for using **Bitbucket Server** for Terraform Cloud's VCS features. 

These instructions also apply to **Bitbucket Data Center,** which is a variant of Bitbucket Server that supports clustering. Terraform Cloud treats these two products identically, and Bitbucket Data Center users will select **Bitbucket Server** as their VCS Provider type. Unless stated otherwise, any reference to Bitbucket Server in this document also applies to Bitbucket Data Center.

[Bitbucket Cloud has separate instructions,](./bitbucket-cloud.html) as do the [other supported VCS providers.](./index.html)

Note that Bitbucket Server requires both OAuth authentication and an SSH key. The instructions below include SSH key configuration.

-> **Version note:** Terraform Cloud supports Bitbucket Server versions 4.9.1 and newer, and Bitbucket Data Center versions 5.4.0 and newer. HashiCorp does not test older versions of Bitbucket Server with Terraform Cloud, and they might not work as expected. Also note that, although we do not deliberately remove support for versions that have reached end of life (per the [Atlassian Support End of Life Policy](https://confluence.atlassian.com/support/atlassian-support-end-of-life-policy-201851003.html)), our ability to resolve customer issues with end of life versions might be limited.

~> **Important:** Terraform Cloud needs to contact your Bitbucket Server instance during setup and during normal operation. For the SaaS version of Terraform Cloud, this means Bitbucket Server must be internet-accessible; for Terraform Enterprise, you must have network connectivity between your Terraform Enterprise and Bitbucket Server instances over both SSH and HTTP or HTTPS. Bitbucket Server repository clone operations are performed over SSH on the port the Bitbucket Server instance uses.

## Before You Begin: Determine Your Bitbucket Server Version

Terraform Cloud requires support for the delivery of webhooks to perform many operations, including tracking newly available configuration versions. When using Bitbucket Server version 5.3 or lower, Atlassian's webhooks plugin is required to be configured on Bitbucket Server. If using version 5.4 or higher, no plugin is required, as webhooks are supported natively.

1. Open your Bitbucket server instance in your browser and log in as an admin user.
2. In the footer of every page is a reference to the instance's current version. **If your version is greater than v5.4.0, you may skip all remaining steps in this section.**
3. Go to the "Manage add-ons" page. You can click the gear icon in the upper right corner and then use the "Manage add-ons" link in the sidebar, or go directly to `https://<BITBUCKET INSTANCE HOSTNAME>/plugins/servlet/upm`.
4. Look for an add-on named "Web Post Hooks for Bitbucket Server", and make sure it is installed and enabled. The plugin is disabled by default. Clicking `Enabled` will toggle the plugin on.
5. If the plugin isn't present, click "Find new add-ons" in the sidebar navigation. Search for the plugin by name and install it.

    Make sure to install the correct plugin. Terraform Cloud is designed to work with [Web Post Hooks for Bitbucket Server by Atlassian ](https://marketplace.atlassian.com/apps/1211539/web-post-hooks-for-bitbucket-server?hosting=server&tab=overview).

    ![Atlassian Marketplace screenshot: the Web Post Hooks for Bitbucket Server plugin, published by Atlassian](./images/bitbucket-server-webhooks-plugin.png)

6. Visit the repository's settings, click on `Hooks` and check that the plugin is *enabled* there as well.

There is an option to configure a `webhook URL` on the plugin. Leave this optional field blank. Terraform Cloud will dynamically update the `webhook URL` after the VCS connection is established.

Leave the page open in a browser tab, and remain logged in as an admin user.

## Step 1: On Terraform Cloud, Add a VCS Provider

1. Open Terraform Cloud in your browser and navigate to the "VCS Provider" settings for your organization. Click the "Add VCS Provider" button.

    If you just created your organization, you might already be on this page. Otherwise:

    1. Click the upper-left organization menu, making sure it currently shows your organization.
    1. Click the "Settings" link at the top of the page (or within the &#9776; menu)
    1. On the next page, click "VCS Provider" in the left sidebar.
    1. Click the "Add VCS Provider" button.

2. The next page has a drop-down and several text fields. Select "Bitbucket Server" from the drop-down.

3. (Optional) Enter a display name for your Bitbucket Server VCS Provider.

4. Enter the URL of your Bitbucket Server instance in the HTTP URL and API URL fields. The API URL should be the same as the HTTP URL.

    ~> **Note:** If Bitbucket Server isn't accessible on the standard ports (for example, if it's using its default ports of 7990 or 8443 and is not behind a reverse proxy), make sure to specify the port in the URL. If you omit the port in the URL, Terraform Cloud uses the standard port for the protocol (80 for HTTP, 443 for HTTPS).

    ![Terraform Cloud screenshot: text fields for adding a Bitbucket Server VCS provider](./images/bitbucket-server-tfe-add-client-fields.png)

6. Click "Create VCS Provider." This will take you back to the VCS Provider page, which now includes your new Bitbucket Server client.

7. Leave this page open in a browser tab. In the next step, you will copy and paste the unique **Consumer Key** and **Public Key.**

    ![Terraform Cloud screenshot: Consumer key and public key](./images/bitbucket-server-tfe-consumer-and-public-key.png)

## Step 2: On Bitbucket Server, Create a New Application Link

1. While logged in as an admin user, go to Bitbucket Server's "Application Links" administration page. You can use the sidebar navigation in the admin pages, or go directly to `https://<BITBUCKET INSTANCE HOSTNAME>/plugins/servlet/applinks/listApplicationLinks`.

    This page has a text field for creating a new application link, followed by a list of existing application links.

    ![Bitbucket Server screenshot: The application links page](./images/bitbucket-server-application-links.png)

2. Enter Terraform Cloud's URL in the text field (`https://app.terraform.io`, or the hostname of your Terraform Enterprise instance) and click the "Create new link" button.

    ~> **Note:** If you're connecting multiple Terraform Cloud organizations to the same Bitbucket Server instance, you can only use Terraform Cloud's main URL once. For subsequent organizations, you can enter the organization URL instead. Organization URLs look like `https://app.terraform.io/app/<ORG NAME>` or `https://<TFE HOSTNAME>/app/<ORG NAME>` — it's the page Terraform Cloud's "Workspaces" button takes you to.

3. In the "Configure application URL" dialog, confirm that you wish to use the URL exactly as you entered it. If you used Terraform Cloud's main URL, click "Continue;" if you used an organization URL, click the "Use this URL" checkbox and then click "Continue."

    ![Bitbucket Server screenshot: confirming main URL](./images/bitbucket-server-confirm-url-1.png)
    ![Bitbucket Server screenshot: confirming organization URL](./images/bitbucket-server-confirm-url-2.png)

4. In the "Link applications" dialog, fill out the form fields as follows:

    Field                           | Value
    --------------------------------|------------------------------------
    Application Name (text)         | Terraform Cloud (`<ORG NAME>`)
    Application Type (drop-down)    | Generic Application
    Create incoming link (checkbox) | ✔️ (enabled)

    Leave all the other fields blank, and click "Continue."

    ![Bitbucket Server screenshot: filling the first page of the link applications form](./images/bitbucket-server-link-applications-1.png)

5. This takes you to another dialog, also titled "Link applications," with three text fields. In the "Consumer Key" and "Public Key" fields, copy and paste the values from step 2. In the "Consumer Name" field, enter "Terraform Cloud (`<ORG NAME>`)." Click "Continue."

    ![Bitbucket Server screenshot: filling the second page of the link applications form](./images/bitbucket-server-link-applications-2.png)

## Step 3: On Workstation: Create an SSH Key for Terraform Cloud

On a secure workstation, create an SSH keypair that Terraform Cloud can use to connect to Bitbucket Server. The exact command depends on your OS, but is usually something like `ssh-keygen -t rsa -f "/Users/<NAME>/.ssh/service_terraform" -C "service_terraform_enterprise"`. This creates a `service_terraform` file with the private key, and a `service_terraform.pub` file with the public key.

This SSH key **must have an empty passphrase.** Terraform Cloud cannot use SSH keys that require a passphrase.

### Important Notes

- Do not use your personal SSH key to connect Terraform Cloud and Bitbucket Server; generate a new one or use an existing key reserved for service access.
- In the following steps, you must provide Terraform Cloud with the private key. Although Terraform Cloud does not display the text of the key to users after it is entered, it retains it and will use it for authenticating to Bitbucket Server.
- **Protect this private key carefully.** It can push code to the repositories you use to manage your infrastructure. Take note of your organization's policies for protecting important credentials and be sure to follow them.

## Step 4: On Bitbucket Server, Switch Users and Add an SSH Key

1. If you are still logged in to Bitbucket Server as an administrator, log out now.
2. Log in as whichever account you want Terraform Cloud to act as. For most organizations this should be a dedicated service user, but a personal account will also work.

    ~> **Important:** The account you use for connecting Terraform Cloud **must have admin access** to any shared repositories of Terraform configurations, since creating webhooks requires admin permissions.

3. Go to the "SSH keys" page. You can click the profile icon in the upper right corner, choose "Manage account," then click "SSH keys" in the sidebar navigation, or you can go directly to `https://<BITBUCKET INSTANCE HOSTNAME>/plugins/servlet/ssh/account/keys`.

    ![Bitbucket Server sceenshot: the SSH keys page](./images/bitbucket-server-ssh-keys.png)

4. Click the "Add key" button. Paste the text of the **SSH public key** you created in step 4 (from the `.pub` file) into the text field, then click the "Add key" button to confirm.

## Step 5: On Terraform Cloud, Request Access and Add an SSH Private Key

1. Go back to your Terraform Cloud browser tab and click the "Connect organization `<NAME>`" button on the VCS Provider page.

    ![Terraform Cloud screenshot: the connect organization button](./images/tfe-connect-orgname.png)

    This takes you to a page on your Bitbucket Server instance, asking if you want to authorize Terraform Cloud. Double-check that you're logged in as the user account Terraform Cloud will be using, and not as a Bitbucket administrator.

    ![Bitbucket Server screenshot: the authorization page](./images/bitbucket-server-authorize.png)

2. Click the "Allow" button. This returns you to Terraform Cloud's VCS Provider page, where the Bitbucket Server client's information has been updated.

    If this results in a 500 error, it usually means Terraform Cloud was unable to reach your Bitbucket Server instance.

3. Click the "Add a private SSH key" link. A large text field will appear. Paste the text of the **SSH private key** you created in step 4, and click the "Add SSH Key" button.

    ![Terraform Cloud screenshot: Pasting an SSH private key](./images/bitbucket-server-tfe-add-private-key.png)

    ~> **Note:** By default setting as per document [here](https://confluence.atlassian.com/bitbucketserverkb/which-ports-does-bitbucket-server-listen-on-and-what-are-they-used-for-806029586.html), Bitbucket Server also requires SSH communication in which listen on port 7999, PTFE communicates with Bitbucket Server over SSH port in order to ingress project repositories which takes place when creating workspace or module. Please ensure the port is accessible from PTFE, either directly or via loadbalancer depending on architecture of your Bitbucket Server  environment. 

## Finished

At this point, Bitbucket Server access for Terraform Cloud is fully configured, and you can create Terraform workspaces based on your organization's shared repositories.

