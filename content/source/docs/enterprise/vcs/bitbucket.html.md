---
layout: "enterprise"
page_title: "Bitbucket Cloud - VCS Integrations - Terraform Enterprise"
sidebar_current: "docs-enterprise-vcs-bitbucket-cloud"
description: |-
  Bitbucket Cloud repositories can be integrated with Terraform Enterprise by using push command.
---
# Bitbucket Cloud

Bitbucket Cloud can be used to import Terraform configuration, automatically
queuing runs when changes are merged into a repository's default branch.
Additionally, plans are run when a pull request is created or updated. Terraform
Enterprise will update the pull request with the result of the Terraform plan
providing quick feedback on proposed changes.

## Setup an Organization to use Bitbucket Cloud

### Create a Bitbucket Cloud OAuth Consumer

You need to register Terraform Enterprise as an OAuth consumer within your Bitbucket Cloud account. Proceed to https://bitbucket.org/account/user/your-username/oauth-consumers/new. Fill out the form with the following information.

- **Name**: Terraform Enterprise (or whatever you want)
- **Callback URL**: Skip this one for now. You will need to come back and fill it in later.

The following **Permissions** are required:

- **Account**: Email, Read, Write
- **Repositories**: Read, Write, Admin
- **Pull requests**: Read, Write
- **Webhooks**: Read and write

Upon saving, you will be redirected to https://bitbucket.org/account/user/your-username/api. 

1. Scroll down to the **OAuth consumers** section and click on the consumer you just created
2. Copy the **Key** and **Secret**
3. Leave this tab open in your browser as you will need to return to it in a moment.

### Create a Terraform Enterprise OAuth Client

In a new tab, navigate to https://atlas.hashicorp.com/settings and, in the left-side panel, select the Organization that you’d like to setup to use with Bitbucket Cloud. Then click on **Configuration** in the left-side panel.

Scroll down to the **Add OAuthClient** pane and fill out the form with the following information.

- **Oauth client**: Bitbucket Cloud
- **Application key**: Key (from Bitbucket Cloud in the previous section)
- **Base url**: https://bitbucket.org
- **Api url**: https://api.bitbucket.org/2.0
- **Application secret**: Secret (from Bitbucket Cloud in the previous section)

Once you have created your client, you will be redirected back to the **Configuration** page for your chosen Organization. On that page, find the **OAuth Clients** pane and copy the **Callback url** for Bitbucket Cloud. Leave this tab open in your browser as you will need to return to it in a moment.

Back in the open Bitbucket tab, select the Terraform Enterprise OAuth consumer and click edit. Enter the **Callback url** you just copied in the field labeled **Callback URL**. Save the OAuth consumer.

### Connect a Bitbucket Cloud User to Organization

Back on the **Configuration** page for your Terraform Enterprise Organization, in the **OAuth Connections** pane, you can now connect your organization to Bitbucket Cloud by clicking **Connect**. You will be briefly redirected to Bitbucket Cloud in order to authenticate the client. You should be successfuly redirected back to Terraform Enterprise. If you are not, check the values in your OAuth client and make sure they match exactly with the values associated with your Bitbucket OAuth consumer.

The Terraform Enterprise Bitbucket Cloud integration is now ready your Organization to start using.

## Connecting Configurations

Once you have linked a Bitbucket installation to your Organization,
you are ready to begin creating Packer Builds and Terraform Environments linked
to your desired Bitbucket Cloud repository.

Terraform Enterprise environments are linked to individual Bitbucket Cloud repositories.
However, a single Bitbucket Cloud repository can be linked to multiple environments
allowing a single set of Terraform configuration to be used across multiple
environments.

Environments can be linked when they're initially created using the New
Environment process. Existing environments can be linked by setting Bitbucket Cloud
details in their **Integrations**.

To link a Terraform Enterprise environment to a Bitbucket Cloud repository, you need
three pieces of information:

- **Bitbucket Cloud repository** - The location of the repository being imported in the
format _username/repository_.

- **Bitbucket Cloud branch** - The branch from which to ingress new versions. This
defaults to the value Bitbucket Cloud provides as the default branch for this repository.

- **Path to directory of Terraform files** - The repository's subdirectory that
contains its terraform files. This defaults to the root of the repository.

**Note**: Users creating, updating, or deleting webhooks via the API must have `owner` or `admin` permissions enabled on the target Bitbucket Cloud repository. To update user permissions on the target repository the repository owner can visit: https://bitbucket.org/your-username/your-repository/admin/access

### Connecting a Bitbucket Cloud Repository to a Terraform Environment

Navigate to https://atlas.hashicorp.com/configurations/import and select Link to Bitbucket Cloud. A menu will appear asking you to name the environment. Then use the autocomplete field for repository and select the repository for which you'd like to create a webhook & environment. If you do not see the repository you would like to connect to in the drop down, manually enter it using the format: username/repository. If necessary, fill out information about the VCS branch to pull from as well as the directory where the Terraform files live within the repository. Click Create and Continue.

Upon success, you will be redirected to the environment's runs page (https://atlas.hashicorp.com/terraform/your-organization/environments/your-environment/changes/runs). A message will display letting you know that the repository is ingressing from Bitbucket and once finished you will be able to Queue, Run, & Apply a Terraform Plan. Depending on your webhook settings, changes will be triggered through git events on the specified branch.

The events currently supported are repository and branch push, pull request, and merge.

### Connecting a Bitbucket Cloud Repository to a Packer Build Configuration

Navigate to https://atlas.hashicorp.com/builds/new and select the organization for which you'd like to create a build configuration. Name your build & select Connect build configuration to a Git Repository. A form will appear asking you to select your Git Host. Select Bitbucket Cloud.

Choose the repository for which you'd like to create a webhook. Fill out any other information in the form such as preferred branch to build from (your default branch will be selected should this field be left blank), Packer directory, and Packer Template.

Upon clicking Create you will be redirected to the build configuration (https://atlas.hashicorp.com/packer/your-organization/build-configurations/your-build-configuration). On this page, you will have the opportunity to make any changes to your packer template, push changes via the CLI, or manually queue a Packer build.

Depending on your webhook settings, changes will be triggered through git events on the specified branch. The events currently supported are repository and branch push, pull request, and merge.