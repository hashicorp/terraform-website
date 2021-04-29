---
layout: "enterprise"
page_title: "Architecture Summary - System Overview - Terraform Enterprise"
---

# Terraform Enterprise Architecture

This page describes aspects of the architecture of Terraform Enterprise.

-> **Note:** As this page summarises architectural internals of Terraform Enterprise, the content should be considered as advanced. Contact your Customer Success Manager for more information if required.

## Overview

Terraform Enterprise (PTFE) is powered by the same set of services behind HashiCorp’s public SaaS application Terraform Cloud.  The architecture can seem daunting at first, but this guide will streamline your understanding by presenting what operators need to know to effectively troubleshoot a PTFE installation:

- The layers of functionality and how they interact
- Which containers are involved in common tasks


## Services

These are the services used to run Terraform Enterprise. Each service contains a description of what actions it performs, a policy for restarts, impact of failing or degraded performance, and the service's dependencies.

- [`atlas-frontend` and `atlas-worker`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/atlas.md)
- [`archivist`, `binstore`, `storagelocker`, and `logstream`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/archivist.md)
- [`terraform-build-manager`, and `terraform-build-worker`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/build-pipeline.md)
- [`slug-extract`, `slug-ingress`, `slug-merge`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/slugs.md)

## Data Flow Diagram

The following diagram shows the way data flows through the various services and data stores in Terraform Enterprise.

![tfe-data-flow-arch](assets/tfe-data-flow-arch.png)

(Note: The services in double square brackets are soon to be replaced by the service that precedes them.)

