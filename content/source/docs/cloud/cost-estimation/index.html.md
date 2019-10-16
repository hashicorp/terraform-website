---
layout: "cloud"
page_title: "Overview - Cost Estimation - Terraform Cloud"
---

# Cost Estimation in Terraform Cloud

## About Cost Estimation in Terraform Cloud

Terraform Cloud provides cost estimates for many resources found in your Terraform configuration. For each resource an hourly and monthly cost is shown, along with the monthly delta. The total cost and delta of all estimable resources is also shown.

## Enabling Cost Estimation

To enable cost estimation for your organization, check the box in your organization's settings.

![enable cost estimation](./images/cost-estimation-enable.png)

## Viewing a Cost Estimate

Estimated resource's costs are found in a phase in the run UI. You can see the list of resources with costs, their price details, and the list of unestimated resources. Costs are totalled to get a sense of the proposed overall monthly cost once the run is applied. Note that this is just an estimate; some resources don't have cost information available or have unpredictable usage-based pricing. Supported resources are listed in this document's sub-pages.

![cost estimation run](./images/cost-estimation-run.png)

## Verifying costs using policies

You can use a Sentinel policy to validate your configuration's cost estimates using the [`tfrun`](/docs/cloud/sentinel/import/tfrun.html) import. This policy simply checks that the new cost delta is no more than $100. A new `t3.nano` instance should be well below that. A `decimal` import is available for more accurate math when working with currency numbers.

```python
import "tfrun"
import "decimal"

delta_monthly_cost = decimal.new(tfrun.cost_estimate.delta_monthly_cost)

main = rule {
	delta_monthly_cost.less_than(100)
}
```

## Supported resources

Cost estimation in Terraform Cloud supports terraform resources within three major cloud providers.

- [AWS](./aws.html)
- [GCP](./gcp.html)
- [Azure](./azure.html)
