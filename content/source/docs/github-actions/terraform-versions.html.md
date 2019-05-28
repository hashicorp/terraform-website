---
layout: "github-actions"
page_title: "Terraform Versions - Terraform GitHub Actions"
sidebar_current: "docs-github-actions-tf-versions"
---

# Terraform Versions

Currently, Terraform GitHub Actions **only support the latest version of Terraform**.

The current version can be found by looking at the `FROM` section here: [https://github.com/hashicorp/terraform-github-actions/blob/master/init/Dockerfile#L1](https://github.com/hashicorp/terraform-github-actions/blob/master/init/Dockerfile#L1).

If you need to use a specific version, you will need to either use an [older
release](https://github.com/hashicorp/terraform-github-actions/releases) or
fork the repo and change each Dockerfile's `FROM` instruction: 

```diff
-FROM hashicorp/terraform:0.12.0
+FROM hashicorp/terraform:<your version>
```

We know this is not a good user experience and are tracking this issue [here](https://github.com/hashicorp/terraform-github-actions/issues/23).
