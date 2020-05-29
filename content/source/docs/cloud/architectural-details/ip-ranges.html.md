---
layout: "cloud"
page_title: "IP Ranges - Terraform Cloud"
---

# Terraform Cloud IP Ranges

Terraform Cloud uses static IP ranges for certain features that make outbound requests such as notifications and VCS connections. These IP ranges are retrievable through the [IP Ranges API](../api/ip-ranges.html).

-> **Note:** The IP ranges for each feature returned by the IP Ranges API may overlap. Additionally, these published ranges do not currently allow for execution of Terraform runs against local resources.

Since Terraform Cloud is a shared service, the use of these IP ranges to permit access to restricted resources and their impact on your security posture should be carefully considered. Additionally, these IP ranges may change. If you do choose to make use of these ranges we strongly recommend regularly checking the IP Ranges API for the most up-to-date information.
