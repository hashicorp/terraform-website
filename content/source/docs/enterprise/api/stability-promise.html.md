---
page_title: "API Docs - Terraform Enterprise"
layout: "enterprise2"
---

# Stability promise

The Terraform Enterprise API will continue to evolve, but we consider it stable for general use, and HashiCorp will maintain all stable API endpoints in a backwards compatible manner. (Stable endpoints are any endpoints _not_ marked as beta.) If we need to make a change that we consider backwards incompatible, then we will create a new endpoint that serves the same purpose; the old endpoint will be maintained until declared [deprecated](#deprecation-policy).

The following changes are considered to be backwards compatible:

* Adding new API endpoints.
* Adding new attributes, links, or relationships to existing API requests and responses.
* Adding new optional query paramters to existing API requests.

Any endpoints that are not stable (i.e., endpoints that are in beta) or suspectible to security vulnerabilities are subject to change without notice.

## Deprecation policy

The deprecation policy provides users the opportunity to continue to consume API endpoints for a period of time after they have been superseded. Deprecation notices for endpoints should be readily available through various channels of communication, including documentation and HTTP responses. An endpoint should be available for at least three (3) months from the date on which it has been declared deprecated.
