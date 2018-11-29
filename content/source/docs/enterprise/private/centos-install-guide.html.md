---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installation - CentOS Linux Install Guide"
sidebar_current: "docs-enterprise2-private-installer-centos"
---

# Private Terraform Enterprise Installation - CentOS Install Guide

This install guide is specifically for users of Private Terraform Enterprise installing the product on CentOS Linux.

## Install Recommendations

* CentOS Linux version 7.1611+
* A suitable version of Docker:
   * Docker 1.13.1 (available in the `extras` repository)
   * [Docker CE](https://docs.docker.com/install/linux/docker-ce/centos/) version 17.06 or later.
   * [Docker EE](https://docs.docker.com/install/linux/docker-ee/centos/) version 17.06 or later. 
   * Or you can allow the installer to install Docker for you.
* A properly configured docker storage backend, either:
   * Devicemapper configured for production usage, in accordance with the [Docker documentation](https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-direct-lvm-mode-for-production). This configuration requires a second block device available to the system to be used as a thin-pool for Docker. You may need to configure this block device before the host system is booted, depending on the hosting platform.
   * A system capable of using overlay2. The requires at least kernel version 3.10.0-693 and, if XFS is being used, the flag `ftype=1`. The full documentation on this configuration is on the [Docker site](https://docs.docker.com/storage/storagedriver/overlayfs-driver/).

If you choose to have Docker installed via the install script, ensure that `/etc/docker/daemon.json` is set up correctly, first.  The installer's default configuration sets up the devicemapper driver to use a loopback file, which is explicitly not supported, and the installation script will fail.  Setting up the driver for direct-lvm usage before installation will help ensure a successful installation.

## FAQ:
### Can I use the Docker version in `extras`?
Sure! Just be sure to have at least 1.13.1.

### Can an installation where `docker info` says that I’m using devicemapper with a loopback file work?
No. This is an installation that Docker provides as sample and is not supported by Private Terraform Enterprise due to the significant instability in it. Docker themselves [do not suggest using this mode](https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-loop-lvm-mode-for-testing). 

### How do I know if an installation is in devicemapper loopback mode?
Run the command `docker info | grep dev/loop`. If there is any output, you’re in devicemapper loopback mode. Docker may also print warning about loopback mode when you run the above command, which is another indicator.
