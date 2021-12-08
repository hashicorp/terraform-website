---
layout: "enterprise"
page_title: "RHEL Requirements - Installation - Terraform Enterprise"
---

# RHEL Requirements for Terraform Enterprise

When installing Terraform Enterprise on RedHat Enterprise Linux (RHEL), ensure you meet the following requirements.

## Install Requirements

* A [supported version](/docs/enterprise/before-installing/index.html#operating-system-requirements) of RedHat Enterprise Linux.
* A [supported Docker Engine](/docs/enterprise/before-installing/index.html#docker-engine-requirements) configuration.

### Pinning the Docker Version

To pin the version of Docker and prevent an inadvertent upgrade, follow [this guide](https://access.redhat.com/solutions/98873) from RedHat.

### Downgrading the Docker Version

The `yum downgrade` command can be used to downgrade the version of Docker that is installed.

For example, to downgrade from `docker-1.13.1-84.git07f3374.el7.x86_64` to `docker-1.13.1-72.git6f36bd4el8.x86_64` stop the Docker service and execute the following.

```
sudo yum downgrade docker-1.13.1-72.git6f36bd4el7.x86_64 docker-client-1.13.1-72.git6f36bd4el7.x86_64 docker-common-1.13.1-72.git6f36bd4el7.x86_64 docker-rhel-push-plugin-1.13.1-72.git6f36bd4el7.x86_64
```

Afterwards, restart the Docker service and verify the newly installed version using `docker version`.

## Mandatory Configuration

If you opt to use Docker 1.13.1 from RHEL extras, then you must make a change to its default configuration to avoid hitting an out of memory bug.

1. Open `/usr/lib/systemd/system/docker.service`.
1. Remove the line that contains `--authorization-plugin=rhel-push-plugin`.
1. Run `systemctl daemon-reload && systemctl restart docker`.
1. Run `docker info 2> /dev/null | grep Authorization` to verify that there are no authorization plugins active.
   If nothing is printed, your installation is properly configured. If anything is printed, please
   contact support for further assistance.

## FAQ

### Can I use the Docker version in the RHEL Extras repository?

Yes! Just be sure to [modify the default `libseccomp` profile](/docs/enterprise/before-installing/index.html#option-3-docker-engine-using-a-modified-libseccomp-profile).

### When I run the installer, it allows me to download and install Docker CE on RedHat. Can I use that?

Yes, Docker CE is compatible with Terraform Enterprise. However, it is not directly [supported by RedHat](https://access.redhat.com/articles/2726611).

### Which storage driver should I use?

The `overlay2` storage driver.

### Can an installation where `docker info` says that I’m using devicemapper with a loopback file work?

No. This is an installation that docker provides as sample and is not supported by Terraform Enterprise due to the significant instability in it. Docker themselves do not suggest using [this mode](https://docs.docker.com/storage/storagedriver/device-mapper-driver/#configure-loop-lvm-mode-for-testing).

### How do I know if an installation is in devicemapper loopback mode?

Run the command `sudo docker info | grep dev/loop`. If there is any output, you’re in devicemapper loopback mode. Docker may also print warning about loopback mode when you run the above command, which is another indicator.
