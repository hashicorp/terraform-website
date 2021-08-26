---
layout: "enterprise"
page_title: "Upgrades - Infrastructure Administration - Terraform Enterprise"
---

# Upgrading

This section explains how to upgrade Terraform Enterprise to a new
version. [Learn more about availability during upgrades here](../system-overview/reliability-availability.html#availability-during-upgrades).
## Before Upgrade

We strongly recommend creating a backup copy of the storage prior to upgrading your instance. Backup and restore responsibility varies depending on the [operation modes](../system-overview/reliability-availability.html#operation-modes).

## Online

### Replicated Console

1. From the installer dashboard (`https://<TFE HOSTNAME>:8800/dashboard`),
    click the "Check Now" button. Terraform recognizes the new version.
1. Click "View Update".
1. Review the release notes and then click "Install Update".

### Replicated Command Line Interface

1. Connect to the Terraform Enterprise host machine using SSH.
2. Fetch the versions of Terraform Enterprise.
   
    ```
    $ replicatedctl app-release ls --fetch
    ```

3. Upgrade to the latest version of Terraform Enterprise.
   
    ```
    $ replicatedctl app-release apply
    ```

    Alternatively, upgrade to a specific version of Terraform Enterprise.

    ```
    $ replicatedctl app-release apply --sequence "504"
    ```

## Airgapped

### Replicated Console

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

1. Connect to the Terraform Enterprise host machine using SSH.
2. Print the `AirgapPackagePath`.
   
    ```
    $ replicatedctl params export --template '{{.AirgapPackagePath}}'
    ```

3. On the Terraform Enterprise host machine, upload the desired airgap packages into the `AirgapPackagePath`.
4. Fetch the versions of Terraform Enterprise from the uploaded airgap packages.
   
    ```
    $ replicatedctl app-release ls --fetch
    ```

5. List the available versions of airgap packages for the upgrade.
   
    ```
    $ replicatedctl app-release ls
    ```

6. Upgrade to the latest version of the available airgap packages.
   
    ```
    $ replicatedctl app-release apply
    ```

    Alternatively, upgrade to a specific version, using one of the options listed in the output of the previous step.

    ```
    $ replicatedctl app-release apply --sequence "504"
    ```
