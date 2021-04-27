---
layout: "cloud"
page_title: "Terraform Cloud Operator for Kubernetes setup instructions"
description: |-
  HashiCorp Terraform Cloud customers can integrate with Kubernetes using the official Terraform Cloud Operator for Kubernetes to provision infrastructure through Terraform Cloud using their Kubernetes control plane
---

# Terraform Cloud Operator for Kubernetes Setup Instructions

## Overview

HashiCorp Terraform Cloud customers can integrate with Kubernetes using the official [Terraform Cloud Operator for Kubernetes](https://github.com/hashicorp/terraform-k8s) to provision infrastructure internal or external to the Kubernetes cluster directly from the Kubernetes control plane.  Using the Terraform Cloud Operator for Kubernetes' CustomResourceDefinition (CRD), users can dynamically create Terraform Cloud workspaces using a Terraform configuration from a git repository or from the [Terraform Registry](https://registry.terraform.io/), populate variables, and perform Terraform runs to provision infrastructure.

## Prerequisites

All Terraform Cloud users can use the Terraform Cloud Operator for Kubernetes. Some features of Terraform Cloud that are [limited to certain tiers](/docs/cloud/paid.html) aren't available to the Terraform Cloud Operator for Kubernetes unless you've purchased the corresponding tier.

## Terraform Cloud Operator for Kubernetes

### Networking Requirements

In order for the Terraform Cloud Operator for Kubernetes to function properly, it must be able to make outbound requests over HTTPS (TCP port 443) to the Terraform Cloud application APIs. This may require perimeter networking as well as container host networking changes, depending on your environment. The IP ranges are documented in the [Terraform Cloud IP Ranges documentation](/docs/cloud/architectural-details/ip-ranges.html). The services which run on these IP ranges are described in the table below.

Hostname | Port/Protocol | Directionality | Purpose
 --|--|--|--
 app.terraform.io | tcp/443, HTTPS | Outbound | Dynamically managing Terraform Cloud Workspaces and returning the output to Kubernetes via the Terraform Cloud API

### Compatibility

The current release of the Terraform Cloud Operator for Kubernetes supports the following versions:

* Helm 3.0.1 and above
* Kubernetes 1.15 and above

### Installation & Configuration

1. Generate an [organization token](/docs/cloud/users-teams-organizations/api-tokens.html#organization-api-tokens) within Terraform Cloud and save it to a file. (These instructions assume you're using a file named `credentials`.)

1. Create a [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/) with the Terraform Cloud API credentials.

    ```
    kubectl -n $NAMESPACE create secret generic terraformrc --from-file=credentials
    ```

1. Add sensitive variables, such as your cloud provider credentials, to the workspace.

    ```
    kubectl -n $NAMESPACE create secret generic workspacesecrets --from-literal=secret_key=abc123
    ```

1. Install the [Terraform Cloud Operator for Kubernetes via Helm](https://github.com/hashicorp/terraform-helm).

    ```
    helm repo add hashicorp https://helm.releases.hashicorp.com

    helm install --namespace ${RELEASE_NAMESPACE} hashicorp/terraform --generate-name
    ```

1. To create a Terraform workspace, you can create a separate Helm chart to deploy the custom resource or examine these [examples](https://github.com/hashicorp/terraform-helm/tree/master/example).

### Upgrading

When a new version of the Terraform Cloud Operator for Kubernetes Helm Chart is available from the HashiCorp Helm repository, it can be upgraded with the following command:

```
helm upgrade --namespace ${RELEASE_NAMESPACE} ${RELEASE_NAME} hashicorp/terraform
```


