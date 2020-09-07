---
layout: "cloud"
page_title: "IP Ranges - Terraform Cloud and Terraform Enterprise"
---

# Terraform Cloud IP Ranges

Terraform Cloud uses static IP ranges for certain features such as notifications and VCS connections. These IP ranges are retrievable through the [IP Ranges API](../api/ip-ranges.html).

-> **Note:** The IP ranges for each feature returned by the IP Ranges API may overlap. Additionally, these published ranges do not currently allow for execution of Terraform runs against local resources.

Since Terraform Cloud is a shared service, the use of these IP ranges to permit access to restricted resources and their impact on your security posture should be carefully considered. Additionally, these IP ranges may change. While changes are not expected to be frequent, we strongly recommend checking the IP Ranges API every 24 hours for the most up-to-date information if you do choose to make use of these ranges.

-> **Note:** Under normal circumstances, HashiCorp will publish any expected changes to Terraform Cloud's IP ranges at least 24 hours in advance of implementing them. This should allow sufficient time for users to update any connected systems to reflect the changes. In the event of an emergency outage or failover operation, it may not be possible to pre-publish these changes. 
