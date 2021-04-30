---
layout: "enterprise"
page_title: "Reference Architectures - Terraform Enterprise"
---

# Terraform Enterprise Reference Architectures

HashiCorp provides reference architectures detailing the recommended
infrastructure and resources that should be provisioned in order to
support a highly-available Terraform Enterprise deployment.

Depending on where you choose to deploy Terraform Enterprise,
there are different services available to maximize the resiliency of
the deployment, for example, most major cloud service providers offer
a resilient relational database service offering, removing the need
for the customer to manage a complex database cluster/failover
architecture. We have taken this into consideration and created a
reference architecture for the most common deployment configurations,
making the most appropriate use of those cloud vendor services.

## Reference Architectures

- [Amazon Web Services](./aws.html)

- [Microsoft Azure](./azure.html)

- [Google Cloud Platform](./gcp.html)

- [VMware](./vmware.html)
