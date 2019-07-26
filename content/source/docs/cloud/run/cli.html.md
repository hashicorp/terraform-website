---
layout: "cloud"
page_title: "CLI-driven Runs - Runs - Terraform Enterprise"
---

[sentinel]: ../sentinel/index.html
[private]: ../registry/index.html
[remote]: /docs/backends/types/remote.html
[speculative plan]: ./index.html#speculative-plans
[permissions]: ../users-teams-organizations/permissions.html
[tfe-provider]: /docs/providers/tfe/index.html

# The CLI-driven Run Workflow

Terraform Enterprise (TFE) has three workflows for managing Terraform runs.

- The [UI/VCS-driven run workflow](./ui.html), which is TFE's primary mode of operation.
- The [API-driven run workflow](./api.html), which is more flexible but requires you to create some tooling.
- The CLI-driven run workflow described below, which uses Terraform's standard CLI tools to execute runs in TFE.

## Summary

The [Terraform remote backend][remote] brings Terraform Enterprise's collaboration features into the familiar Terraform CLI workflow. It offers the best of both worlds to developers who are already comfortable with using Terraform, and can work with existing CI/CD pipelines.

Users can start runs with the standard `terraform plan` and `terraform apply` commands, and can watch the progress of the run without leaving their terminal. These runs execute remotely in Terraform Enterprise; they use variables from the appropriate workspace, enforce any applicable [Sentinel policies][sentinel], and can access Terraform Enterprise's [private module registry][private] and remote state inputs.

Terraform Enterprise offers two kinds of CLI-driven runs, to support different stages of your workflow:

- `terraform plan` starts a [speculative plan][] in a Terraform Enterprise workspace, using configuration files from a local directory. Developers can quickly check the results of edits (including compliance with Sentinel policies) without needing to copy sensitive variables to their local machine.

  Speculative plans work with all workspaces, and can co-exist with the [VCS-driven workflow](./ui.html).

- `terraform apply` starts a normal plan and apply in a Terraform Enterprise workspace, using configuration files from a local directory.

  Remote `terraform apply` is for workspaces without a linked VCS repository. It replaces the VCS-driven workflow with a more traditional CLI workflow.

To supplement these remote operations, you can also use the optional [Terraform Enterprise Provider][tfe-provider]. This provider is used to interact with the resources supported by [Terraform Cloud](https://app.terraform.io/signup) and private instances of Terraform Enterprise. It can be useful for editing variables and workspace settings through the terraform CLI.

## Remote Backend Configuration

To configure the remote backend, a stanza needs to be added to the Terraform configuration. It must specify the `remote` backend, the name of a Terraform Enterprise organization, and the workspace(s) to use. The example below uses one workspace; see [the remote backend documentation][remote] for more details.

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

A Terraform Enterprise [user API token](../users-teams-organizations/users.html#api-tokens) is also needed. It should be set as `credentials` in the [CLI config file](/docs/commands/cli-config.html#credentials). User tokens can be created in the [user settings](../users-teams-organizations/users.html#user-settings).

```hcl
credentials "app.terraform.io" {
  token = "xxxxxx.atlasv1.zzzzzzzzzzzzz"
}
```

The backend can be initialized with `terraform init`. If the workspaces do not yet exist in Terraform Enterprise, they will be created at this time.

```shell
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

## Remote Working Directories

If you manage your Terraform configurations in self-contained repositories, the remote working directory always has the same content as the local working directory.

If you use a combined repository and [specify a working directory on workspaces](../workspaces/settings.html#terraform-working-directory), you can run Terraform from either the real working directory or from the root of the combined configuration directory. In both cases, Terraform will upload the entire combined configuration directory.

## Remote Speculative Plans

To run a [speculative plan][] on your configuration, use the `terraform plan` command. The plan will run in Terraform Enterprise, and the logs will stream back to the command line along with a URL to view the plan in the Terraform Enterprise UI.

Users can run speculative plans in any workspace where they have [plan access][permissions].

Speculative plans use the configuration code from the local working directory, but will use variable values from the specified Terraform Enterprise workspace.

```shell
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

When configuration changes are ready to be applied, use the `terraform apply` command. The apply will start in Terraform Enterprise, and the command line will prompt for approval before applying the changes.

Remote applies require [write access][permissions] to the workspace.

Remote applies use the configuration code from the local working directory, but will use variable values from the specified Terraform Enterprise workspace.

~> **Important:** You cannot run remote applies in workspaces that are linked to a VCS repository, since the repository serves as the workspace’s source of truth. To apply changes in a VCS-linked workspace, merge your changes to the designated branch.

```shell
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

```shell
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
