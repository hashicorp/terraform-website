---
layout: "github-actions"
page_title: "Getting Started - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-started"
---

# Getting Started

GitHub Actions allow you to trigger commands in reaction to GitHub events.
Terraform's GitHub Actions are designed to run on new and updated Pull Requests to help you review
and validate Terraform changes.

## Recommended Workflow
The easiest way to get started, is to copy our recommended workflow.

-> **Note:** If you'd like to write your own custom workflow using our Actions, check out the [Actions Reference](../actions).

1. Open up your repository in GitHub and click on the **Actions** tab
    ![Actions Tab](./images/actions-tab.png)

1. Click the **Create a new workflow** button
    <img src="./images/create-workflow-button.png" alt="Create a new workflow" width="200px">

1. Click the **<> Edit new file** tab
    ![Edit Workflow Tab](./images/edit-workflow.png)

1. Replace the default workflow with the below contents

    ```hcl
    workflow "Terraform" {
      resolves = "terraform-plan"
      on = "pull_request"
    }

    action "filter-to-pr-open-synced" {
      uses = "docker://superbbears/filter:0.2.0"
      args = ["action", "opened|synchronize"]
    }

    action "terraform-fmt" {
      uses = "hashicorp/terraform-github-actions/fmt@v0.1"
      needs = "filter-to-pr-open-synced"
      secrets = ["GITHUB_TOKEN"]
      env = {
        TF_ACTION_WORKING_DIR = "."
      }
    }

    action "terraform-init" {
      uses = "hashicorp/terraform-github-actions/init@v0.1"
      needs = "terraform-fmt"
      secrets = ["GITHUB_TOKEN"]
      env = {
        TF_ACTION_WORKING_DIR = "."
      }
    }

    action "terraform-validate" {
      uses = "hashicorp/terraform-github-actions/validate@v0.1"
      needs = "terraform-init"
      secrets = ["GITHUB_TOKEN"]
      env = {
        TF_ACTION_WORKING_DIR = "."
      }
    }

    action "terraform-plan" {
      uses = "hashicorp/terraform-github-actions/plan@v0.1"
      needs = "terraform-validate"
      secrets = ["GITHUB_TOKEN"]
      env = {
        TF_ACTION_WORKING_DIR = "."
        # If you're using Terraform workspaces, set this to the workspace name.
        TF_ACTION_WORKSPACE = "default"
      }
    }
    ```
1. **Directories** – If your Terraform is in a different directory that the root
 of your repo, replace all instances of

      ```hcl
      TF_ACTION_WORKING_DIR = "."
      ```
      With your directory, relative to the root of the repo, ex.

      ```hcl
      TF_ACTION_WORKING_DIR = "./terraform"
      ```
      If you have multiple directories of Terraform code see [Directories](../directories)

1. **Workspaces** – If your Terraform runs in a different
 [Terraform workspace](https://www.terraform.io/docs/state/workspaces.html) than `default`,
  change the `TF_ACTION_WORKSPACE` environment variable in the `terraform-plan` action.

    ```hcl
    TF_ACTION_WORKSPACE = "your-workspace"
    ```

    If you have multiple workspaces, see [Workspaces](../workspaces).
1. **Credentials** – If you're using a Terraform provider that requires
 credentials to run `terraform plan` (like AWS or Google Cloud Platform)
  then you need to add those credentials as Secrets to the `terraform-plan` action.
   Secrets can only be added from the **Visual Editor** so click back to that tab.

    ![Visual Editor](./images/visual-editor.png)

    Scroll down to the `terraform-plan` action and click **Edit**.
     This will open up the action editor on the right side where you'll be able
      to add your secrets, ex. `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
       See your [Provider Documentation](https://www.terraform.io/docs/providers/)
        for how to use environment variables with your provider.

    ![Add Secrets](./images/add-secrets.png)

      ⚠️ WARNING ⚠️ These secrets could be exposed if the plan action is run on a
       malicious Terraform file. As a result, we recommend you do not use the plan action
        on public repos or repos where untrusted users can submit pull requests.
1. Click **Start commit** to commit the Workflow.
1. On your next Pull Request, you should see the Actions running.