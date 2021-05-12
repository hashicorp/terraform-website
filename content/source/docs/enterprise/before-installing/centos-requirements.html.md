---
layout: "enterprise"
page_title: "CentOS Linux Requirements - Installation - Terraform Enterprise"
---

# CentOS Requirements for Terraform Enterprise

When installing Terraform Enterprise on CentOS Linux, ensure your OS and Docker configuration meet the following requirements:

## Install Requirements

* A [supported version](/docs/enterprise/before-installing/index.html#operating-system-requirements) of CentOS.
* One of the following installations of Docker:
  * Docker CE installed via our installation script.
  * Docker EE 17.06 or later. Details for installing Docker EE can be found [here](https://docs.mirantis.com/containers/v3.1/mcr-deployment-guide/mcr-linux/rhel.html).
  * Docker 1.13.1 installed via the Extras Packages for Enterprise Linux repository. Details on how to subscribe to the Extras Packages for Enterprise Linux repository can be found [here](https://fedoraproject.org/wiki/EPEL).
* Docker configured with the `overlay2` storage driver. This is the default storage driver for the latest Docker installations.

~> **Note:** The `overlay2` storage driver requires kernel version 3.10.0-693 or greater and the `ftype=1` kernel option when using an XFS filesystem. More details regarding the `overlay2` storage driver can be found [here](https://docs.docker.com/storage/storagedriver/overlayfs-driver).

~> **Note:** The [Docker documentation] (https://docs.docker.com/storage/storagedriver/select-storage-driver/) states that the `devicemapper` storage driver is deprecated and will be removed in a future release. Users of the `devicemapper` storage driver must migrate to `overlay2`.

## FAQ

### Can I use the Docker version in the Extra Packages for Enterprise Linux repository?

Sure! Just be sure to have at least 1.13.1.

### Can an installation where `docker info` says that I’m using devicemapper with a loopback file work?

No. This is an installation that Docker provides as sample and is not supported by Terraform Enterprise due to the significant instability in it. Docker themselves [do not suggest using this mode](https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-loop-lvm-mode-for-testing).

### How do I know if an installation is in devicemapper loopback mode?

Run the command `docker info | grep dev/loop`. If there is any output, you’re in devicemapper loopback mode. Docker may also print warning about loopback mode when you run the above command, which is another indicator.
