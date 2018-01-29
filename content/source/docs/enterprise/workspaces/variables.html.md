---
layout: "enterprise2"
page_title: "Variables - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-variables"
---

[variables]: /docs/configuration/variables.html

# Variables

Terraform Enterprise (TFE) workspaces can set values for two kinds of variables:

- [Terraform input variables][variables], which define the parameters of a Terraform configuration.
- Shell environment variables, which many providers can use for credentials and other data. You can also set [environment variables that affect Terraform's behavior](/docs/configuration/environment-variables.html), like `TF_LOG`.

You can edit a workspace's variables via the UI or the API. All runs in a workspace use its variables.

## The Variables API

[variables_api]: ../api/variables.html

You can automate any variable management task with the [variables API][variables_api].

The rest of this page gives background on how TFE uses variables and describes the UI for editing variables. For details about the API endpoints, see the [variables API page][variables_api].

## Managing Variables

To view and manage a workspace's variables, navigate to that workspace and click the "Variables" navigation link at the top.

![The initial appearance of a workspace's variables page](./images/vars.png)

The variables page has separate lists of Terraform variables and environment variables. To edit a list, click the "Edit" switch in its upper right corner. The list will go into edit mode and the label will change to "Editing"; you can make any number of changes, then save the changes or discard them with the buttons below.

![Variable lists in edit mode](./images/vars-edit.png)

### Changing or Adding Variables

To change the name or value of an existing variable, edit the appropriate text fields.

In edit mode, variable lists include an empty row at the bottom. To create a new variable, enter a new key and value in that row; use the bottom row's "Add" button if you need additional empty rows.

### Multi-line Values

The text fields for variable values can handle multi-line text (typed or pasted) without any special effort.

### HCL Values

Variable values are strings by default. To enter list or map values, click the variable's "HCL" checkbox and enter the value with the same HCL syntax you would use when writing terraform code. For example:

```hcl
{
    us-east-1 = "image-1234"
    us-west-2 = "image-4567"
}
```

HCL can be used for Terraform variables, but not for environment variables. The HCL code you enter for values is interpreted by the same Terraform version that performs runs in the workspace. (See [How TFE Uses Variables](#how-tfe-uses-variables) below.)

### Sensitive Values

Terraform often needs cloud provider credentials and other sensitive information that shouldn't be widely available within your organization.

To protect these secrets, you can mark any any Terraform or environment variable as sensitive data by clicking its "Sensitive" checkbox in edit mode.

Marking a variable as sensitive severely limits how users can interact with it:

- Nobody (including you) can view the value in TFE's UI or API. (However, Terraform runs will receive the value, and might print the value in logs if the configuration pipes the value through to an output or a resource parameter. Take care when writing your configurations.)
- Nobody can edit the variable's name or value, change whether or not it's an HCL value, or mark it as non-sensitive. To alter anything about a sensitive variable, you must delete it and create a new variable with the same name.

### Determining Variable Names

Terraform Enterprise can't automatically discover variable names from a workspace's Terraform code. You must discover the necessary variable names by reading code or documentation, then enter them manually.

If a required input variable is missing, Terraform plans in the workspace will fail and print an explanation in the log.

## How TFE Uses Variables

### Terraform Variables

After retrieving the workspace's configuration, TFE uses a workspace's Terraform variables to write a `terraform.tfvars` file into the working directory. Terraform loads that `tfvars` file as part of the run.

This means:

- HCL variable values behave predictably, without needing to accommodate shell quoting.
- You cannot commit a file named `terraform.tfvars` to version control, since TFE will overwrite it. (Note that you shouldn't check in `terraform.tfvars` even when running Terraform solely on the command line.)
- In the event that HCL syntax changes slightly between Terraform versions, all values in a given workspace will be handled consistently, since the variables file is interpreted by the same Terraform version that loads the rest of the code.

### Environment Variables

TFE performs Terraform runs on disposable Linux worker VMs using a POSIX-compatible shell. Before running Terraform, TFE populates the shell with environment variables using the `export` command.

### Secure Storage of Variables

TFE encrypts all variable values securely using [Vault's transit backend](https://www.vaultproject.io/docs/secrets/transit/index.html) prior to saving them. This ensures that no out-of-band party can read these values without proper authorization.
