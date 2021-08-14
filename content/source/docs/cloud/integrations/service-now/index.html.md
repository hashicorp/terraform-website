---
layout: "cloud"
page_title: "Setup Instructions - ServiceNow Service Catalog Integration - Terraform Cloud and Terraform Enterprise"
description: |-
  ServiceNow integration enables your users to order Terraform-built infrastructure from ServiceNow
---

# Terraform ServiceNow Service Catalog Integration Setup Instructions

-> **Integration version:**  v2.1.0

The Terraform ServiceNow Service Catalog integration enables your end-users to
provision self-serve infrastructure via ServiceNow. By connecting ServiceNow to
Terraform Cloud, this integration lets ServiceNow users order Service
Items, create workspaces, and perform Terraform runs using prepared Terraform
configurations hosted in VCS repositories.

-> **Note:** The v1.x integration is deprecated, but documentation for existing
installations can be found [here](service-now-v1/index.html)

-> **Note:** The ServiceNow Catalog integration is supported with Terraform
Enterprise or the Terraform Cloud Business Tier. This documentation uses
"Terraform Cloud" to refer to either edition.

## Summary of the Setup Process

The integration relies on Terraform ServiceNow Catalog integration software
installed within your ServiceNow instance. Installing and configuring this
integration requires administration in both ServiceNow and Terraform Cloud.
Since administrators of these services within your organization are not
necessarily the same person, this documentation refers to a **ServiceNow Admin**
and a **Terraform Admin**.

First, the Terraform Admin will configure your Terraform Cloud organization with
a dedicated team for the ServiceNow integration, and obtain a team API token for
that team. The Terraform Admin will provide your organization name, the team API
token, the hostname of your Terraform Cloud instance, and details about version
control repositories containing Terraform configurations and required variables
to the ServiceNow Admin.

Next, the ServiceNow Admin will install the Terraform ServiceNow Catalog
integration to your ServiceNow instance, and configure it using the team API
token and hostname.

Finally, the ServiceNow Admin will create a Service Catalog within ServiceNow
for the Terraform integration, and configure it using the version control
repositories and variable definitions provided by the Terraform Admin.

| ServiceNow Admin| Terraform Admin|
--|--
| | Prepare an organization for use with the ServiceNow Catalog. |
| | Create a team that can manage workspaces in that organization. |
| | Create a team API token so the integration can use that team's permissions. |
| | Retrieve the OAuth token IDs and repository identifiers that Terraform Cloud uses to identify your VCS repositories. |
| | Provide the API token, OAuth token ID, repository identifiers, variable definitions, and Terraform Cloud hostname to the ServiceNow Admin. |
| Install the Terraform integration application from the ServiceNow App Store. | |
| Connect the integration application with Terraform Cloud. | |
| Add the Terraform Service Catalog to ServiceNow. | |
| Configure the VCS repositories in ServiceNow. | |
| Configure variable sets for use with the VCS repositories. | |

Once these steps are complete, self-serve infrastructure will be available
through the ServiceNow Catalog. Terraform Cloud will provision and manage
requested infrastructure and report the status back to ServiceNow.

## Prerequisites

To start using Terraform with the ServiceNow Catalog Integration, you must have:

- An administrator account on a Terraform Enterprise instance or within a
  Terraform Cloud organization.
- An administrator account on your ServiceNow instance.
- One or more [supported version control
  systems](../../vcs/index.html#supported-vcs-providers) (VCSs) with read access
  to repositories with Terraform configurations.

This integration has been tested on the following ServiceNow server versions:

- New York
- Orlando
- Paris

It requires the following ServiceNow Plugins as dependencies:

- Flow Designer support for the Service Catalog
- ServiceNow IntegrationHub Action Step
- ServiceNow IntegrationHub Starter Pack

## Configure Terraform Cloud

Before installing the ServiceNow integration, the Terraform Admin will need to
perform the following steps to configure and gather information from Terraform
Cloud.

1. Either [create an
   organization](../../users-teams-organizations/organizations.html#creating-organizations)
   or choose an existing organization where ServiceNow will create new
   workspaces.
   **Save the organization name for later.**
1. [Create a team](../../users-teams-organizations/teams.html) for that
   organization called "ServiceNow", and ensure that it has [permission to
   manage
   workspaces](../../users-teams-organizations/permissions.html#manage-workspaces).
   You do not need to add any users to this team.
   [permissions-citation]: #intentionally-unused---keep-for-maintainers
1. On the "ServiceNow" team's settings page, generate a [team API
   token](../../users-teams-organizations/api-tokens.html#team-api-tokens).
   **Save the team API token for later.**
1. If you haven't yet done so, [connect a VCS provider](../../vcs/index.html) to
   this Terraform organization. This provider will include one or more
   repositories with Terraform configurations. Any repository that could be
   connected to a manually-created Terraform Cloud workspace can also be
   used as a workspace template in the ServiceNow integration.
1. On your organization's VCS provider settings page (Settings > VCS Providers),
   find the "OAuth Token ID" for the VCS provider or providers you will be using
   with the ServiceNow integration. Terraform Cloud uses the OAuth token ID to
   identify and authorize the VCS provider.
   **Save the OAuth token ID for later.**
1. Identify one or more VCS repositories in the VCS provider containing
   Terraform configurations that will be provisioned by the ServiceNow Terraform
   integration. Take note of any Terraform or environment variables used by the
   repositories you select.
   **Save the Terraform and environment variables for later.**
1. Provide the following information to the ServiceNow Admin.
  1. The organization name
  1. The team API token
  1. The hostname of your Terraform Enterprise instance, or of Terraform Cloud.
     The hostname of Terraform Cloud is `app.terraform.io`.
  1. The OAuth token ID(s) of your VCS provider(s), and the repository
     identifier for each VCS repository containing Terraform configurations that
     will be used by the integration.     
  1. Any Terraform or environment variables required by the configurations in the
     given VCS repositories.

-> **Note:** Repository identifiers are determined by your VCS provider; they
typically use a format like `<ORGANIZATION>/<REPO_NAME>` or
`<PROJECT_KEY>/<REPO_NAME>`. Azure DevOps repositories use the format
`<ORGANIZATION>/<PROJECT>/_git/<REPO_NAME>`. A GitHub repository hosted at
`https://github.com/exampleorg/examplerepo/` would have the repository
identifier `exampleorg/examplerepo`.

[permissions-citation]: #intentionally-unused---keep-for-maintainers

For instance, if you are configuring this integration for your company, `Example
Corp`, using two GitHub repositories, you would share values like the following
with the ServiceNow Admin.

```markdown
Terraform Enterprise Organization Name: `ServiceNowExampleOrg`

Team API Token: `q2uPExampleELkQ.atlasv1.A7jGHmvufExampleTeamAPITokenimVYxwunJk0xD8ObVol054`

Terraform Enterprise Hostname: `terraform.corp.example`

OAuth Token ID (GitHub org: example-corp): `ot-DhjEXAMPLELVtFA`
  - Repository ID (Developer Environment): `example-corp/developer-repo`
    - Environment variables:
      - `AWS_ACCESS_KEY_ID=AKIAEXAMPLEKEY`
      - `AWS_SECRET_ACCESS_KEY=ZB0ExampleSecretAccessKeyGjUiJh`
      - `AWS_DEFAULT_REGION=us-west-2`
    - Terraform variables:
      - `instance_type=t2.medium`
  - Repository ID (Testing Environment): `example-corp/testing-repo`
    - Environment variables:
      - `AWS_ACCESS_KEY_ID=AKIAEXAMPLEKEY`
      - `AWS_SECRET_ACCESS_KEY=ZB0ExampleSecretAccessKeyGjUiJh`
      - `AWS_DEFAULT_REGION=us-west-2`
    - Terraform variables:
      - `instance_type=t2.large`
```

## Install the ServiceNow Integration

Before beginning setup, the ServiceNow Admin must install the Terraform
ServiceNow Catalog integration software.

This can be added to your ServiceNow instance from the [ServiceNow
Store](https://store.servicenow.com/sn_appstore_store.do). Search for the "Terraform" integration,
published by "HashiCorp Inc".

![Screenshot: ServiceNow Store Page](./images/service-now-store.png "Screenshot of the ServiceNow Store listing for the Terraform Integration")

## Connect ServiceNow to Terraform Cloud

-> **ServiceNow Roles:** `admin` or `x_terraform.config_user`

Once the integration is installed, the ServiceNow Admin can connect your
ServiceNow instance to Terraform Cloud. Before you begin, you will need the
information described in the "Configure Terraform Cloud" section from your
Terraform Admin.

Once you have this information, connect ServiceNow to Terraform Cloud with
the following steps.

1. Navigate to your ServiceNow Service Management Screen.
1. Using the left-hand navigation, open the configuration table for the
   integration to manage the Terraform Cloud connection.
    - Terraform > Configs
1. Click on "New" to create a new Terraform Cloud connection.
    - Set Org Name to the Terraform Cloud organization name.
    - Click on the "Lock" icon to set Hostname to the hostname of your Terraform
      Enterprise instance. If you are using the SaaS version of Terraform Cloud,
      the hostname is `https://app.terraform.io`. Be sure to include "https://"
      before the hostname.
    - Set API Team Token to the Terraform Cloud team API token.
1. Click "Submit".

![Screenshot: ServiceNow Terraform Config](./images/service-now-config.png "Screenshot of the ServiceNow Terraform Config New Record page")

## Create and Populate a Service Catalog

Now that you have connected ServiceNow to Terraform Cloud, you are ready to
create a Service Catalog using the VCS repositories provided by the Terraform
Admin.

Navigate to the [Service Catalog documentation](./service-catalog.html) to
begin. You can also refer to this documentation whenever you need to add or
update request items.

### ServiceNow Developer Reference

ServiceNow developers who wish to customize the Terraform integration can refer
to the [developer documentation](./developer-reference.html).

### ServiceNow Administrator's Guide.

Refer to the [ServiceNow Administrator documentation](./admin-guide.html) for
information about configuring the integration.

### Example Customizations

Once the ServiceNow integration is installed, you can consult the [example
customizations documentation](./example-customizations.html).
