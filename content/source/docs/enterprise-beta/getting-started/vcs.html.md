---
layout: "enterprise2"
page_title: "Configuring VCS - Getting Started - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-started-vcs"
---

# Configuring Version Control Access

**Prerequisites:** At this point, you should have [gotten access to Terraform Enterprise beta](./access.html), and created an organization if necessary.

Before you can use TFE, it needs access to the version control system (VCS) you use for Terraform code.

## About VCS Access

Every workspace in TFE is associated with a VCS repository, which provides the Terraform code for that workspace. To find out which repos are available, and to access their contents, TFE needs access to your VCS service.

## Configuring VCS Access

TFE uses the OAuth protocol to authenticate with VCS services.

~> **Important:** Even if you've used OAuth before, read the instructions carefully. Since TFE's security model treats each _organization_ as a separate OAuth application, we authenticate with OAuth's developer workflow, which is more complex than the standard user workflow.

The exact steps to authenticate are different for each VCS service, but they follow this general order:

On your VCS | On TFE
--|--
Register your TFE organization as a new app. Get ID and key. | &nbsp;
&nbsp; | Tell TFE how to reach VCS, and provide ID and key. Get callback URL.
Provide callback URL. | &nbsp;
&nbsp; | Request VCS access.
Approve access request. | &nbsp;

For complete instructions, click the link for your VCS service below:

- [GitHub](../vcs/github.html)
- [GitHub Enterprise](../vcs/github-enterprise.html)
- GitLab
- Bitbucket Cloud
- Bitbucket Server

Currently, TFE cannot use other VCS services (including generic Git servers).


## Next Steps

After you've configured VCS access, you should [start creating workspaces](./workspaces.html).
