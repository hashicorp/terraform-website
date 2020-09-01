---
layout: "cloud"
page_title: "Terraform Cloud Operator for Kubernetes setup instructions"
description: |-
  HashiCorp Terraform Cloud customers can integrate with Kubernetes using the official Terraform Cloud Operator for Kubernetes to provision infrastructure through Terraform Cloud using their Kubernetes control plane
---

# Terraform Cloud Operator for Kubernetes Setup Instructions

~> **Important:** The Terraform Cloud Operator for Kubernetes is still under development and in the alpha testing stage. It is not ready for production use.

## Overview

HashiCorp Terraform Cloud customers can integrate with Kubernetes using the official [Terraform Cloud Operator for Kubernetes](https://github.com/hashicorp/terraform-k8s) to provision infrastructure internal or external to the Kubernetes cluster directly from the Kubernetes control plane.  Using the Terraform Cloud Operator for Kubernetes' CustomResourceDefition (CRD), users can dynamically create Terraform Cloud workspaces, populate variables, and apply a Terraform configuration stored in a git repository or directly from the [Terraform Registry](https://registry.terraform.io/).

## Prerequisites

Access and support for the Terraform Cloud Operator for Kubernetes is to all customers in the Terraform Cloud.  Some features of Terraform Cloud that are [limited to certain tiers](/docs/cloud/paid.html) and aren't available to the Terraform Cloud Operator for Kubernetes unless you've purchased the corresponding tier.

## Terraform Cloud Operator for Kubernetes

### Networking Requirements

In order for the Terraform Cloud Operator for Kubernetes to function properly, it must be able to make outbound requests over HTTPS (TCP port 443) to the Terraform Cloud application APIs. This may require perimeter networking as well as container host networking changes, depending on your environment. The IP ranges are documented in the [Terraform Cloud IP Ranges documentation](/docs/cloud/architectural-details/ip-ranges.html). The services which run on these IP ranges are described in the table below.

Hostname | Port/Protocol | Directionality | Purpose
 --|--|--|--
 app.terraform.io | tcp/443, HTTPS | Outbound | Dynamically managing Terraform Cloud Workspaces and returning the output to Kubernetes via the Terraform Cloud API

### Compatibility

The current release of the Terraform Cloud Operator for Kubernetes supports the following versions:

* Kubernetes 1.14 and above

### Installation & Configuration

* Generate an [Organization token](/docs/cloud/users-teams-organizations/api-tokens.html#organization-api-tokens) within Terraform Cloud and save it to a `credentials` file
* Create a [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/) with the Terraform Cloud API credentials
```
kubectl -n $NAMESPACE create secret generic terraformrc --from-file=credentials
```
* Add sensitive variables, such as your cloud provider credentials, to the workspace
```
kubectl -n $NAMESPACE create secret generic workspacesecrets --from-literal=secret_key=abc123
```
* Install the [Terraform Cloud Operator for Kubernetes via Helm](https://github.com/hashicorp/terraform-helm)
```
helm repo add hashicorp https://helm.releases.hashicorp.com
```
```
helm install --devel --namespace ${RELEASE_NAMESPACE} hashicorp/terraform --generate-name
```
* To create a Terraform workspace, you can create a separate Helm chart to deploy the custom resource or examine this [example](https://github.com/hashicorp/terraform-helm/tree/master/example).

### Upgrading

The Helm chart automatically installs all Custom Resource Definitions under the `crds/` directory. As a result, any updates to the schema must be manually copied into the directory and removed from the Kubernetes cluster.

```
kubectl delete crd workspaces.app.terraform.io
```

If the CRD is not updated correctly, you will not be able to create a Workspace Custom Resource.
