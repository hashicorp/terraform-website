---
page_title: "API Stability Policy - API Docs - Terraform Cloud"
layout: "cloud"
---

# API Stability Policy

The Terraform Cloud API will continue to evolve, but we consider it stable for general use, and HashiCorp will maintain all stable API endpoints in a backwards compatible manner. (Stable endpoints are any endpoints _not_ marked as beta.) If we need to make a change that we consider backwards incompatible, then we will create a new endpoint that serves the same purpose; the old endpoint will be maintained until declared [deprecated](#deprecation-policy).

The following changes are considered to be backwards compatible:

* Adding new API endpoints.
* Adding new attributes, links, or relationships to existing API requests and responses.
* Adding new optional query paramters to existing API requests.

Security vulnerabilities are an exception to this stability policy; we will make backwards incompatible changes to stable endpoints if it is necessary to protect our security or the security of our users.

Endpoints that are in beta are subject to change without notice.

## Deprecation Policy

The deprecation policy provides users the opportunity to continue to consume API endpoints for a period of time after they have been superseded. Deprecation notices for endpoints should be readily available through various channels of communication, including documentation and HTTP responses. An endpoint should be available for at least three (3) months from the date on which it has been declared deprecated. (This time is cited as a minimum; endpoint availability may be longer based on contracted agreements.)
