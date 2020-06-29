---
layout: "cloud"
page_title: "Installation Instructions - ServiceNow Service Catalog Integration - Terraform Cloud"
description: |-
  ServiceNow integration to enable your users to order Terraform-built infrastructure from ServiceNow
---

# Installing the Service Catalog Integration

Integrating ServiceNow with Terraform Enterprise involves several configuration steps. You will perform some of these steps in ServiceNow, and some of them in Terraform Enterprise.

| ServiceNow | Terraform Enterprise |
--|--
| | Prepare an organization for use with the ServiceNow Catalog. |
| | Create a team that can manage workspaces in that organization. |
| | Create a team API token so the integration can use that team's permissions. |
| | Retrieve the unique ID that Terraform Enterprise uses to identify your VCS provider. |
| Import the integration from source control. | |
| Connect the integration with Terraform Enterprise, using the team API token you prepared. | |
| Add the Terraform Service Catalog to enable it for your users. | |
| Add VCS repositories with Terraform configurations as catalog items. | |

Once these steps are completed, self-serve infrastructure will be available through the ServiceNow Catalog. Terraform Enterprise will provision and manage any requested infrastructure.

## Prerequisites

To start using Terraform with ServiceNow Catalog Integration, you must already have:

- An account on a [Terraform Enterprise](https://www.hashicorp.com/products/terraform/) instance.
- A ServiceNow instance or developer instance. You can request a ServiceNow developer instance at [developer.servicenow.com](https://developer.servicenow.com/).
- A [supported version control system](../../vcs/index.html#supported-vcs-providers) (VCS) with read access to repositories with Terraform configuration.
- A private Git repository to host the ServiceNow integration.

It does not require additional ServiceNow modules and has been tested on the following ServiceNow server versions:

- Madrid
- London

## Obtaining the ServiceNow Integration

Before beginning setup, you must obtain a copy of the Terraform ServiceNow Catalog integration software. Contact your HashiCorp sales representative to get access to the software.

Once you have obtained the files from your sales representative, check them into a private Git repository before beginning these setup instructions.

## Terraform Enterprise Setup

Before installing the ServiceNow integration, you need to perform some setup and gather some information in Terraform Enterprise.

1. [Create an organization](../../users-teams-organizations/organizations.html) (or choose an existing organization) where ServiceNow will create new workspaces.
1. [Create a team](../../users-teams-organizations/teams.html) for that organization called "ServiceNow", and ensure that it has the organization-level ["Manage Workspaces" permission](../../users-teams-organizations/permissions.html#manage-workspaces). You do not need to add any users to this team.
1. On the "ServiceNow" team's settings page, generate a [team API token](../../users-teams-organizations/api-tokens.html#team-api-tokens). **Save this API token for later.**
1. If you haven't yet done so, [connect a VCS provider](../../vcs/index.html) for this Terraform organization.
1. On the organization's VCS provider settings page, find the "OAuth Token ID" for your VCS provider. This is an opaque ID that Terraform Enterprise uses to identify this VCS provider. **Save the OAuth Token ID for later.**

[permissions-citation]: #intentionally-unused---keep-for-maintainers

## Installing the ServiceNow Integration

### ServiceNow Server Studio

Import the integration using the [ServiceNow Studio](https://docs.servicenow.com/bundle/madrid-application-development/page/build/applications/concept/c_ServiceNowStudio.html).

1. Launch the ServiceNow Studio by typing "studio" in the search on the left-hand side.
1. Click "Import from Source Control."
    - If this is not your first time opening the Studio, you can also access this from File > Import from Source Control.
1. Fill in the information required to import the integration:
    - URL: `https://github.com/<YOUR_ORG>/terraform-servicenow-integration`
    - Username: `<your VCS username>`
    - Password: `<a VCS Personal Access Token or your password>`
1. Select the Terraform application.
    - Application > Terraform
1. You can now close the ServiceNow Studio or continue customizing the application.

## Next Steps

Now that the ServiceNow Service Catalog integration is installed, you will need
to [configure it](./configure.html).
