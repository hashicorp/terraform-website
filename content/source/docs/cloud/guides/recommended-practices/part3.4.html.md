---
page_title: "Part 3.4: Advanced Workflow Improvements - Terraform Recommended Practices"
layout: "intro"
---

# Part 3.4: Advanced Improvements to Collaborative Infrastructure as Code

Now that you have a collaborative interface and workflow for provisioning, you have a solid framework for improving your practices even further.

The following suggestions don’t have to be done in order, and some of them might not make sense for every business. We present them as possibilities for when you find yourself asking what’s next.

* Move more processes and resources into Terraform Cloud. Even after successfully implementing Terraform Cloud, there’s a good chance you still have manual or semi-automated workflows and processes. We suggest holding a discovery meeting with all of the teams responsible for keeping infrastructure running, to identify future targets for automation. You can also use your notes from the questions in section 2 as a guide, or go through old change requests or incident tickets.

* Adopt [HashiCorp Packer](https://www.packer.io/) for image creation. Packer helps you build machine images in a maintainable and repeatable way, and can amplify Terraform’s usefulness.

* Apply policy to your Terraform configurations with [Sentinel](../../sentinel/index.html) to enforce compliance with business and
regulatory rules.

* Monitor and retain Terraform Enterprise's audit logs. [Learn more about logging in Terraform Enterprise instances here.](/docs/enterprise/admin/logging.html)

* Add infrastructure monitoring and performance metrics. This can help make environment promotion safer, and safeguard the performance of your applications. There are many tools available in this space, and we recommend monitoring both the infrastructure itself, and the user’s-eye-view performance of your applications.

* Use the Terraform Cloud API. The [Terraform Cloud API](../../api/index.html) can be used to integrate with general-purpose CI/CD tools to trigger Terraform runs in response to a variety of events.
