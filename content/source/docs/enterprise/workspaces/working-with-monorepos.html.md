---
layout: "enterprise2"
page_title: "Working With Monorepos - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-working-with-monorepos"
---

# Working With Monorepos

~> **Beta Feature:** This page describes functionality which is in early access, and not widely available yet.

If you have several TFE workspaces attached to a monolithic repository (monorepo), you can configure which directories trigger runs for each workspace. The result is fewer queued runs, and your intended changes will be applied sooner.

## Run Triggering

Terraform Enterprise triggers runs for workspaces when you push changes to your VCS repository, using the following rules:

- For workspaces with **no working directory** or **automatic run triggering disabled**, every push triggers a run;
- Pushes which change **files within a workspace's working directory** will always trigger a run;
- Pushes which change **files within additional trigger directories** will also trigger a run;
- Otherwise, no run is triggered.

-> **Note:** These rules also apply to speculative runs on pull requests.

When you create a workspace with a working directory in TFE, by default only pushes with changes within that directory will trigger runs. This behavior is configurable on the new workspace page, or in the Version Control behavior settings:

<img src="images/automatic-run-triggering-ui.png" width=808 height=437 alt="Automatic run triggering UI">

You can add other trigger directories for the workspace. For example, if you share Terraform code in a top-level <code>modules</code> directory, add a trigger directory with path <code>/modules</code> to ensure that a changes to the shared code triggers a run.

## Error Handling

Terraform Enterprise retrieves the changed files for each push or pull request using your VCS provider's API. If for some reason the list of changed files cannot be retrieved, or if it is too large to process, the default behaviour is to trigger runs on all attached workspaces. Should this happen, you may see several runs with state "Planned", due to the push resulting in no changes to infrastructure.

## Opting Out

If you want to opt out of automatic run triggering, choose the "**Always trigger runs**" option. This will ensure that every push or pull request triggers a run on your workspace. Be aware that this may result in triggering many runs which have no effect, slowing down your use of Terraform Enterprise.
