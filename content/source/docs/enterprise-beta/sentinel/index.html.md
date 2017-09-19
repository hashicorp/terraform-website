---
layout: enterprise2
page_title: "Sentinel - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-sentinel"
---

# Sentinel Policy as Code

[Sentinel](https://www.hashicorp.com/sentinel) is an embedded policy as code
framework integrated with the HashiCorp Enterprise products. It enables
fine-grained, logic-based policy decisions, and can be extended to use information from external sources.

To learn how to use Sentinel to enforce policies in Terraform, read [the Sentinel
documentation](https://docs.hashicorp.com/sentinel/app/terraform/).

Here are some examples of Sentinel policies in Terraform:

**All AWS instances must have a `billing-id` tag:**

```
import "tfplan"

main = rule {
  all tfplan.resources as type, resources {
    type is "aws_instance" and
    all resources as r { r.applied.tags contains "billing-id" }
  }
}
```

**Only allow GCP instance sizes smaller than n1-standard-16:**

```
import "tfplan"

allowed_machine_types = [
    "n1-standard-1",
    "n1-standard-2",
    "n1-standard-4",
    "n1-standard-8",
]

main = rule {
    all tfplan.resources as type, resources {
        all resources as r {
            r.applied.machine_type in allowed_machine_types
        }
    }
}
```
