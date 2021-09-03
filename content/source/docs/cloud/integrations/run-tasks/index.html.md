---
layout: "cloud"
page_title: "Terraform Cloud Run Tasks Integrations Setup"
description: |-
  Run tasks allow Terraform Cloud to execute tasks in external systems at specific points in the Terraform Cloud run lifecycle. 

---

# Run Tasks Integration


In addition to using existing technology partners integrations, HashiCorp Terraform Cloud customers can build their own custom run task integrations. Custom integrations have access to plan details in between the plan and apply phase, and can display custom messages within the run pipeline as well as prevent a run from continuing to the apply phase.

## Prerequisites

To build a custom integration, you must have a server capable of receiving requests from Terraform Cloud and responding with a status update to a supplied callback URL. When creating an event hook, you supply an endpoint url to receive the hook. We send a test POST to the supplied URL, and it must respond with a 200 for the event hook to be created.

This feature relies heavily on the proper parsing of [plan JSON output](../../../internals/json-format.html). When sending this output to an external system, be certain that system can properly interpret the information provided.

## Integration Details

When a run reaches the pre apply phase and an event hook is triggered, the supplied URL will receive details about the run in a payload similar to the one below. The server receiving the event hook should respond `200 OK`, or the hook will be retried.

```json
{
  "payload_version": 1,
  "access_token": "4QEuyyxug1f2rw.atlasv1.iDyxqhXGVZ0ykes53YdQyHyYtFOrdAWNBxcVUgWvzb64NFHjcquu8gJMEdUwoSLRu4Q",
  "task_result_id": "taskrs-2nH5dncYoXaMVQmJ",
  "task_result_enforcement_level": "mandatory",
  "task_result_callback_url": "https://app.terraform.io/api/v2/task-results/5ea8d46c-2ceb-42cd-83f2-82e54697bddd/callback",
  "run_app_url": "https://app.terraform.io/app/hashicorp/my-workspace/runs/run-i3Df5to9ELvibKpQ",
  "run_id": "run-i3Df5to9ELvibKpQ",
  "run_message": "Triggered via UI",
  "run_created_at": "2021-09-02T14:47:13.036Z",
  "run_created_by": "username",
  "workspace_id": "ws-ck4G5bb1Yei5szRh",
  "workspace_name": "tfr_github_0",
  "workspace_app_url": "https://app.terraform.io/app/hashicorp/my-workspace",
  "organization_name": "hashicorp",
  "plan_json_api_url": "https://app.terraform.io/api/v2/plans/plan-6AFmRJW1PFJ7qbAh/json-output",
  "vcs_repo_url": "https://github.com/hashicorp/terraform-random",
  "vcs_branch": "main",
  "vcs_pull_request_url": null,
  "vcs_commit_url": "https://github.com/hashicorp/terraform-random/commit/7d8fb2a2d601edebdb7a59ad2088a96673637d22"
}
```

Once your server receives this payload, Terraform Cloud expects you to callback to the supplied `task_result_callback_url` using the `access_token` as an [Authentication Header](../../api/index.html#authentication) with a [jsonapi](../../api/index.html#json-api-formatting) payload of the form:

```json
{
  "data": {
    "type": "task-results",
      "attributes": {
        "status": "passed",
        "message": "Hello task"
      }
  }
}
```

Terraform Cloud expects this callback within 10 minutes, or the task will be considered to have `errored`. The supplied message attribute will be displayed in Terraform Cloud on the run details page. The status can be `passed` or `failed`.

Here's what the data flow looks like:

![Screenshot: a diagram of the user and data flow for a Terraform Cloud run task](./images/terraform-cloud-run-tasks-diagram.png)

## Securing your Event Hook

When creating your Event Hook, you can supply an HMAC key which Terraform Cloud will use to create a signature of the payload in the `x-tfc-event-hook-signature` header when calling your service.

## Run Tasks Technology Partners

* Bridgecrew

Bridgecrew helps teams address security and compliance errors in Terraform as part of each and every code review. 

* Infracost

Infracost allows for cloud infrastructure costing, initiated right from a PR or Terraform run.

* Snyk

Snyk’s integration with Terraform Cloud allows teams using Terraform to find, track, and fix security misconfigurations in their cloud infrastructure as part of their SDLC before they ever reach production.

* Refactr

Refactr’s integration allows for users to build workflows for multiple use cases including but not limited to code scanning.

* Lightlytics

From security checks to any additional dependency changes, Lightlytics’s integration provides visual pending changes to your infrastructure.

* cloudtamer.io

When using cloudtamer.io, customers can choose to focus on cost savings or compliance findings on an active account.
