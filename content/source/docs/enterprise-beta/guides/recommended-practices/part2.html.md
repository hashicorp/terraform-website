---
page_title: "Part 2: Evaluating Your Current Provisioning Practices - Terraform Recommended Practices"
layout: "guides"
sidebar_current: "recommended-practices-2"
---


# Part 2: Evaluating Your Current Provisioning Practices

Terraform Enterprise depends on several foundational IT practices. Before you can implement Terraform Enterprise's collaborative infrastructure as code workflows, you need to understand which of those practices you're already using, and which ones you still need to implement.

We've written the section below in the form of a quiz or interview, with multiple-choice answers that represent the range of operational maturity levels we've seen across many organizations. You should read it with a notepad handy, and take note of any questions where your organization can improve its use of automation and collaboration.

This quiz doesn't have a passing or failing score, but it's important to know your organization's answers. Once you know which of your IT practices need the most attention, Section 3 will guide you from your current state to our recommended practices in the most direct way.

## Four Levels of Operational Maturity

Each question has several answers, each of which aligns with a different level of operational maturity. Those levels are as follows:

1. **Manual**
    * Infrastructure is provisioned through a UI or CLI.
    * Configuration changes do not leave a traceable history, and aren't always visible.
    * Limited or no naming standards in place.

2. **Semi-automated**
    * Infrastructure is provisioned through a combination of UI/CLI, infrastructure as code, and scripts or configuration management.
    * Traceability is limited, since different record-keeping methods are used across the organization.
    * Rollbacks are hard to achieve due to differing record-keeping methods.

3. **Infrastructure as code**
    * Infrastructure is provisioned using Terraform OSS.
    * Provisioning and deployment processes are automated.
    * Infrastructure configuration is consistent, with all necessary details fully documented (nothing siloed in a sysadmin's head).
    * Source files are stored in version control to record editing history, and, if necessary, roll back to older versions.
    * Some Terraform code is split out into modules, to promote consistent reuse of your organization's more common architectural patterns.

4. **Collaborative infrastructure as code**
    * Users across the organization can safely provision infrastructure with Terraform, without conflicts and with clear understanding of their access permissions.
    * Expert users within an organization can produce standardized infrastructure templates, and beginner users can consume those to follow infrastructure best practices for the organization.
    * Per-workspace access control helps committers and approvers on workspaces protect production environments.
    * Functional groups that don't directly write Terraform code have visibility into infrastructure status and changes through Terraform Enterprise's UI.

By the end of this section, you should have a clear understanding of which operational maturity stage you are in. Section 3 will explain the recommended steps to move from your current stage to the next one.

Answering these questions will help you understand your organization's method for provisioning infrastructure, its change workflow, its operation model, and its security model.

Once you understand your current practices, you can identify the remaining steps for implementing Terraform Enterprise.

## Your Current Configuration and Provisioning Practices

How does your organization configure and provision infrastructure today? Automated and consistent practices help make your infrastructure more knowable and reliable, and reduce the amount of time spent on troubleshooting.

The following questions will help you evaluate your current level of automation for configuration and provisioning.

### Q1. How do you currently manage your infrastructure?

1. Through a UI or CLI. This might seem like the easiest option for one-off tasks, but for recurring operations it is a big consumer of valuable engineering time. It's also difficult to track and manage changes.
2. Through reusable command line scripts, or a combination of UI and infrastructure as code. This is faster and more reliable than pure ad-hoc management and makes recurring operations repeatable, but the lack of consistency and versioning makes it difficult to manage over time.
3. Through an infrastructure as code tool (Terraform, CloudFormation). Infrastructure as code enables scalable, repeatable, and versioned infrastructure. It dramatically increases the productivity of each operator and can enforce consistency across environments when used appropriately.
4. Through a general-purpose automation framework (i.e. Jenkins + scripts / Jenkins + Terraform). This centralizes the management workflow, albeit with a tool that isn't built specifically for provisioning tasks.

### Q2. What topology is in place for your service provider accounts?

1. Flat structure, single account. All infrastructure is provisioned within the same account.
2. Flat structure, multiple accounts. Infrastructure is provisioned using different infrastructure providers, with an account per environment.
3. Tree hierarchy. This features a master billing account, an audit/security/logging account, and project/environment-specific infrastructure accounts.

### Q3. How do you manage the infrastructure for different environments?

1. Manual. Everything is manual, with no configuration management in place.
2. Siloed. Each application team has its own way of managing infrastructure — some manually, some using infrastructure as code or custom scripts.
3. Infrastructure as code with different code bases per environment. Having different code bases for infrastructure as code configurations can lead to untracked changes from one environment to the other if there is no promotion within environments.
4. Infrastructure as code with a single code base and differing environment variables. All resources, regardless of environment, are provisioned with the same code, ensuring that changes promote through your deployment tiers in a predictable way.

### Q4. How do teams collaborate and share infrastructure configuration and code?

1. N/A. Infrastructure as code is not used.
2. Locally. Infrastructure configuration is hosted locally and shared via email, documents or spreadsheets.
3. Ticketing system. Code is shared through journal entries in change requests or problem/incident tickets.
4. Centralized without version control. Code is stored on a shared filesystem and secured through security groups. Changes are not versioned. Rollbacks are only possible through restores from backups or snapshots.
5. Configuration stored and collaborated in a version control system (VCS) (Git repositories, etc.). Teams collaborate on infrastructure configurations within a VCS workflow, and can review infrastructure changes before they enter production. This is the most mature approach, as it offers the best record-keeping and cross-department/cross-team visibility.

### Q5. Do you use reusable modules for writing infrastructure as code?

1. Everything is manual. No infrastructure as code currently used.
2. No modularity. Infrastructure as code is used, but primarily as one-off configurations. Users usually don't share or re-use code.
3. Teams use modules internally but do not share them across teams.
4. Modules are shared organization-wide. Similar to shared software libraries, a module for a common infrastructure pattern can be updated once and the entire organization benefits.

## Your Current Change Control Workflow

Change control is a formal process to coordinate and approve changes to a product or system. The goals of a change control process include:

* Minimizing disruption to services.
* Reducing rollbacks.
* Reducing the overall cost of changes.
* Preventing unnecessary changes.
* Allowing users to make changes without impacting changes made by other users.

The following questions will help you assess the maturity of your change control workflow.

### Q6. How do you govern the access to control changes to infrastructure?

1. Access is not restricted or audited. Everyone in the platform team has the flexibility to create, change, and destroy all infrastructure. This leads to a complex system that is unstable and hard to manage.
2. Access is not restricted, only audited. This makes it easier to track changes after the fact, but doesn't proactively protect your infrastructure's stability.
3. Access is restricted based on service provider account level. members of the team have admin access to different accounts based on the environment they are responsible for.
4. Access is restricted based on user roles. all access is restricted based on user roles at infrastructure provider level.

### Q7. What is the process for changing existing infrastructure?

1. Manual changes by remotely logging into machines. Repetitive manual tasks are inefficient and prone to human errors.
2. Runtime configuration management (Puppet, Chef, etc.). Configuration management tools let you make fast, automated changes based on readable and auditable code. However, since they don't produce static artifacts, the outcome of a given configuration version isn't always 100% repeatable, making rollbacks only partially reliable.
3. Immutable infrastructure (images, containers). Immutable components can be replaced for every deployment (rather than being updated in-place), using static deployment artifacts. If you maintain sharp boundaries between ephemeral layers and state-storing layers, immutable infrastructure can be much easier to test, validate, and roll back.

### Q8. How do you deploy applications?

1. Manually (SSH, WinRM, rsync, robocopy, etc.). Repetitive manual tasks are inefficient and prone to human errors.
2. With scripts (Fabric, Capistrano, custom, etc.).
3. With a configuration management tool (Chef, Puppet, Ansible, Salt, etc.), or by passing userdata scripts to CloudFormation Templates or Terraform configuration files.
4. With a scheduler (Kubernetes, Nomad, Mesos, Swarm, ECS, etc.).

## Your Current Security Model

### Q9. How are infrastructure service provider credentials managed?

1. By hardcoding them in the source code. This is highly insecure.
2. By using infrastructure provider roles (like EC2 instance roles for AWS).Since the service provider knows the identity of the machines it's providing, you can grant some machines permission to make API requests without giving them a copy of your actual credentials.
3. By using a secrets management solution (like Vault, Keywhis, or PAR).We recommend this.
4. By using short-lived tokens. This is one of the most secure methods, since the temporary credentials you distribute expire quickly and are very difficult to exploit. However, this can be more complex to use than a secrets management solution.

### Q10. How do you control users and objects hosted by your infrastructure provider (like logins, access and role control, etc.)?

1. A common 'admin' or 'superuser' account shared by engineers. This increases the possibility of a breach into your infrastructure provider account.
2. Individual named user accounts. This makes a loss of credentials less likely and easier to recover from, but it doesn't scale very well as the team grows.
3. LDAP and/or Active Directory integration. This is much more secure than shared accounts, but requires additional architectural considerations to ensure that the provider's access into your corporate network is configured correctly.
4. Single sign-on through OAuth or SAML. This provides token-based access into your infrastructure provider while not requiring your provider to have access to your corporate network.

### Q11. How do you track the changes made by different users in your infrastructure provider's environments?

1. No logging in place. Auditing and troubleshooting can be very difficult without a record of who made which changes when.
2. Manual changelog. Users manually write down their changes to infrastructure in a shared document. This method is prone to human error.
3. By logging all API calls to an audit trail service or log management service (like CloudTrail, Loggly, or Splunk). We recommend this. This ensures that an audit trail is available during troubleshooting and/or security reviews.

### Q12. How is the access of former employees revoked?

1. Immediately, manually. If you don't use infrastructure as code, the easiest and quickest way is by removing access for that employee manually using the infrastructure provider's console.
2. Delayed, as part of the next release. if your release process is extremely coupled and most of your security changes have to pass through a CAB (Change Advisory Board) meeting in order to be executed in production, this could be delayed.
3. Immediately, writing a hot-fix in the infrastructure as code. this is the most secure and recommended option. Before the employee leaves the building, access must be removed.

## Assessing the Overall Maturity of Your Provisioning Practices

After reviewing all of these questions, look back at your notes and assess your organization's overall stage of maturity: are your practices mostly manual, semi-automated, infrastructure as code, or collaborative infrastructure as code?

Keep your current state in mind as you read the next section.

## Next

Now that you've taken a hard look at your current practices, it's time to begin improving them. Continue on to [Part 3: How to Evolve Your Provisioning Practices](./part3.html).
