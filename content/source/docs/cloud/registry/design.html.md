---
layout: "cloud"
page_title: "Using the Configuration Designer - Private Registry - Terraform Cloud and Terraform Enterprise"
description: |-
  The configuration designer lets you outline a configuration with private modules and helps you quickly define variables.
---

# Using the Configuration Designer

Terraform Cloud's private registry includes a configuration designer that can help you spend less time writing boilerplate code in a module-centric Terraform workflow.

The configuration designer lets you outline a configuration for a new workspace by choosing any number of private modules. It then lists those modules' variables as a fillable HTML form, with a helper interface for finding values that you can interpolate. When you are finished, the designer returns the text of a `main.tf` configuration. This is the same Terraform code you would have written in your text editor.

## Accessing the Configuration Designer

Click the **Registry** button in the main navigation bar, and then click **<> Design Configuration**.

![Terraform Cloud screenshot: the design configuration button](./images/design-start.png)

The **Select Modules** page appears.

![Terraform Cloud screenshot: the select modules page](./images/design-select-modules.png)


## Adding Modules

Filter and search the left side of the **Select Modules** page to find private modules that you can add to your configuration.

Click **Add Module** for all of the modules you want to use in your configuration. These modules appear in the **Selected Modules** list on the right side of the page.

### Setting Versions

Selecting a module adds its most recent version to the configuration. To specify a different version:

1. Click the module's version number from the **Selected Modules** list on the right.
2. Select an alternate version from the menu.

![Terraform Cloud screenshot: setting a module version with the drop-down](./images/design-set-version.png)

## Setting Variables

When you finish selecting modules, click **Next »** to go to the **Set Variables** page.

![Terraform Cloud screenshot: the set variables page](./images/design-variables-finished.png)

The left side of this page lists your chosen modules, and the right side lists all variables for the currently selected module. Each variable is labeled as required or optional.

You can switch between modules without losing your work; click a module's **Configure** button to switch to its variable list.

Once you set a value for all of a module's required variables, its **Configure** button changes to a green **Configured** button.

### Interpolation Searching

Variable values can be literal strings, or can interpolate other values. When you start typing an interpolation token (`${`), the designer displays a help message. As you continue typing, it searches the available outputs in your other selected modules, as well as outputs from workspaces where you are authorized to read state outputs. You can select one of these search results, or type a full name if you need to reference a value Terraform Cloud does not know about.
[permissions-citation]: #intentionally-unused---keep-for-maintainers

![Terraform Cloud screenshot: interpolation help](./images/design-variables-help.png)

### Deferring Variables

Sometimes, configuration users should be able to set certain variables according to their use cases.

Select the **Deferred** checkbox to delegate a variable to configuration users. This ties the variable's value to a new top-level Terraform variable with no default value. All users that create a workspace from your configuration will have to provide a value for that variable.

## The Output Configuration

When all modules are configured, click **Next »**.

The "Publish" page appears. Use the **Preview configuration** menu to review the generated code.

![Terraform Cloud screenshot: configuration designer output](./images/design-verify.png)

The configuration designer does not create any repositories or workspaces. To create workspaces with the configuration, you must download the generated code, save it as the `main.tf` file in a new directory, and commit it to version control. After you download the code, you can make any necessary changes or additions. For example, you may want to add non-module resources.

When you are sure you have downloaded the results, click **Done** to discard the configuration. Terraform Cloud does not save output from previous configuration designer runs.
