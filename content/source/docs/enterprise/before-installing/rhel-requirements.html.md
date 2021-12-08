---
layout: "enterprise"
page_title: "RHEL Requirements - Installation - Terraform Enterprise"
---

# RHEL Requirements for Terraform Enterprise

When installing Terraform Enterprise on RedHat Enterprise Linux (RHEL), ensure your OS and Docker configuration meet the following requirements.

## Install Requirements

* A [supported version](/docs/enterprise/before-installing/index.html#operating-system-requirements) of RedHat Enterprise Linux.
* One of the following installations of Docker:
  * Docker CE 17.06 or later. Docker CE can either be pre-installed by the operator or installed via our installation script. If Docker CE is pre-installed by the operator, be sure to pass the `no-docker` flag to the installation script to prevent it from trying to install Docker CE again.
  * Docker EE 17.06 or later.
  * Docker 1.13.1 installed via the RHEL Extras repository. Details on how to subscribe to the RHEL Extras repository can be found [here](https://access.redhat.com/solutions/912213).
* Docker configured with the `overlay2` storage driver. This is the default storage driver for the latest Docker installations.

~> **Note:** The `overlay2` storage driver requires kernel version 3.10.0-693 or greater and the `ftype=1` kernel option when using an XFS filesystem. More details regarding the `overlay2` storage driver can be found [here](https://docs.docker.com/storage/storagedriver/overlayfs-driver/).

~> **Note:** The [Docker documentation] (https://docs.docker.com/storage/storagedriver/select-storage-driver/) states that the `devicemapper` storage driver is deprecated and will be removed in a future release. Users of the `devicemapper` storage driver must migrate to `overlay2`.

~> **Note:** Using `docker-1.13.1-84.git07f3374.el7.x86_64` will result in an RPC error as well as 502 errors and inability to use the application.

### Pinning the Docker Version

To pin the version of Docker and prevent an inadvertent upgrade, follow [this guide](https://access.redhat.com/solutions/98873) from RedHat.

### Downgrading the Docker Version

The `yum downgrade` command can be used to downgrade the version of Docker that is installed.

For example, to downgrade from `docker-1.13.1-84.git07f3374.el7.x86_64` to `docker-1.13.1-72.git6f36bd4el8.x86_64` stop the Docker service and execute the following.

```
sudo yum downgrade docker-1.13.1-72.git6f36bd4el7.x86_64 docker-client-1.13.1-72.git6f36bd4el7.x86_64 docker-common-1.13.1-72.git6f36bd4el7.x86_64 docker-rhel-push-plugin-1.13.1-72.git6f36bd4el7.x86_64
```

Afterwards, restart the Docker service and verify the newly installed version using `docker version`.

## FAQ

### Can I use the Docker version in the RHEL Extras repository?

Sure! Just be sure to have at least 1.13.1 and authorization plugins disabled.

### When I run the installer, it allows me to download and install Docker CE on RedHat. Can I use that?

Yes, Docker CE is compatible with Terraform Enterprise. However, it is not directly [supported by RedHat](https://access.redhat.com/articles/2726611).

### Which storage driver should I use?

Please ensure that you are using the `overlay2` storage driver.

### Can an installation where `docker info` says that I’m using devicemapper with a loopback file work?

No. This is an installation that docker provides as sample and is not supported by Terraform Enterprise due to the significant instability in it. Docker themselves do not suggest using [this mode](https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-loop-lvm-mode-for-testing).

### How do I know if an installation is in devicemapper loopback mode?

Run the command `sudo docker info | grep dev/loop`. If there is any output, you’re in devicemapper loopback mode. Docker may also print warning about loopback mode when you run the above command, which is another indicator.
