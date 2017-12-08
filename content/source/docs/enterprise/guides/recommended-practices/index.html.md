---
page_title: "Index - Terraform Recommended Practices"
layout: "guides"
sidebar_current: "recommended-practices"
---

# Terraform Recommended Practices

This guide is meant for enterprise users looking to advance their Terraform
usage from a few individuals to a full organization.

## Introduction

HashiCorp specializes in helping IT organizations adopt cloud technologies. Based on what we've seen work well, we believe the best approach to provisioning is **collaborative infrastructure as code,** using Terraform as the core workflow and Terraform Enterprise to manage the boundaries between your organization's different teams, roles, applications, and deployment tiers.

The collaborative infrastructure as code workflow is built on many other IT best practices (like using version control and preventing manual changes), and you must adopt these foundations before you can fully adopt our recommended workflow. Achieving state-of-the-art provisioning practices is a journey, with several distinct stops along the way.

This guide describes our recommended Terraform practices and how to adopt them. It covers the steps to start using our tools, with special attention to the foundational practices they rely on.

- [Part 1: An Overview of Our Recommended Workflow](./part1.html) is a holistic overview of Terraform Enterprise's collaborative infrastructure as code workflow. It describes how infrastructure is organized and governed, and how people interact with it.
- [Part 2: Evaluating Your Current Provisioning Practices](./part2.html) is a series of questions to help you evaluate the state of your own infrastructure provisioning practices. We define four stages of operational maturity around provisioning to help you orient yourself and understand which foundational practices you still need to adopt.
- [Part 3: How to Evolve Your Provisioning Practices](./part3.html) is a guide for how to advance your provisioning practices through the four stages of operational maturity. Many organizations are already partway through this process, so use what you learned in part 2 to determine where you are in this journey.

    This part is split into four pages:

    - [Part 3.1: How to Move from Manual Changes to Semi-Automation](./part3.1.html)
    - [Part 3.2: How to Move from Semi-Automation to Infrastructure as Code](./part3.2.html)
    - [Part 3.3: How to Move from Infrastructure as Code to Collaborative Infrastructure as Code](./part3.3.html)
    - [Part 3.4: Advanced Improvements to Collaborative Infrastructure as Code](./part3.4.html)

## Next

Begin reading with [Part 1: An Overview of Our Recommended Workflow](./part1.html).
