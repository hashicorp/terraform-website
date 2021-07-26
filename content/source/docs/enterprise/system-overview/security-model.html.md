---
layout: "enterprise"
page_title: "Security Model- System Overview - Terraform Enterprise"
---

# Terraform Enterprise Security Model


This page explains the aspects of the Terraform security model that are unique to Terraform Enterprise. We recommend also reviewing the core concepts in [Terraform Cloud Security model](/docs/cloud/architectural-details/security-model.html).

## Personas

In addition to those listed in [Terraform Cloud Security model](/docs/cloud/architectural-details/security-model.html), Terraform Enterprise requires the following personas for managing and administering the application.


### Infrastructure Admin

Outside of the application, administrators of the Terraform Enterprise deployment are responsible for managing the underlying infrastructure, upgrading the application, and configuring Terraform Enterprise either via the [Replicated admin console](../install/config.html#system-configuration) or by editing the [application settings file](../install/automating-the-installer.html).

Terraform Enterprise grants extensive permissions to this role, so we recommend limiting the number of users who are infrastructure admins in your organization.

### Site Admin

[Site admins](../admin/admin-access.html) are responsible for application-level configuration of Terraform Enterprise. They can manage all users, workspaces, and organizations through the admin interface and have access to all data stored within Terraform Enterprise. Site admins are also responsible for configuring SAML and are the only users that can access Terraform Enterprise with a username and password once SAML is configured.

Terraform Enterprise grants extensive permissions to this role, so we recommend limiting the number of users who are site admins in your organization.


## Differences Between Terraform Enterprise and Terraform Cloud Security Models

All of the content on [Terraform Cloud security model](/docs/cloud/architectural-details/security-model.html) applies to Terraform Enterprise, with the exception of the points listed below.

### Terraform Enterprise Requires You to Manage and Secure the Underlying Network and Infrastructure

Infrastructure admins are required to manage all aspects of the underlying infrastructure. This includes initial provisioning, secure configuration, access control, network ACL configuration, and OS-level software updates. Terraform Enterprise cannot ensure the security of your data if the underlying infrastructure is compromised.

### You are Responsible for Updating Your Terraform Enterprise Deployment

We release security fixes, application features, and bug fixes for Terraform Enterprise each month. Infrastructure admins are responsible for applying updates.

### You are Responsible for Availability, Backups, and Disaster Recovery

Infrastructure admins are responsible for all aspects of reliability and availability. Refer to Terraform Enterprise documentation on [monitoring](../admin/monitoring.html), [backups and restores](../admin/backup-restore.html), and [high availability mode (active/active)](../admin/active-active.html) for more guidance on this topic.

### Terraform Enterprise Isolates Terraform Operations via Docker Containers

Unlike Terraform Cloud, Terraform Enterprise performs all Terraform operations in Docker containers on the Terraform Enterprise host. The containers are assigned to an isolated Docker network to prevent them from communicating with Terraform Enterprise backend services. However, Terraform Enterprise does not perform any egress filtering, so Terraform runs can still access available network resources.

## Recommendations for Securely Operating Terraform Enterprise

In addition those provided in the [Terraform Cloud security model](/docs/cloud/architectural-details/security-model.html), we recommend the following for Terraform Enterprise users.

### Run Terraform Enterprise in an Isolated Network, Limit Ingress Ports, and Restrict Access to Underlying Infrastructure

To minimize attack surface, we recommend running Terraform Enterprise in an isolated network and limiting ingress ports to only 80 and 443.

For standalone deployments, port 8800 is reserved for the [Replicated admin console](../admin/admin-access.html), which is used for configuring Terraform Enterprise. This port should only be exposed to infrastructure admins. If you choose to configure Terraform Enterprise with the [automated process](../install/automating-the-installer.html), you can disable the Replicated admin console by passing the `disable-replicated-ui` argument to the installation script:

```sudo bash ./install.sh disable-replicated-ui```

Additionally, we recommend restricting access to the nodes that are running Terraform Enterprise. Terraform Enterprise can not ensure the security or integrity of your data if the underlying infrastructure is compromised.

### Enable Optional Security Features

Once you are ready to use Terraform Enterprise for production workloads, we recommend enabling these optional security features.

#### Enable Strict Transport Security Header

You can configure Terraform Enterprise to set the [Strict Transport Security (HSTS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) header by:

* Visiting the installer dashboard "Settings" page and enabling “Force TLS” under the “SSL/TLS Configuration” section.
* Setting [force_tls](../install/automating-the-installer.html#force_tls) in the application settings file.


~> **Note:** Once properly configured, the HSTS header cannot be disabled and will prevent clients from accessing your Terraform Enterprise domain via HTTP or HTTPS using a self-signed cert. We recommend only enabling this setting for production Terraform Enterprise deployments.

#### Restrict Terraform Build Worker Metadata Access

By default, Terraform Enterprise does not prevent Terraform operations from accessing the instance metadata service, which may contain IAM credentials or other sensitive data. Refer to [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html), [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/instance-metadata-service?tabs=windows), or [Google Cloud](https://cloud.google.com/compute/docs/storing-retrieving-metadata) documentation for more information on this service.

Terraform Enterprise allows you to restrict access to the metadata endpoint from Terraform operations, preventing workspaces from reading any data from the metadata service. You can do this by:

* Visiting the installer dashboard "Settings" page and enabling “Restrict Terraform Build Worker Instance Metadata Access” under the “Advanced Configuration” section. 
* Setting [restrict_worker_metadata_access](../install/automating-the-installer.html#restrict_worker_metadata_access) in the application settings file.

We recommend enabling this setting to prevent Terraform operations from accessing the instance metadata endpoint, unless you are relying on the [instance profile to provide default credentials to workspaces](../before-installing/index.html#instance-profile-as-default-credentials).

#### Disable Global Remote State Sharing

Terraform Enterprise allows site admins to enable [global remote state sharing](../admin/general.html#remote-state-sharing), which allows any workspace to access the state versions of any other workspace within the same organization. We recommend disabling this feature and relying on [controlled remote state access](https://www.hashicorp.com/blog/announcing-controlled-remote-state-access-for-terraform-cloud-and-enterprise) if you need to share state between workspaces.

#### Treat Support Bundles with Care

Terraform Enterprise uses support bundles to share diagnostic information with HashiCorp support. Please note that support bundles may contain sensitive information from your Terraform Enterprise installation. You should not share them with untrusted parties and should delete them as soon as possible.

#### Update Terraform Enterprise Often

We release Terraform Enterprise updates each month. Updates may contain additional security features or fixes for existing security vulnerabilities, so we recommend establishing a process for periodically updating your Terraform Enterprise installation.

#### Subscribe to Terraform Enterprise Security Bulletins

We publish updates that address security vulnerabilities in HashiCorp products. You can find them in the Security category of [HashiCorp Discuss](https://discuss.hashicorp.com/c/security/).

We recommend that Terraform Enterprise infrastructure admins follow the [documented steps](https://discuss.hashicorp.com/t/about-hashicorp-security-updates/15330) to subscribe to email notifications or the RSS feed for Terraform Enterprise security updates.
