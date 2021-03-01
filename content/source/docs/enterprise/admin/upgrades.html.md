---
layout: "enterprise"
page_title: "Upgrades - Infrastructure Administration - Terraform Enterprise"
---

# Upgrading

This section explains how to upgrade Terraform Enterprise to a new
version. [Learn more about availability during upgrades here](../system-overview/reliability-availability.html#availability-during-upgrades).

## Online

### Replicated Administration Console

1. From the installer dashboard (`https://<TFE HOSTNAME>:8800/dashboard`),
    click the "Check Now" button; the new version should be recognized.
1. Click "View Update".
1. Review the release notes and then click "Install Update".

### Replicated Command Line Interface

1. Login to a command line terminal of the Terraform Enterprise host machine.
1. Execute the command below to fetch the versions of Terraform Enterprise.
    ```
    replicatedctl app-release ls --fetch
    ```
1. In order to upgrade to the latest version of Terraform Enterprise, execute command below:
   ```
   replicatedctl app-release apply
   ```

   Alternatively, execute the command below to upgrade to a specific version of Terraform Enterprise:

   ```
   replicatedctl app-release apply --sequence "504"
   ```

## Airgapped

### Replicated Administration Console

1. Determine the update path where the installer will look for new `.airgap`
    packages. You can do this from the console settings of your instance
    (`https://<TFE HOSTNAME>:8800/console/settings`) in the field `Update Path`.
1. Download the new `.airgap` package onto the instance and put it into the
    `Update Path` location.
1. From the installer dashboard (`https://<TFE HOSTNAME>:8800/dashboard`) click the
    "Check Now" button; the new version should be recognized.
1. Click "View Update".
1. Review the release notes and then click "Install Update".

### Replicated Command Line Interface

1. Login to a command line terminal of the Terraform Enterprise host machine.
1. Execute the command below and take note on the location from the property `AirgapPackagePath` to upload the desired airgap package into on the Terraform Enterprise host machine:
   
    ```
    replicatedctl params export | grep AirgapPackagePath
    ```

1. Execute the command below to fetch the versions of Terraform Enterprise from the uploaded airgap packages.
   
    ```
    replicatedctl app-release ls --fetch
    ```

1. Execute the command below to list the available versions of Terraform Enterprise:
   
   ```
   replicatedctl app-release ls
   ```

1. In order to upgrade to the latest version of the available airgap packages, execute command below:
   
   ```
   replicatedctl app-release apply
   ```

   Alternatively, execute the command below to upgrade to a specific version of the available airgap packages:

   ```
   replicatedctl app-release apply --sequence "504"
   ```
