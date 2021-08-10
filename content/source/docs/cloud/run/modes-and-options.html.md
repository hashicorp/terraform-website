---
layout: "cloud"
page_title: "Run Modes and Options - Runs - Terraform Cloud and Terraform Enterprise"
---

# Run Modes and Options

Terraform Cloud runs support many of the same modes and options available in the Terraform CLI.

## Destroy Mode

[Destroy mode](/docs/cli/commands/plan.html#planning-modes) instructs Terraform to create a plan which destroys all objects, regardless of configuration changes.

- **CLI:** Use `terraform plan -destroy` or `terraform destroy`
- **API:** Use the `is-destroy` option.
- **UI:** Use a workspace's "Destruction and Deletion" settings page.

## Refresh-Only Mode

> **Hands-on:** Try the [Use Refresh-Only Mode to Sync Terraform State](https://learn.hashicorp.com/tutorials/terraform/refresh) tutorial on HashiCorp Learn.

-> **Version note:** Refresh-only support is available in Terraform Enterprise v202106-1 or later and requires a workspace using at least Terraform CLI v0.15.4.

[Refresh-only mode](/docs/cli/commands/plan.html#planning-modes) instructs Terraform to create a plan which updates the Terraform state to match changes made to remote objects outside of Terraform.

- **CLI:** Use `terraform plan -refresh-only` or `terraform apply -refresh-only`.
- **API:** Use the `refresh-only` option.
- **UI:** Use the "Start new plan" action from a workspace's "Actions" menu, then choose the "Refresh-only" plan type in the new plan dialog.

## Skipping Automatic State Refresh

-> **Version note:** The ability to skip automatic state refresh is available in Terraform Enterprise v202106-1 or later.

The [`-refresh=false` option](/docs/cli/commands/plan.html#refresh-false) is used in normal planning mode to skip the default behavior of refreshing Terraform state before checking for configuration changes.

- **CLI:** Use `terraform plan -refresh=false` or `terraform apply -refresh=false`.
- **API:** Use the `refresh` option.

## Replacing Selected Resources

-> **Version note:** Replace support is available in Terraform Enterprise v202106-1 or later and requires a workspace using at least Terraform CLI v0.15.2.

The [replace option](/docs/cli/commands/plan.html#replace-address) instructs Terraform to replace the object with the given resource address.

- **CLI:** Use `terraform plan -replace=ADDRESS` or `terraform apply -replace=ADDRESS`.
- **API:** Use the `replace-addrs` option.

## Targeted Plan and Apply

-> **Version note:** Targeting support is available in Terraform Enterprise v202006-1 or later.

[Resource Targeting](/docs/cli/commands/plan.html#resource-targeting) is intended for exceptional circumstances only and should not be used routinely.

- **CLI:** Use `terraform plan -target=ADDRESS` or `terraform apply -target=ADDRESS`.
- **API:** Use the `target-addrs` option.

The usual caveats for targeting in local operations imply some additional limitations on Terraform Cloud features for remote plans created with targeting:

* [Sentinel](../sentinel/) policy checks for targeted plans will see only the selected subset of resource instances planned for changes in [the `tfplan` import](../sentinel/import/tfplan.html) and [the `tfplan/v2` import](../sentinel/import/tfplan-v2.html), which may cause an unintended failure for any policy that requires a planned change to a particular resource instance selected by its address.

* [Cost Estimation](../cost-estimation/) is disabled for any run created with `-target` set, to prevent producing a misleading underestimate of cost due to resource instances being excluded from the plan.

You can disable or constrain use of targeting in a particular workspace using a Sentinel policy based on [the `tfrun.target_addrs` value](../sentinel/import/tfrun.html#value-target_addrs).
