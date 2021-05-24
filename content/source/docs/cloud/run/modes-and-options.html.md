---
layout: "cloud"
page_title: "Run Modes and Options - Runs - Terraform Cloud and Terraform Enterprise"
---

# Run Modes and Options

Terraform Cloud support many of the same modes and options available in local operations mode.

## Destroy Mode

[Destroy mode](/docs/cli/commands/plan.html#planning-modes) instructs Terraform to create a plan which destroys all objects, regardless of configuration changes.

Command line users can activate destroy mode using `terraform plan -destroy` or `terraform destroy`, while API users can use the `is-destroy` option. Destroy runs may also be created through the UI via the workspace's "Destruction and Deletion" settings page.

## Refresh-Only Mode

-> **Version note:** Refresh-only support is available in Terraform CLI versions v0.15.4 and later, with server-side support available in Terraform Cloud and Terraform Enterprise v202106-1 and later.

[Refresh-only mode](/docs/cli/commands/plan.html#planning-modes) instructs Terraform to create a plan which updates the Terraform state to match changes made to remote objects outside of Terraform.

Activate refresh-only mode using the `-refresh-only` flag on the command line or the `refresh-only` option in the API.

## Disable Automatic State Refresh

-> **Version note:** The ability to disable automatic state refresh is available in Terraform CLI versions v0.15.4 and later, with server-side support available in Terraform Cloud and Terraform Enterprise v202106-1 and later.

The [`-refresh=false` option](/docs/cli/commands/plan.html#refresh-false) is used in normal planning mode to disable the default behavior of refreshing Terraform state before checking for configuration changes.

Activate this option using the `-refresh=false` option on the command line or the `refresh` option in the API.

## Replacing Selected Resources

-> **Version note:** Replace support is available in Terraform CLI versions v0.15.4 and later, with server-side support available in Terraform Cloud and Terraform Enterprise v202106-1 and later.

The [replace option](/docs/cli/commands/plan.html#replace-address) instructs Terraform to replace the object with the given resource address.

Activate this option using the `-replace=ADDRESS` option on the command line or the `replace-addrs` option in the API.

## Targeted Plan and Apply

-> **Version note:** Targeting support is available in Terraform CLI versions v0.12.26 and later, with server-side support available in Terraform Cloud and Terraform Enterprise v202006-1 and later.

[Resource Targeting](/docs/cli/commands/plan.html#resource-targeting) is intended for exceptional circumstances only and should not be used routinely. To activate this option, use the `-target=ADDRESS` option on the command line or the `target-addrs` option in the API.

The usual caveats for targeting in local operations imply some additional limitations on Terraform Cloud features for remote plans created with targeting:

* [Sentinel](../sentinel/) policy checks for targeted plans will see only the selected subset of resource instances planned for changes in [the `tfplan` import](../sentinel/import/tfplan.html) and [the `tfplan/v2` import](../sentinel/import/tfplan-v2.html), which may cause an unintended failure for any policy that requires a planned change to a particular resource instance selected by its address.

* [Cost Estimation](../cost-estimation/) is disabled for any run created with `-target` set, to prevent producing a misleading underestimate of cost due to resource instances being excluded from the plan.

You can disable or constrain use of targeting in a particular workspace using a Sentinel policy based on [the `tfrun.target_addrs` value](../sentinel/import/tfrun.html#value-target_addrs).
