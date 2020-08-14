---
layout: "cloud"
page_title: "Overview - Cost Estimation - Terraform Cloud and Terraform Enterprise"
---

# Cost Estimation in Terraform Cloud

-> **Note:** Cost estimation is a paid feature, available as part of the **Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/).

> For a hands-on tutorial, try the [Verify Costs in Policies](https://learn.hashicorp.com/terraform/cloud-getting-started/cost-estimation?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) guide on HashiCorp Learn.

Terraform Cloud provides cost estimates for many resources found in your Terraform configuration. For each resource an hourly and monthly cost is shown, along with the monthly delta. The total cost and delta of all estimable resources is also shown.

## Enabling Cost Estimation

To enable cost estimation for your organization, check the box in your organization's settings.

![enable cost estimation](./images/cost-estimation-enable.png)

## Viewing a Cost Estimate

When enabled, Terraform Cloud performs a cost estimate for every run. Estimated costs appear in the run UI as an extra run phase, between the plan and apply.

The estimate displays a total monthly cost by default; you can expand the estimate to see an itemized list of resource costs, as well as the list of unestimated resources.

Note that this is just an estimate; some resources don't have cost information available or have unpredictable usage-based pricing. Supported resources are listed in this document's sub-pages.

![cost estimation run](./images/cost-estimation-run.png)

## Verifying Costs in Policies

You can use a Sentinel policy to validate your configuration's cost estimates using the [`tfrun`](/docs/cloud/sentinel/import/tfrun.html) import. The example policy below checks that the new cost delta is no more than $100. A new `t3.nano` instance should be well below that. A `decimal` import is available for more accurate math when working with currency numbers.

```python
import "tfrun"
import "decimal"

delta_monthly_cost = decimal.new(tfrun.cost_estimate.delta_monthly_cost)

if delta_monthly_cost.greater_than(100) {
    print("This policy prevents a user from increasing their spending by more than $100 per month in a single run without a warning.")
}

main = rule {
	delta_monthly_cost.less_than(100)
}
```

## Supported Resources

Cost estimation in Terraform Cloud supports Terraform resources within three major cloud providers.

- [AWS](./aws.html)
- [GCP](./gcp.html)
- [Azure](./azure.html)
