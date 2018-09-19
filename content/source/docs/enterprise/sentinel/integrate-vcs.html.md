---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise"
sidebar_current: "docs-enterprise2-sentinel-integrate-vcs"
---

# Integrate with VCS

Sentinel is designed to enable policy as code. As such, it is recommended that the policies are managed in a VCS service like Github, Bitbucket or Gitlab. Terraform Enterprise will add integration with these VCS providers to automatically ingress the policies from the VCS repository in an upcoming release. In the meantime it is recommended that the [Policy APIs](../api/policies.html) are used to automatically push changes from VCS to Terraform Enterprise using a CI/CD service like Jenkins, Drone, or Circle CI.

To update the policies from your CI/CD pipeline you can use these API endpoints with a command line HTTP client like `curl` or [httpie](https://httpie.org/):

- [Authentication](../api/index.html#authentication)
- [Create](../api/policies.html#create-a-policy) and [Upload](../api/policies.html#upload-a-policy) a Policy
- [Update a Policy](../api/policies.html#update-a-policy)

You can also use the [`tfe_sentinel_policy`](/docs/providers/tfe/r/sentinel_policy.html) resource from the [Terraform Enterprise provider](/docs/providers/tfe/) to upload a policy using Terraform itself.
