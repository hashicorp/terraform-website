---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation (Installer Beta) - RHEL Install Guide"
sidebar_current: "docs-enterprise2-private-installer"
---

# Private Terraform Enterprise Installation (Installer Beta) - RHEL Install Guide

This install guide is specifically for users of Private Terraform Enterprise installing the product on RedHat Enterprise Linux (RHEL).

## Install Recommendations

* RedHat Enterprise Linux version 7.3 or 7.4
* Docker CE or EE version 17.06 or later. These versions are not available in the standard RHEL yum repositories.
   * For Docker CE, you can use the official CentOS docker repository. Instructions are available here: https://docs.docker.com/install/linux/docker-ce/centos/#install-from-a-package.
   * For Docker EE, there are explicit RHEL instructions to follow: https://docs.docker.com/install/linux/docker-ee/rhel/ 
* A properly configured docker storage backend, either:
   * Devicemapper configured for production usage, according to the Docker documentation: https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-direct-lvm-mode-for-production. This configuration requires a second block device available to the system to be used as a thin-pool for Docker. You may need to configure this block device before the host system is booted, depending on the hosting platform.
   * A system capable of using overlay2. The requires at least kernel version 3.10.0-693 and, if XFS is being used, the flag ftype=1. The full documentation on this configuration is at: https://docs.docker.com/storage/storagedriver/overlayfs-driver/


## FAQ:
### Can I use the Docker version in rpm-extras?
We do not recommend doing so. Customers have experienced many issues with the Docker versions in rpm-extras (1.12 and 1.13), primarily memory issues resulting in failed airgap installations. We’ve found that newer Docker versions do not have these problems, and thus we request that version 17.06 or later be used.

### I can only use the versions of Docker available in rpm-extras. What can I do?
If you must use the versions in rpm-extras, you need to be able to support those versions yourself. Be warned, as indicated above, those versions have significant issues running airgapped installation due to memory exhaustion bugs. If you are unable to install the product properly on these versions, we highly suggest you use newer Docker versions.

### When I run the installer, it allows me to download and install Docker CE on RedHat. Can I use that?
Yes, Docker CE is compatible with the current installer; however it is not directly supported by RedHat. You still need to be sure that the storage backend is configured properly as by default, Docker will be using devicemapper in loopback, an entirely unsupported mode.

### Can an installation where `docker info` says that I’m using devicemapper with a loopback file work?
No. This is an installation that docker provides as sample and is not supported by Private Terraform Enterprise due to the significant instability in it. Docker themselves do not suggest using this mode: https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-loop-lvm-mode-for-testing 

### How do I know if an installation is in devicemapper loopback mode?
Run the command `sudo docker info | grep dev/loop`. If there is any output, you’re in devicemapper loopback mode. Docker may also print warning about loopback mode when you run the above command, which is another indicator.
