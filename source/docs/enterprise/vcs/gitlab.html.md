---
layout: "enterprise"
page_title: "GitLab - VCS Integrations - Terraform Enterprise"
sidebar_current: "docs-enterprise-vcs-gitlab"
description: |-
  GitLab.com, GitLab Community, and GitLab Enterprise repositories can be integrated with Terraform Enterprise by using push command.
---

# GitLab.com, GitLab Community, & GitLab Enterprise

GitLab can be used to import Terraform configuration, automatically
queuing runs when changes are merged into a repository's default branch.
Additionally, plans are run when a pull request is created or updated. Terraform
Enterprise will update the pull request with the result of the Terraform plan
providing quick feedback on proposed changes.

## Setup an Organization to use GitLab

### Create a GitLab OAuth Application

You will need to register Terraform Enterprise as an OAuth application within your GitLab account. Proceed to https://gitlab.com/profile/applications (for GitLab.com). Fill out the form with the following information.

- **Name**: Terraform Enterprise (or whatever you want)
- **Redirect URI**: http://example.com (You will need to come back and fill in the real value later)
- **Scopes**: None

Upon saving, you will be redirected to the OAuth application view. Copy the **Application Id** and **Secret**. You will need to enter these values into Terraform Enterprise. Leave this tab open in your browser as you will need to return to it in a moment.


### Create a Terraform Enterprise OAuth Client

In a new tab, navigate to https://atlas.hashicorp.com/settings and, in the left-side panel, select the Organization that you’d like to setup to use with GitLab. Then click on **Configuration** in the left-side panel.

Scroll down to the **Add OAuthClient** pane and fill out the form with the following information.

- **Oauth client**: Your GitLab installation type (e.g. GitLab.com, GitLab Community Edition, or GitLab Enterprise)
- **Application key**: Application Id (from GitLab in the previous section)
- **Base url**: https://gitlab.com (for GitLab.com; If you are using GitLab Community Edition or GitLab Enterprise your URL will be different)
- **Api url**: https://gitlab.com/api/v3 (for GitLab.com; If you are using GitLab Community Edition or GitLab Enterprise your URL will be different)
- **Application secret**: Secret (from GitLab in the previous section)

Once you have created your client, you will be redirected back to the **Configuration** page for your chosen Organization. On that page, find the **OAuth Clients** pane and copy the **Callback url** for GitLab. Leave this tab open in your browser as you will need to return to it in a moment.

Back in the open GitLab tab, select the Terraform Enterprise OAuth application and click edit. Enter the **Callback url** you just copied in the field labeled **Redirect URI**. Save the OAuth application.

### Connect a GitLab User to Organization

Back on the **Configuration** page for your Terraform Enterprise Organization, in the **OAuth Connections** pane, you can now connect your organization to GitLab by clicking **Connect**. You will be briefly redirected to GitLab in order to authenticate the client. You should be successfuly redirected back to Terraform Enterprise. If you are not, check the values in your OAuth client and make sure they match exactly with the values associated with your GitLab OAuth application.

The Terraform Enterprise GitLab integration is now ready your Organization to start using.

## Connecting Configurations

Once you have linked a GitLab installation to your Organization,
you are ready to begin creating Packer Builds and Terraform Environments linked
to your desired GitLab repository.

Terraform Enterprise environments are linked to individual GitLab  repositories.
However, a single GitLab repository can be linked to multiple environments
allowing a single set of Terraform configuration to be used across multiple
environments.

Environments can be linked when they're initially created using the New
Environment process. Existing environments can be linked by setting GitLab
details in their **Integrations**.

To link a Terraform Enterprise environment to a GitLab repository, you need
three pieces of information:

- **GitLab repository** - The location of the repository being imported in the
format _username/repository_.

- **GitLab branch** - The branch from which to ingress new versions. This
defaults to the value GitLab  provides as the default branch for this repository.

- **Path to directory of Terraform files** - The repository's subdirectory that
contains its terraform files. This defaults to the root of the repository.

### Connecting a GitLab Repository to a Terraform Environment

Navigate to https://atlas.hashicorp.com/configurations/import and select Link to GitLab.com (or your preferred GitLab installation). A Menu will appear asking you to name the environment. Then use the autocomplete field for repository and select the repository for which you'd like to create a webhook & environment. If necessary, fill out information about the VCS branch to pull from as well as the directory where the Terraform files live within the repository. `Click Create and Continue`.

Upon success, you will be redirected to the environment's runs page (https://atlas.hashicorp.com/terraform/your-organization/environments/your-environment/changes/runs). A message will display letting you know that the repository is ingressing from GitLab and once finished you will be able to Queue, Run, & Apply a Terraform Plan. Depending on your webhook settings, changes will be triggered through git events on the specified branch. The events currently supported are repository and branch push, merge request, and merge.

### Connecting a GitLab Repository to a Packer Build Configuration

Navigate to https://atlas.hashicorp.com/builds/new and select the organization for which you'd like to create a build configuration. Name your build & select `Connect build configuration to a Git Repository`. A form will appear asking you to select your Git Host. Select your preferred GitLab integration. Choose the repository for which you'd like to create a webhook. Fill out any other information in the form such as preferred branch to build from (your default branch will be selected should this field be left blank), Packer directory, and Packer Template.

Upon clicking `Create` you will be redirected to the build configuration (https://atlas.hashicorp.com/packer/your-organization/build-configurations/your-build-configuration). On this page, you will have the opportunity to make any changes to your packer template, push changes via the CLI, or manually queue a Packer build. Depending on your webhook settings, changes will be triggered through git events on the specified branch. The events currently supported are repository and branch push, merge request, and merge.
