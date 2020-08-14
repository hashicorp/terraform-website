---
layout: "cloud"
page_title: "CLI-driven Runs - Runs - Terraform Cloud and Terraform Enterprise"
---

[sentinel]: ../sentinel/index.html
[private]: ../registry/index.html
[remote]: /docs/backends/types/remote.html
[speculative plan]: ./index.html#speculative-plans
[tfe-provider]: /docs/providers/tfe/index.html

# The CLI-driven Run Workflow

> For a hands-on tutorial, try the [Authenticate the CLI with Terraform Cloud](https://learn.hashicorp.com/terraform/tfc/tfc_login?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) guide on HashiCorp Learn.

Terraform Cloud has three workflows for managing Terraform runs.

- The [UI/VCS-driven run workflow](./ui.html), which is the primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The CLI-driven run workflow described below, which uses Terraform's standard CLI tools to execute runs in Terraform Cloud.

## Summary

The [Terraform remote backend][remote] brings Terraform Cloud's collaboration features into the familiar Terraform CLI workflow. It offers the best of both worlds to developers who are already comfortable with using Terraform, and can work with existing CI/CD pipelines.

Users can start runs with the standard `terraform plan` and `terraform apply` commands, and can watch the progress of the run without leaving their terminal. These runs execute remotely in Terraform Cloud; they use variables from the appropriate workspace, enforce any applicable [Sentinel policies][sentinel], and can access Terraform Cloud's [private module registry][private] and remote state inputs.

Terraform Cloud offers two kinds of CLI-driven runs, to support different stages of your workflow:

- `terraform plan` starts a [speculative plan][] in a Terraform Cloud workspace, using configuration files from a local directory. Developers can quickly check the results of edits (including compliance with Sentinel policies) without needing to copy sensitive variables to their local machine.

  Speculative plans work with all workspaces, and can co-exist with the [VCS-driven workflow](./ui.html).

- `terraform apply` starts a normal plan and apply in a Terraform Cloud workspace, using configuration files from a local directory.

  Remote `terraform apply` is for workspaces without a linked VCS repository. It replaces the VCS-driven workflow with a more traditional CLI workflow.

To supplement these remote operations, you can also use the optional [Terraform Enterprise Provider][tfe-provider], which interacts with the resources supported by Terraform Cloud. It can be useful for editing variables and workspace settings through the Terraform CLI.

## Remote Backend Configuration

To configure the remote backend, a stanza needs to be added to the Terraform configuration. It must specify the `remote` backend, the name of a Terraform Cloud organization, and the workspace(s) to use. The example below uses one workspace; see [the remote backend documentation][remote] for more details.

```hcl
terraform {
  backend "remote" {
    organization = "my-org"

    workspaces {
      name = "my-app-dev"
    }
  }
}
```

Next, run `terraform login` to authenticate with Terraform Cloud. Alternatively, you can [manually configure credentials in the CLI config file](/docs/commands/cli-config.html#credentials).

The backend can be initialized with `terraform init`.

```
$ terraform init

Initializing the backend...

Initializing provider plugins...

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

### Implicit Workspace Creation

If you configure the remote backend to use a workspace that doesn't yet exist in your organization, Terraform Cloud will create a new workspace with that name when you run `terraform init`. The output of `terraform init` will inform you when this happens.

Automatically created workspaces might not be immediately ready to use, so use Terraform Cloud's UI to check a workspace's settings and data before performing any runs. In particular, note that:

- No Terraform variables or environment variables are created by default. Terraform Cloud will use `*.auto.tfvars` files if they are present, but you will usually still need to set some workspace-specific variables.
- The execution mode defaults to "Remote," so that runs occur within Terraform Cloud's infrastructure instead of on your workstation.
- New workspaces are not automatically connected to a VCS repository, and do not have a working directory specified.
- A new workspace's Terraform version defaults to the most recent release of Terraform at the time the workspace was created.

## Variables in CLI-Driven Runs

Remote runs in Terraform Cloud use variables from two sources:

- Terraform variables and environment variables set in the workspace. These can be edited via the UI, the API, or the `tfe` Terraform provider.
- Terraform variables from any `*.auto.tfvars` files included in the configuration. Workspace variables, if present, override these.

-> **Note:** Remote runs do not use environment variables from your shell environment, and do not support specifying variables (or `.tfvars` files) as command line arguments.

## Remote Working Directories

If you manage your Terraform configurations in self-contained repositories, the remote working directory always has the same content as the local working directory.

If you use a combined repository and [specify a working directory on workspaces](../workspaces/settings.html#terraform-working-directory), you can run Terraform from either the real working directory or from the root of the combined configuration directory. In both cases, Terraform will upload the entire combined configuration directory.

## Excluding Files from Upload

-> **Version note:** `.terraformignore` support was added in Terraform 0.12.11.

CLI-driven runs upload an archive of your configuration directory
to Terraform Cloud. If the directory contains files you want to exclude from upload,
you can do so by defining a [`.terraformignore` file in your configuration directory][remote].

## Remote Speculative Plans

To run a [speculative plan][] on your configuration, use the `terraform plan` command. The plan will run in Terraform Cloud, and the logs will stream back to the command line along with a URL to view the plan in the Terraform Cloud UI.

Users can run speculative plans in any workspace where they have permission to queue plans. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Speculative plans use the configuration code from the local working directory, but will use variable values from the specified workspace.

```
$ terraform plan

Running plan in the remote backend. Output will stream here. Pressing Ctrl-C
will stop streaming the logs, but will not stop the plan running remotely.
To view this plan in a browser, visit:
https://app.terraform.io/app/my-org/my-app-dev/runs/run-LU3uk79BE5Uj77io

Waiting for the plan to start...

Terraform v0.11.9

Configuring remote state backend...
Initializing Terraform configuration...
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.

[...]

Plan: 1 to add, 0 to change, 0 to destroy.
```

## Remote Applies

When configuration changes are ready to be applied, use the `terraform apply` command. The apply will start in Terraform Cloud, and the command line will prompt for approval before applying the changes.

Remote applies require permission to apply runs for the workspace. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

Remote applies use the configuration code from the local working directory, but will use variable values from the specified workspace.

~> **Important:** You cannot run remote applies in workspaces that are linked to a VCS repository, since the repository serves as the workspace’s source of truth. To apply changes in a VCS-linked workspace, merge your changes to the designated branch.

```
$ terraform apply

Running apply in the remote backend. Output will stream here. Pressing Ctrl-C
will cancel the remote apply if it's still pending. If the apply started it
will stop streaming the logs, but will not stop the apply running remotely.
To view this run in a browser, visit:
https://app.terraform.io/app/my-org/my-app-dev/runs/run-PEekqv44Fs8NkiFx

Waiting for the plan to start...

[...]

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions in workspace "my-app-dev"?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

[...]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

## Sentinel Policies

If the specified workspace uses Sentinel policies, those policies will run against all speculative plans and remote applies in that workspace. The policy output will be available in the terminal. Hard mandatory checks cannot be overridden and they prevent `terraform apply` from applying changes.

```
$ terraform apply

[...]

Plan: 1 to add, 0 to change, 1 to destroy.

------------------------------------------------------------------------

Organization policy check:

Sentinel Result: false

Sentinel evaluated to false because one or more Sentinel policies evaluated
to false. This false was not due to an undefined value or runtime error.

1 policies evaluated.
## Policy 1: my-policy.sentinel (hard-mandatory)

Result: false

FALSE - my-policy.sentinel:1:1 - Rule "main"

Error: Organization policy check hard failed.
```

## Targeted Plan and Apply

-> **Version note:** Targeting support was added client-side in Terraform v0.12.26 and also requires server-side support that may not be available for all Terraform Enterprise deployments yet.

The `terraform plan` and `terraform apply` commands described in earlier
sections support [Resource Targeting](https://www.terraform.io/docs/commands/plan.html#resource-targeting) as in the local operations workflow, using the `-target` option on the command line.

As with local usage, targeting is intended for exceptional circumstances only
and should not be used routinely. The usual caveats for targeting in local operations imply some additional limitations on Terraform Cloud features for remote plans created with targeting:

* [Sentinel](../sentinel/) policy checks for targeted plans will see only the selected subset of resource instances planned for changes in [the `tfplan` import](../sentinel/import/tfplan.html) and [the `tfplan/v2` import](../sentinel/import/tfplan-v2.html), which may cause an unintended failure for any policy that requires a planned change to a particular resource instance selected by its address.

* [Cost Estimation](../cost-estimation/) is disabled for any run created with `-target` set, to prevent producing a misleading underestimate of cost due to resource instances being excluded from the plan.

You can disable or constrain use of targeting in a particular workspace using a Sentinel policy based on [the `tfrun.target_addrs` value](../sentinel/import/tfrun.html#value-target_addrs).
