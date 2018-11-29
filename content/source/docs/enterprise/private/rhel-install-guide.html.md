---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation - RHEL Install Guide"
sidebar_current: "docs-enterprise2-private-installer-rhel"
---

# Private Terraform Enterprise Installation - RHEL Install Guide

This install guide is specifically for users of Private Terraform Enterprise installing the product on RedHat Enterprise Linux (RHEL).

## Install Recommendations

* RedHat Enterprise Linux version 7.3 or later.
* Docker 1.13.1 (available in RHEL extras), or Docker EE version 17.06 or later. The later versions are not available in the standard RHEL yum repositories.
   * For Docker EE, there are explicit RHEL instructions to follow: https://docs.docker.com/install/linux/docker-ee/rhel/ 
   * For Docker from RHEL extras, the following should enable the RHEL extras repository:
      * `yum-config-manager --enable rhel-7-server-extras-rpms`
      * on AWS: `yum-config-manager --enable rhui-REGION-rhel-server-extras`
* A properly configured docker storage backend, either:
   * Devicemapper configured for production usage, according to the Docker documentation: https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-direct-lvm-mode-for-production. This configuration requires a second block device available to the system to be used as a thin-pool for Docker. You may need to configure this block device before the host system is booted, depending on the hosting platform.
   * A system capable of using overlay2. The requires at least kernel version 3.10.0-693 and, if XFS is being used, the flag ftype=1. The full documentation on this configuration is at: https://docs.docker.com/storage/storagedriver/overlayfs-driver/
   * If using Docker from RHEL Extras, storage can be configured using the `docker-storage-setup` command

## Mandatory Configuration

If you opt to use Docker from RHEL extras, then you must make a change to its default configuration to avoid hitting an out of memory bug.

1. Open `/usr/lib/systemd/system/docker.service`
1. Remove the line that contains `--authorization-plugin=rhel-push-plugin`
1. Run `systemctl daemon-reload && systemctl restart docker`
1. Run `docker info 2> /dev/null | grep Authorization` to verify that there are no authorization plugins active.
   If nothing is printed, your installation is properly configured. If anything is printed, please
   contact support for further assistance.

## FAQ:
### Can I use the Docker version in rpm-extras?
Sure! Just be sure to have at least 1.13.1 and authorization plugins disabled.

### When I run the installer, it allows me to download and install Docker CE on RedHat. Can I use that?
Yes, Docker CE is compatible with the current installer. However, it is not directly [supported by RedHat](https://access.redhat.com/articles/2726611). You still need to be sure that the storage backend is configured properly as by default, Docker will be using devicemapper in loopback, an entirely unsupported mode.

### Can an installation where `docker info` says that I’m using devicemapper with a loopback file work?
No. This is an installation that docker provides as sample and is not supported by Private Terraform Enterprise due to the significant instability in it. Docker themselves do not suggest using this mode: https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-loop-lvm-mode-for-testing 

### How do I know if an installation is in devicemapper loopback mode?
Run the command `sudo docker info | grep dev/loop`. If there is any output, you’re in devicemapper loopback mode. Docker may also print warning about loopback mode when you run the above command, which is another indicator.
