---
layout: "cloud"
page_title: "Working With JSON Result Data - Sentinel - Terraform Cloud and Terraform Enterprise"
---

# Working With Sentinel JSON Result Data

-> **Note:** Sentinel policies are a paid feature, available as part of the
**Team & Governance** upgrade package. [Learn more about Terraform Cloud pricing
here](https://www.hashicorp.com/products/terraform/pricing).

When using the Terraform Cloud UI, Sentinel policy check results are available
both in a human-readable log form, and in a more detailed, lower-level JSON
form.  While the logs may suppress some output that would make the logs harder
to read, the JSON output exposes the lower-level output directly to you. Being
able to parse this data in its entirety is especially important when working
with [non-boolean rule
data](https://docs.hashicorp.com/sentinel/language/rules#non-boolean-values) in
a policy designed to work with Sentinel 0.17.0 and higher.

-> The JSON data exposed is the same as you would see when using the [policy
checks API](/docs/cloud/api/policy-checks.html), with the data starting at the
`sentinel` key.

## Viewing JSON Data

To view the JSON data, expand the policy check on the [runs
page](/docs/cloud/run/manage.html) if it is not already expanded. The logs are
always displayed first, so click the **View JSON Data** button to view the JSON
data. You can click the **View Logs** button to switch back to the log view.

![viewing json data](/assets/images/guides/sentinel/sentinel-view-json.png)

## Filtering JSON Data

The JSON data is filterable using a [jq](https://stedolan.github.io/jq/)-subset
filtering language. See the [JSON
filtering](/docs/cloud/workspaces/json-filtering.html) page for more details on
the filtering language.

Filters are entered by putting the filter in the aptly named **filter** box in
the JSON viewer. After entering the filter, pressing **Apply** or the enter key
on your keyboard will apply the filter. The filtered results, if any, are
displayed in result box. Clearing the filter will restore the original JSON
data.

![entering a json filter](/assets/images/guides/sentinel/sentinel-json-enter-filter.png)

### Quick-Filtering `main` Rules

Clicking the **Filter "main" rules** button will quickly apply a filter that
shows you the results of the `main` rule for every policy in the policy set. You
can use this to quickly get the results of each policy in the set, without
having navigate through the rest of the policy result data.

![using the quick filter](/assets/images/guides/sentinel/sentinel-json-quick-filter.png)
