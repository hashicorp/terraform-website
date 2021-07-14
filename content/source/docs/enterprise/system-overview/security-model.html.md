---
layout: "enterprise"
page_title: "Security Model- System Overview - Terraform Enterprise"
---

# Terraform Enterprise Security Model

## Purpose of this document

This page explains the aspects of the Terraform security model that are unique to Terraform Enterprise. We recommend also reviewing the core concepts in [Terraform Cloud Security model](../../cloud/architectural-details/security-model.html).

## Personas

In addition to those listed in [Terraform Cloud Security model](../../cloud/architectural-details/security-model.html), Terraform Enterprise requires the following personas for managing and administering the application.


### Infrastructure Admin

Outside of the application, administrators of the Terraform Enterprise deployment are responsible for managing the underlying infrastructure, upgrading the application, and configuring Terraform Enterprise either via the [Replicated admin console](../install/config.html#system-configuration) or by editing the [application settings file](../install/automating-the-installer.html).

Due to the extensive capabilities granted to this role, the infrastructure admin role be restricted to a small number of users within your organization.

### Site Admin

[Site admins](../admin/admin-access.html) are responsible for application-level configuration of Terraform Enterprise. They can manage all users, workspaces, and organizations through the admin interface and have access to all data stored within Terraform Enterprise. Site admins are also responsible for configuring SAML and are the only users that can access Terraform Enterprise with a username and password once SAML is configured. 

Due to the extensive capabilities granted to this role, the site admin role should be restricted to a small number of users within your organization.


## Differences Between Terraform Enterprise and Terraform Cloud Security Models

For the most part, Terraform Enterprise’s threat model can be considered a superset of the [Terraform Cloud security model](../../cloud/architectural-details/security-model.html) and (with the exception of the points listed below) all of the content on that page applies to Terraform Enterprise. Terraform Enterprise’s threat model differs from that of Terraform Clouds in these respects:

### TFE Requires You to Manage and Secure the Underlying Network and Infrastructure

TFE infrastructure admins are required to manage all aspects of the underlying infrastructure including initial provisioning, secure configuration, access control, configuring network ACLs, and OS-level software updates. TFE can not ensure the security of your data if the underlying infrastructure is compromised.

### You are Responsible for Updating Your TFE Deployment

Security fixes are released along with application features and bug fixes via TFE’s standard monthly release cycle. TFE infrastructure admins are responsible for applying updates.

### You are Responsible for TFE’s Availability, Backups, and Disaster Recovery

TFE infrastructure admins are responsible for all aspects of TFE’s reliability and availability. Refer to TFE documentation on [monitoring](../admin/monitoring.html), [backups and restores](../admin/backup-restore.html), and [high availability mode (active/active)](../admin/active-active.html) for more guidance on this topic.

### TFE Isolates Terraform Operations via Docker Containers, not a separate environment

Unlike Terraform Cloud, TFE executes all Terraform operations in Docker containers on the TFE host. The containers are assigned to an isolated Docker network to prevent them from communicating with TFE’s backend services, but may have access to resources available on hosts accessible from the your TFE instance. 

## Recommendations for Securely Operating Terraform Enterprise

In addition the the recommendations provided in the [Terraform Cloud security model](../../cloud/architectural-overview/security-model.html), we offer these recommendations to users of Terraform Enterprise 

### Run Terraform Enterprise in an Isolated Network, Limit Ingress Ports, and Restrict Access to Underlying Infrastructure

To minimize attack surface, we recommend running TFE in an isolated network and limiting ingress ports to only 80 and 443. 

For standalone deployments, port 8800 is reserved for the [Replicated admin console](../admin/admin-access.html), which is used for configuring TFE. This port should only be exposed to TFE infrastructure admins. Alternatively, if you choose to configure TFE via the [automated process](../install/automating-the-installer.html), you can disable the Replicated admin console by passing the `disable-replicated-ui` argument to the installation script:

```sudo bash ./install.sh disable-replicated-ui```

Additionally, we recommend restricting access to the nodes that are running TFE. TFE can not ensure the security or integrity of its data if the underlying infrastructure is compromised.

### Enable Optional Security Features

Once you are ready to use Terraform Enterprise for production workloads, we recommend enabling these optional security features.

#### Strict Transport Security Header

You can configure TFE to set the [Strict Transport Security (HSTS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) header via the Settings page of the installer dashboard by enabling “Force TLS” radio button under “SSL/TLS Configuration”

You can also enable this setting via the application settings file file with the [force_tls](../install/automating-the-installer.html#force_tls) setting.

~> **Note:** Once properly configured, the HSTS header cannot be disabled and will prevent clients from accessing your TFE domain via HTTP or HTTPS using a self-signed cert. We recommend only enabling this setting for production TFE deployments.

#### Restrict Terraform Build Worker Metadata Access

By default Terraform Enterprise does not prevent Terraform operations from accessing the instance metadata service, which may contain IAM credentials or other sensitive data. Refer to [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html), [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/instance-metadata-service?tabs=windows), or [Google Cloud's](https://cloud.google.com/compute/docs/storing-retrieving-metadata) documentation for more information on this service.

TFE allows you to restrict access to the metadata endpoint from Terraform operations, preventing workspaces from reading any data from the metadata service. This feature can be enabled via the “Restrict Terraform Build Worker Instance Metadata Access” setting under the “Advanced Configuration” section in the installer dashboard’s settings page, or via the [restrict_worker_metadata_access](../install/automating-the-installer.html#restrict_worker_metadata_access) setting in the application settings file.

Unless you are relying on the [instance profile as a means of providing default credentials to TFE workspaces](../before-installing/index.html#aws-specific-configuration), we recommend enabling this setting to prevent Terraform operations from accessing the instance metadata endpoint. 

#### Ensure Global Remote State Sharing is Disabled

TFE allows administrators to enable [global remote state sharing](../admin/general.html#remote-state-sharing), a feature that allows any workspace to access the state versions of any other workspace within the same organization. We recommend disabling the feature and relying on [controlled remote state access](https://www.hashicorp.com/blog/announcing-controlled-remote-state-access-for-terraform-cloud-and-enterprise) if you need to share state between workspaces.

#### Treat Support Bundles with Care

Terraform Enterprise uses support bundles to share diagnostic information with HashiCorp support. Please note that support bundles may contain sensitive information from your Terraform Enterprise installation. You should not share them with untrusted parties and should delete them as soon as possible.

#### Regularly Update Terraform Enterprise

We release Terraform Enterprise updates each month. Updates may contain additional security features or fixes for existing security vulnerabilities, so we recommend establishing a process for periodically updating your Terraform Enterprise installation.

#### Subscribe to Terraform Enterprise Security Bulletins

We publish security updates that address security vulnerabilities in HashiCorp products. You can find them in the Security category of [HashiCorp Discuss](https://discuss.hashicorp.com/c/security/).

We recommend that Terraform Enterprise administrators follow the [documented steps](https://discuss.hashicorp.com/t/about-hashicorp-security-updates/15330) to subscribe to email notifications or the RSS feed for Terraform Enterprise security updates.
