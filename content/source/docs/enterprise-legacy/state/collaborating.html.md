---
layout: "enterprise"
page_title: "Collaborating - State - Terraform Enterprise (legacy)"
sidebar_current: "docs-enterprise-state-collaborating"
description: |-
  How to collaborate on states.
---

# Collaborating on Terraform Remote State

Terraform Enterprise is one of a few options to store [remote state](/docs/state/remote.html).

Remote state gives you the ability to version and collaborate on Terraform
changes. It stores information about the changes Terraform makes based on
configuration.

In order to collaborate safely on remote state, we recommend
[creating an organization](/docs/enterprise-legacy/organizations/create.html) to
manage teams of users.

Then, following a [Terraform Enterprise Run](/docs/enterprise-legacy/runs) or [`apply`](/docs/commands/apply.html)
you can view state versions in the `States` list of the environment.
