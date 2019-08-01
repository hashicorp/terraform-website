---
layout: "enterprise"
page_title: "FAQ - Terraform Enterprise"
---

# Terraform Enterprise Frequently Asked Questions

This page provides answers to many common questions about Terraform Enterprise.

## General FAQ

3. [Migration from the Terraform Cloud SaaS](#migrating-from-the-terraform-cloud-saas)
7. [Terraform Enterprise Architecture](#terraform-enterprise-architecture)

---


## Migrating from the Terraform Cloud SaaS

If you are already a user of the Terraform Cloud SaaS (hereafter "the SaaS"), you may have workspaces that you want to migrate over to your new Terraform Enterprise installation.

These instructions assume Terraform 0.9 or greater. See [docs on legacy remote state](/docs/backends/legacy-0-8.html) for information on upgrading usage of remote state in prior versions of Terraform.

### Prerequisites

Have a Terraform Cloud user API token ("Atlas token") handy for both Terraform Enterprise and the SaaS. The following examples will assume you have these stored in `PTFE_ATLAS_TOKEN` and `SAAS_ATLAS_TOKEN`, respectively.

### Step 1: Connect local config to SaaS

Set up a local copy of your Terraform config that's connected to the SaaS via a `backend` block.

Assuming your environment is located at `my-organization/my-environment` in the SaaS, in a local copy of the Terraform config, ensure you have a backend configuration like this:

```tf
terraform {
  backend "atlas" {
    name = "my-organization/my-environment"
  }
}
```

Assign your SaaS API token to `ATLAS_TOKEN` and run `terraform init`:

```
export ATLAS_TOKEN=$SAAS_ATLAS_TOKEN
terraform init
```

### Step 2: Copy state locally

This step fetches the latest copy of the state locally so it can be pushed to Terraform Enterprise. First, comment out the `backend` section of the config:

```tf
# Temporarily commented out to copy state locally
# terraform {
#   backend "atlas" {
#     name = "my-organization/my-environment"
#   }
# }
```

Then, re-run `terraform init`:

```
terraform init
```

This will cause Terraform to detect the change in backend and ask you if you want to copy the state.

Type `yes` to allow the state to be copied locally. Your state should now be present on disk as `terraform.tfstate`, ready to be uploaded to Terraform Enterprise.

### Step 3: Update backend configuration for Terraform Enterprise

Change the backend config to point to the Terraform Enterprise installation:

```tf
terraform {
  backend "atlas" {
    address = "https://tfe.mycompany.example.com" # the address of your TFE installation
    name    = "my-organization/my-environment"
  }
}
```

Assign your Terraform Enterprise API token to `ATLAS_TOKEN` and run `terraform init`:

```
export ATLAS_TOKEN=$PTFE_ATLAS_TOKEN
terraform init
```

You will again be asked if you want to copy the state file. Type `yes` and the state will be uploaded to your Terraform Enterprise installation.

---

## Terraform Enterprise Architecture

This section describes aspects of the architecture of Terraform Enterprise. It was written for a prior implementation of Terraform Enterprise, and may be outdated; we plan to review our architecture docs in the near future.

### Services

These are the services used to run Terraform Enterprise. Each service contains a description of what actions it performs, a policy for restarts, impact of failing or degraded performance, and the service's dependencies.

- [`atlas-frontend` and `atlas-worker`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/atlas.md)
- [`archivist`, `binstore`, `storagelocker`, and `logstream`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/archivist.md)
- [`terraform-build-manager`, and `terraform-build-worker`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/build-pipeline.md)
- [`slug-extract`, `slug-ingress`, `slug-merge`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/slugs.md)

### Data Flow Diagram

The following diagram shows the way data flows through the various services and data stores in Terraform Enterprise.

![tfe-data-flow-arch](assets/tfe-data-flow-arch.png)

(Note: The services in double square brackets are soon to be replaced by the service that precedes them.)

