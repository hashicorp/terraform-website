---
layout: "enterprise"
page_title: "Mounted Disk Requirements - Before Installing - Terraform Enterprise"
---

# Disk Requirements for Mounted Disk Operational Mode

If you choose to use the "Production - Mounted Disk" operational mode, Terraform Enterprise will manage its own PostgreSQL database and object storage using a separate directory on the host, with the intention that the directory is configured to store its data on an external disk, such as EBS, iSCSI, etc.

We strongly suggest following the guidelines below for mounted disk storage.

## Supported Mounted Disk Types

The following are **supported** mounted disk types:

* AWS EBS
* GCP Zonal Persistent Disk
* Azure Disk Storage
* iSCSI
* SAN
* Physically connected disks as in non-cloud hardware

These disk types provide the necessary reliability and performance for data storage and retrieval in Terraform Enterprise.

## Unsupported Mounted Disk Types

The following are **not** supported mounted disk types:

* NFS
* SMB/CIFS

## Mounted Disk Types Not Listed Here

If the type of mounted disk you wish to use is not in either of the above lists, please contact your HashiCorp representative for clarification on whether that type is supported.

## Minimum Disk Size

Terraform Enterprise's minimum disk size is 40GB.

Depending on your cloud or storage application, you may need to confirm the disk has been resized to at least 40GB.

For example, with RedHat-flavor (RHEL, CentOS, Oracle Linux) images in Azure Cloud, the storage disk must be resized above the 30GB default after initial boot with `fdisk`, as documented in the Azure knowledge base article [How to: Resize Linux osDisk partition on Azure](https://blogs.msdn.microsoft.com/linuxonazure/2017/04/03/how-to-resize-linux-osdisk-partition-on-azure/).
