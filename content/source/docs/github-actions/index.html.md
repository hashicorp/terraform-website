---
layout: "github-actions"
page_title: "Teraform GitHub Actions"
---

# Terraform GitHub Actions

[GitHub Actions](https://help.github.com/actions) allow you to execute one or more workflows in response to GitHub events such as a pushing a commit or opening a pull request. Through GitHub Actions, a user can automate common Terraform workflows such as installing Terraform CLI and executing various `terraform` commands.

-> **Note** The former [hashicorp/terraform-github-actions](https://github.com/hashicorp/terraform-github-actions/) GitHub action is no longer maintained. It has been superseded by the `hashicorp/setup-terraform` GitHub action listed below. Although no functionality has been lost, workflow files will need to be reformatted to in order to use the `hashicorp/setup-terraform` GitHub action.

HashiCorp currently maintains the following GitHub actions to help automate Terraform workflows.

* [hashicorp/setup-terraform](/docs/github-actions/setup-terraform.html)
