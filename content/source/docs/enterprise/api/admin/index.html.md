---
layout: enterprise2
page_title: "Admin - API Docs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-api-admin"
---

# Private Terraform Enterprise Admin API Documentation

-> **Note**: These API endpoints are in beta and are subject to change.

-> These API endpoints are available in Private Terraform Enterprise as of version 201807-1.

Private Terraform Enterprise provides an API to allow administrators to configure and support their installation.

See the navigation sidebar for the list of available endpoints.

## Authentication

With the exception of the [user impersonation endpoints](./users.html#impersonate-another-user), all requests must be authenticated with a bearer token belonging to a site administrator. Use the HTTP Header `Authorization` with the value `Bearer <token>`. This token can be generated or revoked on the [tokens tab of the user settings page](../../users-teams-organizations/users.html#api-tokens). In the context of the Admin API, your token has management access to all resources in the system.

For more information on authentication behavior, see [the API overview section](../index.html#authentication).
